# PurpleMerit - Full Stack Application

A full-stack web application built with React (Vite) and Node.js (Express), featuring JWT authentication, role-based access control (Admin/User), and a PostgreSQL database.

## 🚀 Tech Stack

**Frontend:**

- React (Vite)
- Tailwind CSS
- Axios
- React Router DOM

**Backend:**

- Node.js & Express
- PostgreSQL (pg)
- JWT (JSON Web Tokens) for Authentication
- BCrypt for Password Hashing

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd purplemerit
```

### 2. Backend Setup

Navigate to the backend folder:

```bash
cd backend
```

**Install Dependencies:**

```bash
npm install
```

**Environment Variables:**
Create a `.env` file in the `backend` folder with the following content:

```env
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/purple_merit_task
JWT_SECRET=your_super_secret_key
```

**Database Setup:**
Ensure you have PostgreSQL installed and running. Connect to your database and run the following SQL commands to initialize the schema:

```sql
-- 1. Create Types
CREATE TYPE user_role AS ENUM ('admin', 'user');
CREATE TYPE user_status AS ENUM ('active', 'inactive');

-- 2. Create Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'user',
    status user_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);
```

**Run the Server:**

```bash
npm start
```

The backend will run on `http://localhost:5000`.

---

### 3. Frontend Setup

Open a new terminal and navigate to the frontend folder:

```bash
cd frontend
```

**Install Dependencies:**

```bash
npm install
```

**Environment Variables:**
Create a `.env` file in the `frontend` folder:

```env
VITE_BASE_URL="http://localhost:5000"
```

**Run the Development Server:**

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (or similar).

---

## 📦 Deployment

### Backend (Railway)

1. Connect your GitHub repo to Railway.
2. Add the `DATABASE_URL` and `JWT_SECRET` in the Railway variables settings.
3. Railway will auto-detect the start command.

### Frontend (Vercel)

1. Import the project into Vercel.
2. Set the **Root Directory** to `frontend`.
3. Add the environment variable `VITE_BASE_URL` with your deployed backend URL (e.g., `https://your-app.up.railway.app`).
