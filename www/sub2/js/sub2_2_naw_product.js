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

  //데이터 배열을 순서대로읽으며 각상품에 대한 카드 생성
  newProductsData.forEach((productData) => {
    const card = cardTemplate.content.cloneNode(true);
  });

  const image = cardTemplate.querySelector(".new_product_image");
  image.src = newProductsData(".new_product_image");
  image.src = productData.imgSrc;
  image.alt = productData.pName;

  card.querySelector(".new_product_name").textContent = productData.pName;
  card.querySelector(".new_product_comment").textContent = `분류:
      ${productData.pType}`;
  card.querySelector(".product-calorie").textContent = `열량:
     ${productData.calorie}`;
  card.querySelector(".product-description").textContent = productData.dCse;
  productList.appendChild(card);
  productContainer.appendChild(productList);
});
