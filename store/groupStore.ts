import { Prisma } from "@prisma/client";
import { prisma } from "../prisma/lib/prisma";

interface CreateGroupData {
  name: string;
  picture?: string | null;
  createdBy: number;
  memberIds: number[];
  eventId?: number;
}

interface UpdateGroupData {
  name?: string;
  picture?: string | null;
}

class GroupStore {
  /**
   * CREATE GROUP
   */
  async createGroup(data: CreateGroupData) {
    const { name, picture, createdBy, memberIds, eventId } = data;

    const uniqueMemberIds = [...new Set([createdBy, ...memberIds])];

    try {
      const groupCreated = await prisma.conversation.create({
        data: {
          type: "GROUP",
          name,
          picture: picture ?? null,
          createdBy,

          ...(eventId !== undefined
            ? {
                eventId,
              }
            : {}),

          participants: {
            create: uniqueMemberIds.map((memberId) => ({
              userId: memberId,
              role: memberId === createdBy ? "ADMIN" : "MEMBER",
            })),
          },
        },

        include: {
          participants: {
            include: {
              user: true,
            },
          },

          messages: {
            orderBy: {
              sentAt: "desc",
            },

            take: 50,
          },
        },
      });

      return groupCreated;
    } catch (error) {
      console.error("Error creating group:", error);

      throw error;
    }
  }

  /**
   * GET GROUP BY ID
   */
  async getGroupById(groupId: number) {
    const group = await prisma.conversation.findFirst({
      where: {
        id: groupId,
        type: "GROUP",
      },

      include: {
        participants: {
          include: {
            user: true,
          },
        },

        messages: {
          orderBy: {
            sentAt: "asc",
          },

          include: {
            sender: true,
          },
        },
      },
    });

    if (!group) {
      throw new Error("Group not found");
    }

    return group;
  }

  /**
   * GET USER GROUPS
   */
  async getUserGroups(userId: number) {
    return await prisma.conversation.findMany({
      where: {
        type: "GROUP",

        participants: {
          some: {
            userId,
          },
        },
      },

      include: {
        participants: {
          include: {
            user: true,
          },
        },

        messages: {
          orderBy: {
            sentAt: "desc",
          },

          take: 50,
        },
      },

      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  /**
   * ADD MEMBER
   */
  async addMember(groupId: number, userId: number, requesterId: number) {
    const group = await prisma.conversation.findFirst({
      where: {
        id: groupId,
        type: "GROUP",
      },
    });

    if (!group) {
      throw new Error("Group not found");
    }

    const requester = await prisma.conversationMember.findFirst({
      where: {
        conversationId: groupId,
        userId: requesterId,
        role: "ADMIN",
      },
    });

    if (!requester) {
      throw new Error("Only an admin can add members");
    }

    const existingMember = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId: groupId,
          userId,
        },
      },
    });

    if (existingMember) {
      throw new Error("User is already a member");
    }

    const member = await prisma.conversationMember.create({
      data: {
        conversationId: groupId,
        userId,
        role: "MEMBER",
      },

      include: {
        user: true,
      },
    });

    await prisma.conversation.update({
      where: {
        id: groupId,
      },

      data: {
        updatedAt: new Date(),
      },
    });

    return member;
  }

  /**
   * REMOVE MEMBER
   */
  async removeMember(groupId: number, userId: number, requesterId: number) {
    const group = await prisma.conversation.findFirst({
      where: {
        id: groupId,
        type: "GROUP",
      },
    });

    if (!group) {
      throw new Error("Group not found");
    }

    const requester = await prisma.conversationMember.findFirst({
      where: {
        conversationId: groupId,
        userId: requesterId,
        role: "ADMIN",
      },
    });

    if (!requester) {
      throw new Error("Only an admin can remove members");
    }

    const member = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId: groupId,
          userId,
        },
      },
    });

    if (!member) {
      throw new Error("User is not a member");
    }

    if (member.role === "ADMIN") {
      const adminCount = await prisma.conversationMember.count({
        where: {
          conversationId: groupId,
          role: "ADMIN",
        },
      });

      if (adminCount <= 1) {
        throw new Error("The last admin cannot be removed");
      }
    }

    const deletedMember = await prisma.conversationMember.delete({
      where: {
        conversationId_userId: {
          conversationId: groupId,
          userId,
        },
      },
    });

    await prisma.conversation.update({
      where: {
        id: groupId,
      },

      data: {
        updatedAt: new Date(),
      },
    });

    return deletedMember;
  }

  /**
   * UPDATE GROUP
   */
  async updateGroup(
    groupId: number,
    requesterId: number,
    data: UpdateGroupData,
  ) {
    const group = await prisma.conversation.findFirst({
      where: {
        id: groupId,
        type: "GROUP",
      },
    });

    if (!group) {
      throw new Error("Group not found");
    }

    const requester = await prisma.conversationMember.findFirst({
      where: {
        conversationId: groupId,
        userId: requesterId,
        role: "ADMIN",
      },
    });

    if (!requester) {
      throw new Error("Only an admin can update the group");
    }

    const updateData: {
      name?: string;
      picture?: string | null;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (data.name !== undefined) {
      updateData.name = data.name;
    }

    if (data.picture !== undefined) {
      updateData.picture = data.picture;
    }

    return await prisma.conversation.update({
      where: {
        id: groupId,
      },

      data: updateData,

      include: {
        participants: {
          include: {
            user: true,
          },
        },

        messages: {
          orderBy: {
            sentAt: "desc",
          },

          take: 50,
        },
      },
    });
  }

  /**
   * DELETE GROUP
   */
  async deleteGroup(groupId: number, requesterId: number) {
    const group = await prisma.conversation.findFirst({
      where: {
        id: groupId,
        type: "GROUP",
      },
    });

    if (!group) {
      throw new Error("Group not found");
    }

    const admin = await prisma.conversationMember.findFirst({
      where: {
        conversationId: groupId,
        userId: requesterId,
        role: "ADMIN",
      },
    });

    if (!admin) {
      throw new Error("Only an admin can delete the group");
    }

    return await prisma.conversation.delete({
      where: {
        id: groupId,
      },
    });
  }

  /**
   * GET GROUP MESSAGES
   */
  async getGroupMessages(groupId: number) {
    const group = await prisma.conversation.findFirst({
      where: {
        id: groupId,
        type: "GROUP",
      },
    });

    if (!group) {
      throw new Error("Group not found");
    }

    return await prisma.message.findMany({
      where: {
        conversationId: groupId,
      },

      include: {
        sender: true,
      },

      orderBy: {
        sentAt: "asc",
      },
    });
  }

  /**
   * ADD GROUP MESSAGE
   */
  async addGroupMessage(
    groupId: number,
    senderId: number,
    type: string,
    content:  Prisma.InputJsonValue,

  ) {
    // Vérifier que le groupe existe
    const group = await prisma.conversation.findFirst({
      where: {
        id: groupId,
        type: "GROUP",
      },
    });

    if (!group) {
      throw new Error("Group not found");
    }

    // Vérifier que l'utilisateur est membre du groupe
    const member = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId: groupId,
          userId: senderId,
        },
      },
    });

    if (!member) {
      throw new Error("Sender is not a member of this group");
    }

    // Créer le message
    const message = await prisma.message.create({
      data: {
        conversationId: groupId,
        senderId,
        type,
        content,
      },

      include: {
        sender: true,
      },
    });

    // Mettre à jour la conversation
    await prisma.conversation.update({
      where: {
        id: groupId,
      },

      data: {
        updatedAt: new Date(),
      },
    });

    return message;
  }

  /**
   * MARK GROUP MESSAGES AS READ
   */
  async markGroupMessagesAsRead(groupId: number, userId: number) {
    // Vérifier que le groupe existe
    const group = await prisma.conversation.findFirst({
      where: {
        id: groupId,
        type: "GROUP",
      },
    });

    if (!group) {
      throw new Error("Group not found");
    }

    // Vérifier que l'utilisateur est membre
    const member = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId: groupId,
          userId,
        },
      },
    });

    if (!member) {
      throw new Error("User is not a member of this group");
    }

    // Marquer les messages comme lus
    const result = await prisma.message.updateMany({
      where: {
        conversationId: groupId,

        // On ne met à jour que les messages
        // qui ne sont pas encore lus par cet utilisateur.
        reads: {
          none: {
            userId,
          },
        },
      },

      data: {
        // À adapter selon ton modèle Prisma
      },
    });

    return result;
  }
}

export { GroupStore };
