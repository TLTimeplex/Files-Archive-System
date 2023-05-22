export const createCard = (title: string | null, image: File | null, footerLeft: string | null, footerRight: string | null): HTMLDivElement => {
  const card = document.createElement("div");
  card.classList.add("card");

  if (title) {
    const cardHeader = document.createElement("div");
    cardHeader.classList.add("card-header");

    const cardTitle = document.createElement("div");
    cardTitle.classList.add("card-title");
    cardTitle.classList.add("h5");
    cardTitle.innerText = title;

    cardHeader.appendChild(cardTitle);
    card.appendChild(cardHeader);
  }


  if (image) {
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

    card.appendChild(cardBody);
  }

  if (footerLeft || footerRight) {
    const cardFooter = document.createElement("div");
    cardFooter.classList.add("card-footer");
  
    if(footerLeft){
      const cardText = document.createElement("p");
      cardText.classList.add("card-text");
      cardText.innerText = footerLeft;

      cardFooter.appendChild(cardText);
    }
  
    if(footerRight){
      const cardText = document.createElement("p");
      cardText.classList.add("card-text");
      cardText.classList.add("card-text-2");
      cardText.innerText = footerRight;

      cardFooter.appendChild(cardText);
    }

    card.appendChild(cardFooter);
  }
  
  return card;
}

export default createCard;