package com.lokesh.ecom_proj.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lokesh.ecom_proj.model.Product;
import com.lokesh.ecom_proj.model.User;
import com.lokesh.ecom_proj.repo.ProductRepo;
import com.lokesh.ecom_proj.repo.UserRepo;
import com.lokesh.ecom_proj.service.JWTService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/profile")
public class ProfileController {

    @Autowired
    private UserRepo userRepo;  // Repository to fetch user details

    @Autowired
    private ProductRepo productRepo;  // Repository to fetch products

    @Autowired
    private JWTService jwtService;

    // Fetch user details and their posted products
    @GetMapping
    public ResponseEntity<?> getProfile(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);
            String username = jwtService.extractUserName(token);

            // Fetch the authenticated user
            User user = userRepo.findByUsername(username);
            if (user == null) {
                return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
            }

            // Fetch the user's products
            List<Product> products = productRepo.findByUserId(user.getId());

            // Return user details and products as JSON response
            Map<String, Object> response = new HashMap<>();
            response.put("user", user);
            response.put("products", products);

            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);
    }
}
