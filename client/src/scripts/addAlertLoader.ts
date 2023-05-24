import { Variant } from "react-bootstrap/esm/types";

export const AddAlertLoader = (message: string, variant: Variant, cancel: Promise<void>): void => {
  const alert_root = document.getElementById("alert-root") as HTMLDivElement;
  const alert = document.createElement("div") as HTMLDivElement;
  const spinner = document.createElement("div") as HTMLDivElement;
  const text = document.createElement("span") as HTMLParagraphElement;
  text.style.marginLeft = "10px";
  text.innerHTML = message;
  spinner.className = "spinner-border text-primary";
  alert.appendChild(spinner);
  alert.appendChild(text);
  alert.className = `fade alert alert-${variant} show`;
  alert.setAttribute("role", "alert");
  alert_root.appendChild(alert);
  alert.style.display = "flex";
  alert.style.alignItems = "center";
  cancel.then(() => {
    alert.className = `fade alert alert-${variant}`;
    setTimeout(() => {
      alert_root.removeChild(alert);
    }, 300);
  }).catch(() => {
    alert_root.removeChild(alert);
  });
};

export default AddAlertLoader;