# BrightPath

**Know What to Work On. Start Early. Stay Ahead.**

BrightPath is an academic support app that connects to Google Classroom and transforms assignments into actionable guidance. No more last-minute cramming.

## Features

### Smart Start
Know exactly when to start each assignment based on complexity and your workload.

### Progress Tracking
Visual tracking by subject. See trends, spot patterns, celebrate improvements.

### Parent Dashboard
Parents get clarity without micromanaging. See workload health and risk alerts.

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **External APIs**: Google Classroom API

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Google Cloud Console project (for Classroom API)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bright-path.git
   cd bright-path
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Configure your `.env.local` with:
   - Supabase URL and keys
   - Google OAuth credentials

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
├── lib/
│   ├── supabase/        # Supabase client configuration
│   └── utils/           # Utility functions
└── middleware.ts        # Auth middleware
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## Documentation

- [AI Integration Guide](./docs/ai-integration.md) - Guide for adding AI features

## License

MIT
