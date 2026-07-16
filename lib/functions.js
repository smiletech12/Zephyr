/**
 * Utility Functions for ZEPHYR Bot
 */

export function formatPhoneNumber(number) {
  return number.replace(/[^0-9]/g, "");
}

export function isValidPhoneNumber(number) {
  const cleaned = formatPhoneNumber(number);
  return cleaned.length >= 10 && cleaned.length <= 15;
}

export function getCurrentTime() {
  return new Date().toLocaleTimeString();
}

export function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function capitalizeWords(str) {
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
}

export function extractNumbers(str) {
  return str.match(/\d+/g) || [];
}

export function isValidJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch {
    return false;
  }
}

export function generateRandomId() {
  return Math.random().toString(36).substr(2, 9);
}
