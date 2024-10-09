package com.lokesh.ecom_proj.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import java.util.Date;

@Document(collection = "reviews")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Review {

    @Id
    private String reviewId; 

    private String productId; // Reference to the associated product

    private String userId; // Reference to the user who wrote the review

    @Min(1)
    @Max(5)
    private int rating; // Rating from 1 to 5

    @NotEmpty(message = "Review text cannot be empty")
    private String reviewText; // The actual review text

    private Date timestamp; // Date when the review was created

    public Review(String productId, String userId, int rating, String reviewText) {
        this.productId = productId;
        this.userId = userId;
        this.rating = rating;
        this.reviewText = reviewText;
        this.timestamp = new Date(); // Set the timestamp to the current date
    }

    public void setId(String reviewId2) {
        this.reviewId = reviewId2;
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'setId'");
    }
}
