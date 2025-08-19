import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Settings,
  LogOut,
  Plus,
  FileText,
  Package,
  ClipboardList,
} from "lucide-react";
import ItemsTable from "./ItemsTable";
import ItemForm from "./ItemForm";
import BorrowingForm from "./BorrowingForm";
import ReportGenerator from "./ReportGenerator";

const Home = () => {
  const [activeTab, setActiveTab] = useState("available");
  const [showItemForm, setShowItemForm] = useState(false);
  const [showBorrowingForm, setShowBorrowingForm] = useState(false);
  const [showReportGenerator, setShowReportGenerator] = useState(false);

  // Mock data for dashboard statistics
  const stats = {
    totalItems: 1245,
    availableItems: 876,
    borrowedItems: 369,
    pendingRequests: 42,
  };

  // Mock data for recent activities
  const recentActivities = [
    {
      id: 1,
      action: "Item Borrowed",
      item: "Projector",
      user: "John Doe",
      department: "Science",
      time: "2 hours ago",
    },
    {
      id: 2,
      action: "Item Returned",
      item: "Laptop",
      user: "Jane Smith",
      department: "Math",
      time: "5 hours ago",
    },
    {
      id: 3,
      action: "New Item Added",
      item: "Microscope",
      user: "Admin",
      department: "Science",
      time: "1 day ago",
    },
    {
      id: 4,
      action: "Request Approved",
      item: "Tablet",
      user: "Mike Johnson",
      department: "English",
      time: "1 day ago",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6" />
            <h1 className="text-xl font-bold">
              School Property Management System
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                  alt="User"
                />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">
                  admin@school.edu
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 border-r bg-background p-4">
          <nav className="space-y-2">
            <Button variant="ghost" className="w-full justify-start">
              <Package className="mr-2 h-5 w-5" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <ClipboardList className="mr-2 h-5 w-5" />
              Inventory
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <FileText className="mr-2 h-5 w-5" />
              Reports
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Dashboard Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalItems}</div>
                <p className="text-xs text-muted-foreground">
                  Across all departments
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Available Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.availableItems}</div>
                <p className="text-xs text-muted-foreground">
                  Ready for borrowing
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Borrowed Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.borrowedItems}</div>
                <p className="text-xs text-muted-foreground">
                  Currently in use
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.pendingRequests}
                </div>
                <p className="text-xs text-muted-foreground">
                  Awaiting approval
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="my-6 flex flex-wrap gap-4">
            <Dialog open={showItemForm} onOpenChange={setShowItemForm}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add New Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <ItemForm onClose={() => setShowItemForm(false)} />
              </DialogContent>
            </Dialog>

            <Dialog
              open={showBorrowingForm}
              onOpenChange={setShowBorrowingForm}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" /> Borrow Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <BorrowingForm onClose={() => setShowBorrowingForm(false)} />
              </DialogContent>
            </Dialog>

            <Dialog
              open={showReportGenerator}
              onOpenChange={setShowReportGenerator}
            >
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FileText className="mr-2 h-4 w-4" /> Generate Report
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px]">
                <ReportGenerator
                  onClose={() => setShowReportGenerator(false)}
                />
              </DialogContent>
            </Dialog>
          </div>

          {/* Recent Activities */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest actions in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center justify-between border-b pb-2 last:border-0"
                  >
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.item} • {activity.department} •{" "}
                        {activity.user}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Items Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="mb-4">
              <TabsTrigger value="available">Available Items</TabsTrigger>
              <TabsTrigger value="borrowed">Borrowed Items</TabsTrigger>
              <TabsTrigger value="pending">Pending Requests</TabsTrigger>
            </TabsList>

            <TabsContent value="available">
              <ItemsTable
                type="available"
                onBorrow={() => setShowBorrowingForm(true)}
              />
            </TabsContent>

            <TabsContent value="borrowed">
              <ItemsTable
                type="borrowed"
                onReturn={() => setShowBorrowingForm(true)}
              />
            </TabsContent>

            <TabsContent value="pending">
              <ItemsTable
                type="pending"
                onApprove={() => {}}
                onReject={() => {}}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Home;
