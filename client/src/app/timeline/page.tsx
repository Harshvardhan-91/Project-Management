"use client";

import { useAppSelector } from "@/app/redux";
import { useGetProjectsQuery } from "@/state/api";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState, useCallback } from "react";
import { 
  Calendar, 
  Clock, 
  Download, 
  Plus,
  Search,
  List,
  Layers,
  BarChart3,
  Users,
  Target,
  User
} from "lucide-react";

type TaskTypeItems = "task" | "milestone" | "project";

const Timeline = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: projects, isLoading, isError } = useGetProjectsQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [viewType, setViewType] = useState<"gantt" | "list">("gantt");

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  // Helper functions for colors
  const getProjectColor = useCallback((status: string, selected = false) => {
    const opacity = selected ? "1" : "0.8";
    switch (status) {
      case "Completed": return `rgba(34, 197, 94, ${opacity})`;
      case "On Track": return `rgba(59, 130, 246, ${opacity})`;
      case "At Risk": return `rgba(249, 115, 22, ${opacity})`;
      case "Delayed": return `rgba(239, 68, 68, ${opacity})`;
      default: return `rgba(107, 114, 128, ${opacity})`;
    }
  }, []);

  const getProgressColor = useCallback((status: string, selected = false) => {
    const opacity = selected ? "1" : "0.9";
    switch (status) {
      case "Completed": return `rgba(21, 128, 61, ${opacity})`;
      case "On Track": return `rgba(37, 99, 235, ${opacity})`;
      case "At Risk": return `rgba(234, 88, 12, ${opacity})`;
      case "Delayed": return `rgba(220, 38, 38, ${opacity})`;
      default: return `rgba(75, 85, 99, ${opacity})`;
    }
  }, []);

  // Enhanced project data with more details
  const enhancedProjects = useMemo(() => {
    return projects?.map(project => ({
      ...project,
      priority: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
      status: ["On Track", "At Risk", "Delayed", "Completed"][Math.floor(Math.random() * 4)],
      teamSize: Math.floor(Math.random() * 8) + 3,
      completion: Math.floor(Math.random() * 100),
      budget: Math.floor(Math.random() * 500000) + 50000,
      manager: ["Alice Johnson", "Bob Smith", "Carol Davis", "David Wilson"][Math.floor(Math.random() * 4)]
    })) || [];
  }, [projects]);

  const filteredProjects = enhancedProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === "all" || project.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const ganttTasks = useMemo(() => {
    return filteredProjects.map((project) => ({
      start: new Date(project.startDate as string),
      end: new Date(project.endDate as string),
      name: project.name,
      id: `Project-${project.id}`,
      type: "project" as TaskTypeItems,
      progress: project.completion,
      isDisabled: false,
      styles: {
        backgroundColor: getProjectColor(project.status),
        backgroundSelectedColor: getProjectColor(project.status, true),
        progressColor: getProgressColor(project.status),
        progressSelectedColor: getProgressColor(project.status, true),
      }
    }));
  }, [filteredProjects, getProjectColor, getProgressColor]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800 border-green-200";
      case "On Track": return "bg-blue-100 text-blue-800 border-blue-200";
      case "At Risk": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Delayed": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-red-600 bg-red-50";
      case "Medium": return "text-yellow-600 bg-yellow-50";
      case "Low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const handleViewModeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          <span className="text-gray-600 dark:text-gray-400">Loading timeline...</span>
        </div>
      </div>
    );
  }

  if (isError || !projects) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
            <Clock className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Unable to load timeline
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            An error occurred while fetching project data
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Enhanced Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-6 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Project Timeline
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track project progress and milestones across time
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-600 dark:text-gray-400">On Track</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                <span className="text-gray-600 dark:text-gray-400">At Risk</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <span className="text-gray-600 dark:text-gray-400">Delayed</span>
              </div>
            </div>
            
            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
            
            <button className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              <Download className="mr-2 h-4 w-4" />
              Export
            </button>
            <button className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
              <Plus className="mr-2 h-4 w-4" />
              New Project
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Controls */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-64 rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="Completed">Completed</option>
              <option value="On Track">On Track</option>
              <option value="At Risk">At Risk</option>
              <option value="Delayed">Delayed</option>
            </select>

            {/* View Mode */}
            <select
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:focus:border-blue-500"
              value={displayOptions.viewMode}
              onChange={handleViewModeChange}
            >
              <option value={ViewMode.Day}>Day View</option>
              <option value={ViewMode.Week}>Week View</option>
              <option value={ViewMode.Month}>Month View</option>
            </select>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Toggle */}
            <div className="flex items-center rounded-lg border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-800">
              <button
                onClick={() => setViewType("gantt")}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                  viewType === "gantt"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                } rounded-l-lg`}
              >
                <BarChart3 className="mr-1 h-4 w-4" />
                Gantt
              </button>
              <button
                onClick={() => setViewType("list")}
                className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                  viewType === "list"
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                } rounded-r-lg border-l border-gray-300 dark:border-gray-600`}
              >
                <List className="mr-1 h-4 w-4" />
                List
              </button>
            </div>

            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredProjects.length} of {enhancedProjects.length} projects
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {viewType === "gantt" ? (
          /* Gantt Chart View */
          <div className="overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-800">
            <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Timeline View
                </h2>
                <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                  <Layers className="h-4 w-4" />
                  <span>{ganttTasks.length} projects</span>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="timeline-container min-h-[400px]">
                {ganttTasks.length > 0 ? (
                  <Gantt
                    tasks={ganttTasks}
                    {...displayOptions}
                    columnWidth={displayOptions.viewMode === ViewMode.Month ? 200 : 150}
                    listCellWidth="250px"
                    rowHeight={50}
                    barCornerRadius={6}
                    handleWidth={8}
                    fontFamily="Inter, -apple-system, BlinkMacSystemFont, sans-serif"
                    fontSize="13"
                    gridLineColor={isDarkMode ? "#374151" : "#f3f4f6"}
                    todayColor={isDarkMode ? "#dc2626" : "#ef4444"}
                    TooltipContent={({ task }) => (
                      <div className="rounded-lg bg-white p-3 shadow-lg border dark:bg-gray-800 dark:border-gray-600">
                        <div className="font-semibold text-gray-900 dark:text-white">{task.name}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Progress: {task.progress}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {task.start?.toLocaleDateString()} - {task.end?.toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  />
                ) : (
                  <div className="flex h-64 items-center justify-center">
                    <div className="text-center">
                      <Target className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                        No projects found
                      </h3>
                      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Try adjusting your search or filter criteria
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-200 hover:shadow-xl dark:bg-gray-800"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">
                          {project.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {project.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {project.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${getStatusBadgeColor(project.status)}`}>
                        {project.status}
                      </span>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Team:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{project.teamSize} members</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Manager:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{project.manager}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Target className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600 dark:text-gray-400">Budget:</span>
                      <span className="font-medium text-gray-900 dark:text-white">${project.budget.toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{project.completion}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${project.completion}%`,
                          backgroundColor: getProjectColor(project.status)
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredProjects.length === 0 && (
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <Target className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                    No projects found
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;