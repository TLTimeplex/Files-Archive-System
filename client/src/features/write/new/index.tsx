import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import "./style.css";
import AddAlert from '../../../scripts/addAlert';
import { useParams } from 'react-router-dom';
import FAS_File from '../../../types/file';

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

      let fileKey  = titleF().toLowerCase();

      let localStorageKeys = localStorage.getItem("files") as string | null;
      console.log(localStorageKeys);
      if(!localStorageKeys || localStorageKeys === '') {
        localStorageKeys = JSON.stringify([fileKey]);
        console.log(localStorageKeys);
      }else {
        let keyArray = JSON.parse(localStorageKeys) as Array<string>;
        console.log(keyArray);
        if(keyArray.includes(fileKey)) {
          AddAlert("Can't save! Titel already exists!", "warning");
          return;
        }
        keyArray.push(fileKey);
        console.log(keyArray);
        localStorageKeys = JSON.stringify(keyArray);
      }

      let data : FAS_File;
      data = {
        title: titleF(),
        content: reportF(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      localStorage.setItem("files", localStorageKeys);
      localStorage.setItem("file-" + fileKey, JSON.stringify(data));

      window.location.href = "/write/edit/" + fileKey;
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