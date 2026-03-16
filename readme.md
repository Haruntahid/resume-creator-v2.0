# 📄 Resume Creator

> A full-stack web application to build and download professional resumes — fast, clean, and effortless.

🔗 **Live Demo:** [resume-creator-three.vercel.app](https://resume-creator-three.vercel.app)

---

## ✨ Features

- 🖊️ Build a professional resume with a guided form
- 👁️ Real-time resume preview
- 📥 Download / export your resume
- 🗄️ Persistent data storage — your resume is saved
- 📱 Fully responsive — works on mobile & desktop
- ⚡ Fast performance with Next.js App Router
- 🎨 Clean, modern UI with Tailwind CSS

---

## 🏗️ Project Structure

```
resume-creator/
├── frontend/               # Next.js frontend application
│   ├── app/                # App Router pages & layouts
│   ├── components/         # Reusable UI components
│   │   ├── ResumeForm/     # Form sections (Personal, Experience, etc.)
│   │   └── ResumePreview/  # Live resume preview components
│   ├── styles/             # Global styles & Tailwind config
│   ├── public/             # Static assets
│   └── tailwind.config.js
│
├── backend/                # Node.js / Express API server
│   ├── routes/             # API route handlers
│   ├── controllers/        # Business logic
│   ├── models/             # Database models / schemas
│   ├── middleware/         # Auth, error handling, etc.
│   └── server.js           # Express app entry point
│
├── .env.local              # Environment variables (not committed)
├── package.json
└── README.md
```

---

## 🖥️ Frontend

### Tech Stack

| Technology   | Purpose                           |
| ------------ | --------------------------------- |
| Next.js 14+  | React framework, routing, SSR/SSG |
| Tailwind CSS | Utility-first styling             |
| React Hooks  | State & side-effect management    |
| Vercel       | Deployment & hosting              |

### Getting Started — Frontend

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Frontend Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Run production build
npm run lint      # Lint the codebase
```

---

## 🔧 Backend

### Tech Stack

| Technology          | Purpose                       |
| ------------------- | ----------------------------- |
| Node.js             | JavaScript runtime            |
| Express.js          | REST API framework            |
| Next.js API Routes  | Serverless API endpoints      |
| Firebase / Supabase | Database & persistent storage |

### Getting Started — Backend

```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Server runs on [http://localhost:5000](http://localhost:5000) by default.

### Backend Scripts

```bash
npm run dev       # Start with hot reload (nodemon)
npm run start     # Start production server
```

### API Endpoints

| Method | Endpoint           | Description                  |
| ------ | ------------------ | ---------------------------- |
| GET    | `/api/resumes`     | Fetch all saved resumes      |
| GET    | `/api/resumes/:id` | Fetch a single resume by ID  |
| POST   | `/api/resumes`     | Create and save a new resume |
| PUT    | `/api/resumes/:id` | Update an existing resume    |
| DELETE | `/api/resumes/:id` | Delete a resume              |

---

## 🔐 Environment Variables

Create a `.env.local` file in the root (or respective `frontend/` and `backend/` directories):

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com


# Backend
PORT=5000
DATABASE_URL=your_database_url
```

> ⚠️ Never commit `.env.local` or any secret keys to version control.

---

## 🚀 Deployment

### Frontend — Vercel

1. Push your code to GitHub.
2. Import the repo at [vercel.com](https://vercel.com).
3. Set your environment variables in the Vercel dashboard.
4. Click **Deploy** — done! 🎉

### Backend — Vercel / Railway / Render

1. Deploy the `backend/` folder to [Railway](https://railway.app) or [Render](https://render.com).
2. Set the environment variables in the platform dashboard.
3. Update the frontend `NEXT_PUBLIC_API_URL` to point to the live backend URL.

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "feat: add your feature"`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## 🐛 Issues

Found a bug or want to request a feature? [Open an issue](https://github.com/your-username/resume-creator/issues).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👤 Author

**Your Name**

- GitHub: [haruntahid](https://github.com/haruntahid)
- Live App: [resume-creator-three.vercel.app](https://resume-creator-three.vercel.app)

---

⭐ **If this project helped you, give it a star on GitHub!**
