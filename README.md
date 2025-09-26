<div align="center">
  
  # Card Duel
  
  > A sleek and modern card game built with Next.js and Tailwind CSS – Test your luck in this high-card duel!
  
  [![Next.js](https://img.shields.io/badge/Next.js-14-000000.svg)](https://nextjs.org)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8.svg)](https://tailwindcss.com)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6.svg)](https://www.typescriptlang.org)
  [![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://react.dev)
  [![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
</div>

## Features

- 🃏 Simple and engaging high-card gameplay
- 🎴 Custom designed card faces for royal cards
- 🌟 Animated card flips and effects
- 🏆 Score tracking and win streaks
- 📊 Win rate statistics
- 💫 Smooth animations and transitions
- 📱 Fully responsive design
- ⌨️ Keyboard controls support
- 🎨 Dark mode optimized

## Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/Marcus-Kodehode/Card-Duel.git
cd Card-Duel
```

2. **Install dependencies**

```bash
npm install
```

3. **Start the development server**

```bash
npm run dev
```

4. **Open your browser**

```
http://localhost:3000
```

## Built With

- **[Next.js](https://nextjs.org)** - React framework for production
- **[React](https://react.dev)** - JavaScript library for building user interfaces
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org)** - Typed superset of JavaScript

## Project Structure

```
Card-Duel/
├── app/
│   ├── globals.css      # Global styles and Tailwind imports
│   ├── layout.tsx       # Root layout with metadata
│   └── page.tsx         # Main application page
├── components/
│   ├── Card.tsx        # Card component with flip animation
│   └── Game.tsx        # Main game logic and UI
├── lib/
│   └── deck.ts         # Deck creation and card logic
└── public/
    └── images/
        ├── cards/      # Custom card images
        └── icons/      # UI icons
```

## Game Rules

1. Click "DEAL" or press Space/Enter to start a round
2. Each player gets one card
3. The player with the higher card wins the round
4. Build your streak by winning consecutive rounds
5. Press R to reset the game at any time

## Card Values

- Ace: 14 points
- King: 13 points
- Queen: 12 points
- Jack: 11 points
- Number cards (2-10): Face value

## Controls

- **Space/Enter** - Deal cards
- **R** - Reset game

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on how to submit pull requests.

## Browser Support

- Chrome/Chromium 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## Building for Production

```bash
npm run build
```

The optimized build will be available in the `.next/` directory.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  <i>"Not all those who wander are lost, but in this game, the highest card wins!"</i>
  <br>
  <sub>Built with ❤️ by Marcus-Kodehode</sub>
</div>
