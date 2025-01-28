import { Card } from "@/app/ui/dashboard/cards";
import { lusitana } from "@/app/ui/fonts";
import {
  fetchRevenue,
  fetchLatestInvoices,
  fetchCardData,
} from "@/app/lib/data";
import Work from "./work";
import ToolbarProvider from "../ui/toolbar-provider";

export default async function Page() {
  const revenue = await fetchRevenue();
  const latestInvoices = await fetchLatestInvoices();

  const {
    numberOfInvoices,
    numberOfCustomers,
    totalPaidInvoices,
    totalPendingInvoices,
  } = await fetchCardData();
  return (
    <main>
      <ToolbarProvider>
        <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          Dashboard
        </h1>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card title="Collected" value={totalPaidInvoices} type="collected" />
          <Card title="Pending" value={totalPendingInvoices} type="pending" />
          <Card
            title="Total Invoices"
            value={numberOfInvoices}
            type="invoices"
          />
          <Card
            title="Total Customers"
            value={numberOfCustomers}
            type="customers"
          />
        </div>

        <Work revenue={revenue} latestInvoices={latestInvoices} />
      </ToolbarProvider>
    </main>
  );
}
