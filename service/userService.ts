import { UserStore } from "../store/userStore";
import { hashPassword } from "./utils/hash";
import { UserCreate, UserUpdate } from "../store/interfaces/userInterfaces";

const userStore = new UserStore();

interface UserService {
  createUser(data: UserCreate): Promise<any>;
  getUserById(id: number): Promise<any>;
  updateUser(id: number, data: UserUpdate, ): Promise<any>;
  deleteUser(id: number): Promise<any>;
  updateUserStatus(userId:number, userStatus:any): Promise<any>;
  getFriendsMood(userId:number): Promise<any>;
}

class UserService {
  async createUser(user: UserCreate): Promise<any> {
    const passwordHash = await hashPassword(String(user.password));
    const userData: UserCreate = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      homeAddress: user.homeAddress,
      password: passwordHash,
    };
    return await userStore.createUser(userData);
  }

  async addNewFriend(userId: number, friendId: number) {
    return userStore.addFriend(userId, friendId);
  }

  async logInUser(email: string, password:string) {
    const loggedInUser = await userStore.loginUser(email, password);
    if (loggedInUser != undefined) {
      return loggedInUser;
    }
  }
  async getAllUsers() {
    return await userStore.getAllUsers();
  }

  async shareUserOnMap(user:any){
    return await userStore.shareUserOnMap(user);
  }

  async getFriendsOnMap(currentUserId: number) {
    return await userStore.getFriendsOnMap(currentUserId);
  }

  async getUserFriends(userId: string): Promise<any> {
    return await userStore.getUserFriends(userId);
  }

  async getUserById(id: number) {
    return await userStore.getUserById(id);
  }

  async updateUser(id: number, data: UserUpdate) {
    const passwordHash = await hashPassword(String(data.password));
    // updating data with new passwordHash
    data.password = passwordHash;
    return await userStore.updateUser(id, data);
  }

  async getFriendsMood(userId:number){
    return await userStore.getFriendsMood(userId);
  }

  async addEventFavorite(eventId: number, userId: number) {
    return await userStore.addEventFavorite(eventId, userId);
  }
  async removeEventFavorite(eventId: any, userId: any) {
    return await userStore.removeEventFavorite(eventId, userId);
  }

  async getUserEventFavorite(userId: any) {
    return await userStore.getUserEventFavorites(userId);
  }

  async createConversation(userId: number, friendId: number){
    return await userStore.createConversation(userId, friendId);
  }

  async getUserConversations(userId: number){
    return await userStore.getUserConversations(userId);
  }

  async addMessage(conversationId: number, message:string){
    return await userStore.addMessage(conversationId, message);
  }

  async getMessages(conversationId: number){
    return await userStore.getMessages(conversationId);
  }

  async updateMood(userId:number, userMood:any){
    return await userStore.updateMood(userId, userMood);
  }

  async deleteUser(id: number) {
    return await userStore.deleteUser(id);
  }
}

export { UserService };
