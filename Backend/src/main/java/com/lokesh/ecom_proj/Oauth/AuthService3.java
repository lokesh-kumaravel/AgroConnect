package com.lokesh.ecom_proj.Oauth;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.lokesh.ecom_proj.model.User;
import com.lokesh.ecom_proj.repo.UserRepo;
import com.lokesh.ecom_proj.service.JWTService;

@Service
public class AuthService3
{
    @Autowired
    private UserRepo repo;
    @SuppressWarnings("unchecked")
    public User register(User user) 
    {
        System.out.println(user);
        // user.setPassword(encoder.encode(user.get()));
        repo.save(user);
        return user;
    }    

    @Autowired
    private JWTService jwtservice;
    public AuthResponse verify(User user) {
        User foundUser = repo.findByMailId(user.getMailId());
        if (foundUser != null) {
            if (user.getUsername().equals(foundUser.getUsername())) {
                String token = jwtservice.generateToken(foundUser.getUsername());
                System.out.println(token);
                System.out.println(foundUser.getId());
                
                return new AuthResponse(token, foundUser.getId()); 
            } else {
                throw new RuntimeException("Bad Credentials");
            }
        } else {
            throw new RuntimeException("User Not Found");
        }
    }

    // @Autowired
    // private UserRepo userRepository;

    // public User findById(String userId) {
    //     return userRepository.findById(userId)
    //             .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    // }

}