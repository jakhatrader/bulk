# Proof of BULKTRADE

A leaderboard site (in the style of proofofhype.xyz) that shows how much each X / Twitter
account has helped **BulkTrade** grow. It counts mentions of **@bulktrade**, the
keyword **“bulktrade”**, the **$BULK** cashtag, and substantive replies — ranks everyone by
views, lets visitors **scan any handle**, and **open a full profile page** for each user
(like `proofofhype.xyz/u/lookonchain`). Your referral **OMNIMUAR (+15% points boost)** is
built into the page.

The data is **real** (pulled from X via twitterapi.io) and **refreshes once every 24 hours**.
That refresh interval is shown on the site itself.

---

## 🟢 The short version

1. Get a key from **twitterapi.io**.
2. Create a free **Upstash Redis** database (this stores the full history so it survives restarts).
3. Put the project on **GitHub**.
4. Deploy it on **Render.com** (free) and paste your key + Upstash values.
5. (Optional) Add a free daily ping from **cron-job.org** so it refreshes every day on its own.

The site indexes the **entire history** of BulkTrade mentions **once** (from @bulktrade's
very first post), then each day pulls in **only new** tweets. So old posts are paid for one time,
not on every refresh — and visitors/profile clicks cost nothing.

You never have to keep your computer on. The host runs it 24/7.

> If you just want to *look* at it first without any of this: install Node.js, run
> `npm start` in the folder, open `http://localhost:3000`. With no API key it shows clearly
> labelled PREVIEW data. Real data needs the steps below.

---

## What’s in the folder

```
proof-of-bulktrade-app/
├─ server.js            # the backend (Node, no extra libraries)
├─ package.json         # tells the host how to start it
├─ .env.example         # copy to .env and add your key
├─ README.md            # this guide
└─ public/
   └─ index.html        # the whole website (design + leaderboard + profiles)
```

---

## Step 0 — Get your X data key (5 min)

1. Go to **https://twitterapi.io** and sign up.
2. Open the dashboard and **copy your API key**.
3. Add a little credit. It’s pay-as-you-go and cheap (about **$0.15 per 1,000 tweets** read
   at the time of writing — check current pricing on their site). Because the site only
   refreshes once a day, costs stay tiny.

> Why twitterapi.io? The official X API is expensive and slow to get

---

## Step 0.5 — Free history store: Upstash Redis (5 min)

The full history has to live somewhere permanent. On Render's free tier the disk is **wiped on
every restart/redeploy**, which would force the (one-time) history scan to run again and cost
money each time. Upstash Redis has a **free tier** and keeps it safe.

1. Go to **https://upstash.com** and sign up (free).
2. Click **Create Database** → pick **Redis**, any name, choose a region near your Render region,
   leave the free plan selected → **Create**.
3. On the database page, scroll to the **REST API** section.
4. Copy these two values (you'll paste them into Render in the deploy step):
   - **UPSTASH_REDIS_REST_URL**  (looks like `https://your-db.upstash.io`)
   - **UPSTASH_REDIS_REST_TOKEN** (a long token — use the "Standard" one, not read-only)

That's it. If you ever skip this, the app still runs, but on Render free the history won't
persist between restarts.

> Why twitterapi.io? The official X API is expensive and slow to get approved. twitterapi.io
> reads the same public data for a fraction of the cost, and the server here is already built
> for it. You do **not** need an X developer account.

---

## Step 1 — Put the project on GitHub (10 min)

You don’t need to install anything for this — you can do it all in the browser.

1. Create a free account at **https://github.com** and sign in.
2. Click the **+** in the top-right → **New repository**.
3. Name it e.g. `proof-of-bulktrade`, keep it **Public** (or Private — both work), click
   **Create repository**.
4. On the new repo page click **“uploading an existing file”** (the link in the
   “…or upload” sentence).
5. **Unzip** the file I gave you on your computer, then **drag the unzipped files and the
   `public` folder into the browser window**. Make sure `server.js`, `package.json` and the
   `public` folder all upload (the `public` folder must contain `index.html`).
6. Click **Commit changes**.

✅ Done. Your code now lives on GitHub. **Do NOT upload your `.env` file** — only
`.env.example`. The real key goes into the host’s settings, not into GitHub.

---

## Step 2 — Deploy it so it runs 24/7 (10 min)

This is what makes the site work **without your computer**. The host keeps it online.

### Render.com (recommended, has a free tier)

1. Go to **https://render.com** and sign up with your GitHub account.
2. Click **New +** → **Web Service**.
3. Connect your `proof-of-bulktrade` repo.
4. Fill in:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Open the **Environment** section and add a variable:
   - **Key:** `TWITTERAPI_KEY`  **Value:** *(paste the key from twitterapi.io)*
   - (Optional) add `UPDATE_INTERVAL_HOURS` = `24`
6. Click **Create Web Service**. Wait ~2 minutes. You’ll get a public URL like
   `https://proof-of-bulktrade.onrender.com` — that’s your live site. Share it anywhere.

> **About the free tier:** Render’s free plan puts the service to sleep after ~15 minutes of
> no visitors; the next visitor wakes it (takes a few seconds). For a site that’s **always**
> instant, either:
> - upgrade to Render **Starter (~$7/month)**, or use **Railway.app** (similar setup), **or**
> - keep the free plan and add the free daily ping in Step 3 — that also keeps the data fresh.

---

## Step 3 — Make the data refresh every day on its own (optional, free)

The server already refreshes itself every 24h while it’s awake. On a free host that sleeps,
add a free scheduled ping so the refresh always happens — no computer needed:

1. Go to **https://cron-job.org** and sign up (free).
2. Create a new cron job:
   - **URL:** `https://YOUR-SITE.onrender.com/api/leaderboard`
   - **Schedule:** once a day (e.g. every day at 09:00).
3. Save. That daily visit wakes the server and triggers the once-a-day refresh.

That’s it — your site now updates by itself, every day, forever, with your PC off.

---

## How the profiles work

- Every account on the leaderboard is clickable.
- Clicking opens a **full profile page** (URL like `your-site.com/u/handle`) with their total
  views, likes, posts, a growth chart, the **mention breakdown** (@-mentions, keyword, $BULK,
  replies), their rank, and a **Share** button.
- Visitors can also type any handle in the **Scan** box to index it instantly.

---

## How the counting works

A post counts as a BulkTrade mention if it contains **any** of:
- a mention of **@bulktrade**,
- the keyword **“bulktrade”**,
- the **$BULK** cashtag,
- or it’s a **reply with real commentary** to @bulktrade.

Plain retweets and empty one-word replies are ignored. Accounts are ranked by total views.

---

## Settings you can change (host → Environment, or your `.env`)

| Setting | Default | What it does |
|---|---|---|
| `TWITTERAPI_KEY` | — | **Required** for real data. Your twitterapi.io key. |
| `UPDATE_INTERVAL_HOURS` | `24` | How often data refreshes. Shown on the site. |
| `LOOKBACK_DAYS` | `7` | How many days back to look. |
| `LEADERBOARD_PAGES` | `15` | How many pages of tweets to read (≈20 each). More = more data + cost. |
| `SCAN_PAGES` | `6` | Pages read when scanning one handle. |
| `TOP_LIMIT` | `50` | How many accounts to keep on the board. |
| `QUERY_TERMS` | `(bulktrade OR @bulktrade OR $BULK)` | What counts as a mention. |
| `PORT` | `3000` | Port (the host sets this automatically). |

---

## Change the referral code

It’s already set to **OMNIMUAR** everywhere. To change it, open `public/index.html` and
replace `OMNIMUAR` (and the `?ref=OMNIMUAR` links) with your code.

---

## Notes

- No databases, no extra libraries — just Node. Easy to host anywhere.
- The page shows a clear **PREVIEW** badge until a real key is connected, so it never
  pretends fake numbers are real.
- This is an independent community project, not affiliated with BulkTrade or X.
