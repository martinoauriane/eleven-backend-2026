import { UserStore } from "../store/userStore";
import { hashPassword } from "./utils/hash";
import {
  UserCreate,
  UserUpdate,
} from "../store/interfaces/userInterfaces";

const userStore = new UserStore();

interface UserService {
  createUser(data: UserCreate): Promise<any>;
  getUserById(id: number): Promise<any>;
  updateUser(data: UserUpdate, id: number): Promise<any>;
  deleteUser(id: number): Promise<any>;
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

  async addNewFriend(userId: number, friendId: number){
    return userStore.addFriend(userId, friendId);
  }

  async logInUser(userLogin:any){
    const answer : string = await userStore.checkUser(userLogin);
    if (answer != undefined){
      return answer;
    } 
  }

  async getAllUsers(){
    return await userStore.getAllUsers();
  }

  async getUserFriends(userId: string): Promise<any> {
    return await userStore.getUserFriends(userId);
  }

  async getUserById(id: number) {
    return await userStore.getUserById(id);
  }

  async updateUser(data: UserUpdate, id: number) {
    return await userStore.updateUser(id, data);
  }

  async addEventFavorite(eventId:number, userId:number){
    return await userStore.addEventFavorite(eventId, userId);
  }

  async removeEventFavorite(eventId: any, userId:any){
    return await userStore.removeEventFavorite(eventId, userId);
  }

  async getUserFavorite(userId:any){
    return await userStore.getUserFavorites(userId);
  }
  
  async deleteUser(id: number) {
    return await userStore.deleteUser(id);
  }
}

export { UserService };
