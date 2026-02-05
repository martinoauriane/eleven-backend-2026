
import { User } from "../generated/client";
import { UserService } from "../service/userService";
import { Request, Response } from "express";
import {UserCreate} from "../store/userInterfaces";

const userService = new UserService();

class UserController {
    async newUser(req: Request, res: Response) {
    const user: any = {
    firstName: String(req.query.firstName),
    lastName: String(req.query.lastName),
    email: req.body.email,
    passwordHash: String(req.query.password),
    homeAddress: String(req.query.homeAddress),
  };
  try {
    const userCreated = userService.createUser(user);
    res.status(200).json("user successfully created");
  } catch (error) {
    res.status(500).json({ error: "Error creating new user" });
  }
}
}
