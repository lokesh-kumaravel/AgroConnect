package com.lokesh.ecom_proj.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItem {

    private String productId; // ID of the product
    private int quantity;     // Quantity of the product
}
