import { Request, Response } from "express";
import { GroupService } from "../service/groupService";

class GroupController {
  private groupService: GroupService;

  constructor() {
    this.groupService = new GroupService();
  }

  /**
   * POST /group/create
   *
   * Body:
   * {
   *   "name": "Soirée Paris",
   *   "picture": "...",
   *   "createdBy": 1,
   *   "memberIds": [2, 3, 4],
   *   "eventId": 10
   * }
   */
  async createGroup(req: Request, res: Response) {
    try {
      const {
        name,
        picture,
        createdBy,
        memberIds,
        eventId,
      } = req.body;

      if (!name) {
        return res.status(400).json({
          error: "Group name is required",
        });
      }

      if (!createdBy) {
        return res.status(400).json({
          error: "createdBy is required",
        });
      }

      if (
        !Array.isArray(memberIds)
      ) {
        return res.status(400).json({
          error: "memberIds must be an array",
        });
      }

      const group =
        await this.groupService.createGroup({
          name,
          picture,
          createdBy: Number(createdBy),
          memberIds: memberIds.map(Number),
          eventId: eventId
            ? Number(eventId)
            : undefined,
        });

      return res.status(201).json(group);
    } catch (error: any) {
      console.error(
        "Error creating group:",
        error,
      );

      return res.status(500).json({
        error: error.message || "Error creating group",
      });
    }
  }

  /**
   * GET /group/:groupId
   */
  async getGroupById(
    req: Request,
    res: Response,
  ) {
    try {
      const groupId = Number(
        req.params.groupId,
      );

      if (Number.isNaN(groupId)) {
        return res.status(400).json({
          error: "Invalid groupId",
        });
      }

      const group =
        await this.groupService.getGroupById(
          groupId,
        );

      return res.status(200).json(group);
    } catch (error: any) {
      console.error(
        "Error retrieving group:",
        error,
      );

      return res.status(404).json({
        error:
          error.message || "Group not found",
      });
    }
  }

  /**
   * GET /user/:userId/groups
   */
  async getUserGroups(
    req: Request,
    res: Response,
  ) {
    try {
      const userId = Number(
        req.params.userId,
      );

      if (Number.isNaN(userId)) {
        return res.status(400).json({
          error: "Invalid userId",
        });
      }

      const groups =
        await this.groupService.getUserGroups(
          userId,
        );

      return res.status(200).json(groups);
    } catch (error: any) {
      console.error(
        "Error retrieving user groups:",
        error,
      );

      return res.status(500).json({
        error:
          error.message ||
          "Error retrieving groups",
      });
    }
  }

  /**
   * POST /group/:groupId/members
   *
   * Body:
   * {
   *   "userId": 5,
   *   "requesterId": 1
   * }
   */
  async addMember(
    req: Request,
    res: Response,
  ) {
    try {
      const groupId = Number(
        req.params.groupId,
      );

      const {
        userId,
        requesterId,
      } = req.body;

      if (
        Number.isNaN(groupId) ||
        !userId ||
        !requesterId
      ) {
        return res.status(400).json({
          error:
            "groupId, userId and requesterId are required",
        });
      }

      const member =
        await this.groupService.addMember(
          groupId,
          Number(userId),
          Number(requesterId),
        );

      return res.status(201).json(member);
    } catch (error: any) {
      console.error(
        "Error adding group member:",
        error,
      );

      return res.status(400).json({
        error:
          error.message ||
          "Error adding member",
      });
    }
  }

  /**
   * DELETE /group/:groupId/members/:userId
   *
   * Body:
   * {
   *   "requesterId": 1
   * }
   */
  async removeMember(
    req: Request,
    res: Response,
  ) {
    try {
      const groupId = Number(
        req.params.groupId,
      );

      const userId = Number(
        req.params.userId,
      );

      const requesterId = Number(
        req.body.requesterId,
      );

      if (
        Number.isNaN(groupId) ||
        Number.isNaN(userId) ||
        Number.isNaN(requesterId)
      ) {
        return res.status(400).json({
          error: "Invalid IDs",
        });
      }

      const result =
        await this.groupService.removeMember(
          groupId,
          userId,
          requesterId,
        );

      return res.status(200).json(result);
    } catch (error: any) {
      console.error(
        "Error removing member:",
        error,
      );

      return res.status(400).json({
        error:
          error.message ||
          "Error removing member",
      });
    }
  }

  /**
   * PATCH /group/:groupId
   *
   * Body:
   * {
   *   "requesterId": 1,
   *   "name": "Nouveau nom",
   *   "picture": "..."
   * }
   */
  async updateGroup(
    req: Request,
    res: Response,
  ) {
    try {
      const groupId = Number(
        req.params.groupId,
      );

      const {
        requesterId,
        name,
        picture,
      } = req.body;

      if (
        Number.isNaN(groupId) ||
        !requesterId
      ) {
        return res.status(400).json({
          error:
            "groupId and requesterId are required",
        });
      }

      if (!name && !picture) {
        return res.status(400).json({
          error:
            "Nothing to update",
        });
      }

      const updatedGroup =
        await this.groupService.updateGroup(
          groupId,
          Number(requesterId),
          {
            name,
            picture,
          },
        );

      return res.status(200).json(
        updatedGroup,
      );
    } catch (error: any) {
      console.error(
        "Error updating group:",
        error,
      );

      return res.status(400).json({
        error:
          error.message ||
          "Error updating group",
      });
    }
  }

  /**
   * DELETE /group/:groupId
   *
   * Body:
   * {
   *   "requesterId": 1
   * }
   */
  async deleteGroup(
    req: Request,
    res: Response,
  ) {
    try {
      const groupId = Number(
        req.params.groupId,
      );

      const requesterId = Number(
        req.body.requesterId,
      );

      if (
        Number.isNaN(groupId) ||
        Number.isNaN(requesterId)
      ) {
        return res.status(400).json({
          error:
            "groupId and requesterId are required",
        });
      }

      const result =
        await this.groupService.deleteGroup(
          groupId,
          requesterId,
        );

      return res.status(200).json(result);
    } catch (error: any) {
      console.error(
        "Error deleting group:",
        error,
      );

      return res.status(400).json({
        error:
          error.message ||
          "Error deleting group",
      });
    }
  }
}

export { GroupController };
