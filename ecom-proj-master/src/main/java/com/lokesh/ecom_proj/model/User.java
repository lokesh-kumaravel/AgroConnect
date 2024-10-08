package com.lokesh.ecom_proj.model;

import java.util.*;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// @Document
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "user")
public class User {

    @Id
    private String id;
    private String username;
    private String password;
    private String mailId;
    private List<CartItem> cart = new ArrayList<>();


    // Fields for storing the profile image
    private String imageName;     // The name of the image file
    private String imageType;     // The type of the image (e.g., "image/jpeg", "image/png")
    private byte[] imageData;     // The binary data of the image

    private List<String> wishlist = new ArrayList<>();  // List of liked product IDs
}
