package com.lokesh.ecom_proj.controller;

import com.lokesh.ecom_proj.model.Product;
import com.lokesh.ecom_proj.model.User;
import com.lokesh.ecom_proj.repo.UserRepo;
import com.lokesh.ecom_proj.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
    
@RestController
@CrossOrigin
@RequestMapping("/api")
public class ProductController {

    @Autowired
    private ProductService service;

    @Autowired
    private UserRepo userRepo;

    
     @GetMapping("/user/{userId}")
    public ResponseEntity<List<Product>> getProductsByUserId(@PathVariable String userId) {
        List<Product> products = service.getProductsByUserId(userId);
        if (products == null || products.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.OK); // Return 404 if no products found
        }
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts(){
        return new ResponseEntity<>(service.getAllProducts(), HttpStatus.OK);
    }
    
    @GetMapping("/product/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable String id){

        Product product = service.getProductById(id);
        if(product != null)
            return new ResponseEntity<>(product, HttpStatus.OK);
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @PostMapping("/product")
    public ResponseEntity<?> addProduct(@RequestPart Product product,
                                        @RequestPart MultipartFile imageFile,String userid){
        try {
            Product product1 = service.addProduct(product, imageFile, userid);
            return new ResponseEntity<>(product1, HttpStatus.CREATED);
        }
        catch(Exception e){
            return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/product/{productId}/image")
    public ResponseEntity<byte[]> getImageByProductId(@PathVariable String productId){

        Product product = service.getProductById(productId);
        byte[] imageFile = product.getImageDate();

        return ResponseEntity.ok()
                .contentType(MediaType.valueOf(product.getImageType()))
                .body(imageFile);

    }

    @PutMapping("/product/{id}")
    public ResponseEntity<String> updateProduct(@PathVariable String id, @RequestPart Product product,
                                                @RequestPart MultipartFile imageFile , String currentuserid){
        if(currentuserid.equals(product.getUserId()))
        {
            Product product1 = null;
            try {
                product1 = service.updateProduct(id, product, imageFile);
            } catch (IOException e) {
                return new ResponseEntity<>("Failed to update", HttpStatus.BAD_REQUEST);
            }
            if(product1 != null)
            return new ResponseEntity<>("Updated", HttpStatus.OK);
            else
            return new ResponseEntity<>("Failed to update", HttpStatus.BAD_REQUEST);
        }
        else
        {
            return new ResponseEntity<>("You cannot have access update", HttpStatus.BAD_REQUEST);
        }
    }


    @DeleteMapping("/product/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable String id){
        Product product = service.getProductById(id);
        if(product != null) {
            service.deleteProduct(id);
            return new ResponseEntity<>("Deleted", HttpStatus.OK);
        }
        else
            return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);

    }

    @GetMapping("/products/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword){
        List<Product> products = service.searchProducts(keyword);
        // System.out.println("searching with " + keyword);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }
    @PostMapping("products/{id}/view")
    public ResponseEntity<Product> viewProduct(@PathVariable String id) {
        System.out.println("This is the id"+id);
        Product updatedProduct = service.incrementViewCount(id);
        return ResponseEntity.ok(updatedProduct);
    }

}
// package com.lokesh.ecom_proj.controller;

// import com.lokesh.ecom_proj.model.Product;
// import com.lokesh.ecom_proj.service.ProductService;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
// import org.springframework.http.MediaType;
// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.multipart.MultipartFile;

// import java.io.IOException;
// import java.util.List;
    
// @RestController
// @CrossOrigin
// @RequestMapping("/api")
// public class ProductController {

//     @Autowired
//     private ProductService service;


//     @GetMapping("/products")
//     public ResponseEntity<List<Product>> getAllProducts(){
//         return new ResponseEntity<>(service.getAllProducts(), HttpStatus.OK);
//     }
    
//     @GetMapping("/product/{id}")
//     public ResponseEntity<Product> getProduct(@PathVariable int id){

//         Product product = service.getProductById(id);

//         if(product != null)
//             return new ResponseEntity<>(product, HttpStatus.OK);
//         else
//             return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//     }

//     @PostMapping("/product")
//     public ResponseEntity<?> addProduct(@RequestPart Product product,
//                                         @RequestPart MultipartFile imageFile){
//         try {
//             System.out.println(product);
//             Product product1 = service.addProduct(product, imageFile);
//             return new ResponseEntity<>(product1, HttpStatus.CREATED);
//         }
//         catch(Exception e){
//             return new ResponseEntity<>(e.getMessage(),HttpStatus.INTERNAL_SERVER_ERROR);
//         }
//     }

//     @GetMapping("/product/{productId}/image")
//     public ResponseEntity<byte[]> getImageByProductId(@PathVariable int productId){

//         Product product = service.getProductById(productId);
//         byte[] imageFile = product.getImageDate();

//         return ResponseEntity.ok()
//                 .contentType(MediaType.valueOf(product.getImageType()))
//                 .body(imageFile);

//     }

//     @PutMapping("/product/{id}")
//     public ResponseEntity<String> updateProduct(@PathVariable int id, @RequestPart Product product,
//                                                 @RequestPart MultipartFile imageFile){
//         Product product1 = null;
//         try {
//             product1 = service.updateProduct(id, product, imageFile);
//         } catch (IOException e) {
//             return new ResponseEntity<>("Failed to update", HttpStatus.BAD_REQUEST);
//         }
//         if(product1 != null)
//             return new ResponseEntity<>("Updated", HttpStatus.OK);
//         else
//             return new ResponseEntity<>("Failed to update", HttpStatus.BAD_REQUEST);
//     }


//     @DeleteMapping("/product/{id}")
//     public ResponseEntity<String> deleteProduct(@PathVariable int id){
//         Product product = service.getProductById(id);
//         if(product != null) {
//             service.deleteProduct(id);
//             return new ResponseEntity<>("Deleted", HttpStatus.OK);
//         }
//         else
//             return new ResponseEntity<>("Product not found", HttpStatus.NOT_FOUND);

//     }

//     @GetMapping("/products/search")
//     public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword){
//         List<Product> products = service.searchProducts(keyword);
//         System.out.println("searching with " + keyword);
//         return new ResponseEntity<>(products, HttpStatus.OK);
//     }


// }