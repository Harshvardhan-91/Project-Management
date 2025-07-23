"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsSidebarCollapsed } from "@/state";
import { useGetAuthUserQuery, useGetProjectsQuery } from "@/state/api";
import { signOut } from "aws-amplify/auth";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Home,
  Layers3,
  LockIcon,
  LucideIcon,
  Search,
  Settings,
  ShieldAlert,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);

  const { data: projects } = useGetProjectsQuery();
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

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

  const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-2xl
    transition-all duration-300 h-full z-40 dark:bg-gray-900 overflow-y-auto bg-white border-r border-gray-200 dark:border-gray-700
    ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}
  `;

  return (
    <div className={sidebarClassNames}>
      <div className="flex h-[100%] w-full flex-col justify-start">
        {/* TOP LOGO */}
        <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-gradient-to-r from-blue-600 to-blue-700 px-6 pt-3 dark:from-gray-800 dark:to-gray-900">
          <div className="text-xl font-bold text-white">
            EDLIST
          </div>
          {isSidebarCollapsed ? null : (
            <button
              className="py-3"
              onClick={() => {
                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
              }}
            >
              <X className="h-6 w-6 text-white hover:text-gray-200" />
            </button>
          )}
        </div>
        {/* TEAM */}
        <div className="flex items-center gap-5 border-b border-gray-200 bg-gray-50 px-8 py-4 dark:border-gray-700 dark:bg-gray-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <span className="text-lg font-bold text-white">E</span>
          </div>
          <div>
            <h3 className="text-md font-bold tracking-wide text-gray-900 dark:text-gray-100">
              EDROH TEAM
            </h3>
            <div className="mt-1 flex items-start gap-2">
              <LockIcon className="mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400" />
              <p className="text-xs text-gray-500 dark:text-gray-400">Private</p>
            </div>
          </div>
        </div>
        {/* NAVBAR LINKS */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          <SidebarLink icon={Home} label="Home" href="/" />
          <SidebarLink icon={Briefcase} label="Timeline" href="/timeline" />
          <SidebarLink icon={Search} label="Search" href="/search" />
          <SidebarLink icon={Settings} label="Settings" href="/settings" />
          <SidebarLink icon={User} label="Users" href="/users" />
          <SidebarLink icon={Users} label="Teams" href="/teams" />
        </nav>

        {/* PROJECTS SECTION */}
        <div className="px-3">
          <button
            onClick={() => setShowProjects((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <span className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4" />
              <span>Projects</span>
            </span>
            {showProjects ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {showProjects && (
            <div className="ml-6 mt-2 space-y-1 border-l border-gray-200 pl-4 dark:border-gray-700">
              {projects?.map((project) => (
                <SidebarLink
                  key={project.id}
                  icon={Briefcase}
                  label={project.name}
                  href={`/projects/${project.id}`}
                  isSubItem
                />
              ))}
            </div>
          )}
        </div>

        {/* PRIORITIES SECTION */}
        <div className="px-3 pb-4">
          <button
            onClick={() => setShowPriority((prev) => !prev)}
            className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            <span className="flex items-center space-x-2">
              <ShieldAlert className="h-4 w-4" />
              <span>Priority</span>
            </span>
            {showPriority ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {showPriority && (
            <div className="ml-6 mt-2 space-y-1 border-l border-gray-200 pl-4 dark:border-gray-700">
              <SidebarLink
                icon={AlertCircle}
                label="Urgent"
                href="/priority/urgent"
                isSubItem
              />
              <SidebarLink
                icon={ShieldAlert}
                label="High"
                href="/priority/high"
                isSubItem
              />
              <SidebarLink
                icon={AlertTriangle}
                label="Medium"
                href="/priority/medium"
                isSubItem
              />
              <SidebarLink 
                icon={AlertOctagon} 
                label="Low" 
                href="/priority/low"
                isSubItem
              />
              <SidebarLink
                icon={Layers3}
                label="Backlog"
                href="/priority/backlog"
                isSubItem
              />
            </div>
          )}
        </div>
      </div>
      <div className="z-10 mt-32 flex w-full flex-col items-center gap-4 bg-white px-8 py-4 dark:bg-black md:hidden">
        <div className="flex w-full items-center">
          <div className="align-center flex h-9 w-9 justify-center">
            {!!currentUserDetails?.profilePictureUrl ? (
              <Image
                src={`https://pm-s3-images.s3.us-east-2.amazonaws.com/${currentUserDetails?.profilePictureUrl}`}
                alt={currentUserDetails?.username || "User Profile Picture"}
                width={100}
                height={50}
                className="h-full rounded-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 cursor-pointer self-center rounded-full dark:text-white" />
            )}
          </div>
          <span className="mx-3 text-gray-800 dark:text-white">
            {currentUserDetails?.username}
          </span>
          <button
            className="self-start rounded bg-blue-400 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 md:block"
            onClick={handleSignOut}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isSubItem?: boolean;
}

const SidebarLink = ({ href, icon: Icon, label, isSubItem = false }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/");

  return (
    <Link href={href} className="block">
      <div
        className={`group flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-blue-50 text-blue-700 shadow-sm dark:bg-blue-900/50 dark:text-blue-300"
            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        } ${isSubItem ? "text-xs" : ""}`}
      >
        {isActive && (
          <div className="absolute left-0 h-8 w-1 rounded-r-full bg-blue-600" />
        )}

        <Icon 
          className={`h-4 w-4 flex-shrink-0 transition-colors duration-200 ${
            isActive
              ? "text-blue-600 dark:text-blue-400"
              : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300"
          } ${isSubItem ? "h-3 w-3" : ""}`}
        />
        <span className="truncate">{label}</span>
      </div>
    </Link>
  );
};

export default Sidebar;