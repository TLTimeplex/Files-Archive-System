import { useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import "./style.css";
import AddAlert from '../../../scripts/addAlert';
import { useParams } from 'react-router-dom';
import FAS_File from '../../../types/file';
import { Card, Container, FloatingLabel, Form } from 'react-bootstrap';

export const WriteNew = () => {

  const { title } = useParams();

  useEffect(() => {
    const form = document.getElementById("new-form") as HTMLFormElement;
    const save = document.getElementById("new-save") as HTMLButtonElement;
    const upload = document.getElementById("new-upload") as HTMLButtonElement;

    const fileUpload = document.getElementById("fileUpload") as HTMLInputElement;

    const titleF = () => (document.getElementById("title") as HTMLInputElement).value;
    const report = document.getElementById("report") as HTMLTextAreaElement;

    if (title) (document.getElementById("title") as HTMLInputElement).value = title;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    save.addEventListener("click", (event) => {
      if (!titleF()) return;

      let fileKey = titleF().toLowerCase();

      let localStorageKeys = localStorage.getItem("files") as string | null;
      console.log(localStorageKeys);
      if (!localStorageKeys || localStorageKeys === '') {
        localStorageKeys = JSON.stringify([fileKey]);
        console.log(localStorageKeys);
      } else {
        let keyArray = JSON.parse(localStorageKeys) as Array<string>;
        console.log(keyArray);
        if (keyArray.includes(fileKey)) {
          AddAlert("Can't save! Titel already exists!", "warning");
          return;
        }
        keyArray.push(fileKey);
        console.log(keyArray);
        localStorageKeys = JSON.stringify(keyArray);
      }

      let data: FAS_File;
      data = {
        title: titleF(),
        content: report.value,
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

    const createCard = (title : string, footer : string, image : File) => {
      const card = document.createElement("div");
      card.classList.add("card");

      const cardHeader = document.createElement("div");
      cardHeader.classList.add("card-header");

      const cardTitle = document.createElement("div");
      cardTitle.classList.add("card-title");
      cardTitle.classList.add("h5");
      cardTitle.innerText = title;

      const cardBody = document.createElement("div");
      cardBody.classList.add("card-body");

      const cardImg = document.createElement("img");
      cardImg.classList.add("card-img");
      cardImg.src = URL.createObjectURL(image);

      const cardFooter = document.createElement("div");
      cardFooter.classList.add("card-footer");

      const cardText = document.createElement("p");
      cardText.classList.add("card-text");
      cardText.innerText = footer;

      cardHeader.appendChild(cardTitle);
      cardBody.appendChild(cardImg);
      cardFooter.appendChild(cardText);

      card.appendChild(cardHeader);
      card.appendChild(cardBody);
      card.appendChild(cardFooter);

      return card;
    }

    fileUpload.addEventListener("change", (event) => {
      const container = document.getElementById("uploaded-files-preview") as HTMLFormElement;
      if (!fileUpload.files) return;
      if (fileUpload.files.length === 0) return;
      for (let i = 0; i < fileUpload.files.length; i++) {
        const file = fileUpload.files[i];
        if (!file) continue;
        const reader = new FileReader();
        reader.onload = (event) => {
          if (!event.target) return;
          const card = createCard(file.name, file.type, file);
          container.appendChild(card);
        }
        reader.readAsDataURL(file);
      }
    });

    report.addEventListener("keydown", (event) => {
      report.style.height = "auto";
      report.style.height = (report.scrollHeight + 2) + "px";
    });

  }, [title]);

  return (
    <form id="new-form">
      <FloatingLabel label="Title" className="mb-3">
        <Form.Control type="text" id="title" placeholder="Title" required />
      </FloatingLabel>
      <FloatingLabel label="Report" className="mb-3">
        <Form.Control as="textarea" id="report" />
      </FloatingLabel>
      <Form.Group className="mb-3">
        <Form.Label>Upload Files</Form.Label>
        <Form.Control type="file" id="fileUpload" multiple />
      </Form.Group>
      <div className='uploaded-files-preview form-control mb-3' id="uploaded-files-preview">
      </div>
      <div className='button-group'>
        <Button variant="primary" id="new-save" type='submit'>Save</Button>{' '}
        <Button variant="danger" id="new-upload" type='submit'>Upload</Button>
      </div>
    </form>
  );
};

export default WriteNew;