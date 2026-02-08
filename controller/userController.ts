
import { UserService } from "../service/userService";
import { Request, Response } from "express";

const userService = new UserService();

class UserController {
    
    async newUser(req: Request, res: Response) {
    const user: any = {
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

    async returnUser(req: Request, res: Response) {
        const id = Number(req.body.id);
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
                details: error.message // 🔥 envoie le message réel au front
            });
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
