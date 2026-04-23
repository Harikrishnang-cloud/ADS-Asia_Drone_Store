# <p align="center">Asia Drone Store (ADS)</p>


<p align="center">
  <a href="#-about">About</a> •
  <a href="#-key-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Structure</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS">
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase">
</p>

---

## About
**Asia Drone Store (ADS)** is a premium e-commerce platform specializing in high-performance UAVs, professional-grade drone components, and specialized flight accessories. Built with a focus on speed, reliability, and user experience, ADS provides a seamless shopping journey for drone enthusiasts and professionals alike.

## Key Features
- **Modern UI/UX**: Clean, responsive, and high-performance interface built with Next.js and Tailwind CSS.
- **Advanced Product Filtering**: Search and filter by category, price range, and popularity.
- **Smart Search Suggestions**: Dynamic search bar with live product and category recommendations.
- **Secure Authentication**: Robust user authentication system powered by Firebase.
- **Admin Dashboard**: Full-featured management system for inventory, orders, and user data.
- **Payment Integration**: Secure transaction processing with Razorpay.
- **Dynamic SEO**: Automated sitemap generation and metadata optimization for maximum visibility.
- **Mobile First**: Optimized for a premium experience on all devices, from desktops to smartphones.

## Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Library**: [React 18](https://reactjs.org/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Toast Notifications**: [React Hot Toast](https://react-hot-toast.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Database/Auth**: [Firebase](https://firebase.google.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Payment**: [Razorpay](https://razorpay.com/)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Harikrishnang-cloud/ADS-Asia_Drone_Store.git
   cd FrontEnd or BackEnd
   ```

2. **Frontend Setup**
   ```bash
   cd FrontEnd
   npm install
   npm run dev
   ```

3. **Backend Setup**
   ```bash
   cd ../BackEnd
   npm install
   npm run dev
   ```

4. **Environment Variables**
   Create a `.env.local` file in the `FrontEnd` directory and a `.env` file in the `BackEnd` directory with your respective API keys and configurations (Firebase, Razorpay, etc.).

## Project Structure

```text
ADS/
├── FrontEnd/          # Next.js Application
│   ├── src/app/       # Routes and Pages
│   ├── components/    # Reusable UI Components
│   ├── hooks/         # Custom React Hooks
│   ├── types/         # TypeScript Interfaces
│   └── public/        # Static Assets
├── BackEnd/           # Express Server
│   ├── src/           # Source Code (Repository Pattern)
│   ├── dist/          # Compiled JS
│   └── serviceAccountKey.json
└── docs/              # Documentation Assets
```

## License
Distributed under the ISC License. See `LICENSE` for more information.

## Author
**HARIKRISHNAN G**
- GitHub: [GitHub](https://github.com/Harikrishnang-cloud)
- Project: [Asia Drone Store](https://github.com/Harikrishnang-cloud/ADS-Asia_Drone_Store)

---
<p align="center">Built by <a href="https://www.asiasoftlab.in">Asia Soft Lab</a> and developed by <a href="https://www.linkedin.com/in/harikrishnan-g-1315721b7/">Harikrishnan G</a></p>

