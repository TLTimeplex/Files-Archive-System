import { Variant } from "react-bootstrap/esm/types";

export const AddAlert = (message : string, variant : Variant, timeout : number = 2000 ) => {
  const alert_root = document.getElementById("alert-root") as HTMLDivElement;
  const alert = document.createElement("div") as HTMLDivElement;
  alert.className = `fade alert alert-${variant} show`;
  alert.setAttribute("role", "alert");
  alert.innerHTML = message;
  alert_root.appendChild(alert);
  setTimeout(() => {
    alert.className = `fade alert alert-${variant}`;
    setTimeout(() => {
      alert_root.removeChild(alert);
    }, 300);
  }, timeout);
};

export default AddAlert;