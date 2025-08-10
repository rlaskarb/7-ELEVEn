$(document).ready(function () {
  // '.full_search' 안에 있는 검색 버튼 클릭 시
  $(".full_search .search_left_area button").click(function (e) {
    e.preventDefault(); // 버튼의 기본 동작(새로고침 등)을 막습니다.

    // 검색창에 입력된 값을 가져옵니다.
    const searchValue = $(".full_search .search_left_area input").val();

    if (searchValue) {
      // 검색어가 있다면, 검색어를 포함해서 sub2_2.html 페이지로 이동합니다.
      window.location.href = `./sub2/sub2_2.html?query=${searchValue}`;
    } else {
      // 검색어가 없다면, 그냥 sub2_2.html 페이지로 이동합니다.
      window.location.href = "./sub2/sub2_2.html";
    }
  });
});
