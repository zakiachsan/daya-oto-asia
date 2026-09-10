interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T extends Record<string, unknown>> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  emptyMessage = "Belum ada data",
}: DataTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className="bg-white border border-slds-border rounded-lg p-10 text-center text-slds-text-weak text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="bg-white border border-slds-border rounded-lg overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="bg-slds-bg border-b border-slds-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-2.5 text-left font-semibold text-slds-text-weak uppercase text-[10px] tracking-wide ${col.className ?? ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} className="border-b border-slds-border last:border-0 hover:bg-slds-bg/60 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className={`px-4 py-3 text-slds-text ${col.className ?? ""}`}>
                    {col.render ? col.render(row) : String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
