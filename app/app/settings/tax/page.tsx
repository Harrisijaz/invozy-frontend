import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form";
import { mockBusiness } from "@/src/mocks/customer/data";

export default function TaxSettingsPage() {
  return (
    <div className="grid gap-6">
      <PageHeader title="Tax Settings" description="New invoice and quotation line items start with this default tax rate and can be overridden." />
      <Card className="grid max-w-xl gap-4">
        <Field label="Default Tax Rate"><Input type="number" min="0" max="100" step="0.01" defaultValue={mockBusiness.defaultTaxRate} /></Field>
        <div className="flex justify-end"><Button>Save Tax Settings</Button></div>
      </Card>
    </div>
  );
}
