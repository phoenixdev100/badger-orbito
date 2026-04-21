# 🛡️ Eraser AI Prompt - Project: Badger (Unified Skill Dashboard)

Use this prompt to generate a complete visual and technical breakdown for the **Badger** project. 

---

## 🚀 1. The Core Invention: "Orbito Verified Portfolio"
**Description:** 
A unified "Developer Intelligence Dashboard" that aggregates performance metrics across multiple competitive programming and certification platforms (LeetCode, CodeChef, CodeStudio, Credly, and Codolio). 
**Key Innovation:** 
The **Orbito Verification Protocol**—a seamless process where users inject a unique alphanumeric code into their public platform profiles. The backend then performs a secure "scrape-and-validate" operation to prove ownership without requiring OAuth for all platforms.

---

## 📐 2. System Flow & Diagrams

### 🔄 System Flow Diagram
- **Step 1: Onboarding** → User registers/logs in using JWT or Google Auth.
- **Step 2: Platform Selection** → User selects a platform (e.g., LeetCode) and provides their username.
- **Step 3: Verification** → System generates an `ORBITOxxxx` code. User pastes it on their LeetCode profile.
- **Step 4: Scrape & Sync** → Server verifies the code, syncs data, and applies mutual-exclusivity logic (if Codolio is connected, individual platforms are merged).
- **Step 5: Dashboard Visualization** → Aggregated metrics are presented in a unified UI.
- **Step 6: Privacy Control** → User toggles `isPublic` visibility for specific platform badges.

### 🏗️ High-Level Design (HLD)
- **Client (React):** Single-page application handling authentication, platform linking, and dashboard rendering.
- **Server (Express/Node):** RESTful API managing business logic, verification controllers, and external data fetching services.
- **Database (MongoDB):** Persistent storage for User profiles, Platform metadata, and Verification history.
- **External Services Layer:** Modular scrapers and API consumers (LeetCode GraphQL, Credly API, etc.).

### ⚙️ Low-Level Design (LLD)
- **Controller Layer (`platformController.js`):** Implements mutual-exclusivity logic and visibility toggles.
- **Service Layer (`*Service.js`):** Encapsulates platform-specific fetching logic and ownership verification.
- **Model Layer (`userModel.js`):** Nested schema architecture for tracking multiple platforms per user with specialized status flags.

---

## 🔷 3. Use Case Diagram (Project-Specific)

🔷 1. 👤 Developer (Primary User)
🎯 Goal:
Aggregate all engineering skills and certifications in one place for recruiters.

📌 Use Cases:
1. **Link Platform**
   - Actors: Developer
   - Description: Input platform username to initiate connection.
   - Precondition: Authenticated session.
   - Postcondition: Pending verification state created.
2. **Verify Ownership (Orbito Sync)**
   - Actors: Developer, Server
   - Description: Trigger backend verification via profile code check.
   - Includes: **Scrape Target Profile**
3. **Toggle Privacy**
   - Actors: Developer
   - Description: Choose which platforms are visible on the public dashboard.
4. **View Unified Dashboard**
   - Actors: Developer
   - Description: See aggregated stats (Rating, Badges, Solved Count).

🔷 2. 👤 Admin
🎯 Goal:
Maintain system integrity and monitor platform sync health.

📌 Use Cases:
1. **Manage Platform Config**
   - Description: Update scraper logic or platform availability.
2. **Audit System Usage**
   - Description: Monitor sync success rates and potential scraping blocks.
3. **Support Requests**
   - Description: Handle failed verification disputes.

🔷 3. 👤 Recruiter / Visitor
🎯 Goal:
Verify a candidate's actual skill levels across platforms.

📌 Use Cases:
1. **View Public Profile**
   - Description: Access a developer's dashboard via a unique URL.
2. **Verify Badge Authenticity**
   - Description: Click through to the original source via the verified link.

🔷 4. 🔥 Common Use Cases (All Roles)
✔ **Login / Register**
- Includes: Authenticate via Google or Email/Password.
✔ **Search Profiles**
- Browse verified developers by skill or platform.

---

## 📄 4. Schematics & Drawings

### 📊 Database Schema (MongoDB)
- **User Object:**
  - `name`, `email`, `password`
  - `platforms`: {
    - `leetcode`: { `username`, `verified`, `verificationCode`, `isPublic` }
    - `codechef`: ...
    - `credly`: ...
  }

### 🖼️ UI Drawing Instructions (Eraser AI)
- **Dashboard Layout:**
  - Left Sidebar: Platform Navigation (Linked/Unlinked status).
  - Main Panel: Grid of "Skill Cards" (Badges from Credly, Rating from LeetCode).
  - Top Bar: Global "Public/Private" toggle for the entire profile.
  - Interactive Modal: Step-by-step verification guide with the ORBITO code display.

### 🔌 API Schematics
- `POST /api/platforms/link`: Initiate linking.
- `PATCH /api/platforms/verify`: Perform scraper validation.
- `GET /api/platforms/data`: Fetch aggregated stats.
- `PUT /api/platforms/visibility`: Update `isPublic` flag.
