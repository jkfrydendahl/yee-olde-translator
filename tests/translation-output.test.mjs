import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const asModule = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
// Replace only the SDK transport; exercise the actual client and endpoint without API calls.
const sdkUrl = asModule(`
  let completion;
  export const requests = [];
  export function respondWith(value) { completion = value; }
  export default class OpenAI {
    constructor() {
      this.chat = { completions: { create: async request => {
        requests.push(request);
        if (completion instanceof Error) throw completion;
        return completion;
      } } };
    }
  }
`);
const sdk = await import(sdkUrl);
const clientSource = await readFile(new URL('../lib/openai.js', import.meta.url), 'utf8');
assert.ok(clientSource.includes("from 'openai'"));
const clientUrl = asModule(clientSource.replace("from 'openai'", `from '${sdkUrl}'`));
const { callOpenAI } = await import(clientUrl);

function respond(content, finishReason = 'stop') {
  sdk.respondWith({ choices: [{ finish_reason: finishReason, message: { content } }] });
}

test('keeps a legitimate coffee paragraph and the royal ending despite source-word overlap', async () => {
  const prose = 'Outrage upon the empty cup! We declare Our need.\n\nLet the royal kitchen hear Our need: bring forth the comforting draught, for We have need of coffee.\n\nSo it is written, so shall it be done.';
  respond(prose);
  assert.equal(await callOpenAI('Translate the source.', { originalInput: 'I Need Coffee.' }), prose);
});

test('keeps filenames and the final prohibition against deletion', async () => {
  const prose = 'Hear me, good keeper! Bestow a new title upon the treasured record.\n\nPlease rename report.txt to report-final.txt with care; do not delete it, for its words must remain intact!';
  respond(prose);
  assert.equal(await callOpenAI('Translate the source.', { originalInput: 'Please rename report.txt to report-final.txt. Do not delete it.' }), prose);
});

test('preserves dialogue containing phrases that used to trigger follow-up removal', async () => {
  const prose = 'The hall fell silent.\n\nThe steward cried, "Would you like coffee?" His lord replied, "If you like, I can provide a cup myself!"\n\nThus ended the contest of hospitality.';
  respond(prose);
  assert.equal(await callOpenAI('Translate the source.'), prose);
});

test('preserves final AI/computer questions in Italian and Portuguese', async () => {
  const samples = [
    'La mia carrozza senza destrieri attende nuova forza, mentre lo strumento incantato non raggiunge la rete dei messaggi.\n\nPotrà aiutarmi l’ingegno artificiale che dimora nella mia macchina da calcolo?',
    'Minha carruagem sem cavalos aguarda nova energia, mas o engenho encantado não alcança a rede de mensagens.\n\nPoderá ajudar-me o entendimento artificial que habita minha máquina de calcular?'
  ];
  for (const prose of samples) {
    respond(prose);
    assert.equal(await callOpenAI('Translate the source.'), prose);
  }
});

test('only trims outer whitespace and retains internal paragraphs verbatim', async () => {
  const prose = 'O, hvilken nød!\n\nVi behøver kaffe!\n\nSå er det skrevet, så skal det ske.';
  respond(` \n${prose}\n `);
  assert.equal(await callOpenAI('Translate the source.'), prose);
});

test('rejects token-limit truncation rather than returning a partial translation', async t => {
  t.mock.method(console, 'error', () => {});
  respond('The carriage awaits its power, but...', 'length');
  await assert.rejects(callOpenAI('Translate the source.'), { code: 'translation_truncated' });
});

test('retains the agreed Terra/low request settings', async () => {
  respond('Hark!');
  await callOpenAI('Translate the source.');
  assert.deepEqual(sdk.requests.at(-1), {
    model: 'gpt-6.1-terra',
    messages: [{ role: 'user', content: 'Translate the source.' }],
    reasoning_effort: 'low',
    max_completion_tokens: 2000
  });
});

const promptsSource = await readFile(new URL('../lib/prompts.js', import.meta.url), 'utf8');
const endpointSource = await readFile(new URL('../api/translate.js', import.meta.url), 'utf8');
const endpointUrl = asModule(endpointSource
  .replace("'../lib/openai.js'", JSON.stringify(clientUrl))
  .replace("'../lib/prompts.js'", JSON.stringify(asModule(promptsSource))));
const { default: handler } = await import(endpointUrl);

async function requestTranslation(content, finishReason) {
  respond(content, finishReason);
  const previousKey = process.env.OPENAI_API_KEY;
  process.env.OPENAI_API_KEY = 'mock-transport-only';
  const response = {
    setHeader() {},
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; }
  };
  try {
    await handler({ method: 'POST', headers: {}, body: {
      text: 'My car needs charging. Can the AI on my computer help?',
      style: 'medieval', language: 'it'
    } }, response);
  } finally {
    if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousKey;
  }
  return response;
}

test('endpoint returns complete multilingual prose unchanged', async () => {
  const prose = 'La carrozza attende nuova forza.\n\nPotrà aiutarmi l’ingegno artificiale della mia macchina da calcolo?';
  const response = await requestTranslation(prose, 'stop');
  assert.equal(response.statusCode, 200);
  assert.equal(response.body.translation, prose);
});

test('endpoint reports incomplete generation without exposing a partial result as success', async t => {
  t.mock.method(console, 'error', () => {});
  const response = await requestTranslation('La carrozza attende...', 'length');
  assert.equal(response.statusCode, 502);
  assert.equal(response.body.error, 'Incomplete translation');
  assert.equal(response.body.translation, undefined);
});
