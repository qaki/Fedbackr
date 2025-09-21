"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  History, 
  User, 
  Calendar, 
  Filter,
  RefreshCw
} from "lucide-react";

interface AuditLog {
  id: string;
  action: string;
  targetId: string | null;
  metadata: any;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}

interface AuditLogViewerProps {
  organizationId: string;
}

export default function AuditLogViewer({ organizationId }: AuditLogViewerProps) {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionFilter, setActionFilter] = useState("all");
  const [total, setTotal] = useState(0);
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const loadAuditLogs = async () => {
    try {
      const params = new URLSearchParams({
        organizationId,
        limit: limit.toString(),
        offset: offset.toString(),
      });
      
      if (actionFilter !== "all") {
        params.append("action", actionFilter);
      }

      const response = await fetch(`/api/audit?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setAuditLogs(data.auditLogs || []);
        setTotal(data.total || 0);
      } else {
        console.error("Failed to load audit logs:", data.error);
      }
    } catch (error) {
      console.error("Error loading audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAuditLogs();
  }, [organizationId, actionFilter, offset]);

  const formatAction = (action: string) => {
    return action.replace(/\./g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getActionIcon = (action: string) => {
    if (action.includes("reply")) return "💬";
    if (action.includes("user")) return "👤";
    if (action.includes("settings")) return "⚙️";
    if (action.includes("location")) return "📍";
    if (action.includes("google")) return "🔗";
    if (action.includes("subscription")) return "💳";
    return "📝";
  };

  const actionOptions = [
    { value: "all", label: "All Actions" },
    { value: "review.replied", label: "Review Replies" },
    { value: "user.invited", label: "User Invites" },
    { value: "user.role_changed", label: "Role Changes" },
    { value: "settings.updated", label: "Settings Updates" },
    { value: "location.added", label: "Location Added" },
    { value: "location.deleted", label: "Location Deleted" },
    { value: "integration.google_connected", label: "Google Connected" },
  ];

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <History className="mr-2 h-5 w-5" />
          Audit Log
        </CardTitle>
        <CardDescription className="text-gray-400">
          Track all actions and changes in your organization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <Select value={actionFilter} onValueChange={setActionFilter}>
              <SelectTrigger className="w-48 bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                {actionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setOffset(0);
              loadAuditLogs();
            }}
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Audit Logs */}
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading audit logs...</p>
          </div>
        ) : auditLogs.length === 0 ? (
          <div className="text-center py-8">
            <History className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No audit logs found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start space-x-3 p-4 bg-gray-700/30 rounded-lg border border-gray-600"
              >
                <div className="text-2xl">{getActionIcon(log.action)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">
                      {formatAction(log.action)}
                    </span>
                    {log.user && (
                      <div className="flex items-center space-x-1 text-sm text-gray-400">
                        <User className="h-3 w-3" />
                        <span>{log.user.name || log.user.email}</span>
                      </div>
                    )}
                  </div>
                  
                  {log.metadata && Object.keys(log.metadata).length > 0 && (
                    <div className="mt-1 text-sm text-gray-400">
                      {Object.entries(log.metadata).map(([key, value]) => (
                        <span key={key} className="mr-3">
                          <span className="text-gray-500">{key}:</span> {String(value)}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-1 mt-2 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>{formatDate(log.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > limit && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-700">
            <p className="text-sm text-gray-400">
              Showing {offset + 1}-{Math.min(offset + limit, total)} of {total} logs
            </p>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOffset(Math.max(0, offset - limit))}
                disabled={offset === 0}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setOffset(offset + limit)}
                disabled={offset + limit >= total}
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
