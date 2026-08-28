"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form";
import { useToast } from "@/components/common/toast";
import { getCustomerApiErrorMessage } from "@/src/lib/customer/api";
import { useSettings, useUpdateSettings } from "@/src/hooks/customer/useSettings";

export default function TaxSettingsPage() {
  const toast = useToast();
  const settings = useSettings();
  const updateSettings = useUpdateSettings();
  const [defaultTaxRate, setDefaultTaxRate] = useState<number | null>(null);
  const value = defaultTaxRate ?? settings.data?.defaultTaxRate ?? 0;

  const save = async () => {
    if (!settings.data) return;
    try {
      await updateSettings.mutateAsync({ ...settings.data, defaultTaxRate: value });
      toast("Tax settings saved.", "success");
    } catch (error) {
      toast(getCustomerApiErrorMessage(error), "error");
    }
  };

  return (
    <div className="grid gap-6">
      <PageHeader title="Tax Settings" description="New invoice and quotation line items start with this default tax rate and can be overridden." />
      <Card className="grid max-w-xl gap-4">
        <Field label="Default Tax Rate"><Input type="number" min="0" max="100" step="0.01" value={value} onChange={(event) => setDefaultTaxRate(Number(event.target.value))} /></Field>
        <div className="flex justify-end"><Button onClick={save} isLoading={updateSettings.isPending}>Save Tax Settings</Button></div>
      </Card>
    </div>
  );
}
