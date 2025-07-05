export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg bg-blue-600 text-white p-6">
          <p className="text-sm uppercase">Posts</p>
          <p className="text-3xl font-bold">--</p>
        </div>
        <div className="rounded-lg bg-green-600 text-white p-6">
          <p className="text-sm uppercase">Categories</p>
          <p className="text-3xl font-bold">--</p>
        </div>
        <div className="rounded-lg bg-purple-600 text-white p-6">
          <p className="text-sm uppercase">Users</p>
          <p className="text-3xl font-bold">--</p>
        </div>
      </div>
    </div>
  );
}
