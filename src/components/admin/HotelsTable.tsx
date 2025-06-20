
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Filter, MoreHorizontal, Eye, Edit, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const API_BASE_URL = 'http://localhost:6000/api';

export function HotelsTable() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hotels, setHotels] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 10;

  const fetchHotels = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching hotels...', { page: currentPage, search: searchTerm });
      
      const queryParams = new URLSearchParams();
      if (currentPage) queryParams.append('page', currentPage.toString());
      if (searchTerm) queryParams.append('search', searchTerm);
      queryParams.append('limit', itemsPerPage.toString());
      
      const response = await fetch(`${API_BASE_URL}/admin/hotels?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json().catch(() => ({ error: 'Failed to parse server response' }));

      if (response.ok) {
        console.log('Hotels fetched successfully:', data);
        setHotels(data);
        setError(null);
      } else {
        throw new Error(data.error || 'Failed to fetch hotels');
      }
    } catch (error: any) {
      console.error('Error fetching hotels:', error);
      setError(error.message || 'Unknown error');
      setHotels({ data: [], total: 0 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, [currentPage, searchTerm]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Hotels Management</CardTitle>
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
            <CardTitle>Hotels Management</CardTitle>
            <CardDescription>Manage hotel properties and details</CardDescription>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4"/>
            Add Hotel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-4">
            <p className="text-sm">Error loading hotels: {error}</p>
            <button 
              onClick={fetchHotels}
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
              placeholder="Search hotels..."
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
                <TableHead>Hotel Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hotels?.data?.map((hotel: any) => (
                <TableRow key={hotel._id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{hotel.name}</div>
                      <div className="text-sm text-gray-500">ID: {hotel._id.slice(-8)}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{hotel.city}</div>
                      <div className="text-sm text-gray-500">{hotel.address}</div>
                    </div>
                  </TableCell>
                  <TableCell>{hotel.contact}</TableCell>
                  <TableCell>
                    {hotel.owner?.firstName && hotel.owner?.lastName
                      ? `${hotel.owner.firstName} ${hotel.owner.lastName}`
                      : hotel.owner?.username || 'N/A'
                    }
                  </TableCell>
                  <TableCell>{new Date(hotel.createdAt).toLocaleDateString()}</TableCell>
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
                          Edit Hotel
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
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, hotels?.total || 0)} of {hotels?.total || 0} hotels
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
              disabled={currentPage * itemsPerPage >= (hotels?.total || 0)}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
