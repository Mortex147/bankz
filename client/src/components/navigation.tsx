import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Brain, Moon, Sun, Bell, ChevronDown } from "lucide-react";

export function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Brain className="h-8 w-8 text-primary mr-3" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                SmartDev
              </span>
            </div>
            <div className="hidden md:ml-10 md:flex space-x-8">
              <Link href="/">
                <a className="text-primary border-b-2 border-primary px-1 pt-1 pb-4 text-sm font-medium">
                  Dashboard
                </a>
              </Link>
              <Link href="/transactions">
                <a className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white px-1 pt-1 pb-4 text-sm font-medium">
                  Transactions
                </a>
              </Link>
              <Link href="/earnings">
                <a className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white px-1 pt-1 pb-4 text-sm font-medium">
                  Earnings
                </a>
              </Link>
              {user?.role === 'admin' && (
                <Link href="/admin">
                  <a className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white px-1 pt-1 pb-4 text-sm font-medium">
                    Admin
                  </a>
                </Link>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-yellow-400" />
              ) : (
                <Moon className="h-4 w-4 text-gray-600" />
              )}
            </Button>
            
            {/* Notifications */}
            <Button
              variant="ghost"
              size="icon"
              className="p-2 rounded-lg bg-gray-100 dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 relative"
            >
              <Bell className="h-4 w-4 text-gray-600 dark:text-gray-300" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                2
              </span>
            </Button>
            
            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={user?.profileImageUrl || ""} 
                      alt="User avatar"
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {user?.firstName?.[0] || user?.email?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                    {user?.firstName || user?.email?.split('@')[0] || 'User'}
                  </span>
                  <ChevronDown className="h-3 w-3 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <a href="/api/logout">Logout</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
