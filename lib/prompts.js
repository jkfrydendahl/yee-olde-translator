/**
 * Translation Prompt Templates
 * Adapted from Storysmith's prompts pattern
 */

/**
 * Available translation styles
 */
/**
 * Available output languages
 */
export const OUTPUT_LANGUAGES = {
  en: { name: 'English', emoji: '🇬🇧' },
  da: { name: 'Danish', emoji: '🇩🇰' },
  de: { name: 'German', emoji: '🇩🇪' },
  fr: { name: 'French', emoji: '🇫🇷' },
  es: { name: 'Spanish', emoji: '🇪🇸' },
  it: { name: 'Italian', emoji: '🇮🇹' },
  nl: { name: 'Dutch', emoji: '🇳🇱' },
  pt: { name: 'Portuguese', emoji: '🇵🇹' },
  sv: { name: 'Swedish', emoji: '🇸🇪' },
  no: { name: 'Norwegian', emoji: '🇳🇴' },
  pl: { name: 'Polish', emoji: '🇵🇱' },
  ja: { name: 'Japanese', emoji: '🇯🇵' }
};

export const TRANSLATION_STYLES = {
  medieval: {
    name: 'Medieval',
    description: 'Generic pseudo-medieval English with thees and thous',
    emoji: '🏰'
  },
  shakespearean: {
    name: 'Shakespearean',
    description: 'Flowery Elizabethan prose worthy of the Bard himself',
    emoji: '🎭'
  },
  chaucerian: {
    name: 'Chaucerian',
    description: 'Middle English style with archaic spellings',
    emoji: '📜'
  },
  royal: {
    name: 'Royal Decree',
    description: 'Pompous proclamations fit for a monarch',
    emoji: '👑'
  },
  bardic: {
    name: 'Bardic',
    description: 'Dramatic storytelling voice of a traveling bard',
    emoji: '🎵'
  }
};

/**
 * Build the translation prompt based on style
 * @param {string} text - The modern text to translate
 * @param {string} style - The translation style to use
 * @returns {string} - The complete prompt
 */
export function buildTranslationPrompt(text, style = 'medieval', language = 'en') {
  const styleConfig = TRANSLATION_STYLES[style] || TRANSLATION_STYLES.medieval;
  const langConfig = OUTPUT_LANGUAGES[language] || OUTPUT_LANGUAGES.en;
  
  // Generate a variation seed for more diverse outputs (from Storysmith pattern)
  const variationSeed = Math.floor(Math.random() * 9000) + 1000;

  // Language-specific archaic style instructions
  const languageArchaicRules = {
    en: {
      medieval: `
- Replace "you" with "thou/thee/ye" appropriately
- Use "art" instead of "are", "doth" instead of "does"
- Add "eth" or "est" endings to verbs (speaketh, runnest)
- Include interjections: Forsooth!, Hark!, Verily!, Prithee!, Marry!
- Replace common words: very → most, hello → well met, goodbye → fare thee well`,
      shakespearean: `
- Channel the dramatic flair of William Shakespeare
- Use elaborate metaphors and poetic comparisons
- Include rhetorical questions and dramatic asides
- Reference nature, celestial bodies, and classical mythology
- Employ iambic rhythms where possible
- Add "O!" exclamations and theatrical pauses`,
      chaucerian: `
- Use Middle English-style spellings (olde, faire, grete, swich)
- Include "ywis" (certainly), "anon" (soon), "eke" (also)
- Replace "gh" sounds creatively (night → nyght)
- Use "hath" and "doth" liberally
- Add pilgrim or traveler references when fitting`,
      royal: `
- Write as if issuing a royal proclamation
- Use the royal "We" instead of "I"
- Include phrases like "by royal decree", "it is Our will"
- Add formal titles and honorifics
- End with "So it is written, so shall it be done"`,
      bardic: `
- Write as a dramatic storyteller or minstrel
- Use vivid, theatrical descriptions
- Include dramatic pauses indicated by "..."
- Reference epic tales and legendary heroes
- Add musical or rhythmic cadence to the prose`
    },
    da: {
      medieval: `
- Brug "I" (formelt) og "Eder" i stedet for "du/dig"
- Anvend gammeldanske vendinger: "sandelig", "forvist", "visselig"
- Brug inversionsordstilling (verbet før subjektet)
- Inkluder udråb: "Hør!", "Ved Gud!", "Sandelig!", "I sandhed!"
- Brug ældre ord: meget → såre, hej → vær hilset, farvel → far vel`,
      shakespearean: `
- Kanaliser Holbergs og Oehlenschlägers dramatiske stil
- Brug elaborerede metaforer og poetiske sammenligninger
- Inkluder retoriske spørgsmål og dramatiske sidebemærkninger
- Referer til naturen, himmellegemer og nordisk mytologi
- Tilføj "O!" udråb og teatralske pauser`,
      chaucerian: `
- Brug middelalderlige danske stavemåder (aff, haffue, oc)
- Inkluder gammeldanske ord: "thi" (derfor), "fordi at", "oc" (og)
- Brug "haffuer" og "giøre" i ældre stavemåder
- Tilføj pilgrim- eller rejsende-referencer når passende`,
      royal: `
- Skriv som et kongeligt dekret
- Brug det royale "Vi" i stedet for "jeg"
- Inkluder fraser som "ved kongelig befaling", "det er Vor vilje"
- Tilføj formelle titler og æresbevisninger
- Afslut med "Så er det skrevet, så skal det ske"`,
      bardic: `
- Skriv som en dramatisk fortæller eller skjald
- Brug levende, teatralske beskrivelser
- Inkluder dramatiske pauser markeret med "..."
- Referer til nordiske sagaer og legendariske helte
- Tilføj musikalsk eller rytmisk kadence til prosaen`
    },
    de: {
      medieval: `
- Verwende "Ihr" und "Euch" statt "du/Sie"
- Nutze altertümliche Verbformen: "sprechet", "gehet", "sehet"
- Verwende "ward" statt "wurde", "allda" statt "dort"
- Füge Ausrufe hinzu: "Fürwahr!", "Wohlan!", "Höret!", "Wahrlich!"
- Ersetze Wörter: sehr → gar, hallo → seid gegrüßt, tschüss → gehabt Euch wohl`,
      shakespearean: `
- Kanalisiere den dramatischen Stil von Goethe und Schiller
- Verwende ausgeschmückte Metaphern und poetische Vergleiche
- Füge rhetorische Fragen und dramatische Beiseitesprechen ein
- Referenziere Natur, Himmelskörper und klassische Mythologie
- Füge "O!" Ausrufe und theatralische Pausen hinzu`,
      chaucerian: `
- Verwende mittelhochdeutsche Schreibweisen (auff, bey, seyn)
- Nutze "dieweil" (während), "allso" (so), "itzund" (jetzt)
- Verwende altertümliche Endungen: -et, -est an Verben
- Füge Pilger- oder Wanderer-Referenzen hinzu wenn passend`,
      royal: `
- Schreibe als königliche Proklamation
- Verwende das königliche "Wir" statt "ich"
- Füge Phrasen hinzu wie "von königlicher Gnaden", "es ist Unser Wille"
- Füge formelle Titel und Ehrenbezeigungen hinzu
- Ende mit "So steht es geschrieben, so soll es geschehen"`,
      bardic: `
- Schreibe als dramatischer Geschichtenerzähler oder Barde
- Verwende lebhafte, theatralische Beschreibungen
- Füge dramatische Pausen mit "..." ein
- Referenziere epische Erzählungen und legendäre Helden
- Füge musikalische oder rhythmische Kadenz hinzu`
    },
    fr: {
      medieval: `
- Utilisez "vous" au lieu de "tu" (vouvoiement formel)
- Employez des formes verbales archaïques: "oyez", "point" (ne...point)
- Utilisez "moult" au lieu de "très", "céans" au lieu de "ici"
- Incluez des exclamations: "Oyez!", "Par ma foi!", "Tudieu!", "Morbleu!"
- Remplacez: bonjour → bien le bonjour, adieu → à Dieu vat`,
      shakespearean: `
- Canalisez le style dramatique de Molière et Racine
- Utilisez des métaphores élaborées et comparaisons poétiques
- Incluez des questions rhétoriques et apartés dramatiques
- Référencez la nature, les corps célestes et la mythologie classique
- Ajoutez des exclamations "Ô!" et des pauses théâtrales`,
      chaucerian: `
- Utilisez des orthographes médiévales (oy, très → moult, roi → roy)
- Incluez "icelui" (celui-ci), "ains" (mais), "oncques" (jamais)
- Utilisez "avoit" et "estoit" (formes anciennes)
- Ajoutez des références de pèlerin ou voyageur quand approprié`,
      royal: `
- Écrivez comme un décret royal
- Utilisez le "Nous" royal au lieu de "je"
- Incluez des phrases comme "par décret royal", "telle est Notre volonté"
- Ajoutez des titres formels et honorifiques
- Terminez par "Ainsi soit-il écrit, ainsi soit-il fait"`,
      bardic: `
- Écrivez comme un conteur dramatique ou troubadour
- Utilisez des descriptions vivantes et théâtrales
- Incluez des pauses dramatiques avec "..."
- Référencez des contes épiques et héros légendaires
- Ajoutez une cadence musicale ou rythmique à la prose`
    },
    es: {
      medieval: `
- Usa "vos" y "vuestra merced" en lugar de "tú/usted"
- Emplea formas verbales arcaicas: "habéis", "sois", "tenéis"
- Usa "muy" → "harto", "aquí" → "aqueste lugar"
- Incluye exclamaciones: "¡Pardiez!", "¡Vive Dios!", "¡A fe mía!", "¡Oíd!"
- Reemplaza: hola → bien hallado, adiós → id con Dios`,
      shakespearean: `
- Canaliza el estilo dramático de Calderón y Lope de Vega
- Usa metáforas elaboradas y comparaciones poéticas
- Incluye preguntas retóricas y apartes dramáticos
- Referencia la naturaleza, cuerpos celestes y mitología clásica
- Añade exclamaciones "¡Oh!" y pausas teatrales`,
      chaucerian: `
- Usa ortografías medievales (fazer, fablar, grand)
- Incluye "aqueste" (este), "maguer" (aunque), "asaz" (bastante)
- Usa "avía" y "fizo" (formas antiguas)
- Añade referencias de peregrino o viajero cuando sea apropiado`,
      royal: `
- Escribe como un decreto real
- Usa el "Nos" real en lugar de "yo"
- Incluye frases como "por decreto real", "es Nuestra voluntad"
- Añade títulos formales y honoríficos
- Termina con "Así está escrito, así se hará"`,
      bardic: `
- Escribe como un narrador dramático o juglar
- Usa descripciones vívidas y teatrales
- Incluye pausas dramáticas con "..."
- Referencia cuentos épicos y héroes legendarios
- Añade cadencia musical o rítmica a la prosa`
    },
    it: {
      medieval: `
- Usa "voi" invece di "tu/Lei"
- Impiega forme verbali arcaiche: "havete", "siete", "diceste"
- Usa "assai" invece di "molto", "ivi" invece di "là"
- Includi esclamazioni: "Perdinci!", "Per Bacco!", "Orsù!", "Udite!"
- Sostituisci: ciao → ben trovato, addio → a Dio vi raccomando`,
      shakespearean: `
- Canalizza lo stile drammatico di Dante e dell'Ariosto
- Usa metafore elaborate e confronti poetici
- Includi domande retoriche e a parte drammatici
- Fai riferimento alla natura, corpi celesti e mitologia classica
- Aggiungi esclamazioni "O!" e pause teatrali`,
      chaucerian: `
- Usa ortografie medievali (havere, essere, facto)
- Includi "anco" (anche), "però" (perciò), "onde" (da cui)
- Usa "avea" e "facea" (forme antiche)
- Aggiungi riferimenti a pellegrini o viaggiatori quando appropriato`,
      royal: `
- Scrivi come un decreto reale
- Usa il "Noi" reale invece di "io"
- Includi frasi come "per regio decreto", "è Nostra volontà"
- Aggiungi titoli formali e onorificenze
- Termina con "Così è scritto, così sarà fatto"`,
      bardic: `
- Scrivi come un narratore drammatico o cantastorie
- Usa descrizioni vivide e teatrali
- Includi pause drammatiche con "..."
- Fai riferimento a racconti epici ed eroi leggendari
- Aggiungi cadenza musicale o ritmica alla prosa`
    },
    nl: {
      medieval: `
- Gebruik "gij" en "u" in plaats van "je/jij"
- Gebruik archaïsche werkwoordsvormen: "zijt", "hebt", "gaet"
- Gebruik "zeer" → "gansch", "hier" → "alhier"
- Voeg uitroepen toe: "Voorwaar!", "Hoort!", "Bij God!", "Welaan!"
- Vervang: hallo → wees gegroet, dag → vaart wel`,
      shakespearean: `
- Kanaliseer de dramatische stijl van Vondel en Hooft
- Gebruik uitgebreide metaforen en poëtische vergelijkingen
- Voeg retorische vragen en dramatische terzijdes toe
- Verwijs naar natuur, hemellichamen en klassieke mythologie
- Voeg "O!" uitroepen en theatrale pauzes toe`,
      chaucerian: `
- Gebruik middeleeuwse spellingen (aen, ende, waer)
- Gebruik "mitsgaders" (samen met), "alwaer" (waar), "dies" (daarom)
- Gebruik "hadde" en "dede" (oude vormen)
- Voeg pelgrim- of reizigersreferenties toe waar gepast`,
      royal: `
- Schrijf als een koninklijk decreet
- Gebruik het koninklijke "Wij" in plaats van "ik"
- Voeg zinnen toe zoals "bij koninklijk besluit", "het is Onze wil"
- Voeg formele titels en eretitels toe
- Eindig met "Zo staat geschreven, zo zal geschieden"`,
      bardic: `
- Schrijf als een dramatische verteller of minstreel
- Gebruik levendige, theatrale beschrijvingen
- Voeg dramatische pauzes toe met "..."
- Verwijs naar epische verhalen en legendarische helden
- Voeg muzikale of ritmische cadans toe aan het proza`
    },
    pt: {
      medieval: `
- Use "vós" em vez de "tu/você"
- Empregue formas verbais arcaicas: "haveis", "sois", "fazeis"
- Use "mui" em vez de "muito", "aqui" → "neste lugar"
- Inclua exclamações: "Pardiez!", "Por Deus!", "Ora pois!", "Ouvi!"
- Substitua: olá → bem-vindo sejais, adeus → ide com Deus`,
      shakespearean: `
- Canalize o estilo dramático de Camões e Gil Vicente
- Use metáforas elaboradas e comparações poéticas
- Inclua perguntas retóricas e apartes dramáticos
- Referencie a natureza, corpos celestes e mitologia clássica
- Adicione exclamações "Ó!" e pausas teatrais`,
      chaucerian: `
- Use ortografias medievais (fazer → fez, grande → gram)
- Inclua "outrossim" (também), "porém" (por isso), "ca" (porque)
- Use "havia" → "houvera" (formas antigas)
- Adicione referências de peregrino ou viajante quando apropriado`,
      royal: `
- Escreva como um decreto real
- Use o "Nós" real em vez de "eu"
- Inclua frases como "por decreto real", "é Nossa vontade"
- Adicione títulos formais e honoríficos
- Termine com "Assim está escrito, assim será feito"`,
      bardic: `
- Escreva como um narrador dramático ou trovador
- Use descrições vívidas e teatrais
- Inclua pausas dramáticas com "..."
- Referencie contos épicos e heróis lendários
- Adicione cadência musical ou rítmica à prosa`
    },
    sv: {
      medieval: `
- Använd "I" och "Eder" istället för "du/dig"
- Använd ålderdomliga verbformer: "haven", "ären", "gån"
- Använd "såre" istället för "mycket", "härstädes" istället för "här"
- Inkludera utrop: "Sannerligen!", "Hören!", "Vid Gud!", "Förvisso!"
- Ersätt: hej → var hälsad, hejdå → faren väl`,
      shakespearean: `
- Kanalisera den dramatiska stilen från Strindberg och Shakespeare-översättningar
- Använd utarbetade metaforer och poetiska jämförelser
- Inkludera retoriska frågor och dramatiska sidoreplik
- Referera till naturen, himlakroppar och nordisk mytologi
- Lägg till "O!" utrop och teatrala pauser`,
      chaucerian: `
- Använd medeltida stavningar (aff, haffua, och → oc)
- Inkludera "förty" (därför), "ock" (också), "thenne" (denne)
- Använd "hafwer" och "gör" i äldre stavningar
- Lägg till pilgrim- eller resandereferenser när det passar`,
      royal: `
- Skriv som ett kungligt dekret
- Använd det kungliga "Vi" istället för "jag"
- Inkludera fraser som "enligt kunglig befallning", "det är Vår vilja"
- Lägg till formella titlar och hedersbetygelser
- Avsluta med "Så är det skrivet, så skall det ske"`,
      bardic: `
- Skriv som en dramatisk berättare eller skald
- Använd livfulla, teatrala beskrivningar
- Inkludera dramatiska pauser med "..."
- Referera till nordiska sagor och legendariska hjältar
- Lägg till musikalisk eller rytmisk kadens till prosan`
    },
    no: {
      medieval: `
- Bruk "I" og "Eder" i stedet for "du/deg"
- Bruk gammelnorske vendinger: "sannelig", "forvisst", "visselig"
- Bruk inversjon (verbet før subjektet)
- Inkluder utrop: "Hør!", "Ved Gud!", "Sannelig!", "I sannhet!"
- Erstatt: hei → vær hilset, ha det → far vel`,
      shakespearean: `
- Kanaliser Ibsens og Bjørnsons dramatiske stil
- Bruk utarbeidede metaforer og poetiske sammenligninger
- Inkluder retoriske spørsmål og dramatiske sidebemerkninger
- Referer til naturen, himmellegemer og norrøn mytologi
- Legg til "O!" utrop og teatralske pauser`,
      chaucerian: `
- Bruk middelalderske norske stavemåter (aff, haffue, oc)
- Inkluder gammelnorske ord: "thi" (derfor), "fordi at", "oc" (og)
- Bruk "haffuer" og "giøre" i eldre stavemåter
- Legg til pilgrim- eller reisendreferanser når passende`,
      royal: `
- Skriv som et kongelig dekret
- Bruk det kongelige "Vi" i stedet for "jeg"
- Inkluder fraser som "ved kongelig befaling", "det er Vår vilje"
- Legg til formelle titler og æresbevisninger
- Avslutt med "Så er det skrevet, så skal det skje"`,
      bardic: `
- Skriv som en dramatisk forteller eller skald
- Bruk levende, teatralske beskrivelser
- Inkluder dramatiske pauser markert med "..."
- Referer til norrøne sagaer og legendariske helter
- Legg til musikalsk eller rytmisk kadens til prosaen`
    },
    pl: {
      medieval: `
- Używaj "wy" i "waszmość" zamiast "ty"
- Stosuj archaiczne formy czasowników: "rzekł", "iść" → "pójść"
- Używaj "wielce" zamiast "bardzo", "tutaj" → "w tem miejscu"
- Dołącz wykrzyknienia: "Zaiste!", "Słuchajcie!", "Na Boga!", "Zaprawdę!"
- Zamień: cześć → bądź pozdrowion, do widzenia → bywaj zdrów`,
      shakespearean: `
- Kanalizuj dramatyczny styl Mickiewicza i Słowackiego
- Używaj rozbudowanych metafor i poetyckich porównań
- Dołącz pytania retoryczne i dramatyczne uwagi na stronie
- Odwołuj się do natury, ciał niebieskich i słowiańskiej mitologii
- Dodaj wykrzyknienia "O!" i teatralne pauzy`,
      chaucerian: `
- Używaj średniowiecznej pisowni (rzecz → rzec, wielki → wielgi)
- Dołącz "albowiem" (ponieważ), "tedy" (więc), "jeno" (tylko)
- Używaj "był" → "bywał" (formy archaiczne)
- Dodaj odniesienia do pielgrzymów lub podróżnych gdy stosowne`,
      royal: `
- Pisz jak królewski dekret
- Używaj królewskiego "My" zamiast "ja"
- Dołącz frazy jak "dekretem królewskim", "taka jest Nasza wola"
- Dodaj formalne tytuły i honory
- Zakończ "Tak jest napisane, tak się stanie"`,
      bardic: `
- Pisz jak dramatyczny gawędziarz lub bard
- Używaj żywych, teatralnych opisów
- Dołącz dramatyczne pauzy z "..."
- Odwołuj się do epickich opowieści i legendarnych bohaterów
- Dodaj muzyczną lub rytmiczną kadencję do prozy`
    },
    ja: {
      medieval: `
- 「〜候」「〜ござる」「〜でおじゃる」などの古語を使用
- 「そなた」「おぬし」「拙者」などの古い人称代名詞を使用
- 「まこと」「げに」「いかにも」などの強調表現を追加
- 感嘆詞を含める：「おお！」「聞けい！」「まことに！」「いざ！」
- 文末に「〜なり」「〜じゃ」「〜ぞ」などを使用`,
      shakespearean: `
- 歌舞伎や能の劇的な様式を取り入れる
- 華麗な比喩と詩的な表現を使用
- 修辞的な問いかけと劇的な独白を含める
- 自然、天体、日本の神話に言及する
- 「ああ！」という感嘆と劇的な間を追加`,
      chaucerian: `
- 古文の表記を使用（〜けり、〜たり、〜なむ）
- 「さりながら」（しかし）、「いとど」（ますます）を含める
- 「侍り」「おはす」などの敬語の古形を使用
- 旅人や巡礼者への言及を適宜追加`,
      royal: `
- 勅令のように書く
- 「朕」または「我」を使用
- 「勅命により」「これ朕の御意なり」などの表現を含める
- 正式な称号と敬称を追加
- 「かく記されたり、かく行わるべし」で終える`,
      bardic: `
- 語り部や吟遊詩人のように書く
- 鮮やかで劇的な描写を使用
- 「……」で示される劇的な間を含める
- 伝説の英雄や叙事詩に言及する
- 散文に音楽的またはリズミカルな抑揚を追加`
    }
  };

  // Get the language-specific rules, or fall back to a generic instruction for unsupported languages
  const langRules = languageArchaicRules[language];
  const styleRules = langRules ? langRules[style] || langRules.medieval : null;
  
  // Build the language instruction
  let languageSection = '';
  if (language !== 'en') {
    languageSection = `\n\nOUTPUT LANGUAGE: ${langConfig.name}
Write the ENTIRE translation in ${langConfig.name}.`;
  }

  // Use language-specific rules if available, otherwise provide generic guidance
  const rulesSection = styleRules 
    ? `\n\nSTYLE RULES (${styleConfig.name} in ${langConfig.name}):${styleRules}`
    : language !== 'en'
      ? `\n\nSTYLE RULES (${styleConfig.name} adapted for ${langConfig.name}):
- Apply the theatrical, archaic style conventions appropriate for ${langConfig.name}
- Use old-fashioned ${langConfig.name} vocabulary, grammar, and expressions
- Include period-appropriate exclamations and formal address forms
- Make the text sound like it comes from a historical ${langConfig.name} text
- Be dramatically verbose and theatrical in ${langConfig.name}`
      : `\n\nSTYLE RULES (${styleConfig.name}):${languageArchaicRules.en[style] || languageArchaicRules.en.medieval}`;

  return `You are Ye Olde Translator, a delightfully theatrical engine that transforms modern speech into dramatically overwrought pseudo-${styleConfig.name} style.

Your task: Transform the following modern text into ${styleConfig.description.toLowerCase()}. Be verbose, theatrical, and delightfully unnecessary. Every mundane statement should become an elaborate proclamation!${languageSection}
${rulesSection}

GENERAL RULES:
- Maintain the original meaning while maximizing theatrical effect
- Extend simple statements into elaborate proclamations
- Use archaic vocabulary and elaborate metaphors
- Be consistent with the chosen style throughout
- Do NOT include any explanations or notes - only output the translated text
- Variation seed: ${variationSeed} (use this to ensure unique phrasing)

MODERN TEXT TO TRANSLATE:
"${text}"

TRANSLATED TEXT:`;
}

/**
 * Validate input text
 * @param {string} text - The text to validate
 * @returns {object} - { valid: boolean, error?: string }
 */
export function validateInput(text) {
  if (!text || typeof text !== 'string') {
    return { valid: false, error: 'Text is required' };
  }

  const trimmed = text.trim();
  
  if (trimmed.length === 0) {
    return { valid: false, error: 'Text cannot be empty' };
  }

  if (trimmed.length > 5000) {
    return { valid: false, error: 'Text must be under 5000 characters' };
  }

  // Basic sanitization check for potential injection attempts
  const suspiciousPatterns = [
    /ignore (?:all )?(?:previous |above )?instructions/i,
    /disregard (?:all )?(?:previous |above )?instructions/i,
    /you are now/i,
    /new instructions:/i
  ];

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(trimmed)) {
      return { valid: false, error: 'Invalid input detected' };
    }
  }

  return { valid: true };
}

export default { buildTranslationPrompt, validateInput, TRANSLATION_STYLES, OUTPUT_LANGUAGES };
