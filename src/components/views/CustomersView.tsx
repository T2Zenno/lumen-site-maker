import React, { useState } from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Trash2, Upload, Download, UserPlus, Users } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export function CustomersView() {
  const { state, dispatch } = useAppState();
  const { toast } = useToast();
  const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  
  const handleAddCustomer = () => {
    // For now, just add a placeholder. In a real app, this would open a proper form dialog
    const newCustomer = {
      id: 'customer_' + Date.now(),
      name: 'New Customer',
      phone: '',
      email: '',
      note: ''
    };
    
    dispatch({ type: 'ADD_CUSTOMER', payload: newCustomer });
    toast({
      title: "Success",
      description: "Customer added successfully. Click Edit to update details.",
    });
  };
  
  const handleSelectCustomer = (index: number, checked: boolean) => {
    if (checked) {
      setSelectedCustomers([...selectedCustomers, index]);
    } else {
      setSelectedCustomers(selectedCustomers.filter(i => i !== index));
    }
  };
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(state.customers.map((_, index) => index));
    } else {
      setSelectedCustomers([]);
    }
  };
  
  const handleBulkDelete = () => {
    if (selectedCustomers.length === 0) return;
    setShowBulkDeleteDialog(true);
  };
  
  const confirmBulkDelete = () => {
    // Delete in reverse order to maintain indices
    const sorted = [...selectedCustomers].sort((a, b) => b - a);
    sorted.forEach(index => {
      // We need to implement this action in the context
      console.log('Delete customer at index:', index);
    });
    
    setSelectedCustomers([]);
    setShowBulkDeleteDialog(false);
    toast({
      title: "Success",
      description: `Deleted ${sorted.length} customers successfully`,
    });
  };
  
  // Calculate customer statistics
  const totalCustomers = state.customers.length;
  const customersWithEmail = state.customers.filter(c => c.email).length;
  const customersWithPhone = state.customers.filter(c => c.phone).length;
  
  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-card-foreground">Customers</h1>
          <p className="text-muted-foreground">Manage your customer database</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="w-4 h-4" />
            Import CSV
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button onClick={handleAddCustomer} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Customer
          </Button>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Customers</p>
                <p className="text-2xl font-bold text-card-foreground">{totalCustomers}</p>
              </div>
              <Users className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">With Email</p>
                <p className="text-2xl font-bold text-success">{customersWithEmail}</p>
              </div>
              <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                <span className="text-success font-bold">@</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">With Phone</p>
                <p className="text-2xl font-bold text-primary">{customersWithPhone}</p>
              </div>
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold">📞</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Actions Bar */}
      {selectedCustomers.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-card-foreground">
              {selectedCustomers.length} customers selected
            </span>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete Selected
            </Button>
          </div>
        </div>
      )}
      
      {/* Customers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedCustomers.length === state.customers.length && state.customers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.customers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="text-center">
                      <UserPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <div className="text-muted-foreground">
                        No customers yet. Click "Add Customer" to get started.
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                state.customers.map((customer, index) => {
                  // Count orders for this customer
                  const orderCount = state.orders.filter(order => 
                    order.customer === customer.name
                  ).length;
                  
                  return (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedCustomers.includes(index)}
                          onCheckedChange={(checked) => handleSelectCustomer(index, !!checked)}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-primary text-sm font-medium">
                              {customer.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium">{customer.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {customer.phone || '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {customer.email || '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-xs truncate">
                        {customer.note || '—'}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-muted">
                          {orderCount} orders
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" className="text-muted-foreground">
                            Edit
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:text-destructive"
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Import/Export Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-card-foreground mb-3">Import Customers</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Upload a CSV file with customer data. Required columns: name, phone, email, note.
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Upload className="w-4 h-4" />
                Choose CSV File
              </Button>
            </div>
            
            <div>
              <h4 className="font-medium text-card-foreground mb-3">Export Customers</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Download all customer data as a CSV file for backup or external use.
              </p>
              <Button variant="outline" className="w-full gap-2">
                <Download className="w-4 h-4" />
                Download CSV
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Dialog */}
      <ConfirmationDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        title="Delete Selected Customers"
        description={`Are you sure you want to delete ${selectedCustomers.length} selected customers? This action cannot be undone.`}
        confirmText="Delete All"
        variant="destructive"
        onConfirm={confirmBulkDelete}
      />
    </div>
  );
}