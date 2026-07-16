async function ownerCommand(sock, m, text, config) {
  const from = m.messages[0].key.remoteJid;
  const sender = m.messages[0].key.participant;

  // Simple owner check (replace with actual owner logic)
  const isOwner = true; // Implement proper authentication

  if (!isOwner) {
    await sock.sendMessage(from, {
      text: "❌ This command is only for the bot owner!",
    });
    return;
  }

  const subCommands = {
    broadcast: "Send message to all users",
    setprefix: "Change command prefix",
    restart: "Restart the bot",
    status: "Set bot status",
  };

  if (!text) {
    let helpText = "👑 *Owner Commands*\n\n";
    for (const [cmd, desc] of Object.entries(subCommands)) {
      helpText += `*.owner ${cmd}* - ${desc}\n`;
    }
    await sock.sendMessage(from, { text: helpText });
    return;
  }

  const [subCmd, ...args] = text.split(" ");
  const message = args.join(" ");

  switch (subCmd.toLowerCase()) {
    case "broadcast":
      await sock.sendMessage(from, {
        text: `📢 Broadcasting: ${message}`,
      });
      break;

    case "restart":
      await sock.sendMessage(from, {
        text: "🔄 Restarting bot...",
      });
      process.exit();
      break;

    case "status":
      await sock.sendMessage(from, {
        text: `✅ Bot Status: Online\n📊 Version: ${config.botVersion}\n👤 Developer: ${config.developer}`,
      });
      break;

    default:
      await sock.sendMessage(from, {
        text: `❌ Unknown owner command: *${subCmd}*`,
      });
  }
}

export default ownerCommand;
