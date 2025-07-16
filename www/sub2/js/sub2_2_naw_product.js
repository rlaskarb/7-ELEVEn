document.addEventListener("DOMContentLoaded", function () {
  const newProductContainer = document.getElementById("new_product_container");
  const cardTemplate = document.getElementById("new_product_card_template");

  const newProductsData = [
    {
      imgSrc: "../images/content2/newSandwich01.jpg",
      pName: "대만식 딸기샌드",
      comment: "딸기가 신의세수",
      price: "3,400원",
    },
  ];

  const productList = document.createElement("ul");
  productList.className = "new_product_list";

  newProductsData.forEach((productData) => {
    const card = cardTemplate.content.cloneNode(true);
  });
});
