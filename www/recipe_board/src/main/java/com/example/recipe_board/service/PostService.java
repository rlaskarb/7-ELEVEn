package com.example.recipe_board.service;


import org.springframework.stereotype.Service;
import com.example.recipe_board.repository.PostRepository;
import com.example.recipe_board.domain.Post;
import com.example.recipe_board.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {
    
     private final PostRepository postRepository;

    //글 저장하기
    @Transactional //메서드가 성공정으로 끝나면 커밋
    public Post savePost(Post post) {
        return postRepository.save(post);
    }

    // 모든글 조회하기
    @Transactional(readOnly = true)
    public List<Post> findPosts() {
        return postRepository.findAll();
    }
}
