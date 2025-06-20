
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Hotel, Users, Calendar, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Hotel className="h-7 w-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Loxur</h1>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Hotel Booking Management Platform
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Professional admin panel for managing your hotel booking business with powerful analytics and seamless operations.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Dashboard Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Real-time insights into bookings, revenue, and business performance.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-lg">User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Manage customers, hotel owners, and admin accounts efficiently.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Booking Control</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                View, modify, and track all hotel bookings from one place.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Hotel className="h-6 w-6 text-orange-600" />
              </div>
              <CardTitle className="text-lg">Hotel Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center">
                Add, edit, and manage hotel properties and room inventories.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Manage Your Hotels?
          </h3>
          <p className="text-gray-600 mb-8 max-w-lg mx-auto">
            Access the powerful admin dashboard to oversee your entire hotel booking operation.
          </p>
          <Link to="/admin">
            <Button size="lg" className="text-lg px-8 py-3">
              Access Admin Panel
            </Button>
          </Link>
        </div>

        {/* API Info */}
        <div className="mt-16 bg-gray-900 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Backend API Ready</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-3">Server Information</h4>
              <ul className="space-y-2 text-gray-300">
                <li>• Port: 6000</li>
                <li>• Database: MongoDB Atlas</li>
                <li>• Authentication: bcrypt</li>
                <li>• CORS enabled for development</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-3">Quick Start</h4>
              <div className="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                <div>cd backend-api</div>
                <div>npm install</div>
                <div>npm run dev</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
