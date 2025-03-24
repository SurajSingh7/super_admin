"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Briefcase,
  Activity,
  Server,
  Globe,
  Monitor,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react"

const ATTENDANCE_URL = process.env.NEXT_PUBLIC_ATTENDANCE_LOGS_URL

const ViewActivityLogById = ({ id }) => {
  const [log, setLog] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchLogDetails = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${ATTENDANCE_URL}attendance/get-activity-log/${id}`)
        const result = await response.json()

        if (result.success) {
          setLog(result.data)
        } else {
          toast.error("Failed to load log details")
        }
      } catch (error) {
        console.error("Error fetching log details:", error)
        toast.error("Error fetching log details")
      } finally {
        setLoading(false)
      }
    }

    fetchLogDetails()
  }, [id])

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(date)
  }

  const formatTime = (timeString) => {
    if (!timeString) return "N/A"
    const date = new Date(timeString)
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const getActionColor = (action) => {
    switch (action) {
      case "CREATE":
        return "bg-green-100 text-green-800"
      case "UPDATE":
        return "bg-blue-100 text-blue-800"
      case "DELETE":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getActionIcon = (action) => {
    switch (action) {
      case "CREATE":
        return <Plus className="w-4 h-4" />
      case "UPDATE":
        return <Pencil className="w-4 h-4" />
      case "DELETE":
        return <Trash2 className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  // Function to check if two values are different
  const isDifferent = (oldValue, newValue) => {
    if (oldValue === newValue) return false
    if (oldValue === null && newValue === null) return false
    if (oldValue === undefined && newValue === undefined) return false
    if (oldValue === "" && newValue === "") return false
    return true
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!log) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h2 className="text-2xl font-medium text-gray-800">Log not found</h2>
        <button
          onClick={() => router.back()}
          className="mt-4 flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </button>
      </div>
    )
  }

  const requestPayload = log.requestPayload || {}
  const changes = log.changes || {}
  const updatedRecord = changes.updatedRecord || {}
  const oldRecord = changes.oldRecord || {}

  // Get all unique keys from both objects for comparison
  const getComparisonKeys = () => {
    if (log.action !== "UPDATE" || !oldRecord || !updatedRecord) return []

    const allKeys = new Set([...Object.keys(oldRecord), ...Object.keys(updatedRecord)])

    // Filter out keys we don't want to show in the diff
    return Array.from(allKeys).filter((key) => !["_id", "__v", "createdAt", "updatedAt"].includes(key))
  }

  const comparisonKeys = getComparisonKeys()

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 focus:outline-none transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Back</span>
          </button>
        </div>

        <div className="bg-white shadow-md rounded-xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold text-gray-900">Activity Log Details</h1>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getActionColor(log.action)}`}
              >
                {getActionIcon(log.action)}
                {log.action}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-500">{log.activityMessage}</p>
          </div>

          {/* Main content */}
          <div className="px-6 py-5 divide-y divide-gray-200">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div>
                <h2 className="text-sm font-medium text-gray-500 mb-3">Data Changed By</h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <User className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{log.userName}</p>
                      <p className="text-xs text-gray-500">User Name</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Briefcase className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{log.employeeCode}</p>
                      <p className="text-xs text-gray-500">Employee Code</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-sm font-medium text-gray-500 mb-3">Activity Information</h2>
                <div className="space-y-3">
                  <div className="flex items-start">
                    <Activity className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{log.entity}</p>
                      <p className="text-xs text-gray-500">Entity Type</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Server className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{log.affectedSchema}</p>
                      <p className="text-xs text-gray-500">Affected Schema</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Timestamp Info */}
            <div className="py-4">
              <h2 className="text-sm font-medium text-gray-500 mb-3">Timestamp Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{formatDate(log.createdAt)}</p>
                    <p className="text-xs text-gray-500">Created At</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{formatDate(log.updatedAt)}</p>
                    <p className="text-xs text-gray-500">Updated At</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Changes Section - Different for each action type */}
            <div className="py-4">
              <h2 className="text-sm font-medium text-gray-500 mb-3">
                {log.action === "CREATE"
                  ? "Created Data"
                  : log.action === "UPDATE"
                    ? "Changes"
                    : log.action === "DELETE"
                      ? "Deleted Data"
                      : "Changes"}
              </h2>

              {log.action === "CREATE" && (
                <div className="space-y-4">
                  <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                    <div className="flex items-center mb-3">
                      <Plus className="w-4 h-4 text-green-600 mr-2" />
                      <h3 className="text-sm font-medium text-green-800">New Record Created</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Employee Name</p>
                        <p className="text-sm font-medium text-gray-900">{requestPayload.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Employee Code</p>
                        <p className="text-sm font-medium text-gray-900">
                          {requestPayload.employeeCode || requestPayload.PersonEmployeeCode}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Device ID</p>
                        <p className="text-sm font-medium text-gray-900">{requestPayload.deviceId}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Shift Type</p>
                        <p className="text-sm font-medium text-gray-900">
                          {requestPayload.isDayShift
                            ? "Day Shift"
                            : requestPayload.isNightShift
                              ? "Night Shift"
                              : "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Punch In</h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-500">Actual Punch In</p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatTime(requestPayload.actualPunchInTime)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">User Punch In</p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatTime(requestPayload.userpunchInTime)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Punch Out</h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-500">Actual Punch Out</p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatTime(requestPayload.actualPunchOutTime)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">User Punch Out</p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatTime(requestPayload.userPunchOutTime)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {log.action === "UPDATE" && (
                <div className="space-y-4">
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <div className="flex items-center mb-4">
                      <Pencil className="w-4 h-4 text-blue-600 mr-2" />
                      <h3 className="text-sm font-medium text-blue-800">Record Changes</h3>
                    </div>

                    {/* Diff View Legend */}
                    <div className="flex items-center gap-4 mb-4 text-xs">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 mr-1"></div>
                        <span className="text-gray-600">Removed</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-600 mr-1"></div>
                        <span className="text-gray-600">Added</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 text-gray-600 bg-gray-200 mr-1"></div>
                        <span className="text-gray-600">Unchanged</span>
                      </div>
                    </div>

                    {/* Diff View Header */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="bg-gray-100 px-3 py-2 rounded-t-md">
                        <h4 className="text-sm font-medium text-gray-700">Previous Value</h4>
                      </div>
                      <div className="bg-gray-100 px-3 py-2 rounded-t-md">
                        <h4 className="text-sm font-medium text-gray-700">New Value</h4>
                      </div>
                    </div>

                    {/* Diff View Content */}
                    <div className="border rounded-md overflow-hidden">
                      {comparisonKeys.map((key, index) => {
                        const oldValue = oldRecord[key]
                        const newValue = updatedRecord[key]
                        const hasChanged = isDifferent(oldValue, newValue)

                        // Skip if both values are undefined or null
                        if (
                          (oldValue === undefined || oldValue === null) &&
                          (newValue === undefined || newValue === null)
                        ) {
                          return null
                        }

                        // Format the display value based on the key
                        const formatValue = (value, key) => {
                          if (value === undefined || value === null) return "—"
                          if (typeof value === "boolean") return value ? "Yes" : "No"
                          if (key.includes("Time")) return formatTime(value)
                          return value.toString()
                        }

                        const oldDisplayValue = formatValue(oldValue, key)
                        const newDisplayValue = formatValue(newValue, key)

                        // Format the key for display
                        const formatKey = (key) => {
                          return key
                            .replace(/([A-Z])/g, " $1") // Add space before capital letters
                            .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
                            .replace(/Is/g, "Is ") // Add space after "Is"
                            .replace(/Has/g, "Has ") // Add space after "Has"
                        }

                        const displayKey = formatKey(key)

                        return (
                          <div
                            key={key}
                            className={`grid grid-cols-2 gap-2 ${index !== comparisonKeys.length - 1 ? "border-b" : ""}`}
                          >
                            <div className={`px-3 py-2 ${hasChanged ? "bg-red-50" : "bg-gray-50"}`}>
                              <div className="flex justify-between">
                                <span className="text-xs text-gray-500">{displayKey}</span>
                                {hasChanged && <span className="text-xs text-red-500">Removed</span>}
                              </div>
                              <p className={`text-sm ${hasChanged ? "line-through text-red-700" : "text-gray-700"}`}>
                                {oldDisplayValue}
                              </p>
                            </div>
                            <div className={`px-3 py-2 ${hasChanged ? "bg-green-50" : "bg-gray-50"}`}>
                              <div className="flex justify-between">
                                <span className="text-xs text-gray-500">{displayKey}</span>
                                {hasChanged && <span className="text-xs text-green-500">Added</span>}
                              </div>
                              <p className={`text-sm ${hasChanged ? "font-medium text-green-700" : "text-gray-700"}`}>
                                {newDisplayValue}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Request Payload - What was changed */}
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4">
                    <div className="flex items-center mb-3">
                      <Activity className="w-4 h-4 text-gray-600 mr-2" />
                      <h3 className="text-sm font-medium text-gray-800">Change Request Details</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Changed By</p>
                        <p className="text-sm font-medium text-gray-900">{requestPayload.userName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Manipulator Employee Code</p>
                        <p className="text-sm font-medium text-gray-900">
                          {requestPayload.dataManipulatorEmployeeCode}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {log.action === "DELETE" && (
                <div className="bg-red-50 border border-red-100 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Trash2 className="w-4 h-4 text-red-600 mr-2" />
                    <h3 className="text-sm font-medium text-red-800">Record Deleted</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Employee Name</p>
                      <p className="text-sm font-medium text-gray-900">{requestPayload.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Employee Code</p>
                      <p className="text-sm font-medium text-gray-900">
                        {requestPayload.employeeCode || requestPayload.PersonEmployeeCode}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-white rounded border border-red-100">
                    <p className="text-sm text-gray-500">This record has been permanently deleted from the system.</p>
                  </div>
                </div>
              )}

              {/* Defaulters Updated Data */}
              {changes.defaultersUpdatedData && (
                <div className="mt-4 bg-gray-50 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Defaulters Information</h3>
                  <p className="text-sm text-gray-600">{changes.defaultersUpdatedData.message}</p>
                </div>
              )}
            </div>

            {/* System Information */}
            <div className="py-4">
              <h2 className="text-sm font-medium text-gray-500 mb-3">System Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <Globe className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{log.ipAddress}</p>
                    <p className="text-xs text-gray-500">IP Address</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Monitor className="w-5 h-5 text-gray-400 mt-0.5 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-xs">{log.userAgent}</p>
                    <p className="text-xs text-gray-500">User Agent</p>
                  </div>
                </div>
              </div>
            </div>

            {/* ID Information */}
            <div className="py-4">
              <h2 className="text-sm font-medium text-gray-500 mb-3">Record IDs</h2>
              <div className="space-y-2">
                <div>
                  <p className="text-xs text-gray-800">Log ID</p>
                  <p className="text-sm font-mono text-gray-500 bg-gray-50 p-1 rounded">{log._id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-800">Entity ID</p>
                  <p className="text-sm font-mono text-gray-500 bg-gray-50 p-1 rounded">{log.entityId}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end">
              <button
                onClick={() => router.back()}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
              >
                Back to Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ViewActivityLogById