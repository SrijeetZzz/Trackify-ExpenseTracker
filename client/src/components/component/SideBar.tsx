import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import React from "react";
import { Outlet, useParams } from "react-router-dom";

const SideBar: React.FC = () => {
  const { id } = useParams();
  const items = [
    { title: "Dashboard", url: `/${id}/analytics`, icon: Home },
    { title: "Expense", url: `/${id}/expense`, icon: Inbox },
    { title: "Splitwise", url: `/${id}/splitwise`, icon: Calendar },
    { title: "Expense Planner", url: `/${id}/expense-planner`, icon: Search },
    { title: "Catgeories", url: `/${id}/categories`, icon: Settings },
    { title: "Settings", url: `/${id}/settings`, icon: Settings },
  ];
  return (
    <SidebarProvider>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar className="top-16">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a
                          href={item.url}
                          className="flex items-center gap-3 px-6 py-3 text-base font-medium hover:bg-gray-100 rounded-md"
                        >
                          <item.icon className="h-5 w-5" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 p-4">
          {/* Sidebar Toggle Button */}
          <SidebarTrigger className="mb-4" />
          <div className="p-4 border rounded-lg shadow-sm bg-white">
            <Outlet />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SideBar;
