import React, { useState } from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Save, 
  Upload, 
  Download, 
  RefreshCw, 
  Settings as SettingsIcon,
  Globe,
  CreditCard,
  Database,
  Image
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export function SettingsView() {
  const { state, dispatch } = useAppState();
  const [formData, setFormData] = useState(state.settings);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate save delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    dispatch({ type: 'UPDATE_SETTINGS', payload: formData });
    setIsSaving(false);
    
    // Show success message with toast or simple alert
    alert('Settings saved successfully!');
  };
  
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${state.settings.workspace || 'pagebuilder'}-backup.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  
  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        dispatch({ type: 'LOAD_STATE', payload: importedData });
        alert('Data imported successfully!');
      } catch (error) {
        alert('Failed to import data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };
  
  const handleSeedDemo = () => {
    if (!confirm('Add demo data? This will add sample products, orders, and customers.')) return;
    
    // Add demo products
    const demoProducts = [
      { id: 'demo_1', name: 'Premium T-Shirt', price: 150000, sku: 'SHIRT-001', category: 'Fashion', image: '', stock: 25 },
      { id: 'demo_2', name: 'Leather Bag', price: 350000, sku: 'BAG-001', category: 'Accessories', image: '', stock: 10 },
      { id: 'demo_3', name: 'Coffee Beans', price: 85000, sku: 'COFFEE-001', category: 'Food', image: '', stock: 50 }
    ];
    
    demoProducts.forEach(product => {
      dispatch({ type: 'ADD_PRODUCT', payload: product });
    });
    
    // Add demo orders
    const demoOrders = [
      { id: 'order_1', date: Date.now() - 86400000, customer: 'John Doe', product: 'Premium T-Shirt', qty: 2, total: 300000, method: 'WA' as const, status: 'Paid' as const },
      { id: 'order_2', date: Date.now() - 172800000, customer: 'Jane Smith', product: 'Leather Bag', qty: 1, total: 350000, method: 'Transfer' as const, status: 'Paid' as const }
    ];
    
    demoOrders.forEach(order => {
      dispatch({ type: 'ADD_ORDER', payload: order });
    });
    
    // Add demo customers
    const demoCustomers = [
      { id: 'cust_1', name: 'John Doe', phone: '628123456789', email: 'john@example.com', note: 'Regular customer' },
      { id: 'cust_2', name: 'Jane Smith', phone: '628987654321', email: 'jane@example.com', note: 'VIP customer' }
    ];
    
    demoCustomers.forEach(customer => {
      dispatch({ type: 'ADD_CUSTOMER', payload: customer });
    });
    
    alert('Demo data added successfully!');
  };
  
  const handleReset = () => {
    if (!confirm('Reset all data? This action cannot be undone.')) return;
    
    dispatch({ type: 'RESET_STATE' });
    setFormData(state.settings);
    alert('Workspace reset successfully!');
  };
  
  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-card-foreground">Settings</h1>
          <p className="text-muted-foreground">Configure your store and workspace</p>
        </div>
        
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="gap-2"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
      
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="gap-2">
            <SettingsIcon className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="payments" className="gap-2">
            <CreditCard className="w-4 h-4" />
            Payments
          </TabsTrigger>
          <TabsTrigger value="data" className="gap-2">
            <Database className="w-4 h-4" />
            Data
          </TabsTrigger>
          <TabsTrigger value="media" className="gap-2">
            <Image className="w-4 h-4" />
            Media
          </TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brand Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="brand-name">Brand Name</Label>
                <Input
                  id="brand-name"
                  value={formData.brandName}
                  onChange={(e) => handleInputChange('brandName', e.target.value)}
                  placeholder="Your Brand Name"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="domain">Custom Domain</Label>
                <Input
                  id="domain"
                  value={formData.domain}
                  onChange={(e) => handleInputChange('domain', e.target.value)}
                  placeholder="yourdomain.com"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="workspace">Workspace ID</Label>
                <Input
                  id="workspace"
                  value={formData.workspace}
                  onChange={(e) => handleInputChange('workspace', e.target.value)}
                  placeholder="workspace-name"
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Used for data storage separation. Changing this will create a new workspace.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Appearance & Language</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="theme">Theme</Label>
                <Select value={formData.theme} onValueChange={(value: 'light' | 'dark') => handleInputChange('theme', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="language">Language</Label>
                <Select value={formData.lang} onValueChange={(value: 'id' | 'en') => handleInputChange('lang', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">Bahasa Indonesia</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Payment Settings */}
        <TabsContent value="payments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Integration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="wa-number">WhatsApp Number</Label>
                <Input
                  id="wa-number"
                  value={formData.waNumber}
                  onChange={(e) => handleInputChange('waNumber', e.target.value)}
                  placeholder="628123456789"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="wa-template">Message Template</Label>
                <Textarea
                  id="wa-template"
                  value={formData.waTemplate}
                  onChange={(e) => handleInputChange('waTemplate', e.target.value)}
                  placeholder="Halo, saya ingin beli {{product}} ({{qty}}x) total {{total}}."
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Use {`{{product}}`}, {`{{qty}}`}, {`{{total}}`} as placeholders.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Bank Transfer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="bank-info">Bank Information</Label>
                <Textarea
                  id="bank-info"
                  value={formData.bankInfo}
                  onChange={(e) => handleInputChange('bankInfo', e.target.value)}
                  placeholder="Bank Name: BCA&#10;Account Number: 1234567890&#10;Account Name: Your Name"
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>QRIS Payment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="qris-id">Merchant ID</Label>
                <Input
                  id="qris-id"
                  value={formData.qrisId}
                  onChange={(e) => handleInputChange('qrisId', e.target.value)}
                  placeholder="Your QRIS Merchant ID"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="qris-image">QRIS Image</Label>
                <Select value={formData.qrisImg} onValueChange={(value) => handleInputChange('qrisImg', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select QRIS image from library" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.media.map((media) => (
                      <SelectItem key={media.id} value={media.id}>
                        {media.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Data Management */}
        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-card-foreground mb-2">Export Data</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Download all your workspace data as JSON file.
                  </p>
                  <Button onClick={handleExportJSON} variant="outline" className="w-full gap-2">
                    <Download className="w-4 h-4" />
                    Export JSON
                  </Button>
                </div>
                
                <div>
                  <h4 className="font-medium text-card-foreground mb-2">Import Data</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Restore workspace from a JSON backup file.
                  </p>
                  <label className="block">
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleImportJSON}
                      className="hidden"
                    />
                    <Button variant="outline" className="w-full gap-2" asChild>
                      <span>
                        <Upload className="w-4 h-4" />
                        Import JSON
                      </span>
                    </Button>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Demo Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Populate your workspace with sample products, orders, and customers to test features.
                </p>
                <Button onClick={handleSeedDemo} variant="outline" className="gap-2">
                  <Database className="w-4 h-4" />
                  Add Demo Data
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Reset your workspace to start fresh. This will permanently delete all data.
                </p>
                <Button onClick={handleReset} variant="destructive" className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Reset Workspace
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Media Settings */}
        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="logo">Logo</Label>
                <Select value={formData.logo} onValueChange={(value) => handleInputChange('logo', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select logo from library" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No logo</SelectItem>
                    {state.media.map((media) => (
                      <SelectItem key={media.id} value={media.id}>
                        {media.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="favicon">Favicon</Label>
                <Select value={formData.favicon} onValueChange={(value) => handleInputChange('favicon', value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select favicon from library" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No favicon</SelectItem>
                    {state.media.map((media) => (
                      <SelectItem key={media.id} value={media.id}>
                        {media.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Media Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Media Files</span>
                  <span className="font-medium">{state.media.length}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Estimated Storage</span>
                  <span className="font-medium">
                    ~{Math.round(state.media.length * 0.5)} MB
                  </span>
                </div>
                
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Media files are stored locally in your browser and included in HTML exports. 
                    For production use, consider uploading to a CDN service.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}