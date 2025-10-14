import { useState, useEffect } from "react";
import {
  Container,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Paper, 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Layout from "@/components/layout/Layout";
import ListTable from "@/components/ui/ListTable";
import { DataTableColumn, Product } from "@/types/inventory";
import InventoryListHeader from "@/components/inventory/InventoryListHeader";

// Mock implementation of Link behavior for the environment
const CustomLink = ({ href, children, ...props }: { href: string, children: React.ReactNode, [key: string]: any }) => (
  <a href={href} onClick={(e) => { e.preventDefault(); window.location.href = href; }} {...props}>
    {children}
  </a>
);

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Mock API call
      const mockProducts: Product[] = [
        { id: 'p1', sku: 'SKU001', name: 'Organic Coffee Beans', category: 'Groceries', unitCost: 12.50, reorderPoint: 50 },
        { id: 'p2', sku: 'SKU002', name: 'Stainless Steel Water Bottle', category: 'Home Goods', unitCost: 8.00, reorderPoint: 75 },
        { id: 'p3', sku: 'SKU003', name: 'Bamboo Toothbrush Pack', category: 'Personal Care', unitCost: 4.25, reorderPoint: 100 },
        { id: 'p4', sku: 'SKU004', name: 'Recycled Notebook', category: 'Office Supplies', unitCost: 3.50, reorderPoint: 60 },
      ];
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500)); 
      setProducts(mockProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleClickOpen = (id: string) => {
    setSelectedProductId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProductId(null);
  };

  const handleDelete = async () => {
    if (!selectedProductId) return;

    try {
      // Mock delete logic
      setProducts(
        products.filter((product) => product.id !== selectedProductId)
      );
      handleClose();
      console.log(`Product ${selectedProductId} deleted.`);

    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Define the columns for the Products table
  const columns: DataTableColumn<Product>[] = [
    { id: "sku", label: "SKU", render: (row) => row.sku },
    { id: "name", label: "Name", minWidth: 150, render: (row) => row.name },
    { id: "category", label: "Category", render: (row) => row.category },
    {
      id: "unitCost",
      label: "Unit Cost",
      align: "right",
      render: (row) => `$${(row.unitCost ?? 0).toFixed(2)}`,
    },
    {
      id: "reorderPoint",
      label: "Reorder Point",
      align: "right",
      render: (row) => row.reorderPoint,
    },
    {
      id: "actions",
      label: "Actions",
      align: "center",
      minWidth: 100,
      render: (row) => (
        <>
          <IconButton
            color="primary"
            component={CustomLink}
            href={`/products/edit/${row.id}`}
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleClickOpen(row.id)}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Paper elevation={3} sx={{ borderRadius: "20px" }}>
          
          {/* NEW: Use the InventoryListHeader component */}
          <InventoryListHeader
            title="Products"
            actionButtonText="Add Product"
            actionHref="/products/add"
            CustomLinkComponent={CustomLink}
          />

          {/* ListTable no longer needs title or actionButton props */}
          <ListTable<Product>
            data={products}
            columns={columns}
            loading={loading}
            emptyMessage="No products are currently defined."
            // Table content needs padding/margin inside the Paper
            sx={{ p: { xs: 1, sm: 3 }, pt: 0 }} 
          />
        </Paper>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Layout>
  );
}