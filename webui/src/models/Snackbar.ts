declare type Snackbar = {
  messageType: "default" | "error" | "success" | "warning" | "info" | undefined,
  messageText: string,
  key: number,
}
export default Snackbar;
