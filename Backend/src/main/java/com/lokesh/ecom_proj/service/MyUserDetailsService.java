package com.lokesh.ecom_proj.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.lokesh.ecom_proj.model.User;
import com.lokesh.ecom_proj.model.UserPrincipal;
import com.lokesh.ecom_proj.repo.UserRepo;


@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepo userRepo;


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepo.findByUsername(username); // Use email as the identifier
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        // If the user is authenticated via Google, return a UserDetails without a password check
        return new UserPrincipal(user); // Implement UserPrincipal to handle Google users
    }
}