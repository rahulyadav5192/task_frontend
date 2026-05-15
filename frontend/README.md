# Product Management (React + Vite)

Small React client for the PHP product API: login with JWT, product CRUD, validation errors, and debounced search.

## Setup

```bash
npm install
```

Create `.env` (see `.env.example`):

```
VITE_API_BASE_URL=https://task.aisurveymaker.com
```

If you leave `VITE_API_BASE_URL` empty, the dev server proxies `/api` to the same target as in `vite.config.js` (default `https://task.aisurveymaker.com`). With a full base URL set, the browser calls the API directly (your backend must allow CORS from your Vite origin, e.g. `http://localhost:5173`).

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## API assumptions

| Action | Method | Path |
|--------|--------|------|
| Login | POST | `/api/login` |
| List | GET | `/api/products?page=&limit=&search=` |
| Create | POST | `/api/products` |
| Read one (edit screen) | GET | `/api/products/:id` |
| Update | PUT | `/api/products/:id` |
| Delete | DELETE | `/api/products/:id` |

Login JSON stores `data.data.token` from the response body (fallback: `data.token` if you wire it that way in `Login.jsx`).

List response shape: `data.data.items`, `data.data.total`, `data.data.page`, `data.data.limit`.

If your “get one” endpoint differs from `GET /api/products/:id`, adjust `getProduct` in `src/api/products.js` and the shape in `ProductForm.jsx` where the loaded record is read.

## Auth

JWT is kept in `localStorage` under the key `token`. Axios sends `Authorization: Bearer …` and clears the token on HTTP 401, then sends the browser to `/login`.
