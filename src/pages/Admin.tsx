
import { useState } from 'react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { UsersTable } from '@/components/admin/UsersTable';
import { BookingsTable } from '@/components/admin/BookingsTable';
import { HotelsTable } from '@/components/admin/HotelsTable';
import { NewsletterTable } from '@/components/admin/NewsletterTable';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const getPageTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'Dashboard Overview';
      case 'users': return 'User Management';
      case 'bookings': return 'Booking Management';
      case 'hotels': return 'Hotel Management';
      case 'newsletter': return 'Newsletter Subscribers';
      default: return 'Admin Dashboard';
    }
  };

  const getPageDescription = () => {
    switch(activeTab) {
      case 'dashboard': return 'Monitor your travel booking platform performance and key metrics';
      case 'users': return 'Manage user accounts, roles, and permissions';
      case 'bookings': return 'View and manage all booking transactions';
      case 'hotels': return 'Manage hotel listings and room inventory';
      case 'newsletter': return 'Manage newsletter subscriptions and campaigns';
      default: return 'Manage your travel booking platform';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-slate-50">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 overflow-auto">
          {/* Top Navigation Bar */}
          <div className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{getPageTitle()}</h1>
                <p className="text-slate-600 mt-1">{getPageDescription()}</p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Search..." 
                    className="pl-10 w-64 bg-slate-50 border-slate-200"
                  />
                </div>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsContent value="dashboard" className="space-y-6">
                <DashboardStats />
              </TabsContent>

              <TabsContent value="users" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-blue-600 font-semibold text-sm">U</span>
                      </div>
                      User Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UsersTable />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bookings" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-green-600 font-semibold text-sm">B</span>
                      </div>
                      Booking Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BookingsTable />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="hotels" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 font-semibold text-sm">H</span>
                      </div>
                      Hotel Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <HotelsTable />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="newsletter" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-orange-600 font-semibold text-sm">N</span>
                      </div>
                      Newsletter Management
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <NewsletterTable />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
