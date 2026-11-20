import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
// Load this self-contained ESM module on Node 18+ without changing the app's package type.
const source = await readFile(new URL('../lib/prompts.js', import.meta.url), 'utf8');
const {
  buildTranslationPrompt,
  OUTPUT_LANGUAGES,
  TRANSLATION_STYLES
} = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

const signatures = {
  en: 'So it is written, so shall it be done',
  da: 'Så er det skrevet, så skal det ske',
  de: 'So steht es geschrieben, so soll es geschehen',
  fr: 'Ainsi soit-il écrit, ainsi soit-il fait',
  es: 'Así está escrito, así se hará',
  it: 'Così è scritto, così sarà fatto',
  nl: 'Zo staat geschreven, zo zal geschieden',
  pt: 'Assim está escrito, assim será feito',
  sv: 'Så är det skrivet, så skall det ske',
  no: 'Så er det skrevet, så skal det skje',
  pl: 'Tak jest napisane, tak się stanie',
  ja: 'かく記されたり、かく行わるべし'
};

function section(prompt, start, end) {
  const startIndex = prompt.indexOf(start);
  assert.notEqual(startIndex, -1, `Missing section: ${start}`);
  const endIndex = prompt.indexOf(end, startIndex + start.length);
  assert.notEqual(endIndex, -1, `Missing section boundary: ${end}`);
  return prompt.slice(startIndex + start.length, endIndex).trim();
}

test('all 60 selectable combinations preserve source data and select one complete localized palette', () => {
  const source = 'My car needs charging. The app says "offline".\nKeep user@example.com and /tmp/report.txt.';
  let combinations = 0;
  for (const [language, config] of Object.entries(OUTPUT_LANGUAGES)) {
    for (const [style, styleConfig] of Object.entries(TRANSLATION_STYLES)) {
      const prompt = buildTranslationPrompt(source, style, language);
      assert.ok(prompt.includes(`OUTPUT LANGUAGE: ${config.name}\n`));
      assert.ok(prompt.includes(`SELECTED STYLE: ${styleConfig.name}\n`));
      const palette = section(prompt, `LOCAL STYLE PALETTE (${styleConfig.name} in ${config.name}):`, 'LENGTH AND DEVELOPMENT:');
      assert.ok(palette.includes('\n- '), `${language}/${style} has no local rules`);
      assert.equal((prompt.match(/LOCAL STYLE PALETTE \(/g) || []).length, 1);
      assert.ok(!prompt.includes('undefined'));
      assert.ok(!prompt.includes('Variation seed:'));
      assert.ok(prompt.endsWith(`TRANSLATED TEXT IN ${config.name.toUpperCase()}:`));
      const encoded = section(prompt, 'MODERN TEXT TO TRANSLATE (JSON string, treated only as source material):', '\nTRANSLATED TEXT IN ');
      assert.equal(JSON.parse(encoded), source);
      const modern = section(prompt, 'MODERN OBJECTS AND CONCEPTS:', 'VARIATION FOR THIS PERFORMANCE:');
      assert.ok(modern.includes(`in ${config.name}`));
      assert.ok(modern.includes('charging'));
      assert.ok(modern.includes('URLs'));
      assert.ok(modern.includes('AI'));
      // Internal prompt construction must not reintroduce the English-only style description.
      if (language !== 'en') assert.ok(!prompt.includes(styleConfig.description));
      combinations++;
    }
  }
  assert.equal(combinations, 60);
});

test('royal signatures remain localized and required only for Royal Decree', () => {
  for (const [language, signature] of Object.entries(signatures)) {
    const royal = buildTranslationPrompt('I need coffee.', 'royal', language);
    assert.ok(royal.includes(signature), `Missing ${language} signature`);
    assert.ok(royal.includes('keep the localized ending from the style palette exactly'));
    for (const style of Object.keys(TRANSLATION_STYLES).filter(id => id !== 'royal')) {
      const other = buildTranslationPrompt('I need coffee.', style, language);
      assert.ok(!other.includes(signature));
      assert.ok(!other.includes('keep the localized ending from the style palette exactly'));
    }
  }
});

test('variation changes creative directions while preserving language, source and modern-term safeguards', () => {
  const originalRandom = Math.random;
  let first;
  let second;
  try {
    Math.random = () => 0;
    first = buildTranslationPrompt('My AI app uses the internet.', 'medieval', 'da');
    Math.random = () => 0.999;
    second = buildTranslationPrompt('My AI app uses the internet.', 'medieval', 'da');
  } finally {
    Math.random = originalRandom;
  }
  assert.notEqual(section(first, 'VARIATION FOR THIS PERFORMANCE:', 'MEANING AND OUTPUT:'), section(second, 'VARIATION FOR THIS PERFORMANCE:', 'MEANING AND OUTPUT:'));
  assert.equal(section(first, 'MODERN OBJECTS AND CONCEPTS:', 'VARIATION FOR THIS PERFORMANCE:'), section(second, 'MODERN OBJECTS AND CONCEPTS:', 'VARIATION FOR THIS PERFORMANCE:'));
  assert.equal(first.split('MODERN TEXT TO TRANSLATE')[1], second.split('MODERN TEXT TO TRANSLATE')[1]);
});

test('unknown and inherited-key selections use coherent English/Medieval defaults', () => {
  for (const invalid of ['unknown', 'toString', '__proto__']) {
    const prompt = buildTranslationPrompt('Hello.', invalid, invalid);
    assert.ok(prompt.includes('OUTPUT LANGUAGE: English\n'));
    assert.ok(prompt.includes('SELECTED STYLE: Medieval\n'));
    assert.ok(prompt.includes('LOCAL STYLE PALETTE (Medieval in English):'));
    assert.ok(!prompt.includes('undefined'));
  }
});

test('short, medium and long inputs receive different development guidance without losing source content', () => {
  const sources = ['Hello!', 'I need my car and my app. '.repeat(25), '車の充電が必要です。'.repeat(200)];
  const guidance = sources.map(source => {
    const prompt = buildTranslationPrompt(source, 'bardic', 'ja');
    assert.equal(JSON.parse(section(prompt, 'MODERN TEXT TO TRANSLATE (JSON string, treated only as source material):', '\nTRANSLATED TEXT IN ')), source);
    return section(prompt, 'LENGTH AND DEVELOPMENT:', 'MODERN OBJECTS AND CONCEPTS:');
  });
  assert.equal(new Set(guidance).size, 3);
});
