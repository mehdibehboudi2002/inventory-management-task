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
import { DataTableColumn } from "@/types/inventory";
import InventoryListHeader from "@/components/inventory/InventoryListHeader"; 

// Mock implementation of Link behavior for the environment
const CustomLink = ({ href, children, ...props }: { href: string, children: ReactNode, [key: string]: any }) => (
  <a href={href} onClick={(e) => { e.preventDefault(); window.location.href = href; }} {...props}>
    {children}
  </a>
);

// --- Define specific data type for the Warehouse entity ---
interface Warehouse {
  id: string; // T must extend { id: string } for ListTable
  code: string;
  name: string;
  location: string;
}

export default function Warehouses() {
  // State variables with explicit types
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedWarehouseId, setSelectedWarehouseId] = useState<string | null>(null);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    setLoading(true);
    try {
      // Mock API call
      const mockWarehouses: Warehouse[] = [
        { id: 'w1', code: 'HDQ', name: 'Headquarters', location: '123 Main St, Anytown' },
        { id: 'w2', code: 'WD', name: 'West Distribution', location: '456 Industrial Ave, West City' },
        { id: 'w3', code: 'EAST', name: 'Eastern Fulfillment', location: '789 Trade Loop, East Coast' },
      ];
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500)); 
      setWarehouses(mockWarehouses);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      setWarehouses([]);
    } finally {
      setLoading(false);
    }
  };

  // Handler functions with explicit types
  const handleClickOpen = (id: string) => {
    setSelectedWarehouseId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedWarehouseId(null);
  };

  const handleDelete = async () => {
    if (!selectedWarehouseId) return;

    try {
      // Mock delete logic
      setWarehouses(
        warehouses.filter((warehouse) => warehouse.id !== selectedWarehouseId)
      );
      handleClose();
      console.log(`Warehouse ${selectedWarehouseId} deleted.`);

    } catch (error) {
      console.error("Error deleting warehouse:", error);
    }
  };

  // Define the columns for the ListTable
  const columns: DataTableColumn<Warehouse>[] = [
    { 
      id: "code", 
      label: "Code", 
      minWidth: 100,
      render: (row) => row.code 
    },
    { 
      id: "name", 
      label: "Name", 
      minWidth: 150,
      render: (row) => row.name 
    },
    { 
      id: "location", 
      label: "Location", 
      minWidth: 200,
      render: (row) => row.location 
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
            href={`/warehouses/edit/${row.id}`}
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
            title="Warehouses"
            actionButtonText="Add Warehouse"
            actionHref="/warehouses/add"
            CustomLinkComponent={CustomLink}
          />

          {/* ListTable no longer needs title or actionButton props */}
          <ListTable<Warehouse>
            data={warehouses}
            columns={columns}
            loading={loading}
            emptyMessage="No warehouses available. Click 'Add Warehouse' to get started."
            // Table content needs padding/margin inside the Paper
            sx={{ p: { xs: 1, sm: 3 }, pt: 0 }} 
          />
        </Paper>

        {/* Delete Confirmation Dialog (Kept local) */}
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Delete Warehouse</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this warehouse? This action cannot be undone.
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
