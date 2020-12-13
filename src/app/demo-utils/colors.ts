export const colors: any = {

  primary: {
    primary: "#007bff",
    // secondary: "#007bff"
    secondary: "#69a9ff"
  },
  secondary: {
    primary: "#6c757d",
    // secondary: "#6c757d"
    secondary: "#9aa4ac"
  }, 
  success: {
    primary: "#28a745", 
    // secondary: "#28a745"
    secondary: "#64da73"
  }, 
  danger: {
    primary: "#dc3545", 
    secondary: "#ff6b70"
  }, 
  warning: {
    primary: "#ffc107", 
    secondary: "#fff350"
  }, 
  info: {
    primary: "#17a2b8", 
    secondary: "#60d4ea"
  }, 
  light: {
    primary: "#f8f9fa", 
    secondary: "#ffffff"
  }, 
  dark: {
    primary: "#343a40",
    secondary: "#5e646b"}
  };

  export interface EventColor {
    primary: string;
secondary: string;
}

export const metaTypes = [
  'primary',
  'secondary', 
  'success',
  'danger',
  'warning',
  'info', 
  'light', 
  'dark'
]