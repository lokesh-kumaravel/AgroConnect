package com.lokesh.ecom_proj.controller;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lokesh.ecom_proj.model.User;
import com.lokesh.ecom_proj.repo.UserRepo;
import com.lokesh.ecom_proj.service.AuthResponse;
import com.lokesh.ecom_proj.service.AuthService;
import com.lokesh.ecom_proj.service.JWTService;
import com.lokesh.ecom_proj.service.MyUserDetailsService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
public class UserController {
        
    // @Autowired
    // private UserRepo userRepo;
    // @GetMapping("user/{userId}")
    // public ResponseEntity<User> getUserById(@PathVariable String userId) {
    //     User user = userRepo.getUserById(userId);
    //     if (user != null) {
    //         return ResponseEntity.ok(user);
    //     } else {
    //         return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
    //     }
    // }
    @GetMapping("/")
    public String getMethodName() {
        System.out.println("Connecting from the phone: ****************");
        return new String("Hello");
    }
    
    @Autowired
    private AuthService authService;
    @PostMapping("/register")
    public User register(@RequestBody User user) {
        System.out.println(user);
        return authService.register(user);
    }


    @PostMapping("/login")
public ResponseEntity<AuthResponse> login(@RequestBody User user) {
    System.out.println("Here "+user);
        AuthResponse authResponse = authService.verify(user);
        System.out.println("HHHHHHHHHHHH"+authResponse.getUserId());
        return ResponseEntity.ok(authResponse);
}
@Autowired
private UserRepo userrepo;

@GetMapping("/getusername/{userId}")
public String getUsername(@PathVariable String userId) {  // Use @PathVariable instead of @RequestParam
    System.out.println("User ID: " + userId);

    User user = userrepo.getUserById(userId);

    if (user != null) {
        String name = user.getUsername();
        System.out.println("Username: " + name);
        return name != null ? name : "Username not found";
    } else {
        System.out.println("User not found for ID: " + userId);
        return "User not found";
    }
}

    // @PostMapping("/login")
    // public ResponseEntity<AuthResponse> login(@RequestBody User user) {
    //     try {
    //         AuthResponse authResponse = authService.verify(user); // Call the verify method
    //         return ResponseEntity.ok(authResponse); // Return the AuthResponse directly
    //     } catch (RuntimeException e) {
    //         return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
    //                 .body(new AuthResponse(null, null)); // Return an AuthResponse with nulls for token and userId
    //     }
    // }

    // @PostMapping("/login")
    // public String login(@RequestBody User user)
    // {
    //     System.out.println(user);
    //     return authService.verify(user);
    // }


    @Autowired
    private JWTService jwtservice;
    @Autowired
    private MyUserDetailsService myUserDetailsService;
    @PostMapping("/jwtcheck")
public ResponseEntity<?> jwtCheck(HttpServletRequest request) {
    String authHeader = request.getHeader("Authorization");
    if (authHeader != null && authHeader.startsWith("Bearer ")) {
        String token = authHeader.substring(7); // Extract token part
        String username = jwtservice.extractUserName(token);
        System.out.println(username+";;;;;;;;;;;;");
        if (username != null) {
            UserDetails userDetails = myUserDetailsService.loadUserByUsername(username);
            
            if (jwtservice.validateToken(token, userDetails)) {
                System.out.println("SUCCESSFULLY VALIDATED");
                return ResponseEntity.ok(Collections.singletonMap("message", "JWT token is valid.")); // Return a JSON object
            }
        }

    }

    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
}
}
