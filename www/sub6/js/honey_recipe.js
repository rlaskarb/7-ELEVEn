$(document).ready(function () {
	const supabaseUrl = "https://ozummxbytqiyzpljwbli.supabase.co";
	const supabaseKey =
		"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96dW1teGJ5dHFpeXpwbGp3YmxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2Njg5NTksImV4cCI6MjA3MDI0NDk1OX0.s7SmnNVrasiE52xZD1ALRXOUzWkwMcIrLzUkfe18aeo";

	const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

	const $modalBox = $(".edit_modal_box"); // 등록된 글 조회되는 큰박스 창
	const $modalContent = $(".edit_popup_content"); // 실제 조회값이 담기는 박스 창
	const $writeModalBox = $(".write_modal_box"); //꿀조합레시피공유하기 등록창

	// 📌 모달 열기 함수
	function openModal(modalType) {
		const $modal = modalType === "edit" ? $modalBox : $writeModalBox;
		$modal.addClass("show");
		$("body").css("overflow", "hidden");
	}

	// 📌 모달 닫기 함수
	function closeModal(modalType) {
		const $modal = modalType === "edit" ? $modalBox : $writeModalBox;
		$modal.removeClass("show");
		// 두 모달이 모두 닫혔을 때만 스크롤복구
		if (
			!$(".edit_modal_box").hasClass("show") &&
			!$(".write_modal_box").hasClass("show")
		) {
			$("body").css("overflow", "auto");
		}
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
			const imageUrl = post.filePath || ".././common/images/noimg.jpg";
			const displayDate = post.created_at.substring(0, 10);

			// 내용이 너무 길면 자르기
			const truncatedContent =
				post.content.length > 50
					? post.content.substring(0, 50) + "..."
					: post.content;

			// 제목이 너무 길면 자르기
			const truncatedTitle =
				post.title.length > 20
					? post.title.substring(0, 20) + "..."
					: post.title;

			// 📌 카드 HTML
			const postHtml = `
                        <li>
                            <a href="#" class="edit-trigger" data-post-id="${post.id}" >
                                <div class="recipe_img">
                                    <img src="${imageUrl}" alt="${post.title} 이미지" loading="lazy">
                                </div>
								<div class="recipe_content">
                                	<dl>
                                    	<dt>${truncatedTitle}</dt>
                                    	<dd>${truncatedContent}</dd>
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
				closeModal("write"); // 글쓰기 팝업닫기;
				loadPosts();
			}
		} catch (e) {
			console.error("폼 제출 중 예상치 못한 오류가 발생 : ", e);
			alert("폼 제출 중 오류가 발생 하였습니다.");
		} finally {
			submitButton.prop("disabled", false).text("꿀조합 등록하기");
		}
	});

	// 📌 모달 삭제 함수
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
				closeModal("edit"); // 모달 닫기
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

		const imageUrl = post.filePath || ".././common/images/noimg.jpg";

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
		openModal("edit"); // 📌 새로운 모달 열기 함수 사용
	});

	// 수정 폼 제출 이벤트
	$(document).on("submit", "#edit-form", async function (event) {
		event.preventDefault();

		//수정 막기 기능
		try {
			throw new Error("임시 삭제 방지");
		} catch (error) {
			console.error(error);
			alert("미안해요.. 비밀번호 기능이 구현될 때까지 잠시 막아두겠습니다.");
		}
	});

	// 	const postId = $(this).data("post-id");
	// 	const submitButton = $(this).find("button[type='submit']");
	// 	const deleteButton = $(this).find(".delete-btn");

	// 	// 📌 수정 중에는 모든 버튼 비활성화
	// 	submitButton.prop("disabled", true).text("수정 중...");
	// 	deleteButton.prop("disabled", true);

	// 	const updatedPost = {
	// 		title: $("#edit-title").val(),
	// 		content: $("#edit-content").val(),
	// 		name: $("#edit-nickname").val(),
	// 	};

	// 	try {
	// 		const { error } = await supabaseClient
	// 			.from("Posts")
	// 			.update(updatedPost)
	// 			.eq("id", postId);

	// 		if (error) {
	// 			alert("게시글 수정에 실패했습니다.");
	// 			submitButton.prop("disabled", false).text("수정 완료");
	// 			deleteButton.prop("disabled", false);
	// 		} else {
	// 			alert("게시글이 성공적으로 수정되었습니다.");
	// 			closeModal("edit"); // 📌 새로운 모달 닫기 함수 사용
	// 			loadPosts();
	// 		}
	// 	} catch (e) {
	// 		console.error("수정 중 오류:", e);
	// 		alert("수정 중 오류가 발생했습니다.");
	// 		submitButton.prop("disabled", false).text("수정 완료");
	// 		deleteButton.prop("disabled", false);
	// 	}
	// });

	// 📌 모달 내 삭제 버튼 클릭 이벤트
	// $(document).on("click", ".modal_buttons .delete-btn", function () {
	// 	const postId = $(this).data("post-id");
	// 	deletePost(postId);
	// });


	//  비밀번호 만들지못해서 임시 삭제기능 막는 코드
	$(document).on("click", ".modal_buttons .delete-btn", function (e) {
		e.preventDefault();
		try {
			throw new Error("임시 삭제 방지");
		} catch (error) {
			console.error(error);
			alert("미안해요.. 비밀번호 기능이 구현될 때까지 잠시 막아두겠습니다.");
		}
	});

	
	// 📌 모달 닫기 이벤트들
	// X 버튼 클릭
	$(document).on("click", ".close_pop", function (e) {
		e.preventDefault();
		if ($(this).closest(".edit_modal_box").length) {
			closeModal("edit");
		} else if ($(this).closest(".write_modal_box").length) {
			closeModal("write");
		}
	});

	// 배경 클릭 시 모달 닫기
	$(document).on("click", ".edit_modal_box, .write_modal_box", function (e) {
		if (e.target === this) {
			if ($(this).hasClass("edit_modal_box")) {
				closeModal("edit");
			} else if ($(this).hasClass("write_modal_box")) {
				closeModal("write");
			}
		}
	});

	// ESC 키로 모달 닫기
	$(document).on("keydown", function (e) {
		if (e.key === "Escape") {
			if ($(".edit_modal_box").hasClass("show")) {
				closeModal("edit");
			}
			if ($(".write_modal_box").hasClass("show")) {
				closeModal("write");
			}
		}
	});

	// '꿀조합 등록하기' 버튼 클릭 이벤트
	$("#open_write_modal").on("click", function (e) {
		e.preventDefault();
		openModal("write"); // '글쓰기' 팝업열기
	});

	// 페이지 로드 시 글 목록 불러오기
	loadPosts();
});
