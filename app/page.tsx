import MyTable from "./my-table";
import AdvancedTable from "./advanced-table";

export default function Home() {
  return (
    <div className="container mx-auto py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold mb-4">TanStack Table + shadcn/ui Examples</h1>
        <p className="text-muted-foreground mb-8">
          Demonstrating powerful table features with sorting, filtering, pagination, and more.
        </p>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Payment Data Table</h2>
        <MyTable />
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Advanced People Table</h2>
        <AdvancedTable />
      </div>
    </div>
  );
}
