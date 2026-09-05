"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Activity, Ban, Bot, CircleDollarSign, CreditCard, Download, KeyRound, LifeBuoy, Lock, ShieldAlert, Trash2, UserCheck, Users, Wallet } from "lucide-react";
import { Column, DataTable } from "@/components/common/data-table";
import { Button, Card, ConfirmDialog, EmptyState, ErrorState, Input, PageHeader, StatusBadge } from "@/components/common/ui";
import { useToast } from "@/components/common/toast";
import { useAdminDashboard, useAIUsage } from "@/hooks/admin/useAdminDashboard";
import { useActivityLogs } from "@/hooks/admin/useActivityLogs";
import { useChangePlan, useFailedPendingPayments, useRefundPayment, useSubscriptions } from "@/hooks/admin/useBilling";
import { useDismissFlag, useModerationFlags, useTrustUser } from "@/hooks/admin/useModeration";
import { useAddInternalNote, useTriggerPasswordReset, useUserSupportRecords } from "@/hooks/admin/useSupport";
import { useUser } from "@/hooks/admin/useUser";
import { useBlockUser, useDeleteUser, useExportUsers, useUnblockUser, useUsers } from "@/hooks/admin/useUsers";
import { getApiErrorMessage } from "@/lib/api";
import { formatCurrency, formatNumber, relativeTime } from "@/lib/utils";
import type { ActivityLog, AIUsageRow, FailedPendingPayment, ModerationFlag } from "@/types/admin";
import type { AdminUserRow, AdminUserPlanFilter, AdminUserStatusFilter, AdminUserSortBy, SortDirection } from "@/types/admin/user";
import { RevenueChart, SimpleBarChart, SimpleLineChart, UsagePieChart } from "./charts";
import { StatCard } from "./stat-card";

function useDebouncedValue(value: string, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timeout = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timeout);
  }, [delay, value]);
  return debounced;
}

export function DashboardPage() {
  const [range, setRange] = useState({ startDate: "", endDate: "" });
  const dashboard = useAdminDashboard({ startDate: range.startDate || undefined, endDate: range.endDate || undefined });
  if (dashboard.isLoading) return <PageSkeleton title="Dashboard" />;
  if (dashboard.isError || !dashboard.data) return <ErrorState description={getApiErrorMessage(dashboard.error)} onRetry={() => void dashboard.refetch()} />;
  const data = dashboard.data;
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Operational overview from /admin/analytics/dashboard." actions={<DateRangeSelector value={range} onChange={setRange} />} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard {...data.totalUsers} icon={Users} />
        <StatCard {...data.freeUsers} icon={UserCheck} />
        <StatCard {...data.paidUsers} icon={CreditCard} />
        <StatCard {...data.monthlyRevenue} icon={CircleDollarSign} currency />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]"><RevenueChart data={data.revenue} /><SimpleBarChart title="New Signups" data={data.signups} /></div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Churn Rate" value={data.churnRate} icon={ShieldAlert} />
        <StatCard label="Cancelled Paid Subscriptions" value={data.cancelledPaidSubscriptions} icon={Ban} />
        <StatCard label="Retained Users" value={data.retainedUsers} icon={UserCheck} />
      </div>
    </div>
  );
}

export function AnalyticsPage() {
  const [range, setRange] = useState({ startDate: "", endDate: "" });
  const dashboard = useAdminDashboard({
    startDate: range.startDate || undefined,
    endDate: range.endDate || undefined,
  });

  if (dashboard.isLoading) return <PageSkeleton title="Revenue" />;

  if (dashboard.isError || !dashboard.data) {
    return (
      <ErrorState
        description={getApiErrorMessage(dashboard.error)}
        onRetry={() => void dashboard.refetch()}
      />
    );
  }

  const data = dashboard.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Revenue"
        description="Revenue, signup, and churn analytics from /admin/analytics/dashboard."
        actions={<DateRangeSelector value={range} onChange={setRange} />}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Monthly Revenue"
          value={data.monthlyRevenue.value}
          change={data.monthlyRevenue.change}
          comparison={data.monthlyRevenue.comparison}
          icon={Wallet}
          currency
        />
        <StatCard label="Paid Users" value={data.paidUsers.value} icon={CreditCard} />
        <StatCard label="Churn Rate" value={data.churnRate} icon={ShieldAlert} />
      </div>
      <RevenueChart data={data.revenue} />
      <div className="grid gap-4 lg:grid-cols-2">
        <SimpleBarChart title="New Signups" data={data.signups} />
        <SimpleLineChart title="Churn Analytics" data={data.churn} />
      </div>
    </div>
  );
}

export function UsersPage() {
  const toast = useToast();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebouncedValue(search);
  const [plan, setPlan] = useState<AdminUserPlanFilter | "">("");
  const [status, setStatus] = useState<AdminUserStatusFilter | "">("");
  const [sortBy, setSortBy] = useState<AdminUserSortBy>("createdAt");
  const [direction, setDirection] = useState<SortDirection>("desc");
  const users = useUsers({ page, limit: 20, search: debouncedSearch || undefined, plan: plan || undefined, status: status || undefined, sortBy, direction });
  const exportUsers = useExportUsers();
  const blockUser = useBlockUser();
  const unblockUser = useUnblockUser();
  const deleteUser = useDeleteUser();
  const [dialog, setDialog] = useState<null | { type: "block" | "delete"; user: AdminUserRow }>(null);
  const [reason, setReason] = useState("");
  const [confirmationEmail, setConfirmationEmail] = useState("");
  const [cancelSubscriptionFirst, setCancelSubscriptionFirst] = useState(true);

  const columns: Column<AdminUserRow>[] = [
    { key: "name", header: "User", render: (user) => <Link className="font-medium text-primary hover:underline" href={`/admin/users/${user.id}`}>{user.name}</Link> },
    { key: "email", header: "Email" },
    { key: "plan", header: "Plan", render: (user) => <StatusBadge value={user.plan} /> },
    { key: "status", header: "Status", render: (user) => <StatusBadge value={user.status} /> },
    { key: "signupDate", header: "Signup" },
    { key: "revenue", header: "Revenue", render: (user) => formatCurrency(user.revenue) },
    { key: "actions", header: "Actions", render: (user) => <div className="flex gap-2"><Button variant="secondary" onClick={() => user.status === "BLOCKED" ? unblockUser.mutate(user.id, { onSuccess: () => toast("User unblocked successfully", "success"), onError: (error) => toast(getApiErrorMessage(error), "error") }) : setDialog({ type: "block", user })}>{user.status === "BLOCKED" ? "Unblock" : "Block"}</Button><Button variant="ghost" onClick={() => { setConfirmationEmail(""); setDialog({ type: "delete", user }); }}><Trash2 className="h-4 w-4" /></Button></div> },
  ];

  const downloadCsv = () => {
    exportUsers.mutate(undefined, {
      onSuccess: (blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "invorights-users.csv";
        link.click();
        URL.revokeObjectURL(url);
        toast("CSV export completed", "success");
      },
      onError: (error) => toast(getApiErrorMessage(error, "Unable to export users."), "error"),
    });
  };

  const confirmMutation = () => {
    if (!dialog) return;
    if (dialog.type === "block") {
      if (!reason.trim()) {
        toast("Block reason is required.", "warning");
        return;
      }
      blockUser.mutate({ userId: dialog.user.id, reason }, { onSuccess: () => { toast("User blocked successfully", "success"); setDialog(null); setReason(""); }, onError: (error) => toast(getApiErrorMessage(error), "error") });
      return;
    }
    if (confirmationEmail.trim() !== dialog.user.email) {
      toast("Enter the user's email to confirm deletion.", "warning");
      return;
    }
    deleteUser.mutate({ userId: dialog.user.id, body: { confirmationEmail, cancelSubscriptionFirst } }, { onSuccess: () => { toast("User deleted successfully", "success"); setDialog(null); }, onError: (error) => toast(getApiErrorMessage(error), "error") });
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Server-side users, search, filters, sorting, pagination, and export." actions={<Button variant="secondary" onClick={downloadCsv} isLoading={exportUsers.isPending}><Download className="h-4 w-4" /> Export CSV</Button>} />
      <Card className="grid gap-3 md:grid-cols-5">
        <Input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1); }} placeholder="Search users..." />
        <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm" value={plan} onChange={(event) => { setPlan(event.target.value as AdminUserPlanFilter | ""); setPage(1); }}><option value="">All Plans</option><option value="FREE">Free</option><option value="PAID">Paid</option></select>
        <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm" value={status} onChange={(event) => { setStatus(event.target.value as AdminUserStatusFilter | ""); setPage(1); }}><option value="">All Statuses</option><option value="UNVERIFIED">Unverified</option><option value="ACTIVE">Active</option><option value="BLOCKED">Blocked</option><option value="DELETED">Deleted</option></select>
        <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm" value={sortBy} onChange={(event) => setSortBy(event.target.value as AdminUserSortBy)}><option value="createdAt">Signup Date</option><option value="status">Status</option></select>
        <select className="rounded-lg border border-border bg-card px-3 py-2 text-sm" value={direction} onChange={(event) => setDirection(event.target.value as SortDirection)}><option value="desc">Desc</option><option value="asc">Asc</option></select>
      </Card>
      <DataTable data={users.data?.users ?? []} columns={columns} searchKeys={["name", "email"]} loading={users.isLoading} error={users.isError} emptyTitle="No users found" showSearch={false} clientPagination={false} />
      <div className="flex items-center justify-between text-sm text-muted-foreground"><span>Page {users.data?.page ?? page}{users.data?.totalPages ? ` of ${users.data.totalPages}` : ""}</span><div className="flex gap-2"><Button variant="secondary" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>Previous</Button><Button variant="secondary" disabled={Boolean(users.data?.totalPages && page >= users.data.totalPages)} onClick={() => setPage((current) => current + 1)}>Next</Button></div></div>
      <ConfirmDialog open={Boolean(dialog)} title={dialog?.type === "delete" ? "Delete this user?" : "Block User"} description={dialog?.type === "delete" ? "Enter the user's email and choose whether to cancel the subscription first. This calls DELETE /admin/users/{userId}." : "Enter a reason. This calls POST /admin/users/{userId}/block with the reason body."} confirmLabel={dialog?.type === "delete" ? "Delete User" : "Block User"} onCancel={() => setDialog(null)} onConfirm={confirmMutation} loading={blockUser.isPending || deleteUser.isPending}>
        {dialog ? <ActionFields type={dialog.type} email={confirmationEmail} setEmail={setConfirmationEmail} reason={reason} setReason={setReason} cancelFirst={cancelSubscriptionFirst} setCancelFirst={setCancelSubscriptionFirst} /> : null}
      </ConfirmDialog>
    </div>
  );
}

export function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const user = useUser(id);
  const support = useUserSupportRecords(id);
  const subscriptions = useSubscriptions(id);
  const passwordReset = useTriggerPasswordReset();
  const addNote = useAddInternalNote();
  const changePlan = useChangePlan();
  const toast = useToast();
  const [note, setNote] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [planReason, setPlanReason] = useState("");
  const [plan, setPlan] = useState<"FREE" | "PAID">("PAID");
  if (user.isLoading) return <PageSkeleton title="User Details" />;
  if (user.isError || !user.data) return <ErrorState description={getApiErrorMessage(user.error)} onRetry={() => void user.refetch()} />;
  return (
    <div className="space-y-6">
      <PageHeader title={user.data.fullName || user.data.name} description={`${user.data.email} - ${user.data.plan} - ${user.data.status}`} actions={<Button variant="secondary" onClick={() => setConfirmReset(true)} isLoading={passwordReset.isPending}><KeyRound className="h-4 w-4" /> Trigger Password Reset</Button>} />
      <div className="grid gap-4 md:grid-cols-4"><StatCard label="Invoices" value={user.data.invoices ?? 0} icon={CreditCard} /><StatCard label="Expenses" value={user.data.expenses ?? 0} icon={Wallet} /><StatCard label="Payments" value={user.data.payments ?? 0} icon={CircleDollarSign} /><StatCard label="Revenue" value={user.data.revenue} icon={CircleDollarSign} currency /></div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card><h2 className="mb-3 font-semibold">User Information</h2><InfoGrid rows={[["Email", user.data.email], ["Plan", <StatusBadge key="plan" value={user.data.plan} />], ["Status", <StatusBadge key="status" value={user.data.status} />], ["Signup Date", user.data.signupDate || "Not returned"]]} /></Card>
        <Card><h2 className="mb-3 font-semibold">User Subscriptions</h2>{subscriptions.data ? <InfoGrid rows={[["Current Plan", subscriptions.data.currentPlan], ["Subscription Status", subscriptions.data.status], ["Start Date", subscriptions.data.startDate || "Not returned"], ["Renewal Date", subscriptions.data.renewalDate || "Not returned"], ["Cancellation Information", subscriptions.data.cancellationInformation]]} /> : <p className="text-sm text-muted-foreground">Loading subscription details.</p>}</Card>
      </div>
      <Card><h2 className="font-semibold">Change Plan</h2><div className="mt-4 grid gap-3 md:grid-cols-[180px_1fr_auto]"><select className="rounded-lg border border-border bg-card px-3 py-2 text-sm" value={plan} onChange={(event) => setPlan(event.target.value as "FREE" | "PAID")}><option value="FREE">Free</option><option value="PAID">Paid</option></select><Input value={planReason} onChange={(event) => setPlanReason(event.target.value)} placeholder="Reason for plan change" /><Button isLoading={changePlan.isPending} disabled={!planReason.trim()} onClick={() => changePlan.mutate({ userId: id, body: { plan, reason: planReason } }, { onSuccess: () => toast("Plan updated successfully", "success"), onError: (error) => toast(getApiErrorMessage(error), "error") })}>Change Plan</Button></div></Card>
      <SupportRecords records={support.data} loading={support.isLoading} />
      <Card><h2 className="font-semibold">Internal Notes</h2><p className="mt-1 text-sm text-muted-foreground">Internal - Admins Only</p><div className="mt-4 grid gap-3">{(support.data?.notes ?? []).map((item) => <div key={item.id} className="rounded-lg border border-border p-3 text-sm"><p>{item.note}</p><p className="mt-2 text-xs text-muted-foreground">{item.admin} - {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "No date returned"}</p></div>)}</div><div className="mt-4 flex flex-col gap-2 sm:flex-row"><Input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Customer contacted support about billing issue." /><Button disabled={!note.trim()} isLoading={addNote.isPending} onClick={() => addNote.mutate({ userId: id, note }, { onSuccess: () => { toast("Internal note added", "success"); setNote(""); }, onError: (error) => toast(getApiErrorMessage(error), "error") })}>Add Note</Button></div></Card>
      <ConfirmDialog open={confirmReset} title="Trigger Password Reset" description="Are you sure you want to send a password reset email to this user?" confirmLabel="Send Reset Email" onCancel={() => setConfirmReset(false)} loading={passwordReset.isPending} onConfirm={() => passwordReset.mutate(id, { onSuccess: () => { toast("Password reset email sent successfully.", "success"); setConfirmReset(false); }, onError: (error) => toast(getApiErrorMessage(error), "error") })} />
    </div>
  );
}

export function BillingPage() {
  const payments = useFailedPendingPayments();
  const refund = useRefundPayment();
  const toast = useToast();
  const [refundForm, setRefundForm] = useState<null | { payment: FailedPendingPayment; amount: string; note: string }>(null);
  const rows = payments.data ?? [];
  return (
    <div className="space-y-6">
      <PageHeader title="Billing" description="Failed and pending payments from /admin/billing/payments/failed-pending." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"><StatCard label="Failed Payments" value={rows.filter((r) => r.status.toUpperCase().includes("FAILED")).length} icon={ShieldAlert} /><StatCard label="Pending Payments" value={rows.filter((r) => r.status.toUpperCase().includes("PENDING")).length} icon={Activity} /><StatCard label="Amount At Risk" value={rows.reduce((sum, row) => sum + row.amount, 0)} icon={Wallet} currency /></div>
      <DataTable data={rows} loading={payments.isLoading} error={payments.isError} searchKeys={["transactionId", "user", "status"]} columns={paymentColumns((payment) => setRefundForm({ payment, amount: String(payment.amount), note: "" }))} />
      <ConfirmDialog open={Boolean(refundForm)} title="Refund Payment" description="Are you sure you want to refund this payment? The frontend will only show the backend-confirmed response." confirmLabel="Refund Payment" onCancel={() => setRefundForm(null)} loading={refund.isPending} onConfirm={() => {
        if (!refundForm) return;
        const amount = Number(refundForm.amount);
        if (!Number.isFinite(amount) || amount <= 0) {
          toast("Refund amount must be positive.", "warning");
          return;
        }
        if (refundForm.payment.amount && amount > refundForm.payment.amount) {
          toast("Refund amount cannot exceed the payment amount.", "warning");
          return;
        }
        if (!refundForm.note.trim()) {
          toast("Refund note is required.", "warning");
          return;
        }
        refund.mutate({ paymentId: refundForm.payment.paymentId, body: { amount, note: refundForm.note } }, { onSuccess: () => { toast("Refund request submitted", "success"); setRefundForm(null); }, onError: (error) => toast(getApiErrorMessage(error), "error") });
      }}>
        {refundForm ? <div className="grid gap-3"><Input type="number" min="0.01" step="0.01" value={refundForm.amount} onChange={(event) => setRefundForm({ ...refundForm, amount: event.target.value })} placeholder="Amount" /><Input value={refundForm.note} onChange={(event) => setRefundForm({ ...refundForm, note: event.target.value })} placeholder="Refund note" /></div> : null}
      </ConfirmDialog>
    </div>
  );
}

export function SubscriptionsPage() {
  const [userId, setUserId] = useState("");
  const subscriptions = useSubscriptions(userId);
  const changePlan = useChangePlan();
  const toast = useToast();
  const [plan, setPlan] = useState<"FREE" | "PAID">("PAID");
  const [reason, setReason] = useState("");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscriptions"
        description="Load a user's subscription details from /admin/billing/users/{userId}/subscriptions."
      />
      <Card className="grid gap-3 md:grid-cols-[1fr_auto]">
        <Input
          value={userId}
          onChange={(event) => setUserId(event.target.value)}
          placeholder="User ID"
          aria-label="User ID"
        />
        <Button variant="secondary" disabled={!userId.trim()}>
          Load Subscription
        </Button>
      </Card>
      {!userId ? (
        <EmptyState
          title="Enter a user ID"
          description="Subscription information and plan controls will appear here."
        />
      ) : subscriptions.isLoading ? (
        <PageSkeleton title="Subscriptions" />
      ) : subscriptions.isError || !subscriptions.data ? (
        <ErrorState
          description={getApiErrorMessage(subscriptions.error)}
          onRetry={() => void subscriptions.refetch()}
        />
      ) : (
        <>
          <Card>
            <h2 className="mb-3 font-semibold">Current Subscription</h2>
            <InfoGrid
              rows={[
                ["Current Plan", subscriptions.data.currentPlan],
                ["Subscription Status", <StatusBadge key="status" value={subscriptions.data.status} />],
                ["Start Date", subscriptions.data.startDate || "Not returned"],
                ["Renewal Date", subscriptions.data.renewalDate || "Not returned"],
                ["Cancellation Information", subscriptions.data.cancellationInformation],
              ]}
            />
          </Card>
          <Card>
            <h2 className="font-semibold">Change Plan</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-[180px_1fr_auto]">
              <select
                className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
                value={plan}
                onChange={(event) => setPlan(event.target.value as "FREE" | "PAID")}
              >
                <option value="FREE">Free</option>
                <option value="PAID">Paid</option>
              </select>
              <Input
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Admin manual upgrade after successful payment."
              />
              <Button
                disabled={!reason.trim()}
                isLoading={changePlan.isPending}
                onClick={() =>
                  changePlan.mutate(
                    { userId, body: { plan, reason } },
                    {
                      onSuccess: () => {
                        toast("Plan updated successfully", "success");
                        setReason("");
                      },
                      onError: (error) => toast(getApiErrorMessage(error), "error"),
                    },
                  )
                }
              >
                Change Plan
              </Button>
            </div>
          </Card>
          <Card>
            <h2 className="font-semibold">Subscription History</h2>
            <div className="mt-4 grid gap-2">
              {subscriptions.data.history.length ? (
                subscriptions.data.history.map((item, index) => (
                  <pre
                    key={index}
                    className="overflow-x-auto rounded-lg border border-border bg-muted p-3 text-xs text-muted-foreground"
                  >
                    {JSON.stringify(item, null, 2)}
                  </pre>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No subscription history returned.</p>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

export function SupportPage() {
  const [userId, setUserId] = useState("");
  const support = useUserSupportRecords(userId);
  return <div className="space-y-6"><PageHeader title="Support" description="Enter a user ID to load /admin/support/users/{userId}/records." /><Card><div className="flex flex-col gap-3 sm:flex-row"><Input value={userId} onChange={(event) => setUserId(event.target.value)} placeholder="User ID" /><Button><LifeBuoy className="h-4 w-4" /> Load Records</Button></div></Card>{!userId ? <EmptyState title="Enter a user ID" description="Support records will appear here." /> : <SupportRecords records={support.data} loading={support.isLoading} />}</div>;
}

export function ModerationPage() {
  const flags = useModerationFlags();
  const dismiss = useDismissFlag();
  const trust = useTrustUser();
  const toast = useToast();
  const [dismissForm, setDismissForm] = useState<null | { flagId: string; note: string }>(null);
  const rows = flags.data ?? [];
  return <div className="space-y-6"><PageHeader title="Moderation" description="Moderation flags from /admin/moderation/flags." /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Total Flags" value={rows.length} icon={ShieldAlert} /><StatCard label="High Risk" value={rows.filter((r) => r.riskLevel.toUpperCase() === "HIGH").length} icon={ShieldAlert} /><StatCard label="Open" value={rows.filter((r) => r.status.toUpperCase() === "OPEN").length} icon={Activity} /><StatCard label="Resolved" value={rows.filter((r) => r.status.toUpperCase() === "RESOLVED").length} icon={UserCheck} /></div><DataTable data={rows} loading={flags.isLoading} error={flags.isError} searchKeys={["user", "reason", "riskLevel", "status"]} columns={moderationColumns((flagId) => setDismissForm({ flagId, note: "" }), (userId) => trust.mutate(userId, { onSuccess: () => toast("User marked trusted", "success"), onError: (error) => toast(getApiErrorMessage(error), "error") }))} /><ConfirmDialog open={Boolean(dismissForm)} title="Dismiss Flag" description="Enter a review note before dismissing this moderation flag." confirmLabel="Dismiss Flag" onCancel={() => setDismissForm(null)} loading={dismiss.isPending} onConfirm={() => {
    if (!dismissForm) return;
    if (!dismissForm.note.trim()) {
      toast("Dismiss note is required.", "warning");
      return;
    }
    dismiss.mutate(dismissForm, { onSuccess: () => { toast("Flag dismissed", "success"); setDismissForm(null); }, onError: (error) => toast(getApiErrorMessage(error), "error") });
  }}>{dismissForm ? <Input value={dismissForm.note} onChange={(event) => setDismissForm({ ...dismissForm, note: event.target.value })} placeholder="Reviewed by admin. No action required." /> : null}</ConfirmDialog></div>;
}

export function AIUsagePage() {
  const [billingCycleStart, setBillingCycleStart] = useState("");
  const ai = useAIUsage({ billingCycleStart: billingCycleStart || undefined });
  const data = ai.data;
  if (ai.isLoading) return <PageSkeleton title="AI Usage" />;
  if (ai.isError || !data) return <ErrorState description={getApiErrorMessage(ai.error)} onRetry={() => void ai.refetch()} />;
  return <div className="space-y-6"><PageHeader title="AI Usage" description="AI analytics from /admin/analytics/ai-usage." actions={<Input type="date" value={billingCycleStart} onChange={(event) => setBillingCycleStart(event.target.value)} aria-label="Billing cycle start" />} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6"><StatCard label="Total AI Requests" value={data.summary.totalRequests} icon={Bot} /><StatCard label="Free Plan Usage" value={data.summary.freePlanUsage} icon={Users} /><StatCard label="Paid Plan Usage" value={data.summary.paidPlanUsage} icon={CreditCard} /><StatCard label="AI Cost This Month" value={data.summary.costThisMonth} icon={Wallet} currency /><StatCard label="Average Cost Per User" value={data.summary.averageCostPerUser} icon={UserCheck} currency /><StatCard label="AI Revenue Impact" value={data.summary.revenueImpact} icon={CircleDollarSign} currency /></div><div className="grid gap-4 xl:grid-cols-3"><SimpleBarChart title="AI Requests Over Time" data={data.requests} /><SimpleLineChart title="AI Cost Over Time" data={data.costs} /><UsagePieChart data={[{ name: "Free", value: data.summary.freePlanUsage }, { name: "Paid", value: data.summary.paidPlanUsage }]} /></div><DataTable data={data.usage} searchKeys={["user", "plan"]} columns={aiColumns} emptyTitle="No AI usage data available" /></div>;
}

export function ActivityLogsPage() {
  const logs = useActivityLogs();
  return <div className="space-y-6"><PageHeader title="Activity Logs" description="Audit log data from /admin/activity-logs." /><DataTable data={logs.data ?? []} loading={logs.isLoading} error={logs.isError} searchKeys={["admin", "action", "target", "result"]} columns={activityColumns} emptyTitle="No activity logs" /></div>;
}

export function SecurityPage() {
  return <div className="space-y-6"><PageHeader title="Security" description="Session status and backend-owned security posture. No 2FA configuration is present." /><div className="grid gap-4 md:grid-cols-4"><StatCard label="Session Status" value={1} icon={Lock} /><StatCard label="Failed Login Attempts" value={0} icon={ShieldAlert} /><StatCard label="Locked Accounts" value={0} icon={Ban} /><StatCard label="Recent Logins" value={0} icon={Activity} /></div><Card><h2 className="font-semibold">Session Timeout</h2><div className="mt-4 flex flex-wrap gap-2">{["15 minutes", "30 minutes", "1 hour", "4 hours"].map((item) => <Button key={item} variant={item === "30 minutes" ? "primary" : "secondary"}>{item}</Button>)}</div><p className="mt-3 text-sm text-muted-foreground">The backend remains the authority for session expiration and account lockout.</p></Card></div>;
}

function DateRangeSelector({ value, onChange }: { value: { startDate: string; endDate: string }; onChange: (value: { startDate: string; endDate: string }) => void }) {
  return <div className="flex flex-col gap-2 sm:flex-row"><Input type="date" value={value.startDate} onChange={(event) => onChange({ ...value, startDate: event.target.value })} aria-label="Start date" /><Input type="date" value={value.endDate} onChange={(event) => onChange({ ...value, endDate: event.target.value })} aria-label="End date" /></div>;
}

function PageSkeleton({ title }: { title: string }) {
  return <div className="space-y-6"><PageHeader title={title} description="Loading admin information." /><div className="grid gap-4 md:grid-cols-3"><div className="h-32 animate-pulse rounded-xl bg-muted" /><div className="h-32 animate-pulse rounded-xl bg-muted" /><div className="h-32 animate-pulse rounded-xl bg-muted" /></div></div>;
}

function InfoGrid({ rows }: { rows: [string, React.ReactNode][] }) {
  return <dl className="grid gap-3 text-sm">{rows.map(([label, value]) => <div key={label} className="flex items-center justify-between gap-4 border-b border-border pb-2 last:border-0"><dt className="text-muted-foreground">{label}</dt><dd className="text-right font-medium text-foreground">{value}</dd></div>)}</dl>;
}

function SupportRecords({ records, loading }: { records?: { invoices: { id: string; label: string; value: string; status?: string }[]; expenses: { id: string; label: string; value: string; status?: string }[]; activity: { id: string; label: string; value: string; status?: string }[] }; loading?: boolean }) {
  if (loading) return <PageSkeleton title="Support Records" />;
  if (!records) return <EmptyState title="No support records" description="No records were returned for this user." />;
  return <div className="grid gap-4 xl:grid-cols-3">{(["invoices", "expenses", "activity"] as const).map((key) => <Card key={key}><h2 className="font-semibold capitalize">{key}</h2><div className="mt-3 grid gap-2">{records[key].length ? records[key].map((record) => <div key={record.id} className="rounded-lg border border-border p-3 text-sm"><p className="font-medium">{record.label}</p><p className="text-muted-foreground">{record.value}</p>{record.status ? <div className="mt-2"><StatusBadge value={record.status} /></div> : null}</div>) : <p className="text-sm text-muted-foreground">No {key} returned.</p>}</div></Card>)}</div>;
}

function ActionFields({ type, email, setEmail, reason, setReason, cancelFirst, setCancelFirst }: { type: "block" | "delete"; email: string; setEmail: (value: string) => void; reason: string; setReason: (value: string) => void; cancelFirst: boolean; setCancelFirst: (value: boolean) => void }) {
  return <div className="grid gap-3">{type === "block" ? <Input value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Repeated policy violations confirmed by admin review." /> : <><Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="user@example.com" /><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={cancelFirst} onChange={(event) => setCancelFirst(event.target.checked)} /> Cancel subscription first</label></>}</div>;
}

const paymentColumns = (refund: (payment: FailedPendingPayment) => void): Column<FailedPendingPayment>[] => [
  { key: "transactionId", header: "Transaction ID" },
  { key: "user", header: "User" },
  { key: "amount", header: "Amount", render: (row) => formatCurrency(row.amount) },
  { key: "plan", header: "Plan", render: (row) => <StatusBadge value={row.plan} /> },
  { key: "paymentMethod", header: "Payment Method" },
  { key: "status", header: "Status", render: (row) => <StatusBadge value={row.status} /> },
  { key: "date", header: "Date" },
  { key: "actions", header: "Actions", render: (row) => <Button variant="secondary" onClick={() => refund(row)}>Refund Payment</Button> },
];

const moderationColumns = (dismiss: (flagId: string) => void, trust: (userId: string) => void): Column<ModerationFlag>[] => [
  { key: "user", header: "Flagged User" },
  { key: "reason", header: "Reason" },
  { key: "riskLevel", header: "Risk Level", render: (row) => <StatusBadge value={row.riskLevel} /> },
  { key: "detectedAt", header: "Detected At", render: (row) => row.detectedAt ? relativeTime(row.detectedAt) : "Not returned" },
  { key: "status", header: "Status", render: (row) => <StatusBadge value={row.status} /> },
  { key: "actions", header: "Actions", render: (row) => <div className="flex gap-2"><Button variant="secondary" onClick={() => dismiss(row.flagId)}>Dismiss</Button><Button variant="secondary" disabled={!row.userId} onClick={() => trust(row.userId)}>Trust User</Button></div> },
];

const aiColumns: Column<AIUsageRow>[] = [
  { key: "user", header: "User" },
  { key: "plan", header: "Plan", render: (row) => <StatusBadge value={row.plan} /> },
  { key: "requests", header: "AI Requests", render: (row) => <span className={row.requests > 25000 ? "font-semibold text-error" : ""}>{formatNumber(row.requests)}</span> },
  { key: "tokens", header: "Tokens", render: (row) => formatNumber(row.tokens) },
  { key: "estimatedCost", header: "Estimated Cost", render: (row) => formatCurrency(row.estimatedCost) },
  { key: "lastUsed", header: "Last Used", render: (row) => row.lastUsed ? relativeTime(row.lastUsed) : "Not returned" },
];

const activityColumns: Column<ActivityLog>[] = [
  { key: "admin", header: "Admin" },
  { key: "action", header: "Action" },
  { key: "target", header: "Target" },
  { key: "ipAddress", header: "IP Address" },
  { key: "timestamp", header: "Timestamp", render: (row) => row.timestamp ? relativeTime(row.timestamp) : "Not returned" },
  { key: "result", header: "Result", render: (row) => <StatusBadge value={row.result || "Unknown"} /> },
];
