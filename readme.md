# Ye Olde Translator

**Ye Olde Translator** is a delightfully unnecessary web app that uses OpenAI to transform modern speech into dramatically overwrought pseudo-medieval prose. Forsooth.

<br>

---

## Features

- Transform modern text into medieval prose
- Multiple translation styles
- Instant AI-powered translation
- Copy to clipboard
- Rate limiting and input validation

<br>

---

## Development

### Prerequisites
- Node.js 18+ (For running locally)
- Vercel integration setup
- OpenAI API Key ([platform.openai.com](https://platform.openai.com/))

### Local Development
```bash
# Clone and install
git clone https://github.com/jkfrydendahl/yee-olde-translator.git
cd yee-olde-translator
npm install

# Create .env with your API key
cp .env.example .env
# Edit .env and add: OPENAI_API_KEY=your_key_here

# Run with Vercel CLI
npx vercel dev
```

### Deployment
The app auto-deploys to Vercel on push to `main`. Set `OPENAI_API_KEY` in Vercel Environment Variables.

<br>

---

## Project Structure

```
yee-olde-translator/
├── api/
│   ├── translate.js        # POST /api/translate
│   └── styles.js           # GET /api/styles
├── lib/
│   ├── openai.js           # OpenAI client wrapper
│   └── prompts.js          # Translation prompts
├── public/
│   ├── index.html          # Main page
│   └── style.css           # Styles
├── .env.example
├── .gitignore
├── package.json
├── vercel.json
└── readme.md
```

<br>

---

## API Reference

### POST /api/translate

Translate modern text into pseudo-medieval English.

**Request:**
```json
{
  "text": "I'm going to the store to buy some milk.",
  "style": "medieval"
}
```

**Response:**
```json
{
  "success": true,
  "original": "I'm going to the store to buy some milk.",
  "translation": "Hark! I shall embark upon a most noble quest...",
  "style": {
    "id": "medieval",
    "name": "Medieval",
    "description": "Generic pseudo-medieval English with thees and thous",
    "emoji": "🏰"
  }
}
```

**Available Styles:**
| Style | Description |
|-------|-------------|
| `medieval` | Generic pseudo-medieval English with thees and thous |
| `shakespearean` | Flowery Elizabethan prose worthy of the Bard |
| `chaucerian` | Middle English style with archaic spellings |
| `royal` | Pompous proclamations fit for a monarch |
| `bardic` | Dramatic storytelling voice of a traveling bard |

### GET /api/styles

Returns all available translation styles.

<br>

---

## Roadmap

- [x] Backend API with OpenAI integration
- [x] Multiple translation styles
- [x] Rate limiting & input validation
- [x] Web UI
- [x] Copy to clipboard
- [x] Translation history (localStorage)
- [x] Multiple language translation
- [ ] Share translations
- [ ] Reverse translation (medieval to modern)
- [ ] Browser extension

<br>

---

## Contributing

Contributions art most welcome, good traveler! Feel free to submit a pull request or open an issue.

<br>

---

## License

MIT License — do with it as thou wilt.
