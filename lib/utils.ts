import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as XLSX from "xlsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const exportToExcel = (
  rows: any[], 
  columns: any[], 
  columnSizing?: Record<string, number>
) => {
  const exportableColumns = columns.filter(col => col.exportName);

  
  const data = rows.map((row) =>
    exportableColumns.map((col) => {
      // Handle different column types
      if (col.accessorKey) {
        return row.original[col.accessorKey] || "";
      } else if (col.id) {
        return "";
      }
      return "";
    })
  );

  const header = exportableColumns.map((col) => col.exportName);
  const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);

  // Set column widths based on table column sizes
  if (columnSizing) {
    const colWidths = exportableColumns.map((col) => {
      const columnKey = col.accessorKey || col.id;
      const size = columnSizing[columnKey] || col.size || 150;
      // Convert pixels to Excel column width (approximate conversion)
      return { wch: Math.max(size / 8, 10) };
    });
    worksheet['!cols'] = colWidths;
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "TableData");

  XLSX.writeFile(workbook, "table-data.xlsx");
};
