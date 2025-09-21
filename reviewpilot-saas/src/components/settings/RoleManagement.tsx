"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  UserPlus, 
  Trash2, 
  Shield, 
  Users, 
  Eye,
  Edit3,
  Crown
} from "lucide-react";

interface Member {
  id: string;
  role: string;
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  };
}

interface RoleManagementProps {
  organizationId: string;
  currentUserId: string;
}

export default function RoleManagement({ organizationId, currentUserId }: RoleManagementProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("member");
  const [inviting, setInviting] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const loadMembers = async () => {
    try {
      const response = await fetch(`/api/organization/members?organizationId=${organizationId}`);
      const data = await response.json();
      if (response.ok) {
        setMembers(data.members || []);
      } else {
        console.error("Failed to load members:", data.error);
      }
    } catch (error) {
      console.error("Error loading members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, [organizationId]);

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    
    setInviting(true);
    try {
      const response = await fetch("/api/organization/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId,
          email: inviteEmail.trim(),
          role: inviteRole,
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setInviteEmail("");
        setInviteRole("member");
        await loadMembers();
      } else {
        alert(data.error || "Failed to invite user");
      }
    } catch (error) {
      console.error("Error inviting user:", error);
      alert("Failed to invite user");
    } finally {
      setInviting(false);
    }
  };

  const handleRoleChange = async (membershipId: string, newRole: string) => {
    setUpdating(membershipId);
    try {
      const response = await fetch("/api/organization/members", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          membershipId,
          role: newRole,
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        await loadMembers();
      } else {
        alert(data.error || "Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      alert("Failed to update role");
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (membershipId: string, userName: string) => {
    if (!confirm(`Are you sure you want to remove ${userName} from the organization?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/organization/members?membershipId=${membershipId}`, {
        method: "DELETE",
      });
      
      const data = await response.json();
      if (response.ok) {
        await loadMembers();
      } else {
        alert(data.error || "Failed to remove member");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      alert("Failed to remove member");
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "member":
        return <Edit3 className="h-4 w-4 text-blue-500" />;
      case "viewer":
        return <Eye className="h-4 w-4 text-gray-500" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "member":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "viewer":
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  if (loading) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Role Management
          </CardTitle>
          <CardDescription className="text-gray-400">
            Loading members...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Shield className="mr-2 h-5 w-5" />
          Role Management
        </CardTitle>
        <CardDescription className="text-gray-400">
          Manage team members and their permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Invite New Member */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <UserPlus className="mr-2 h-5 w-5" />
            Invite Member
          </h3>
          <div className="flex gap-3">
            <Input
              type="email"
              placeholder="Enter email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
            />
            <Select value={inviteRole} onValueChange={setInviteRole}>
              <SelectTrigger className="w-32 bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700 text-white">
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="viewer">Viewer</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleInvite}
              disabled={!inviteEmail.trim() || inviting}
              className="bg-cyan-500 hover:bg-cyan-400 text-black"
            >
              {inviting ? "Inviting..." : "Invite"}
            </Button>
          </div>
        </div>

        {/* Members List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Team Members ({members.length})
          </h3>
          
          {members.length === 0 ? (
            <p className="text-gray-400">No members found.</p>
          ) : (
            <div className="space-y-3">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(member.role)}
                      <Badge className={getRoleBadgeColor(member.role)}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {member.user.name || "No name"}
                        {member.user.id === currentUserId && (
                          <span className="text-gray-400 text-sm ml-2">(You)</span>
                        )}
                      </p>
                      <p className="text-gray-400 text-sm">{member.user.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {member.user.id !== currentUserId && (
                      <>
                        <Select
                          value={member.role}
                          onValueChange={(newRole) => handleRoleChange(member.id, newRole)}
                        >
                          <SelectTrigger className="w-24 bg-gray-600 border-gray-500 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-gray-800 border-gray-700 text-white">
                            <SelectItem value="owner">Owner</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemove(member.id, member.user.name || member.user.email)}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Role Descriptions */}
        <div className="space-y-3 pt-4 border-t border-gray-700">
          <h4 className="text-sm font-semibold text-white">Role Permissions</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start space-x-2">
              <Crown className="h-4 w-4 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-yellow-400 font-medium">Owner</p>
                <p className="text-gray-400">Full access, can manage roles and settings</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Edit3 className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-blue-400 font-medium">Member</p>
                <p className="text-gray-400">Can reply to reviews and manage alerts</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Eye className="h-4 w-4 text-gray-500 mt-0.5" />
              <div>
                <p className="text-gray-400 font-medium">Viewer</p>
                <p className="text-gray-400">Read-only access to reviews and reports</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
