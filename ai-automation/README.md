# Califnco AI Social Media & WhatsApp Status Automation

Automated daily social marketing engine for Califnco Water Systems. Posts 1 featured water purifier product daily to Instagram and WhatsApp Status with AI-generated visuals, captions, and hashtags — completely hands-free.

---

## 🎯 Architecture & Workflow

```
┌─────────────────────────────────────────────────────────────┐
│              Daily Trigger (Cron: 09:00 AM IST)             │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│          Fetch Daily Item from `products_feed.json`         │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌──────────────────────────────┐    ┌──────────────────────────────┐
│  AI Product Image Generation │    │  AI Copy & Hashtag Generator │
│  (Pollinations / HuggingFace)│    │       (Groq / Gemini LLM)    │
└──────────────┬───────────────┘    └──────────────┬───────────────┘
               │                                   │
               └──────────────────┬────────────────┘
                                  │
            ┌─────────────────────┴─────────────────────┐
            ▼                                           ▼
┌───────────────────────────────┐           ┌───────────────────────────────┐
│   Instagram Meta Graph API    │           │    WAHA WhatsApp Status       │
│    (Container Media Post)     │           │    (status@broadcast)         │
└───────────────────────────────┘           └───────────────────────────────┘
```

---

## 🚀 Quick Start (Option 1: Direct Node.js)

Run the end-to-end automation immediately:

```bash
cd c:\Users\HP\Desktop\e-commerce\ai-automation
node daily_social_autoposter.js
```

### Output:
- Generates high-resolution 1080x1080 studio photography visual.
- Generates professional marketing copy with call-to-action and 15 targeted hashtags.
- Publishes to Instagram Feed via Meta Graph API.
- Publishes to WhatsApp Status via WAHA.
- Logs full execution report to `daily_post_output.json`.

---

## 🐳 Quick Start (Option 2: Docker Compose with n8n & WAHA)

1. Launch both n8n and WAHA with 1 command:
```bash
docker compose up -d
```

2. Open **n8n** in your browser:
```
http://localhost:5678
```

3. Import the pre-built workflow:
- Click **Workflows** -> **Import from File** -> Select `n8n_califnco_workflow.json`.
- The complete pipeline (Cron -> Catalog -> LLM -> AI Image -> Instagram -> WhatsApp) is pre-configured and ready to activate!

4. Connect WhatsApp on **WAHA**:
- Open `http://localhost:3000/dashboard`
- Scan QR code using your secondary WhatsApp number.
- Any status broadcast sent to `status@broadcast` will appear instantly on your WhatsApp Status!

---

## ⚙️ Environment Variables (Optional for Live API Keys)

| Variable | Description | Default Fallback |
| :--- | :--- | :--- |
| `GROQ_API_KEY` | Groq API Key for Llama-3.3-70b captions | Built-in high-converting copywriter engine |
| `GEMINI_API_KEY` | Google Gemini API Key | Fallback engine |
| `INSTAGRAM_ACCOUNT_ID` | Instagram Professional / Creator ID | Test container simulation |
| `META_GRAPH_ACCESS_TOKEN` | Meta Graph API User Token | Sandbox handshake |
| `WAHA_API_URL` | Local or remote WAHA instance | `http://localhost:3000` |

---

## 🌟 Bonus Features Implemented
- **WhatsApp Status (+10 pts)**: Automated broadcast using open-source WAHA API.
- **Zero Cost Stack**: Pollinations.ai (Free image gen), Meta Graph Free Tier, Groq/Gemini free tiers, WAHA free Docker.
