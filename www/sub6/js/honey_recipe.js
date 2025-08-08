$(document).ready(function () {
	// --- 1. Supabase 클라이언트 초기화 ---
	// Supabase 프로젝트 설정에서 확인한 URL과 anon 키를여기에 붙여넣으세요.
	const supabaseUrl = "https://ozummxbytqiyzpljwbli.supabase.co"; // 👈 여기에내 프로젝트 URL
	const supabaseKey =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96dW1teGJ5dHFpeXpwbGp3YmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2Njg5NTksImV4cCI6MjA3MDI0NDk1OX0.s7SmnNVrasiE52xZD1ALRXOUzWkwMcIrLzUkfe18aeo"; // 👈여기에 내 anon 키
	const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
	// --- 2. 모든 게시글을 가져와서 화면에 표시하는 함수---
	console.log("2. Supabase 클라이언트 초기화 완료");
	async function loadPosts() {
		console.log("3. loadPosts 함수 실행 시작");
		// 'posts' 테이블에서 모든 데이터를(*) id 기준 내림차순(최신순)으로 가져오기
		const { data: posts, error } = await supabaseClient
			.from("Posts")
			.select("*")
			.order("id", { ascending: false });

		if (error) {
			console.error("게시글 조회 실패:", error);
			alert("게시판 데이터를 불러오는 데 실패했습니다.");
			return;
		}
		console.log("4-2. 게시글 조회 성공! 받아온 데이터:", posts);
		const $boardList = $(".honey_recipe_tuck_box");
		$boardList.empty();

		posts.forEach(function (post) {
			const postHtml = `
                        <li>
                            <a href="#">
                                <div class="recipe_img">
                                    <img src="${
																			post.filePath || "../main_images/aaaa.jpg"
																		}" alt="${post.title}">
                                </div>
                                <dl>
                                    <dt>${post.title}</dt>
                                    <dd>${post.content}</dd>
                                </dl>
                            </a>
                       </li>
                    `;
			$boardList.append(postHtml);
		});
	}

	// --- 3. 새 글을 Supabase에 저장하는 함수 ---
	$("#post-form").on("submit", async function (event) {
		event.preventDefault();

		const title = $("#post-title").val();
		const content = $("#post-content").val();

		// 'posts' 테이블에 새로운 데이터를 삽입(insert)
		const { data, error } = await supabaseClient
			.from("Posts")
			.insert([{ title: title, content: content, name: "위궤양개츠비" }]);

		if (error) {
			console.error("글 등록 실패:", error);
			alert("글을 등록하는 데 실패했습니다.");
		} else {
			alert("새로운 꿀조합이 성공적으로등록되었습니다!");
			$("#post-form")[0].reset();
			loadPosts(); // 목록 새로고침
		}
	});

	// --- 4. 페이지가 처음 열릴 때, 글 목록을 불러오기---
	loadPosts();
});
