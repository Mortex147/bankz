import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Users, 
  TriangleAlert, 
  PieChart, 
  Activity,
  Search,
  Check,
  X,
  MoreHorizontal,
  TrendingUp
} from "lucide-react";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                Admin access required to view this page.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { data: adminStats } = useQuery({
    queryKey: ["/api/admin/stats"],
  });

  const { data: users = [] } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  const { data: pendingWithdrawals = [] } = useQuery({
    queryKey: ["/api/admin/pending-withdrawals"],
  });

  const approveWithdrawalMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("PATCH", `/api/admin/withdrawal/${id}`, { status: 'completed' });
    },
    onSuccess: () => {
      toast({
        title: "Withdrawal Approved",
        description: "Withdrawal has been approved successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to approve withdrawal",
        variant: "destructive",
      });
    },
  });

  const rejectWithdrawalMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest("PATCH", `/api/admin/withdrawal/${id}`, { status: 'rejected' });
    },
    onSuccess: () => {
      toast({
        title: "Withdrawal Rejected",
        description: "Withdrawal has been rejected",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/pending-withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to reject withdrawal",
        variant: "destructive",
      });
    },
  });

  const toggleUserStatusMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      return await apiRequest("PATCH", `/api/admin/user/${userId}/status`, { isActive });
    },
    onSuccess: () => {
      toast({
        title: "User Status Updated",
        description: "User status has been updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update user status",
        variant: "destructive",
      });
    },
  });

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-6 text-white mb-6">
          <h2 className="text-xl font-bold mb-2">Admin Dashboard</h2>
          <p className="text-slate-300">Manage users, transactions, and platform settings</p>
        </div>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Users
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {adminStats?.totalUsers || 0}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center mt-2">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{adminStats?.newUsersThisWeek || 0} this week
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Pending Withdrawals
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(adminStats?.pendingWithdrawalAmount || 0)}
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center mt-2">
                    <TriangleAlert className="h-3 w-3 mr-1" />
                    {adminStats?.pendingWithdrawalCount || 0} requests
                  </p>
                </div>
                <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center">
                  <TriangleAlert className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Platform Balance
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(adminStats?.totalPlatformBalance || 0)}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center mt-2">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +5.2% this month
                  </p>
                </div>
                <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                  <PieChart className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Active Sessions
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {adminStats?.activeSessions || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-2">
                    <Activity className="h-3 w-3 text-emerald-500 mr-1" />
                    Current online users
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Actions Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle>Pending Withdrawal Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingWithdrawals.length === 0 ? (
                  <p className="text-center text-gray-500 dark:text-gray-400 py-4">
                    No pending withdrawals
                  </p>
                ) : (
                  pendingWithdrawals.map((withdrawal: any) => (
                    <div key={withdrawal.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-slate-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={withdrawal.user?.profileImageUrl} />
                          <AvatarFallback>
                            {withdrawal.user?.firstName?.[0] || withdrawal.user?.email?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {withdrawal.user?.firstName || withdrawal.user?.email?.split('@')[0] || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatCurrency(withdrawal.amount)}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => approveWithdrawalMutation.mutate(withdrawal.id)}
                          disabled={approveWithdrawalMutation.isPending}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => rejectWithdrawalMutation.mutate(withdrawal.id)}
                          disabled={rejectWithdrawalMutation.isPending}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Button>Search</Button>
                </div>
                
                <div className="space-y-3">
                  {users.slice(0, 5).map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-slate-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.profileImageUrl} />
                          <AvatarFallback>
                            {user.firstName?.[0] || user.email?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.firstName || user.email?.split('@')[0] || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                          {user.isActive ? "Active" : "Suspended"}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleUserStatusMutation.mutate({
                            userId: user.id,
                            isActive: !user.isActive
                          })}
                          disabled={toggleUserStatusMutation.isPending}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
