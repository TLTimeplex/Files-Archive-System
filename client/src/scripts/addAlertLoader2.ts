import { Variant } from "react-bootstrap/esm/types";

export const AddAlertLoader2 = (
  message: string,
  variant: Variant,
  cancel: Promise<void>,
  messageSuc: string,
  variantSuc: Variant,
  messageErr: string,
  variantErr: Variant,
  timeout: number = 2000
): void => {
  const spinner = document.createElement("div") as HTMLDivElement;
  spinner.className = "spinner-border text-primary";

  const text = document.createElement("span") as HTMLParagraphElement;
  text.style.marginLeft = "10px";
  text.innerHTML = message;

  const alert = document.createElement("div") as HTMLDivElement;
  alert.appendChild(spinner);
  alert.appendChild(text);

  alert.className = `fade alert alert-${variant} show`;
  alert.setAttribute("role", "alert");

  alert.style.display = "flex";
  alert.style.alignItems = "center";

  const alert_root = document.getElementById("alert-root") as HTMLDivElement;
  alert_root.appendChild(alert);

  cancel.then(() => {
    text.innerHTML = messageSuc;
    alert.className = `fade alert alert-${variantSuc} show`;
  }).catch(() => {
    text.innerHTML = messageErr;
    alert.className = `fade alert alert-${variantErr} show`;
  }).finally(() => {
    alert.removeChild(spinner);
    text.style.marginLeft = "";
    setTimeout(() => {
      alert.className = alert.className.replace("show", "");
      setTimeout(() => {
        alert_root.removeChild(alert);
      }, 300);
    }, timeout);
  });
};

export default AddAlertLoader2;