import React, { useState } from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Trash2, Upload, Download, Edit } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

export function ProductsView() {
  const { state, dispatch } = useAppState();
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  
  const handleAddProduct = () => {
    const name = prompt('Product name?', 'New Product');
    if (!name) return;
    
    const price = parseInt(prompt('Price?', '100000') || '0', 10);
    const sku = prompt('SKU?', 'SKU-' + Date.now());
    const category = prompt('Category?', 'General');
    
    const newProduct = {
      id: 'product_' + Date.now(),
      name,
      price,
      sku: sku || '',
      category: category || '',
      image: '',
      stock: 100
    };
    
    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
  };
  
  const handleDeleteProduct = (index: number) => {
    if (confirm('Delete this product?')) {
      dispatch({ type: 'DELETE_PRODUCT', payload: index });
    }
  };
  
  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) return;
    if (!confirm(`Delete ${selectedProducts.length} selected products?`)) return;
    
    // Delete in reverse order to maintain indices
    const sorted = [...selectedProducts].sort((a, b) => b - a);
    sorted.forEach(index => {
      dispatch({ type: 'DELETE_PRODUCT', payload: index });
    });
    
    setSelectedProducts([]);
  };
  
  const handleSelectProduct = (index: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, index]);
    } else {
      setSelectedProducts(selectedProducts.filter(i => i !== index));
    }
  };
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(state.products.map((_, index) => index));
    } else {
      setSelectedProducts([]);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-card-foreground">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
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
          <Button onClick={handleAddProduct} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </div>
      </div>
      
      {/* Actions Bar */}
      {selectedProducts.length > 0 && (
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-card-foreground">
              {selectedProducts.length} products selected
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
      
      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedProducts.length === state.products.length && state.products.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {state.products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-muted-foreground">
                      No products yet. Click "Add Product" to get started.
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                state.products.map((product, index) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedProducts.includes(index)}
                        onCheckedChange={(checked) => handleSelectProduct(index, !!checked)}
                      />
                    </TableCell>
                    <TableCell>
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                          <span className="text-xs text-muted-foreground">No img</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell className="text-muted-foreground">{product.sku}</TableCell>
                    <TableCell className="text-muted-foreground">{product.category}</TableCell>
                    <TableCell>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        product.stock > 10 
                          ? 'bg-success/20 text-success' 
                          : product.stock > 0 
                          ? 'bg-warning/20 text-warning'
                          : 'bg-destructive/20 text-destructive'
                      }`}>
                        {product.stock}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteProduct(index)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      {/* Checkout Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Checkout Channels</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-medium text-card-foreground mb-2">WhatsApp</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Direct checkout via WhatsApp message
              </p>
              <div className="text-xs text-muted-foreground">
                Number: {state.settings.waNumber || 'Not configured'}
              </div>
            </div>
            
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-medium text-card-foreground mb-2">Bank Transfer</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Manual bank transfer payment
              </p>
              <div className="text-xs text-muted-foreground">
                Info: {state.settings.bankInfo ? 'Configured' : 'Not configured'}
              </div>
            </div>
            
            <div className="p-4 border border-border rounded-lg">
              <h4 className="font-medium text-card-foreground mb-2">QRIS</h4>
              <p className="text-sm text-muted-foreground mb-3">
                QR code payment method
              </p>
              <div className="text-xs text-muted-foreground">
                Merchant: {state.settings.qrisId || 'Not configured'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}