"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, Lock } from "lucide-react";

interface ViewerRestrictionProps {
  action: string;
  children?: React.ReactNode;
}

export default function ViewerRestriction({ action, children }: ViewerRestrictionProps) {
  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Lock className="mr-2 h-5 w-5 text-yellow-500" />
          Read-Only Access
        </CardTitle>
        <CardDescription className="text-gray-400">
          You have viewer permissions and cannot {action}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
          <Eye className="h-5 w-5 text-yellow-500" />
          <div>
            <p className="text-yellow-400 font-medium">Viewer Role</p>
            <p className="text-gray-400 text-sm">
              Contact your organization owner to upgrade your permissions if you need to {action}.
            </p>
          </div>
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
