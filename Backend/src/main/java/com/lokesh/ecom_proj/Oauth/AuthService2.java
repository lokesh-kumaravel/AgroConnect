package com.lokesh.ecom_proj.Oauth;

import org.apache.logging.log4j.status.StatusLogger.Config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;

import com.lokesh.ecom_proj.task.configurer;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.concurrent.CompletableFuture;
@Service
public class AuthService2 {

    @Value("${chronify.google.oauth.token_uri}")
    private String tokenUri;

    // @Value("${chronify.google.oauth.client_id}")
    // private String clientId;

    // @Value("${chronify.google.oauth.client_secret}")
    // private String clientSecret;
    private String clientSecret = configurer.getGoogleClientSecret();
    private String clientId = configurer.getGoogleClientKey();

    @Value("${chronify.google.oauth.redirect_uri}")
    private String redirectUri;

    public GoogleOAuthTokenResponse getGoogleOAuthTokens(String code) {
        WebClient webClient = WebClient.create();
        GoogleOAuthTokenResponse tokenResponse = null;
    
        try {
            tokenResponse = webClient.post()
                    .uri(tokenUri)
                    .header("Content-Type", "application/x-www-form-urlencoded")
                    .body(BodyInserters.fromFormData("code", code)
                            .with("client_id", clientId)
                            .with("client_secret", clientSecret)
                            .with("redirect_uri", redirectUri)
                            .with("grant_type", "authorization_code"))
                    .retrieve()
                    .bodyToMono(GoogleOAuthTokenResponse.class)
                    .block(); 
    
            if (tokenResponse != null) {
                System.out.println("Access Token: " + tokenResponse.getAccessToken());
                System.out.println("Refresh Token: " + tokenResponse.getRefreshToken());
                System.out.println("ID Token: " + tokenResponse.getIdToken());
            }
        } catch (Exception e) {
            System.out.println("Error in AuthService while getting tokens: " + e.getMessage());
        }
    
        return tokenResponse; // Return the token response
    }
    

    public CompletableFuture<String> getGoogleUserInfo(String idToken, String accessToken) {
        String googleDataUrl = "https://www.googleapis.com/oauth2/v1"; // Replace with actual `client_config.Google.data_url`
        System.out.println("Here in this method");
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(googleDataUrl + "/userinfo?alt=json&access_token=" + accessToken))
                .header("Authorization", "Bearer " + idToken)
                .GET()
                .build();

        return client.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                .thenApply(HttpResponse::body)
                .exceptionally(error -> {
                    System.out.println("getGoogleUserInfo Error: " + error.getMessage());
                    return null;
                });
    }
}

