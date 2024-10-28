package com.lokesh.ecom_proj.controller;
    
import java.util.*;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.lokesh.ecom_proj.exception.ResourceNotFoundException;
import com.lokesh.ecom_proj.model.CartItem;
import com.lokesh.ecom_proj.model.CartItemResponse;
import com.lokesh.ecom_proj.model.Product;
import com.lokesh.ecom_proj.model.User;
import com.lokesh.ecom_proj.repo.ProductRepo;
import com.lokesh.ecom_proj.repo.UserRepo;

@RestController
@RequestMapping("/users")
public class CartController {

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private ProductRepo productRepository;

    @PutMapping("/{userId}/cart")
@PreAuthorize("hasAuthority('USER') and #userId == authentication.principal.id")
public void updateCart(@PathVariable String userId, @RequestBody CartItem cartItem) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    if (user.getCart() == null) {
        user.setCart(new ArrayList<>());
    }

    Product product = productRepository.findById(cartItem.getProductId())
        .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

    Optional<CartItem> existingCartItem = user.getCart().stream()
        .filter(item -> item.getProductId().equals(cartItem.getProductId()))
        .findFirst();

        if (existingCartItem.isPresent()) {
            int currentQuantity = existingCartItem.get().getQuantity();
            if (currentQuantity < product.getStockQuantity()) {
                existingCartItem.get().setQuantity(currentQuantity + 1);
            } else {
                throw new IllegalArgumentException("Not enough stock available."); 
            }
        } else {
            if (product.getStockQuantity() > 0) {
                cartItem.setQuantity(1);
                user.getCart().add(cartItem);
            } else {
                throw new IllegalArgumentException("Not enough stock available.");
            }
        }
        

    userRepository.save(user);
}
@PutMapping("/{userId}/cart/{productId}")
@PreAuthorize("hasAuthority('USER') and #userId == authentication.principal.id")
public ResponseEntity<CartItem> updateCartItemQuantity(
        @PathVariable String userId,
        @PathVariable String productId,
        @RequestBody Map<String, Integer> requestBody) { 
    int quantity = requestBody.get("quantity"); 

    System.out.println("to update the products quantity in the cart");
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    Optional<CartItem> existingCartItem = user.getCart().stream()
            .filter(item -> item.getProductId().equals(productId))
            .findFirst();

    if (existingCartItem.isPresent()) {
        existingCartItem.get().setQuantity(quantity);
    } else {
        throw new ResourceNotFoundException("Item not found in cart");
    }

    userRepository.save(user);
    return ResponseEntity.ok(existingCartItem.get());
}




@GetMapping("/{userId}/cart")
// @PreAuthorize("hasAuthority('USER') and #userId == authentication.principal.id")
public ResponseEntity<List<CartItemResponse>> getCart(@PathVariable String userId) {
    System.out.println("This is the userId : "+userId);
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    System.out.println("****USER"+user.getCart());
    System.out.println("User accessing cart: " + user.getUsername());
    List<CartItem> cartItems = user.getCart();

    List<CartItemResponse> response = new ArrayList<>();

    for (CartItem cartItem : cartItems) {
        Product product = productRepository.findById(cartItem.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        response.add(new CartItemResponse(product, cartItem.getQuantity()));
    }
    System.out.println("This is the response : "+response);
    return ResponseEntity.ok(response);
}
@GetMapping("/quantity/{productid}/cart")
public int getQuantity(@PathVariable String productid) {
    System.out.println("Hello sirreh");
    System.out.println("Hi ednejn : "+productid);
    Product product = productRepository.findById(productid)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    System.out.println("Products quantity: " + product.getStockQuantity());
    if(product!=null)
    {
        return product.getStockQuantity();
    }
    return 0;
}


@GetMapping("/currentquantity/{userId}/{productid}/cart")
public int getquantityfromcart(@PathVariable String userId, @PathVariable String productid) {
    System.out.println("USERID "+userId);
    System.out.println("PRODUCTID "+productid);
    User user = userRepository.getUserById(userId);
    List<CartItem> cart = user.getCart();
    System.out.println("THIS IS THE CART "+cart);
    if(cart.size()==0)
    {
        return 0;
    }
    int index = -1;
    for(int i = 0;i<cart.size();i++)
    {
        if(cart.get(i).getProductId()==productid)
        {
            index = i;
        }
    }
    if(index>=0)
    {
        return cart.get(index).getQuantity();
    }
    else
    {
        return 0;
    }
}

    @DeleteMapping("/{userId}/cart/{productId}")
    public ResponseEntity<List<CartItem>> removeFromCart(@PathVariable String userId, @PathVariable String productId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.getCart().removeIf(item -> item.getProductId().equals(productId));
        userRepository.save(user);
        System.out.println("Succussfully removed the item from the cart");
        return ResponseEntity.ok(user.getCart());
    }
}
