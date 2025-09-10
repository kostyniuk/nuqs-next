"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, ChevronRight, ChevronDown } from "lucide-react"

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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export type Department = {
  id: string
  name: string
  manager: string
  budget: number
  employees: Employee[]
}

export type Employee = {
  id: string
  name: string
  position: string
  email: string
  phone: string
  salary: number
  location: string
}

const data: Department[] = [
  {
    id: "1",
    name: "Engineering",
    manager: "John Smith",
    budget: 500000,
    employees: [
      {
        id: "1-1",
        name: "Alice Johnson",
        position: "Senior Developer",
        email: "alice.johnson@company.com",
        phone: "+1-555-0101",
        salary: 120000,
        location: "New York"
      },
      {
        id: "1-2",
        name: "Bob Wilson",
        position: "Frontend Developer",
        email: "bob.wilson@company.com",
        phone: "+1-555-0102",
        salary: 95000,
        location: "San Francisco"
      },
      {
        id: "1-3",
        name: "Carol Davis",
        position: "Backend Developer",
        email: "carol.davis@company.com",
        phone: "+1-555-0103",
        salary: 110000,
        location: "Seattle"
      }
    ]
  },
  {
    id: "2",
    name: "Marketing",
    manager: "Sarah Brown",
    budget: 200000,
    employees: [
      {
        id: "2-1",
        name: "David Lee",
        position: "Marketing Manager",
        email: "david.lee@company.com",
        phone: "+1-555-0201",
        salary: 85000,
        location: "Los Angeles"
      },
      {
        id: "2-2",
        name: "Emma Taylor",
        position: "Content Specialist",
        email: "emma.taylor@company.com",
        phone: "+1-555-0202",
        salary: 65000,
        location: "Chicago"
      }
    ]
  },
  {
    id: "3",
    name: "Sales",
    manager: "Mike Johnson",
    budget: 300000,
    employees: [
      {
        id: "3-1",
        name: "Frank Miller",
        position: "Sales Director",
        email: "frank.miller@company.com",
        phone: "+1-555-0301",
        salary: 130000,
        location: "Boston"
      },
      {
        id: "3-2",
        name: "Grace Wilson",
        position: "Account Manager",
        email: "grace.wilson@company.com",
        phone: "+1-555-0302",
        salary: 75000,
        location: "Miami"
      },
      {
        id: "3-3",
        name: "Henry Garcia",
        position: "Sales Representative",
        email: "henry.garcia@company.com",
        phone: "+1-555-0303",
        salary: 60000,
        location: "Denver"
      }
    ]
  }
]

export const columns: ColumnDef<Department>[] = [
  {
    id: "expander",
    header: ({ table }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => table.toggleAllRowsExpanded()}
        className="h-8 w-8 p-0"
      >
        <span className="sr-only">Toggle all rows expanded</span>
        {table.getIsAllRowsExpanded() ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>
    ),
    cell: ({ row }) => {
      return row.getCanExpand() ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={row.getToggleExpandedHandler()}
          className="h-8 w-8 p-0"
        >
          <span className="sr-only">Toggle row expanded</span>
          {row.getIsExpanded() ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      ) : null
    },
    enableSorting: false,
    enableHiding: false,
  },
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Department
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "manager",
    header: "Manager",
    cell: ({ row }) => <div>{row.getValue("manager")}</div>,
  },
  {
    accessorKey: "budget",
    header: () => <div className="text-right">Budget</div>,
    cell: ({ row }) => {
      const budget = parseFloat(row.getValue("budget"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(budget)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "employees",
    header: "Employees",
    cell: ({ row }) => {
      const employees = row.getValue("employees") as Employee[]
      return <div className="text-center">{employees.length}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const department = row.original

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
              onClick={() => navigator.clipboard.writeText(department.id)}
            >
              Copy department ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View department details</DropdownMenuItem>
            <DropdownMenuItem>Edit department</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

const EmployeeDetails = ({ row }: { row: any }) => {
  // Get employees from the original row data
  const employees = row.original?.employees as Employee[] || []
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="text-right">Salary</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                No employees found for this department.
              </TableCell>
            </TableRow>
          ) : (
            employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.position}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell>{employee.location}</TableCell>
                <TableCell className="text-right font-medium">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(employee.salary)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default function NestedTable() {
  return (
    <DataTable 
      columns={columns} 
      data={data} 
      filterColumn="name"
      filterPlaceholder="Filter departments..."
      getSubRows={(row) => row.employees || []}
      renderSubComponent={EmployeeDetails}
    />
  )
}
