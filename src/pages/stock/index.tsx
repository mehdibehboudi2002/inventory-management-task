import { useState, useEffect, ReactNode } from "react";
import {
  Container,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper, 
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Layout from "@/components/layout/Layout"; 
import ListTable from "@/components/ui/ListTable"; 
import { DataTableColumn, StockItem, Product, Warehouse } from "@/types/inventory"; 
import InventoryListHeader from "@/components/inventory/InventoryListHeader"; 
import { fetchProductsList, fetchWarehousesList, fetchStockList, deleteStockItem } from "@/api/dataService";

const CustomLink = ({ href, children, ...props }: { href: string, children: ReactNode, [key: string]: any }) => (
  <a href={href} onClick={(e) => { e.preventDefault(); window.location.href = href; }} {...props}>
    {children}
  </a>
);

export default function Stock() {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedStockId, setSelectedStockId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Use service layer to fetch all dependencies 
      const [stockData, productsData, warehousesData] = await Promise.all([
        fetchStockList(),
        fetchProductsList(),
        fetchWarehousesList(),
      ]);

      setStock(stockData);
      setProducts(productsData);
      setWarehouses(warehousesData);
    } catch (error) {
      console.error("Error fetching inventory data for Stock page:", error);
      setStock([]);
      setProducts([]);
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions with explicit string argument and return types
  const getProductName = (productId: string | number): string => {
    const product = products.find((p) => String(p.id) === String(productId));
    return product ? `${product.name} (${product.sku})` : "Unknown Product";
  };

  const getWarehouseName = (warehouseId: string | number): string => {
    const warehouse = warehouses.find((w) => String(w.id) === String(warehouseId));
    return warehouse ? `${warehouse.name} (${warehouse.code})` : "Unknown Warehouse";
  };

  // Handler functions with explicit types
  const handleClickOpen = (id: string | number) => {
    setSelectedStockId(String(id));
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedStockId(null);
  };

  const handleDelete = async () => {
    if (!selectedStockId) return;

    try {
      // Use service layer function to delete the stock item
      await deleteStockItem(selectedStockId);
      
      // Remove the deleted item from the list
      setStock(stock.filter((item) => String(item.id) !== selectedStockId));
      
      handleClose();
      console.log(`Stock record ${selectedStockId} deleted successfully.`);

    } catch (error) {
      console.error("Error deleting stock:", error);
    }
  };

  // Define the columns for the ListTable 
  const columns: DataTableColumn<StockItem>[] = [
    { 
      id: "productId", 
      label: "Product", 
      minWidth: 200,
      render: (row) => getProductName(row.productId) 
    },
    { 
      id: "warehouseId", 
      label: "Warehouse", 
      minWidth: 150,
      render: (row) => getWarehouseName(row.warehouseId) 
    },
    {
      id: "quantity",
      label: "Quantity",
      align: "right",
      render: (row) => row.quantity?.toLocaleString() ?? 'N/A',
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
            href={`/stock/edit/${row.id}`}
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
          
          <InventoryListHeader
            title="Stock Levels"
            actionButtonText="Add Stock Record"
            actionHref="/stock/add"
            CustomLinkComponent={CustomLink}
          />

          <ListTable<StockItem> 
            data={stock}
            columns={columns}
            loading={loading}
            emptyMessage="No stock records available. Add a new stock record to get started."
            sx={{ p: { xs: 1, sm: 3 }, pt: 0 }} 
          />
        </Paper>
        
        {/* Delete Confirmation Dialog */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Delete Stock Record</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this stock record? This action cannot be undone.
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