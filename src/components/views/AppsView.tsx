import React from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  BarChart3, 
  Users, 
  Database, 
  Puzzle,
  MessageSquare,
  CreditCard,
  QrCode,
  Smartphone
} from 'lucide-react';

const availableApps = [
  {
    id: 'rekap',
    name: 'Sales Recap',
    description: 'Advanced analytics and sales reporting with charts and insights.',
    icon: BarChart3,
    category: 'Analytics',
    features: ['Monthly revenue charts', 'Performance metrics', 'Customer insights', 'Export reports'],
    version: '1.0.0',
    isCore: false
  },
  {
    id: 'crm',
    name: 'Simple CRM',
    description: 'Customer relationship management with lead tracking and pipeline.',
    icon: Users,
    category: 'Sales',
    features: ['Lead management', 'Pipeline tracking', 'Drag & drop kanban', 'Conversion analytics'],
    version: '1.2.0',
    isCore: false
  },
  {
    id: 'db',
    name: 'Customer Database',
    description: 'Comprehensive customer data management and organization.',
    icon: Database,
    category: 'Data',
    features: ['Customer profiles', 'Contact management', 'Order history', 'CSV import/export'],
    version: '2.0.0',
    isCore: true
  }
] as const;

const integrations = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business',
    description: 'Direct checkout and customer communication via WhatsApp.',
    icon: MessageSquare,
    category: 'Communication',
    status: 'configured'
  },
  {
    id: 'midtrans',
    name: 'Midtrans Payment',
    description: 'Accept payments via credit cards, e-wallets, and bank transfers.',
    icon: CreditCard,
    category: 'Payment',
    status: 'available'
  },
  {
    id: 'xendit',
    name: 'Xendit Gateway',
    description: 'Payment gateway for Indonesia with various payment methods.',
    icon: CreditCard,
    category: 'Payment',
    status: 'available'
  },
  {
    id: 'qris',
    name: 'QRIS Payment',
    description: 'QR code payment system for instant transactions.',
    icon: QrCode,
    category: 'Payment',
    status: 'configured'
  }
];

export function AppsView() {
  const { state, dispatch } = useAppState();
  
  const handleToggleApp = (appId: keyof typeof state.apps, enabled: boolean) => {
    dispatch({ type: 'TOGGLE_APP', payload: { app: appId, enabled } });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'configured':
        return <Badge className="bg-success/20 text-success">Configured</Badge>;
      case 'available':
        return <Badge variant="outline">Available</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };
  
  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-card-foreground">Apps & Extensions</h1>
          <p className="text-muted-foreground">Extend your store with powerful features and integrations</p>
        </div>
      </div>
      
      {/* Installed Apps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Puzzle className="w-5 h-5" />
            Installed Apps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableApps.map((app) => {
              const Icon = app.icon;
              const isInstalled = app.id === 'db' || state.apps[app.id as keyof typeof state.apps];
              
              return (
                <div key={app.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">{app.name}</h3>
                        <p className="text-xs text-muted-foreground">{app.category} • v{app.version}</p>
                      </div>
                    </div>
                    
                    {app.isCore ? (
                      <Badge className="bg-primary/20 text-primary">Core</Badge>
                    ) : (
                      <Switch
                        checked={isInstalled}
                        onCheckedChange={(enabled) => 
                          handleToggleApp(app.id as keyof typeof state.apps, enabled)
                        }
                      />
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{app.description}</p>
                  
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-card-foreground">Features:</p>
                    <ul className="text-xs text-muted-foreground space-y-0.5">
                      {app.features.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>
                  </div>
                  
                  {!app.isCore && (
                    <div className="pt-2">
                      <Button
                        variant={isInstalled ? "destructive" : "default"}
                        size="sm"
                        className="w-full"
                        onClick={() => 
                          handleToggleApp(app.id as keyof typeof state.apps, !isInstalled)
                        }
                      >
                        {isInstalled ? 'Uninstall' : 'Install'}
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Payment Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Payment & Communication Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {integrations.map((integration) => {
              const Icon = integration.icon;
              
              return (
                <div key={integration.id} className="p-4 border border-border rounded-lg space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-card-foreground">{integration.name}</h3>
                        <p className="text-xs text-muted-foreground">{integration.category}</p>
                      </div>
                    </div>
                    
                    {getStatusBadge(integration.status)}
                  </div>
                  
                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    {integration.status === 'configured' ? 'Configure' : 'Setup'}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* App Store */}
      <Card>
        <CardHeader>
          <CardTitle>Discover More Apps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Smartphone className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-card-foreground mb-2">
              More Apps Coming Soon
            </h3>
            <p className="text-muted-foreground mb-4">
              We're working on additional integrations and features to help grow your business.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 text-left">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-card-foreground mb-2">📧 Email Marketing</h4>
                <p className="text-sm text-muted-foreground">
                  Send newsletters and promotional emails to your customers.
                </p>
                <Badge variant="secondary" className="mt-2">Coming Soon</Badge>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-card-foreground mb-2">📱 Mobile App</h4>
                <p className="text-sm text-muted-foreground">
                  Manage your store on the go with our mobile application.
                </p>
                <Badge variant="secondary" className="mt-2">In Development</Badge>
              </div>
              
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-card-foreground mb-2">🚛 Shipping</h4>
                <p className="text-sm text-muted-foreground">
                  Integrate with shipping providers for order fulfillment.
                </p>
                <Badge variant="secondary" className="mt-2">Planned</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Current Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Current Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">WhatsApp Number:</span>
                <span className="ml-2 font-medium">
                  {state.settings.waNumber || 'Not configured'}
                </span>
              </div>
              
              <div>
                <span className="text-muted-foreground">QRIS Merchant:</span>
                <span className="ml-2 font-medium">
                  {state.settings.qrisId || 'Not configured'}
                </span>
              </div>
              
              <div>
                <span className="text-muted-foreground">Bank Transfer:</span>
                <span className="ml-2 font-medium">
                  {state.settings.bankInfo ? 'Configured' : 'Not configured'}
                </span>
              </div>
              
              <div>
                <span className="text-muted-foreground">Brand Name:</span>
                <span className="ml-2 font-medium">
                  {state.settings.brandName || 'Not set'}
                </span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-border">
              <Button variant="outline" className="w-full sm:w-auto">
                Go to Settings to Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}