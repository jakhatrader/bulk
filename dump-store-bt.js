// Read-only inspector for the windowed backfill store (Upstash Redis REST).
// Usage: STORE_KEY=bt:index node dump-store.js   (after: set -a; source .env; set +a)
const zlib = require('zlib');
const KEY = process.env.STORE_KEY || 'bt:index';
const U = process.env.UPSTASH_REDIS_REST_URL;
const T = process.env.UPSTASH_REDIS_REST_TOKEN;
async function rget(k) {
  const r = await fetch(U + '/get/' + encodeURIComponent(k), { headers: { Authorization: 'Bearer ' + T } });
  const j = await r.json();
  return j.result;
}
const fmt = t => (t ? new Date(t).toISOString() : t);
(async () => {
  const metaRaw = await rget(KEY + ':meta');
  const n = parseInt(metaRaw, 10);
  if (!n) { console.log('no store found for key ' + KEY); return; }
  let b64 = '';
  for (let i = 0; i < n; i++) { b64 += (await rget(KEY + ':' + i)) || ''; }
  const json = zlib.gunzipSync(Buffer.from(b64, 'base64')).toString();
  const s = JSON.parse(json);
  const ids = Object.keys(s.tweets || {});
  console.log('key            =', KEY);
  console.log('backfillDone   =', s.backfillDone);
  console.log('backfillVersion=', s.backfillVersion);
  console.log('count          =', ids.length);
  console.log('newestTime     =', fmt(s.newestTime));
  console.log('oldestTime     =', fmt(s.oldestTime));
  console.log('windowUntil    =', s.windowUntil, '->', s.windowUntil ? fmt(s.windowUntil * 1000) : '');
  console.log('windowOldestRaw=', fmt(s.windowOldestRaw));
  console.log('oldestCursorLen=', (s.oldestCursor || '').length);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
