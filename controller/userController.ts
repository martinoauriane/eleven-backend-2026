import { UserService } from "../service/userService";
import { Request, Response } from "express";
import { UserCreate } from "../store/interfaces/userInterfaces";

const userService = new UserService();

class UserController {

  async createUser(req: Request, res: Response) {
    const user: UserCreate = {
      firstName: String(req.body.firstName),
      lastName: String(req.body.lastName),
      email: req.body.email,
      password: String(req.body.password),
      homeAddress: String(req.body.homeAddress),
    };
    try {
      const userCreated = await userService.createUser(user);
      res.status(200).json(userCreated);
    } catch (error) {
      res.status(500).json({ error: "Error creating new user" });
    }
  }

    async checkUser(req: Request, res:Response){
      const userLogin = {
        email: req.body.email,
        password : req.body.password
      }     
      try{
        const loggedUser = await userService.logInUser(userLogin);
        res.status(200).json(loggedUser);
      }catch(error){
      res.status(500).json({ error: "Error checking user credentials" });
      }
    }

    async getUser(req: Request, res: Response) {
    const id = Number(req.params.id);
    console.log("user id", id);
    try {
      const user = await userService.getUserById(id);
      if (user) {
        res.status(200).json(user);
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error retrieving user" });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const userList = await userService.getAllUsers();
      res.status(200).json(userList);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving all users in db" });
    }
  }

  async addFriend(req: Request, res: Response) {
    try {
      const userId = req.body.userId;
      const friendId = req.body.friendId;
      const updatedUser = await userService.addNewFriend(userId, friendId);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Error adding friend" });
    }
  }

  async getUserFriends(req: Request, res: Response) {
    const id: string = String(req.params.id);
    try {
      const friendsList = await userService.getUserFriends(id);
      if (friendsList) {
        res.status(200).json(friendsList);
      } else {
        res.status(404).json({ error: "Error returning user friends list" });
      }
    } catch (error) {
      res.status(500).json({ error: "Error returning user friends list" });
    }
  }

  async updateUser(req: Request, res: Response) {
    const data = req.body;
    const id = Number(req.query.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    try {
      const updatedUser = await userService.updateUser(data, id);
      res.status(200).json(updatedUser);
    } catch (error: any) {
      console.error("Prisma update error:", error);

      res.status(500).json({
        error: "Error updating user",
        details: error.message, // 🔥 envoie le message réel au front
      });
    }
  }

  async addFavoriteEvent(req: Request, res: Response) {
    const eventId = req.params.eventId;
    const userId = req.params.userId;
    try {
      const favoriteEvent = await userService.addEventFavorite(userId, eventId);
      res.status(200).json(favoriteEvent);
    } catch (error: any) {
      console.error("Prisma adding event favorite error:", error);
      res.status(500).json({
        error: "Error adding event to favorite",
        details: error.message,
      });
    }
  }

  async removeFavoriteEvent(req: Request, res: Response) {
    const eventId = req.params.eventId;
    const userId = req.params.userId;
    try {
      const removedEvent = await userService.removeEventFavorite(
        userId,
        eventId,
      );
      res.status(200).json(removedEvent);
    } catch (error: any) {
      console.error("Prisma removing event favorite error:", error);
      res.status(500).json({
        error: "Error removing favorite event",
        details: error.message,
      });
    }
  }

  async getUserFavoriteEvents(req: Request, res: Response) {
    const userId = req.params.id;
    try {
      const userFavoriteEvents = await userService.getUserFavorite(userId);
      res.status(200).json(userFavoriteEvents);
    } catch (error: any) {
      console.error("Prisma retrieving user favorite events error:", error);
      res.status(500).json({
        error: "Error retrieving user favorite events",
        details: error.message,
      });
    }
  }

  async deleteUser(req: Request, res: Response) {
    const id = Number(req.query.id);
    console.log("id", id);
    try {
      await userService.deleteUser(id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting user" });
    }
  }
}

export { UserController };
