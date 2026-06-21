# Tiny Scholars High School — CBSE K-10 School Website

A premium, modern, and highly interactive school portal website built for **Tiny Scholars High School, Hyderabad**. Styled with an established institution aesthetic using a cohesive Deep Navy (`#1B2A4A`) and Warm Gold (`#E8A33D`) theme, the site is designed to serve parents, students, and administrators.

---

## 🛠️ Tech Stack

- **Framework:** React 18 + Vite (fast build & dev cycles)
- **Styling:** TailwindCSS (v4) with custom utility directives
- **Animations:** Framer Motion (orchestrating timeline draws, staggered card slide-ins, and scroll-triggers)
- **Icons:** Lucide React
- **Routing:** React Router v6 (declarative routing with page transitions)

---

## 📂 Project Structure

```text
tour_website/                  # Root project directory
├── public/                    # Static public assets (logos, campus images)
├── src/                       # React frontend source code
│   ├── assets/                # Icons and vector graphics
│   ├── components/            # Shared layouts (Navbar, Footer, Chatbot, BackButton)
│   ├── views/                 # Core page views (Home, About, Academics, Admissions, Facilities, Gallery, News, Contact)
│   ├── App.css                # Global boilerplate layout styles
│   ├── App.jsx                # Router config & page transitions
│   ├── index.css              # Tailwind configuration, theme variables & global styles
│   └── main.jsx               # App entrypoint
├── vite.config.js             # Vite compiler configuration
├── tailwind.config.js         # Tailwind settings
└── README.md                  # Instructions manual
```

---

## ✨ Key Features & Interactive Animations

All animations have been configured with Framer Motion viewports (`once: false`) so they run smoothly every time a user scrolls into view.

1. **Academic Roadmap Timeline (Academics & Home)**:
   - A horizontal (desktop) or vertical (mobile) neutral grey line draws from 0% to 100% and transitions to gold as it scrolls into view.
   - Stage nodes (navy circles with gold borders and custom white icons) pop sequentially as the drawing line reaches them.
   - Stage cards slide/fade up in perfect sync with their nodes.
   - Clicking a card slides open a vertical curriculum details block (key subjects & highlights) with height/opacity transitions.

2. **Why Choose Us Carousel**:
   - Features a responsive, auto-rotating 3D Circular Card Wheel showing school highlights.
   - Fully optimized for responsiveness: displays a single-card view on mobile with bottom indicator dots, fits snug on tablets, and renders in a full 3D layout on desktop.

3. **Announcements Rows**:
   - Notices stagger in from the left. The most recent notice is highlighted with a gold border, gold-accented background, and a pulsing gold `✦ New` badge.
   - Click to expand notice details with an arrow rotation.

4. **Parent Testimonials**:
   - Auto-rotating testimonials slider that cycles every 4 seconds with clean crossfade animations.

5. **Admissions Assistant Chatbot**:
   - A bottom-right floating helper. Tapping options automatically shows response dialogues. Form fields auto-dismiss when alternative query routes are taken to keep the UI clean.

---

## 🚀 Setup & Execution Instructions

Follow these simple steps to run the website locally.

### Step 1: Clone the repository and install packages
Open your terminal in the project directory and install the dependencies:
```bash
npm install
```

### Step 2: Run the local development server
Start the Vite local development server:
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser to view the live site.

### Step 3: Compile for production
To check compilation validity or build the static output files under `/dist`:
```bash
npm run build
```

---
*Tiny Scholars High School, Hyderabad. Shaping Minds, Building Character.*
