# Advanced Data Table Library

A powerful, feature-rich data table component built with React, TypeScript, and TanStack Table. This library provides a comprehensive solution for displaying, filtering, sorting, and managing tabular data with advanced features like nested tables, drag-and-drop column reordering, and multiple filter types.

## �� Features

### Core Table Features
- **Sortable Columns**: Click column headers to sort data in ascending/descending order
- **Row Selection**: Individual row selection with checkboxes and bulk selection
- **Pagination**: Configurable page sizes with navigation controls
- **Column Visibility**: Show/hide columns with dropdown menu
- **Column Resizing**: Drag column borders to resize columns
- **Responsive Design**: Mobile-friendly with horizontal scrolling

### Advanced Filtering System
- **Text Filters**: Search and filter text-based columns
- **Select Filters**: Dropdown selection for categorical data
- **Multi-Select Filters**: Select multiple values for complex filtering
- **Range Filters**: Min/max value filtering for numeric data
- **Date Range Filters**: Date range selection for temporal data
- **Global Search**: Search across all columns or specific columns

### Nested Table Support
- **Expandable Rows**: Click to expand rows and show nested data
- **Independent Sub-tables**: Each nested table has its own pagination, filtering, and sorting
- **Custom Sub-components**: Render any React component in expanded rows
- **Hierarchical Data**: Support for complex data structures with parent-child relationships

### Drag & Drop
- **Column Reordering**: Drag column headers to reorder columns
- **Visual Feedback**: Drop indicators and hover effects during drag operations
- **Touch Support**: Works on mobile devices with touch gestures

### Data Management
- **Bulk Operations**: Select multiple rows for batch actions
- **Action Menus**: Dropdown menus for row-specific actions
- **Data Export**: Built-in support for copying data to clipboard
- **Real-time Updates**: Efficient re-rendering with optimized state management

## 📦 Installation

```bash
npm install @tanstack/react-table react-dnd react-dnd-html5-backend
npm install @radix-ui/react-checkbox @radix-ui/react-dropdown-menu @radix-ui/react-select @radix-ui/react-slot
npm install class-variance-authority clsx tailwind-merge lucide-react
```

## �� Quick Start

```tsx
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'

// Define your data type
type Project = {
  id: string
  name: string
  status: 'active' | 'inactive'
  createdAt: Date
}

// Define columns
const columns: ColumnDef<Project>[] = [
  {
    accessorKey: "id",
    header: "ID",
    filterType: "text"
  },
  {
    accessorKey: "name", 
    header: "Name",
    filterType: "text"
  },
  {
    accessorKey: "status",
    header: "Status",
    filterType: "select",
    filterOptions: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" }
    ]
  }
]

// Use the component
function MyComponent() {
  const data: Project[] = [
    { id: "1", name: "Project A", status: "active", createdAt: new Date() },
    // ... more data
  ]

  return (
    <DataTable
      columns={columns}
      data={data}
      enableColumnSearch={true}
      enableColumnReordering={true}
    />
  )
}
```

## �� API Reference

### DataTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ColumnDef<TData, TValue>[]` | - | Column definitions |
| `data` | `TData[]` | - | Table data |
| `filterColumn` | `string` | `"email"` | Column to use for global search |
| `filterPlaceholder` | `string` | `"Filter invoices..."` | Placeholder for search input |
| `getSubRows` | `(row: TData) => TData[]` | - | Function to get sub-rows for nesting |
| `renderSubComponent` | `(props: {row: any}) => ReactElement` | - | Custom component for expanded rows |
| `enableColumnSearch` | `boolean` | `false` | Enable column-specific filtering |
| `showToolbar` | `boolean` | `true` | Show search and column visibility controls |
| `showPagination` | `boolean` | `true` | Show pagination controls |
| `pageSize` | `number` | `10` | Default page size |
| `pageSizeOptions` | `number[]` | `[10, 20, 30, 40, 50]` | Available page sizes |
| `fullWidth` | `boolean` | `true` | Make table take full width |
| `enableColumnReordering` | `boolean` | `false` | Enable drag-and-drop column reordering |
| `onColumnReorder` | `(newOrder: string[]) => void` | - | Callback for column reordering |

### Column Definition Extensions

Extend the standard `ColumnDef` with additional properties:

```tsx
type ExtendedColumnDef<TData, TValue> = ColumnDef<TData, TValue> & {
  filterType?: "text" | "select" | "multi-select" | "range" | "date-range" | "none"
  filterOptions?: { value: string; label: string }[]
  filterFn?: string
}
```

### Filter Types

#### Text Filter
```tsx
{
  accessorKey: "name",
  header: "Name",
  filterType: "text"
}
```

#### Select Filter
```tsx
{
  accessorKey: "status",
  header: "Status", 
  filterType: "select",
  filterOptions: [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" }
  ]
}
```

#### Multi-Select Filter
```tsx
{
  accessorKey: "tags",
  header: "Tags",
  filterType: "multi-select", 
  filterFn: "multiSelect",
  filterOptions: [
    { value: "urgent", label: "Urgent" },
    { value: "important", label: "Important" }
  ]
}
```

#### Range Filter
```tsx
{
  accessorKey: "price",
  header: "Price",
  filterType: "range",
  filterFn: "range"
}
```

#### Date Range Filter
```tsx
{
  accessorKey: "createdAt",
  header: "Created",
  filterType: "date-range",
  filterFn: "dateRange"
}
```

## 🎨 Styling

The library uses Tailwind CSS for styling and is fully customizable. All components accept `className` props for custom styling.

### Custom Styling Example

```tsx
<DataTable
  columns={columns}
  data={data}
  className="my-custom-table"
  // Custom styles will be applied
/>
```

## 🔄 Nested Tables

Create expandable rows with nested data:

```tsx
const columns: ColumnDef<Project>[] = [
  // ... main columns
]

const subColumns: ColumnDef<Part>[] = [
  {
    accessorKey: "partName",
    header: "Part Name",
    filterType: "text"
  },
  // ... more sub-columns
]

function MyTable() {
  return (
    <DataTable
      columns={columns}
      data={projects}
      renderSubComponent={({ row }) => (
        <DataTable
          columns={subColumns}
          data={row.original.parts || []}
          showToolbar={false}
          pageSize={5}
        />
      )}
    />
  )
}
```

## 🎯 Advanced Usage

### Custom Filter Functions

```tsx
const table = useReactTable({
  // ... other config
  filterFns: {
    customFilter: (row, columnId, value) => {
      // Custom filtering logic
      return true
    }
  }
})
```

### Row Actions

```tsx
{
  id: "actions",
  cell: ({ row }) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">Actions</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

## 🛠️ Development

### Prerequisites
- Node.js 18+
- React 18+
- TypeScript 5+

### Setup
```bash
git clone https://github.com/kostyniuk/shadcn-tanstack-table-nested.git
cd shadcn-tanstack-table-nested
npm install
npm run dev
```

### Building
```bash
npm run build
```

## 📝 Examples

The library includes a comprehensive example with:
- 1000+ sample records
- Multiple filter types
- Nested table with parts data
- Drag-and-drop column reordering
- Responsive design

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## �� Acknowledgments

- [TanStack Table](https://tanstack.com/table) for the excellent table foundation
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [React DnD](https://react-dnd.github.io/react-dnd/) for drag-and-drop functionality
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities