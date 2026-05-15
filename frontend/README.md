# Product Management Frontend

React + Vite frontend for the Product Management API with JWT authentication, product CRUD, pagination, and debounced search.

---

# Setup

Install dependencies:

```bash
npm install
```

Create `.env` file:

```env
VITE_API_BASE_URL=https://task.aisurveymaker.com
```

---

# Run Project

```bash
npm run dev
```

---

# Build Project

```bash
npm run build
npm run preview
```

---

# Features

* JWT Login Authentication
* Product Listing
* Pagination
* Debounced Search
* Add Product
* Edit Product
* Delete Product
* Validation Error Handling
* Protected Routes
* Loading & Error States

---

# API Endpoints

| Action         | Method | Endpoint            |
| -------------- | ------ | ------------------- |
| Login          | POST   | `/api/login`        |
| Products List  | GET    | `/api/products`     |
| Single Product | GET    | `/api/products/:id` |
| Create Product | POST   | `/api/products`     |
| Update Product | PUT    | `/api/products/:id` |
| Delete Product | DELETE | `/api/products/:id` |

---

# Authentication

JWT token is stored in:

```text
localStorage
```

Axios automatically sends:

```http
Authorization: Bearer TOKEN
```

On 401 response:

* token is cleared
* user is redirected to login

---

# Search & Pagination Example

```http
GET /api/products?page=1&limit=10&search=iphone
```

---

# Demo Credentials

```text
Email: demo@example.com
Password: password
```

---

# Tech Stack

* React
* Vite
* Axios
* React Router
* Bootstrap
