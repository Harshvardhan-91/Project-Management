import { useAppSelector } from "@/app/redux";
import { useGetTasksQuery } from "@/state/api";
import { FrappeGantt } from "frappe-gantt-react";
import React, { useMemo, useState } from "react";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

// ViewMode enum for frappe-gantt-react
enum ViewMode {
  QuarterDay = 'Quarter Day',
  HalfDay = 'Half Day',
  Day = 'Day',
  Week = 'Week',
  Month = 'Month',
}

// Task interface for frappe-gantt-react
interface FrappeGanttTask {
  id: string;
  name: string;
  start: string; // Date string in YYYY-MM-DD format
  end: string;   // Date string in YYYY-MM-DD format
  progress: number; // Progress percentage (0-100)
  dependencies?: string; // Comma separated task IDs
  custom_class?: string;
}

const Timeline = ({ id, setIsModalNewTaskOpen }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Month);

  const ganttTasks = useMemo((): FrappeGanttTask[] => {
    return (
      tasks?.map((task) => ({
        id: `Task-${task.id}`,
        name: task.title,
        start: new Date(task.startDate as string).toISOString().split('T')[0], // Convert to YYYY-MM-DD
        end: new Date(task.dueDate as string).toISOString().split('T')[0],     // Convert to YYYY-MM-DD
        progress: task.points ? (task.points / 10) * 100 : 0,
        custom_class: isDarkMode ? 'dark-task' : 'light-task',
      })) || []
    );
  }, [tasks, isDarkMode]);

  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setViewMode(event.target.value as ViewMode);
  };

  const handleTaskClick = (task: FrappeGanttTask) => {
    console.log('Task clicked:', task);
  };

  const handleDateChange = (task: FrappeGanttTask, start: string, end: string) => {
    console.log('Date changed:', task, start, end);
    // You can add your logic here to update the task dates
  };

  const handleProgressChange = (task: FrappeGanttTask, progress: number) => {
    console.log('Progress changed:', task, progress);
    // You can add your logic here to update the task progress
  };

  const handleTasksChange = (tasks: FrappeGanttTask[]) => {
    console.log('Tasks changed:', tasks);
    // You can add your logic here to handle task changes
  };

  if (isLoading) return <div>Loading...</div>;
  if (error || !tasks) return <div>An error occurred while fetching tasks</div>;

  return (
    <div className="px-4 xl:px-6">
      <div className="flex flex-wrap items-center justify-between gap-2 py-5">
        <h1 className="me-2 text-lg font-bold dark:text-white">
          Project Tasks Timeline
        </h1>
        <div className="relative inline-block w-64">
          <select
            className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
            value={viewMode}
            onChange={handleViewModeChange}
          >
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
        <div className="timeline">
          <FrappeGantt
            tasks={ganttTasks}
            viewMode={viewMode}
            onClick={handleTaskClick}
            onDateChange={handleDateChange}
            onProgressChange={handleProgressChange}
            onTasksChange={handleTasksChange}
          />
        </div>
        <div className="px-4 pb-5 pt-1">
          <button
            className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add New Task
          </button>
        </div>
      </div>

      {/* Custom styles for dark mode */}
      <style jsx>{`
        .dark-task .bar {
          fill: #4a5568 !important;
        }
        .light-task .bar {
          fill: #3182ce !important;
        }
      `}</style>
    </div>
  );
};

export default Timeline;