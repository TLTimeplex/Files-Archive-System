import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import "./style.css";
import AddAlert from '../../../scripts/addAlert';
import { useParams } from 'react-router-dom';

export const WriteNew = () => {

  const { title } = useParams();

  useEffect(() => {
    const form   = document.getElementById("new-form")   as HTMLFormElement;
    const save   = document.getElementById("new-save")   as HTMLButtonElement;
    const upload = document.getElementById("new-upload") as HTMLButtonElement;
    
    const titleF  = () => (document.getElementById("title")  as HTMLInputElement).value;
    const reportF = () => (document.getElementById("report") as HTMLTextAreaElement).value;

    if(title) (document.getElementById("title")  as HTMLInputElement).value = title;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    save.addEventListener("click", (event) => {
      if(!titleF()) return;

      let titleValue  = titleF().toLowerCase();
      let reportValue = reportF();

      let localStorageKeys = localStorage.getItem("files") as string | null;
      console.log(localStorageKeys);
      if(!localStorageKeys || localStorageKeys === '') {
        localStorageKeys = JSON.stringify([titleValue]);
        console.log(localStorageKeys);
      }else {
        let keyArray = JSON.parse(localStorageKeys) as Array<string>;
        console.log(keyArray);
        if(keyArray.includes(titleValue)) {
          AddAlert("Can't save! Titel already exists!", "warning");
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
      AddAlert("You need to save the file first before uploading it.", "danger");
    });

  }, [title]);

    return (
      <form id="new-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input type="text" className="form-control" id="title" placeholder="Title"  required></input>
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