
export default function WardenDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Teacher Dashboard</h1>

      <p className="mt-2 text-gray-600">
        Welcome to the warden dashboard.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-4">
        
        <div className="p-4 border rounded-lg shadow">
          <h2 className="font-semibold">My Classes</h2>
          <p className="text-sm text-gray-500">
            View and manage your classes.
          </p>
        </div>

        <div className="p-4 border rounded-lg shadow">
          <h2 className="font-semibold">Assignments</h2>
          <p className="text-sm text-gray-500">
            Create and review assignments.
          </p>
        </div>

        <div className="p-4 border rounded-lg shadow">
          <h2 className="font-semibold">Students</h2>
          <p className="text-sm text-gray-500">
            Manage student records.
          </p>
        </div>

      </div>
    </div>
  );
}