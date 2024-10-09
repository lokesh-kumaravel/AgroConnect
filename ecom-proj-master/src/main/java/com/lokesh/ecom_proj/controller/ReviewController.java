package com.lokesh.ecom_proj.controller;

import com.lokesh.ecom_proj.model.Review;
import com.lokesh.ecom_proj.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products/{productId}/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // Get all reviews for a product
    @GetMapping
    public ResponseEntity<List<Review>> getReviews(@PathVariable String productId) {
        System.out.println(productId);
        List<Review> reviews = reviewService.getReviewsByProductId(productId);
        System.out.println("This is the product's review : "+reviews);
        return ResponseEntity.ok(reviews);
    }

    // Add a new review for a product
    @PostMapping
public ResponseEntity<?> addReview(@PathVariable String productId, @RequestBody Review review) {
    // Optional: Validate the review object here or use @Valid annotation
    if (review == null || review.getRating() <= 0 || review.getReviewText() == null || review.getReviewText().isEmpty()) {
        return ResponseEntity.badRequest().body("Invalid review data.");
    }

    review.setProductId(productId); // Set the product ID
    System.out.println(review);
    
    try {
        Review savedReview = reviewService.addReview(review);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReview);
    } catch (Exception e) {
        // Log the error for debugging
        e.printStackTrace();
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving review.");
    }
}


    // Get a specific review by ID
    @GetMapping("/{reviewId}")
    public ResponseEntity<Review> getReviewById(@PathVariable String productId, @PathVariable String reviewId) {
        Review review = reviewService.getReviewById(productId, reviewId);
        return ResponseEntity.ok(review);
    }

    // Update a review
    @PutMapping("/{reviewId}")
    public ResponseEntity<Review> updateReview(@PathVariable String productId, @PathVariable String reviewId, @RequestBody Review review) {
        Review updatedReview = reviewService.updateReview(productId, reviewId, review);
        return ResponseEntity.ok(updatedReview);
    }

    // Delete a review
    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> deleteReview(@PathVariable String productId, @PathVariable String reviewId) {
        reviewService.deleteReview(productId, reviewId);
        return ResponseEntity.noContent().build();
    }
}
