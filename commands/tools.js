import axios from "axios";

async function toolsCommand(sock, m, text, config) {
  const from = m.messages[0].key.remoteJid;

  const tools = {
    sticker: "Convert image to sticker",
    tts: "Text to speech",
    qr: "Generate QR code",
    calculator: "Simple calculator",
    weather: "Get weather info",
  };

  if (!text) {
    let helpText = "🛠️ *Available Tools*\n\n";
    for (const [tool, desc] of Object.entries(tools)) {
      helpText += `*.tools ${tool}* - ${desc}\n`;
    }
    await sock.sendMessage(from, { text: helpText });
    return;
  }

  const [toolName, ...args] = text.split(" ");
  const input = args.join(" ");

  switch (toolName.toLowerCase()) {
    case "qr":
      if (!input) {
        await sock.sendMessage(from, {
          text: "❌ Usage: *.tools qr <text>*",
        });
        return;
      }
      try {
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(input)}`;
        await sock.sendMessage(from, {
          image: { url: qrUrl },
          caption: `📱 QR Code for: ${input}`,
        });
      } catch (error) {
        await sock.sendMessage(from, {
          text: "❌ Failed to generate QR code",
        });
      }
      break;

    case "tts":
      if (!input) {
        await sock.sendMessage(from, {
          text: "❌ Usage: *.tools tts <text>*",
        });
        return;
      }
      try {
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&q=${encodeURIComponent(input)}&client=tw-ob`;
        await sock.sendMessage(from, {
          audio: { url: ttsUrl },
          mimetype: "audio/mpeg",
        });
      } catch (error) {
        await sock.sendMessage(from, {
          text: "❌ Failed to generate TTS",
        });
      }
      break;

    case "calculator":
      if (!input) {
        await sock.sendMessage(from, {
          text: "❌ Usage: *.tools calculator <expression>*",
        });
        return;
      }
      try {
        const result = eval(input);
        await sock.sendMessage(from, {
          text: `🧮 *Calculator Result*\n\n${input} = ${result}`,
        });
      } catch (error) {
        await sock.sendMessage(from, {
          text: "❌ Invalid expression!",
        });
      }
      break;

    default:
      await sock.sendMessage(from, {
        text: `❌ Tool *${toolName}* not found!`,
      });
  }
}

export default toolsCommand;
