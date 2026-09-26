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
   *   "memberIds": [2, 3, 4],
   *   "eventId": 10
   * }
   *
   * userId dans l'URL = créateur du groupe
   */
  async createGroup(req: Request, res: Response) {
    try {
      const createdBy = Number(req.params.userId);

      const {
        name,
        picture,
        memberIds,
        eventId,
      } = req.body;

      // -------------------------
      // VALIDATION
      // -------------------------

      if (Number.isNaN(createdBy)) {
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

      if (
        parsedMemberIds.some(
          (id: number) => Number.isNaN(id),
        )
      ) {
        return res.status(400).json({
          error:
            "memberIds must contain valid user IDs",
        });
      }

      let parsedEventId: number | undefined;

      if (eventId !== undefined && eventId !== null) {
        parsedEventId = Number(eventId);

        if (Number.isNaN(parsedEventId)) {
          return res.status(400).json({
            error: "Invalid eventId",
          });
        }
      }

      // -------------------------
      // CREATE GROUP
      // -------------------------

      const group =
        await this.groupService.createGroup({
          name: name.trim(),
          picture: picture ?? null,
          createdBy,
          memberIds: parsedMemberIds,
          eventId: parsedEventId,
        });

      return res.status(201).json(group);
    } catch (error: any) {
      console.error(
        "Error creating group:",
        error,
      );

      return res.status(500).json({
        error:
          error.message ||
          "Error creating group",
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
   * GET /user/:userId/groups/:groupId
   *
   * userId est conservé dans l'URL pour
   * rester cohérent avec tes routes.
   *
   * L'accès au groupe est géré par le service/store.
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

      if (
        error.message ===
        "Group not found"
      ) {
        return res.status(404).json({
          error: "Group not found",
        });
      }

      return res.status(500).json({
        error:
          error.message ||
          "Error retrieving group",
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
   * userId dans l'URL = requester/admin
   * userId dans le body = personne à ajouter
   */
  async addMember(
    req: Request,
    res: Response,
  ) {
    try {
      const requesterId = Number(
        req.params.userId,
      );

      const groupId = Number(
        req.params.groupId,
      );

      const userId = Number(
        req.body.userId,
      );

      if (Number.isNaN(requesterId)) {
        return res.status(400).json({
          error:
            "Invalid requester userId",
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

      const member =
        await this.groupService.addMember(
          groupId,
          userId,
          requesterId,
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
   * DELETE /user/:userId/groups/:groupId/members
   *
   * Body:
   * {
   *   "userId": 5
   * }
   *
   * userId dans l'URL = requester/admin
   * userId dans le body = membre à supprimer
   */
  async removeMember(
    req: Request,
    res: Response,
  ) {
    try {
      const requesterId = Number(
        req.params.userId,
      );

      const groupId = Number(
        req.params.groupId,
      );

      const userId = Number(
        req.body.userId,
      );

      if (Number.isNaN(requesterId)) {
        return res.status(400).json({
          error:
            "Invalid requester userId",
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

      const result =
        await this.groupService.removeMember(
          groupId,
          userId,
          requesterId,
        );

      return res.status(200).json(result);
    } catch (error: any) {
      console.error(
        "Error removing group member:",
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
   * PATCH /user/:userId/groups/:groupId
   *
   * Body:
   * {
   *   "name": "Nouveau nom",
   *   "picture": "..."
   * }
   *
   * userId dans l'URL = requester/admin
   */
  async updateGroup(
    req: Request,
    res: Response,
  ) {
    try {
      const requesterId = Number(
        req.params.userId,
      );

      const groupId = Number(
        req.params.groupId,
      );

      const {
        name,
        picture,
      } = req.body;

      if (Number.isNaN(requesterId)) {
        return res.status(400).json({
          error:
            "Invalid requester userId",
        });
      }

      if (Number.isNaN(groupId)) {
        return res.status(400).json({
          error: "Invalid groupId",
        });
      }

      if (
        name === undefined &&
        picture === undefined
      ) {
        return res.status(400).json({
          error: "Nothing to update",
        });
      }

      if (
        name !== undefined &&
        typeof name !== "string"
      ) {
        return res.status(400).json({
          error:
            "name must be a string",
        });
      }

      if (
        picture !== undefined &&
        picture !== null &&
        typeof picture !== "string"
      ) {
        return res.status(400).json({
          error:
            "picture must be a string or null",
        });
      }

      const updatedGroup =
        await this.groupService.updateGroup(
          groupId,
          requesterId,
          {
            name:
              name !== undefined
                ? name.trim()
                : undefined,

            picture:
              picture !== undefined
                ? picture
                : undefined,
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
   * DELETE /user/:userId/groups/:groupId
   *
   * userId dans l'URL = requester/admin
   */
  async deleteGroup(
    req: Request,
    res: Response,
  ) {
    try {
      const requesterId = Number(
        req.params.userId,
      );

      const groupId = Number(
        req.params.groupId,
      );

      if (Number.isNaN(requesterId)) {
        return res.status(400).json({
          error:
            "Invalid requester userId",
        });
      }

      if (Number.isNaN(groupId)) {
        return res.status(400).json({
          error: "Invalid groupId",
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