import { customerApi } from "@/src/lib/customer/api";
import type { ExpenseRequest, ExpenseResponse } from "@/src/types/customer";

export const expenseService = {
  async create(payload: ExpenseRequest) {
    const response = await customerApi.post<ExpenseResponse>("/expenses", payload);
    return response.data;
  },
};
