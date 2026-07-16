# 🚀 ZEPHYR WhatsApp Bot

A powerful and feature-rich WhatsApp bot built with **Baileys** and **Node.js**

---

## ⚡ Features

✅ **AI Integration** - Ask AI questions powered by SimSimi API  
✅ **Group Management** - Manage groups with ease  
✅ **Tools & Utilities** - QR Code, TTS, Calculator, and more  
✅ **Owner Commands** - Control the bot with owner-only commands  
✅ **Auto-Read Messages** - Automatically read incoming messages  
✅ **Fully Customizable** - Easy to extend and modify  

---

## 📦 Installation

### Prerequisites
- **Node.js** v16.0.0 or higher
- **npm** or **yarn**

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/smiletech12/ZEPHYR.git
cd ZEPHYR
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your settings
```

4. **Run the bot**
```bash
npm start
# Or with nodemon for development
npm run dev
```

5. **Scan QR Code**
- Open the terminal and scan the displayed QR code with your WhatsApp camera

---

## 📂 Project Structure

```
ZEPHYR/
├── index.js                 # Main bot entry point
├── config.js                # Configuration settings
├── .env                     # Environment variables
├── package.json             # Dependencies
│
├── commands/                # Command modules
│   ├── menu.js              # Menu command
│   ├── ai.js                # AI command
│   ├── group.js             # Group commands
│   ├── owner.js             # Owner commands
│   └── tools.js             # Utility tools
│
├── lib/                     # Libraries & utilities
│   ├── handler.js           # Message handler
│   ├── database.js          # Database operations
│   ├── functions.js         # Utility functions
│   └── baileys.js           # Baileys configuration
│
├── database/                # Data storage
│   └── database.json        # Database file
│
└── session/                 # WhatsApp session
    └── (auto-generated)
```

---

## 🎮 Available Commands

### General
- `.menu` - Show all commands
- `.ping` - Check bot status
- `.about` - About the bot

### AI Commands
- `.ai <question>` - Ask AI anything
- `.imagine <prompt>` - Generate images

### Group Commands
- `.group invite` - Get group invite link
- `.group info` - Get group information
- `.group members` - List group members

### Owner Commands
- `.owner broadcast <text>` - Broadcast message
- `.owner status` - Check bot status
- `.owner restart` - Restart the bot

### Tools
- `.tools qr <text>` - Generate QR code
- `.tools tts <text>` - Text to speech
- `.tools calculator <expression>` - Simple calculator

---

## ⚙️ Configuration

Edit `config.js` to customize:

```javascript
{
  developer: "DEV SMILE",        // Developer name
  botName: "ZEPHYR",             // Bot name
  prefix: ".",                   // Command prefix
  autoRead: true,                // Auto-read messages
  autoStatus: true,              // Auto-reply to status
  modePublic: true               // Public/private mode
}
```

---

## 🛠️ Development

### Add a New Command

1. Create a file in `commands/` folder
```javascript
// commands/mycommand.js
async function myCommand(sock, m, text, config) {
  const from = m.messages[0].key.remoteJid;
  await sock.sendMessage(from, { text: "Hello!" });
}
export default myCommand;
```

2. Import in `lib/handler.js`
```javascript
import myCommand from "./commands/mycommand.js";
```

3. Add to handler switch case
```javascript
case "mycommand":
  await myCommand(sock, m, text, config);
  break;
```

---

## 📝 License

MIT License - See LICENSE file for details

---

## 👨‍💻 Developer

**DEV SMILE** - All rights reserved

---

## ⚠️ Disclaimer

This bot is for educational purposes only. Make sure you comply with WhatsApp's Terms of Service.

---

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

Made with ❤️ by **DEV SMILE**
