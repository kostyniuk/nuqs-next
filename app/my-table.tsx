"use client"

import { ColumnDef } from "@tanstack/react-table"

// Extend ColumnDef to include our custom filter properties
type ExtendedColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  filterType?: "text" | "select" | "multi-select" | "range" | "date-range" | "none"
  filterOptions?: { value: string; label: string }[]
  filterFn?: string
}
import { ArrowUpDown, MoreHorizontal, ChevronRight, ChevronDown, ArrowUp, ArrowDown } from "lucide-react"
import React, { useState } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/ui/data-table"
import { generatedData, type Project, type Part } from "@/lib/data-generator"


// Use generated data with 1000 rows
const data: Project[] = generatedData

// Reusable sorting header component
const SortableHeader: React.FC<{ 
  column: any, 
  title: string, 
  canSort: boolean, 
  reason?: string 
}> = ({ column, title, canSort, reason }) => {
  if (!canSort) {
    return (
      <div className="flex items-center gap-2">
        <span className="font-medium">{title}</span>
        <span className="text-xs text-gray-400" title={reason}>
          {reason}
        </span>
      </div>
    )
  }

  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting()}
      className="h-auto p-0 font-medium justify-start hover:bg-transparent"
    >
      {title}
      {column.getIsSorted() === "asc" ? (
        <ArrowUp className="ml-2 h-4 w-4" />
      ) : column.getIsSorted() === "desc" ? (
        <ArrowDown className="ml-2 h-4 w-4" />
      ) : (
        <ArrowUpDown className="ml-2 h-4 w-4" />
      )}
    </Button>
  )
}

// Sub-columns for nested table (parts)
export const subColumns: (ColumnDef<Part> & {
  filterType?: "text" | "select" | "multi-select" | "range" | "date-range" | "none"
  filterOptions?: { value: string; label: string }[]
  filterFn?: string
})[] = [
  {
    id: "select",
    header: ({ table }: { table: any }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all parts"
      />
    ),
    cell: ({ row }: { row: any }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select part"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    enableResizing: true,
    size: 50,
    minSize: 50,
    maxSize: 100,
    filterType: "none",
  },
  {
    accessorKey: "modelName",
    header: ({ column }: { column: any }) => (
      <SortableHeader 
        column={column} 
        title="Model Name" 
        canSort={true} 
      />
    ),
    cell: ({ row }) => <div className="font-mono text-sm">{row.original?.modelName || 'N/A'}</div>,
    size: 200,
    minSize: 150,
    maxSize: 400,
    enableResizing: true,
    filterType: "text",
  },
  {
    accessorKey: "volume",
    header: ({ column }: { column: any }) => (
      <SortableHeader 
        column={column} 
        title="Volume (cm³)" 
        canSort={true} 
      />
    ),
    cell: ({ row }) => {
      const volume = row.original?.volume ? parseFloat(row.original.volume.toString()) : 0
      return <div className="font-medium">{volume.toFixed(2)}</div>
    },
    size: 250,
    minSize: 200,
    maxSize: 250,
    enableResizing: true,
    filterType: "range",
    filterFn: "range" as any,
  },
  {
    accessorKey: "boundingBox",
    header: ({ column }: { column: any }) => (
      <SortableHeader 
        column={column} 
        title="Bounding Box" 
        canSort={false} 
        reason="Complex object"
      />
    ),
    cell: ({ row }) => {
      const box = row.original?.boundingBox
      if (!box) return <div>N/A</div>
      return (
        <div className="text-xs">
          {box.width.toFixed(1)} × {box.height.toFixed(1)} × {box.depth.toFixed(1)}
        </div>
      )
    },
    size: 220,
    minSize: 180,
    maxSize: 300,
    enableResizing: true,
    filterType: "none",
  },
  {
    accessorKey: "quantity",
    header: ({ column }: { column: any }) => (
      <SortableHeader 
        column={column} 
        title="Quantity" 
        canSort={true} 
      />
    ),
    cell: ({ row }) => <div className="font-medium">{row.original?.quantity || 0}</div>,
    size: 180,
    minSize: 150,
    maxSize: 180,
    enableResizing: true,
    filterType: "range",
    filterFn: "range" as any,
  },
  {
    accessorKey: "shippingDeadline",
    header: ({ column }: { column: any }) => (
      <SortableHeader 
        column={column} 
        title="Shipping Deadline" 
        canSort={true} 
      />
    ),
    cell: ({ row }) => {
      const dateValue = row.original?.shippingDeadline
      if (!dateValue) return <div className="text-gray-400 text-sm">No date</div>
      const date = new Date(dateValue)
      return <div className="text-sm">{date.toLocaleDateString()}</div>
    },
    size: 180,
    minSize: 150,
    maxSize: 250,
    enableResizing: true,
    filterType: "date-range",
    filterFn: "dateRange" as any,
  },
  {
    id: "actions",
    enableHiding: false,
    enableResizing: true,
    cell: ({ row }: { row: any }) => {
      const part = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Part Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(part.id)}
            >
              Copy part ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View 3D model</DropdownMenuItem>
            <DropdownMenuItem>Download file</DropdownMenuItem>
            <DropdownMenuItem>Edit part</DropdownMenuItem>
            <DropdownMenuItem>Delete part</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    filterType: "none",
    size: 50,
    minSize: 50,
    maxSize: 100,
  },
]

export const columns: any[] = [
  {
    id: "select",
    header: ({ table }: { table: any }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }: { row: any }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
    enableResizing: true,
    size: 50,
    minSize: 50,
    maxSize: 100,
    filterType: "none",
  },
  {
    accessorKey: "id",
    header: ({ column }: { column: any }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
        >
          Project ID
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
    cell: ({ row }: { row: any }) => (
      <div className="font-mono text-sm font-medium">{row.getValue("id")}</div>
    ),
    filterType: "text",
    size: 150,
    minSize: 120,
    maxSize: 200,
    enableResizing: true,
  },
  {
    accessorKey: "customerName",
    header: ({ column }: { column: any }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
        >
          Customer Name
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
    cell: ({ row }: { row: any }) => <div>{row.getValue("customerName")}</div>,
    filterType: "text",
    size: 200,
    minSize: 150,
    maxSize: 300,
    enableResizing: true,
  },
  {
    accessorKey: "customerEmail",
    header: ({ column }: { column: any }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting()}
        >
          Customer Email
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      )
    },
    cell: ({ row }: { row: any }) => <div className="lowercase">{row.getValue("customerEmail")}</div>,
    filterType: "text",
    size: 250,
    minSize: 200,
    maxSize: 400,
    enableResizing: true,
  },
  {
    accessorKey: "grossPrice",
    header: ({ column }: { column: any }) => (
      <SortableHeader 
        column={column} 
        title="Gross Price" 
        canSort={true} 
      />
    ),
    cell: ({ row }: { row: any }) => {
      const amount = parseFloat(row.getValue("grossPrice"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-left font-medium">{formatted}</div>
    },
    filterType: "range",
    filterFn: "range" as any,
    size: 250,
    minSize: 200,
    maxSize: 250,
    enableResizing: true,
  },
  {
    accessorKey: "netPrice",
    header: ({ column }: { column: any }) => (
      <SortableHeader 
        column={column} 
        title="Net Price" 
        canSort={true} 
      />
    ),
    cell: ({ row }: { row: any }) => {
      const amount = parseFloat(row.getValue("netPrice"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-left font-medium text-green-600">{formatted}</div>
    },
    filterType: "range",
    filterFn: "range" as any,
    size: 250,
    minSize: 200,
    maxSize: 250,
    enableResizing: true,
  },
  {
    accessorKey: "deliveryMethod",
    header: ({ column }: { column: any }) => (
      <SortableHeader 
        column={column} 
        title="Delivery Method" 
        canSort={true} 
      />
    ),
    cell: ({ row }: { row: any }) => {
      const method = row.getValue("deliveryMethod") as string
      const colorClass = {
        standard: "bg-blue-100 text-blue-800",
        express: "bg-orange-100 text-orange-800",
        overnight: "bg-red-100 text-red-800",
        pickup: "bg-green-100 text-green-800",
      }[method] || "bg-gray-100 text-gray-800"
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
          {method.replace('_', ' ')}
        </span>
      )
    },
    filterType: "select",
    filterOptions: [
      { value: "standard", label: "Standard" },
      { value: "express", label: "Express" },
      { value: "overnight", label: "Overnight" },
      { value: "pickup", label: "Pickup" },
    ],
    size: 180,
    minSize: 150,
    maxSize: 250,
    enableResizing: true,
  },
  {
    accessorKey: "paymentMethod",
    header: ({ column }: { column: any }) => (
      <SortableHeader 
        column={column} 
        title="Payment Method" 
        canSort={true} 
      />
    ),
    cell: ({ row }: { row: any }) => {
      const method = row.getValue("paymentMethod") as string
      return (
        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
          {method.replace('_', ' ')}
        </span>
      )
    },
    filterType: "select",
    filterOptions: [
      { value: "credit_card", label: "Credit Card" },
      { value: "bank_transfer", label: "Bank Transfer" },
      { value: "paypal", label: "PayPal" },
      { value: "crypto", label: "Crypto" },
      { value: "invoice", label: "Invoice" },
    ],
    size: 180,
    minSize: 150,
    maxSize: 250,
    enableResizing: true,
  },
  {
    accessorKey: "ticketStatus",
    header: ({ column }: { column: any }) => (
      <SortableHeader 
        column={column} 
        title="Ticket Status" 
        canSort={true} 
      />
    ),
    cell: ({ row }: { row: any }) => {
      const status = row.getValue("ticketStatus") as string
      const colorClass = {
        draft: "bg-gray-100 text-gray-800",
        pending: "bg-yellow-100 text-yellow-800",
        in_progress: "bg-blue-100 text-blue-800",
        review: "bg-purple-100 text-purple-800",
        completed: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
      }[status] || "bg-gray-100 text-gray-800"
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
          {status.replace('_', ' ')}
        </span>
      )
    },
    filterType: "multi-select",
    filterFn: "multiSelect" as any,
    filterOptions: [
      { value: "draft", label: "Draft" },
      { value: "pending", label: "Pending" },
      { value: "in_progress", label: "In Progress" },
      { value: "review", label: "Review" },
      { value: "completed", label: "Completed" },
      { value: "cancelled", label: "Cancelled" },
    ],
    size: 300,
    minSize: 250,
    maxSize: 400,
    enableResizing: true,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }: { column: any }) => (
      <SortableHeader 
        column={column} 
        title="Created" 
        canSort={true} 
      />
    ),
    cell: ({ row }: { row: any }) => {
      const dateValue = row.getValue("createdAt") as string | undefined
      if (!dateValue) {
        return <div className="text-gray-400 text-sm">No date</div>
      }
      const date = new Date(dateValue)
      return <div className="text-sm">{date.toLocaleDateString()}</div>
    },
    filterType: "date-range",
    filterFn: "dateRange" as any,
    size: 140,
    minSize: 120,
    maxSize: 180,
    enableResizing: true,
  },
  {
    accessorKey: "dueDate",
    header: ({ column }: { column: any }) => (
      <SortableHeader 
        column={column} 
        title="Due Date" 
        canSort={true} 
      />
    ),
    cell: ({ row }: { row: any }) => {
      const dateValue = row.getValue("dueDate") as string | undefined
      if (!dateValue) {
        return <div className="text-gray-400 text-sm">No date</div>
      }
      const date = new Date(dateValue)
      return <div className="text-sm">{date.toLocaleDateString()}</div>
    },
    filterType: "date-range",
    filterFn: "dateRange" as any,
    size: 140,
    minSize: 120,
    maxSize: 180,
    enableResizing: true,
  },
  {
    id: "actions",
    enableHiding: false,
    enableResizing: true,
    cell: ({ row }: { row: any }) => {
      const project = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Project Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(project.id)}
            >
              Copy project ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer details</DropdownMenuItem>
            <DropdownMenuItem>View project details</DropdownMenuItem>
            <DropdownMenuItem>Download project files</DropdownMenuItem>
            <DropdownMenuItem>Edit project</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    filterType: "none",
    size: 50,
    minSize: 50,
    maxSize: 100,
  },
]

const ProjectDetails = ({ row }: { row: any }) => {
  const project = row.original as Project
  
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-muted-foreground">Project Details</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Project ID:</span> {project.id}
        </div>
        <div>
          <span className="font-medium">Status:</span> 
          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
            project.ticketStatus === 'completed' ? 'bg-green-100 text-green-800' :
            project.ticketStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            project.ticketStatus === 'in_progress' ? 'bg-blue-100 text-blue-800' :
            project.ticketStatus === 'review' ? 'bg-purple-100 text-purple-800' :
            project.ticketStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {project.ticketStatus.replace('_', ' ')}
          </span>
        </div>
        <div>
          <span className="font-medium">Customer:</span> {project.customerName}
        </div>
        <div>
          <span className="font-medium">Email:</span> {project.customerEmail}
        </div>
        <div>
          <span className="font-medium">Gross Price:</span> 
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(project.grossPrice)}
        </div>
        <div>
          <span className="font-medium">Net Price:</span> 
          <span className="text-green-600 font-medium">
            {new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
            }).format(project.netPrice)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function MyTable() {
  const [mainTableColumnOrder, setMainTableColumnOrder] = React.useState<string[]>([])
  const [subTableColumnOrder, setSubTableColumnOrder] = React.useState<string[]>([])

  return (
    <div className="container mx-auto py-10">
      <DataTable 
        columns={columns} 
        data={data} 
        renderSubComponent={({ row }) => {
          const parts = (row.original?.parts as Part[] | undefined) ?? []
          
          return (
            <div className="w-fit">
              <div className="mb-2 text-sm text-muted-foreground">
                Parts ({parts.length} items)
              </div>
              <DataTable
                columns={subColumns}
                data={parts}
                showToolbar={false}
                showPagination={true}
                enableColumnSearch={true}
                filterColumn="modelName"
                filterPlaceholder="Filter parts..."
                pageSize={5}
                pageSizeOptions={[5, 10, 15, 20]}
                fullWidth={false}
                enableColumnReordering={true}
                onColumnReorder={setSubTableColumnOrder}
              />
            </div>
          )
        }}
        filterColumn="customerEmail"
        filterPlaceholder="Filter by customer email..."
        enableColumnSearch={true}
        enableColumnReordering={true}
        onColumnReorder={setMainTableColumnOrder}
      />
    </div>
  )
}
  