"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileText, MessageSquare, Database } from "lucide-react";

interface ExportButtonProps {
  type: "reviews" | "replies" | "both";
  days?: number;
  locationId?: string;
  className?: string;
}

export default function ExportButton({ 
  type, 
  days = 90, 
  locationId, 
  className = "" 
}: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams({
        format: "csv",
        type,
        days: days.toString(),
      });

      if (locationId) {
        params.append("locationId", locationId);
      }

      const response = await fetch(`/api/reports/export?${params}`);
      
      if (!response.ok) {
        throw new Error("Export failed");
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get("Content-Disposition");
      const filename = contentDisposition
        ? contentDisposition.split("filename=")[1]?.replace(/"/g, "")
        : `${type}-export-${new Date().toISOString().split('T')[0]}.csv`;

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export data. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const getButtonText = () => {
    switch (type) {
      case "reviews":
        return "Export Reviews";
      case "replies":
        return "Export Replies";
      case "both":
        return "Export All Data";
      default:
        return "Export";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "reviews":
        return <FileText className="h-4 w-4" />;
      case "replies":
        return <MessageSquare className="h-4 w-4" />;
      case "both":
        return <Database className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  return (
    <Button
      onClick={handleExport}
      disabled={isExporting}
      variant="outline"
      className={`border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white ${className}`}
    >
      {isExporting ? (
        <>
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent" />
          Exporting...
        </>
      ) : (
        <>
          {getIcon()}
          <span className="ml-2">{getButtonText()}</span>
        </>
      )}
    </Button>
  );
}
