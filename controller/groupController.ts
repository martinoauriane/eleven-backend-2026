import { Request, Response } from "express";
import { GroupService } from "../service/groupService";

class GroupController {
  private groupService: GroupService;

  constructor() {
    this.groupService = new GroupService();
  }

  /**
   * POST /user/:userId/groups
   *
   * Body:
   * {
   *   "name": "Soirée Paris",
   *   "picture": "...",
   *   "memberIds": [2, 3, 4]
   * }
   */
  async createGroup(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);

      const {
        name,
        picture,
        memberIds,
      } = req.body;

      if (Number.isNaN(userId)) {
        return res.status(400).json({
          error: "Invalid userId",
        });
      }

      if (!name || typeof name !== "string") {
        return res.status(400).json({
          error: "Group name is required",
        });
      }

      if (!Array.isArray(memberIds)) {
        return res.status(400).json({
          error: "memberIds must be an array",
        });
      }

      const parsedMemberIds = memberIds.map(Number);

      if (parsedMemberIds.some((id) => Number.isNaN(id))) {
        return res.status(400).json({
          error: "memberIds must contain valid user IDs",
        });
      }

      const group = await this.groupService.createGroup(
        userId,
        name,
        picture ?? null,
        parsedMemberIds,
      );

      return res.status(201).json(group);
    } catch (error: any) {
      console.error("Error creating group:", error);

      return res.status(500).json({
        error: error.message || "Error creating group",
      });
    }
  }

  /**
   * GET /user/:userId/groups
   */
  async getUserGroups(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);

      if (Number.isNaN(userId)) {
        return res.status(400).json({
          error: "Invalid userId",
        });
      }

      const groups = await this.groupService.getUserGroups(
        userId,
      );

      return res.status(200).json(groups);
    } catch (error: any) {
      console.error("Error retrieving user groups:", error);

      return res.status(500).json({
        error:
          error.message || "Error retrieving groups",
      });
    }
  }

  /**
   * GET /user/:userId/groups/:groupId
   */
  async getGroupById(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const groupId = Number(req.params.groupId);

      if (Number.isNaN(userId)) {
        return res.status(400).json({
          error: "Invalid userId",
        });
      }

      if (Number.isNaN(groupId)) {
        return res.status(400).json({
          error: "Invalid groupId",
        });
      }

      const group = await this.groupService.getGroupById(
        groupId,
        userId,
      );

      if (!group) {
        return res.status(404).json({
          error: "Group not found",
        });
      }

      return res.status(200).json(group);
    } catch (error: any) {
      console.error("Error retrieving group:", error);

      return res.status(500).json({
        error:
          error.message || "Error retrieving group",
      });
    }
  }

  /**
   * POST /user/:userId/groups/:groupId/members
   *
   * Body:
   * {
   *   "userId": 5
   * }
   *
   * userId dans l'URL = celui qui effectue l'action
   * userId dans le body = personne à ajouter
   */
  async addMember(req: Request, res: Response) {
    try {
      const requesterId = Number(req.params.userId);
      const groupId = Number(req.params.groupId);
      const userId = Number(req.body.userId);

      if (Number.isNaN(requesterId)) {
        return res.status(400).json({
          error: "Invalid requester userId",
        });
      }

      if (Number.isNaN(groupId)) {
        return res.status(400).json({
          error: "Invalid groupId",
        });
      }

      if (Number.isNaN(userId)) {
        return res.status(400).json({
          error: "Invalid userId",
        });
      }

      const member = await this.groupService.addMember(
        groupId,
        userId,
        requesterId,
      );

      return res.status(201).json(member);
    } catch (error: any) {
      console.error("Error adding group member:", error);

      return res.status(400).json({
        error:
          error.message || "Error adding member",
      });
    }
  }

  /**
   * DELETE /user/:userId/groups/:groupId/members
   *
   * Body:
   * {
   *   "userId": 5
   * }
   *
   * userId dans l'URL = admin/requester
   * userId dans le body = membre à supprimer
   */
  async removeMember(req: Request, res: Response) {
    try {
      const requesterId = Number(req.params.userId);
      const groupId = Number(req.params.groupId);
      const userId = Number(req.body.userId);

      if (Number.isNaN(requesterId)) {
        return res.status(400).json({
          error: "Invalid requester userId",
        });
      }

      if (Number.isNaN(groupId)) {
        return res.status(400).json({
          error: "Invalid groupId",
        });
      }

      if (Number.isNaN(userId)) {
        return res.status(400).json({
          error: "Invalid userId",
        });
      }

      const result = await this.groupService.removeMember(
        groupId,
        userId,
        requesterId,
      );

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Error removing group member:", error);

      return res.status(400).json({
        error:
          error.message || "Error removing member",
      });
    }
  }

  /**
   * DELETE /user/:userId/groups/:groupId
   */
  async deleteGroup(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      const groupId = Number(req.params.groupId);

      if (Number.isNaN(userId)) {
        return res.status(400).json({
          error: "Invalid userId",
        });
      }

      if (Number.isNaN(groupId)) {
        return res.status(400).json({
          error: "Invalid groupId",
        });
      }

      const result = await this.groupService.deleteGroup(
        groupId,
        userId,
      );

      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Error deleting group:", error);

      return res.status(400).json({
        error:
          error.message || "Error deleting group",
      });
    }
  }
}

export { GroupController };