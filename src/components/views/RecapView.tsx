import React, { useRef, useEffect } from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, DollarSign, ShoppingCart, Calendar, Users } from 'lucide-react';

export function RecapView() {
  const { state } = useAppState();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Calculate statistics
  const totalRevenue = state.orders
    .filter(order => order.status === 'Paid')
    .reduce((sum, order) => sum + order.total, 0);
  
  const totalOrders = state.orders.length;
  const paidOrders = state.orders.filter(order => order.status === 'Paid').length;
  const pendingOrders = state.orders.filter(order => order.status === 'Pending').length;
  
  const totalProducts = state.products.length;
  const totalCustomers = state.customers.length;
  
  // Calculate monthly revenue
  const monthlyData = React.useMemo(() => {
    const grouped: { [key: string]: number } = {};
    
    state.orders.forEach(order => {
      if (order.status === 'Paid') {
        const date = new Date(order.date);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        grouped[key] = (grouped[key] || 0) + order.total;
      }
    });
    
    const sorted = Object.keys(grouped).sort();
    const last6Months = sorted.slice(-6);
    
    return last6Months.map(key => ({
      month: key,
      revenue: grouped[key]
    }));
  }, [state.orders]);
  
  // Draw chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || monthlyData.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Chart dimensions
    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    
    // Get max value for scaling
    const maxRevenue = Math.max(...monthlyData.map(d => d.revenue), 1);
    
    // Set styles
    const primaryColor = 'hsl(227, 78%, 65%)'; // Primary blue
    const textColor = 'hsl(225, 50%, 95%)'; // Light text
    const gridColor = 'hsl(225, 25%, 25%)'; // Grid lines
    
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    
    // Draw grid
    for (let i = 0; i <= 5; i++) {
      const y = padding + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(padding + chartWidth, y);
      ctx.stroke();
    }
    
    // Draw axes
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.moveTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();
    
    // Draw bars
    if (monthlyData.length > 0) {
      const barWidth = chartWidth / (monthlyData.length * 1.5);
      const barGap = barWidth * 0.5;
      
      ctx.fillStyle = primaryColor;
      
      monthlyData.forEach((data, index) => {
        const barHeight = (data.revenue / maxRevenue) * (chartHeight - 20);
        const x = padding + index * (barWidth + barGap) + barGap;
        const y = padding + chartHeight - barHeight;
        
        // Draw bar
        ctx.fillRect(x, y, barWidth, barHeight);
        
        // Draw month label
        ctx.fillStyle = textColor;
        ctx.font = '12px Inter, system-ui';
        ctx.textAlign = 'center';
        ctx.fillText(
          data.month,
          x + barWidth / 2,
          padding + chartHeight + 20
        );
        
        // Draw value label
        ctx.fillText(
          formatCurrency(data.revenue).replace('Rp', 'Rp '),
          x + barWidth / 2,
          y - 10
        );
        
        ctx.fillStyle = primaryColor;
      });
    }
  }, [monthlyData]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const averageOrderValue = paidOrders > 0 ? totalRevenue / paidOrders : 0;
  const conversionRate = totalOrders > 0 ? Math.round((paidOrders / totalOrders) * 100) : 0;
  
  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-card-foreground">Analytics & Recap</h1>
          <p className="text-muted-foreground">Track your business performance and sales</p>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-success">{formatCurrency(totalRevenue)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-primary">{totalOrders}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Products</p>
                <p className="text-2xl font-bold text-card-foreground">{totalProducts}</p>
              </div>
              <div className="w-8 h-8 bg-card-foreground/10 rounded-lg flex items-center justify-center">
                <span className="text-card-foreground font-bold">📦</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Customers</p>
                <p className="text-2xl font-bold text-card-foreground">{totalCustomers}</p>
              </div>
              <Users className="w-8 h-8 text-card-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Paid Orders</p>
                <p className="text-2xl font-bold text-success">{paidOrders}</p>
              </div>
              <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                <span className="text-success font-bold">✓</span>
              </div>
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
                <span className="text-warning font-bold">⏳</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Conversion Rate</p>
                <p className="text-2xl font-bold text-primary">{conversionRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Monthly Sales Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          {monthlyData.length > 0 ? (
            <div className="w-full">
              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="w-full max-w-full h-auto bg-canvas rounded-lg"
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-card-foreground mb-2">No sales data yet</h3>
              <p className="text-muted-foreground">
                Revenue chart will appear here once you have paid orders.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Average Order Value</span>
              <span className="font-medium text-card-foreground">
                {formatCurrency(averageOrderValue)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Orders per Customer</span>
              <span className="font-medium text-card-foreground">
                {totalCustomers > 0 ? (totalOrders / totalCustomers).toFixed(1) : '0'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Revenue per Customer</span>
              <span className="font-medium text-card-foreground">
                {formatCurrency(totalCustomers > 0 ? totalRevenue / totalCustomers : 0)}
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {state.orders.length === 0 ? (
              <div className="text-center py-6">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-3">
                {state.orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">{order.customer}</p>
                      <p className="text-xs text-muted-foreground">{order.product}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-card-foreground">
                        {formatCurrency(order.total)}
                      </p>
                      <p className={`text-xs ${
                        order.status === 'Paid' ? 'text-success' : 
                        order.status === 'Pending' ? 'text-warning' : 'text-destructive'
                      }`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}