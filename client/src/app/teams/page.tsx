"use client";
import { useGetTeamsQuery } from "@/state/api";
import React, { useState } from "react";
import { 
  Users as TeamsIcon, 
  Search, 
  UserPlus, 
  Settings,
  Crown,
  User,
  MapPin,
  Calendar,
  TrendingUp,
  MoreVertical,
  Plus,
  Download
} from "lucide-react";

const Teams = () => {
  const { data: teams, isLoading, isError } = useGetTeamsQuery();
  const [searchTerm, setSearchTerm] = useState("");

  // Mock additional team data for better display
  const enhancedTeams = teams?.map(team => ({
    ...team,
    description: [
      "Frontend development team focusing on user experience",
      "Backend services and API development specialists", 
      "Mobile app development and cross-platform solutions",
      "DevOps and infrastructure management team",
      "QA and testing automation specialists"
    ][Math.floor(Math.random() * 5)],
    memberCount: Math.floor(Math.random() * 8) + 3,
    location: ["San Francisco, CA", "New York, NY", "Remote", "Austin, TX"][Math.floor(Math.random() * 4)],
    created: new Date(Date.now() - Math.floor(Math.random() * 365) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    activeProjects: Math.floor(Math.random() * 5) + 1,
    completedTasks: Math.floor(Math.random() * 100) + 50,
    performance: Math.floor(Math.random() * 20) + 80, // 80-100%
    avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000000)}?w=100&h=100&fit=crop&crop=face`,
  })) || [];

  const filteredTeams = enhancedTeams.filter(team => 
    team.teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.productOwnerUsername?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    team.projectManagerUsername?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return "text-green-600 bg-green-100 border-green-200";
    if (performance >= 80) return "text-blue-600 bg-blue-100 border-blue-200";
    if (performance >= 70) return "text-yellow-600 bg-yellow-100 border-yellow-200";
    return "text-red-600 bg-red-100 border-red-200";
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-gray-600 dark:text-gray-400">Loading teams...</span>
        </div>
      </div>
    );
  }

  if (isError || !teams) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <TeamsIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Unable to load teams
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            An error occurred while fetching team data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-pink-600">
                <TeamsIcon className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Teams
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Manage and organize your project teams
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              <Download className="mr-2 h-4 w-4" />
              Export
            </button>
            <button className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <Plus className="mr-2 h-4 w-4" />
              Create Team
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search teams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-80 rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
            />
          </div>
          
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredTeams.length} of {enhancedTeams.length} teams
          </span>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {filteredTeams.map((team) => (
            <div
              key={team.id}
              className="overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-200 hover:shadow-xl dark:bg-gray-800"
            >
              <div className="p-6">
                {/* Team Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-lg font-bold text-white">
                        {team.teamName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {team.teamName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {team.memberCount} members
                      </p>
                    </div>
                  </div>
                  <button className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                {/* Team Description */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                  {team.description}
                </p>

                {/* Team Leaders */}
                <div className="space-y-2 mb-4">
                  {team.productOwnerUsername && (
                    <div className="flex items-center space-x-2 text-sm">
                      <Crown className="h-4 w-4 text-yellow-500" />
                      <span className="text-gray-600 dark:text-gray-400">Product Owner:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {team.productOwnerUsername}
                      </span>
                    </div>
                  )}
                  {team.projectManagerUsername && (
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-4 w-4 text-blue-500" />
                      <span className="text-gray-600 dark:text-gray-400">Project Manager:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {team.projectManagerUsername}
                      </span>
                    </div>
                  )}
                </div>

                {/* Team Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {team.activeProjects}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Active Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                      {team.completedTasks}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Tasks Done</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-semibold ${getPerformanceColor(team.performance).split(' ')[0]}`}>
                      {team.performance}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Performance</div>
                  </div>
                </div>

                {/* Team Info */}
                <div className="space-y-2 mb-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-3 w-3" />
                    <span>{team.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-3 w-3" />
                    <span>Created: {team.created}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    <UserPlus className="h-4 w-4" />
                    <span>Add Member</span>
                  </button>
                  <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTeams.length === 0 && (
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                No teams found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search criteria
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;