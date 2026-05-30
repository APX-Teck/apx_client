# APX Official Frontend Portal 🚀

Welcome to the **APX Official Frontend** project. This is a modern, high-performance web portal built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and styled using **Tailwind CSS v4**.

It is the user interface layer of the APX ecosystem, communicating with the [APX Official Backend](APX/BACKEND/README.md) to provide role-based dashboard experiences, content delivery, payment processing, service request pipelines, and CRM capabilities.

---

## 🔑 Key Features & Role-Based Views

The portal is architected around three core user roles:

1. **Admin (`(admin)`)**:
   - Full user, role, and permission management.
   - Module access controls and pricing slot setup.
   - Dynamic service fields configuration and request assignment.
   - Invoicing, payment verification, and audit pipelines.
   - Lead assignment and conversion metrics.
   - CRM operations, enquiries management, FAQ editing, and banner configurations.

2. **Employee (`(employee)`)**:
   - Task management boards (viewing assigned items, updating progress).
   - Leads tracking and follow-up logging.
   - Handling assigned customer service requests.
   - Expense reimbursement submissions and tracker.

3. **Customer (`(customer)`)**:
   - Custom service requests with interactive dynamic forms.
   - File uploads (identity verification, receipts, project requirements).
   - Invoices view, payment link access, and payment proof submission.
   - Real-time task and order progress updates.

---

## 📂 Project Directory Structure

```
frontend/
├── src/
│   └── app/
│       ├── (roles)/              # Role-specific layouts and dashboard views
│       │   ├── (admin)/          # Admin-specific routes and layouts
│       │   ├── (customer)/       # Customer-specific routes and layouts
│       │   └── (employee)/       # Employee-specific routes and layouts
│       ├── components/           # Reusable UI components (Buttons, Modals, Forms, etc.)
│       ├── hooks/                # Custom React Hooks (e.g., auth checks, layout helpers)
│       │   └── useAuth.ts        # Custom authorization and session hook
│       ├── lib/
│       │   └── api/              # Centralized API service layer
│       │       └── auth.api.ts   # Authentication-related API endpoints
│       ├── types/                # TypeScript models, typings, and validation schemas
│       │   └── auth.types.ts     # Auth types and models
│       ├── globals.css           # Tailwind CSS imports & global design tokens
│       ├── layout.tsx            # Main root layout configuration
│       └── page.tsx              # Public home page / landing page
├── AGENTS.md                     # Agent development rules and specifications
├── CLAUDE.md                     # Claude development guidelines (mirrors AGENTS.md)
├── package.json                  # Dependencies and execution scripts
└── tsconfig.json                 # TypeScript compiler configuration
```

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: [Next.js](https://nextjs.org/) (v16.2.6) - App Router and React Server Components (RSC)
- **Library**: [React](https://react.dev/) (v19.2.4)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict typing enforced)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) (v4.x) with PostCSS
- **Tooling**: [ESLint](https://eslint.org/) (v9.x)

---

## 📐 Core Architecture & Styling Guidelines

Developers working on this project must adhere to the rules specified in [AGENTS.md](file:///d:/Custom/MCA/Project/APX/frontend/AGENTS.md):

*   **Modular Architecture**: Keep components small, reusable, and single-responsibility.
*   **Design System & Theme Consistency**:
    - Use design tokens and Tailwind theme variables. Do not hardcode arbitrary color palettes.
    - Build responsive layouts supporting mobile, tablet, and desktop viewports.
*   **API Management**:
    - All requests must be handled via the centralized API layer under [src/app/lib/api](file:///d:/Custom/MCA/Project/APX/frontend/src/app/lib/api).
    - Do not perform fetch calls directly inside visual UI components.
*   **State Management**:
    - Use React local state for component-level UI status.
    - Integrate Redux Toolkit (or RTK Query) only for shared, complex backend-synchronized states.
*   **Forms & Validation**:
    - Build forms using **React Hook Form** paired with **Zod** schema validations.
    - Do not close forms automatically if an API action fails; keep inputted user data intact.
    - Disable submit buttons to prevent double-submits when requests are pending.
*   **User Feedback & Notifications**:
    - Every asynchronous action should display appropriate loader states.
    - Display toast notifications for successes, client validation issues, and server errors.
*   **SEO & SSR**:
    - Use Server Components and SSR by default for public pages.
    - Every public page must contain dynamic, well-defined SEO metadata (Title, Description, OG/Twitter tags).

---

## 🚀 Getting Started

### 📋 Prerequisites

- **Node.js**: `v20.x` or higher recommended.
- **npm** or **yarn** / **pnpm**.
- Running [APX Backend Service](file:///d:/Custom/MCA/Project/APX/BACKEND/README.md).

### ⚙️ Installation

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### 💻 Running the Application

*   **Development Mode** (with hot-reloading):
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

*   **Production Build**:
    ```bash
    npm run build
    ```

*   **Start Production Server** (after building):
    ```bash
    npm run start
    ```

*   **Lint Check**:
    ```bash
    npm run lint
    ```

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the `frontend` root to manage connections and variables (do not commit secrets to Git):

```env
# URL for the APX backend API
NEXT_PUBLIC_API_URL=http://localhost:8090/api/v1
```
