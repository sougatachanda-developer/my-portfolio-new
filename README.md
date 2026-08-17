# ⚡ Modern Developer Portfolio & Headless CMS

A production-ready, ultra-performant senior developer portfolio and headless CMS built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Three.js / WebGL Shaders**, and **Supabase**.

Designed with rich aesthetics, glassmorphism UI tokens, micro-animations, interactive CLI terminals, and full real-time CMS management.

![Next.js](https://img.shields.io/badge/Next.js-16.3-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

---

## ✨ Key Features

- 🎨 **Modern Aesthetics & Dual Theme**: Custom dark/light design system with HSL-tailored colors, high-contrast typography, and smooth theme toggling.
- 🌌 **WebGL Ambient Canvas Shader**: Interactive GPU-accelerated dot matrix background with real-time mouse cursor spotlight tracking (`HeroShader.tsx`).
- ⌨️ **Developer CLI Terminal (`Cmd + K`)**: Built-in interactive command line interface accessible via `Cmd + K` or `Ctrl + K` with custom executable commands (`help`, `skills`, `experience`, `bio`, `contact`, `theme`, `clear`).
- 💼 **Interactive Tech Stack Filters & Case Studies**: Filterable career role timeline with detailed modal lightboxes, technical architecture breakdowns, and metrics.
- 📜 **Verified Credentials & Certificates**: High-res certificate preview modals with verification links and skills tags.
- 💬 **Leadership Endorsements**: Recommendation quote carousel featuring endorsements from CTOs, Engineering Leads, and Clients.
- 🔊 **Tactile Web Audio Sound FX**: Zero-dependency Web Audio API mechanical click sound effects engine with navbar mute/unmute control.
- 🎛️ **Headless CMS Dashboard (`/admin`)**: Secure administrative suite to edit all site copy, hero status, work history, skills, certificates, testimonials, and feature toggles in real time.
- 🛡️ **Dual CMS Storage Engine**: Automatically syncs changes to Cloud PostgreSQL (Supabase) and falls back gracefully to local filesystem storage (`data.json`).
- 🚨 **Maintenance Mode**: One-click CMS switch to place the portfolio under maintenance with customizable visitor status copy.
- 🔍 **SEO & Social Cards**: Pre-configured OpenGraph cards, Twitter preview metadata, and `schema.org/Person` JSON-LD structured data for search engines.
- 🔒 **Secure Contact API**: Server-side contact handler (`/api/contact`) with CSRF protection, rate limiting, and input sanitization.

---

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | [Next.js 16 (App Router)](https://nextjs.org/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) & Vanilla CSS Tokens |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Graphics** | WebGL / GLSL Shaders via HTML5 Canvas |
| **Audio** | Web Audio API (Synthesized) |
| **Database & Auth** | [Supabase PostgreSQL](https://supabase.com/) |
| **Package Manager** | `pnpm` / `npm` / `yarn` |

---

## 🚀 Quick Start & Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/my-portfolio.git
cd my-portfolio
```

### 2. Install dependencies

```bash
pnpm install
# or
npm install
```

### 3. Set up Environment Variables

Create a `.env.local` file in the root directory:

```env
# Optional Supabase Database Connection
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Administrative CMS Security Key
ADMIN_SECRET_KEY=your-super-secret-admin-passcode
```

### 4. Run the local development server

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the portfolio.

---

## 🎛️ CMS & Admin Dashboard

Access the CMS dashboard at [http://localhost:3000/admin](http://localhost:3000/admin).

### Features Managed via CMS:
- **Hero & Identity**: Headline, subheadline, availability status, resume link, social URLs, and core stack ticker items.
- **Feature Control Switches**:
  - `[x] Enable Day / Night Theme Toggle`
  - `[x] Enable Interactive Command Terminal (Cmd + K)`
  - `[x] Enable Leadership Endorsements Section`
  - `[x] Enable Tactile Sound Effects Engine`
  - `[x] Enable Site Maintenance Mode`
- **Career Timeline**: Roles, companies, dates, highlights, case studies, and custom tech stack filter pills.
- **Certificates**: Titles, issuers, dates, images, and verification URLs.
- **Endorsements**: Recommendations, author titles, companies, quotes, and relationship tags.
- **About & Bio**: Title highlight, bio paragraphs, photo URL, and engineering principles.
- **Section Titles**: Custom section tags (`// 01_WORK`, `// 02_CERTIFICATES`, etc.).

---

## 📦 Project Structure

```text
.
├── app/
│   ├── admin/             # CMS Admin Dashboard & Login Routes
│   ├── api/
│   │   ├── cms/           # Secure Headless CMS API Handler
│   │   └── contact/       # Secure Contact Form API Handler
│   ├── layout.tsx         # Root Layout, SEO Tags, JSON-LD Schema
│   └── page.tsx           # Main Portfolio Entry Point
├── components/            # Reusable UI Components
│   ├── AboutSection.tsx
│   ├── CaseStudyModal.tsx
│   ├── Certificates.tsx
│   ├── CommandTerminal.tsx
│   ├── ContactSection.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   ├── HeroShader.tsx     # GPU WebGL Shader Canvas
│   ├── HowIBuild.tsx
│   ├── MaintenancePage.tsx
│   ├── Navbar.tsx
│   ├── TestimonialsSection.tsx
│   └── WorkExperience.tsx
├── lib/
│   ├── audio.ts           # Web Audio API Synthesizer
│   ├── data.ts            # Default Fallback Dataset
│   ├── types.ts           # TypeScript Domain Definitions
│   └── supabase/          # Supabase Client & Server Utilities
└── public/                # Static Assets (Images, Favicon, Resume)
```

---

## ⚡ Deployment

### Deploying to Vercel (Recommended)

1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Add your environment variables (`ADMIN_SECRET_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, etc.).
4. Click **Deploy**.

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

Crafted with ⚡ by **[Sougata Chanda](https://github.com/sougatachanda)**
