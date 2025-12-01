# Wahl

Logistics web app (React + TypeScript + Vite) with a Plesk-ready Node.js API.

Deployment on Plesk:
- Upload `dist/`, `server/`, `package.json`, `package-lock.json` to `/httpdocs`
- Startup file: `server/index.js`
- Run `npm install --omit=dev` in Node.js commands
- Env: `MYSQL_*`, `JWT_SECRET`, `INSTALL_TOKEN`, `VITE_DATA_PROVIDER=plesk`, `VITE_API_BASE_URL=/api`
- Initialize DB: `curl -X POST -H "x-install-token: YOUR_SECRET" https://wahl.sa/api/admin/install`
