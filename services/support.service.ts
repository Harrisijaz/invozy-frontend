import { usersService } from "./users.service";

export const supportService = {
  async searchUser(query: string) {
    const users = await usersService.getUsers();
    return users.find((user) => `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase())) ?? null;
  },
};
