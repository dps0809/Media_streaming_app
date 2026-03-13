<p align="center">
  <img src="public/next.svg" alt="StreamVault Logo" width="120" />
</p>

<h1 align="center">StreamVault — Media Streaming App</h1>

<p align="center">
  A modern, full-stack video streaming platform built with <strong>Next.js 16</strong>, <strong>TypeScript</strong>, <strong>MongoDB</strong>, and <strong>ImageKit</strong>.<br/>
  Upload, manage, and stream videos with adaptive HLS playback, beautiful animations, and a premium dark-themed UI.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.1.6-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the Development Server](#running-the-development-server)
- [Pages & Routes](#-pages--routes)
- [API Endpoints](#-api-endpoints)
- [Database Models](#-database-models)
- [UI Components](#-ui-components)
- [Roadmap](#-roadmap)
- [License](#-license)

---

## ✨ Features

| Category | Details |
|---|---|
| **Video Streaming** | Adaptive HLS playback via `hls.js` with ImageKit CDN delivery. Custom video player with full controls, quality selection, and fullscreen. |
| **Authentication** | NextAuth.js with **Credentials** (email/password with bcrypt) and **Google OAuth** providers. Session management with JWT. |
| **Media Upload** | Direct browser-to-ImageKit uploads with real-time progress tracking, title/description metadata, and thumbnail generation. |
| **User Management** | Registration, login, profile pages, password management (set/change), and avatar support. |
| **Dashboard** | Personal video library with grid view, video management, and quick access to all uploaded content. |
| **Premium UI/UX** | Dark-themed design with Tailwind CSS v4 + DaisyUI. Animated landing page with particles, meteors, gradient text, shimmer buttons, tilt cards, and smooth page transitions using Framer Motion & GSAP. |
| **Theme Support** | Light/Dark mode toggle powered by `next-themes`. |
| **Responsive** | Fully responsive layout with collapsible sidebar navigation across all screen sizes. |

---

## 🛠️ Tech Stack

### Core

| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16.1.6 | Full-stack React framework (App Router) |
| [React](https://react.dev/) | 19.2.3 | UI library |
| [TypeScript](https://typescriptlang.org/) | 5.x | Type-safe JavaScript |

### Backend & Data

| Technology | Purpose |
|---|---|
| [MongoDB](https://www.mongodb.com/) + [Mongoose](https://mongoosejs.com/) 9.x | NoSQL database & ODM |
| [NextAuth.js](https://next-auth.js.org/) 4.x | Authentication (Credentials + Google OAuth) |
| [bcryptjs](https://www.npmjs.com/package/bcryptjs) | Password hashing |
| [ImageKit](https://imagekit.io/) | Media storage, CDN delivery & video transformations |

### Frontend & Styling

| Technology | Purpose |
|---|---|
| [Tailwind CSS](https://tailwindcss.com/) v4 | Utility-first CSS framework |
| [DaisyUI](https://daisyui.com/) 5.x | Tailwind component library |
| [Radix UI](https://www.radix-ui.com/) | Accessible headless UI primitives (Dropdown, Label, Separator, Slot) |
| [Lucide React](https://lucide.dev/) | Icon library |

### Animations & Media

| Technology | Purpose |
|---|---|
| [Framer Motion](https://www.framer.com/motion/) (motion) | Declarative animations & page transitions |
| [GSAP](https://gsap.com/) | High-performance timeline animations |
| [HLS.js](https://github.com/video-dev/hls.js/) | Adaptive bitrate video streaming |

### Dev Tools

| Technology | Purpose |
|---|---|
| [ESLint](https://eslint.org/) + eslint-config-next | Code linting |
| [PostCSS](https://postcss.org/) | CSS processing |
| [Nodemon](https://nodemon.io/) | Development file watching |
| [Babel React Compiler](https://react.dev/learn/react-compiler) | React compiler plugin |

---

## 📂 Project Structure

```
media_streaming/
│
├── app/                                # Next.js App Router (pages, layouts, API)
│   ├── layout.tsx                      # Root layout (providers, fonts, metadata)
│   ├── page.tsx                        # Landing / Home page
│   ├── globals.css                     # Global styles & Tailwind imports
│   ├── proxy.ts                        # Proxy utilities
│   ├── favicon.ico                     # App favicon
│   │
│   ├── login/
│   │   └── page.tsx                    # Login page
│   ├── register/
│   │   └── page.tsx                    # Registration page
│   ├── profile/
│   │   └── page.tsx                    # User profile & password management
│   ├── dashboard/
│   │   └── page.tsx                    # User dashboard (video library)
│   ├── upload/
│   │   └── page.tsx                    # Video upload page
│   ├── video/
│   │   └── [id]/
│   │       └── page.tsx                # Video detail & HLS player page
│   ├── about/
│   │   └── page.tsx                    # About page
│   │
│   └── api/                            # API Route Handlers
│       ├── auth/
│       │   ├── [...nextauth]/
│       │   │   ├── options.ts          # NextAuth config (providers, callbacks)
│       │   │   └── route.ts            # NextAuth API handler
│       │   ├── register/
│       │   │   └── route.ts            # POST /api/auth/register
│       │   ├── set-password/
│       │   │   └── route.ts            # POST /api/auth/set-password
│       │   └── debug/
│       │       └── route.ts            # Auth debug endpoint
│       ├── videos/
│       │   ├── route.ts                # GET /api/videos (list) & POST (create)
│       │   └── [id]/
│       │       └── route.ts            # GET /api/videos/:id (single video)
│       └── imagekit_auth/
│           └── route.ts                # GET /api/imagekit_auth (upload token)
│
├── components/                         # Reusable React components
│   ├── app-sidebar.tsx                 # Collapsible sidebar navigation
│   ├── header.tsx                      # Persistent app header (auth state, theme)
│   ├── hls-video-player.tsx            # Custom HLS video player component
│   ├── fileUpload.tsx                  # ImageKit file upload component
│   ├── login-form.tsx                  # Login form with validation
│   ├── register-form.tsx               # Registration form with validation
│   ├── search-form.tsx                 # Search bar component
│   ├── providers.tsx                   # Client-side providers wrapper
│   ├── theme-provider.tsx              # next-themes ThemeProvider
│   │
│   └── ui/                            # UI primitives & animated components
│       ├── animated-list.tsx           # Staggered animated list
│       ├── blur-text.tsx               # Blur-in text animation
│       ├── border-beam.tsx             # Animated border beam effect
│       ├── breadcrumb.tsx              # Breadcrumb navigation
│       ├── button.tsx                  # Button variants (CVA)
│       ├── card.tsx                    # Card component
│       ├── confetti.tsx                # Confetti celebration effect
│       ├── dropdown-menu.tsx           # Radix dropdown menu
│       ├── field.tsx                   # Form field wrapper
│       ├── glare-card.tsx              # Glare hover card effect
│       ├── gradient-text.tsx           # Animated gradient text
│       ├── input.tsx                   # Styled input component
│       ├── label.tsx                   # Radix label component
│       ├── magnetic-button.tsx         # Magnetic hover button effect
│       ├── meteors.tsx                 # Meteor shower animation
│       ├── number-ticker.tsx           # Animated number counter
│       ├── particles.tsx               # Particle field background
│       ├── separator.tsx               # Radix separator
│       ├── shimmer-button.tsx          # Shimmer loading button
│       ├── shiny-text.tsx              # Shiny text animation
│       ├── sidebar.tsx                 # Sidebar primitives
│       ├── spotlight-card.tsx          # Spotlight hover card
│       ├── text-effect.tsx             # Text reveal animation
│       ├── tilt-card.tsx               # 3D tilt card on hover
│       └── vanish-input.tsx            # Vanish placeholder input
│
├── models/                             # Mongoose schemas
│   ├── user.ts                         # User model (email, password, provider, image)
│   └── video.ts                        # Video model (title, description, urls, transformations)
│
├── lib/                                # Shared utilities
│   ├── dbConnect.ts                    # MongoDB/Mongoose connection singleton
│   └── utils.ts                        # General utility functions (cn, etc.)
│
├── types/                              # TypeScript type definitions
│   ├── apiresponse.ts                  # API response type interfaces
│   ├── next_auth.d.ts                  # NextAuth session/user type augmentation
│   └── types.d.ts                      # Global type declarations
│
├── public/                             # Static assets
│   ├── next.svg                        # Next.js logo
│   ├── vercel.svg                      # Vercel logo
│   ├── file.svg                        # File icon
│   ├── globe.svg                       # Globe icon
│   └── window.svg                      # Window icon
│
├── .env                                # Environment variables (DO NOT COMMIT)
├── .gitignore                          # Git ignore rules
├── next.config.ts                      # Next.js configuration
├── tsconfig.json                       # TypeScript configuration
├── postcss.config.mjs                  # PostCSS + Tailwind plugin config
├── eslint.config.mjs                   # ESLint flat config
├── package.json                        # Dependencies & scripts
├── package-lock.json                   # Lockfile
└── PROJECT_ROADMAP.md                  # Feature roadmap & development phases
```

---

## 🏁 Getting Started

### Prerequisites

- **Node.js** v20+ — [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or Yarn / pnpm / bun
- **MongoDB** — a running instance or [MongoDB Atlas](https://www.mongodb.com/atlas) connection string
- **ImageKit** account — [Sign up free](https://imagekit.io/)
- **Google OAuth** credentials *(optional, for Google login)*

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd media_streaming

# 2. Install dependencies
npm install
```

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# ─── Database ────────────────────────────────────────
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>

# ─── NextAuth ────────────────────────────────────────
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# ─── ImageKit ────────────────────────────────────────
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_xxxxxxxxxxxx
IMAGEKIT_PRIVATE_KEY=private_xxxxxxxxxxxx

# ─── Google OAuth (optional) ─────────────────────────
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

> **Note:** Never commit your `.env` file. It is already listed in `.gitignore`.

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Create optimized production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint checks |

---

## 🗂️ Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home / Landing | Animated landing page with particles, gradient text, feature showcase |
| `/login` | Login | Email/password & Google OAuth sign-in |
| `/register` | Register | New user registration form |
| `/profile` | Profile | View/edit profile info, set/change password |
| `/dashboard` | Dashboard | Personal video library in a grid layout |
| `/upload` | Upload | Upload videos to ImageKit with metadata form |
| `/video/[id]` | Video Player | HLS video playback with detail information |
| `/about` | About | Project information & documentation |

---

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user (email, password, username) |
| `POST` | `/api/auth/set-password` | Set or update password for a user |
| `GET/POST` | `/api/auth/[...nextauth]` | NextAuth.js handler (login, logout, session, callbacks) |
| `GET` | `/api/auth/debug` | Debug authentication state |

### Videos

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/videos` | Fetch all videos |
| `POST` | `/api/videos` | Create a new video entry (title, description, video_url, thumbnail_url) |
| `GET` | `/api/videos/[id]` | Fetch a single video by ID |

### Media

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/imagekit_auth` | Generate ImageKit authentication token for client-side uploads |

---

## 🗄️ Database Models

### User (`models/user.ts`)

| Field | Type | Required | Description |
|---|---|---|---|
| `email` | String | ✅ | Unique, lowercase, trimmed email address |
| `password` | String | ❌ | Hashed password (not required for OAuth users) |
| `user_name` | String | ✅ | Display name |
| `provider` | String | ✅ | `"credentials"` or `"google"` |
| `image` | String | ❌ | Profile avatar URL |
| `createdAt` | Date | auto | Mongoose timestamp |
| `updatedAt` | Date | auto | Mongoose timestamp |

### Video (`models/video.ts`)

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | String | ✅ | Video title |
| `description` | String | ✅ | Video description |
| `video_url` | String | ✅ | ImageKit video URL |
| `thumbnail_url` | String | ✅ | ImageKit thumbnail URL |
| `controls` | Boolean | ❌ | Show player controls (default: `true`) |
| `transformations.width` | Number | ❌ | Video width (default: `1080`) |
| `transformations.height` | Number | ❌ | Video height (default: `1920`) |
| `transformations.quality` | Number | ❌ | Video quality (default: `100`) |
| `createdAt` | Date | auto | Mongoose timestamp |
| `updatedAt` | Date | auto | Mongoose timestamp |

---

## 🎨 UI Components

### Core Components

| Component | File | Description |
|---|---|---|
| HLS Video Player | `components/hls-video-player.tsx` | Full-featured video player with HLS adaptive streaming, quality switching, and custom controls |
| File Upload | `components/fileUpload.tsx` | ImageKit-powered drag & drop file upload with progress |
| App Sidebar | `components/app-sidebar.tsx` | Collapsible navigation sidebar with page links |
| Header | `components/header.tsx` | Persistent header with auth state, theme toggle, and user menu |
| Login Form | `components/login-form.tsx` | Validated login form with error handling |
| Register Form | `components/register-form.tsx` | Registration form with password confirmation |
| Theme Provider | `components/theme-provider.tsx` | Dark/Light mode wrapper |

### Animated UI Primitives (`components/ui/`)

| Component | Effect |
|---|---|
| `particles.tsx` | Interactive particle field background |
| `meteors.tsx` | Falling meteor shower animation |
| `gradient-text.tsx` | Animated color-shifting gradient text |
| `shimmer-button.tsx` | Button with shimmer loading effect |
| `magnetic-button.tsx` | Button that follows cursor magnetically |
| `blur-text.tsx` | Text that blurs in on scroll |
| `shiny-text.tsx` | Text with a shiny sweep animation |
| `text-effect.tsx` | Text reveal/typewriter animations |
| `number-ticker.tsx` | Animated counting number display |
| `tilt-card.tsx` | 3D perspective tilt on hover |
| `glare-card.tsx` | Card with glare light effect on hover |
| `spotlight-card.tsx` | Card with spotlight follow effect |
| `border-beam.tsx` | Animated beam traveling along card border |
| `confetti.tsx` | Confetti burst celebration effect |
| `animated-list.tsx` | Staggered list item entrance animations |
| `vanish-input.tsx` | Input with vanishing placeholder text |

---

## 🗺️ Roadmap

Development is tracked in [PROJECT_ROADMAP.md](./PROJECT_ROADMAP.md). Summary of phases:

| Phase | Focus | Status |
|---|---|---|
| **Phase 1** | Video Feed, Video Player, Basic Search | 🔄 In Progress |
| **Phase 2** | User Profiles, Dashboard, Upload Page | 🔄 In Progress |
| **Phase 3** | Comments, Likes/Saves, Watch History | ⏳ Planned |
| **Phase 4** | Recommendations, Advanced Search, Analytics | ⏳ Planned |

---

## 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">
  Built with ❤️ using Next.js, MongoDB & ImageKit
</p>
