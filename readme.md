# 📜 Ye Olde Translator

**Ye Olde Translator** is a delightfully unnecessary web app that transforms modern speech into dramatically overwrought pseudo-medieval English. Forsooth.

<br>

---

## ✨ Features

- 🏰 Transform mundane modern text into grandiose medieval prose
- 🎭 Multiple translation styles (Shakespearean, Chaucerian, Royal Decree, Bardic)
- ⚡ Instant translation with AI-powered linguistic theatrics
- 🎨 Pleasingly archaic user interface
- 🔒 Rate limiting and input validation for security

<br>

---

## 🛠️ Installation and Usage

Prerequisites:
- Node.js 18 or newer. Download from https://nodejs.org/
- OpenAI API Key. More info: https://platform.openai.com/docs/overview
- Vercel CLI (optional, for local development). Run `npm install -g vercel`

Installation:
```bash
# clone this repo
git clone https://github.com/jkfrydendahl/yee-olde-translator.git
cd yee-olde-translator

# install dependencies
npm install
```

Set your OpenAI API key:
```bash
# copy the example env file
cp .env.example .env

# edit .env and add your actual API key
# IMPORTANT: Never commit .env to git!
```

Run locally:
```bash
# using Vercel CLI (recommended)
npm run dev

# or deploy to Vercel
npm run deploy
```

<br>

---

## 📁 Project Structure

```
yee-olde-translator/
├── api/                    # Vercel serverless functions
│   ├── translate.js        # POST /api/translate - Main translation endpoint
│   └── styles.js           # GET /api/styles - Available translation styles
├── lib/                    # Shared utilities
│   ├── openai.js           # OpenAI client wrapper
│   └── prompts.js          # Translation prompt templates
├── public/                 # Static frontend files
│   └── index.html          # Main page (Phase 3)
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules (protects secrets!)
├── package.json            # Project dependencies
├── vercel.json             # Vercel configuration
└── readme.md               # You are here
```

<br>

---

## 🔌 API Reference

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
| `medieval` | Generic pseudo-medieval English with thees and thous 🏰 |
| `shakespearean` | Flowery Elizabethan prose worthy of the Bard 🎭 |
| `chaucerian` | Middle English style with archaic spellings 📜 |
| `royal` | Pompous proclamations fit for a monarch 👑 |
| `bardic` | Dramatic storytelling voice of a traveling bard 🎵 |

### GET /api/styles

Returns all available translation styles.

<br>

---

## 🔍 Roadmap

- [x] Backend API with OpenAI integration
- [x] Multiple translation styles
- [x] Rate limiting & input validation
- [ ] Web UI (Phase 3)
- [ ] Copy to clipboard functionality
- [ ] Translation history
- [ ] Share translations
- [ ] Reverse translation (medieval to modern)
- [ ] Browser extension

<br>

---

## 📖 Example

**Input:**
> I'm going to the store to buy some milk.

**Output (Medieval):**
> Hark! I shall embark upon a most noble quest to the merchant's establishment, whereupon I intend to procure the sacred white elixir of the bovine creature. Verily, 'tis a journey of great import!

**Output (Royal Decree):**
> Hear ye, hear ye! Be it known unto all that We, in Our infinite wisdom, have decreed a royal expedition unto the marketplace. There, by Our sovereign will, the creamy nectar of the cow shall be acquired for the realm. So it is written, so shall it be done!

<br>

---

## 🔒 Security Notes

- **NEVER commit `.env` files** - they contain your API keys!
- The `.gitignore` file is configured to exclude all sensitive files
- Rate limiting is enabled to prevent abuse (10 requests/minute)
- Input validation protects against prompt injection

<br>

---

## 🤝 Contributing

Contributions art most welcome, good traveler! Feel free to submit a pull request or open an issue.

<br>

---

## 📜 License

MIT License — do with it as thou wilt.
