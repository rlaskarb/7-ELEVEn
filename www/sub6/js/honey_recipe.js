$(document).ready(function () {
	const supabaseUrl = "https://ozummxbytqiyzpljwbli.supabase.co";
	const supabaseKey =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96dW1teGJ5dHFpeXpwbGp3YmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2Njg5NTksImV4cCI6MjA3MDI0NDk1OX0.s7SmnNVrasiE52xZD1ALRXOUzWkwMcIrLzUkfe18aeo";

	const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);
	const $modalBox = $(".edit_modal_box");
	const $modalContent = $(".edit_popup_content");

	console.log("2. Supabase 클라이언트 초기화 완료");

	// 📌 모달 열기 함수 (애니메이션 효과 포함)
	function openModal() {
		$modalBox.show().addClass("show");
		$("body").css("overflow", "hidden"); // 스크롤 방지
	}

	// 📌 모달 닫기 함수 (애니메이션 효과 포함)
	function closeModal() {
		$modalBox.removeClass("show");
		setTimeout(() => {
			$modalBox.hide();
		}, 300); // 애니메이션 시간과 맞춤
		$("body").css("overflow", "auto"); // 스크롤 복구
	}

	async function loadPosts() {
		console.log("3. loadPosts 함수 실행 시작");

		const $boardList = $(".honey_recipe_tuck_box");
		// 📌 로딩 효과 추가
		$boardList.addClass("loading").html("<li>로딩 중...</li>");

		const { data: posts, error } = await supabaseClient
			.from("Posts")
			.select("*")
			.order("id", { ascending: false });

		// 📌 로딩 효과 제거
		$boardList.removeClass("loading");

		if (error) {
			console.error("게시글 조회 실패:", error);
			alert("게시판 데이터를 불러오는 데 실패했습니다.");
			return;
		}

		console.log("4-2. 게시글 조회 성공! 받아온 데이터:", posts);

		$boardList.empty();

		// 📌 빈 목록 처리
		if (posts.length === 0) {
			$boardList.html(`
				<div class="empty_list_message">
					아직 등록된 꿀조합이 없어요.<br>
					첫 번째 꿀조합을 공유해보세요! 🍯
				</div>
			`);
			return;
		}

		posts.forEach(function (post) {
			const imageUrl = post.filePath || ".././common/images/7-eleven-logo.ico";
			const displayDate = post.created_at.substring(0, 10);

			// 📌 개선된 카드 HTML
			const postHtml = `
                        <li>
                            <a href="#" class="edit-trigger" data-post-id="${post.id}" >
                                <div class="recipe_img">
                                    <img src="${imageUrl}" alt="${post.title} 이미지" loading="lazy">
                                </div>
								<div class="recipe_content">
                                	<dl>
                                    	<dt>${post.title}</dt>
                                    	<dd>${post.content}</dd>
										<dd>${post.name}</dd>	
                                	</dl>
									<div class="recipe_info">
										<span class="recipe_date">${displayDate}</span>	
									</div>
								</div>
                            </a>
                       </li>
                    `;
			$boardList.append(postHtml);
		});
	}

	// 새 글 저장 함수
	$("#post-form").on("submit", async function (event) {
		event.preventDefault();

		const submitButton = $(".write_buttons button[type='submit']");
		submitButton.prop("disabled", true).text("등록 중...");

		const title = $("#post-title").val();
		const content = $("#post-content").val();
		const nickname = $("#post-nickname").val();
		const email = $("#post-email").val();
		const finalNickname = nickname.trim() === "" ? "익명" : nickname;
		const finalEmail = email.trim() === "" ? "" : email;

		const fileInput = document.getElementById("post-file");
		const file = fileInput.files[0];
		let filePath = null;

		try {
			if (file) {
				const fileName = `${Date.now()}-${file.name}`;
				const { data: uploadData, error: uploadError } =
					await supabaseClient.storage
						.from("recipe-images")
						.upload(fileName, file);
				if (uploadError) {
					console.error("파일 업로드 실패:", uploadError);
					alert("파일 업로드에 실패했습니다.");
					return;
				}

				const { data: publicUrlData } = supabaseClient.storage
					.from("recipe-images")
					.getPublicUrl(fileName);
				filePath = publicUrlData.publicUrl;
			}

			const { data, error } = await supabaseClient.from("Posts").insert([
				{
					title: title,
					content: content,
					name: finalNickname,
					email: finalEmail,
					filePath: filePath,
				},
			]);

			if (error) {
				console.error("글 등록 실패:", error);
				alert("글을 등록하는 데 실패했습니다.");
			} else {
				alert("새로운 꿀조합이 성공적으로등록되었습니다!");
				$("#post-form")[0].reset();
				loadPosts();
			}
		} catch (e) {
			console.error("폼 제출 중 예상치 못한 오류가 발생 : ", e);
			alert("폼 제출 중 오류가 발생 하였습니다.");
		} finally {
			submitButton.prop("disabled", false).text("꿀조합 등록하기");
		}
	});

	// 📌 삭제 함수 (모달 전용)
	async function deletePost(postId) {
		if (!confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
			return;
		}

		const deleteButton = $(
			`.modal_buttons .delete-btn[data-post-id="${postId}"]`
		);
		deleteButton.prop("disabled", true).text("삭제 중...");

		try {
			const { error } = await supabaseClient
				.from("Posts")
				.delete()
				.eq("id", postId);

			if (error) {
				console.error("게시글 삭제 실패:", error);
				alert("게시글 삭제에 실패했습니다.");
				deleteButton.prop("disabled", false).text("삭제");
			} else {
				alert("게시글이 성공적으로 삭제되었습니다.");
				closeModal(); // 모달 닫기
				loadPosts(); // 목록 새로고침
			}
		} catch (e) {
			console.error("삭제 중 오류:", e);
			alert("삭제 중 오류가 발생했습니다.");
			deleteButton.prop("disabled", false).text("삭제");
		}
	}

	// 📌 수정: '수정' 버튼 클릭 시, 팝업을 생성하고 보여주는 이벤트
	$(document).on("click", ".edit-trigger", async function (event) {
		event.preventDefault();

		const postId = $(this).data("post-id");

		const { data: post, error } = await supabaseClient
			.from("Posts")
			.select("*")
			.eq("id", postId)
			.single();

		if (error) {
			alert("게시글 정보를 불러오는 데 실패했습니다.");
			return;
		}

		const imageUrl = post.filePath || ".././common/images/7-eleven-logo.ico";

		// 📌 수정/삭제 버튼이 포함된 모달 HTML
		const postHtml = `
			     <ul>
                   <li>
                    	<div class="recipe_img_edit">
                        	<img src="${imageUrl}" alt="${post.title} 이미지">
                        	<p>※ 이미지 수정은 현재 지원되지 않습니다.</p>
                    	</div>
                        
						<form id="edit-form" data-post-id="${post.id}">
                            <dl>
                                <dt>
									<input type="text" id="edit-title"
										value="${post.title}" required>
								</dt>
                                
								<dd>
									<strong>닉네임:</strong>
									<input type="text" id="edit-nickname"
								 		value="${post.name}">
								</dd>
                                
								<dd>
									<textarea id="edit-content" required>${post.content}</textarea>
	   							</dd>
                            </dl>
                            
							<div class="modal_buttons">
                                <button type="submit" class="edit-btn">수정 완료</button>
								<button type="button" class="delete-btn" data-post-id="${post.id}">삭제</button>
                            </div>
                        </form>
                        
						<a href="#" class="close_pop">
							<i class="fa-solid fa-x"></i>
						</a>
                    </li>
                </ul>
            `;

		$modalContent.html(postHtml);
		openModal(); // 📌 새로운 모달 열기 함수 사용
	});

	// 수정 폼 제출 이벤트
	$(document).on("submit", "#edit-form", async function (event) {
		event.preventDefault();
		const postId = $(this).data("post-id");
		const submitButton = $(this).find("button[type='submit']");
		const deleteButton = $(this).find(".delete-btn");

		// 📌 수정 중에는 모든 버튼 비활성화
		submitButton.prop("disabled", true).text("수정 중...");
		deleteButton.prop("disabled", true);

		const updatedPost = {
			title: $("#edit-title").val(),
			content: $("#edit-content").val(),
			name: $("#edit-nickname").val(),
		};

		try {
			const { error } = await supabaseClient
				.from("Posts")
				.update(updatedPost)
				.eq("id", postId);

			if (error) {
				alert("게시글 수정에 실패했습니다.");
				submitButton.prop("disabled", false).text("수정 완료");
				deleteButton.prop("disabled", false);
			} else {
				alert("게시글이 성공적으로 수정되었습니다.");
				closeModal(); // 📌 새로운 모달 닫기 함수 사용
				loadPosts();
			}
		} catch (e) {
			console.error("수정 중 오류:", e);
			alert("수정 중 오류가 발생했습니다.");
			submitButton.prop("disabled", false).text("수정 완료");
			deleteButton.prop("disabled", false);
		}
	});

	// 📌 모달 내 삭제 버튼 클릭 이벤트
	$(document).on("click", ".modal_buttons .delete-btn", function () {
		const postId = $(this).data("post-id");
		deletePost(postId);
	});

	// 📌 모달 닫기 이벤트들
	// X 버튼 클릭
	$(document).on("click", ".close_pop", function (e) {
		e.preventDefault();
		closeModal();
	});

	// 배경 클릭 시 모달 닫기
	$(document).on("click", ".edit_modal_box", function (e) {
		if (e.target === this) {
			// 배경을 직접 클릭했을 때만
			closeModal();
		}
	});

	// ESC 키로 모달 닫기
	$(document).on("keydown", function (e) {
		if (e.keyCode === 27 && $modalBox.hasClass("show")) {
			// ESC 키
			closeModal();
		}
	});

	// 페이지 로드 시 글 목록 불러오기
	loadPosts();
});
