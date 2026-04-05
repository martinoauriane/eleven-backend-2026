import { UserService } from "../service/userService";
import { Request, Response } from "express";
import { UserCreate } from "../store/interfaces/userInterfaces";

const userService = new UserService();

class UserController {
  async newUser(req: Request, res: Response) {
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

  async getAll(req: Request, res: Response) {
    try {
      const userList = await userService.getAll();
      res.status(200).json(userList);
    } catch (error) {
      res.status(500).json({ error: "Error retrieving all users in db" });
    }
  }

  async getUserFriends(req: Request, res: Response) {
    console.log("route has functionned");
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

  async returnUser(req: Request, res: Response) {
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

  async addFriend(req: Request, res: Response) {
    try {
      console.log(req.body);
      const userId = req.body.userId;
      const friendId = req.body.friendId;
      console.log("friendId", friendId);
      console.log("userId", userId);
      console.log("friendship successfully updated");
      const updatedUser = await userService.addNewFriend(userId, friendId);
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(500).json({ error: "Error adding friend" });
    }
  }
}

export { UserController };
