// server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import { UserService } from "../service/userService";
import {UserController} from "../controller/userController";

const app = express();
const router = express.Router();
const PORT = process.env.SERVER_PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(router);


const userService = new UserService();  
const userController = new UserController;

// operationnal
router.get("/", async(req:Request, res:Response) =>{
  res.status(200).json("Welcome");
})

// operationnal
router.post("/new-user", async (req: Request, res: Response) => {
   await userController.newUser(req, res);
});

// operationnal
router.post("/get-user", async(req:Request, res:Response) => {
  await userController.returnUser(req, res);
})

// ongoing testing
router.post("/user-update", async(req:Request, res:Response) => {
  await userController.updateUser(req, res);
})

router.post("/user-delete", async(req:Request, res:Response) =>{
  await userController.deleteUser(req, res);
})


app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});


