package com.lokesh.ecom_proj.service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JWTService {

    private final String secretKey;

    public JWTService() {
        // Generate a secure random key
        byte[] keyBytes = new byte[32]; // 256 bits
        new SecureRandom().nextBytes(keyBytes);
        this.secretKey = Base64.getEncoder().encodeToString(keyBytes);
    }

    @SuppressWarnings("deprecation")
    public String generateToken(String mailId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("sub", mailId); // Use "sub" for subject claim
    
        return Jwts.builder()
                .setClaims(claims) // Set claims
                .setIssuedAt(new Date(System.currentTimeMillis())) // Set issued date
                .setExpiration(new Date(System.currentTimeMillis() + 60 * 60 * 1000)) // Set expiration (1 hour)
                .signWith(getKey(), SignatureAlgorithm.HS256) // Pass algorithm and key
                .compact();
    }
    
    

    private SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUserName(String token) {
        // Extract the username from JWT token
        return extractClaim(token, Claims::getSubject);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    @SuppressWarnings("deprecation")
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getKey()) // Set the key for signature verification
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
    
    
    

    public boolean validateToken(String token, UserDetails userDetails) {
        final String userName = extractUserName(token);
        System.out.println("---------------"+userName);
        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}
