"use client";

import { Building2, Camera, CreditCard, Save, Shield, Trash2, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/common/toast";
import { PageHeader } from "@/components/shared/page-header";
import { PlanBadge, StatusBadge } from "@/components/shared/status-badge";
import { UsageProgress } from "@/components/shared/usage-progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/form";
import { clearUserSession } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { getCustomerApiErrorMessage } from "@/src/lib/customer/api";
import { formatDate } from "@/src/lib/customer/formatters";
import { useProfile, useRemoveProfilePicture, useUpdateDisplayName, useUploadProfilePicture } from "@/src/hooks/customer/useProfile";
import { useChangePassword, useSettings, useUpdateSettings } from "@/src/hooks/customer/useSettings";
import { useCancelSubscription, useCreateCheckout, useSubscription } from "@/src/hooks/customer/useSubscription";
import { validateProfilePicture } from "@/src/services/customer/profile.service";

type Tab = "profile" | "security" | "business" | "billing";

const tabs: Array<{ id: Tab; label: string; icon: typeof UserRound }> = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "security", label: "Security", icon: Shield },
  { id: "business", label: "Business Settings", icon: Building2 },
  { id: "billing", label: "Billing", icon: CreditCard },
];

const displayNamePattern = /^[A-Za-z\s'-]{1,100}$/;

export function ProfileSettingsTabs() {
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  return (
    <div className="grid gap-6">
      <PageHeader title="Profile & Settings" description="Manage account identity, security, business defaults, and billing." />
      <div className="flex gap-2 overflow-x-auto rounded-lg border border-border bg-card p-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn("inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground", active && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground")}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
      {activeTab === "profile" ? <ProfileTab /> : null}
      {activeTab === "security" ? <SecurityTab /> : null}
      {activeTab === "business" ? <BusinessTab /> : null}
      {activeTab === "billing" ? <BillingTab /> : null}
    </div>
  );
}

function ProfileTab() {
  const toast = useToast();
  const profile = useProfile();
  const updateName = useUpdateDisplayName();
  const uploadPicture = useUploadProfilePicture();
  const removePicture = useRemoveProfilePicture();
  const [displayName, setDisplayName] = useState("");
  const [touched, setTouched] = useState(false);
  const currentName = touched ? displayName : profile.data?.displayName ?? "";
  const initials = (profile.data?.displayName || profile.data?.email || "U").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const nameError = currentName && !displayNamePattern.test(currentName) ? "Use 1-100 letters, spaces, hyphens, or apostrophes." : "";

  const save = async () => {
    if (!currentName.trim() || !displayNamePattern.test(currentName)) {
      toast("Display name needs correction.", "error");
      return;
    }
    try {
      await updateName.mutateAsync(currentName.trim());
      setTouched(false);
      toast("Profile updated.", "success");
    } catch (error) {
      toast(getCustomerApiErrorMessage(error), "error");
    }
  };

  const upload = async (file: File | undefined) => {
    if (!file) return;
    const validationError = validateProfilePicture(file);
    if (validationError) {
      toast(validationError, "error");
      return;
    }
    try {
      await uploadPicture.mutateAsync(file);
      toast("Profile picture updated.", "success");
    } catch (error) {
      toast(getCustomerApiErrorMessage(error), "error");
    }
  };

  const remove = async () => {
    try {
      await removePicture.mutateAsync();
      toast("Profile picture removed.", "success");
    } catch (error) {
      toast(getCustomerApiErrorMessage(error), "error");
    }
  };

  if (profile.isLoading) return <Card>Loading profile...</Card>;
  if (profile.isError || !profile.data) return <Card>Unable to load profile.</Card>;

  return (
    <div className="grid gap-4 xl:grid-cols-[360px_1fr]">
      <Card className="self-start">
        <div className="flex flex-col items-center text-center">
          {profile.data.profilePictureUrl ? (
            <div className="h-28 w-28 rounded-full bg-cover bg-center ring-4 ring-primary/10" style={{ backgroundImage: `url("${profile.data.profilePictureUrl}")` }} aria-label="Profile picture" />
          ) : (
            <div className="grid h-28 w-28 place-items-center rounded-full bg-primary/10 text-3xl font-semibold text-primary ring-4 ring-primary/10">{initials}</div>
          )}
          <h2 className="mt-4 text-lg font-semibold">{profile.data.displayName}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{profile.data.email}</p>
          <p className="mt-3 text-xs text-muted-foreground">Created {formatDate(profile.data.createdAt)}</p>
        </div>
        <div className="mt-5 grid gap-2">
          <label className="inline-flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
            <Camera className="h-4 w-4" />
            {profile.data.profilePictureUrl ? "Change Picture" : "Upload Picture"}
            <input className="sr-only" type="file" accept="image/png,image/jpeg,image/jpg,image/webp" onChange={(event) => void upload(event.target.files?.[0])} />
          </label>
          <Button type="button" variant="secondary" onClick={remove} isLoading={removePicture.isPending} disabled={!profile.data.profilePictureUrl}><Trash2 className="h-4 w-4" />Remove Picture</Button>
        </div>
      </Card>
      <Card className="grid gap-4">
        <h2 className="font-semibold">Profile Details</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Display Name" error={nameError}><Input value={currentName} onChange={(event) => { setTouched(true); setDisplayName(event.target.value); }} /></Field>
          <Field label="Email"><Input type="email" value={profile.data.email} readOnly className="text-muted-foreground" /></Field>
        </div>
        <div className="flex justify-end"><Button onClick={save} isLoading={updateName.isPending} disabled={Boolean(nameError)}><Save className="h-4 w-4" />Save Profile</Button></div>
      </Card>
    </div>
  );
}

function SecurityTab() {
  const router = useRouter();
  const toast = useToast();
  const changePassword = useChangePassword();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const checks = [
    { label: "8+ characters", valid: newPassword.length >= 8 },
    { label: "Letter", valid: /[A-Za-z]/.test(newPassword) },
    { label: "Number", valid: /[0-9]/.test(newPassword) },
    { label: "Symbol", valid: /[^A-Za-z0-9]/.test(newPassword) },
  ];
  const confirmError = confirmNewPassword && newPassword !== confirmNewPassword ? "Passwords do not match." : "";
  const valid = currentPassword.length > 0 && checks.every((item) => item.valid) && newPassword === confirmNewPassword;

  const save = async () => {
    if (!valid) {
      toast("Password needs correction.", "error");
      return;
    }
    try {
      await changePassword.mutateAsync({ currentPassword, newPassword });
      clearUserSession();
      toast("Password changed. Please log in again.", "success");
      router.replace("/login");
    } catch (error) {
      toast(getCustomerApiErrorMessage(error), "error");
    }
  };

  return (
    <Card className="grid max-w-3xl gap-4">
      <h2 className="font-semibold">Security</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Current Password"><Input type="password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} /></Field>
        <Field label="New Password"><Input type="password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></Field>
        <Field label="Confirm New Password" error={confirmError}><Input type="password" value={confirmNewPassword} onChange={(event) => setConfirmNewPassword(event.target.value)} /></Field>
      </div>
      <div className="flex flex-wrap gap-2">
        {checks.map((item) => <StatusBadge key={item.label} value={item.label} tone={item.valid ? "success" : "warning"} />)}
      </div>
      <div className="flex justify-end"><Button onClick={save} isLoading={changePassword.isPending} disabled={!valid}>Change Password</Button></div>
    </Card>
  );
}

function BusinessTab() {
  const toast = useToast();
  const settings = useSettings();
  const updateSettings = useUpdateSettings();
  const [form, setForm] = useState<Partial<{ businessName: string; logoUrl: string; baseCurrency: string; defaultTaxRate: number }>>({});
  const values = {
    businessName: form.businessName ?? settings.data?.businessName ?? "",
    logoUrl: form.logoUrl ?? settings.data?.logoUrl ?? "",
    baseCurrency: form.baseCurrency ?? settings.data?.baseCurrency ?? "USD",
    defaultTaxRate: form.defaultTaxRate ?? settings.data?.defaultTaxRate ?? 0,
  };

  const save = async () => {
    try {
      await updateSettings.mutateAsync(values);
      setForm({});
      toast("Business settings saved.", "success");
    } catch (error) {
      toast(getCustomerApiErrorMessage(error), "error");
    }
  };

  if (settings.isLoading) return <Card>Loading business settings...</Card>;
  if (settings.isError) return <Card>Unable to load business settings.</Card>;

  return (
    <Card className="grid gap-4">
      <h2 className="font-semibold">Business Settings</h2>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Business Name"><Input value={values.businessName} onChange={(event) => setForm((current) => ({ ...current, businessName: event.target.value }))} /></Field>
        <Field label="Base Currency"><Select value={values.baseCurrency} onChange={(event) => setForm((current) => ({ ...current, baseCurrency: event.target.value }))}><option value="USD">USD</option><option value="EUR">EUR</option><option value="GBP">GBP</option><option value="PKR">PKR</option></Select></Field>
        <Field label="Default Tax Rate"><Input type="number" min="0" max="100" step="0.01" value={values.defaultTaxRate} onChange={(event) => setForm((current) => ({ ...current, defaultTaxRate: Number(event.target.value) }))} /></Field>
        <Field label="Logo URL"><Input value={values.logoUrl} onChange={(event) => setForm((current) => ({ ...current, logoUrl: event.target.value }))} /></Field>
      </div>
      <div className="flex justify-end"><Button onClick={save} isLoading={updateSettings.isPending}><Save className="h-4 w-4" />Save Business</Button></div>
    </Card>
  );
}

function BillingTab() {
  const subscription = useSubscription();
  const checkout = useCreateCheckout();
  const cancel = useCancelSubscription();
  const usage = subscription.data?.usage;
  const current = subscription.data?.subscription;
  const paid = current?.planType === "PAID";

  if (subscription.isLoading) return <Card>Loading billing...</Card>;
  if (subscription.isError || !current || !usage) return <Card>Unable to load billing details.</Card>;

  return (
    <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Current Plan</p>
            <h2 className="mt-1 text-2xl font-semibold">{paid ? "Paid" : "Free"}</h2>
          </div>
          <PlanBadge plan={current.planType} />
        </div>
        <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
          <p>Status: <span className="font-medium text-foreground">{current.status}</span></p>
          {current.renewalDate ? <p>Renewal: <span className="font-medium text-foreground">{formatDate(current.renewalDate)}</span></p> : null}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {!paid ? <Button onClick={() => checkout.mutate()} isLoading={checkout.isPending}>Upgrade</Button> : null}
          {paid ? <Button variant="danger" onClick={() => cancel.mutate()} isLoading={cancel.isPending}>Cancel</Button> : null}
        </div>
      </Card>
      <Card className="grid gap-4">
        <h2 className="font-semibold">Usage Limits</h2>
        <UsageProgress label="Invoices" used={current.lifetimeInvoiceCount} limit={paid ? null : current.freeInvoiceLimit} scope="lifetime" />
        <UsageProgress label="AI Generations" used={current.lifetimeAiGenerationCount} limit={paid ? null : current.freeAiLimit} scope="lifetime" />
      </Card>
    </div>
  );
}
