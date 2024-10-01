package com.lokesh.ecom_proj.service;

import com.lokesh.ecom_proj.model.Product;
import com.lokesh.ecom_proj.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class ProductService {

    @Autowired
    private ProductRepo repo;

    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    public Product getProductById(String id) {  // Changed to String
        return repo.findById(id).orElse(null);
    }

    public Product addProduct(Product product, MultipartFile imageFile, String userid) throws IOException {
        if (imageFile != null) {
            product.setUserId(product.getUserId());
            product.setImageName(imageFile.getOriginalFilename());
            product.setImageType(imageFile.getContentType());
            product.setImageDate(imageFile.getBytes());
            product.setUserId(userid);
            // product.setUserId("66f77627abfbd9561c15a4ac");
        }
        return repo.save(product);
    }

    public Product updateProduct(String id, Product product, MultipartFile imageFile) throws IOException {
        // Retrieve existing product first
        Product existingProduct = getProductById(id);
        if (existingProduct != null) {
            if (imageFile != null) {
                existingProduct.setImageDate(imageFile.getBytes());
                existingProduct.setImageName(imageFile.getOriginalFilename());
                existingProduct.setImageType(imageFile.getContentType());
            }
            // Update other fields of the existing product as needed
            existingProduct.setName(product.getName());
            existingProduct.setDescription(product.getDescription());
            existingProduct.setBrand(product.getBrand());
            existingProduct.setCategory(product.getCategory());
            existingProduct.setPrice(product.getPrice());
            return repo.save(existingProduct);
        }
        return null;  // Or throw an exception if not found
    }

    public void deleteProduct(String id) {  // Changed to String
        repo.deleteById(id);
    }

    public List<Product> searchProducts(String keyword) {
        return repo.searchProducts(keyword);
    }
    public List<Product> getProductsByUserId(String userId) {
        List<Product> result = repo.findByUserId(userId);
        if(result == null || result.isEmpty()) {
            System.out.println("No products found for userId: " + userId);
        } 
        return result;
    }
    
}

// package com.lokesh.ecom_proj.service;

// import com.lokesh.ecom_proj.model.Product;
// import com.lokesh.ecom_proj.repo.ProductRepo;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Service;
// import org.springframework.web.multipart.MultipartFile;

// import java.io.IOException;
// import java.util.List;

// @Service
// public class ProductService {

//     @Autowired
//     private ProductRepo repo;

//     public List<Product> getAllProducts() {

//         return repo.findAll();

//     }

//     public Product getProductById(int id) {
//         return repo.findById(id).orElse(null);
//     }

//     public Product addProduct(Product product, MultipartFile imageFile) throws IOException {
//         product.setImageName(imageFile.getOriginalFilename());
//         product.setImageType(imageFile.getContentType());
//         product.setImageDate(imageFile.getBytes());
//         return repo.save(product);
//     }

//     public Product updateProduct(int id, Product product, MultipartFile imageFile) throws IOException {
//         product.setImageDate(imageFile.getBytes());
//         product.setImageName(imageFile.getOriginalFilename());
//         product.setImageType(imageFile.getContentType());
//         return repo.save(product);
//     }

//     public void deleteProduct(int id) {
//         repo.deleteById(id);
//     }

//     public List<Product> searchProducts(String keyword) {
//         return repo.searchProducts(keyword);
//     }
// }