package com.lokesh.ecom_proj.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import java.math.BigDecimal;
import java.util.Date;

@Document(collection = "products") 
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Product {

    @Id
    private String id; 
    private String userId;
    private String name;
    private String description;
    private String brand;
    private int price;
    private String category;

    private Date releaseDate;
    private boolean productAvailable;
    private int stockQuantity;

    private String imageName;
    private String imageType;
    private byte[] imageDate;
    private int viewCount;
    private String upiId = "lokeshkumaravel29@okaxis";
}

// package com.lokesh.ecom_proj.model;

// // import com.fasterxml.jackson.annotation.JsonFormat;
// import jakarta.persistence.*;
// import lombok.AllArgsConstructor;
// import lombok.Data;
// import lombok.NoArgsConstructor;

// import java.math.BigDecimal;
// import java.util.Date;

// @Entity
// @Data
// @AllArgsConstructor
// @NoArgsConstructor
// public class Product {

//     @Id
//     @GeneratedValue(strategy = GenerationType.IDENTITY)
//     private int id;
//     private String name;
//     private String description;
//     private String brand;
//     private BigDecimal price;
//     private String category;

//     private Date releaseDate;
//     private boolean productAvailable;
//     private int stockQuantity;

//     private String imageName;
//     private String imageType;
//     @Lob
//     private byte[] imageDate;


// }
