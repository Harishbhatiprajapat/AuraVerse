# 🌌 AuraVerse
**“Where Creativity Meets Impact.”**

AuraVerse is a next-generation gamified digital ecosystem designed to drive real-world civic and environmental change through futuristic UI/UX and addictive gamification mechanics.

---

## 🧩 1. Core Product Vision
AuraVerse transforms creative energy into measurable community impact.
- **Creativity:** Empower users to host and design their own missions.
- **Impact:** Reward verified environmental and civic contributions.
- **Gamification:** Earn **Aura Points (AP)**, level up from *Spark* to *Legend*, and climb the global leaderboards.

---

## 🎨 2. UI / UX Outlook (Premium Design)
The application features a **"Liquid Glass"** aesthetic inspired by high-end spatial computing interfaces.
- **Design Style:** Glassmorphism with frosted blur backgrounds, neon gradients, and floating UI elements.
- **Animations:** Liquid-smooth page transitions and staggered reveals powered by **Framer Motion**.
- **Interactive Effects:** GPU-accelerated mesh backgrounds, magnetic buttons, and an **AP Burst** particle explosion for rewards.

---

## 🚀 3. Key Features
- **Profile System:** Dynamic Aura visualization based on your impact type, featuring a "Digital Certificate" NFT-style showcase.
- **Mission Hub:** A centralized hub to discover active missions like *Ocean Plastic Recovery* or *Urban Forest Initiatives*.
- **Host System:** Empower users to deploy their own missions to the Verse with custom cover images and rewards.
- **Proof of Impact Ledger:** An immutable submission system where users upload photo evidence for instant point verification.
- **Collaboration Room:** A real-time community chat room for coordinating global missions and forming impact teams.
- **Functional Leaderboard:** Live-synced rankings showing the top 10 Aura Guardians in the ecosystem.

---

## 🏗️ 4. Tech Stack
### **Frontend**
- **React 19 + TypeScript:** For a robust, type-safe component architecture.
- **Vite:** High-performance build tooling.
- **Tailwind CSS v4:** For futuristic styling and glassmorphism utilities.
- **Framer Motion:** Advanced physics-based animations.
- **Lucide React:** Premium iconography.

### **Backend (Supabase-native)**
- **PostgreSQL:** Relational database for missions, profiles, and messages.
- **Supabase Auth:** Secure JWT-based identity management.
- **Supabase Storage:** S3-compatible cloud storage for mission evidence.
- **Supabase Real-time:** WebSocket-based syncing for chat and rankings.
- **Edge Functions (Deno):** Serverless logic for impact verification.

---

## 🛠️ 5. Setup & Deployment

### **Prerequisites**
- Node.js installed.
- A free [Supabase](https://supabase.com/) project.

### **Local Development**
1. **Clone the repo** (or download the folder).
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Environment:** Create a `.env` file in the root and add:
   ```env
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```
4. **Start the Verse:**
   ```bash
   npm run dev
   ```

### **Database Setup (Supabase SQL Editor)**
Run the migration scripts found in `supabase/migrations/` in the following order:
1. `20240220000000_initial_schema.sql` (Tables)
2. `20240308000000_final_slate.sql` (Default Data & Triggers)
3. `20240229000000_storage_final_fix.sql` (Storage Buckets)

---

## 🧠 Unique Winning Twist
AuraVerse uses a **Proof of Impact Ledger**. Unlike typical social apps, every point earned is backed by verified metadata, creating an immutable log of a user's real-world contributions to the planet.

---

## 📦 GitHub Deployment Note
Since `git` is not available in the development environment, please:
1. Initialize a new repo at `github.com/new`.
2. Select **"uploading an existing file"**.
3. Drag and drop the `src`, `supabase`, and `public` folders along with configuration files.

**Build with Passion. Create Impact. Change Reality.**
