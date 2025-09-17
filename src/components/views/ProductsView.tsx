import React, { useState } from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmationDialog, InputDialog } from '@/components/ui/confirmation-dialog';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
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
  const { toast } = useToast();
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  
  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [deleteIndex, setDeleteIndex] = useState(-1);
  
  // Form states
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    sku: '',
    category: '',
    stock: ''
  });
  
  const handleAddProduct = () => {
    setProductForm({
      name: '',
      price: '',
      sku: '',
      category: '',
      stock: ''
    });
    setShowAddDialog(true);
  };
  
  const confirmAddProduct = () => {
    if (!productForm.name.trim()) {
      toast({
        title: "Error",
        description: "Product name is required",
        variant: "destructive"
      });
      return;
    }
    
    const newProduct = {
      id: 'product_' + Date.now(),
      name: productForm.name,
      price: parseInt(productForm.price) || 0,
      sku: productForm.sku || 'SKU-' + Date.now(),
      category: productForm.category || 'General',
      image: '',
      stock: parseInt(productForm.stock) || 100
    };
    
    dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
    setShowAddDialog(false);
    toast({
      title: "Success",
      description: "Product added successfully",
    });
  };
  
  const handleEditProduct = (index: number) => {
    const product = state.products[index];
    setProductForm({
      name: product.name,
      price: product.price.toString(),
      sku: product.sku,
      category: product.category,
      stock: product.stock.toString()
    });
    setEditIndex(index);
    setShowEditDialog(true);
  };
  
  const confirmEditProduct = () => {
    if (!productForm.name.trim()) {
      toast({
        title: "Error",
        description: "Product name is required",
        variant: "destructive"
      });
      return;
    }
    
    const product = state.products[editIndex];
    const updatedProduct = {
      ...product,
      name: productForm.name,
      price: parseInt(productForm.price) || 0,
      sku: productForm.sku,
      category: productForm.category,
      stock: parseInt(productForm.stock) || 0
    };
    
    dispatch({ type: 'UPDATE_PRODUCT', payload: { index: editIndex, product: updatedProduct } });
    setShowEditDialog(false);
    toast({
      title: "Success",
      description: "Product updated successfully",
    });
  };
  
  const handleImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const updatedProduct = {
        ...state.products[index],
        image: e.target?.result as string
      };
      
      dispatch({ type: 'UPDATE_PRODUCT', payload: { index, product: updatedProduct } });
    };
    reader.readAsDataURL(file);
  };
  
  const handleDeleteProduct = (index: number) => {
    setDeleteIndex(index);
    setShowDeleteDialog(true);
  };
  
  const confirmDeleteProduct = () => {
    dispatch({ type: 'DELETE_PRODUCT', payload: deleteIndex });
    setShowDeleteDialog(false);
    toast({
      title: "Success",
      description: "Product deleted successfully",
    });
  };
  
  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast({
          title: "Import Error",
          description: "CSV file must have at least a header and one data row.",
          variant: "destructive"
        });
        return;
      }
      
      // Skip header line
      const dataLines = lines.slice(1);
      
      dataLines.forEach((line, index) => {
        const [name, price, sku, category, stock] = line.split(',').map(field => 
          field.replace(/^"|"$/g, '').trim()
        );
        
        if (name && price) {
          const newProduct = {
            id: 'imported_' + Date.now() + '_' + index,
            name,
            price: parseInt(price) || 0,
            sku: sku || '',
            category: category || 'Imported',
            image: '',
            stock: parseInt(stock) || 0
          };
          
          dispatch({ type: 'ADD_PRODUCT', payload: newProduct });
        }
      });
      
      toast({
        title: "Import Success",
        description: `Imported ${dataLines.length} products successfully!`,
      });
    };
    
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
  };
  
  const handleBulkDelete = () => {
    if (selectedProducts.length === 0) return;
    setShowBulkDeleteDialog(true);
  };
  
  const confirmBulkDelete = () => {
    // Delete in reverse order to maintain indices
    const sorted = [...selectedProducts].sort((a, b) => b - a);
    sorted.forEach(index => {
      dispatch({ type: 'DELETE_PRODUCT', payload: index });
    });
    
    setSelectedProducts([]);
    setShowBulkDeleteDialog(false);
    toast({
      title: "Success",
      description: `Deleted ${sorted.length} products successfully`,
    });
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
          <label>
            <Button variant="outline" size="sm" className="gap-2" asChild>
              <span>
                <Upload className="w-4 h-4" />
                Import CSV
              </span>
            </Button>
            <input
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
          </label>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => {
            const csvContent = "data:text/csv;charset=utf-8," + 
              encodeURIComponent([
                "Name,Price,SKU,Category,Stock",
                ...state.products.map(p => `${p.name},${p.price},${p.sku},${p.category},${p.stock}`)
              ].join('\n'));
            
            const link = document.createElement('a');
            link.setAttribute('href', csvContent);
            link.setAttribute('download', 'products.csv');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}>
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
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleEditProduct(index)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <label>
                          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                            <span>📷</span>
                          </Button>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(index, e)}
                            className="hidden"
                          />
                        </label>
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
      
      {/* Dialogs */}
      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Delete"
        variant="destructive"
        onConfirm={confirmDeleteProduct}
      />
      
      <ConfirmationDialog
        open={showBulkDeleteDialog}
        onOpenChange={setShowBulkDeleteDialog}
        title="Delete Selected Products"
        description={`Are you sure you want to delete ${selectedProducts.length} selected products? This action cannot be undone.`}
        confirmText="Delete All"
        variant="destructive"
        onConfirm={confirmBulkDelete}
      />
      
      {/* Product Form Dialog */}
      {(showAddDialog || showEditDialog) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background border border-border rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {showAddDialog ? 'Add New Product' : 'Edit Product'}
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Product Name</Label>
                <Input
                  placeholder="Product name"
                  value={productForm.name}
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Price</Label>
                <Input
                  placeholder="Price"
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({...productForm, price: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">SKU</Label>
                <Input
                  placeholder="SKU"
                  value={productForm.sku}
                  onChange={(e) => setProductForm({...productForm, sku: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Category</Label>
                <Input
                  placeholder="Category"
                  value={productForm.category}
                  onChange={(e) => setProductForm({...productForm, category: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Stock</Label>
                <Input
                  placeholder="Stock"
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({...productForm, stock: e.target.value})}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowAddDialog(false);
                  setShowEditDialog(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={showAddDialog ? confirmAddProduct : confirmEditProduct}
              >
                {showAddDialog ? 'Add Product' : 'Update Product'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}