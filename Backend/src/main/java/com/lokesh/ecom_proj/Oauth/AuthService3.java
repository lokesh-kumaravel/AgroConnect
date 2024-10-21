package com.lokesh.ecom_proj.Oauth;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.lokesh.ecom_proj.model.User;
import com.lokesh.ecom_proj.repo.UserRepo;
import com.lokesh.ecom_proj.service.JWTService;

@Service
public class AuthService3 {
    @Autowired
    private UserRepo repo;

    @SuppressWarnings("unchecked")
    public User register(User user) {
        System.out.println(user);
        // user.setPassword(encoder.encode(user.get()));
        repo.save(user);
        return user;
    }

    @Autowired
    private JWTService jwtService;

    public AuthResponse verify(User user, String refreshToken) {
        if (user == null) {
            throw new IllegalArgumentException("User cannot be null");
        }

        User foundUser = repo.findByMailId(user.getMailId());
        if (foundUser != null) {
            if (user.getUsername().equals(foundUser.getUsername())) {
                // Generate a new access token
                String token = jwtService.generateToken(foundUser.getUsername());
                System.out.println(token);
                System.out.println(foundUser.getId());

                // Update the refresh token in the database if it's new
                if (refreshToken != null && !refreshToken.equals(foundUser.getRefreshToken())) {
                    foundUser.setRefreshToken(refreshToken);
                    repo.save(foundUser); // Save the updated user with the new refresh token
                }

                return new AuthResponse(token, foundUser.getId(), foundUser.getRefreshToken());
            } else {
                throw new RuntimeException("Bad Credentials");
            }
        } else {
            throw new RuntimeException("User Not Found");
        }
    }

    // @Autowired
    // private JWTService jwtservice;
    // public AuthResponse verify(User user, String refreshToken) {
    // if(user==null)
    // {
    // System.out.println("user cannpot be null");
    // }
    // User foundUser = repo.findByMailId(user.getMailId());
    // if (foundUser != null) {
    // if (user.getUsername().equals(foundUser.getUsername())) {
    // String token = jwtservice.generateToken(foundUser.getUsername());
    // System.out.println(token);
    // System.out.println(foundUser.getId());

    // return new AuthResponse(token, foundUser.getId(), refreshToken);
    // } else {
    // throw new RuntimeException("Bad Credentials");
    // }
    // } else {
    // throw new RuntimeException("User Not Found");
    // }
    // }

    // @Autowired
    // private UserRepo userRepository;

    // public User findById(String userId) {
    // return userRepository.findById(userId)
    // .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    // }

}