<!-- BEGIN:nextjs-agent-rules -->
# Frontend Development Rules

## Architecture & Code Quality

1. All code must be modular, reusable, and maintainable.
2. Follow separation of concerns:

   * UI Components
   * Business Logic
   * API Layer
   * State Management
   * Validation Layer
3. Avoid duplicate code. Create reusable components, hooks, utilities, and services whenever possible.
4. Keep components small and focused on a single responsibility.
5. Use TypeScript strict typing. Avoid using `any` unless absolutely necessary.

---

## UI & Design System

1. All newly generated UI must follow the existing website design language.
2. Colors, typography, spacing, shadows, border radius, and component styles must remain consistent across the application.
3. Do not introduce random color palettes.
4. Reuse design tokens and theme variables whenever possible.
5. Ensure responsive design for mobile, tablet, and desktop devices.
6. Maintain visual consistency between public pages, dashboard pages, and admin pages.

---

## API Management

1. All API requests must be managed from a centralized API layer.
2. Do not call APIs directly inside UI components.
3. Create dedicated service files or use Redux Toolkit Query when appropriate.
4. API endpoints, request configuration, interceptors, and error handling must be maintained in a single centralized location.
5. Authentication token handling and refresh token logic must be managed globally.

---

## State Management

1. Use local state for component-specific data.
2. Use Redux Toolkit or Redux Toolkit Query for shared application state and server state when required.
3. Avoid unnecessary prop drilling.
4. Keep global state minimal and well-structured.

---

## Notifications & User Feedback

1. Every API action must provide user feedback.
2. Success responses should trigger a success toast notification.
3. Failed responses should trigger an error toast notification.
4. Unexpected errors should display a generic error toast.
5. Loading states must be visible to users during API requests.

---

## Forms & Validation

1. Use React Hook Form with Zod validation.
2. Display validation errors clearly next to the relevant fields.
3. Forms must not automatically close when an API request fails.
4. Forms should remain open until:

   * The user manually closes them, or
   * The operation completes successfully.
5. Preserve user-entered data when validation or API errors occur.
6. Disable duplicate form submissions while a request is in progress.

---

## SEO & Rendering

1. All public-facing pages must be SEO-friendly and using SSR.
2. Use Server-Side Rendering (SSR) or Server Components wherever appropriate.
3. Generate proper metadata for every public page:

   * title
   * description
   * keywords
   * Open Graph tags
   * Twitter tags
4. Use semantic HTML structure.
5. Ensure pages are crawlable by search engines.
6. Optimize Core Web Vitals and page performance.
7. Use structured data (Schema.org) where applicable.

---

## Performance

1. Use server components by default unless client-side interactivity is required.
2. Lazy-load heavy components.
3. Optimize images and assets.
4. Minimize unnecessary re-renders.
5. Use pagination, filtering, and caching for large datasets.

---

## Security

1. Never expose secrets or private keys on the frontend.
2. Sanitize and validate all user input.
3. Protect authenticated routes.
4. Implement role-based access control where required.
5. Follow secure authentication and authorization practices.

---

## Code Generation Rules

1. Generate production-ready code only.
2. Follow the existing project folder structure.
3. Follow established naming conventions.
4. Include proper error handling.
5. Include loading states.
6. Include TypeScript types/interfaces.
7. Include comments only when they add meaningful value.
8. Prioritize scalability, maintainability, and long-term project growth.

<!-- END:nextjs-agent-rules -->
