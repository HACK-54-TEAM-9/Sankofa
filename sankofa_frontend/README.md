# Sankofa-Coin Website

A React + TypeScript web application for Sankofa-Coin - Transforming plastic pollution into predictive health intelligence and healthcare access across Ghana.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000/`

## 📦 Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint

## 🛠️ Tech Stack

- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI, shadcn/ui
- **Icons:** Lucide React
- **Animation:** Framer Motion
- **Charts:** Recharts
- **Backend:** Supabase
- **Notifications:** Sonner

## 📁 Project Structure

```
sankofa_v2/
├── components/          # React components
│   ├── ui/             # UI component library
│   ├── figma/          # Figma-related components
│   ├── HomePage.tsx
│   ├── AboutPage.tsx
│   └── ...
├── hooks/              # Custom React hooks
├── styles/             # Global styles
├── utils/              # Utility functions
│   └── supabase/       # Supabase configuration
├── src/                # Main application entry
│   └── main.tsx
├── App.tsx             # Root component
├── index.html          # HTML entry point
├── vite.config.ts      # Vite configuration
├── tailwind.config.js  # Tailwind configuration
└── tsconfig.json       # TypeScript configuration
```

## 🎨 Features

- **Home Page:** Overview of Sankofa-Coin mission and impact
- **Location Insights:** Health data and insights by location
- **AI Assistant:** Interactive AI-powered assistance
- **Collector Dashboard:** For waste collectors to manage collections
- **Hub Manager Dashboard:** For hub managers to oversee operations
- **Volunteer Portal:** Volunteer registration and management
- **Donations:** Donation processing
- **See & Report:** Community reporting feature
- **Blog:** News and updates
- **Data Insights:** Analytics and visualizations

## 🔒 Authentication

The application uses Supabase for authentication with role-based access:
- **Collectors:** Access to collection dashboard and location insights
- **Hub Managers:** Access to hub management, transactions, and registrations
- **Public Users:** Access to public pages

## 🌐 Environment

The application connects to Supabase backend. Configuration is in `utils/supabase/info.tsx`.

## 📝 Notes

- Some image assets are referenced as placeholders and need to be replaced with actual images
- The application includes responsive design for mobile and desktop
- Dark mode support is built-in but not activated by default

## 🐛 Known Issues

- Some Figma asset imports are currently using placeholders
- Consider adding environment variables for Supabase configuration in production

## 📄 License

All rights reserved © 2025 Sankofa Ghana Ltd.

## 🤝 Contributing

For contribution guidelines, please contact the development team.

---

**"Se wo were fi na wosankofa a yenkyi"**  
*"It is not wrong to go back for that which you have forgotten"*
