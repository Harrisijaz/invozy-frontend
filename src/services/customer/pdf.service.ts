import { customerApi } from "@/src/lib/customer/api";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export const pdfService = {
  async downloadInvoice(id: string) {
    const response = await customerApi.get<Blob>(`/invoices/${id}/pdf`, { responseType: "blob" });
    downloadBlob(response.data, `invoice-${id}.pdf`);
  },
  async downloadQuotation(id: string) {
    const response = await customerApi.get<Blob>(`/quotations/${id}/pdf`, { responseType: "blob" });
    downloadBlob(response.data, `quotation-${id}.pdf`);
  },
  async downloadFinancialReport() {
    throw new Error("Financial report PDF export is not available from the gateway API yet.");
  },
};
