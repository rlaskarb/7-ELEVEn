package com.example.recipe_board.controller;

import com.example.recipe_board.domain.Post;
import com.example.recipe_board.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PostController {
    
    private final PostService postService;

    // 게시글 조회
    @GetMapping("/api/posts")
    public List<Post> getPosts() {
        return postService.findPosts();
    }
    
    // 게시글 저장
    @PostMapping("/api/posts")
    public Post createPost(@RequestBody Post post) {
        return postService.savePost(post);
    }

    
}
