import React, { useEffect } from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { AppSidebar } from './AppSidebar';
import { TopBar } from './TopBar';
import { BuilderView } from '@/components/views/BuilderView';
import { ProductsView } from '@/components/views/ProductsView';
import { OrdersView } from '@/components/views/OrdersView';
import { CustomersView } from '@/components/views/CustomersView';
import { LibraryView } from '@/components/views/LibraryView';
import { CRMView } from '@/components/views/CRMView';
import { RecapView } from '@/components/views/RecapView';
import { AppsView } from '@/components/views/AppsView';
import { SettingsView } from '@/components/views/SettingsView';

export function MainLayout() {
  const { state } = useAppState();
  
  // Enable dark mode on mount
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);
  
  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'builder':
        return <BuilderView />;
      case 'products':
        return <ProductsView />;
      case 'orders':
        return <OrdersView />;
      case 'customers':
        return <CustomersView />;
      case 'library':
        return <LibraryView />;
      case 'crm':
        return <CRMView />;
      case 'recap':
        return <RecapView />;
      case 'apps':
        return <AppsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <BuilderView />;
    }
  };
  
  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      <AppSidebar />
      
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar />
        
        <main className="flex-1 flex overflow-hidden">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}