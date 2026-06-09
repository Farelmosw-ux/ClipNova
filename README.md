# ClipNova HTML Backend Pro V2

Struktur utama:
- `public/app/index.html` dashboard
- `public/app/report.html` form report email owner
- `public/downloaders/*.html` halaman downloader terpisah
- `public/errors/400.html`, `404.html`, `505.html`
- `api/download.js` backend downloader
- `api/report.js` backend report email

Deploy Vercel:
1. Upload folder ini ke GitHub.
2. Import ke Vercel.
3. Isi Environment Variables dari `.env.example`.
4. Deploy.

Catatan: API key dan SMTP disimpan di ENV backend, bukan di HTML client.
