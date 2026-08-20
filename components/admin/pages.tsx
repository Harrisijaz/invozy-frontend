"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Activity, Ban, Bot, CircleDollarSign, CreditCard, Download, FileText, KeyRound, LifeBuoy, Lock, ShieldAlert, Trash2, UserCheck, Users, Wallet } from "lucide-react";
import { useActivityLogs } from "@/hooks/useAdmin";
import { useAIUsage } from "@/hooks/useAIUsage";
import { useAnalytics } from "@/hooks/useAnalytics";
import { usePayments, useRefunds, useRequestRefund } from "@/hooks/useBilling";
import { useDismissFlag, useModeration } from "@/hooks/useModeration";
import { useCancelSubscription, useSubscriptions } from "@/hooks/useSubscriptions";
import { useUser, useUserActions, useUserDetails, useUsers } from "@/hooks/useUsers";
import { formatCurrency, formatNumber, relativeTime } from "@/lib/utils";
import type { AIUsage, ActivityLog, ModerationFlag, Payment, Subscription, User } from "@/types";
import { Column, DataTable } from "@/components/common/data-table";
import { Button, Card, ConfirmDialog, EmptyState, ErrorState, Input, PageHeader, StatusBadge } from "@/components/common/ui";
import { useToast } from "@/components/common/toast";
import { RevenueChart, SimpleBarChart, SimpleLineChart, UsagePieChart } from "./charts";
import { StatCard } from "./stat-card";

export function DashboardPage() {
  const analytics = useAnalytics();
  if (analytics.isLoading) return <PageSkeleton title="Dashboard" />;
  if (!analytics.data) return <ErrorState onRetry={() => void analytics.refetch()} />;
  const data = analytics.data;
  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="Operational overview for Invozy users, revenue, subscriptions, and risk." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard {...data.totalUsers} icon={Users} />
        <StatCard {...data.freeUsers} icon={UserCheck} />
        <StatCard {...data.paidUsers} icon={CreditCard} />
        <StatCard {...data.monthlyRevenue} icon={CircleDollarSign} currency />
      </div>
      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]"><RevenueChart data={data.revenue} /><SimpleBarChart title="New Signups" data={data.signups} /></div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Churn Rate" value={data.churnRate} change={-0.3} comparison="vs previous period" icon={ShieldAlert} />
        <StatCard label="Cancelled Paid Subscriptions" value={data.cancelledPaidSubscriptions} change={-4.1} comparison="vs last month" icon={Ban} />
        <StatCard label="Retained Users" value={data.retainedUsers} change={9.2} comparison="vs last month" icon={UserCheck} />
      </div>
    </div>
  );
}

export function AnalyticsPage() {
  const analytics = useAnalytics();
  if (!analytics.data) return <PageSkeleton title="Revenue" />;
  return (
    <div className="space-y-6">
      <PageHeader title="Revenue" description="Revenue growth, signup velocity, and churn signals across Invozy plans." actions={<select className="rounded-lg border border-border bg-card px-3 py-2 text-sm"><option>Daily</option><option>Weekly</option><option>Monthly</option></select>} />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Current Month Revenue" value={98420} change={18.6} comparison="vs last month" icon={Wallet} currency />
        <StatCard label="Previous Month Revenue" value={83010} change={11.4} comparison="vs prior month" icon={CircleDollarSign} currency />
        <StatCard label="Revenue Growth" value={18.6} change={2.8} comparison="net growth" icon={Activity} />
      </div>
      <RevenueChart data={analytics.data.revenue} />
      <div className="grid gap-4 lg:grid-cols-2"><SimpleBarChart title="New Signups" data={analytics.data.signups} /><SimpleLineChart title="Churn Analytics" data={analytics.data.churn} /></div>
    </div>
  );
}

export function UsersPage() {
  const users = useUsers();
  const actions = useUserActions();
  const toast = useToast();
  const [confirm, setConfirm] = useState<{ id: string; type: "block" | "unblock" | "delete" } | null>(null);
  const columns: Column<User>[] = [
    { key: "name", header: "User", sortable: true, render: (user) => <Link className="font-medium text-primary hover:underline" href={`/admin/users/${user.id}`}>{user.name}</Link> },
    { key: "email", header: "Email", sortable: true },
    { key: "plan", header: "Plan", sortable: true, render: (user) => <StatusBadge value={user.plan} /> },
    { key: "status", header: "Status", sortable: true, render: (user) => <StatusBadge value={user.status} /> },
    { key: "signupDate", header: "Signup Date", sortable: true },
    { key: "revenue", header: "Revenue", sortable: true, render: (user) => formatCurrency(user.revenue) },
    { key: "actions", header: "Actions", render: (user) => <div className="flex gap-2"><Button variant="secondary" onClick={() => setConfirm({ id: user.id, type: user.status === "Blocked" ? "unblock" : "block" })}>{user.status === "Blocked" ? "Unblock" : "Block"}</Button><Button variant="ghost" onClick={() => setConfirm({ id: user.id, type: "delete" })}><Trash2 className="h-4 w-4" /></Button></div> },
  ];
  const exportCsv = () => {
    toast("CSV export completed", "success");
  };
  const runConfirm = () => {
    if (!confirm) return;
    const mutation = confirm.type === "block" ? actions.block : confirm.type === "unblock" ? actions.unblock : actions.remove;
    mutation.mutate(confirm.id, { onSuccess: () => { toast(confirm.type === "delete" ? "User deleted successfully" : `User ${confirm.type}ed successfully`, "success"); setConfirm(null); } });
  };
  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Manage all Invozy users and account status." actions={<><Button variant="secondary" onClick={exportCsv}><Download className="h-4 w-4" /> Export CSV</Button><Button variant="secondary">Filter</Button></>} />
      <DataTable data={users.data ?? []} columns={columns} searchKeys={["name", "email", "plan", "status"]} loading={users.isLoading} error={users.isError} emptyTitle="No users found" />
      <ConfirmDialog open={Boolean(confirm)} title={confirm?.type === "delete" ? "Delete this user?" : `${confirm?.type === "unblock" ? "Unblock" : "Block"} User`} description={confirm?.type === "delete" ? "The account will be deactivated, but the user's data will not be permanently deleted." : "The user access state will be changed. Existing data will remain intact."} confirmLabel={confirm?.type === "delete" ? "Delete User" : "Confirm"} onCancel={() => setConfirm(null)} onConfirm={runConfirm} loading={actions.block.isPending || actions.unblock.isPending || actions.remove.isPending} />
    </div>
  );
}

export function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const user = useUser(id);
  const details = useUserDetails(id);
  const actions = useUserActions();
  const toast = useToast();
  const [note, setNote] = useState("");
  if (!user.data) return <PageSkeleton title="User Details" />;
  return (
    <div className="space-y-6">
      <PageHeader title={user.data.name} description={`${user.data.email} - ${user.data.plan} - ${user.data.status}`} actions={<><Button variant="secondary" onClick={() => actions.resetPassword.mutate(id, { onSuccess: () => toast("Password reset email triggered", "success") })}><KeyRound className="h-4 w-4" /> Trigger Password Reset</Button><Button variant="danger" onClick={() => actions.block.mutate(id, { onSuccess: () => toast("User blocked successfully", "success") })}><Ban className="h-4 w-4" /> Block User</Button></>} />
      <div className="grid gap-4 md:grid-cols-4"><StatCard label="Total Invoices" value={user.data.invoices} icon={FileText} /><StatCard label="Total Expenses" value={user.data.expenses} icon={Wallet} /><StatCard label="Total Payments" value={user.data.payments} icon={CreditCard} /><StatCard label="Revenue" value={user.data.revenue} icon={CircleDollarSign} currency /></div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card><h2 className="mb-3 font-semibold">User Information</h2><dl className="grid gap-3 text-sm"><InfoRow label="Status" value={<StatusBadge value={user.data.status} />} /><InfoRow label="Plan" value={<StatusBadge value={user.data.plan} />} /><InfoRow label="Signup Date" value={user.data.signupDate} /><InfoRow label="Email" value={user.data.email} /></dl></Card>
        <Card><h2 className="mb-3 font-semibold">Current Subscription</h2><dl className="grid gap-3 text-sm"><InfoRow label="Current Plan" value={user.data.plan} /><InfoRow label="Subscription Status" value="Active" /><InfoRow label="Start Date" value={user.data.signupDate} /><InfoRow label="Renewal Date" value="2026-09-20" /><InfoRow label="Cancellation Date" value="Not scheduled" /></dl></Card>
      </div>
      <DataTable data={details.invoices.data ?? []} columns={[{ key: "invoiceNumber", header: "Invoice Number" }, { key: "amount", header: "Amount", render: (row) => formatCurrency(row.amount) }, { key: "status", header: "Status", render: (row) => <StatusBadge value={row.status} /> }, { key: "issueDate", header: "Issue Date" }, { key: "dueDate", header: "Due Date" }]} searchKeys={["invoiceNumber", "status"]} loading={details.invoices.isLoading} />
      <DataTable data={details.expenses.data ?? []} columns={[{ key: "expense", header: "Expense" }, { key: "amount", header: "Amount", render: (row) => formatCurrency(row.amount) }, { key: "category", header: "Category" }, { key: "date", header: "Date" }, { key: "status", header: "Status", render: (row) => <StatusBadge value={row.status} /> }]} searchKeys={["expense", "category", "status"]} loading={details.expenses.isLoading} />
      <Card><h2 className="font-semibold">Internal Notes</h2><p className="mt-1 text-sm text-muted-foreground">Internal - Admins Only</p><div className="mt-4 grid gap-3">{(details.notes.data ?? []).map((item) => <div key={item.id} className="rounded-lg border border-border p-3 text-sm"><p>{item.note}</p><p className="mt-2 text-xs text-muted-foreground">{item.admin} - {new Date(item.createdAt).toLocaleDateString()}</p></div>)}</div><div className="mt-4 flex flex-col gap-2 sm:flex-row"><Input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Add internal note" /><Button onClick={() => actions.addNote.mutate({ id, note }, { onSuccess: () => { toast("Internal note added", "success"); setNote(""); } })}>Add Note</Button></div></Card>
    </div>
  );
}

export function SubscriptionsPage() {
  const subscriptions = useSubscriptions();
  const cancel = useCancelSubscription();
  const toast = useToast();
  const rows = subscriptions.data ?? [];
  return <CrudTablePage title="Subscriptions" description="Monitor plan adoption, trials, cancellations, and subscription actions." stats={[["Free Users", 8210, Users], ["Paid Users", 4630, CreditCard], ["Active Subscriptions", rows.filter((row) => row.status === "Active").length, UserCheck], ["Cancelled Subscriptions", rows.filter((row) => row.status === "Cancelled").length, Ban], ["Trial Users", rows.filter((row) => row.status === "Trial").length, Activity]]} table={<DataTable data={rows} loading={subscriptions.isLoading} searchKeys={["user", "email", "plan", "status"]} columns={subscriptionColumns((id) => cancel.mutate(id, { onSuccess: () => toast("Subscription cancelled", "success") }))} />} />;
}

export function BillingPage() {
  const payments = usePayments();
  const refunds = useRefunds();
  const requestRefund = useRequestRefund();
  const toast = useToast();
  const rows = payments.data ?? [];
  const totalRevenue = rows.filter((row) => row.status === "Successful").reduce((sum, row) => sum + row.amount, 0);
  return (
    <div className="space-y-6">
      <PageHeader title="Billing" description="Payments, refunds, failed charges, and provider-confirmed billing state." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5"><StatCard label="Total Revenue" value={totalRevenue} icon={CircleDollarSign} currency /><StatCard label="Successful Payments" value={rows.filter((r) => r.status === "Successful").length} icon={UserCheck} /><StatCard label="Pending Payments" value={rows.filter((r) => r.status === "Pending").length} icon={Activity} /><StatCard label="Failed Payments" value={rows.filter((r) => r.status === "Failed").length} icon={ShieldAlert} /><StatCard label="Refunds" value={(refunds.data ?? []).length} icon={CreditCard} /></div>
      <DataTable data={rows} loading={payments.isLoading} searchKeys={["transactionId", "user", "status", "plan"]} columns={paymentColumns((id) => requestRefund.mutate(id, { onSuccess: () => toast("Refund requested. Awaiting backend/provider confirmation.", "info") }))} />
      <Card><h2 className="font-semibold">Refund State</h2><div className="mt-4 grid gap-3 md:grid-cols-3">{(refunds.data ?? []).map((refund) => <div className="rounded-lg border border-border p-3" key={refund.id}><p className="font-medium">{refund.transactionId}</p><p className="text-sm text-muted-foreground">{formatCurrency(refund.amount)}</p><div className="mt-2"><StatusBadge value={refund.status} /></div></div>)}</div></Card>
    </div>
  );
}

export function SupportPage() {
  const users = useUsers();
  const [query, setQuery] = useState("");
  const found = useMemo(() => (users.data ?? []).find((user) => `${user.name} ${user.email}`.toLowerCase().includes(query.toLowerCase())), [query, users.data]);
  return (
    <div className="space-y-6">
      <PageHeader title="Support" description="Search a user and inspect account context without exposing sensitive credentials." />
      <Card><div className="flex flex-col gap-3 sm:flex-row"><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by user name or email" /><Button><LifeBuoy className="h-4 w-4" /> Search</Button></div></Card>
      {!query ? <EmptyState title="Search for a user" description="User information, invoices, expenses, subscription, and activity will appear here." /> : found ? <div className="grid gap-4 lg:grid-cols-2"><Card><h2 className="font-semibold">User Information</h2><dl className="mt-3 grid gap-3 text-sm"><InfoRow label="Name" value={found.name} /><InfoRow label="Email" value={found.email} /><InfoRow label="Plan" value={<StatusBadge value={found.plan} />} /><InfoRow label="Status" value={<StatusBadge value={found.status} />} /></dl></Card><Card><h2 className="font-semibold">Account Activity</h2><p className="mt-3 text-sm text-muted-foreground">Latest invoice created, payment checked, and login events are read-only until backend permissions are available.</p><Button className="mt-4" variant="secondary"><KeyRound className="h-4 w-4" /> Trigger Password Reset</Button></Card></div> : <EmptyState title="No user found" description="Try changing your search query." />}
    </div>
  );
}

export function ModerationPage() {
  const moderation = useModeration();
  const dismiss = useDismissFlag();
  const toast = useToast();
  const rows = moderation.data ?? [];
  return <CrudTablePage title="Moderation" description="Review risk flags, dismiss false positives, and block accounts when authorized." stats={[["Total Flags", rows.length, ShieldAlert], ["High Risk", rows.filter((r) => r.riskLevel === "High").length, ShieldAlert], ["Medium Risk", rows.filter((r) => r.riskLevel === "Medium").length, Activity], ["Low Risk", rows.filter((r) => r.riskLevel === "Low").length, UserCheck], ["Resolved", rows.filter((r) => r.status === "Resolved").length, UserCheck]]} table={<DataTable data={rows} loading={moderation.isLoading} searchKeys={["user", "reason", "riskLevel", "status"]} columns={moderationColumns((id) => dismiss.mutate(id, { onSuccess: () => toast("Flag dismissed", "success") }))} />} />;
}

export function AIUsagePage() {
  const ai = useAIUsage();
  const data = ai.data;
  if (!data) return <PageSkeleton title="AI Usage" />;
  return (
    <div className="space-y-6">
      <PageHeader title="AI Usage" description="Monitor AI requests, token cost, usage by plan, and unusually high consumption." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6"><StatCard label="Total AI Requests" value={data.summary.totalRequests} icon={Bot} /><StatCard label="Free Plan Usage" value={data.summary.freePlanUsage} icon={Users} /><StatCard label="Paid Plan Usage" value={data.summary.paidPlanUsage} icon={CreditCard} /><StatCard label="AI Cost This Month" value={data.summary.costThisMonth} icon={Wallet} currency /><StatCard label="Average Cost Per User" value={data.summary.averageCostPerUser} icon={UserCheck} currency /><StatCard label="AI Revenue Impact" value={data.summary.revenueImpact} icon={CircleDollarSign} currency /></div>
      <div className="grid gap-4 xl:grid-cols-3"><SimpleBarChart title="AI Requests Over Time" data={data.requests} /><SimpleLineChart title="AI Cost Over Time" data={data.costs} /><UsagePieChart data={[{ name: "Free", value: data.summary.freePlanUsage }, { name: "Paid", value: data.summary.paidPlanUsage }]} /></div>
      <DataTable data={data.usage} searchKeys={["user", "plan"]} columns={aiColumns} />
    </div>
  );
}

export function ActivityLogsPage() {
  const logs = useActivityLogs();
  return <div className="space-y-6"><PageHeader title="Activity Logs" description="Audit admin actions, targets, IP addresses, timestamps, and outcomes." actions={<><Button variant="secondary">Admin</Button><Button variant="secondary">Action</Button><Button variant="secondary">Date</Button><Button variant="secondary">Result</Button></>} /><DataTable data={logs.data ?? []} loading={logs.isLoading} searchKeys={["admin", "action", "target", "result"]} columns={activityColumns} /></div>;
}

export function SecurityPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Security" description="Session health, timeout policy, login activity, failed attempts, and locked accounts. No 2FA configuration is shown." />
      <div className="grid gap-4 md:grid-cols-4"><StatCard label="Session Status" value={1} icon={Lock} /><StatCard label="Failed Login Attempts" value={18} icon={ShieldAlert} /><StatCard label="Locked Accounts" value={3} icon={Ban} /><StatCard label="Recent Logins" value={42} icon={Activity} /></div>
      <Card><h2 className="font-semibold">Session Timeout</h2><div className="mt-4 flex flex-wrap gap-2">{["15 minutes", "30 minutes", "1 hour", "4 hours"].map((item) => <Button key={item} variant={item === "30 minutes" ? "primary" : "secondary"}>{item}</Button>)}</div><p className="mt-3 text-sm text-muted-foreground">The backend remains the authority for actual session expiration and account lockout.</p></Card>
      <Card><h2 className="font-semibold">Recent Login Activity</h2><div className="mt-4 grid gap-3">{["Haris signed in from 203.0.113.42", "Ayesha signed in from 198.51.100.10", "Failed login for admin@invozy.com"].map((item) => <div key={item} className="rounded-lg border border-border p-3 text-sm">{item}</div>)}</div></Card>
    </div>
  );
}

function PageSkeleton({ title }: { title: string }) {
  return <div className="space-y-6"><PageHeader title={title} description="Loading admin information." /><div className="grid gap-4 md:grid-cols-3"><div className="h-32 animate-pulse rounded-xl bg-muted" /><div className="h-32 animate-pulse rounded-xl bg-muted" /><div className="h-32 animate-pulse rounded-xl bg-muted" /></div></div>;
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-4 border-b border-border pb-2 last:border-0"><dt className="text-muted-foreground">{label}</dt><dd className="text-right font-medium text-foreground">{value}</dd></div>;
}

function CrudTablePage({ title, description, stats, table }: { title: string; description: string; stats: [string, number, typeof Users][]; table: React.ReactNode }) {
  return <div className="space-y-6"><PageHeader title={title} description={description} /><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">{stats.map(([label, value, Icon]) => <StatCard key={label} label={label} value={value} icon={Icon} />)}</div>{table}</div>;
}

const subscriptionColumns = (cancel: (id: string) => void): Column<Subscription>[] => [
  { key: "user", header: "User", sortable: true },
  { key: "plan", header: "Plan", render: (row) => <StatusBadge value={row.plan} /> },
  { key: "status", header: "Status", render: (row) => <StatusBadge value={row.status} /> },
  { key: "startDate", header: "Start Date" },
  { key: "renewalDate", header: "Renewal Date" },
  { key: "actions", header: "Actions", render: (row) => <div className="flex gap-2"><Button variant="secondary">Change Plan</Button><Button variant="secondary" onClick={() => cancel(row.id)}>Cancel</Button><Button variant="ghost">History</Button></div> },
];

const paymentColumns = (refund: (id: string) => void): Column<Payment>[] => [
  { key: "transactionId", header: "Transaction ID", sortable: true },
  { key: "user", header: "User", sortable: true },
  { key: "amount", header: "Amount", render: (row) => formatCurrency(row.amount) },
  { key: "plan", header: "Plan", render: (row) => <StatusBadge value={row.plan} /> },
  { key: "paymentMethod", header: "Payment Method" },
  { key: "status", header: "Status", render: (row) => <StatusBadge value={row.status} /> },
  { key: "date", header: "Date" },
  { key: "actions", header: "Actions", render: (row) => <Button variant="secondary" onClick={() => refund(row.transactionId)}>Refund</Button> },
];

const moderationColumns = (dismiss: (id: string) => void): Column<ModerationFlag>[] => [
  { key: "user", header: "User" },
  { key: "reason", header: "Reason" },
  { key: "riskLevel", header: "Risk Level", render: (row) => <StatusBadge value={row.riskLevel} /> },
  { key: "detectedAt", header: "Detected At", render: (row) => relativeTime(row.detectedAt) },
  { key: "status", header: "Status", render: (row) => <StatusBadge value={row.status} /> },
  { key: "actions", header: "Actions", render: (row) => <div className="flex gap-2"><Button variant="secondary">Review</Button><Button variant="secondary" onClick={() => dismiss(row.id)}>Dismiss</Button><Button variant="danger">Block</Button></div> },
];

const aiColumns: Column<AIUsage>[] = [
  { key: "user", header: "User", sortable: true },
  { key: "plan", header: "Plan", render: (row) => <StatusBadge value={row.plan} /> },
  { key: "requests", header: "AI Requests", render: (row) => <span className={row.requests > 25000 ? "font-semibold text-error" : ""}>{formatNumber(row.requests)}</span> },
  { key: "tokens", header: "Tokens", render: (row) => formatNumber(row.tokens) },
  { key: "estimatedCost", header: "Estimated Cost", render: (row) => formatCurrency(row.estimatedCost) },
  { key: "lastUsed", header: "Last Used", render: (row) => relativeTime(row.lastUsed) },
];

const activityColumns: Column<ActivityLog>[] = [
  { key: "admin", header: "Admin", sortable: true },
  { key: "action", header: "Action", sortable: true },
  { key: "target", header: "Target" },
  { key: "ipAddress", header: "IP Address" },
  { key: "timestamp", header: "Timestamp", render: (row) => relativeTime(row.timestamp) },
  { key: "result", header: "Result", render: (row) => <StatusBadge value={row.result} /> },
];
