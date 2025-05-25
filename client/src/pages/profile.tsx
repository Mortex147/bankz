import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Calendar,
  Shield,
  Star,
  TrendingUp,
  Wallet,
  Award,
  Edit,
  Save,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function ProfilePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || ''
  });

  const { data: stats } = useQuery({
    queryKey: ["/api/user/stats"],
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      // This would be an API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    updateProfileMutation.mutate(editData);
  };

  const handleCancel = () => {
    setEditData({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || ''
    });
    setIsEditing(false);
  };

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your account information and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Personal Information</CardTitle>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={updateProfileMutation.isPending}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {updateProfileMutation.isPending ? "Saving..." : "Save"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-6">
                  <Avatar className="h-20 w-20">
                    <AvatarImage 
                      src={user?.profileImageUrl || ""} 
                      alt="Profile picture"
                      className="object-cover"
                    />
                    <AvatarFallback className="text-lg">
                      {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {user?.firstName || user?.email?.split('@')[0] || 'User'} {user?.lastName || ''}
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
                    <div className="flex items-center mt-2">
                      <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'}>
                        <Shield className="h-3 w-3 mr-1" />
                        {user?.role === 'admin' ? 'Administrator' : 'User'}
                      </Badge>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    {isEditing ? (
                      <Input
                        id="firstName"
                        value={editData.firstName}
                        onChange={(e) => setEditData(prev => ({ ...prev, firstName: e.target.value }))}
                        placeholder="Enter your first name"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          {user?.firstName || 'Not provided'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    {isEditing ? (
                      <Input
                        id="lastName"
                        value={editData.lastName}
                        onChange={(e) => setEditData(prev => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Enter your last name"
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">
                          {user?.lastName || 'Not provided'}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">
                        {user?.email || 'Not provided'}
                      </span>
                      <Badge variant="outline" className="ml-auto">Verified</Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Email cannot be changed. Contact support if you need to update your email.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Member Since</Label>
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">
                        {user?.createdAt ? format(new Date(user.createdAt), "MMMM yyyy") : 'Unknown'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Account Status</Label>
                    <div className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <span className={`h-2 w-2 rounded-full ${user?.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="text-gray-900 dark:text-white">
                        {user?.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Account Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="h-5 w-5 mr-2" />
                  Account Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Current Balance</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(user?.balance || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Earned</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(stats?.totalEarnings || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">This Month</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    {formatCurrency(stats?.thisMonth || 0)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">Early Adopter</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Joined SmartDev platform</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-emerald-100 dark:bg-emerald-900 rounded-full flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">First Earning</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Completed your first task</p>
                  </div>
                </div>
                
                <div className="text-center pt-4">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Complete more tasks to unlock achievements!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Two-Factor Auth</span>
                  <Badge variant="outline">Enabled</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Last Login</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Today</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}