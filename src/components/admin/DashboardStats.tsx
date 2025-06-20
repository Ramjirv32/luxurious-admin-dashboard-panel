
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, Hotel, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:6000/api';

export function DashboardStats() {
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching dashboard stats...');
      
      const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json().catch(() => ({ error: 'Failed to parse server response' }));

      if (response.ok) {
        console.log('Dashboard stats fetched successfully:', data);
        setStats(data);
        setError(null);
      } else {
        throw new Error(data.error || 'Failed to fetch dashboard stats');
      }
    } catch (error: any) {
      console.error('Error fetching dashboard stats:', error);
      setError(error.message || 'Unknown error');
      // Set default stats on error
      setStats({
        totalUsers: 0,
        totalBookings: 0,
        totalHotels: 0,
        totalRevenue: 0,
        recentActivity: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  const statsData = [
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      change: '+12%',
      changeType: 'positive',
      icon: Users,
    },
    {
      title: 'Total Bookings',
      value: stats?.totalBookings || 0,
      change: '+8%',
      changeType: 'positive',
      icon: Calendar,
    },
    {
      title: 'Total Hotels',
      value: stats?.totalHotels || 0,
      change: '+3%',
      changeType: 'positive',
      icon: Hotel,
    },
    {
      title: 'Revenue',
      value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`,
      change: '+15%',
      changeType: 'positive',
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
          <p className="text-sm">Error loading dashboard stats: {error}</p>
          <button 
            onClick={fetchDashboardStats}
            className="text-sm underline hover:no-underline mt-1"
          >
            Retry
          </button>
        </div>
      )}
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => (
          <Card key={stat.title} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center gap-2 mt-2">
                {stat.changeType === 'positive' ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                )}
                <Badge 
                  variant={stat.changeType === 'positive' ? 'default' : 'destructive'}
                  className="text-xs"
                >
                  {stat.change}
                </Badge>
                <span className="text-xs text-gray-500">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest bookings and user registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.recentActivity?.map((activity: any, index: number) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              )) || (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full p-3 text-left bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <div className="font-medium text-blue-900">Add New Hotel</div>
              <div className="text-sm text-blue-600">Register a new hotel property</div>
            </button>
            <button className="w-full p-3 text-left bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <div className="font-medium text-green-900">Send Newsletter</div>
              <div className="text-sm text-green-600">Send updates to subscribers</div>
            </button>
            <button className="w-full p-3 text-left bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <div className="font-medium text-purple-900">Generate Report</div>
              <div className="text-sm text-purple-600">Create monthly analytics report</div>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
