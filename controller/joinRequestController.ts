import { JoinRequestService } from "../service/joinRequestService";
import { Request, Response } from "express";
import { JoinRequestCreate } from "../store/interfaces/joinRequestInterfaces";

const joinRequestService = new JoinRequestService();

class JoinRequestController {
    async newJoinRequest(req: Request, res: Response){
        try {
        const joinRequest : JoinRequestCreate = {
            emitterId: req.body.emitterId,
            receiverId: req.body.receiverId,
        }
            const joinRequestCreated = await joinRequestService.createJoinRequest(joinRequest);
            res.status(200).json(joinRequestCreated);
        } catch(error){
            res.status(500).json({error: "Error creating new Join Request"});
        }
    }
}

export {JoinRequestController}
