
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, MoreHorizontal, Mail, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const API_BASE_URL = 'http://localhost:6000/api';

export function NewsletterTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [subscribers, setSubscribers] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  const fetchNewsletterSubscribers = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching newsletter subscribers...', { page: currentPage, search: searchTerm });
      
      const queryParams = new URLSearchParams();
      if (currentPage) queryParams.append('page', currentPage.toString());
      if (searchTerm) queryParams.append('search', searchTerm);
      queryParams.append('limit', itemsPerPage.toString());
      
      const response = await fetch(`${API_BASE_URL}/admin/newsletter?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json().catch(() => ({ error: 'Failed to parse server response' }));

      if (response.ok) {
        console.log('Newsletter subscribers fetched successfully:', data);
        setSubscribers(data);
        setError(null);
      } else {
        throw new Error(data.error || 'Failed to fetch newsletter subscribers');
      }
    } catch (error: any) {
      console.error('Error fetching newsletter subscribers:', error);
      setError(error.message || 'Unknown error');
      setSubscribers({ data: [], total: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsletterSubscribers();
  }, [currentPage, searchTerm]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Newsletter Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Newsletter Management</CardTitle>
            <CardDescription>Manage newsletter subscribers</CardDescription>
          </div>
          <Button className="gap-2">
            <Mail className="h-4 w-4" />
            Send Newsletter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-4">
            <p className="text-sm">Error loading newsletter subscribers: {error}</p>
            <button 
              onClick={fetchNewsletterSubscribers}
              className="text-sm underline hover:no-underline mt-1"
            >
              Retry
            </button>
          </div>
        )}

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search subscribers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subscribed Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {subscribers?.data?.map((subscriber: any) => (
                <TableRow key={subscriber._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                        <Mail className="h-4 w-4 text-purple-600" />
                      </div>
                      <span className="font-medium">{subscriber.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={subscriber.subscribed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {subscriber.subscribed ? 'Active' : 'Unsubscribed'}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(subscriber.subscribedAt).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Mail className="h-4 w-4" />
                          Send Email
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-red-600">
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-500">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, subscribers?.total || 0)} of {subscribers?.total || 0} subscribers
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button 
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage * itemsPerPage >= (subscribers?.total || 0)}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
