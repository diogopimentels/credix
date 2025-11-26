# Credix Frontend

Frontend application for the Credix loan management system.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **TailwindCSS** for styling
- **shadcn/ui** for UI components
- **Framer Motion** for animations
- **React Router** for navigation
- **Zustand** for state management
- **MSW** for API mocking
- **Recharts** for data visualization

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This will start the development server on http://localhost:5173

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/         # Page components
│   ├── lib/           # Utilities and helpers
│   ├── store/         # Zustand state management
│   ├── mocks/         # MSW mock handlers
│   └── utils/         # Utility functions
├── public/            # Static assets
├── api/               # Mock API handlers
└── data/              # Mock database
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm test` - Run tests with Vitest
