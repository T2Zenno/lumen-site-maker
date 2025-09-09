import React from 'react';
import { 
  Layers, 
  ShoppingBag, 
  ShoppingCart, 
  Users, 
  FolderOpen, 
  UserCheck, 
  BarChart3, 
  Puzzle,
  Settings,
  Bell
} from 'lucide-react';
import { useAppState } from '@/contexts/AppStateContext';
import { cn } from '@/lib/utils';

const navigationItems = [
  {
    id: 'builder',
    label: 'Builder',
    icon: Layers,
    description: 'Page builder',
    hasNotification: false
  },
  {
    id: 'products',
    label: 'Products',
    icon: ShoppingBag,
    description: 'Product management',
    hasNotification: true
  },
  {
    id: 'orders',
    label: 'Orders',
    icon: ShoppingCart,
    description: 'Order management',
    hasNotification: true
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: Users,
    description: 'Customer database',
    hasNotification: false
  },
  {
    id: 'library',
    label: 'Library',
    icon: FolderOpen,
    description: 'Media library',
    hasNotification: false
  },
  {
    id: 'crm',
    label: 'CRM',
    icon: UserCheck,
    description: 'Customer relationship',
    hasNotification: false,
    requiresApp: 'crm' as const
  },
  {
    id: 'recap',
    label: 'Recap',
    icon: BarChart3,
    description: 'Analytics & reports',
    hasNotification: false,
    requiresApp: 'rekap' as const
  },
  {
    id: 'apps',
    label: 'Apps',
    icon: Puzzle,
    description: 'Extensions',
    hasNotification: false
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    description: 'Configuration',
    hasNotification: false
  }
];

export function AppSidebar() {
  const { state, dispatch } = useAppState();
  
  const handleViewChange = (viewId: string) => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: viewId });
  };
  
  const visibleItems = navigationItems.filter(item => {
    if (item.requiresApp) {
      return state.apps[item.requiresApp];
    }
    return true;
  });
  
  return (
    <aside className={cn(
      "bg-card border-r border-border transition-all duration-smooth flex flex-col",
      state.sidebarOpen ? "w-64" : "w-16"
    )}>
      {/* Brand Section */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
            {state.settings.brandName ? state.settings.brandName.slice(0, 2).toUpperCase() : 'PB'}
          </div>
          {state.sidebarOpen && (
            <div>
              <div className="font-semibold text-card-foreground">
                {state.settings.brandName || 'Page Builder'}
              </div>
              <div className="text-xs text-muted-foreground">
                {state.settings.workspace || 'default'}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = state.currentView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => handleViewChange(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-card-foreground hover:bg-muted"
                )}
                title={!state.sidebarOpen ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {state.sidebarOpen && (
                  <>
                    <span>{item.label}</span>
                    {item.hasNotification && (
                      <div className="w-2 h-2 bg-primary rounded-full ml-auto flex-shrink-0" />
                    )}
                  </>
                )}
                {!state.sidebarOpen && item.hasNotification && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
      
      {/* Tips Section */}
      {state.sidebarOpen && (
        <div className="p-4 border-t border-border">
          <div className="bg-muted rounded-lg p-3">
            <div className="flex items-start gap-2">
              <Bell className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground">
                <div className="font-medium text-card-foreground mb-1">Pro Tip</div>
                Drag blocks from the palette to build your page quickly.
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}