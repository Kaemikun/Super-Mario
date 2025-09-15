# Super Mario Game 🍄

A classic Super Mario Bros-style platformer game built entirely with vanilla HTML, CSS, and JavaScript. Experience the nostalgic gameplay of Mario with modern web technologies!

![Super Mario Game](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## 🎮 Game Features

- **Classic Platformer Gameplay**: Jump, run, and navigate through challenging levels
- **Mario Character**: Control the iconic plumber with smooth movement mechanics
- **Power-ups**: Collect mushrooms, fire flowers, and other classic power-ups
- **Enemies**: Face Goombas, Koopa Troopas, and other familiar foes
- **Coin Collection**: Gather coins for points and extra lives
- **Multiple Levels**: Progress through various world environments
- **Sound Effects**: Authentic retro sound effects and background music
- **Responsive Design**: Play on desktop and mobile devices
- **Local Storage**: Save your progress and high scores

## 🛠️ Technology Stack

- **HTML5**: Game structure and canvas element for rendering
- **CSS3**: Styling, animations, and responsive design
- **Vanilla JavaScript**: Game logic, physics, and user interactions
- **Canvas API**: 2D graphics rendering and sprite animations
- **Web Audio API**: Sound effects and background music
- **Local Storage API**: Save game progress and settings

## 📁 Project Structure

```
Super-Mario/
│
├── index.html              # Main HTML file
├── css/
│   ├── style.css          # Main stylesheet
│   ├── game.css           # Game-specific styles
│   └── responsive.css     # Mobile responsive styles
│
├── js/
│   ├── game.js            # Main game logic
│   ├── player.js          # Mario character controller
│   ├── enemies.js         # Enemy behavior and AI
│   ├── physics.js         # Physics engine
│   ├── levels.js          # Level data and management
│   ├── input.js           # Keyboard and touch controls
│   ├── audio.js           # Sound management
│   └── utils.js           # Utility functions
│
├── assets/
│   ├── images/
│   │   ├── sprites/       # Character and object sprites
│   │   ├── backgrounds/   # Level background images
│   │   └── ui/            # User interface elements
│   │
│   ├── sounds/
│   │   ├── sfx/          # Sound effects
│   │   └── music/        # Background music
│   │
│   └── fonts/            # Custom game fonts
│
├── levels/
│   ├── world1-1.json     # Level data files
│   ├── world1-2.json
│   └── ...
│
└── README.md             # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional but recommended for full functionality)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Kaemikun/Super-Mario.git
   cd Super-Mario
   ```

2. **Set up a local server (recommended)**
   
   Using Python:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   Using Node.js:
   ```bash
   npx http-server
   ```
   
   Using PHP:
   ```bash
   php -S localhost:8000
   ```

3. **Open the game**
   - Navigate to `http://localhost:8000` in your browser
   - Or simply open `index.html` directly in your browser

### Controls

- **Arrow Keys** / **WASD**: Move Mario left/right
- **Spacebar** / **Up Arrow**: Jump
- **Enter**: Start game / Pause
- **R**: Restart current level

**Mobile Controls:**
- Touch controls with on-screen buttons
- Swipe gestures for movement
- Tap to jump

## 🎯 Game Mechanics

### Physics System
- **Gravity**: Realistic falling mechanics
- **Collision Detection**: Precise pixel-perfect collisions
- **Momentum**: Smooth acceleration and deceleration
- **Jump Physics**: Variable jump height based on button press duration

### Power-up System
```javascript
// Example power-up implementation
class PowerUp {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type; // 'mushroom', 'fireflower', 'star'
  }
  
  apply(player) {
    switch(this.type) {
      case 'mushroom':
        player.grow();
        break;
      case 'fireflower':
        player.addFirePower();
        break;
    }
  }
}
```

### Enemy AI
- **Goomba**: Simple walking AI with direction changes at edges
- **Koopa Troopa**: Walking with shell mechanics when jumped on
- **Piranha Plant**: Timed emergence from pipes

### Level Design
- **Tile-based System**: Modular level construction
- **JSON Level Data**: Easy level editing and creation
- **Dynamic Loading**: Efficient memory usage for large levels

## 🎨 Graphics and Animation

### Sprite Management
```javascript
// Sprite animation system
class SpriteAnimation {
  constructor(spriteSheet, frameWidth, frameHeight) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.currentFrame = 0;
    this.frameCount = 0;
  }
  
  update() {
    this.frameCount++;
    if (this.frameCount >= this.frameSpeed) {
      this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
      this.frameCount = 0;
    }
  }
}
```

### CSS Animations
- Smooth transitions for UI elements
- Particle effects for coins and power-ups
- Background parallax scrolling

## 🔊 Audio System

### Sound Effects
- Jump sounds with pitch variation
- Coin collection chimes
- Enemy defeat sounds
- Power-up acquisition audio

### Background Music
- Level-specific background tracks
- Smooth looping system
- Volume controls and mute functionality

```javascript
// Audio management example
class AudioManager {
  constructor() {
    this.sounds = {};
    this.music = {};
    this.volume = 1.0;
  }
  
  playSound(soundName) {
    if (this.sounds[soundName]) {
      this.sounds[soundName].currentTime = 0;
      this.sounds[soundName].play();
    }
  }
}
```

## 📱 Responsive Design

The game adapts to different screen sizes:

- **Desktop**: Full keyboard controls, large game canvas
- **Tablet**: Touch controls with optimized button sizes
- **Mobile**: Compact layout with gesture support

## 🎮 Development Roadmap

### Phase 1: Core Mechanics ✅
- [x] Basic player movement
- [x] Jump physics
- [x] Collision detection
- [x] Level rendering

### Phase 2: Game Elements 🚧
- [ ] Enemy implementation
- [ ] Power-up system
- [ ] Coin collection
- [ ] Score system

### Phase 3: Polish & Features 📋
- [ ] Multiple levels
- [ ] Sound integration
- [ ] Save system
- [ ] Mobile optimization

### Phase 4: Advanced Features 🔮
- [ ] Multiplayer support
- [ ] Level editor
- [ ] Custom characters
- [ ] Online leaderboards

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/awesome-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**
   ```bash
   git commit -m "Add awesome feature"
   ```
6. **Push to your branch**
   ```bash
   git push origin feature/awesome-feature
   ```
7. **Open a Pull Request**

### Contribution Guidelines

- Follow the existing code style
- Add comments for complex logic
- Test your changes on multiple browsers
- Update documentation as needed
- Ensure responsive design compatibility

## 📚 Resources and References

### Learning Materials
- [HTML5 Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- [JavaScript Game Development](https://developer.mozilla.org/en-US/docs/Games)
- [CSS Animations Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)

### Assets and Tools
- [OpenGameArt](https://opengameart.org/) - Free game assets
- [Freesound](https://freesound.org/) - Audio resources
- [Tiled Map Editor](https://www.mapeditor.org/) - Level design tool

### Inspiration
- Original Super Mario Bros. (Nintendo, 1985)
- Web-based platformer games
- HTML5 game development community

## 🐛 Known Issues

- [ ] Occasional frame drops on older devices
- [ ] Sound delay on some mobile browsers
- [ ] Minor collision detection edge cases

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Nintendo for the original Super Mario Bros. inspiration
- The open-source game development community
- Contributors and testers

---

**Ready to jump into action? Start your Super Mario adventure today!** 🍄⭐
