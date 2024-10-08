package com.lokesh.ecom_proj.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.lokesh.ecom_proj.exception.ResourceNotFoundException;
import com.lokesh.ecom_proj.model.Product;
import com.lokesh.ecom_proj.model.User;
import com.lokesh.ecom_proj.repo.UserRepo;

@Service
public class AuthService
{
    @Autowired
    private UserRepo repo;
    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);
    @SuppressWarnings("unchecked")
    public User register(User user) 
    {
        System.out.println(user);
        user.setPassword(encoder.encode(user.getPassword()));
        repo.save(user);
        return user;
    }    

    @Autowired
    private JWTService jwtservice;
    public AuthResponse verify(User user) {
        User foundUser = repo.findByMailId(user.getMailId());
        if (foundUser != null) {
            if (encoder.matches(user.getPassword(), foundUser.getPassword())) {
                String token = jwtservice.generateToken(foundUser.getUsername());
                System.out.println(token);
                System.out.println(foundUser.getId());
                
                // Create an AuthResponse object to return token and user ID
                return new AuthResponse(token, foundUser.getId()); // Assuming getId() returns the user ID
            } else {
                throw new RuntimeException("Bad Credentials"); // Throw an exception for better error handling
            }
        } else {
            throw new RuntimeException("User Not Found"); // Throw an exception for better error handling
        }
    }

    @Autowired
    private UserRepo userRepository;

    public User findById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Autowired
    private ProductService productService; 
    public List<Product> getWishlistProducts(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        List<String> wishlist = user.getWishlist();
        return productService.findProductsByIds(wishlist); // Fetch products by IDs
    }

}