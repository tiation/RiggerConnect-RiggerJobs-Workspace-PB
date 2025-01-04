package com.riggerjobs.services;

import android.content.Context;
import android.net.Uri;
import android.util.Log;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class DocumentVerificationService {
    private static final String TAG = "DocVerificationService";
    private final Context context;
    
    public DocumentVerificationService(Context context) {
        this.context = context;
    }
    
    public boolean verifyDocument(Uri documentUri, String expectedHash) {
        try {
            String actualHash = calculateDocumentHash(documentUri);
            return actualHash.equals(expectedHash);
        } catch (Exception e) {
            Log.e(TAG, "Document verification failed", e);
            return false;
        }
    }
    
    private String calculateDocumentHash(Uri documentUri) throws IOException, NoSuchAlgorithmException {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] fileBytes = context.getContentResolver()
                .openInputStream(documentUri)
                .readAllBytes();
            byte[] hash = digest.digest(fileBytes);
            
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (FileNotFoundException e) {
            Log.e(TAG, "Document not found", e);
            throw e;
        }
    }
}

