package com.example.microservice.service;

import com.example.microservice.model.Favorite;
import com.example.microservice.repository.FavoriteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

    @Cacheable(value = "favorites", key = "#userId")
    public List<Favorite> getUserFavorites(String userId) {
        return favoriteRepository.findByUserId(userId);
    }

    public Favorite addFavorite(Favorite favorite) {
        favorite.setCreatedAt(LocalDateTime.now().format(DateTimeFormatter.ISO_DATE_TIME));
        return favoriteRepository.save(favorite);
    }

    @CacheEvict(value = "favorites", key = "#userId")
    public void removeFavorite(String userId, String courseId) {
        favoriteRepository.deleteByUserIdAndCourseId(userId, courseId);
    }

    public boolean isFavorite(String userId, String courseId) {
        return favoriteRepository.existsByUserIdAndCourseId(userId, courseId);
    }
} 