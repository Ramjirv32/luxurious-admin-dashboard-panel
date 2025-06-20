
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarTrigger 
} from '@/components/ui/sidebar';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Hotel, 
  Mail, 
  Settings,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
  { id: 'users', label: 'Users', icon: Users },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'hotels', label: 'Hotels', icon: Hotel },
  { id: 'newsletter', label: 'Newsletter', icon: Mail },
];

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader className="p-6 border-b">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Hotel className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">Loxur Admin</h2>
            <p className="text-sm text-gray-500">Hotel Management</p>
          </div>
        </div>
        <SidebarTrigger className="mt-4" />
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => setActiveTab(item.id)}
                className={`w-full justify-start gap-3 h-12 ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        
        <div className="mt-auto pt-8 space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-3 h-12">
            <Settings className="h-5 w-5" />
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-red-600 hover:text-red-700 hover:bg-red-50">
            <LogOut className="h-5 w-5" />
            Logout
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
