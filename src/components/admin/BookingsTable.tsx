
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, MoreHorizontal, Eye, Edit } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const API_BASE_URL = 'http://localhost:6000/api';

export function BookingsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [bookings, setBookings] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching bookings...', { page: currentPage, search: searchTerm });
      
      const queryParams = new URLSearchParams();
      if (currentPage) queryParams.append('page', currentPage.toString());
      if (searchTerm) queryParams.append('search', searchTerm);
      queryParams.append('limit', itemsPerPage.toString());
      
      const response = await fetch(`${API_BASE_URL}/admin/bookings?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json().catch(() => ({ error: 'Failed to parse server response' }));

      if (response.ok) {
        console.log('Bookings fetched successfully:', data);
        setBookings(data);
        setError(null);
      } else {
        throw new Error(data.error || 'Failed to fetch bookings');
      }
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      setError(error.message || 'Unknown error');
      setBookings({ data: [], total: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [currentPage, searchTerm]);

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bookings Management</CardTitle>
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
        <CardTitle>Bookings Management</CardTitle>
        <CardDescription>View and manage hotel bookings</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-4">
            <p className="text-sm">Error loading bookings: {error}</p>
            <button 
              onClick={fetchBookings}
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
              placeholder="Search bookings..."
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
                <TableHead>Booking ID</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Hotel</TableHead>
                <TableHead>Check-in</TableHead>
                <TableHead>Check-out</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings?.data?.map((booking: any) => (
                <TableRow key={booking._id}>
                  <TableCell className="font-mono text-sm">
                    #{booking._id.slice(-8)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{booking.userName}</div>
                      <div className="text-sm text-gray-500">{booking.userEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{booking.hotelId?.name || 'N/A'}</div>
                      <div className="text-sm text-gray-500">{booking.roomId?.roomType || 'N/A'}</div>
                    </div>
                  </TableCell>
                  <TableCell>{new Date(booking.checkInDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(booking.checkOutDate).toLocaleDateString()}</TableCell>
                  <TableCell className="font-medium">₹{booking.totalPrice.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Edit className="h-4 w-4" />
                          Update Status
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
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, bookings?.total || 0)} of {bookings?.total || 0} bookings
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
              disabled={currentPage * itemsPerPage >= (bookings?.total || 0)}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
