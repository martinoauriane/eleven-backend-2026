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

  async logInUser(userLogin: any) {
    const loggedInUser = await userStore.loginUser(userLogin);
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

  async getUserFriendsStatuses(userId:number){
    return await userStore.getUserFriendsStatuses(userId);
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

  async updateUserStatus(userId:number, userStatus:any){
    return await userStore.UpdateUserStatus(userId, userStatus);
  }

  async deleteUser(id: number) {
    return await userStore.deleteUser(id);
  }
}

export { UserService };
