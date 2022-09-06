import Box from "@mui/material/Box";
import ErrorIcon from "@mui/icons-material/Error";
import "./ErrorAlert.css";

const ErrorAlert = ({ message }) => {
  return (
    <Box className="error-alert">
      <ErrorIcon />
      {message}
    </Box>
  );
};

export default ErrorAlert;
