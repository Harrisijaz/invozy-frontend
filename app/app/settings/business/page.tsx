import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form";
import { mockBusiness } from "@/src/mocks/customer/data";

export default function BusinessSettingsPage() {
  return (
    <div className="grid gap-6">
      <PageHeader title="Business Settings" description="Business details feed invoice previews, quotation previews, and PDF output." />
      <Card className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Business Name"><Input defaultValue={mockBusiness.name} /></Field>
          <Field label="Business Email"><Input type="email" defaultValue={mockBusiness.email} /></Field>
          <Field label="Phone"><Input defaultValue={mockBusiness.phone} /></Field>
          <Field label="Website"><Input defaultValue={mockBusiness.website} /></Field>
          <Field label="Address"><Input defaultValue={mockBusiness.address} /></Field>
          <Field label="Currency"><Input defaultValue={mockBusiness.currency} /></Field>
        </div>
        <div className="flex justify-end"><Button>Save Business</Button></div>
      </Card>
    </div>
  );
}
