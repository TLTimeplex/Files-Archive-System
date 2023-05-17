import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import { Alert } from 'react-bootstrap';

export const WriteNew = () => {

  useEffect(() => {
    const form   = document.getElementById("new-form")   as HTMLFormElement;
    const save   = document.getElementById("new-save")   as HTMLButtonElement;
    const upload = document.getElementById("new-upload") as HTMLButtonElement;
    
    const title  = () => (document.getElementById("title")  as HTMLInputElement)   .value;
    const report = () => (document.getElementById("report") as HTMLTextAreaElement).value;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    save.addEventListener("click", (event) => {
      if(!title()) return;

      let titleValue  = title().toLowerCase();
      let reportValue = report();

      let localStorageKeys = localStorage.getItem("files") as string | null;
      console.log(localStorageKeys);
      if(!localStorageKeys || localStorageKeys === '') {
        localStorageKeys = JSON.stringify([titleValue]);
        console.log(localStorageKeys);
      }else {
        let keyArray = JSON.parse(localStorageKeys) as Array<string>;
        console.log(keyArray);
        if(keyArray.includes(titleValue)) {
          // TODO
          alert("Title already exists");
          return;
        }
        keyArray.push(titleValue);
        console.log(keyArray);
        localStorageKeys = JSON.stringify(keyArray);
      }

      localStorage.setItem("files", localStorageKeys);
      localStorage.setItem("file-" + titleValue, reportValue);

      window.location.href = "/write/edit/" + titleValue;
    });

    upload.addEventListener("click", (event) => {
      const alert_root = document.getElementById("alert-root") as HTMLDivElement;
      const alert = document.createElement("div") as HTMLDivElement;
      alert.className = "fade alert alert-danger show";
      alert.setAttribute("role", "alert");
      alert.innerHTML = "You need to save the file first before uploading it.";
      alert_root.appendChild(alert);
      setTimeout(() => {
        alert.className = "fade alert alert-danger";
        setTimeout(() => {
          alert_root.removeChild(alert);
        }, 300);
      }, 2000);
    });

  }, []);

    return (
      <form id="new-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" className="form-control" id="title" placeholder="Title" required></input>
        </div>
        <div className="form-group">
          <label htmlFor="report">Text</label>
          <textarea className="form-control" id="report" rows={-1}></textarea>
        </div>
        <Button variant="primary" id="new-save" type='submit'>Save</Button>{' '}
        <Button variant="danger" id="new-upload" type='submit'>Upload</Button>
      </form>
    );
};

export default WriteNew;