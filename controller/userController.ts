import { UserService } from "../service/userService";
import { Request, Response } from "express";
import { UserCreate } from "../store/interfaces/userInterfaces";
import { MoodStatus } from "@prisma/client";
import { toMoodStatus } from "../service/utils/interfaces";
import jwt from "jsonwebtoken";

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

  async loginUser(req: Request, res: Response) {
    const userLogin = {
      email: req.body.email,
      password: req.body.password,
    };
    try {
      const loggedUser = await userService.logInUser(userLogin);
      if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is missing in environment variables");
      }
      const token = jwt.sign(
        { userId: loggedUser?.id },
        process.env.JWT_SECRET!,
        { expiresIn: "7d" },
      );
      res.status(200).json({
        user: loggedUser,
        token,
      });
    } catch (error: any) {
      console.error("LOGIN ERROR:", error);
      res.status(500).json({ message: error.message });
    }
  }

  async getUser(req: Request, res: Response) {
    const id = Number(req.params.id);
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
      const userId = parseInt(String(req.params.userId));
      const friendId = parseInt(String(req.params.friendId));
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
      const mappedData = {
        ...data,
        status: toMoodStatus(data.status),
      };
      const updatedUser = await userService.updateUser(id, mappedData);
      res.status(200).json(updatedUser);
    } catch (error: any) {
      console.error("Prisma update error:", error);
      res.status(500).json({
        error: "Error updating user",
        details: error.message,
      });
    }
  }

  async updateUserStatus(req: Request, res: Response) {
    const userStatus = req.body.status;
    const userId = parseInt(String(req.params.userId));
    try {
      const updatedStatus = await userService.updateUserStatus(
        userId,
        userStatus,
      );
      res.status(200).json(updatedStatus);
    } catch (error: any) {
      console.error("Prisma update error:", error);
      res.status(500).json({
        error: "Error updating user status",
        details: error.message,
      });
    }
  }

  async addFavoriteEvent(req: Request, res: Response) {
    const eventId = parseInt(String(req.params.eventId));
    const userId = parseInt(String(req.params.userId));
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
    const userId = parseInt(String(req.params.userId));
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

  async addUserOnMap(req: Request, res: Response) {
    const user = {
      id: Number(req.params.userId),
      activity: req.body.activity,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      address: req.body.address,
    };
    try {
      const newUserOnMap = await userService.addUserOnMap(user);
      res.status(200).json(newUserOnMap);
    } catch (error: any) {
      res.status(500).json({
        error: "Error adding user on map",
        details: error.message,
      });
    }
  }

  async getUserFriendsStatuses(req: Request, res: Response) {
    const userId = parseInt(String(req.params.userId));
    console.log("inside user controller");
    try {
      let userFriendsArray = await userService.getUserFriendsStatuses(userId);
      return userFriendsArray;
    } catch (error: any) {
      res.status(500).json({
        error: "Error retrieving user friends statuses",
        details: error.message,
      });
    }
  }

  async getUsersOnMap(req: Request, res: Response) {
    let userId = parseInt(String(req.params.userId));

    try {
      let usersOnMap = await userService.getUsersOnMap(userId);
      res.status(200).json(usersOnMap);
    } catch (error: any) {
      res.status(500).json({
        error: "Error retrieving users on map",
        details: error.message,
      });
    }
  }

  async deleteUser(req: Request, res: Response) {
    const id = Number(req.query.id);
    try {
      await userService.deleteUser(id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting user" });
    }
  }
}

export { UserController };
