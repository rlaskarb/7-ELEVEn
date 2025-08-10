$(document).ready(function () {
  $(".full_search .search_left_area button").click(function (e) {
    e.preventDefault(); 

    // 검색창에 입력된 값을 가져옵니다.
    const searchValue = $(".full_search .search_left_area input").val();

    if (searchValue) {
     // 검색어가 있다면, 검색어를 포함해서 sub2_2 페이지로 이동
      window.location.href = `./sub2/sub2_2.html?query=${searchValue}`;
    } else {
      // 검색어가 없다면, 그냥 sub2_2 페이지로 이동합니다.
      window.location.href = "./sub2/sub2_2.html";
    }
  });
});
