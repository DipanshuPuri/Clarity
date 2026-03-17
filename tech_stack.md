# Tech Stack Documentation

Clarity is built on a modern, high-performance web stack designed for "Context-First Workflow Architecture".

## Frontend Layer
- **Core Framework**: [React.js](https://react.dev/) (v18+) with [Vite](https://vitejs.dev/) for high-speed development and builds.
- **Visual Architecture**:
  - **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first, responsive design.
  - **Icons**: [Lucide React](https://lucide.dev/) for a consistent, professional SVG icon set.
  - **Animations**: Custom Tailwind-based transitions and Framer Motion (where applicable).
  - **Typography**: Optimized Inter/System UI fonts.
- **Workflow Visualization**: [React Flow](https://reactflow.dev/) for the interactive DAG (Directed Acyclic Graph) workflow engine.
- **Client Logic**:
  - **Routing**: [React Router DOM](https://reactrouter.com/) for SPA navigation.
  - **State Management**: React Context API (e.g., `WorkflowContext`, `AuthContext`) for global state without Redux overhead.
  - **API Interaction**: [Axios](https://axios-http.com/) for orchestrated HTTP requests.

## Backend Layer
- **Runtime**: [Node.js](https://nodejs.org/) (LTS).
- **Web Framework**: [Express.js](https://expressjs.com/) for RESTful API orchestration.
- **Data Architecture**:
  - **Database**: [PostgreSQL](https://www.postgresql.org/) for robust relation data management.
  - **ORM**: [Prisma](https://www.prisma.io/) for type-safe database access and automated migrations.
- **Security**:
  - **Authentication**: JWT (JSON Web Tokens) with cross-origin cookie support.
  - **Password Hashing**: `bcrypt` for secure credential storage.

## Tools & DevOps
- **Package Management**: `npm`.
- **Environment**: Multi-environment config (`.env`) for development and production parity.
- **Asset Generation**: Custom Python scripts and Node.js seeders for realistic high-density mock data.
