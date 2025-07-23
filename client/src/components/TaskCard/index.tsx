import { Task } from "@/state/api";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";
import { Calendar, Clock, User, Tag, Flag, FileText } from "lucide-react";

type Props = {
  task: Task;
};

const TaskCard = ({ task }: Props) => {
  // Random placeholder images for better UI
  const randomImages = [
    "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=400&h=200&fit=crop",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop"
  ];
  
  const randomImage = randomImages[task.id % randomImages.length];

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'work in progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'under review': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'to do': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="mb-4 overflow-hidden rounded-xl bg-white shadow-lg transition-all duration-300 hover:shadow-xl dark:bg-gray-800 dark:shadow-gray-900/20">
      {/* Header Image */}
      <div className="relative h-48 w-full">
        <Image
          src={randomImage}
          alt="Task illustration"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(task.priority || '')}`}>
              <Flag className="mr-1 h-3 w-3" />
              {task.priority || 'Medium'}
            </span>
            <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusColor(task.status || '')}`}>
              {task.status || 'To Do'}
            </span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-6">
        {/* Title and ID */}
        <div className="mb-4">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Task #{task.id}</span>
            {task.tags && (
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                <Tag className="mr-1 h-3 w-3" />
                {task.tags}
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {task.title}
          </h3>
        </div>

        {/* Description */}
        {task.description && (
          <div className="mb-4">
            <div className="flex items-start space-x-2">
              <FileText className="mt-0.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                {task.description}
              </p>
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="mb-4 space-y-2">
          {task.startDate && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>Started: {format(new Date(task.startDate), "MMM dd, yyyy")}</span>
            </div>
          )}
          {task.dueDate && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
            </div>
          )}
        </div>

        {/* Team Members */}
        <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {task.author && (
                <div className="flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                    <User className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Author</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {task.author.username}
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {task.assignee && (
              <div className="flex items-center space-x-2">
                <div>
                  <p className="text-right text-xs text-gray-500 dark:text-gray-400">Assigned to</p>
                  <p className="text-right text-sm font-medium text-gray-900 dark:text-white">
                    {task.assignee.username}
                  </p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                  <User className="h-4 w-4 text-green-600 dark:text-green-300" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;