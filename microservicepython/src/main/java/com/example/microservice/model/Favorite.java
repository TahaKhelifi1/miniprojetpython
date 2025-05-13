package com.example.microservice.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "favorites")
public class Favorite {
    @Id
    private String id;
    private String userId;
    private String courseId;
    private String courseTitle;
    private String courseDescription;
    private String courseImageUrl;
    private String createdAt;
} 