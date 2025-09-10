import MyTable from "./my-table";

export default function Home() {
  return (
    <div className="container mx-auto py-10 space-y-10">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Projects Overview Table</h2>
        <MyTable />
      </div>
    </div>
  );
}
