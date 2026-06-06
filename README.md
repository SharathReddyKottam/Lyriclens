# LyricLens 🎵

AI-powered lyric meaning explorer. Type any song, get lyrics line-by-line, tap each line for a poetic interpretation.

---

## Part 1 — Get your Anthropic API key (5 min)

1. Go to **console.anthropic.com** and sign up / log in.
2. Click **Settings → API Keys** (or **Get API keys**).
3. Click **Create Key**, name it `lyriclens`, and copy the key
   (starts with `sk-ant-...`). **Save it now — you can't view it again.**
4. Add a little credit under **Billing → Plans** (usage is pay-as-you-go;
   a few dollars covers thousands of lyric lookups). There's also a small
   free trial credit to start.

---

## Part 2 — Deploy to Vercel (10 min)

### Easiest: drag-and-drop via GitHub

1. Create a new GitHub repo (e.g. `lyriclens`) and upload this whole folder.
2. Go to **vercel.com → Add New → Project → Import** your repo.
3. Leave all build settings as default and click **Deploy**.
4. After it deploys, go to **Project → Settings → Environment Variables** and add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** your `sk-ant-...` key
5. Go to **Deployments → ⋯ → Redeploy** so the key takes effect.
6. Visit your live URL — done! 🎉

### Or via command line

```bash
npm i -g vercel
cd lyriclens
vercel            # follow prompts to link/create the project
vercel env add ANTHROPIC_API_KEY   # paste your key when asked
vercel --prod     # deploy live
```

---

## How it works

```
Browser (index.html)
   │  POST /api/lyrics   → fetches lyrics line-by-line
   │  POST /api/meaning  → explains one tapped line
   ▼
Vercel serverless functions  (your API key lives here, never in the browser)
   ▼
Anthropic API (Claude)
```

## Files

- `public/index.html` — the dark-themed frontend
- `api/lyrics.js` — fetches full lyrics for a song
- `api/meaning.js` — explains a single lyric line
- `vercel.json` — routing/config

## Notes

- **Spotify "now playing":** the live web version can't auto-read your Spotify
  session without OAuth setup. You type the song instead. (Spotify auto-detect
  only worked inside the Claude chat preview.)
- **Copyright:** reproducing full lyrics has licensing implications. Keep this
  for personal use; don't publish it as a public lyrics service.
- **Cost control:** set a monthly spend limit in the Anthropic console under Billing.
