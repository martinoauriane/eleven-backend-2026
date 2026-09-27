import { GroupStore } from "../store/groupStore";

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

interface GroupMessageContent {
  [key: string]: unknown;
}

class GroupService {
  private groupStore: GroupStore;

  constructor() {
    this.groupStore = new GroupStore();
  }

  /**
   * Créer un groupe
   */
  async createGroup(data: CreateGroupData) {
    return await this.groupStore.createGroup(data);
  }

  /**
   * Récupérer un groupe
   */
  async getGroupById(groupId: number) {
    return await this.groupStore.getGroupById(groupId);
  }

  /**
   * Récupérer tous les groupes
   * dont l'utilisateur est membre.
   */
  async getUserGroups(userId: number) {
    return await this.groupStore.getUserGroups(userId);
  }

  /**
   * Ajouter un membre à un groupe
   */
  async addMember(
    groupId: number,
    userId: number,
    requesterId: number,
  ) {
    return await this.groupStore.addMember(
      groupId,
      userId,
      requesterId,
    );
  }

  /**
   * Supprimer un membre d'un groupe
   */
  async removeMember(
    groupId: number,
    userId: number,
    requesterId: number,
  ) {
    return await this.groupStore.removeMember(
      groupId,
      userId,
      requesterId,
    );
  }

  /**
   * Modifier le nom / la photo du groupe
   */
  async updateGroup(
    groupId: number,
    requesterId: number,
    data: UpdateGroupData,
  ) {
    return await this.groupStore.updateGroup(
      groupId,
      requesterId,
      data,
    );
  }

  /**
   * Supprimer un groupe
   */
  async deleteGroup(
    groupId: number,
    requesterId: number,
  ) {
    return await this.groupStore.deleteGroup(
      groupId,
      requesterId,
    );
  }

  /**
   * Récupérer les messages d'un groupe
   */
  async getGroupMessages(groupId: number) {
    return await this.groupStore.getGroupMessages(groupId);
  }

  /**
   * Ajouter un message dans un groupe
   */
  async addGroupMessage(
    groupId: number,
    senderId: number,
    type: string,
    content: GroupMessageContent,
  ) {
    return await this.groupStore.addGroupMessage(
      groupId,
      senderId,
      type,
      content,
    );
  }

  /**
   * Marquer les messages du groupe comme lus
   */
  async markGroupMessagesAsRead(
    groupId: number,
    userId: number,
  ) {
    return await this.groupStore.markGroupMessagesAsRead(
      groupId,
      userId,
    );
  }
}

export { GroupService };