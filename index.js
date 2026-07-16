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

// Create readline interface for phone number input
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
    console.log(chalk.cyan("⚡ ZEPHYR WhatsApp Bot Starting...\n"));

    const { state, saveCreds } = await useMultiFileAuthState("./session");

    // Check if already authenticated
    const isAuthenticated = state.creds?.me;

    if (!isAuthenticated) {
      console.log(chalk.yellow("📱 PAIRING MODE - Enter your WhatsApp phone number\n"));
      
      const phoneNumber = await question(
        chalk.blue("Enter phone number (e.g., 254712345678 or +254712345678): ")
      );

      // Clean phone number
      let cleanNumber = phoneNumber.replace(/[^0-9+]/g, "");
      if (cleanNumber.startsWith("+")) {
        cleanNumber = cleanNumber.substring(1);
      }

      console.log(chalk.cyan(`\n📲 Phone number: ${cleanNumber}`));
      console.log(chalk.yellow("⏳ Generating pairing code...\n"));

      rl.close();
    }

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
        console.log(chalk.yellow("📱 QR Code displayed below:\n"));
        console.log(qr);
        console.log(chalk.cyan("\nScan this QR code with your WhatsApp camera\n"));
      }

      if (connection === "connecting") {
        console.log(chalk.yellow("🔄 Connecting to WhatsApp..."));
      }

      if (connection === "open") {
        console.log(chalk.green("\n✅ Bot Connected Successfully!"));
        console.log(chalk.blue(`\nDeveloper: ${config.developer}`));
        console.log(chalk.blue(`Bot Name: ${config.botName}`));
        console.log(chalk.green(`\n🎉 ZEPHYR is ready to use!\n`));
        console.log(chalk.cyan("Type .menu in WhatsApp to see all commands\n"));
        if (rl.terminal) rl.close();
      }

      if (connection === "close") {
        let reason = new Error(
          lastDisconnect?.error?.output?.statusCode
        )?.message;

        if (lastDisconnect?.error?.output?.statusCode === DisconnectReason.loggedOut) {
          console.log(chalk.red("\n❌ Device logged out."));
          console.log(chalk.yellow("Delete the 'session' folder to restart pairing.\n"));
          process.exit();
        } else if (lastDisconnect?.error?.output?.statusCode === DisconnectReason.restartRequired) {
          console.log(chalk.yellow("🔄 Restart required..."));
          setTimeout(() => startBot(), 3000);
        } else {
          console.log(chalk.yellow(`\n⚠️ Connection closed: ${reason}`));
          console.log(chalk.yellow("Reconnecting in 5 seconds...\n"));
          setTimeout(() => startBot(), 5000);
        }
      }
    });

    // Listen for pairing code
    sock.ev.on("connection.update", async (update) => {
      if (update.isNewLogin) {
        console.log(chalk.green("✅ Pairing successful!\n"));
      }
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("messages.upsert", async (m) => {
      await handler(sock, m, config);
    });

  } catch (error) {
    console.log(chalk.red("❌ Error:", error.message));
    console.log(chalk.yellow("Retrying in 10 seconds...\n"));
    setTimeout(startBot, 10000);
  }
}

startBot();
