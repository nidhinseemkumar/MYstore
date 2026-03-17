# MYstore - Multi-Vendor E-Commerce Platform

A modern, full-stack e-commerce marketplace built with React, Vite, Tailwind CSS, and Supabase. The platform supports seamless shopping experiences and distinct dashboards tailored for Buyers, Sellers, and Administrators.

![Live Demo](https://img.shields.io/badge/Live%20Demo-Available-success?style=for-the-badge&logo=vercel)

**Website:** [https://m-ystore-one.vercel.app](https://m-ystore-one.vercel.app)

---

## 🌟 Key Features

### Role-Based Access Control (RBAC)
- **Buyers:** Can browse products, manage their cart, place orders, write reviews, and track their order history.
- **Sellers:** Dedicated dashboard to manage inventory, track total sales/revenue, update products, and fulfill orders.
- **Administrators:** Global management view across all users, sellers, categories, and site-wide analytics.

### Modern Tech Stack
- **Frontend Framework:** React + Vite for blazing-fast development and optimized production builds.
- **Styling:** Tailwind CSS for a fully responsive, modern, and accessible user interface.
- **State Management:** Zustand for lightweight, fast, and scalable global state management across components.
- **Backend & Database:** Supabase (PostgreSQL) for secure authentication, real-time database updates, and row-level security (RLS).
- **Routing:** React Router DOM for clean navigation and protected routes based on user roles.
- **Icons:** Lucide React for consistent and crisp vector icons.

### Core Marketplace Capabilities
- **Real-time Inventory:** Product stock dynamically updates upon checkout.
- **Order Management:** Sellers and Buyers have localized views of active and past orders.
- **Dynamic Categories:** Admins can manage the storefront taxonomy dynamically.
- **Secure Authentication:** User accounts and sessions managed securely via Supabase Auth.
- **Reviews & Ratings:** Buyers can leave verified reviews on purchased items.

---

## 🚀 Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) installed on your machine.
You will also need a [Supabase](https://supabase.com/) project to connect the backend.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/MYstore.git
   cd MYstore
   ```

2. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

3. **Install the dependencies:**
   ```bash
   npm install
   ```

4. **Set up Environment Variables:**
   Create a `.env` file in the `frontend` directory based on the `.env.example` template:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Initialize Database:**
   Apply the SQL schema files located in the `backend/` directory to your Supabase project using the SQL Editor to set up the appropriate tables, functions, and initial data.

6. **Start the development server:**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

---

## 📂 Project Structure

```text
MYstore/
├── backend/            # Supabase SQL configurations and definitions
│   ├── SUPABASE_SETUP.sql
│   ├── SUPABASE_ORDERS.sql
│   └── ...
├── frontend/           # React frontend application
│   ├── public/         # Static assets
│   ├── src/            
│   │   ├── assets/     # Images & icons
│   │   ├── components/ # Reusable React components
│   │   ├── data/       # Static mock data references
│   │   ├── layouts/    # Role-based dashboard layouts (Admin/Seller/Buyer)
│   │   ├── lib/        # Utility integrations (e.g., Supabase client)
│   │   ├── pages/      # Route pages separated by Roles
│   │   ├── store/      # Zustand state slices
│   │   ├── types/      # TypeScript definitions (if applicable)
│   │   ├── App.jsx     # App entry & Router setup
│   │   └── main.jsx    # DOM rendering
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## 📜 Scripts

Available in the `frontend` directory:

- `npm run dev`: Starts the Vite development server.
- `npm run build`: Bundles the application for production.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint to identify code style issues.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/your-username/MYstore/issues) if you want to contribute.

## 📝 License

This project is licensed under the MIT License.
