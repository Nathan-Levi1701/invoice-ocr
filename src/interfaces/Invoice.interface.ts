interface InvoiceItem {
  description: string,
  itemTotal: number,
}

interface Invoices {
  invoices: Array<InvoiceItem>
  totalInvoiceCost: number
}