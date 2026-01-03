# WanderWise - Your Travel Companion

A modern travel planning application built with React, TypeScript, and Supabase.

## Features

- **Explore Destinations**: Discover amazing places around the world
- **Trip Planning**: Create detailed itineraries with multiple stops
- **Activity Management**: Add activities to your trip destinations
- **Interactive Maps**: Visualize your trip routes with Leaflet maps
- **Budget Tracking**: Monitor your travel expenses
- **Multi-Currency Support**: Automatic currency detection (₹ for India, $ for others)

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Radix UI, Tailwind CSS
- **Maps**: Leaflet with OpenStreetMap
- **Backend**: Supabase (Database, Auth, Storage)
- **Deployment**: Ready for modern hosting platforms

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd wander-wise
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Add your Supabase credentials
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:8080](http://localhost:8080) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── activities/     # Activity-related components
│   ├── layout/         # Layout components
│   ├── map/           # Map components
│   └── ui/            # Base UI components
├── hooks/             # Custom React hooks
├── integrations/      # External service integrations
├── lib/              # Utility functions
└── pages/            # Application pages
```

## Deployment

Build the project for production:

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment to any static hosting service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.