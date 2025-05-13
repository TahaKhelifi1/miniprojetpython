package com.example.microservice.repository;

import com.example.microservice.model.Favorite;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoriteRepository extends MongoRepository<Favorite, String> {
    List<Favorite> findByUserId(String userId);
    void deleteByUserIdAndCourseId(String userId, String courseId);
    boolean existsByUserIdAndCourseId(String userId, String courseId);
} 