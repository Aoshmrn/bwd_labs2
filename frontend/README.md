# Event Manager Frontend

A React TypeScript application for managing events.

## Setup

1. Install dependencies:
```bash
yarn install
```

2. Create `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:9090
```

## Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build locally

## Project Structure

```
src/
  api/          - API services and configuration
  components/   - Shared components
  context/      - React context providers
  hooks/        - Custom React hooks
  pages/        - Application pages
  utils/        - Utility functions
```

## Features

- User authentication (login/register)
- Protected routes
- Event management (view/create)
- Form handling with custom hooks
- Error handling and loading states
- Responsive design
