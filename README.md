# sse

A modern Next.js application built with TypeScript, Tailwind CSS v4, and React 19.

## Features

- ⚡ **Next.js 15.5.2** - Latest stable version
- ⚛️ **React 19.1.1** - Latest React with new features
- 🔷 **TypeScript 5.9.2** - Latest TypeScript
- 🎨 **Tailwind CSS v4.1.13** - Latest Tailwind with new features
- 🛡️ **Security** - No vulnerable dependencies
- 📱 **Responsive** - Mobile-first design
- 🌙 **Dark mode** - CSS variables for theming

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
sse/
├── components/          # Reusable components
│   ├── Layout.tsx      # Page layout wrapper
│   └── Navigation.tsx  # Navigation component
├── pages/              # Next.js pages
│   ├── _app.tsx        # App wrapper
│   ├── index.tsx       # Root page (redirects to home)
│   └── home/           # Home page
│       └── index.tsx
├── styles/             # Global styles
│   └── globals.css     # Tailwind CSS imports
├── next.config.js      # Next.js configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── tsconfig.json       # TypeScript configuration
└── package.json        # Dependencies
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server

## Tech Stack

- **Framework**: Next.js 15.5.2
- **Language**: TypeScript 5.9.2
- **Styling**: Tailwind CSS v4.1.13
- **Runtime**: React 19.1.1
- **Node Types**: @types/node 22.18.1

## Security

This template is built with security in mind:
- ✅ No vulnerable dependencies
- ✅ Latest stable versions
- ✅ Regular security audits recommended

## License

MIT
