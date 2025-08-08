package com.example.recipe_board.domain;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Getter
@Setter
@NoArgsConstructor

public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // DB가 자동생성

    private Long id; //게시판 코드
    private String title; // 제목
    private String content; // 내용
    private String name; // 작성자
    
    @Column(nullable = true)
    private String filePath;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
}
