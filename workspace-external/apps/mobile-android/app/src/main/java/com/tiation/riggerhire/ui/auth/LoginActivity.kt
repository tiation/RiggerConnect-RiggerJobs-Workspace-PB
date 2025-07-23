package com.tiation.riggerhire.ui.auth

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricPrompt
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import androidx.fragment.app.FragmentActivity
import com.tiation.riggerhire.ui.theme.RiggerHireTheme
import com.tiation.riggerhire.ui.MainActivity
import java.util.concurrent.Executor

/**
 * Enhanced Login Activity
 * Features biometric authentication, JWT token handling, and dark neon theme
 */
class LoginActivity : ComponentActivity() {
    
    private lateinit var executor: Executor
    private lateinit var biometricPrompt: BiometricPrompt
    private lateinit var promptInfo: BiometricPrompt.PromptInfo
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        setupBiometricAuth()
        
        setContent {
            RiggerHireTheme {
                LoginScreen()
            }
        }
    }
    
    @OptIn(ExperimentalMaterial3Api::class)
    @Composable
    fun LoginScreen() {
        val context = LocalContext.current
        var email by remember { mutableStateOf("") }
        var password by remember { mutableStateOf("") }
        var passwordVisible by remember { mutableStateOf(false) }
        var isLoading by remember { mutableStateOf(false) }
        var errorMessage by remember { mutableStateOf("") }
        var rememberMe by remember { mutableStateOf(false) }
        
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = Color(0xFF0D0D0D)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                // Header Section
                Box(
                    modifier = Modifier
                        .size(100.dp)
                        .background(
                            Brush.radialGradient(
                                colors = listOf(
                                    Color(0xFF00FFFF).copy(alpha = 0.3f),
                                    Color(0xFFFF00FF).copy(alpha = 0.1f)
                                )
                            ),
                            RoundedCornerShape(25.dp)
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "🏗️",
                        fontSize = 40.sp
                    )
                }
                
                Spacer(modifier = Modifier.height(24.dp))
                
                Text(
                    text = "Welcome Back",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFFFFFFFF)
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                Text(
                    text = "Sign in to find your next rigging job",
                    fontSize = 16.sp,
                    color = Color(0xFFB3B3B3),
                    textAlign = TextAlign.Center
                )
                
                Spacer(modifier = Modifier.height(40.dp))
                
                // Email Field
                OutlinedTextField(
                    value = email,
                    onValueChange = { 
                        email = it
                        errorMessage = ""
                    },
                    label = { Text("Email", color = Color(0xFF00FFFF)) },
                    leadingIcon = {
                        Icon(
                            Icons.Default.Email,
                            contentDescription = null,
                            tint = Color(0xFF00FFFF)
                        )
                    },
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Color(0xFF00FFFF),
                        unfocusedBorderColor = Color(0xFF404040),
                        focusedTextColor = Color(0xFFFFFFFF),
                        unfocusedTextColor = Color(0xFFB3B3B3),
                        cursorColor = Color(0xFF00FFFF)
                    ),
                    shape = RoundedCornerShape(12.dp),
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.Email,
                        imeAction = ImeAction.Next
                    ),
                    singleLine = true
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Password Field
                OutlinedTextField(
                    value = password,
                    onValueChange = { 
                        password = it
                        errorMessage = ""
                    },
                    label = { Text("Password", color = Color(0xFF00FFFF)) },
                    leadingIcon = {
                        Icon(
                            Icons.Default.Lock,
                            contentDescription = null,
                            tint = Color(0xFF00FFFF)
                        )
                    },
                    trailingIcon = {
                        IconButton(onClick = { passwordVisible = !passwordVisible }) {
                            Icon(
                                if (passwordVisible) Icons.Default.Visibility else Icons.Default.VisibilityOff,
                                contentDescription = null,
                                tint = Color(0xFF00FFFF)
                            )
                        }
                    },
                    visualTransformation = if (passwordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = Color(0xFF00FFFF),
                        unfocusedBorderColor = Color(0xFF404040),
                        focusedTextColor = Color(0xFFFFFFFF),
                        unfocusedTextColor = Color(0xFFB3B3B3),
                        cursorColor = Color(0xFF00FFFF)
                    ),
                    shape = RoundedCornerShape(12.dp),
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.Password,
                        imeAction = ImeAction.Done
                    ),
                    singleLine = true
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Remember Me and Forgot Password Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.clickable { rememberMe = !rememberMe }
                    ) {
                        Checkbox(
                            checked = rememberMe,
                            onCheckedChange = { rememberMe = it },
                            colors = CheckboxDefaults.colors(
                                checkedColor = Color(0xFF00FFFF),
                                uncheckedColor = Color(0xFF404040),
                                checkmarkColor = Color(0xFF0D0D0D)
                            )
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Remember me",
                            color = Color(0xFFB3B3B3),
                            fontSize = 14.sp
                        )
                    }
                    
                    Text(
                        text = "Forgot Password?",
                        color = Color(0xFF00FFFF),
                        fontSize = 14.sp,
                        modifier = Modifier.clickable {
                            context.startActivity(Intent(context, ForgotPasswordActivity::class.java))
                        }
                    )
                }
                
                if (errorMessage.isNotEmpty()) {
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = errorMessage,
                        color = Color(0xFFFF073A),
                        fontSize = 14.sp,
                        textAlign = TextAlign.Center
                    )
                }
                
                Spacer(modifier = Modifier.height(32.dp))
                
                // Login Button
                Button(
                    onClick = { 
                        isLoading = true
                        performLogin(email, password, rememberMe) { success, error ->
                            isLoading = false
                            if (success) {
                                context.startActivity(Intent(context, MainActivity::class.java))
                                finish()
                            } else {
                                errorMessage = error ?: "Login failed"
                            }
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFF00FFFF)
                    ),
                    shape = RoundedCornerShape(16.dp),
                    enabled = !isLoading && email.isNotBlank() && password.isNotBlank()
                ) {
                    if (isLoading) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(20.dp),
                            color = Color(0xFF0D0D0D),
                            strokeWidth = 2.dp
                        )
                    } else {
                        Text(
                            text = "Sign In",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF0D0D0D)
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Biometric Login Button (if available)
                if (BiometricManager.from(context).canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_WEAK) == BiometricManager.BIOMETRIC_SUCCESS) {
                    OutlinedButton(
                        onClick = { showBiometricPrompt() },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(56.dp),
                        colors = ButtonDefaults.outlinedButtonColors(
                            contentColor = Color(0xFFFF00FF)
                        ),
                        border = androidx.compose.foundation.BorderStroke(
                            2.dp, Color(0xFFFF00FF)
                        ),
                        shape = RoundedCornerShape(16.dp)
                    ) {
                        Icon(
                            Icons.Default.Fingerprint,
                            contentDescription = null,
                            tint = Color(0xFFFF00FF),
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Use Biometric Login",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    
                    Spacer(modifier = Modifier.height(24.dp))
                }
                
                // Divider
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Divider(
                        modifier = Modifier.weight(1f),
                        color = Color(0xFF404040)
                    )
                    Text(
                        text = "  or  ",
                        color = Color(0xFFB3B3B3),
                        fontSize = 14.sp
                    )
                    Divider(
                        modifier = Modifier.weight(1f),
                        color = Color(0xFF404040)
                    )
                }
                
                Spacer(modifier = Modifier.height(24.dp))
                
                // Register Link
                Row {
                    Text(
                        text = "Don't have an account? ",
                        color = Color(0xFFB3B3B3),
                        fontSize = 14.sp
                    )
                    Text(
                        text = "Sign Up",
                        color = Color(0xFF00FFFF),
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.clickable {
                            context.startActivity(Intent(context, RegisterActivity::class.java))
                        }
                    )
                }
            }
        }
    }
    
    private fun setupBiometricAuth() {
        executor = ContextCompat.getMainExecutor(this)
        biometricPrompt = BiometricPrompt(this as FragmentActivity, executor,
            object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    super.onAuthenticationError(errorCode, errString)
                    // Handle authentication error
                }
                
                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    super.onAuthenticationSucceeded(result)
                    // Authentication succeeded - proceed to main app
                    startActivity(Intent(this@LoginActivity, MainActivity::class.java))
                    finish()
                }
                
                override fun onAuthenticationFailed() {
                    super.onAuthenticationFailed()
                    // Handle authentication failure
                }
            })
        
        promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle("Biometric Login")
            .setSubtitle("Use your fingerprint or face to sign in")
            .setNegativeButtonText("Use Password")
            .build()
    }
    
    private fun showBiometricPrompt() {
        biometricPrompt.authenticate(promptInfo)
    }
    
    private fun performLogin(
        email: String, 
        password: String, 
        rememberMe: Boolean,
        callback: (Boolean, String?) -> Unit
    ) {
        // TODO: Implement actual login logic with JWT authentication
        // This would typically involve:
        // 1. Validate input
        // 2. Call authentication API
        // 3. Store JWT token securely
        // 4. Handle success/error cases
        
        // Simulated login for demo
        if (email.contains("@") && password.length >= 6) {
            callback(true, null)
        } else {
            callback(false, "Invalid email or password")
        }
    }
}
