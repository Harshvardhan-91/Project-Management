import React from "react";
import { Menu, Moon, Search, Settings, Sun, User } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import { useGetAuthUserQuery } from "@/state/api";
import { signOut } from "aws-amplify/auth";
import Image from "next/image";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const { data: currentUser } = useGetAuthUserQuery({});
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  // Mock user for development - remove this when AWS Amplify is properly configured
  const mockUser = !currentUser ? {
    userDetails: {
      userId: 1,
      username: "John Doe",
      email: "john@example.com",
      profilePictureUrl: null // Use null to show User icon instead
    }
  } : null;
  
  const userToDisplay = currentUser || mockUser;
  if (!userToDisplay) return null;
  const currentUserDetails = userToDisplay?.userDetails;

  return (
    <div className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      {/* Left side */}
      <div className="flex items-center space-x-4">
        {isSidebarCollapsed && (
          <button
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
          >
            <Menu className="h-5 w-5" />
          </button>
        )}
        
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            className="block w-80 rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
            type="search"
            placeholder="Search projects, tasks, and more..."
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
        
        <Link
          href="/settings"
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:hover:bg-gray-800 dark:hover:text-gray-300"
        >
          <Settings className="h-5 w-5" />
        </Link>

        <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
            {currentUserDetails?.profilePictureUrl ? (
              <Image
                src={currentUserDetails.profilePictureUrl}
                alt={currentUserDetails.username || "User"}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <User className="h-4 w-4 text-white" />
            )}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {currentUserDetails?.username || "User"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentUserDetails?.email || "user@example.com"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;