import { customerApi } from "@/src/lib/customer/api";
import type { SettingsResponse } from "@/src/types/customer";

export const settingsService = {
  async get() {
    const response = await customerApi.get<SettingsResponse>("/settings");
    return response.data;
  },
  async update(payload: SettingsResponse) {
    const response = await customerApi.put<SettingsResponse>("/settings", payload);
    return response.data;
  },
};
