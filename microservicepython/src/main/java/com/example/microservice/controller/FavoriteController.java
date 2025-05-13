package com.example.microservice.controller;

import com.example.microservice.model.Favorite;
import com.example.microservice.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin(origins = "*")
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<Favorite>> getUserFavorites(@PathVariable String userId) {
        return ResponseEntity.ok(favoriteService.getUserFavorites(userId));
    }

    @PostMapping
    public ResponseEntity<Favorite> addFavorite(@RequestBody Favorite favorite) {
        return ResponseEntity.ok(favoriteService.addFavorite(favorite));
    }

    @DeleteMapping("/{userId}/{courseId}")
    public ResponseEntity<Void> removeFavorite(@PathVariable String userId, @PathVariable String courseId) {
        favoriteService.removeFavorite(userId, courseId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{userId}/{courseId}")
    public ResponseEntity<Boolean> isFavorite(@PathVariable String userId, @PathVariable String courseId) {
        return ResponseEntity.ok(favoriteService.isFavorite(userId, courseId));
    }
} 