$(document).ready(function () {
  // Supabase 접속 정보 설정
  const supabaseUrl = "https://avmixoojnddaietecigk.supabase.co";
  const supabaseKey = "sb_publishable_wzK5hEPcrrM9QHITHIoPSQ_XHFTm7CJ";

  // Supabase 클라이언트 초기화
  const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

  async function loadLatestPosts() {
    const $boardList = $(".honey_recipe_tuck_box");

    try {
      // 로딩 상태 표시
      $boardList.html(
        '<li style="grid-column: 1/-1; text-align: center; padding: 40px;"><p>게시글을 불러오는 중...</p></li>',
      );

      // Supabase에서 최신 게시글 6개 조회
      const { data: posts, error } = await supabaseClient
        .from("Posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(6);

      // 오류 처리
      if (error) {
        console.error("게시글 조회 실패:", error);
        $boardList.html(`
					<li style="grid-column: 1/-1; text-align: center; padding: 40px;">
						<p style="color: #d92629; font-weight: 600;">데이터를 불러오는 데 실패했습니다.</p>
						<p style="font-size: 14px; color: #666; margin-top: 10px;">잠시 후 다시 시도해주세요.</p>
					</li>
				`);
        return;
      }

      // 게시글이 없는 경우
      if (!posts || posts.length === 0) {
        $boardList.html(`
					<li style="grid-column: 1/-1; text-align: center; padding: 40px;">
						<p style="color: #666;">아직 등록된 꿀조합이 없어요!</p>
						<p style="font-size: 14px; color: #999; margin-top: 10px;">첫 번째 꿀조합을 공유해보세요 😊</p>
					</li>
				`);
        return;
      }

      // 기존 내용 초기화
      $boardList.empty();

      // 각 게시글을 카드 형태로 생성
      posts.forEach(function (post) {
        // 날짜 포맷팅 (YYYY-MM-DD 형태로)
        const displayDate = new Date(post.created_at).toLocaleDateString(
          "ko-KR",
          {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          },
        );

        // 내용이 너무 길면 자르기
        const truncatedContent =
          post.content.length > 100
            ? post.content.substring(0, 100) + "..."
            : post.content;

        // 제목이 너무 길면 자르기
        const truncatedTitle =
          post.title.length > 20
            ? post.title.substring(0, 20) + "..."
            : post.title;

        // HTML 구조 생성 (이미지 디자인 참고)
        const postHtml = `
					<li>
						<dl>
							<dt>
								<a href="./sub6/sub6_2.html" title="${post.title}">
									${truncatedTitle}
								</a>
							</dt>
							<dd class="content">${truncatedContent}</dd>
							<dd class="info">
								<span class="nickname">${post.name}</span>
								<span class="date">${displayDate}</span>
							</dd>
						</dl>
					</li>
				`;

        // 생성된 HTML을 목록에 추가
        $boardList.append(postHtml);
      });
    } catch (error) {
      console.error("예상치 못한 오류 발생:", error);
      $boardList.html(`
				<li style="grid-column: 1/-1; text-align: center; padding: 40px;">
					<p style="color: #d92629; font-weight: 600;">오류가 발생했습니다.</p>
					<p style="font-size: 14px; color: #666; margin-top: 10px;">페이지를 새로고침 해주세요.</p>
				</li>
			`);
    }
  }

  // 페이지 로드 시 게시글 불러오기
  loadLatestPosts();

  /**
   * 선택사항: 일정 시간마다 자동으로 새 게시글 확인
   * (실시간 업데이트가 필요한 경우에만 사용)
   */
  // setInterval(loadLatestPosts, 30000); // 30초마다 새로고침
});
