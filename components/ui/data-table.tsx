"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  getExpandedRowModel,
  ExpandedState,
  ColumnResizeMode,
} from "@tanstack/react-table"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"


// Helper function to add expand functionality to columns
export function addExpandColumn<TData>(
  columns: ColumnDef<TData, any>[],
  data: TData[],
  getSubRows?: (row: TData) => TData[] | undefined,
  renderSubComponent?: (props: { row: any }) => React.ReactElement
): ColumnDef<TData, any>[] {
  const hasSubRows = getSubRows && data.some(row => getSubRows(row) && getSubRows(row)!.length > 0)
  const hasRenderSubComponent = !!renderSubComponent
  
  if (!hasSubRows && !hasRenderSubComponent) return columns

  // Add expand button as the first column
  const expandColumn: ColumnDef<TData, any> = {
    id: "expand",
    header: ({ table }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => table.toggleAllRowsExpanded()}
        className="h-8 w-8 p-0"
      >
        <ChevronDownIcon className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const hasSubRows = getSubRows?.(row.original) && getSubRows(row.original)!.length > 0
      
      // If we have renderSubComponent but no getSubRows, always show expand button
      if (!hasSubRows && !hasRenderSubComponent) {
        return <div className="w-8" />
      }

      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => row.toggleExpanded()}
          className="h-8 w-8 p-0"
        >
          <ChevronDownIcon 
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              row.getIsExpanded() && "rotate-180"
            )} 
          />
        </Button>
      )
    },
    enableSorting: false,
    enableHiding: false,
    size: 50,
    minSize: 50,
    maxSize: 100,
  }

  return [expandColumn, ...columns]
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  filterColumn?: string
  filterPlaceholder?: string
  getSubRows?: (row: TData) => any[] | undefined
  renderSubComponent?: (props: { row: any }) => React.ReactElement
  enableColumnSearch?: boolean
  showToolbar?: boolean
  showPagination?: boolean
  pageSize?: number
  pageSizeOptions?: number[]
  fullWidth?: boolean
}

type FilterType = "text" | "select" | "multi-select" | "range" | "date-range" | "none"

interface FilterOption {
  value: string
  label: string
}

// Filter Components
const TextFilter = ({ column, placeholder }: { column: any; placeholder: string }) => {
  const value = (column.getFilterValue() as string) ?? ""
  
  const resetFilter = () => {
    column.setFilterValue(undefined)
  }

  return (
    <div className="flex items-center gap-1">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(event) => column.setFilterValue(event.target.value)}
        className="h-6 text-xs bg-white/80 border-gray-200 focus:bg-white focus:border-blue-300 focus:ring-1 focus:ring-blue-200 transition-all duration-200 shadow-sm flex-1"
      />
      {value && (
        <button
          onClick={resetFilter}
          className="h-6 w-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          title="Clear filter"
        >
          ×
        </button>
      )}
    </div>
  )
}

const SelectFilter = ({ column, options }: { column: any; options: FilterOption[] }) => {
  const value = (column.getFilterValue() as string) ?? ""
  
  const resetFilter = () => {
    column.setFilterValue(undefined)
  }

  return (
    <div className="flex items-center gap-1">
      <Select
        value={value}
        onValueChange={(value: string) => column.setFilterValue(value === "all" ? "" : value)}
      >
        <SelectTrigger className="h-6 text-xs bg-white/80 border-gray-200 focus:bg-white focus:border-blue-300 focus:ring-1 focus:ring-blue-200 transition-all duration-200 shadow-sm flex-1">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {value && value !== "all" && (
        <button
          onClick={resetFilter}
          className="h-6 w-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
          title="Clear filter"
        >
          ×
        </button>
      )}
    </div>
  )
}

const MultiSelectFilter = ({ column, options }: { column: any; options: FilterOption[] }) => {
  const [selectedValues, setSelectedValues] = React.useState<string[]>(() => {
    const filterValue = column.getFilterValue() as string[] | undefined
    return filterValue ?? []
  })

  const toggleValue = (value: string) => {
    const newValues = selectedValues.includes(value) 
      ? selectedValues.filter(v => v !== value)
      : [...selectedValues, value]
    
    setSelectedValues(newValues)
    
    // Update the column filter immediately
    column.setFilterValue(newValues.length > 0 ? newValues : undefined)
  }

  const resetFilter = () => {
    setSelectedValues([])
    column.setFilterValue(undefined)
  }

  return (
    <div className="space-y-1 max-h-16 overflow-hidden">
      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-1 max-h-8 overflow-y-auto">
          {selectedValues.map((value) => {
            const option = options.find(opt => opt.value === value)
            return (
              <span
                key={value}
                className="px-1 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full cursor-pointer hover:bg-blue-200"
                onClick={() => toggleValue(value)}
              >
                {option?.label || value} ×
              </span>
            )
          })}
        </div>
      )}
      <div className="flex items-center gap-1">
        <Select
          value=""
          onValueChange={(value: string) => {
            if (value && !selectedValues.includes(value)) {
              toggleValue(value)
            }
          }}
        >
          <SelectTrigger className="h-6 text-xs bg-white/80 border-gray-200 focus:bg-white focus:border-blue-300 focus:ring-1 focus:ring-blue-200 transition-all duration-200 shadow-sm flex-1">
            <SelectValue placeholder="Add filter..." />
          </SelectTrigger>
          <SelectContent>
            {options
              .filter(option => !selectedValues.includes(option.value))
              .map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {selectedValues.length > 0 && (
          <button
            onClick={resetFilter}
            className="h-6 w-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="Clear all filters"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

const RangeFilter = ({ column }: { column: any }) => {
  const [min, setMin] = React.useState<string>(() => {
    const filterValue = column.getFilterValue() as { min?: number; max?: number } | undefined
    return filterValue?.min?.toString() || ""
  })
  const [max, setMax] = React.useState<string>(() => {
    const filterValue = column.getFilterValue() as { min?: number; max?: number } | undefined
    return filterValue?.max?.toString() || ""
  })

  const updateFilter = () => {
    const minVal = min ? parseFloat(min) : undefined
    const maxVal = max ? parseFloat(max) : undefined
    
    if (minVal !== undefined || maxVal !== undefined) {
      column.setFilterValue({ min: minVal, max: maxVal })
    } else {
      column.setFilterValue(undefined)
    }
  }

  const resetFilter = () => {
    setMin("")
    setMax("")
    column.setFilterValue(undefined)
  }

  const hasValue = min || max

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        <Input
          placeholder="Min"
          value={min}
          onChange={(e) => setMin(e.target.value)}
          onBlur={updateFilter}
          className="h-6 text-xs bg-white/80 border-gray-200 focus:bg-white focus:border-blue-300 focus:ring-1 focus:ring-blue-200 transition-all duration-200 shadow-sm flex-1"
        />
        <Input
          placeholder="Max"
          value={max}
          onChange={(e) => setMax(e.target.value)}
          onBlur={updateFilter}
          className="h-6 text-xs bg-white/80 border-gray-200 focus:bg-white focus:border-blue-300 focus:ring-1 focus:ring-blue-200 transition-all duration-200 shadow-sm flex-1"
        />
        {hasValue && (
          <button
            onClick={resetFilter}
            className="h-6 w-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="Clear filter"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

const DateRangeFilter = ({ column }: { column: any }) => {
  const [startDate, setStartDate] = React.useState<string>(() => {
    const filterValue = column.getFilterValue() as { from?: string; to?: string } | undefined
    return filterValue?.from || ""
  })
  const [endDate, setEndDate] = React.useState<string>(() => {
    const filterValue = column.getFilterValue() as { from?: string; to?: string } | undefined
    return filterValue?.to || ""
  })

  const updateFilter = () => {
    if (startDate || endDate) {
      column.setFilterValue({ from: startDate, to: endDate })
    } else {
      column.setFilterValue(undefined)
    }
  }

  const resetFilter = () => {
    setStartDate("")
    setEndDate("")
    column.setFilterValue(undefined)
  }

  const hasValue = startDate || endDate

  return (
    <div className="space-y-1">
      <div className="flex gap-1">
        <Input
          type="date"
          placeholder="From"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          onBlur={updateFilter}
          className="h-6 text-xs bg-white/80 border-gray-200 focus:bg-white focus:border-blue-300 focus:ring-1 focus:ring-blue-200 transition-all duration-200 shadow-sm flex-1"
        />
        <Input
          type="date"
          placeholder="To"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          onBlur={updateFilter}
          className="h-6 text-xs bg-white/80 border-gray-200 focus:bg-white focus:border-blue-300 focus:ring-1 focus:ring-blue-200 transition-all duration-200 shadow-sm flex-1"
        />
        {hasValue && (
          <button
            onClick={resetFilter}
            className="h-6 w-6 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="Clear filter"
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}

const renderFilter = (column: any, filterType: FilterType, options?: FilterOption[]) => {
  switch (filterType) {
    case "text":
      return <TextFilter column={column} placeholder={`Filter ${column.id}...`} />
    case "select":
      return <SelectFilter column={column} options={options || []} />
    case "multi-select":
      return <MultiSelectFilter column={column} options={options || []} />
    case "range":
      return <RangeFilter column={column} />
    case "date-range":
      return <DateRangeFilter column={column} />
    case "none":
    default:
      return <div className="h-7" />
  }
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterColumn = "email",
  filterPlaceholder = "Filter invoices...",
  getSubRows,
  renderSubComponent,
  enableColumnSearch = false,
  showToolbar = true,
  showPagination = true,
  pageSize = 10,
  pageSizeOptions = [10, 20, 30, 40, 50],
  fullWidth = true,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [expanded, setExpanded] = React.useState<ExpandedState>({})
  const [columnSizing, setColumnSizing] = React.useState({})

  // Add expand column if getSubRows or renderSubComponent is provided
  const columnsWithExpand = (getSubRows || renderSubComponent) ? addExpandColumn(columns, data, getSubRows, renderSubComponent) : columns

  const table = useReactTable({
    data,
    columns: columnsWithExpand,
    getSubRows,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    onColumnSizingChange: setColumnSizing,
    columnResizeMode: 'onChange' as ColumnResizeMode,
    initialState: {
      pagination: {
        pageSize: pageSize,
      },
    },
    filterFns: {
      range: (row, columnId, value) => {
        const cellValue = row.getValue(columnId) as number
        const { min, max } = value as { min?: number; max?: number }
        if (min !== undefined && cellValue < min) return false
        if (max !== undefined && cellValue > max) return false
        return true
      },
      dateRange: (row, columnId, value) => {
        const cellValue = new Date(row.getValue(columnId) as string)
        const { from, to } = value as { from?: string; to?: string }
        if (from && cellValue < new Date(from)) return false
        if (to && cellValue > new Date(to)) return false
        return true
      },
      multiSelect: (row, columnId, value) => {
        const cellValue = row.getValue(columnId) as string[]
        const selectedValues = value as string[]
        
        if (!selectedValues || selectedValues.length === 0) return true
        if (!cellValue || !Array.isArray(cellValue)) return false
        return selectedValues.some(val => cellValue.includes(val))
      },
    },
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      expanded,
      columnSizing,
    },
  })

  // Get the filter column, fallback to first available column if specified column doesn't exist
  const filterColumnRef = table.getColumn(filterColumn) || table.getAllColumns().find(col => col.getCanFilter())
  const filterValue = filterColumnRef?.getFilterValue() as string ?? ""


  return (
    <div className="w-full space-y-4">
      {showToolbar && (
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <Input
              placeholder={filterPlaceholder}
              value={filterValue}
              onChange={(event) => {
                if (filterColumnRef) {
                  filterColumnRef.setFilterValue(event.target.value)
                }
              }}
              className="h-8 w-[150px] lg:w-[250px]"
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto hidden h-8 lg:flex"
              >
                <ChevronDown className="mr-2 h-4 w-4" />
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}
      <div className="rounded-md border overflow-x-auto">
        <Table style={{ 
          width: table.getCenterTotalSize(), 
          minWidth: fullWidth ? '100%' : 'auto' 
        }}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const column = header.column
                  const columnDef = column.columnDef as any
                  const filterType = columnDef.filterType as FilterType || "none"
                  const filterOptions = columnDef.filterOptions as FilterOption[] || []
                  
                  return (
                    <TableHead 
                      key={header.id} 
                      className="p-3 bg-gray-50/50 h-24 relative text-left"
                      style={{ width: header.getSize() }}
                    >
                      <div className="flex flex-col h-full">
                        <div className="flex items-center font-medium text-gray-900 mb-2 h-6">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </div>
                        <div className="flex-1 flex items-start min-h-0">
                          {enableColumnSearch && filterType !== "none" ? (
                            renderFilter(column, filterType, filterOptions)
                          ) : (
                            <div className="h-6" />
                          )}
                        </div>
                      </div>
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`absolute right-0 top-0 h-full w-1 bg-gray-300 cursor-col-resize select-none touch-none hover:bg-blue-500 ${
                            header.column.getIsResizing() ? 'bg-blue-500' : ''
                          }`}
                        />
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                        className="text-left"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                   {row.getIsExpanded() && (
                     <TableRow>
                       <TableCell colSpan={columns.length} className="p-0">
                         <div className="ml-12">
                           {renderSubComponent ? (
                             renderSubComponent({ row })
                           ) : (
                             <div>No sub-content available</div>
                           )}
                         </div>
                       </TableCell>
                     </TableRow>
                   )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && (
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length > 0 ? (
              <span className="font-medium text-blue-600">
                {table.getFilteredSelectedRowModel().rows.length} of{" "}
                {table.getFilteredRowModel().rows.length} row(s) selected
              </span>
            ) : (
              <span>
                {table.getFilteredRowModel().rows.length} row(s) total
              </span>
            )}
          </div>
          <div className="flex items-center space-x-6 lg:space-x-8">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium">Rows per page</p>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => {
                  table.setPageSize(Number(e.target.value))
                }}
                className="h-8 w-[70px] rounded border border-input bg-background px-3 py-1 text-sm"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to first page</span>
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  <span className="sr-only">Go to previous page</span>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-8 w-8 p-0"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to next page</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="hidden h-8 w-8 p-0 lg:flex"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  <span className="sr-only">Go to last page</span>
                  <ChevronsRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
