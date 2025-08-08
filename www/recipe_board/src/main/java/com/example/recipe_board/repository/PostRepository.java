package com.example.recipe_board.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.recipe_board.domain.Post;

public interface PostRepository extends JpaRepository <Post , Long>{

    
}
