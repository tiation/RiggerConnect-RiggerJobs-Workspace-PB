package com.tiation.riggerhire.ui.screens.auth

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.tiation.riggerhire.ui.theme.RiggerHireColors
import com.tiation.riggerhire.ui.navigation.Screen

/**
 * ForgotPassword Screen for RiggerHire Android App
 * Implements enterprise-grade password reset flow with proper validation
 */
@Composable
fun ForgotPasswordScreen(navController: NavHostController) {
    var email by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = RiggerHireColors.DarkBackground
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // Header
            Text(
                text = "Reset Password",
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold,
                color = RiggerHireColors.NeonCyan,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Enter your email address to receive password reset instructions",
                fontSize = 16.sp,
                color = RiggerHireColors.TextSecondary,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(32.dp))

            // Email Input
            OutlinedTextField(
                value = email,
                onValueChange = { 
                    email = it
                    errorMessage = null
                },
                label = { Text("Email Address") },
                singleLine = true,
                isError = errorMessage != null,
                supportingText = errorMessage?.let { 
                    { Text(text = it, color = RiggerHireColors.NeonRed) }
                },
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = RiggerHireColors.NeonCyan,
                    unfocusedBorderColor = RiggerHireColors.BorderPrimary,
                    focusedLabelColor = RiggerHireColors.NeonCyan,
                    unfocusedLabelColor = RiggerHireColors.TextSecondary,
                    cursorColor = RiggerHireColors.NeonCyan,
                    textColor = RiggerHireColors.TextPrimary
                ),
                modifier = Modifier.fillMaxWidth()
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Reset Button
            Button(
                onClick = {
                    if (validateEmail(email)) {
                        isLoading = true
                        // TODO: Implement actual password reset logic
                        // For now, simulate API call
                        navController.navigate(Screen.PasswordReset.route)
                    } else {
                        errorMessage = "Please enter a valid email address"
                    }
                },
                enabled = !isLoading && email.isNotBlank(),
                shape = RoundedCornerShape(8.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = RiggerHireColors.NeonCyan,
                    contentColor = RiggerHireColors.TextOnNeon,
                    disabledContainerColor = RiggerHireColors.NeonCyan.copy(alpha = 0.5f)
                ),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(56.dp)
            ) {
                if (isLoading) {
                    CircularProgressIndicator(
                        color = RiggerHireColors.TextOnNeon,
                        modifier = Modifier.size(24.dp)
                    )
                } else {
                    Text(
                        text = "Send Reset Instructions",
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Back to Login
            TextButton(
                onClick = { navController.navigateUp() },
                colors = ButtonDefaults.textButtonColors(
                    contentColor = RiggerHireColors.TextSecondary
                )
            ) {
                Text(
                    text = "Back to Login",
                    fontSize = 16.sp
                )
            }
        }
    }
}

private fun validateEmail(email: String): Boolean {
    val emailRegex = "[a-zA-Z0-9._-]+@[a-z]+\\.+[a-z]+".toRegex()
    return email.matches(emailRegex)
}
