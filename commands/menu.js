async function menuCommand(sock, m, config) {
  const menu = `
╔════════════════════════════════════════╗
║        ⚡ ZEPHYR WhatsApp Bot ⚡       ║
║           By: ${config.developer}          ║
╚════════════════════════════════════════╝

📋 *AVAILABLE COMMANDS*

🎮 *GENERAL*
  *.menu* - Show this menu
  *.ping* - Check bot status
  *.about* - About the bot

🤖 *AI COMMANDS*
  *.ai <question>* - Ask AI anything
  *.imagine <prompt>* - Generate image

👥 *GROUP COMMANDS*
  *.gc <text>* - Send message to all groups
  *.gcinvite* - Get group invite links

👑 *OWNER COMMANDS*
  *.broadcast <text>* - Broadcast message
  *.setprefix <prefix>* - Change command prefix

🛠️ *TOOLS*
  *.sticker* - Convert image to sticker
  *.tts <text>* - Text to speech
  *.qr <text>* - Generate QR code

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Made with ❤️ by DEV SMILE
`;

  await sock.sendMessage(m.messages[0].key.remoteJid, { text: menu });
}

export default menuCommand;
