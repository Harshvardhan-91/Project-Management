"use client";

import ProjectCard from "@/components/ProjectCard";
import TaskCard from "@/components/TaskCard";
import UserCard from "@/components/UserCard";
import { useSearchQuery } from "@/state/api";
import { debounce } from "lodash";
import React, { useEffect, useState } from "react";
import { 
  Search as SearchIcon, 
  Filter, 
  X, 
  FileText, 
  Users, 
  FolderOpen,
  Clock,
  TrendingUp,
  Zap
} from "lucide-react";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  const {
    data: searchResults,
    isLoading,
    isError,
  } = useSearchQuery(searchTerm, {
    skip: searchTerm.length < 3,
  });

  const handleSearch = debounce(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setSearchTerm(value);
      
      // Add to search history if not empty and not already exists
      if (value.length >= 3 && !searchHistory.includes(value)) {
        setSearchHistory(prev => [value, ...prev.slice(0, 4)]);
      }
    },
    300,
  );

  useEffect(() => {
    return handleSearch.cancel;
  }, [handleSearch.cancel]);

  const clearSearch = () => {
    setSearchTerm("");
    setActiveFilter("all");
  };

  const getResultCounts = () => {
    if (!searchResults) return { total: 0, tasks: 0, projects: 0, users: 0 };
    
    const tasks = searchResults.tasks?.length || 0;
    const projects = searchResults.projects?.length || 0;
    const users = searchResults.users?.length || 0;
    const total = tasks + projects + users;
    
    return { total, tasks, projects, users };
  };

  const counts = getResultCounts();

  const filteredResults = () => {
    if (!searchResults) return { tasks: [], projects: [], users: [] };
    
    switch (activeFilter) {
      case "tasks":
        return { tasks: searchResults.tasks || [], projects: [], users: [] };
      case "projects":
        return { tasks: [], projects: searchResults.projects || [], users: [] };
      case "users":
        return { tasks: [], projects: [], users: searchResults.users || [] };
      default:
        return searchResults;
    }
  };

  const results = filteredResults();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                <SearchIcon className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Search
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Find projects, tasks, and team members across your workspace
                </p>
              </div>
            </div>
          </div>
          
          {searchTerm && (
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <TrendingUp className="h-4 w-4" />
              <span>{counts.total} results found</span>
            </div>
          )}
        </div>
      </div>

      {/* Search Section */}
      <div className="border-b border-gray-200 bg-white px-6 py-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto max-w-3xl">
          {/* Search Input */}
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search for projects, tasks, or team members..."
              onChange={handleSearch}
              className="block w-full rounded-xl border border-gray-300 bg-white py-4 pl-12 pr-12 text-lg placeholder-gray-500 shadow-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          {searchTerm && (
            <div className="mt-4 flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by:</span>
              <div className="flex space-x-2">
                {[
                  { key: "all", label: "All", count: counts.total, icon: Filter },
                  { key: "tasks", label: "Tasks", count: counts.tasks, icon: FileText },
                  { key: "projects", label: "Projects", count: counts.projects, icon: FolderOpen },
                  { key: "users", label: "Users", count: counts.users, icon: Users },
                ].map(({ key, label, count, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveFilter(key)}
                    className={`inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      activeFilter === key
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    }`}
                  >
                    <Icon className="mr-1 h-4 w-4" />
                    {label}
                    {count > 0 && (
                      <span className={`ml-2 rounded-full px-2 py-0.5 text-xs ${
                        activeFilter === key 
                          ? "bg-blue-500 text-white" 
                          : "bg-gray-200 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                      }`}>
                        {count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search History */}
          {!searchTerm && searchHistory.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Recent searches</h3>
              <div className="flex flex-wrap gap-2">
                {searchHistory.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => setSearchTerm(term)}
                    className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="p-6">
        <div className="mx-auto max-w-7xl">
          {/* Loading State */}
          {isLoading && (
            <div className="flex h-64 items-center justify-center">
              <div className="flex items-center space-x-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-gray-600 dark:text-gray-400">Searching...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {isError && (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                  <SearchIcon className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Search Error
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  An error occurred while searching. Please try again.
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !isError && searchTerm && counts.total === 0 && (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                  <SearchIcon className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  No results found
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your search terms or filters
                </p>
              </div>
            </div>
          )}

          {/* Welcome State */}
          {!searchTerm && !isLoading && (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                  <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Start searching
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Enter at least 3 characters to search across all your projects, tasks, and team members
                </p>
              </div>
            </div>
          )}

          {/* Search Results */}
          {!isLoading && !isError && searchTerm && counts.total > 0 && (
            <div className="space-y-8">
              {/* Tasks Section */}
              {results.tasks && results.tasks.length > 0 && (
                <div>
                  <div className="mb-4 flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Tasks ({results.tasks.length})
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {results.tasks.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </div>
                </div>
              )}

              {/* Projects Section */}
              {results.projects && results.projects.length > 0 && (
                <div>
                  <div className="mb-4 flex items-center space-x-2">
                    <FolderOpen className="h-5 w-5 text-green-600" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Projects ({results.projects.length})
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {results.projects.map((project) => (
                      <ProjectCard key={project.id} project={project} />
                    ))}
                  </div>
                </div>
              )}

              {/* Users Section */}
              {results.users && results.users.length > 0 && (
                <div>
                  <div className="mb-4 flex items-center space-x-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Team Members ({results.users.length})
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {results.users.map((user) => (
                      <UserCard key={user.userId} user={user} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;