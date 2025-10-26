# Sankofa Coin Frontend

Sankofa Coin is a health-tech platform transforming plastic pollution into predictive health intelligence and healthcare access across Ghana.

## Features

- 🌍 **Location Health Insights** - AI-powered health risk analysis by region
- ♻️ **Plastic Collection System** - Earn money and NHIS tokens by collecting plastic
- 🏥 **Hub Management** - Tools for collection hub managers
- 🤖 **AI Assistant** - 24/7 health guidance and support
- 📊 **Data Insights** - Real-time environmental and health data

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

4. Start the development server:

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Supabase** - Backend and authentication
- **Radix UI** - Accessible components
- **Framer Motion** - Animations
- **Recharts** - Data visualization

## Project Structure

```
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   └── ...          # Page components
├── hooks/           # Custom React hooks
├── styles/          # Global styles
├── utils/           # Utility functions
│   └── supabase/    # Supabase client
├── App.tsx          # Main app component
└── src/main.tsx     # App entry point
```

## License

© 2025 Sankofa Ghana Ltd. All rights reserved.

---

*"Se wo were fi na wosankofa a yenkyi"* - It is not wrong to go back for that which you have forgotten
