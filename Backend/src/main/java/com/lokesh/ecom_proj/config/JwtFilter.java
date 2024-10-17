package com.lokesh.ecom_proj.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.lokesh.ecom_proj.service.JWTService;
import com.lokesh.ecom_proj.service.MyUserDetailsService;

import java.io.IOException;
@Component
public class JwtFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);

    @Autowired
    private JWTService jwtService;

    @Autowired
    private MyUserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            logger.info("Extracted token from the request: {}", token);
            username = jwtService.extractUserName(token);
            logger.info("Extracted username: {}", username);
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            if (token != null && jwtService.validateToken(token, userDetails)) {
                logger.info("Validated user: {}", userDetails.getUsername());
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                logger.warn("Invalid JWT token: {}", token);
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}



// package com.lokesh.ecom_proj.config;

// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.context.ApplicationContext;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
// import org.springframework.stereotype.Component;
// import org.springframework.web.filter.OncePerRequestFilter;

// import com.lokesh.ecom_proj.service.JWTService;
// import com.lokesh.ecom_proj.service.MyUserDetailsService;

// import java.io.IOException;

// @Component
// public class JwtFilter extends OncePerRequestFilter {

//     private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);

//     @Autowired
//     private JWTService jwtService;

//     @Autowired
//     private MyUserDetailsService userDetailsService; // Directly autowired

//     @Override
//     protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//         String authHeader = request.getHeader("Authorization");
//         String token = null;
//         String username = null;

//         // Extracting token from Authorization header
//         if (authHeader != null && authHeader.startsWith("Bearer ")) {
//             token = authHeader.substring(7);
//             logger.info("Extracted token from the request: {}", token);
//             username = jwtService.extractUserName(token);
//             logger.info("Extracted username: {}", username);
//         }

//         // Validate token and set the authentication in the context
//         if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//             UserDetails userDetails = userDetailsService.loadUserByUsername(username);
//             if (token != null && jwtService.validateToken(token, userDetails)) {
//                 logger.info("Validated user: {}", userDetails.getUsername());
//                 UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
//                 authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//                 SecurityContextHolder.getContext().setAuthentication(authToken);
//             } else {
//                 logger.warn("Invalid JWT token: {}", token);
//                 response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
//                 return; // Exit the filter chain
//             }
//         }

//         filterChain.doFilter(request, response);
//     }
// }

// package com.lokesh.ecom_proj.config;

// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import org.slf4j.Logger;
// import org.slf4j.LoggerFactory;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.context.ApplicationContext;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
// import org.springframework.stereotype.Component;
// import org.springframework.web.filter.OncePerRequestFilter;

// import com.lokesh.ecom_proj.service.JWTService;
// import com.lokesh.ecom_proj.service.MyUserDetailsService;

// import java.io.IOException;

// @Component
// public class JwtFilter extends OncePerRequestFilter {

//     private static final Logger logger = LoggerFactory.getLogger(JwtFilter.class);

//     @Autowired
//     private JWTService jwtService;

//     @Autowired
//     ApplicationContext context;

//     @Override
//     protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//         String authHeader = request.getHeader("Authorization");
//         String token = null;
//         String username = null;

//         // Extracting token from Authorization header
//         if (authHeader != null && authHeader.startsWith("Bearer ")) {
//             token = authHeader.substring(7);
//             System.out.println("Extracted token from the request Bearer"+token);
//             username = jwtService.extractUserName(token);
//             logger.info("Extracted username: {}", username);
//         }

//         // Validate token and set the authentication in the context
//         if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//             UserDetails userDetails = context.getBean(MyUserDetailsService.class).loadUserByUsername(username);
//             if (jwtService.validateToken(token, userDetails)) {
//                 logger.info("Validated user: {}", userDetails.getUsername());
                
//                 UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
//                 authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//                 SecurityContextHolder.getContext().setAuthentication(authToken);
//                 System.out.println(authToken);
//             } else {
//                 logger.warn("Invalid JWT token: {}", token);
//             }
//         }

//         filterChain.doFilter(request, response);
//     }
// }
