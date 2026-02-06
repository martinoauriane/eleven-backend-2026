
import { User } from "../generated/client";
import { UserService } from "../service/userService";
import { Request, Response } from "express";
import {UserCreate} from "../store/interfaces/userInterfaces";

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
        const userCreated = await userService.createUser(user);
        res.status(200).json(userCreated);
    } catch (error) {
        res.status(500).json({ error: "Error creating new user" });
    }
    }

    async returnUser(req: Request, res: Response) {
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

    async updateUser(req: Request, res: Response) {
        const id = Number(req.params.id);
        const data = req.body;
        try {
            const updatedUser = await userService.updateUser(id, data);
            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(500).json({ error: "Error updating user" });
        }
    }

    async deleteUser(req: Request, res: Response) {
        const id = Number(req.params.id);
        try {
            await userService.deleteUser(id);
            res.status(200).json({ message: "User deleted successfully" });
        } catch (error) {
            res.status(500).json({ error: "Error deleting user" });
        }
    }
}

export { UserController };
