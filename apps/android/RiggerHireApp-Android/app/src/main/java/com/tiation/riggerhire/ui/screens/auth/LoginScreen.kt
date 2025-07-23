package com.tiation.riggerhire.ui.screens.auth

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.blur
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.tiation.riggerhire.ui.theme.RiggerHireColors

/**
 * Login Screen for RiggerHire Android App
 * Matches iOS LoginView.swift with dark neon theme
 */
@Composable
fun LoginScreen(navController: NavHostController) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var isPasswordVisible by remember { mutableStateOf(false) }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        RiggerHireColors.DarkBackground,
                        RiggerHireColors.DarkSurface.copy(alpha = 0.8f),
                        RiggerHireColors.DarkBackground
                    )
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Spacer(modifier = Modifier.height(60.dp))
            
            // Logo and Title Section
            LogoSection()
            
            Spacer(modifier = Modifier.height(48.dp))
            
            // Login Form
            LoginForm(
                email = email,
                password = password,
                isPasswordVisible = isPasswordVisible,
                isLoading = isLoading,
                errorMessage = errorMessage,
                onEmailChange = { email = it },
                onPasswordChange = { password = it },
                onPasswordVisibilityToggle = { isPasswordVisible = !isPasswordVisible },
                onLoginClick = {
                    isLoading = true
                    errorMessage = null
                    // TODO: Implement actual login logic
                    // For now, simulate login
                    isLoading = false
                },
                onForgotPasswordClick = {
                    // TODO: Navigate to forgot password screen
                }
            )
            
            Spacer(modifier = Modifier.height(32.dp))
            
            // Register Section
            RegisterPrompt(
                onRegisterClick = {
                    // TODO: Navigate to register screen
                }
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // Footer
            FooterSection()
        }
    }
}

@Composable
private fun LogoSection() {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        // App Logo/Icon
        Box(
            modifier = Modifier
                .size(100.dp)
                .background(
                    brush = Brush.radialGradient(
                        colors = listOf(
                            RiggerHireColors.NeonCyan.copy(alpha = 0.3f),
                            RiggerHireColors.NeonMagenta.copy(alpha = 0.2f),
                            Color.Transparent
                        )
                    ),
                    shape = RoundedCornerShape(20.dp)
                ),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = Icons.Default.Construction,
                contentDescription = "RiggerHire Logo",
                modifier = Modifier.size(60.dp),
                tint = RiggerHireColors.NeonCyan
            )
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        // App Name
        Text(
            text = "🏗️ RiggerHire",
            fontSize = 32.sp,
            fontWeight = FontWeight.Bold,
            color = RiggerHireColors.NeonCyan
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        // Tagline
        Text(
            text = "Connect with Western Australia's\nMining & Construction Industry",
            fontSize = 16.sp,
            color = RiggerHireColors.TextSecondary,
            textAlign = TextAlign.Center,
            lineHeight = 22.sp
        )
    }
}

@Composable
private fun LoginForm(
    email: String,
    password: String,
    isPasswordVisible: Boolean,
    isLoading: Boolean,
    errorMessage: String?,
    onEmailChange: (String) -> Unit,
    onPasswordChange: (String) -> Unit,
    onPasswordVisibilityToggle: () -> Unit,
    onLoginClick: () -> Unit,
    onForgotPasswordClick: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(
            containerColor = RiggerHireColors.DarkSurface.copy(alpha = 0.7f)
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 12.dp)
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp)
        ) {
            Text(
                text = "Welcome Back",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = RiggerHireColors.TextPrimary
            )
            
            Text(
                text = "Sign in to your account",
                fontSize = 16.sp,
                color = RiggerHireColors.TextSecondary,
                modifier = Modifier.padding(bottom = 32.dp)
            )
            
            // Email Field
            OutlinedTextField(
                value = email,
                onValueChange = onEmailChange,
                label = { Text("Email", color = RiggerHireColors.TextSecondary) },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Email,
                        contentDescription = "Email",
                        tint = RiggerHireColors.NeonCyan
                    )
                },
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = RiggerHireColors.NeonCyan,
                    unfocusedBorderColor = RiggerHireColors.BorderPrimary,
                    focusedTextColor = RiggerHireColors.TextPrimary,
                    unfocusedTextColor = RiggerHireColors.TextPrimary,
                    cursorColor = RiggerHireColors.NeonCyan
                )
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Password Field
            OutlinedTextField(
                value = password,
                onValueChange = onPasswordChange,
                label = { Text("Password", color = RiggerHireColors.TextSecondary) },
                leadingIcon = {
                    Icon(
                        imageVector = Icons.Default.Lock,
                        contentDescription = "Password",
                        tint = RiggerHireColors.NeonCyan
                    )
                },
                trailingIcon = {
                    IconButton(onClick = onPasswordVisibilityToggle) {
                        Icon(
                            imageVector = if (isPasswordVisible) Icons.Default.VisibilityOff else Icons.Default.Visibility,
                            contentDescription = if (isPasswordVisible) "Hide password" else "Show password",
                            tint = RiggerHireColors.TextSecondary
                        )
                    }
                },
                visualTransformation = if (isPasswordVisible) VisualTransformation.None else PasswordVisualTransformation(),
                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = RiggerHireColors.NeonCyan,
                    unfocusedBorderColor = RiggerHireColors.BorderPrimary,
                    focusedTextColor = RiggerHireColors.TextPrimary,
                    unfocusedTextColor = RiggerHireColors.TextPrimary,
                    cursorColor = RiggerHireColors.NeonCyan
                )
            )
            
            // Forgot Password
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 8.dp),
                horizontalArrangement = Arrangement.End
            ) {
                TextButton(onClick = onForgotPasswordClick) {
                    Text(
                        text = "Forgot Password?",
                        color = RiggerHireColors.NeonCyan
                    )
                }
            }
            
            // Error Message
            errorMessage?.let { error ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = RiggerHireColors.NeonRed.copy(alpha = 0.1f)
                    )
                ) {
                    Text(
                        text = error,
                        color = RiggerHireColors.NeonRed,
                        modifier = Modifier.padding(12.dp),
                        fontSize = 14.sp
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // Login Button
            Button(
                onClick = onLoginClick,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp),
                shape = RoundedCornerShape(12.dp),
                enabled = !isLoading && email.isNotBlank() && password.isNotBlank(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = RiggerHireColors.NeonCyan,
                    contentColor = RiggerHireColors.TextOnNeon
                )
            ) {
                if (isLoading) {
                    Row(
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(20.dp),
                            color = RiggerHireColors.TextOnNeon,
                            strokeWidth = 2.dp
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Signing In...", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    }
                } else {
                    Row(
                        horizontalArrangement = Arrangement.Center,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.Login,
                            contentDescription = null,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Sign In", fontSize = 16.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
private fun RegisterPrompt(onRegisterClick: () -> Unit) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "Don't have an account?",
            color = RiggerHireColors.TextSecondary,
            fontSize = 16.sp
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        OutlinedButton(
            onClick = onRegisterClick,
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(12.dp),
            colors = ButtonDefaults.outlinedButtonColors(
                contentColor = RiggerHireColors.NeonMagenta
            ),
            border = androidx.compose.foundation.BorderStroke(
                2.dp,
                RiggerHireColors.NeonMagenta
            )
        ) {
            Row(
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    imageVector = Icons.Default.PersonAdd,
                    contentDescription = null,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text("Create Account", fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
private fun FooterSection() {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "🔐 Enterprise-Grade Security",
            fontSize = 14.sp,
            color = RiggerHireColors.NeonCyan,
            fontWeight = FontWeight.Medium
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Text(
            text = "Your data is protected with industry-leading\nencryption and security practices",
            fontSize = 12.sp,
            color = RiggerHireColors.TextSecondary,
            textAlign = TextAlign.Center,
            lineHeight = 16.sp
        )
    }
}
