import makeWASocket from "@whiskeysockets/baileys";

/**
 * Baileys Configuration Module
 * Handles all Baileys socket configurations
 */

export const baiLeysConfig = {
  printQRInTerminal: true,
  browser: ["Ubuntu", "Chrome", "20.0.04"],
  syncFullHistory: false,
  markOnlineOnConnect: true,
  retryRequestDelayMs: 10,
  qrTimeout: 60000,
  defaultQueryTimeoutMs: undefined,
  generateHighQualityLinkPreview: true,
  patchMessageBeforeSending: (message) => {
    const requiresPatch =
      !!message.deviceSentMessage ||
      !!message.message ||
      !!message.senderKeyDistributionMessage;
    if (requiresPatch) {
      return {
        deviceSentMessage: {
          message: message,
        },
      };
    }
    return message;
  },
};

export default baiLeysConfig;
