# 💕 Valentine's Week App - For Naman

A personalized mobile app with 8 days of puzzles celebrating Valentine's Week, created with love.

## 🌹 Features

### 8 Days of Love
1. **Rose Day (Feb 7)** - Find 10 hidden roses in your couple photo
2. **Propose Day (Feb 8)** - Heart matching memory game  
3. **Chocolate Day (Feb 9)** - Catch falling chocolates game
4. **Teddy Day (Feb 10)** - Jigsaw puzzle with your photo
5. **Promise Day (Feb 11)** - Memory card flip game
6. **Hug Day (Feb 12)** - Draw a big hug pattern
7. **Kiss Day (Feb 13)** - Love trivia questions
8. **Valentine's Day (Feb 14)** - Final romantic reveal

### Game Mechanics
- **Sequential Unlocking**: Days unlock one by one as you complete them
- **Replay Mode**: After completing all 8 days, replay any day anytime!
- **Personalized Quotes**: Each day ends with a custom romantic message
- **Progress Tracking**: Your progress is saved in the database

### Design
- **Theme**: Pink, black, and white color scheme
- **Beautiful UI**: Gradient backgrounds, smooth animations
- **Mobile-First**: Designed for touch interactions and mobile experience

## 🎮 How to Play

1. Start with **Rose Day** (only day unlocked initially)
2. Complete the puzzle to unlock the next day
3. Each day has a different puzzle type
4. Upon completion, read the personalized quote
5. Complete all 8 days to unlock **Replay Mode**

## 📱 Technical Stack

### Frontend
- **Expo** (React Native)
- **TypeScript**
- **expo-router** for navigation
- **expo-linear-gradient** for beautiful gradients
- **expo-av** for audio support (ready for background music)
- **react-native-svg** for drawing functionality

### Backend  
- **FastAPI** (Python)
- **MongoDB** for progress tracking
- **REST API** with /api prefix

### Key APIs
- `GET /api/progress` - Get user progress
- `POST /api/progress/complete` - Mark day as complete
- `POST /api/progress/reset` - Reset progress (testing)

## 💝 Personalized Quotes

- **Rose Day**: "i wish i could make this tulips day, so our 'two lips' could meet hehe. happy rose day cutu! 😘"
- **Propose Day**: "arre yeh toh already kar liya hai 😏, but happy propose day anyways!"
- **Chocolate Day**: "where's my chocolate, you chocolate boy?"
- **Teddy Day**: "happy teddy day to my living, breathing, tall, musuclar, charming teddy :)"
- **Promise Day**: "technically this day is about me, but i promise to also let the promises we have to made to each other shine forever ❤️"
- **Hug Day**: "BADAAAA SA HUG FOR YOU, MY HANDSOME BOY"
- **Kiss Day**: "hersheys kisses chahiye ya mere? wink wink 😉"
- **Valentine's Day**: "I hope to forever and always love you, with immense depth and joy. I love you to the moon and back, Naman 🌙✨"

## 🎨 Color Scheme
- Primary: #FF1493 (Deep Pink)
- Secondary: #FF69B4 (Hot Pink)
- Accent: #C71585 (Medium Violet Red)
- Background: #FFE5F0 (Light Pink)
- Text Dark: #8B0040 (Dark Maroon)
- White: #FFFFFF

## 📲 Access
- **Web Preview**: https://love-puzzle-week.preview.emergentagent.com
- **Expo Go**: Scan QR code from Expo dashboard

## 🎯 Future Enhancements (Optional)
- Add jazzy background music
- Add sound effects for puzzle completion
- Add animations between screens
- Add celebration confetti effects
- Save best scores/times for each puzzle

---

Made with 💕 for Naman
