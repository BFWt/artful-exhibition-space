# Artful Exhibition Space

A modern React application for showcasing art exhibitions, built with Vite, TypeScript, and Tailwind CSS.

## Features

- 🎨 Exhibition gallery with detailed views
- 📱 Responsive design for all devices
- 🌐 Multi-language support (German/English)
- 🖼️ Image galleries with masonry layout
- 📅 Exhibition timeline and archive
- 🎯 Admin dashboard for content management
- 🐳 Docker deployment ready

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **Routing**: React Router DOM
- **State Management**: React Context
- **Database**: Supabase (optional)
- **Deployment**: Docker, GitHub Actions

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/BFWt/artful-exhibition-space.git
cd artful-exhibition-space
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Deployment

### Docker Deployment

The project includes a Dockerfile for containerized deployment:

```bash
# Build the Docker image
docker build -t artful-exhibition-space .

# Run the container
docker run -p 8080:80 artful-exhibition-space
```

### Automated Deployment

GitHub Actions workflow is configured for automatic deployment to VPS:

1. Set up the required secrets in your GitHub repository:
   - `VPS_HOST` - Your VPS IP address
   - `VPS_USER` - SSH username
   - `VPS_SSH_KEY` - Private SSH key

2. Push to the `main` branch to trigger automatic deployment

See `SETUP_GUIDE.md` for detailed deployment instructions.

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── admin/          # Admin dashboard components
│   └── exhibition-detail/ # Exhibition detail components
├── contexts/           # React contexts
├── data/              # Static data and types
├── hooks/             # Custom React hooks
├── lib/               # Utility libraries
├── pages/             # Page components
└── translations/      # Internationalization
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License.