"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

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

export type Person = {
  id: string
  firstName: string
  lastName: string
  age: number
  visits: number
  status: "relationship" | "complicated" | "single"
  progress: number
}

const data: Person[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    age: 30,
    visits: 100,
    status: "relationship",
    progress: 50,
  },
  {
    id: "2",
    firstName: "Jane",
    lastName: "Smith",
    age: 25,
    visits: 200,
    status: "single",
    progress: 75,
  },
  {
    id: "3",
    firstName: "Bob",
    lastName: "Johnson",
    age: 35,
    visits: 150,
    status: "complicated",
    progress: 25,
  },
  {
    id: "4",
    firstName: "Alice",
    lastName: "Brown",
    age: 28,
    visits: 300,
    status: "relationship",
    progress: 90,
  },
  {
    id: "5",
    firstName: "Charlie",
    lastName: "Wilson",
    age: 32,
    visits: 80,
    status: "single",
    progress: 40,
  },
  {
    id: "6",
    firstName: "Diana",
    lastName: "Davis",
    age: 27,
    visits: 250,
    status: "complicated",
    progress: 60,
  },
  {
    id: "7",
    firstName: "Eve",
    lastName: "Miller",
    age: 29,
    visits: 120,
    status: "relationship",
    progress: 85,
  },
  {
    id: "8",
    firstName: "Frank",
    lastName: "Garcia",
    age: 31,
    visits: 180,
    status: "single",
    progress: 30,
  },
]

export const columns: ColumnDef<Person>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "firstName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("firstName")}</div>,
  },
  {
    accessorKey: "lastName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("lastName")}</div>,
  },
  {
    accessorKey: "age",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Age
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("age")}</div>,
  },
  {
    accessorKey: "visits",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Visits
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div>{row.getValue("visits")}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "progress",
    header: "Profile Progress",
    cell: ({ row }) => {
      const progress = row.getValue("progress") as number
      return (
        <div className="w-full">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600">{progress}%</span>
        </div>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const person = row.original

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
              onClick={() => navigator.clipboard.writeText(person.id)}
            >
              Copy person ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View profile</DropdownMenuItem>
            <DropdownMenuItem>Edit details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function AdvancedTable() {
  return (
    <DataTable 
      columns={columns} 
      data={data} 
      filterColumn="firstName"
      filterPlaceholder="Filter by first name..."
    />
  )
}
