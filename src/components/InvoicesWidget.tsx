import React from 'react';
import { FileText, CreditCard, Tag } from 'lucide-react';

interface InvoiceRow {
  id: string;
  vendor: string;
  status: 'upcoming' | 'paid' | 'overdue';
  date: string;
  amount: number;
}

const statusStyles: Record<InvoiceRow['status'], string> = {
  upcoming: 'bg-purple-100 text-purple-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700',
};

const InvoicesWidget: React.FC<{ rows?: InvoiceRow[] }> = ({
  rows = [
    { id: '#ID152A', vendor: 'SuperBank IC', status: 'upcoming', date: '11/12/2023', amount: 22000 },
    { id: '#ID152B', vendor: 'Cloud Hosting', status: 'paid', date: '11/18/2023', amount: 10000 },
    { id: '#ID152C', vendor: 'Design Tools', status: 'upcoming', date: '11/22/2023', amount: 5400 },
  ],
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Invoices
        </h3>
        <button className="px-3 py-1.5 rounded-md text-sm bg-gray-900 text-white hover:bg-black/80">Create Invoice</button>
      </div>
      <div className="divide-y divide-gray-100">
        {rows.map((row) => (
          <div key={row.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-9 w-9 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-5 w-5 text-gray-700" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">{row.id}</div>
                <div className="text-xs text-gray-500 truncate">{row.vendor}</div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${statusStyles[row.status]}`}>
                <Tag className="h-3.5 w-3.5" />
                {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
              </span>
              <div className="text-sm text-gray-600 w-28 text-right">{row.date}</div>
              <div className="text-sm font-semibold text-gray-900 w-28 text-right">${row.amount.toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-5 py-3 text-right">
        <button className="text-sm font-medium text-gray-600 hover:text-gray-900">View More</button>
      </div>
    </div>
  );
};

export default InvoicesWidget;
