import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Navigation } from "@/components/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Zap, 
  Brain, 
  Code, 
  Trophy,
  Star,
  TrendingUp,
  Clock,
  CheckCircle,
  ArrowRight,
  Coins
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function EarningsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Real earning opportunities
  const earningOpportunities = [
    {
      id: 1,
      title: "Data Entry - Product Catalog",
      description: "Enter product information into our database system with accurate details",
      reward: 25,
      difficulty: "Beginner",
      estimatedTime: "1-2 hours",
      category: "Data Entry",
      tags: ["Data Entry", "Accuracy", "Excel"],
      completed: false,
      progress: 0
    },
    {
      id: 2,
      title: "Social Media Content Review",
      description: "Review and moderate social media posts for compliance and quality",
      reward: 15,
      difficulty: "Beginner",
      estimatedTime: "1 hour",
      category: "Content Moderation",
      tags: ["Content Review", "Social Media", "Moderation"],
      completed: false,
      progress: 0
    },
    {
      id: 3,
      title: "Survey Completion - Market Research",
      description: "Complete detailed market research surveys about consumer preferences",
      reward: 10,
      difficulty: "Beginner",
      estimatedTime: "30 minutes",
      category: "Surveys",
      tags: ["Survey", "Market Research", "Consumer"],
      completed: false,
      progress: 0
    },
    {
      id: 4,
      title: "Image Tagging and Classification",
      description: "Tag and classify product images for e-commerce catalog",
      reward: 20,
      difficulty: "Beginner",
      estimatedTime: "1-2 hours",
      category: "Image Processing",
      tags: ["Image Tagging", "Classification", "E-commerce"],
      completed: true,
      progress: 100
    },
    {
      id: 5,
      title: "Website Testing and Bug Reports",
      description: "Test websites and mobile apps, report bugs and usability issues",
      reward: 35,
      difficulty: "Intermediate",
      estimatedTime: "2-3 hours",
      category: "Quality Assurance",
      tags: ["Testing", "QA", "Bug Reports"],
      completed: false,
      progress: 65
    }
  ];

  const startTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      // Simulate starting a task
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { taskId, started: true };
    },
    onSuccess: (data) => {
      toast({
        title: "Task Started!",
        description: "You've successfully started this earning task. Good luck!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
    },
  });

  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: number) => {
      const task = earningOpportunities.find(t => t.id === taskId);
      if (!task) throw new Error("Task not found");
      
      // Create an earning transaction
      return await apiRequest("POST", "/api/earning", {
        taskId,
        amount: task.reward,
        description: `Completed: ${task.title}`
      });
    },
    onSuccess: (data, taskId) => {
      const task = earningOpportunities.find(t => t.id === taskId);
      toast({
        title: "Task Completed!",
        description: `Congratulations! You've earned $${task?.reward} for completing this task.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to complete task",
        variant: "destructive",
      });
    },
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'Advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const totalEarningsPotential = earningOpportunities
    .filter(task => !task.completed)
    .reduce((sum, task) => sum + task.reward, 0);

  const completedTasks = earningOpportunities.filter(task => task.completed);
  const totalEarned = completedTasks.reduce((sum, task) => sum + task.reward, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Earning Opportunities</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Complete AI development tasks and earn rewards
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available to Earn</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {formatCurrency(totalEarningsPotential)}
                  </p>
                </div>
                <div className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900 rounded-lg flex items-center justify-center">
                  <Coins className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tasks Completed</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {completedTasks.length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Earned</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(totalEarned)}
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {completedTasks.length > 0 ? Math.round((completedTasks.length / earningOpportunities.length) * 100) : 0}%
                  </p>
                </div>
                <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Task */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <div className="flex items-center">
              <Star className="h-5 w-5 text-yellow-500 mr-2" />
              <CardTitle className="text-blue-900 dark:text-blue-100">Featured High-Value Task</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Build AI-Powered Code Review System
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Create an intelligent code review system that uses AI to analyze code quality, 
                  suggest improvements, and detect potential security vulnerabilities.
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {['AI/ML', 'Node.js', 'OpenAI API', 'Security'].map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    5-7 hours
                  </span>
                  <span className="flex items-center">
                    <Brain className="h-4 w-4 mr-1" />
                    Expert Level
                  </span>
                </div>
              </div>
              <div className="lg:col-span-1 flex flex-col justify-center">
                <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-lg">
                  <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                    {formatCurrency(500)}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Reward Amount</p>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    <Zap className="h-4 w-4 mr-2" />
                    Start Featured Task
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Available Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Available Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {earningOpportunities.map((task) => (
                <div key={task.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {task.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                        {task.description}
                      </p>
                    </div>
                    {task.completed && (
                      <CheckCircle className="h-6 w-6 text-emerald-500 ml-2" />
                    )}
                  </div>

                  {task.progress > 0 && task.progress < 100 && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Progress</span>
                        <span className="text-gray-600 dark:text-gray-400">{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {task.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {task.estimatedTime}
                      </span>
                      <Badge className={getDifficultyColor(task.difficulty)}>
                        {task.difficulty}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(task.reward)}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {task.completed ? (
                      <Button disabled className="flex-1 bg-gray-100 text-gray-500">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed
                      </Button>
                    ) : task.progress > 0 ? (
                      <Button 
                        onClick={() => completeTaskMutation.mutate(task.id)}
                        disabled={completeTaskMutation.isPending}
                        className="flex-1"
                      >
                        <Trophy className="h-4 w-4 mr-2" />
                        {completeTaskMutation.isPending ? "Submitting..." : "Complete Task"}
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => startTaskMutation.mutate(task.id)}
                        disabled={startTaskMutation.isPending}
                        variant="outline" 
                        className="flex-1"
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        {startTaskMutation.isPending ? "Starting..." : "Start Task"}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}