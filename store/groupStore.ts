import { prisma } from "../prisma/lib/prisma";
import { ConversationType, ConversationMemberRole } from "@prisma/client";

interface CreateGroupData {
  name: string;
  picture?: string;
  createdBy: number;
  memberIds: number[];
  eventId?: number;
}

class GroupStore {
  /**
   * Créer un groupe de conversation
   */
  async createGroup(data: CreateGroupData) {
    const { name, picture, createdBy, memberIds, eventId } = data;

    // Vérifier que le créateur existe
    const creator = await prisma.user.findUnique({
      where: {
        id: createdBy,
      },
    });

    if (!creator) {
      throw new Error("Creator not found");
    }

    // Vérifier que tous les utilisateurs existent
    const uniqueMemberIds = [
      ...new Set([createdBy, ...memberIds]),
    ];

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: uniqueMemberIds,
        },
      },
      select: {
        id: true,
      },
    });

    if (users.length !== uniqueMemberIds.length) {
      throw new Error("One or more users do not exist");
    }

    // Si un eventId est fourni, vérifier qu'il existe
    if (eventId) {
      const event = await prisma.event.findUnique({
        where: {
          id: eventId,
        },
      });

      if (!event) {
        throw new Error("Event not found");
      }
    }

    // Création du groupe + membres dans une transaction
    const group = await prisma.conversation.create({
      data: {
        name,
        picture,
        type: ConversationType.GROUP,
        createdBy,
        eventId,

        participants: {
          create: uniqueMemberIds.map((userId) => ({
            userId,
            role:
              userId === createdBy
                ? ConversationMemberRole.ADMIN
                : ConversationMemberRole.MEMBER,
          })),
        },
      },

      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            picture: true,
          },
        },

        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                picture: true,
              },
            },
          },
        },

        event: true,
      },
    });

    return group;
  }

  /**
   * Récupérer un groupe
   */
  async getGroupById(groupId: number) {
    const group = await prisma.conversation.findUnique({
      where: {
        id: groupId,
      },

      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            picture: true,
          },
        },

        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                picture: true,
              },
            },
          },
        },

        event: true,
      },
    });

    if (!group) {
      throw new Error("Group not found");
    }

    if (group.type !== ConversationType.GROUP) {
      throw new Error("This conversation is not a group");
    }

    return group;
  }

  /**
   * Récupérer les groupes d'un utilisateur
   */
  async getUserGroups(userId: number) {
    const groups = await prisma.conversation.findMany({
      where: {
        type: ConversationType.GROUP,

        participants: {
          some: {
            userId,
          },
        },
      },

      orderBy: {
        updatedAt: "desc",
      },

      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            picture: true,
          },
        },

        participants: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                picture: true,
              },
            },
          },
        },

        event: true,

        messages: {
          orderBy: {
            sentAt: "desc",
          },

          take: 1,

          select: {
            id: true,
            type: true,
            content: true,
            sentAt: true,
            senderId: true,
          },
        },
      },
    });

    return groups;
  }

  /**
   * Ajouter un membre au groupe
   */
  async addMember(
    groupId: number,
    userId: number,
    requesterId: number,
  ) {
    const group = await prisma.conversation.findUnique({
      where: {
        id: groupId,
      },

      include: {
        participants: true,
      },
    });

    if (!group) {
      throw new Error("Group not found");
    }

    if (group.type !== ConversationType.GROUP) {
      throw new Error("This conversation is not a group");
    }

    // Vérifier que celui qui ajoute est membre
    const requester = group.participants.find(
      (member) => member.userId === requesterId,
    );

    if (!requester) {
      throw new Error("You are not a member of this group");
    }

    // Seuls les admins peuvent ajouter
    if (requester.role !== ConversationMemberRole.ADMIN) {
      throw new Error("Only admins can add members");
    }

    // Vérifier que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Vérifier qu'il n'est pas déjà membre
    const existingMember =
      group.participants.find(
        (member) => member.userId === userId,
      );

    if (existingMember) {
      throw new Error("User is already a member");
    }

    const member = await prisma.conversationMember.create({
      data: {
        conversationId: groupId,
        userId,
        role: ConversationMemberRole.MEMBER,
      },

      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            picture: true,
          },
        },
      },
    });

    return member;
  }

  /**
   * Supprimer un membre
   */
  async removeMember(
    groupId: number,
    userId: number,
    requesterId: number,
  ) {
    const group = await prisma.conversation.findUnique({
      where: {
        id: groupId,
      },

      include: {
        participants: true,
      },
    });

    if (!group) {
      throw new Error("Group not found");
    }

    if (group.type !== ConversationType.GROUP) {
      throw new Error("This conversation is not a group");
    }

    const requester = group.participants.find(
      (member) => member.userId === requesterId,
    );

    if (!requester) {
      throw new Error("You are not a member of this group");
    }

    // Un admin peut supprimer quelqu'un.
    // Un membre peut également quitter le groupe lui-même.
    const isSelf = userId === requesterId;

    if (
      !isSelf &&
      requester.role !== ConversationMemberRole.ADMIN
    ) {
      throw new Error("Only admins can remove members");
    }

    const member = group.participants.find(
      (member) => member.userId === userId,
    );

    if (!member) {
      throw new Error("User is not a member of this group");
    }

    // Éviter de supprimer le dernier admin
    if (
      member.role === ConversationMemberRole.ADMIN &&
      !isSelf
    ) {
      const adminCount = group.participants.filter(
        (member) =>
          member.role === ConversationMemberRole.ADMIN,
      ).length;

      if (adminCount === 1) {
        throw new Error(
          "The last admin cannot be removed",
        );
      }
    }

    await prisma.conversationMember.delete({
      where: {
        conversationId_userId: {
          conversationId: groupId,
          userId,
        },
      },
    });

    return {
      success: true,
      message: "Member removed successfully",
    };
  }

  /**
   * Modifier le groupe
   */
  async updateGroup(
    groupId: number,
    requesterId: number,
    data: {
      name?: string;
      picture?: string;
    },
  ) {
    const group = await prisma.conversation.findUnique({
      where: {
        id: groupId,
      },

      include: {
        participants: true,
      },
    });

    if (!group) {
      throw new Error("Group not found");
    }

    if (group.type !== ConversationType.GROUP) {
      throw new Error("This conversation is not a group");
    }

    const requester = group.participants.find(
      (member) => member.userId === requesterId,
    );

    if (!requester) {
      throw new Error("You are not a member of this group");
    }

    if (requester.role !== ConversationMemberRole.ADMIN) {
      throw new Error("Only admins can update the group");
    }

    const updatedGroup =
      await prisma.conversation.update({
        where: {
          id: groupId,
        },

        data: {
          name: data.name,
          picture: data.picture,
        },

        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  picture: true,
                },
              },
            },
          },
        },
      });

    return updatedGroup;
  }

  /**
   * Supprimer le groupe
   */
  async deleteGroup(
    groupId: number,
    requesterId: number,
  ) {
    const group = await prisma.conversation.findUnique({
      where: {
        id: groupId,
      },

      include: {
        participants: true,
      },
    });

    if (!group) {
      throw new Error("Group not found");
    }

    if (group.type !== ConversationType.GROUP) {
      throw new Error("This conversation is not a group");
    }

    const requester = group.participants.find(
      (member) => member.userId === requesterId,
    );

    if (!requester) {
      throw new Error("You are not a member of this group");
    }

    if (requester.role !== ConversationMemberRole.ADMIN) {
      throw new Error("Only admins can delete the group");
    }

    await prisma.conversation.delete({
      where: {
        id: groupId,
      },
    });

    return {
      success: true,
      message: "Group deleted successfully",
    };
  }
}

export { GroupStore };
