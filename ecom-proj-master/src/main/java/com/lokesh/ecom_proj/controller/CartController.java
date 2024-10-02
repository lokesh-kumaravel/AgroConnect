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
public void updateCart(@PathVariable String userId, @RequestBody CartItem cartItem) {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    // Initialize the cart if it's null
    if (user.getCart() == null) {
        user.setCart(new ArrayList<>());
    }

    // Fetch the product from the database to check its available quantity
    Product product = productRepository.findById(cartItem.getProductId())
        .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

    Optional<CartItem> existingCartItem = user.getCart().stream()
        .filter(item -> item.getProductId().equals(cartItem.getProductId()))
        .findFirst();

        if (existingCartItem.isPresent()) {
            int currentQuantity = existingCartItem.get().getQuantity();
            // Check if we can increment the quantity
            if (currentQuantity < product.getStockQuantity()) {
                existingCartItem.get().setQuantity(currentQuantity + 1);
            } else {
                throw new IllegalArgumentException("Not enough stock available."); // Throw an exception or return a response indicating failure
            }
        } else {
            // New cart item, set its initial quantity
            if (product.getStockQuantity() > 0) {
                cartItem.setQuantity(1);
                user.getCart().add(cartItem);
            } else {
                throw new IllegalArgumentException("Not enough stock available.");
            }
        }
        

    userRepository.save(user);
}

//     @PutMapping("/{userId}/cart")
// @PreAuthorize("hasAuthority('USER') and #userId == authentication.principal.id")
// public void updateCart(@PathVariable String userId, @RequestBody CartItem cartItem) {
//     User user = userRepository.findById(userId)
//         .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    
//     // Initialize the cart if it's null
//     if (user.getCart() == null) {
//         user.setCart(new ArrayList<>());
//     }

//     // Fetch the product from the database to check its available quantity
//     Product product = productRepository.findById(cartItem.getProductId())
//         .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

//     Optional<CartItem> existingCartItem = user.getCart().stream()
//         .filter(item -> item.getProductId().equals(cartItem.getProductId()))
//         .findFirst();

//     if (existingCartItem.isPresent()) {
//         int currentQuantity = existingCartItem.get().getQuantity();
//         // Check if we can increment the quantity
//         if (currentQuantity < product.getStockQuantity()) { // Assume `getAvailableQuantity` returns the stock
//             existingCartItem.get().setQuantity(currentQuantity + 1);
//         } else {
//             System.out.println("Cannot increment. Not enough stock available.");
//         }
//     } else {
//         // New cart item, set its initial quantity
//         cartItem.setQuantity(1);
//         user.getCart().add(cartItem);
//     }

//     userRepository.save(user);
// }
@PutMapping("/{userId}/cart/{productId}")
@PreAuthorize("hasAuthority('USER') and #userId == authentication.principal.id")
public ResponseEntity<CartItem> updateCartItemQuantity(
        @PathVariable String userId,
        @PathVariable String productId,
        @RequestBody Map<String, Integer> requestBody) { // Accept a Map for request body
    int quantity = requestBody.get("quantity"); // Extract quantity from the Map

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
    User user = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    System.out.println("User accessing cart: " + user.getUsername());
    List<CartItem> cartItems = user.getCart();

    // Create a response list to hold products with their quantities
    List<CartItemResponse> response = new ArrayList<>();

    for (CartItem cartItem : cartItems) {
        Product product = productRepository.findById(cartItem.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product not found"));

        response.add(new CartItemResponse(product, cartItem.getQuantity()));
    }

    return ResponseEntity.ok(response);
}
@GetMapping("/quantity/{productid}/cart")
// @PreAuthorize("hasAuthority('USER') and #userId == authentication.principal.id")
public int getQuantity(@PathVariable String productid) {
    System.out.println(productid);
    Product product = productRepository.findById(productid)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

    System.out.println("Products quantity: " + product.getStockQuantity());
    if(product!=null)
    {
        return product.getStockQuantity();
    }
    return 0;
}

// @Autowired
// private CartItem cart;
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
        // System.out.println(cart.get((index)));
        // System.out.println(cart.get(index).getQuantity());
        return cart.get(index).getQuantity();
    }
    else
    {
        return 0;
    }
}

// @GetMapping("/{userId}/cart")
// // @PreAuthorize("hasAuthority('USER') and #userId == authentication.principal.id")
// public ResponseEntity<List<Product>> getCart(@PathVariable String userId) {
//     User user = userRepository.findById(userId)
//             .orElseThrow(() -> new ResourceNotFoundException("User not found"));

//     System.out.println("User accessing cart: " + user.getUsername());
//     System.out.println(user.getCart());

//     // Fetch the product IDs from the user's cart
//     List<String> productIds = user.getCart().stream()
//             .map(CartItem::getProductId)
//             .collect(Collectors.toList());

//     // Fetch products from the ProductRepo based on the product IDs
//     List<Product> products = productRepository.findAllById(productIds);
//     // System.out.println(products);
//     return ResponseEntity.ok(products);
// }

    @DeleteMapping("/{userId}/cart/{productId}")
    public ResponseEntity<List<CartItem>> removeFromCart(@PathVariable String userId, @PathVariable String productId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.getCart().removeIf(item -> item.getProductId().equals(productId));
        userRepository.save(user);
        System.out.println("Succussfully removed the item from the cart");
        return ResponseEntity.ok(user.getCart());
    }
}
