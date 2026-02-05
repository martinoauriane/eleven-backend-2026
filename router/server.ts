// server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import { UserService } from "../service/userService";

const app = express();
const router = express.Router();
app.use(cors());
app.use(express.json());
app.use(router);

const server = () => {
  app.listen(process.env.server_port, () => {
    console.log(`Server is running at http://${ENV.hostname}:${ENV.port}/`);
  });
};

router.post("/new-user", async (req: Request, res: Response) => {
    try {
        const userService = new UserService();  
        const newUser = await userService.createUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Failed to create user" });
    }
});

export { server };


