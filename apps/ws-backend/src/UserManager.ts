import { WebSocket } from "ws";

// Interface defining the structure of a user connected to the WebSocket server
export interface User {
  ws: WebSocket;      // The WebSocket connection for this user
  rooms: string[];    // Array of room IDs the user has joined
  userId: string;     // Unique identifier for the user
}

// Singleton class to manage all connected users and their room memberships
export class UserManager {
  private static instance: UserManager;  // Singleton instance
  private users: User[] = [];            // Array to store all connected users

  // Private constructor to prevent direct instantiation (singleton pattern)
  private constructor() {}

  // Get the singleton instance of UserManager
  static getInstance(): UserManager {
    if (!UserManager.instance) {
      UserManager.instance = new UserManager();
    }
    return UserManager.instance;
  }

  // Add a new user to the manager when they connect
  addUser(user: User): void {
    this.users.push(user);
  }

  // Remove a user from the manager when they disconnect
  removeUser(ws: WebSocket): void {
    this.users = this.users.filter(user => user.ws !== ws);
  }

  // Find a user by their WebSocket connection
  findUserByWs(ws: WebSocket): User | undefined {
    return this.users.find(user => user.ws === ws);
  }

  // Add a user to a specific room if they're not already in it
  joinRoom(ws: WebSocket, roomId: string): void {
    const user = this.findUserByWs(ws);
    if (user && !user.rooms.includes(roomId)) {
      user.rooms.push(roomId);
    }
  }

  // Remove a user from a specific room
  leaveRoom(ws: WebSocket, roomId: string): void {
    const user = this.findUserByWs(ws);
    if (user) {
      user.rooms = user.rooms.filter(room => room !== roomId);
    }
  }

  // Get all users currently in a specific room
  getUsersInRoom(roomId: string): User[] {
    return this.users.filter(user => user.rooms.includes(roomId));
  }

  // Send a message to all users in a specific room
  broadcastToRoom(roomId: string, message: any): void {
    const usersInRoom = this.getUsersInRoom(roomId);
    usersInRoom.forEach(user => {
      user.ws.send(JSON.stringify(message));
    });
  }

  // Get all connected users (returns a copy to prevent external modification)
  getAllUsers(): User[] {
    return [...this.users]; // Return a copy to prevent external modification
  }

  // Get the total number of connected users
  getUserCount(): number {
    return this.users.length;
  }

  // Get the number of users in a specific room
  getRoomUserCount(roomId: string): number {
    return this.getUsersInRoom(roomId).length;
  }
}
