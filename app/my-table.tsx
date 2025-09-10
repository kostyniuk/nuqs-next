"use client"

import { ColumnDef } from "@tanstack/react-table"

// Extend ColumnDef to include our custom filter properties
type ExtendedColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  filterType?: "text" | "select" | "multi-select" | "range" | "date-range" | "none"
  filterOptions?: { value: string; label: string }[]
  filterFn?: string
}
import { ArrowUpDown, MoreHorizontal, ChevronRight, ChevronDown, ArrowUp, ArrowDown } from "lucide-react"
import { useState } from "react"

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
import { generatedData, type Payment, type SubPayment } from "@/lib/data-generator"


// Use generated data with 1000 rows
const data: Payment[] = generatedData

// Sub-columns for nested table
export const subColumns: (ColumnDef<SubPayment> & {
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
        aria-label="Select all sub-payments"
      />
    ),
    cell: ({ row }: { row: any }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select sub-payment"
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
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <div>{row.original?.description || 'N/A'}</div>,
    size: 200,
    minSize: 150,
    maxSize: 400,
    enableResizing: true,
    filterType: "text",
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = row.original?.amount ? parseFloat(row.original.amount.toString()) : 0
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
      return <div className="font-medium">{formatted}</div>
    },
    size: 200,
    minSize: 150,
    maxSize: 300,
    enableResizing: true,
    filterType: "range",
    filterFn: "range" as any,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <div>{row.original?.date || 'N/A'}</div>,
    size: 200,
    minSize: 150,
    maxSize: 300,
    enableResizing: true,
    filterType: "date-range",
    filterFn: "dateRange" as any,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }: { row: any }) => (
      <div className="capitalize">{row.original?.category || 'N/A'}</div>
    ),
    size: 200,
    minSize: 150,
    maxSize: 300,
    enableResizing: true,
    filterType: "select",
    filterOptions: [
      { value: "Service", label: "Service" },
      { value: "Fee", label: "Fee" },
      { value: "Tax", label: "Tax" },
      { value: "Subscription", label: "Subscription" },
      { value: "Setup", label: "Setup" },
      { value: "Plan", label: "Plan" },
      { value: "Add-on", label: "Add-on" },
      { value: "Support", label: "Support" },
    ],
  },
  {
    id: "actions",
    enableHiding: false,
    enableResizing: true,
    cell: ({ row }: { row: any }) => {
      const subPayment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sub-payment Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(subPayment.id)}
            >
              Copy sub-payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit sub-payment</DropdownMenuItem>
            <DropdownMenuItem>Delete sub-payment</DropdownMenuItem>
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }: { row: any }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
    filterType: "select",
    filterOptions: [
      { value: "pending", label: "Pending" },
      { value: "processing", label: "Processing" },
      { value: "success", label: "Success" },
      { value: "failed", label: "Failed" },
    ],
    size: 150,
    minSize: 150,
    maxSize: 200,
    enableResizing: true,
  },
  {
    accessorKey: "email",
    header: ({ column }: { column: any }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }: { row: any }) => <div className="lowercase">{row.getValue("email")}</div>,
    filterType: "text",
    size: 225,
    minSize: 200,
    maxSize: 500,
    enableResizing: true,
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-left">Amount</div>,
    cell: ({ row }: { row: any }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <div className="text-left font-medium">{formatted}</div>
    },
    filterType: "range",
    filterFn: "range" as any,
    size: 150,
    minSize: 150,
    maxSize: 200,
    enableResizing: true,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }: { row: any }) => (
      <div className="capitalize">{row.getValue("category")}</div>
    ),
    filterType: "select",
    filterOptions: [
      { value: "subscription", label: "Subscription" },
      { value: "one-time", label: "One-time" },
      { value: "refund", label: "Refund" },
      { value: "fee", label: "Fee" },
    ],
    size: 200,
    minSize: 200,
    maxSize: 500,
    enableResizing: true,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }: { row: any }) => {
      const priority = row.getValue("priority") as string | undefined
      if (!priority) {
        return <div className="text-gray-400 text-sm">No priority</div>
      }
      
      const colorClass = {
        low: "bg-gray-100 text-gray-800",
        medium: "bg-yellow-100 text-yellow-800",
        high: "bg-orange-100 text-orange-800",
        urgent: "bg-red-100 text-red-800",
      }[priority] || "bg-gray-100 text-gray-800"
      
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
          {priority}
        </span>
      )
    },
    filterType: "select",
    filterOptions: [
      { value: "low", label: "Low" },
      { value: "medium", label: "Medium" },
      { value: "high", label: "High" },
      { value: "urgent", label: "Urgent" },
    ],
    size: 125,
    minSize: 100,
    maxSize: 200,
    enableResizing: true,
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }: { row: any }) => {
      const tags = row.getValue("tags") as string[] | undefined
      if (!tags || !Array.isArray(tags)) {
        return <div className="text-gray-400 text-sm">No tags</div>
      }
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )
    },
    filterType: "multi-select",
    filterFn: "multiSelect" as any,
    filterOptions: [
      { value: "premium", label: "Premium" },
      { value: "monthly", label: "Monthly" },
      { value: "setup", label: "Setup" },
      { value: "onboarding", label: "Onboarding" },
      { value: "enterprise", label: "Enterprise" },
      { value: "annual", label: "Annual" },
      { value: "transaction", label: "Transaction" },
      { value: "processing", label: "Processing" },
      { value: "refund", label: "Refund" },
      { value: "dispute", label: "Dispute" },
      { value: "trial", label: "Trial" },
      { value: "conversion", label: "Conversion" },
    ],
    size: 300,
    minSize: 200,
    maxSize: 500,
    enableResizing: true,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }: { row: any }) => {
      const dateValue = row.getValue("createdAt") as string | undefined
      if (!dateValue) {
        return <div className="text-gray-400 text-sm">No date</div>
      }
      const date = new Date(dateValue)
      return <div>{date.toLocaleDateString()}</div>
    },
    filterType: "date-range",
    filterFn: "dateRange" as any,
    size: 300,
    minSize: 200,
    maxSize: 500,
    enableResizing: true,
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }: { row: any }) => {
      const dateValue = row.getValue("dueDate") as string | undefined
      if (!dateValue) {
        return <div className="text-gray-400 text-sm">No date</div>
      }
      const date = new Date(dateValue)
      return <div>{date.toLocaleDateString()}</div>
    },
    filterType: "date-range",
    filterFn: "dateRange" as any,
    size: 300,
    minSize: 200,
    maxSize: 500,
    enableResizing: true,
  },
  {
    id: "actions",
    enableHiding: false,
    enableResizing: true,
    cell: ({ row }: { row: any }) => {
      const payment = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
    filterType: "none",
    size: 300,
    minSize: 200,
    maxSize: 500,
  },
]

const PaymentDetails = ({ row }: { row: any }) => {
  const payment = row.original as Payment
  
  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-muted-foreground">Payment Details</h4>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Payment ID:</span> {payment.id}
        </div>
        <div>
          <span className="font-medium">Status:</span> 
          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
            payment.status === 'success' ? 'bg-green-100 text-green-800' :
            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            payment.status === 'processing' ? 'bg-blue-100 text-blue-800' :
            'bg-red-100 text-red-800'
          }`}>
            {payment.status}
          </span>
        </div>
        <div>
          <span className="font-medium">Amount:</span> 
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(payment.amount)}
        </div>
        <div>
          <span className="font-medium">Email:</span> {payment.email}
        </div>
      </div>
    </div>
  )
}

export default function MyTable() {
  return (
    <div className="container mx-auto py-10">
      <DataTable 
        columns={columns} 
        data={data} 
        renderSubComponent={({ row }) => {
          const subPayments = (row.original?.subPayments as SubPayment[] | undefined) ?? []
          
          return (
            <div className="w-fit">
              <div className="mb-2 text-sm text-muted-foreground">
                Sub-payments ({subPayments.length} items)
              </div>
              <DataTable
                columns={subColumns}
                data={subPayments}
                showToolbar={false}
                showPagination={true}
                enableColumnSearch={true}
                filterColumn="description"
                filterPlaceholder="Filter sub-payments..."
                pageSize={5}
                pageSizeOptions={[5, 10, 15, 20]}
                fullWidth={false}
              />
            </div>
          )
        }}
        filterColumn="email"
        filterPlaceholder="Filter by email..."
        enableColumnSearch={true}
      />
    </div>
  )
}
  