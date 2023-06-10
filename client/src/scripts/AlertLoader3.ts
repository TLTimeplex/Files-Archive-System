import { Variant } from "react-bootstrap/esm/types";

export class AlertLoader3 {
  private _text: string;
  private _variant: Variant;

  private _isSpinning = true;

  private _textElement = document.createElement("span") as HTMLParagraphElement;
  private _spinnerElement = document.createElement("div") as HTMLDivElement;
  private _alertElement = document.createElement("div") as HTMLDivElement;

  private _alert_root = document.getElementById("alert-root") as HTMLDivElement;

  constructor(text: string, variant: Variant) {
    this._text = text;
    this._variant = variant;

    this._spinnerElement.className = "spinner-border text-primary";

    this._textElement.style.marginLeft = "10px";
    this._textElement.innerHTML = text;

    this._alertElement.className = `fade alert alert-${variant}`;
    this._alertElement.setAttribute("role", "alert");
    this._alertElement.style.display = "flex";
    this._alertElement.style.alignItems = "center";

    this._alertElement.appendChild(this._spinnerElement);
    this._alertElement.appendChild(this._textElement);

    this._alert_root.appendChild(this._alertElement);
  }

  public show() {
    this._alertElement.className = `fade alert alert-${this._variant} show`;
  }

  public hide() {
    this._alertElement.className = `fade alert alert-${this._variant}`;
  }

  public update() {
    this._textElement.innerHTML = this._text;
    if (this._alertElement.className.includes("show")) {
      this._alertElement.className = `fade alert alert-${this._variant} show`;
    } else {
      this._alertElement.className = `fade alert alert-${this._variant}`;
    }
  }

  public startSpinning() {
    if(this._isSpinning) {
      return;
    }
    this._isSpinning = true;
    this._alertElement.innerHTML = "";
    this._alertElement.appendChild(this._spinnerElement);
    this._alertElement.appendChild(this._textElement);
    this._textElement.style.marginLeft = "10px";
  }

  public stopSpinning() {	
    if(!this._isSpinning) {
      return;
    }
    this._isSpinning = false;
    this._alertElement.innerHTML = "";
    this._alertElement.appendChild(this._textElement);
    this._textElement.style.marginLeft = "0px";
  }

  public getAlertElement() {
    return this._alertElement;
  }

  public cancel() {
    this._alert_root.removeChild(this._alertElement);
  }

  public resolve(timeout: number = 2000) {
    this.stopSpinning();
    setTimeout(() => {
      this._alertElement.className = this._alertElement.className.replace("show", "");
      setTimeout(() => {
        this._alert_root.removeChild(this._alertElement);
      }, 300);
    }, timeout);
  }

  public setText(text: string) {
    this._text = text;
  }

  public setVariant(variant: Variant) {
    this._variant = variant;
  }

  public getText() {
    return this._text;
  }

  public getVariant() {
    return this._variant;
  }
}