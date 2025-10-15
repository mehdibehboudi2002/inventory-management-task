import { useState, useEffect } from "react";
import {
    Container,
    Grid,
    Paper,
    Typography,
    Button,
    Box,
    Alert as MuiAlert,
    Snackbar,
    CircularProgress,
    Chip,
    Card,
    CardContent,
    CardActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Divider,
} from "@mui/material";
import Layout from "@/components/layout/Layout";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Alert } from "@/types/inventory";

const GREEN_MAIN = "#2e7d32";
const RED_CRITICAL = "#d32f2f";
const ORANGE_LOW = "#f57c00";
const BLUE_OVERSTOCKED = "#0288d1";

export default function Alerts() {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("All");
    const [levelFilter, setLevelFilter] = useState("All");
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [notes, setNotes] = useState("");
    const [actionType, setActionType] = useState<"Acknowledged" | "Resolved" | null>(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success" as "success" | "error",
    });

    useEffect(() => {
        // Cleanup scroll lock on unmount
        return () => {
            document.body.classList.remove("modal-scroll-lock");
        };
    }, []);

    useEffect(() => {
        fetchAlerts();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [alerts, statusFilter, levelFilter]);

    const fetchAlerts = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/alerts");
            const data = await response.json();
            setAlerts(data);
        } catch (error) {
            console.error("Error fetching alerts:", error);
            showSnackbar("Failed to load alerts", "error");
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...alerts];

        if (statusFilter !== "All") {
            filtered = filtered.filter((a) => a.status === statusFilter);
        }

        if (levelFilter !== "All") {
            filtered = filtered.filter((a) => a.level === levelFilter);
        }

        // Sort: Critical first, then Low, then Overstocked
        filtered.sort((a, b) => {
            const order = { Critical: 1, Low: 2, Overstocked: 3 };
            return order[a.level] - order[b.level];
        });

        setFilteredAlerts(filtered);
    };

    const showSnackbar = (message: string, severity: "success" | "error") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleOpenDialog = (alert: Alert, action: "Acknowledged" | "Resolved") => {
        setSelectedAlert(alert);
        setActionType(action);
        setNotes("");
        setDialogOpen(true);
        // Lock scroll with your tested class
        document.body.classList.add("modal-scroll-lock");
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedAlert(null);
        setActionType(null);
        setNotes("");
        // Unlock scroll
        document.body.classList.remove("modal-scroll-lock");
    };

    const handleUpdateAlert = async () => {
        if (!selectedAlert || !actionType) return;

        try {
            const response = await fetch("/api/alerts/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedAlert.id,
                    status: actionType,
                    notes,
                }),
            });

            if (!response.ok) throw new Error("Failed to update alert");

            showSnackbar(`Alert ${actionType.toLowerCase()} successfully`, "success");
            handleCloseDialog();
            fetchAlerts();
        } catch (error) {
            console.error("Error updating alert:", error);
            showSnackbar("Failed to update alert", "error");
        }
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case "Critical":
                return RED_CRITICAL;
            case "Low":
                return ORANGE_LOW;
            case "Overstocked":
                return BLUE_OVERSTOCKED;
            default:
                return GREEN_MAIN;
        }
    };

    const getLevelIcon = (level: string) => {
        switch (level) {
            case "Critical":
                return <ErrorIcon sx={{ color: RED_CRITICAL }} />;
            case "Low":
                return <WarningIcon sx={{ color: ORANGE_LOW }} />;
            case "Overstocked":
                return <TrendingUpIcon sx={{ color: BLUE_OVERSTOCKED }} />;
            default:
                return <CheckCircleIcon sx={{ color: GREEN_MAIN }} />;
        }
    };

    const getStatusChipColor = (status: string) => {
        switch (status) {
            case "Open":
                return "error";
            case "Acknowledged":
                return "warning";
            case "Resolved":
                return "success";
            default:
                return "default";
        }
    };

    const criticalCount = alerts.filter((a) => a.level === "Critical" && a.status === "Open").length;
    const lowCount = alerts.filter((a) => a.level === "Low" && a.status === "Open").length;
    const overstockedCount = alerts.filter((a) => a.level === "Overstocked" && a.status === "Open").length;

    if (loading) {
        return (
            <Layout>
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
                    <CircularProgress />
                </Box>
            </Layout>
        );
    }

    return (
        <Layout>
            <Container maxWidth="xl" sx={{ mt: 3, mb: 4 }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        color: GREEN_MAIN,
                        fontWeight: 600,
                        mb: 3,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <NotificationsActiveIcon sx={{ fontSize: 35 }} />
                    Stock Alerts
                </Typography>

                {/* Summary Cards */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ background: `linear-gradient(135deg, ${RED_CRITICAL} 0%, #e57373 100%)`, color: "white" }}>
                            <CardContent>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Box>
                                        <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                            {criticalCount}
                                        </Typography>
                                        <Typography variant="body2">Critical Alerts</Typography>
                                    </Box>
                                    <ErrorIcon sx={{ fontSize: 50, opacity: 0.8 }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ background: `linear-gradient(135deg, ${ORANGE_LOW} 0%, #ffb74d 100%)`, color: "white" }}>
                            <CardContent>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Box>
                                        <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                            {lowCount}
                                        </Typography>
                                        <Typography variant="body2">Low Stock Alerts</Typography>
                                    </Box>
                                    <WarningIcon sx={{ fontSize: 50, opacity: 0.8 }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card sx={{ background: `linear-gradient(135deg, ${BLUE_OVERSTOCKED} 0%, #4fc3f7 100%)`, color: "white" }}>
                            <CardContent>
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <Box>
                                        <Typography variant="h3" sx={{ fontWeight: 700 }}>
                                            {overstockedCount}
                                        </Typography>
                                        <Typography variant="body2">Overstocked Items</Typography>
                                    </Box>
                                    <TrendingUpIcon sx={{ fontSize: 50, opacity: 0.8 }} />
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Filters */}
                <Paper sx={{ p: 2, mb: 3, borderRadius: "20px" }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12} sm={6} md={3}>
                            <div className="form-group">
                                <select
                                    name="statusFilter"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="All">All Status</option>
                                    <option value="Open">Open</option>
                                    <option value="Acknowledged">Acknowledged</option>
                                    <option value="Resolved">Resolved</option>
                                </select>
                                <label className="form-label">Filter by Status</label>
                            </div>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3}>
                            <div className="form-group">
                                <select
                                    name="levelFilter"
                                    value={levelFilter}
                                    onChange={(e) => setLevelFilter(e.target.value)}
                                    className="form-select"
                                >
                                    <option value="All">All Levels</option>
                                    <option value="Critical">Critical</option>
                                    <option value="Low">Low</option>
                                    <option value="Overstocked">Overstocked</option>
                                </select>
                                <label className="form-label">Filter by Level</label>
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6}>
                            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setStatusFilter("All");
                                        setLevelFilter("All");
                                    }}
                                    sx={{ borderRadius: "10px" }}
                                >
                                    Reset Filters
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={fetchAlerts}
                                    sx={{ borderRadius: "10px", bgcolor: GREEN_MAIN }}
                                >
                                    Refresh
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Paper>

                {/* Alerts List */}
                {filteredAlerts.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: "center", borderRadius: "20px" }}>
                        <CheckCircleIcon sx={{ fontSize: 60, color: GREEN_MAIN, mb: 2 }} />
                        <Typography variant="h6" color="textSecondary">
                            No alerts found. All inventory levels are optimal!
                        </Typography>
                    </Paper>
                ) : (
                    <Grid container spacing={2}>
                        {filteredAlerts.map((alert) => (
                            <Grid item xs={12} key={alert.id}>
                                <Card
                                    sx={{
                                        borderLeft: `6px solid ${getLevelColor(alert.level)}`,
                                        borderRadius: "20px",
                                        transition: "all 0.3s",
                                        "&:hover": {
                                            boxShadow: 6,
                                            transform: "translateY(-2px)",
                                        },
                                    }}
                                >
                                    <CardContent>
                                        <Grid container spacing={2} alignItems="center">
                                            {/* Alert Icon & Level */}
                                            <Grid item xs={12} sm={1}>
                                                <Box sx={{ display: "flex", justifyContent: "center" }}>
                                                    {getLevelIcon(alert.level)}
                                                </Box>
                                            </Grid>

                                            {/* Product Info */}
                                            <Grid item xs={12} sm={3}>
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                    {alert.productName}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary">
                                                    SKU: {alert.productSku}
                                                </Typography>
                                            </Grid>

                                            {/* Stock Info */}
                                            <Grid item xs={6} sm={2}>
                                                <Typography variant="caption" color="textSecondary" display="block">
                                                    Current Stock
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    {alert.totalStock.toLocaleString()}
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={6} sm={2}>
                                                <Typography variant="caption" color="textSecondary" display="block">
                                                    Reorder Point
                                                </Typography>
                                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                    {alert.reorderPoint.toLocaleString()}
                                                </Typography>
                                            </Grid>

                                            {/* Percentage & Recommendation */}
                                            <Grid item xs={6} sm={2}>
                                                <Chip
                                                    label={`${alert.percentOfReorder}%`}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: getLevelColor(alert.level),
                                                        color: "white",
                                                        fontWeight: 600,
                                                    }}
                                                />
                                                {alert.level !== "Overstocked" && (
                                                    <Typography variant="caption" display="block" sx={{ mt: 0.5 }}>
                                                        Order: {alert.recommendedOrderQuantity}
                                                    </Typography>
                                                )}
                                            </Grid>

                                            {/* Status */}
                                            <Grid item xs={6} sm={2}>
                                                <Chip
                                                    label={alert.status}
                                                    color={getStatusChipColor(alert.status) as any}
                                                    size="small"
                                                    sx={{ fontWeight: 600 }}
                                                />
                                            </Grid>
                                        </Grid>

                                        {/* Warehouse Breakdown */}
                                        {alert.warehouses && alert.warehouses.length > 0 && (
                                            <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #eee" }}>
                                                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                                                    Warehouse Distribution:
                                                </Typography>
                                                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                                                    {alert.warehouses.map((wh) => (
                                                        <Chip
                                                            key={wh.id}
                                                            label={`${wh.name}: ${wh.stock}`}
                                                            size="small"
                                                            variant="outlined"
                                                        />
                                                    ))}
                                                </Box>
                                            </Box>
                                        )}

                                        {/* Notes */}
                                        {alert.notes && (
                                            <Box sx={{ mt: 2, p: 1.5, bgcolor: "#f5f5f5", borderRadius: "10px" }}>
                                                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 600 }}>
                                                    Notes:
                                                </Typography>
                                                <Typography variant="body2">{alert.notes}</Typography>
                                            </Box>
                                        )}
                                    </CardContent>

                                    {/* Actions */}
                                    {alert.status === "Open" && (
                                        <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleOpenDialog(alert, "Acknowledged")}
                                                sx={{ borderRadius: "8px" }}
                                            >
                                                Acknowledge
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                onClick={() => handleOpenDialog(alert, "Resolved")}
                                                sx={{ borderRadius: "8px", bgcolor: GREEN_MAIN }}
                                            >
                                                Mark Resolved
                                            </Button>
                                        </CardActions>
                                    )}

                                    {alert.status === "Acknowledged" && (
                                        <CardActions sx={{ justifyContent: "flex-end", px: 2, pb: 2 }}>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                onClick={() => handleOpenDialog(alert, "Resolved")}
                                                sx={{ borderRadius: "8px", bgcolor: GREEN_MAIN }}
                                            >
                                                Mark Resolved
                                            </Button>
                                        </CardActions>
                                    )}
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                )}
            </Container>

            {/* Custom Action Modal */}
            {dialogOpen && (
                <>
                    {/* Backdrop */}
                    <Box
                        onClick={handleCloseDialog}
                        sx={{
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: "rgba(0, 0, 0, 0.5)",
                            zIndex: 1300,
                            animation: "fadeIn 0.2s ease-in-out",
                            "@keyframes fadeIn": {
                                from: { opacity: 0 },
                                to: { opacity: 1 },
                            },
                        }}
                    />

                    {/* Modal */}
                    <Box
                        sx={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            bgcolor: "white",
                            borderRadius: "20px",
                            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
                            zIndex: 1301,
                            width: { xs: "90%", sm: "500px" },
                            maxWidth: "95vw",
                            maxHeight: "90vh",
                            overflow: "auto",
                            animation: "slideIn 0.3s ease-out",
                            "@keyframes slideIn": {
                                from: {
                                    opacity: 0,
                                    transform: "translate(-50%, -45%)"
                                },
                                to: {
                                    opacity: 1,
                                    transform: "translate(-50%, -50%)"
                                },
                            },
                        }}
                    >
                        {/* Modal Header */}
                        <Box
                            sx={{
                                p: 3,
                                pb: 2,
                                borderBottom: "1px solid #eee",
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 600, color: GREEN_MAIN }}
                            >
                                {actionType === "Acknowledged" ? "Acknowledge Alert" : "Resolve Alert"}
                            </Typography>
                        </Box>

                        {/* Modal Content */}
                        <Box sx={{ p: 3 }}>
                            <Box
                                sx={{
                                    p: 2,
                                    bgcolor: "#f5f5f5",
                                    borderRadius: "10px",
                                    mb: 3,
                                }}
                            >
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                    {selectedAlert?.productName}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    SKU: {selectedAlert?.productSku}
                                </Typography>
                            </Box>

                            {/* Custom Textarea */}
                            <Box sx={{ mb: 2 }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        display: "block",
                                        mb: 1,
                                        fontWeight: 600,
                                        color: "text.secondary",
                                    }}
                                >
                                    Notes (Optional)
                                </Typography>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Add any notes about this action..."
                                    style={{
                                        width: "100%",
                                        minHeight: "100px",
                                        padding: "12px",
                                        borderRadius: "10px",
                                        border: "1px solid #ddd",
                                        fontSize: "14px",
                                        fontFamily: "inherit",
                                        resize: "vertical",
                                        outline: "none",
                                        transition: "border-color 0.2s",
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = GREEN_MAIN;
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "#ddd";
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Modal Actions */}
                        <Box
                            sx={{
                                p: 3,
                                pt: 2,
                                borderTop: "1px solid #eee",
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 2,
                            }}
                        >
                            <Button
                                onClick={handleCloseDialog}
                                variant="outlined"
                                sx={{
                                    borderRadius: "10px",
                                    textTransform: "none",
                                    px: 3,
                                    borderColor: "#ddd",
                                    color: "text.secondary",
                                    "&:hover": {
                                        borderColor: "#aaa",
                                        bgcolor: "transparent",
                                    },
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleUpdateAlert}
                                variant="contained"
                                sx={{
                                    borderRadius: "10px",
                                    textTransform: "none",
                                    px: 3,
                                    bgcolor: GREEN_MAIN,
                                    "&:hover": {
                                        bgcolor: "#1b5e20",
                                    },
                                }}
                            >
                                Confirm
                            </Button>
                        </Box>
                    </Box>
                </>
            )}

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MuiAlert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
                    {snackbar.message}
                </MuiAlert>
            </Snackbar>
        </Layout>
    );
}