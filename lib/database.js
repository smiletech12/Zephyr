import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, "../database/database.json");

class Database {
  constructor() {
    this.data = this.load();
  }

  load() {
    try {
      const data = fs.readFileSync(dbPath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.log("Database load error, creating new...");
      return { users: [], groups: [], settings: {} };
    }
  }

  save() {
    fs.writeFileSync(dbPath, JSON.stringify(this.data, null, 2));
  }

  addUser(userId, userData) {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) {
      this.data.users.push({ id: userId, ...userData });
      this.save();
    }
  }

  getUser(userId) {
    return this.data.users.find((u) => u.id === userId);
  }

  getAllUsers() {
    return this.data.users;
  }

  deleteUser(userId) {
    this.data.users = this.data.users.filter((u) => u.id !== userId);
    this.save();
  }

  addGroup(groupId, groupData) {
    const group = this.data.groups.find((g) => g.id === groupId);
    if (!group) {
      this.data.groups.push({ id: groupId, ...groupData });
      this.save();
    }
  }

  getGroup(groupId) {
    return this.data.groups.find((g) => g.id === groupId);
  }

  getAllGroups() {
    return this.data.groups;
  }

  deleteGroup(groupId) {
    this.data.groups = this.data.groups.filter((g) => g.id !== groupId);
    this.save();
  }
}

export default new Database();
