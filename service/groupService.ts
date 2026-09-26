import { GroupStore } from "../store/groupStore";

interface CreateGroupData {
  name: string;
  picture?: string;
  createdBy: number;
  memberIds: number[];
  eventId?: number;
}

class GroupService {
  private groupStore: GroupStore;

  constructor() {
    this.groupStore = new GroupStore();
  }

  async createGroup(data: CreateGroupData) {
    return await this.groupStore.createGroup(data);
  }

  async getGroupById(groupId: number) {
    return await this.groupStore.getGroupById(groupId);
  }

  async getUserGroups(userId: number) {
    return await this.groupStore.getUserGroups(userId);
  }

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

  async updateGroup(
    groupId: number,
    requesterId: number,
    data: {
      name?: string;
      picture?: string;
    },
  ) {
    return await this.groupStore.updateGroup(
      groupId,
      requesterId,
      data,
    );
  }

  async deleteGroup(
    groupId: number,
    requesterId: number,
  ) {
    return await this.groupStore.deleteGroup(
      groupId,
      requesterId,
    );
  }
}

export { GroupService };
