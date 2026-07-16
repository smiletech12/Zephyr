import chalk from "chalk";
import menuCommand from "./commands/menu.js";
import aiCommand from "./commands/ai.js";
import groupCommand from "./commands/group.js";
import ownerCommand from "./commands/owner.js";
import toolsCommand from "./commands/tools.js";

async function handler(sock, m, config) {
  try {
    const message = m.messages[0];

    if (!message.message) return;

    const messageType = Object.keys(message.message)[0];
    let body = "";

    if (messageType === "conversation") {
      body = message.message.conversation;
    } else if (messageType === "extendedTextMessage") {
      body = message.message.extendedTextMessage.text;
    } else {
      return;
    }

    const isCmd = body.startsWith(config.prefix);
    const command = isCmd ? body.slice(1).trim().split(/ +/).shift().toLowerCase() : "";
    const args = body.trim().split(/ +/).slice(1);
    const text = args.join(" ");
    const from = message.key.remoteJid;
    const sender = message.key.participant;
    const isGroup = from.includes("@g.us");

    console.log(
      chalk.cyan(`[${new Date().toLocaleTimeString()}]`),
      chalk.green(`From: ${sender || from}`),
      chalk.blue(`Command: ${command || "message"}`)
    );

    if (isCmd) {
      switch (command) {
        case "menu":
          await menuCommand(sock, m, config);
          break;
        case "ai":
          await aiCommand(sock, m, text, config);
          break;
        case "group":
          await groupCommand(sock, m, text, isGroup, config);
          break;
        case "owner":
          await ownerCommand(sock, m, text, config);
          break;
        case "tools":
          await toolsCommand(sock, m, text, config);
          break;
        default:
          await sock.sendMessage(from, {
            text: `❌ Command *${command}* not found!\n\nType *.menu* for all commands.`,
          });
      }
    }
  } catch (error) {
    console.log(chalk.red("❌ Handler Error:", error.message));
  }
}

export default handler;
