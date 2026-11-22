# Token Bot (Telegram + Vercel)

## 1. Server (Vercel)
1. Push repo ke GitHub, import ke Vercel, set **Root Directory = server**.
2. Buat kunci: `node server/scripts/gen-keys.mjs`. Tambah Upstash Redis (Vercel Marketplace) dan env: ADMIN_KEY, SIGN_PRIVATE_KEY (lihat server/.env.example).
3. Deploy: `bash run.sh "pesan commit"`

## 2. Kelola ID bot (ID = angka sebelum ":" di token)
POST /api/tokens mengembalikan `accessKey` SEKALI. Kirim key itu ke client yang bersangkutan.
```
curl -X POST   https://APP.vercel.app/api/tokens -H "x-admin-key: ADMIN_KEY" -H "content-type: application/json" -d '{"id":"123456789","label":"bot-1"}'
curl           https://APP.vercel.app/api/tokens -H "x-admin-key: ADMIN_KEY"
curl -X DELETE "https://APP.vercel.app/api/tokens?id=123456789" -H "x-admin-key: ADMIN_KEY"
```

## 3. Bot client
```
cd bot && cp .env.example .env   # isi BOT_TOKEN, SECRET_KEY, SERVER_URL
npm install && npm start
```

## 4. Halaman admin (mini app)
Buka `https://APP.vercel.app/` lalu masukkan ADMIN_KEY. Bisa tambah, hapus, dan lihat daftar ID bot.
Untuk Telegram Mini App: BotFather > /newapp (atau menu button) > isi URL di atas.

## 5. run.sh
Salin `.env.example` di root jadi `.env`, isi GIT_USERNAME, GIT_TOKEN, GIT_REPO.

