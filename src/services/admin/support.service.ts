import { api } from "@/lib/api";
import { asRecord, pickArray, pickRecord, text } from "@/lib/normalize";
import type { AddInternalNoteRequest, InternalNote, SupportRecord, UserSupportRecordsView } from "@/types/admin/support";

function supportRecord(value: unknown, index: number): SupportRecord {
  const record = asRecord(value);
  return {
    id: text(record, ["id", "invoiceNumber", "expenseId"], `record-${index}`),
    label: text(record, ["label", "invoiceNumber", "expense", "title", "description"], "Record"),
    value: text(record, ["amount", "value", "status", "plan"], ""),
    status: text(record, ["status"], ""),
    date: text(record, ["date", "createdAt", "issueDate", "dueDate"], ""),
  };
}

function internalNote(value: unknown, index: number): InternalNote {
  const record = asRecord(value);
  return {
    id: text(record, ["id"], `note-${index}`),
    note: text(record, ["note", "content", "message"]),
    admin: text(record, ["admin", "createdBy", "adminName"], "Admin"),
    createdAt: text(record, ["createdAt", "date"], ""),
  };
}

export const supportService = {
  async getUserRecords(userId: string): Promise<UserSupportRecordsView> {
    const { data } = await api.get<unknown>(`/admin/support/users/${userId}/records`);
    return {
      user: pickRecord(data, ["user", "userInfo"]),
      invoices: pickArray(data, ["invoices"]).map(supportRecord),
      expenses: pickArray(data, ["expenses"]).map(supportRecord),
      subscription: pickRecord(data, ["subscription", "subscriptionInfo"]),
      activity: pickArray(data, ["activity", "activities", "records"]).map(supportRecord),
      notes: pickArray(data, ["notes", "internalNotes"]).map(internalNote),
      raw: data,
    };
  },

  async triggerPasswordReset(userId: string) {
    const { data } = await api.post<unknown>(`/admin/support/users/${userId}/password-reset`);
    return data;
  },

  async addInternalNote(userId: string, note: string) {
    const { data } = await api.post<unknown>(`/admin/support/users/${userId}/notes`, { note } satisfies AddInternalNoteRequest);
    return data;
  },
};
