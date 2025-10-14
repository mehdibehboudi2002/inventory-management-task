import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  CircularProgress,
  useTheme,
  SxProps,
  Theme,
} from "@mui/material";

// Re-using the types definition for DataTableColumn
interface DataTableColumn<T> {
  id: keyof T | 'actions';
  label: string;
  minWidth?: number;
  align?: "right" | "left" | "center";
  render: (row: T) => React.ReactNode;
}

interface ListTableProps<T extends { id: string }> {
  data: T[];
  columns: DataTableColumn<T>[];
  loading: boolean;
  emptyMessage: string;
  sx?: SxProps<Theme>;
}

/**
 * A generic, responsive table component designed for displaying list data.
 * @template T - The type of data object being displayed (must have an 'id').
 */
export default function ListTable<T extends { id: string }>({
  data,
  columns,
  loading,
  emptyMessage,
  sx,
}: ListTableProps<T>) {
  const theme = useTheme();

  // Define responsive font size using breakpoints
  const responsiveFontSize = {
    xs: theme.typography.pxToRem(9.5), 
    sm: theme.typography.pxToRem(10.5), 
    md: theme.typography.pxToRem(12), 
    lg: theme.typography.pxToRem(14),
  };
  
  const responsiveTableStyle = {
    // Allows columns to size based on content
    tableLayout: 'auto', 
    // Forces text to stay on one line
    'th, td': {
        whiteSpace: 'nowrap',
    },
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4, ...sx }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center', ...sx }}>
        <Typography variant="h6" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={sx}> 
      <TableContainer>
        <Table stickyHeader aria-label="data table" sx={responsiveTableStyle}>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={String(column.id)}
                  align={column.align || "left"}
                  style={{ minWidth: column.minWidth || 0 }}
                  sx={{
                    fontWeight: 700,
                    backgroundColor: theme.palette.grey[50],
                    color: theme.palette.text.primary,
                    fontSize: responsiveFontSize,
                    // Cell style includes nowrap from responsiveTableStyle
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                {columns.map((column) => {
                  return (
                    <TableCell 
                      key={String(column.id)} 
                      align={column.align || "left"}
                      sx={{ 
                        py: { xs: 1, sm: 1.5 },
                        fontSize: responsiveFontSize,
                        // Cell style includes nowrap from responsiveTableStyle
                      }} 
                    >
                      {column.render(row)}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
