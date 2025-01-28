"use client";

import { useContext } from "react";
import { FFAdapterContext } from "../ui/toolbar-provider";
import RevenueChart from "../ui/dashboard/revenue-chart";
import LatestInvoices from "../ui/dashboard/latest-invoices";

export default function Page({
  revenue,
  latestInvoices,
}: {
  revenue: any;
  latestInvoices: any;
}) {
  const { overrides } = useContext(FFAdapterContext);

  return (
    <div>
      <p>Work Page</p>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        {overrides["revenue"] && <RevenueChart revenue={revenue} />}
        {overrides["invoices"] && (
          <LatestInvoices latestInvoices={latestInvoices} />
        )}
      </div>
    </div>
  );
}
