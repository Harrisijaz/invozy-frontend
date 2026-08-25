import { FileDown } from "lucide-react";
import { FeatureGate } from "@/components/shared/feature-gate";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getEntitlements } from "@/src/lib/customer/entitlements";
import { mockUsage, mockUser } from "@/src/mocks/customer/data";

export default function FinancialReportsPage() {
  const entitlements = getEntitlements(mockUser.plan, mockUsage);
  return (
    <div className="grid gap-6">
      <PageHeader title="Financial Reports" description="Monthly and yearly reports with PDF and CSV exports." />
      <FeatureGate allowed={entitlements.canExportReports} title="Financial reports are paid only" description="Unlock monthly reports, yearly reports, PDF export, and CSV export with Invozy Paid.">
        <div className="grid gap-4 md:grid-cols-2">
          {["Monthly Report", "Yearly Report"].map((title) => <Card key={title}><h2 className="font-semibold">{title}</h2><p className="mt-2 text-sm text-muted-foreground">Generated from backend financial data when report APIs are connected.</p><div className="mt-4 flex flex-wrap gap-2"><Button><FileDown className="h-4 w-4" />Export PDF</Button><Button variant="secondary">Export CSV</Button></div></Card>)}
        </div>
      </FeatureGate>
    </div>
  );
}
