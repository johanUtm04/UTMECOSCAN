export interface SnackbarState  {
open: boolean;
message: string;
severity: 'error' | 'info' | 'success' | 'warning';
customColor?: string; 
};