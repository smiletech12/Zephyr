import axios from "axios";

async function aiCommand(sock, m, text, config) {
  const from = m.messages[0].key.remoteJid;

  if (!text) {
    await sock.sendMessage(from, {
      text: "❌ Please provide a question!\n\nUsage: *.ai <your question>*",
    });
    return;
  }

  try {
    await sock.sendMessage(from, { text: "⏳ Thinking..." });

    // Replace with your actual AI API
    const response = await axios.get(
      `https://api.simsimi.net/v1/resp?text=${encodeURIComponent(text)}&lc=en`
    );

    const aiResponse = response.data.success
      ? response.data.response
      : "Sorry, I couldn't process that.";

    await sock.sendMessage(from, { text: `🤖 *AI Response*\n\n${aiResponse}` });
  } catch (error) {
    console.log("AI Error:", error.message);
    await sock.sendMessage(from, {
      text: "❌ Error communicating with AI. Please try again.",
    });
  }
}

export default aiCommand;
