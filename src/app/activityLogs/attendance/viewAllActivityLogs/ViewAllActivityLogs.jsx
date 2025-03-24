"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import toast from "react-hot-toast";

const ATTENDANCE_URL = process.env.NEXT_PUBLIC_ATTENDANCE_LOGS_URL;

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ employeeCode: "", date: "" });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });

  const router = useRouter();

  // Fetch logs based on filters
  const fetchLogs = async (page = 1) => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page,
        limit: 10,
        ...(filters.employeeCode && { employeeCode: filters.employeeCode }),
        ...(filters.date && { date: filters.date }),
      }).toString();

      const response = await fetch(`${ATTENDANCE_URL}attendance/activity-logs?${query}`);
      const result = await response.json();

      if (result.success) {
        setLogs(result.data);
        setPagination({
          page,
          totalPages: Math.ceil(result.pagination.total / 10),
        });
      } else {
        toast.error("Failed to fetch logs");
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
      toast.error("Error fetching logs");
    }
    setLoading(false);
  };

  // Handle input change for filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle search button click
  const handleSearch = () => {
    fetchLogs(1);
  };

  // Handle pagination
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.totalPages) {
      fetchLogs(newPage);
    }
  };

  // Fetch logs on component mount
  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Activity Logs</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            name="employeeCode"
            placeholder="Search by Employee Code"
            value={filters.employeeCode}
            onChange={handleFilterChange}
            className="border border-gray-300 text-gray-700 rounded-md p-2 w-full md:w-1/3"
          />
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="border border-gray-300 text-gray-700 rounded-md p-2 w-full md:w-1/3"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Search
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full bg-white border rounded-lg shadow-md">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="p-3 text-left">Action Taken By</th>
                <th className="p-3 text-left">User Name</th>
                <th className="p-3 text-left">Action</th>
                <th className="p-3 text-left">Entity</th>
                <th className="p-3 text-left">IP Address</th>
                <th className="p-3 text-left">Timestamp</th>
                <th className="p-3 text-left">Details</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-3 text-center">Loading...</td>
                </tr>
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log._id} className="border-b hover:bg-gray-100 text-gray-700">
                    <td className="p-3">{log.employeeCode || "N/A"}</td>
                    <td className="p-3">{log.userName || "N/A"}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-white ${
                        log.action === "CREATE" ? "bg-green-500" :
                        log.action === "UPDATE" ? "bg-yellow-500" :
                        "bg-red-500"
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3">{log.entity}</td>
                    <td className="p-3">{log.ipAddress || "N/A"}</td>
                    <td className="p-3">{log.timestamp ? format(new Date(log.timestamp), "yyyy-MM-dd HH:mm") : "N/A"}</td>
                    <td className="p-3">
                      <button
                        onClick={() => router.push(`/activityLogs/attendance/viewActivityLogById/${log._id}`)}
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-3 text-center">No logs found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className={`px-4 py-2 rounded-md ${
              pagination.page === 1 ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className={`px-4 py-2 rounded-md ${
              pagination.page === pagination.totalPages ? "bg-gray-300 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
