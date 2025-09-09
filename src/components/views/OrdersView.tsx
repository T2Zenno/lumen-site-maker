import React, { useState } from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Trash2, CheckCircle2, FileText } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export function OrdersView() {
  const { state, dispatch } = useAppState();
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
  
  const handleAddOrder = () => {
    if (state.products.length === 0) {
      alert('Add products first to create orders.');
      return;
    }
    
    const productName = prompt('Product name?', state.products[0]?.name || '');
    const product = state.products.find(p => p.name === productName) || state.products[0];
    
    const qty = parseInt(prompt('Quantity?', '1') || '1', 10);
    const method = prompt('Payment method? (WA/Transfer/QRIS)', 'WA') as any;
    const customer = prompt('Customer name?', 'New Customer') || 'New Customer';
    
    const newOrder = {
      id: 'order_' + Date.now(),
      date: Date.now(),
      customer,
      product: product.name,
      qty,
      total: product.price * qty,
      method,
      status: 'Pending' as const
    };
    
    dispatch({ type: 'ADD_ORDER', payload: newOrder });
  };
  
  const handleMarkAsPaid = (index: number) => {
    const updatedOrder = {
      ...state.orders[index],
      status: 'Paid' as const
    };
    
    dispatch({
      type: 'UPDATE_ORDER',
      payload: { index, order: updatedOrder }
    });
  };
  
  const handleBulkMarkPaid = () => {
    selectedOrders.forEach(index => {
      const updatedOrder = {
        ...state.orders[index],
        status: 'Paid' as const
      };
      
      dispatch({
        type: 'UPDATE_ORDER',
        payload: { index, order: updatedOrder }
      });
    });
    
    setSelectedOrders([]);
  };
  
  const handleSelectOrder = (index: number, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, index]);
    } else {
      setSelectedOrders(selectedOrders.filter(i => i !== index));
    }
  };
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(state.orders.map((_, index) => index));
    } else {
      setSelectedOrders([]);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('id-ID');
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-success/20 text-success';
      case 'Canceled':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-warning/20 text-warning';
    }
  };
  
  // Calculate summary stats
  const totalRevenue = state.orders
    .filter(order => order.status === 'Paid')
    .reduce((sum, order) => sum + order.total, 0);
  
  const pendingOrders = state.orders.filter(order => order.status === 'Pending').length;
  
  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-card-foreground">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders and payments</p>
        </div>
        
        <Button onClick={handleAddOrder} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Order
        </Button>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-card-foreground">{state.orders.length}</p>
              </div>
              <FileText className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Pending Orders</p>
                <p className="text-2xl font-bold text-warning">{pendingOrders}</p>
              </div>
              <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                <span className="text-warning font-bold">!</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-success">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                <span className="text-success font-bold">₿</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Actions Bar */}
      {selectedOrders.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-card-foreground">
              {selectedOrders.length} orders selected
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkMarkPaid}
                className="gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark as Paid
              </Button>
              <Button variant="destructive" size="sm" className="gap-2">
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Order List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedOrders.length === state.orders.length && state.orders.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    <div className="text-muted-foreground">
                      No orders yet. Click "Create Order" to add the first order.
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                state.orders.map((order, index) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedOrders.includes(index)}
                        onCheckedChange={(checked) => handleSelectOrder(index, !!checked)}
                      />
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(order.date)}
                    </TableCell>
                    <TableCell className="font-medium">{order.customer}</TableCell>
                    <TableCell>{order.product}</TableCell>
                    <TableCell>{order.qty}</TableCell>
                    <TableCell className="font-medium">{formatCurrency(order.total)}</TableCell>
                    <TableCell>
                      <span className="inline-flex px-2 py-1 text-xs font-medium rounded-md bg-muted">
                        {order.method}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        {order.status === 'Pending' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleMarkAsPaid(index)}
                            className="gap-2 text-success hover:text-success"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Mark Paid
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Payment Integration Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Integration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-card-foreground mb-3">Supported Methods</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Midtrans</span>
                  <span className="text-xs text-muted-foreground">Not connected</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">Xendit</span>
                  <span className="text-xs text-muted-foreground">Not connected</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium">QRIS</span>
                  <span className="text-xs text-success">
                    {state.settings.qrisId ? 'Connected' : 'Not connected'}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-card-foreground mb-3">Quick Actions</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Configure Midtrans
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Setup Xendit
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Update QRIS Settings
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}