import { DocumentDetail } from "@/components/invoice/document-detail";
import { PageHeader } from "@/components/shared/page-header";

export default async function InvoiceDetailPage(props: PageProps<"/app/invoices/[id]">) {
  const { id } = await props.params;
  return (
    <div className="grid gap-6">
      <PageHeader title="Invoice Preview" description="A branded, print-friendly invoice view with status-aware actions." />
      <DocumentDetail id={id} type="invoice" />
    </div>
  );
}
