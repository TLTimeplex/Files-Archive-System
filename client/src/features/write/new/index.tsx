import { v4 as uuid } from "uuid";
import { useParams } from 'react-router-dom';
import IDB_Report from "../../../types/IDB_report";

export const WriteNew = () => {

  const { title } = useParams();

  const ReportID = uuid();

  let Report : IDB_Report = {
    id: ReportID,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  if(title && title !== '') {
    Report.title = title;
  }

  // TODO: Save Report to database

  window.location.href = "/write/edit/" + ReportID;

  return (<></>);

  //useEffect(() => {
    /*
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
    */

    /*
    const createCard = (title: string, footer: string, image: File, footer2?: string) => {
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

      if (image.type.match("image/")) {
        const cardImg = document.createElement("img");
        cardImg.classList.add("card-img");
        cardImg.src = URL.createObjectURL(image);

        cardBody.appendChild(cardImg);
      } else {
        const cardText = document.createElement("p");
        cardText.classList.add("card-text");
        cardText.style.textAlign = "center";
        cardText.innerText = "File type: " + (image.type.split("/")[1] || "Unknown") + "\nNo preview available.";

        cardBody.appendChild(cardText);
      }

      const cardFooter = document.createElement("div");
      cardFooter.classList.add("card-footer");

      const cardText = document.createElement("p");
      cardText.classList.add("card-text");
      cardText.innerText = footer;

      const cardText2 = document.createElement("p");
      cardText2.classList.add("card-text");
      cardText2.classList.add("card-text-2");
      footer2 ? cardText2.innerText = footer2 : cardText2.innerText = "";

      cardHeader.appendChild(cardTitle);
      cardFooter.appendChild(cardText);
      cardFooter.appendChild(cardText2);

      card.appendChild(cardHeader);
      card.appendChild(cardBody);
      card.appendChild(cardFooter);

      return card;
    }
    */

    /*
    const drawPreview = (files: FileList | Array<File> | File[], clear: boolean): void => {
      const container = document.getElementById("uploaded-files-preview") as HTMLFormElement;
      if (clear) container.innerHTML = "";
      if (!files) return;

      if (files.length === 0) return;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file) continue;
        const reader = new FileReader();
        reader.onload = (event) => {
          if (!event.target) return;
          const card = createCard(file.name, file.type === "" ? "Unknown" : file.type.split("/")[0], file, fileSize(file.size));
          container.appendChild(card);
        }
        reader.readAsDataURL(file);
      }

    };
    */
  //}, [title]);
};

export default WriteNew;