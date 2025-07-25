$(document).ready(function () {
  const newMenuData = [
    {
      image: "./sub2/images/content2/new1.jpg",
      productName: "고추장 불고기 도시락 ",
      company: "7-ELEVEn",
      description: "도시락이다다다다",
      mdReview: "우오아아아아아",
      price: "5,900원",
    },
    {
      image: "./sub2/images/content2/new2.jpg",
      productName: "맛장우 로스트 치킨 도시락 ",
      company: "7-ELEVEn",
      description: "도시락이다다다다",
      mdReview: "우오아아아아아",
      price: "5,700원",
    },
    {
      image: "./sub2/images/content2/new3.jpg",
      productName: "푸하하 생크림떡 ",
      company: "7-ELEVEn",
      description: "생크림 떡이다다다다",
      mdReview: "우오아아아아아",
      price: "3,000원",
    },
    {
      image: "./sub2/images/content2/new4.jpg",
      productName: "수건모양 아이스크림 ",
      company: "7-ELEVEn",
      description: "와아아아앙",
      mdReview: "우오아아아아아",
      price: "3,500원",
    },
    {
      image: "./sub2/images/content2/new5.jpg",
      productName: "애플망고 크림빵 ",
      company: "7-ELEVEn",
      description: "우오아아알다다다다",
      mdReview: "우오아아아아아",
      price: "3,500원",
    },
    {
      image: "./sub2/images/content2/new6.jpg",
      productName: "시즈쿠 유즈 ",
      company: "7-ELEVEn",
      description: "요커트다다다",
      mdReview: "우오아아아아아",
      price: "3,000원",
    },
    {
      image: "./sub2/images/content2/new7.jpg",
      productName: "스트롱 사와 ",
      company: "7-ELEVEn",
      description: "음료수 음료수",
      mdReview: "우오아아아아아",
      price: "4,500원",
    },
    {
      image: "./sub2/images/content2/new8.jpg",
      productName: "오하요 저지방 우유 푸딩 ",
      company: "7-ELEVEn",
      description: "푸우우딩이다다다다",
      mdReview: "우오아아아아아",
      price: "3,500원",
    },
    {
      image: "./sub2/images/content2/new9.jpg",
      productName: "블랙 서클(BLADCK CIRCLE) ",
      company: "7-ELEVEn",
      description: "보리차이다다다다",
      mdReview: "우오아아아아아",
      price: "19,800원",
    },

    {
      image: "./sub2/images/content2/new10.jpg",
      productName: "막창볶음밥 삼각",
      company: "7-ELEVEn",
      description:
        "밥을 볶아 먹을려고 막창을 먹는 사람을 위해서 데리야끼 양념에 야무지게 볶음삼김!",
      mdReview: "우리가 찾던 그맛을 드디여 찾았어요!",
      price: "1,200원",
    },
  ];

  console.log("상품데이터 : ", newMenuData);
  console.log("총 갯수 : ", newMenuData.length);

  // 슬라이드 번호 저장변수
  let currentIndex = 0;
  let timer;

  // 특정번호 슬라이드 내용 화면에 보여주는 함수
  function showSlide(index) {
    const currentData = newMenuData[index];

    // attr() 속성값을 가져오거나 변경할수 있는 함수.
    $(".new_menu_right_box img").attr("src", currentData.image);

    const $menuChange = $(".new_menu_change");
    $menuChange.find("dd").eq(0).text(currentData.productName);
    $menuChange.find("dd").eq(1).text(currentData.company);
    $menuChange.find("dd").eq(2).text(currentData.description);
    $menuChange.find("dd").eq(3).find("span").text(currentData.mdReview);
    $menuChange.find("dd").eq(4).find("span").text(currentData.price);

    // 먼저 초기화
    $(".new_menu_dot").removeClass("active");
    //추가
    $(".new_menu_dot").eq(index).addClass("active");
    //업데이트
    currentIndex = index;
  }
  //   //클릭 기능
  //   $(".new_menu_dot").on("click", function () {
  //     const index = $(this).index();
  //     showSlide(index);
  //   });

  function startSlider() {
    clearInterval(timer);
    timer = setInterval(function () {
      let nextIndex = (currentIndex + 1) % newMenuData.length;
      showSlide(nextIndex);
    }, 3000);
  }

  $(document).ready(function () {
    const $dotsContainer = $(".new_menu_slider_dots");
    newMenuData.forEach(function () {
      $dotsContainer.append('<li class="new_menu_dot"></li>');
    });
  });

  // 슬라이더에 마우스 호버시 멈춤 벗어날시 재시작
  // .on() 연결 이벤트
  $(".new_menu_tuck_box , .new_menu_slider_dots")
    .on("mouseenter", function () {
      clearInterval(timer); // 알람끄기
    })
    .on("mouseleave", function () {
      startSlider(); // 알람켜기
    });

  //로드시 첫페이지 보여주기

  console.log("잘보이나?");
  showSlide(0);
  startSlider();
});
