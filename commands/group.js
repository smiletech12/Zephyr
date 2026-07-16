async function groupCommand(sock, m, text, isGroup, config) {
  const from = m.messages[0].key.remoteJid;

  const subCommands = {
    invite: "Get group invite link",
    mute: "Mute group notifications",
    unmute: "Unmute group notifications",
    info: "Get group information",
    members: "List group members",
  };

  if (!text) {
    let helpText = "❌ *Group Commands Help*\n\n";
    for (const [cmd, desc] of Object.entries(subCommands)) {
      helpText += `*.group ${cmd}* - ${desc}\n`;
    }
    await sock.sendMessage(from, { text: helpText });
    return;
  }

  const [subCmd, ...args] = text.split(" ");

  switch (subCmd.toLowerCase()) {
    case "invite":
      if (!isGroup) {
        await sock.sendMessage(from, {
          text: "❌ This command only works in groups!",
        });
        return;
      }
      try {
        const inviteCode = await sock.groupInviteCode(from);
        await sock.sendMessage(from, {
          text: `📱 *Group Invite Link*\n\nhttps://chat.whatsapp.com/${inviteCode}`,
        });
      } catch (error) {
        await sock.sendMessage(from, {
          text: "❌ Failed to get invite link",
        });
      }
      break;

    case "info":
      if (!isGroup) {
        await sock.sendMessage(from, {
          text: "❌ This command only works in groups!",
        });
        return;
      }
      try {
        const groupMetadata = await sock.groupMetadata(from);
        const info = `
📊 *Group Information*

Name: ${groupMetadata.subject}
Description: ${groupMetadata.desc || "No description"}
Members: ${groupMetadata.participants.length}
Created: ${new Date(groupMetadata.creation * 1000).toLocaleDateString()}
Owner: ${groupMetadata.owner.split("@")[0]}
`;
        await sock.sendMessage(from, { text: info });
      } catch (error) {
        await sock.sendMessage(from, {
          text: "❌ Failed to get group info",
        });
      }
      break;

    default:
      await sock.sendMessage(from, {
        text: `❌ Unknown group subcommand: *${subCmd}*`,
      });
  }
}

export default groupCommand;
