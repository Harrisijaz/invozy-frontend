"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form";
import { useToast } from "@/components/common/toast";
import { getCustomerApiErrorMessage } from "@/src/lib/customer/api";
import { useSettings, useUpdateSettings } from "@/src/hooks/customer/useSettings";

export default function BusinessSettingsPage() {
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
      toast("Business settings saved.", "success");
    } catch (error) {
      toast(getCustomerApiErrorMessage(error), "error");
    }
  };

  return (
    <div className="grid gap-6">
      <PageHeader title="Business Settings" description="Business details feed invoice previews, quotation previews, and PDF output." />
      <Card className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Business Name"><Input value={values.businessName} onChange={(event) => setForm((current) => ({ ...current, businessName: event.target.value }))} /></Field>
          <Field label="Logo URL"><Input value={values.logoUrl} onChange={(event) => setForm((current) => ({ ...current, logoUrl: event.target.value }))} /></Field>
          <Field label="Currency"><Input value={values.baseCurrency} onChange={(event) => setForm((current) => ({ ...current, baseCurrency: event.target.value }))} /></Field>
          <Field label="Default Tax Rate"><Input type="number" min="0" max="100" step="0.01" value={values.defaultTaxRate} onChange={(event) => setForm((current) => ({ ...current, defaultTaxRate: Number(event.target.value) }))} /></Field>
        </div>
        <div className="flex justify-end"><Button onClick={save} isLoading={updateSettings.isPending}>Save Business</Button></div>
      </Card>
    </div>
  );
}
