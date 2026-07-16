import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
} from "@whiskeysockets/baileys";
import pino from "pino";
import chalk from "chalk";
import handler from "./lib/handler.js";
import config from "./config.js";
import readline from "readline";

const logger = pino({ level: "silent" });

// Create readline interface for pairing code input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function startBot() {
  try {
    console.log(chalk.cyan("⚡ ZEPHYR WhatsApp Bot Starting..."));

    const { state, saveCreds } = await useMultiFileAuthState("./session");

    const sock = makeWASocket({
      auth: state,
      logger: logger,
      browser: ["Ubuntu", "Chrome", "20.0.04"],
      syncFullHistory: false,
      markOnlineOnConnect: true,
      retryRequestDelayMs: 10,
    });

    sock.ev.on("connection.update", async (update) => {
      const { connection, lastDisconnect, qr } = update;

      if (qr) {
        console.log(chalk.yellow("📱 Scan QR code OR use pairing code below:\n"));
        // Show QR code in terminal
        console.log(qr);
      }

      if (connection === "connecting") {
        console.log(chalk.yellow("🔄 Connecting..."));
      }

      if (connection === "open") {
        console.log(chalk.green("✅ Bot Connected Successfully!"));
        console.log(chalk.blue(`Developer: ${config.developer}`));
        console.log(chalk.blue(`Bot Name: ${config.botName}`));
        rl.close();
      }

      if (connection === "close") {
        let reason = new Error(
          lastDisconnect?.error?.output?.statusCode
        )?.message;

        if (lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut) {
          console.log(chalk.red("❌ Device logged out. Delete session folder to restart."));
          process.exit();
        } else if (lastDisconnect?.error?.output?.statusCode === DisconnectReason.restartRequired) {
          console.log(chalk.yellow("🔄 Restart required..."));
          startBot();
        } else {
          console.log(chalk.yellow(`⚠️ Connection closed: ${reason}`));
          setTimeout(startBot, 5000);
        }
      }
    });

    // Handle pairing code request
    sock.ev.on("call", async (node) => {
      if (node[0].tag === "offer" && node[0].attrs.type === "call") {
        const pairingCode = await sock.requestPairingCode(node[0].attrs.from);
        console.log(chalk.green("\n📲 PAIRING CODE:"), chalk.yellow.bold(pairingCode));
        console.log(chalk.cyan("Use this code to pair on your phone!\n"));
      }
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async (m) => {
      await handler(sock, m, config);
    });

  } catch (error) {
    console.log(chalk.red("❌ Error:", error));
    setTimeout(startBot, 10000);
  }
}

startBot();
