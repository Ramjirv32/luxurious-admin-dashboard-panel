
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Hotel, Calendar, Mail, TrendingUp, DollarSign } from 'lucide-react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { DashboardStats } from '@/components/admin/DashboardStats';
import { UsersTable } from '@/components/admin/UsersTable';
import { BookingsTable } from '@/components/admin/BookingsTable';
import { HotelsTable } from '@/components/admin/HotelsTable';
import { NewsletterTable } from '@/components/admin/NewsletterTable';
import { SidebarProvider } from '@/components/ui/sidebar';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage your hotel booking platform</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <div className="border-b">
                <TabsList className="grid w-full grid-cols-5 lg:w-auto">
                  <TabsTrigger value="dashboard" className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Dashboard
                  </TabsTrigger>
                  <TabsTrigger value="users" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Users
                  </TabsTrigger>
                  <TabsTrigger value="bookings" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Bookings
                  </TabsTrigger>
                  <TabsTrigger value="hotels" className="flex items-center gap-2">
                    <Hotel className="h-4 w-4" />
                    Hotels
                  </TabsTrigger>
                  <TabsTrigger value="newsletter" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Newsletter
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="dashboard">
                <DashboardStats />
              </TabsContent>

              <TabsContent value="users">
                <UsersTable />
              </TabsContent>

              <TabsContent value="bookings">
                <BookingsTable />
              </TabsContent>

              <TabsContent value="hotels">
                <HotelsTable />
              </TabsContent>

              <TabsContent value="newsletter">
                <NewsletterTable />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Admin;
