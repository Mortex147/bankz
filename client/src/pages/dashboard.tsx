import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { DepositModal } from "@/components/deposit-modal";
import { WithdrawalModal } from "@/components/withdrawal-modal";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  Calendar,
  Plus,
  ArrowUp,
  History,
  CheckCircle,
  ArrowDown,
  Coins,
  DollarSign
} from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const { user } = useAuth();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  const { data: stats } = useQuery({
    queryKey: ["/api/user/stats"],
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ["/api/transactions"],
  });

  const formatCurrency = (amount: string | number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(typeof amount === 'string' ? parseFloat(amount) : amount);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDown className="h-4 w-4 text-emerald-600" />;
      case 'withdrawal':
        return <ArrowUp className="h-4 w-4 text-amber-600" />;
      case 'earning':
        return <Coins className="h-4 w-4 text-blue-600" />;
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-emerald-100 text-emerald-800">Completed</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.firstName || user?.email?.split('@')[0] || 'User'}!
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Here's what's happening with your account today.
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button 
                onClick={() => setShowDepositModal(true)}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Funds
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Current Balance
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(user?.balance || 0)}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center mt-2">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12.5% from last month
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Earnings
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(stats?.totalEarnings || 0)}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center mt-2">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +8.2% from last month
                  </p>
                </div>
                <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
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
                    {formatCurrency(stats?.pendingWithdrawals || 0)}
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center mt-2">
                    <Clock className="h-3 w-3 mr-1" />
                    {stats?.pendingWithdrawalCount || 0} requests pending
                  </p>
                </div>
                <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    This Month
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(stats?.thisMonth || 0)}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center mt-2">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +15.3% vs last month
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Quick Actions Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  className="w-full"
                  onClick={() => setShowDepositModal(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Deposit Funds
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowWithdrawalModal(true)}
                >
                  <ArrowUp className="h-4 w-4 mr-2" />
                  Request Withdrawal
                </Button>
                
                <Button variant="outline" className="w-full">
                  <History className="h-4 w-4 mr-2" />
                  View All Transactions
                </Button>

                {/* Account Status */}
                <div className="pt-6 border-t">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Account Status
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Verification Level
                      </span>
                      <Badge variant="default" className="bg-emerald-100 text-emerald-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Account Type
                      </span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        Premium
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Transactions</CardTitle>
                  <Button variant="link" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.slice(0, 5).map((transaction: any) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                              {getTransactionIcon(transaction.type)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {transaction.description || transaction.type}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {transaction.method}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={`text-sm font-medium ${
                            transaction.type === 'withdrawal' 
                              ? 'text-red-600 dark:text-red-400' 
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}>
                            {transaction.type === 'withdrawal' ? '-' : '+'}
                            {formatCurrency(transaction.amount)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(transaction.status)}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {format(new Date(transaction.createdAt), "MMM dd, yyyy")}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {transactions.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      No transactions yet. Start by making your first deposit!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modals */}
      <DepositModal 
        open={showDepositModal} 
        onOpenChange={setShowDepositModal} 
      />
      <WithdrawalModal 
        open={showWithdrawalModal} 
        onOpenChange={setShowWithdrawalModal} 
      />
    </div>
  );
}
