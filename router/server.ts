// server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import { UserController } from "../controller/userController";
import { JoinRequestController } from "../controller/joinRequestController";
import { FriendRequestController } from "../controller/friendRequestController";
import { EventController } from "../controller/eventController";

const app = express();
const router = express.Router();
const PORT = process.env.SERVER_PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(router);

const userController = new UserController();
const joinRequestController = new JoinRequestController();
const friendRequestController = new FriendRequestController();
const eventController = new EventController();

// operationnal
router.get("/", async (req: Request, res: Response) => {
  res.status(200).json("Welcome");
});

// USER ENDPOINTS

// operationnal
router.post("/user/register", async (req: Request, res: Response) => {
  await userController.createUser(req, res);
});

// to test
router.post("/user/login", async (req: Request, res: Response) => {
  await userController.checkUser(req, res);
});

// operationnal
router.post("/user/:id", async (req: Request, res: Response) => {
  await userController.getUser(req, res);
});

//operationnal
router.get("/user/all", async (req: Request, res: Response) => {
  await userController.getAllUsers(req, res);
});

// operationnal
router.post("/user/update", async (req: Request, res: Response) => {
  await userController.updateUser(req, res);
});

//operationnal
router.post("/user/:id/friends", async (req: Request, res: Response) => {
  await userController.getUserFriends(req, res);
});

// add friend method
router.post("/user/add-friend", async (req: Request, res: Response) => {
  await userController.addFriend(req, res);
});

// to do: add favorites user endpoints
router.post(
  "/user/:userId/:eventId/add-event-favorites",
  async (req: Request, res: Response) => {
    await userController.addFavoriteEvent(req, res);
  },
);

// to do: remove favorites user endpoints
router.post(
  "/user/:userId/:eventId/remove-event-favorites",
  async (req: Request, res: Response) => {
    await userController.removeFavoriteEvent(req, res);
  },
);

// to do: get user favorite events endpoints
router.post(
  "/user/:userId/get-event-favorites",
  async (req: Request, res: Response) => {
    await userController.getUserFavoriteEvents(req, res);
  },
);

// operationnal
router.post("/user/delete", async (req: Request, res: Response) => {
  await userController.deleteUser(req, res);
});

router.post("/user/:userId/onmap", async (req: Request, res: Response) => {
  await userController.addUserOnMap(req, res);
});

router.get("/user/:userId/onmap-all", async (req: Request, res: Response) => {
  try {
    await userController.getUsersOnMap(req, res);
  } catch (err) {
    console.error("ERROR getAllEvents:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// add get a list of friends endpoint

// JOIN REQUEST ENDPOINTS

// operationnal
router.post(
  "/join-request/create/:emitter_id/:receiver_id",
  async (req: Request, res: Response) => {
    await joinRequestController.newJoinRequest(req, res);
  },
);

// operationnal
router.post(
  "/join-request/get/:emitter_id/:receiver_id",
  async (req: Request, res: Response) => {
    await joinRequestController.getJoinRequest(req, res);
  },
);

// operationnal
router.post(
  "/join-request/delete/:emitter_id/:receiver_id",
  async (req: Request, res: Response) => {
    await joinRequestController.deleteJoinRequest(req, res);
  },
);

// FRIEND REQUEST ENDPOINTS

// operationnal
router.post(
  "/friend-request/create/:emitter_id/:receiver_id",
  async (req: Request, res: Response) => {
    await friendRequestController.newFriendRequest(req, res);
  },
);

// operationnal
router.post(
  "/friend-request/get/:emitter_id/:receiver_id",
  async (req: Request, res: Response) => {
    await friendRequestController.getFriendRequest(req, res);
  },
);

// operationnal
router.post(
  "/friend-request/delete/:emitter_id/:receiver_id",
  async (req: Request, res: Response) => {
    await friendRequestController.deleteFriendRequest(req, res);
  },
);

// EVENT ENDPOINTS

// operationnal
router.post("/event/create/:userId", async (req: Request, res: Response) => {
  await eventController.newEvent(req, res);
});

// operationnal
router.post("/event/get/:eventId", async (req: Request, res: Response) => {
  await eventController.returnEventById(req, res);
});

// operationnal
router.get("/event/get/all", async (req: Request, res: Response) => {
  await eventController.getAllEvents(req, res);
});

// operationnal
router.post("/event/update/:event_id", async (req: Request, res: Response) => {
  await eventController.updateEvent(req, res);
});

// operationnal
router.post(
  "/event/addParticipant/:event_id/:user_id",
  async (req: Request, res: Response) => {
    await eventController.addParticipants(req, res);
  },
);

// operationnal
router.post(
  "/event/deleteParticipant/:user_id",
  async (req: Request, res: Response) => {
    await eventController.deleteParticipant(req, res);
  },
);

// operationnal
router.post("/event/delete/:event_id", async (req: Request, res: Response) => {
  await eventController.deleteEvent(req, res);
});

app.listen(process.env.SERVER_PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
