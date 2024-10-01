package com.lokesh.ecom_proj.controller;

import java.util.*;
import java.util.stream.Collectors;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.lokesh.ecom_proj.exception.ResourceNotFoundException;
import com.lokesh.ecom_proj.model.CartItem;
import com.lokesh.ecom_proj.model.Product;
import com.lokesh.ecom_proj.model.User;
import com.lokesh.ecom_proj.repo.ProductRepo;
import com.lokesh.ecom_proj.repo.UserRepo;
// import com.lokesh.ecom_proj.exception.ResourceNotFoundException;

@RestController
@RequestMapping("/users")
public class CartController {

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private ProductRepo productRepository;

   @PutMapping("/{userId}/cart")
@PreAuthorize("hasAuthority('USER') and #userId == authentication.principal.id")
// public ResponseEntity<List<CartItem>> updateCart(@PathVariable String userId, @RequestBody CartItem cartItem) {
public void updateCart(@PathVariable String userId, @RequestBody CartItem cartItem) {
    System.out.println("HERE^^^^^^^^^^^^");
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        System.out.println("^^^^^^^^^^^^^^^^^^");
    // Initialize the cart if it's null
    if (user.getCart() == null) {
        user.setCart(new ArrayList<>());
    }

    Optional<CartItem> existingCartItem = user.getCart().stream()
        .filter(item -> item.getProductId().equals(cartItem.getProductId()))
        .findFirst();

    if (existingCartItem.isPresent()) {
        existingCartItem.get().setQuantity(existingCartItem.get().getQuantity() + 1);
    } else {
        cartItem.setQuantity(1);
        user.getCart().add(cartItem);
    }

    userRepository.save(user);
    // return ResponseEntity.ok(user.getCart());
}



@GetMapping("/{userId}/cart")
// @PreAuthorize("hasAuthority('USER') and #userId == authentication.principal.id")
public ResponseEntity<List<Product>> getCart(@PathVariable String userId) {
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    System.out.println("User accessing cart: " + user.getUsername());
    System.out.println(user.getCart());

    // Fetch the product IDs from the user's cart
    List<String> productIds = user.getCart().stream()
            .map(CartItem::getProductId)
            .collect(Collectors.toList());

    // Fetch products from the ProductRepo based on the product IDs
    List<Product> products = productRepository.findAllById(productIds);
    // System.out.println(products);
    return ResponseEntity.ok(products);
}

    @DeleteMapping("/{userId}/cart/{productId}")
    public ResponseEntity<List<CartItem>> removeFromCart(@PathVariable String userId, @PathVariable String productId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.getCart().removeIf(item -> item.getProductId().equals(productId));
        userRepository.save(user);
        return ResponseEntity.ok(user.getCart());
    }
}
