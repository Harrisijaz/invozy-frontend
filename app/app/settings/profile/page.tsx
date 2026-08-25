import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/form";
import { mockUser } from "@/src/mocks/customer/data";

export default function ProfileSettingsPage() {
  return (
    <div className="grid gap-6">
      <PageHeader title="Profile Settings" description="Update personal account information. Password changes depend on backend auth APIs." />
      <Card className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Full Name"><Input defaultValue={mockUser.name} /></Field>
          <Field label="Email"><Input type="email" defaultValue={mockUser.email} /></Field>
          <Field label="New Password"><Input type="password" /></Field>
          <Field label="Confirm Password"><Input type="password" /></Field>
        </div>
        <div className="flex justify-end"><Button>Save Profile</Button></div>
      </Card>
    </div>
  );
}
