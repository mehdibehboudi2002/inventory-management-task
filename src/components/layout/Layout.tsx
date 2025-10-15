import Link from "next/link";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  BottomNavigation,
  BottomNavigationAction,
} from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import BarChartIcon from "@mui/icons-material/BarChart";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import IconButton from "@mui/material/IconButton";
import { useThemeMode } from "@/contexts/ThemeContext";

interface MenuItem {
  label: string;
  href: string;
  icon: any;
}

const menuItems: MenuItem[] = [
  { label: "Dashboard", href: "/", icon: DashboardIcon },
  { label: "Products", href: "/products", icon: CategoryIcon },
  { label: "Warehouses", href: "/warehouses", icon: WarehouseIcon },
  { label: "Transfers", href: "/transfers", icon: SyncAltIcon },
  { label: "Stock Levels", href: "/stock", icon: BarChartIcon },
  { label: "Alerts", href: "/alerts", icon: BarChartIcon }, // 👈 Desktop only
];

const GREEN_MAIN = "#2e7d32";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { isDark, toggleTheme } = useThemeMode();

  // Determine active path
  const activePath =
    menuItems.find(
      (item) => router.pathname.startsWith(item.href) && item.href !== "/"
    )?.href || (router.pathname === "/" ? "/" : "");

  return (
    <>
      {/* Top App Bar */}
      <AppBar position="static" sx={{ bgcolor: GREEN_MAIN }}>
        <Toolbar sx={{ position: "relative" }}>
          <InventoryIcon sx={{ mr: { xs: 1, sm: 2 } }} />

          {/* Brand Name */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontSize: { xs: "0.95rem", sm: "1.1rem", lg: "1.25rem" },
            }}
          >
            <Link href={"/"}>GreenSupply Co</Link>
          </Typography>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            {menuItems.map((item) => (
              <Button
                key={item.href}
                color="inherit"
                component={Link}
                href={item.href}
                sx={{
                  fontWeight:
                    router.pathname.startsWith(item.href) &&
                    item.href !== "/"
                      ? 700
                      : 400,
                  textDecoration:
                    (router.pathname.startsWith(item.href) &&
                      item.href !== "/") ||
                    router.pathname === item.href
                      ? "underline"
                      : "none",
                  textUnderlineOffset: "8px",
                  fontSize: "0.9rem",
                  borderRadius: "10px",
                  "&:hover": {
                    textDecoration:
                      (router.pathname.startsWith(item.href) &&
                        item.href !== "/") ||
                      router.pathname === item.href
                        ? "underline"
                        : "none",
                    backgroundColor:
                      (router.pathname.startsWith(item.href) &&
                        item.href !== "/") ||
                      router.pathname === item.href
                        ? "transparent"
                        : "rgba(255, 255, 255, 0.06)",
                  },
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Spacer for Mobile */}
          <Box sx={{ display: { xs: "block", md: "none" }, width: "48px" }} />

          {/* Theme Toggle Button */}
          <IconButton
            onClick={toggleTheme}
            sx={{
              color: "white",
              transition: "transform 0.3s",
              "&:hover": { transform: "rotate(180deg)" },
              position: { xs: "absolute", md: "static" },
              right: { xs: 8, md: "auto" },
            }}
          >
            {isDark ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        sx={{
          minHeight: "fit-content",
          pb: { xs: "70px", lg: 4 },
        }}
      >
        {children}
      </Box>

      {/* Bottom Navigation (Mobile Only, Alerts Hidden) */}
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <BottomNavigation
          showLabels
          value={activePath}
          onChange={(event, newValue) => {
            router.push(newValue as string);
          }}
          sx={{
            height: 60,
            bgcolor: "white",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {menuItems
            .filter((item) => item.label !== "Alerts") // 👈 Hide Alerts on mobile
            .map((item) => {
              const IconComponent = item.icon;
              const isActive =
                (item.href === "/" && router.pathname === "/") ||
                (item.href !== "/" && router.pathname.startsWith(item.href));
              return (
                <BottomNavigationAction
                  key={item.href}
                  label={item.label}
                  value={item.href}
                  icon={
                    <IconComponent
                      sx={{
                        color: isActive ? GREEN_MAIN : "text.secondary",
                        fontSize: "1.3rem",
                      }}
                    />
                  }
                  sx={{
                    color: isActive ? GREEN_MAIN : "text.secondary",
                    minWidth: "auto",
                    "& .MuiBottomNavigationAction-label": {
                      marginTop: "2px",
                      fontSize: { xs: "0.5rem", sm: "0.8rem" },
                    },
                    "& .MuiBottomNavigationAction-label.Mui-selected": {
                      color: GREEN_MAIN,
                    },
                  }}
                />
              );
            })}
        </BottomNavigation>
      </Box>
    </>
  );
}
