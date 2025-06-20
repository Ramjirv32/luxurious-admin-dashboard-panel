
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarTrigger,
  SidebarFooter 
} from '@/components/ui/sidebar';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  Hotel, 
  Mail, 
  Settings,
  LogOut,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: TrendingUp, badge: null },
  { id: 'users', label: 'Users', icon: Users, badge: '1,234' },
  { id: 'bookings', label: 'Bookings', icon: Calendar, badge: '45' },
  { id: 'hotels', label: 'Hotels', icon: Hotel, badge: '89' },
  { id: 'newsletter', label: 'Newsletter', icon: Mail, badge: '2.1k' },
];

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  return (
    <Sidebar className="border-r bg-slate-900 text-white" collapsible="icon">
      <SidebarHeader className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Hotel className="h-6 w-6 text-white" />
            </div>
            <div className="group-data-[collapsible=icon]:hidden">
              <h2 className="font-bold text-xl text-white">TravelAdmin</h2>
              <p className="text-xs text-slate-400">Management Portal</p>
            </div>
          </div>
          <SidebarTrigger className="text-slate-400 hover:text-white group-data-[collapsible=icon]:hidden" />
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-4">
        <div className="mb-6 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
            <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-slate-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin User</p>
              <p className="text-xs text-slate-400">Super Administrator</p>
            </div>
          </div>
        </div>

        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                onClick={() => setActiveTab(item.id)}
                className={`w-full justify-start gap-3 h-12 rounded-lg transition-all duration-200 ${
                  activeTab === item.id 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium group-data-[collapsible=icon]:hidden">{item.label}</span>
                {item.badge && (
                  <Badge 
                    variant="secondary" 
                    className="ml-auto bg-slate-700 text-slate-300 group-data-[collapsible=icon]:hidden"
                  >
                    {item.badge}
                  </Badge>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
        
      <SidebarFooter className="p-4 border-t border-slate-700">
        <div className="space-y-2">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 h-12 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            <Settings className="h-5 w-5" />
            <span className="group-data-[collapsible=icon]:hidden">Settings</span>
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 h-12 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg"
          >
            <LogOut className="h-5 w-5" />
            <span className="group-data-[collapsible=icon]:hidden">Logout</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
