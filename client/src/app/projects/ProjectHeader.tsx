import Header from "@/components/Header";
import {
  Clock,
  Filter,
  Grid3x3,
  List,
  PlusSquare,
  Search,
  Share2,
  Table,
  MoreHorizontal,
} from "lucide-react";
import React, { useState } from "react";
import ModalNewProject from "./ModalNewProject";

type Props = {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
};

const ProjectHeader = ({ activeTab, setActiveTab }: Props) => {
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-900">
      <ModalNewProject
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />
      
      {/* Header Section */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-6 dark:border-gray-700 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Product Design Development
            </h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Manage your design workflow and track project progress
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </button>
            <button
              className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              onClick={() => setIsModalNewProjectOpen(true)}
            >
              <PlusSquare className="mr-2 h-4 w-4" />
              New Board
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 bg-white px-6 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <nav className="flex space-x-8" aria-label="Tabs">
            <TabButton
              name="Board"
              icon={<Grid3x3 className="h-4 w-4" />}
              setActiveTab={setActiveTab}
              activeTab={activeTab}
            />
            <TabButton
              name="List"
              icon={<List className="h-4 w-4" />}
              setActiveTab={setActiveTab}
              activeTab={activeTab}
            />
            <TabButton
              name="Timeline"
              icon={<Clock className="h-4 w-4" />}
              setActiveTab={setActiveTab}
              activeTab={activeTab}
            />
            <TabButton
              name="Table"
              icon={<Table className="h-4 w-4" />}
              setActiveTab={setActiveTab}
              activeTab={activeTab}
            />
          </nav>
          
          {/* Right side controls */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search tasks..."
                className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500"
              />
            </div>
            <button className="inline-flex items-center rounded-lg border border-gray-300 bg-white p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-500 dark:hover:text-gray-400">
              <Filter className="h-4 w-4" />
            </button>
            <button className="inline-flex items-center rounded-lg border border-gray-300 bg-white p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-500 dark:hover:text-gray-400">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

type TabButtonProps = {
  name: string;
  icon: React.ReactNode;
  setActiveTab: (tabName: string) => void;
  activeTab: string;
};

const TabButton = ({ name, icon, setActiveTab, activeTab }: TabButtonProps) => {
  const isActive = activeTab === name;

  return (
    <button
      className={`group inline-flex items-center space-x-2 border-b-2 py-4 px-1 text-sm font-medium transition-colors duration-200 ${
        isActive
          ? "border-blue-500 text-blue-600 dark:text-blue-400"
          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      }`}
      onClick={() => setActiveTab(name)}
    >
      <span className={`transition-colors duration-200 ${
        isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-400"
      }`}>
        {icon}
      </span>
      <span>{name}</span>
    </button>
  );
};

export default ProjectHeader;