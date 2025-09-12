import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as XLSX from "xlsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const exportToExcel = (rows: any[], columns: any[], columnSizing?: Record<string, number>) => {
  const data = rows.map((row) =>
    columns.map((col) => row.original[col.accessorKey] || "")
  );

  const header = columns.map((col) => {
    console.log(col)
    return col.accessorKey;
  });
  const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);

  // Set column widths based on table column sizes
  if (columnSizing) {
    const colWidths = columns.map((col) => {
      const size = columnSizing[col.accessorKey] || col.size || 150;
      // Convert pixels to Excel column width (approximate conversion)
      return { wch: Math.max(size / 8, 10) };
    });
    worksheet['!cols'] = colWidths;
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "TableData");

  XLSX.writeFile(workbook, "table-data.xlsx");
};
