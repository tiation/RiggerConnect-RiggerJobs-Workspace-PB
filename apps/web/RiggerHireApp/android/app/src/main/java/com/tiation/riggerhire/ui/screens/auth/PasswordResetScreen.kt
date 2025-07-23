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

/**
 * PasswordReset Screen for RiggerHire Android App
 * Provides users with the ability to reset their password securely
 */
@Composable
fun PasswordResetScreen(navController: NavHostController) {
    var newPassword by remember { mutableStateOf("") }
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
                text = "Create New Password",
                fontSize = 32.sp,
                fontWeight = FontWeight.Bold,
                color = RiggerHireColors.NeonCyan,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(16.dp))

            Text(
                text = "Enter your new password to reset",
                fontSize = 16.sp,
                color = RiggerHireColors.TextSecondary,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(32.dp))

            // New Password Input
            OutlinedTextField(
                value = newPassword,
                onValueChange = {
                    newPassword = it
                    errorMessage = null
                },
                label = { Text("New Password") },
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
                    if (validatePassword(newPassword)) {
                        isLoading = true
                        // TODO: Implement actual password reset logic
                        navController.navigate("success")
                    } else {
                        errorMessage = "Password must be at least 8 characters"
                    }
                },
                enabled = !isLoading && newPassword.isNotBlank(),
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
                        text = "Reset Password",
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

private fun validatePassword(password: String): Boolean {
    return password.length >= 8
}

