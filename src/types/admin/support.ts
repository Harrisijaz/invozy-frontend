export interface SupportRecord {
  id: string;
  label: string;
  value: string;
  status?: string;
  date?: string;
}

export interface InternalNote {
  id: string;
  note: string;
  admin: string;
  createdAt: string;
}

export interface UserSupportRecordsView {
  user: Record<string, unknown>;
  invoices: SupportRecord[];
  expenses: SupportRecord[];
  subscription: Record<string, unknown>;
  activity: SupportRecord[];
  notes: InternalNote[];
  raw: unknown;
}

export interface AddInternalNoteRequest {
  note: string;
}
