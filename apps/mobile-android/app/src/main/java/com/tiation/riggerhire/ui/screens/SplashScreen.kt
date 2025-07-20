package com.tiation.riggerhire.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Construction
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.tiation.riggerhire.ui.navigation.Screen
import com.tiation.riggerhire.ui.theme.RiggerHireColors
import kotlinx.coroutines.delay

/**
 * Splash Screen for RiggerHire Android App
 * Shows app logo and branding with dark neon theme
 */
@Composable
fun SplashScreen(navController: NavHostController) {
    LaunchedEffect(Unit) {
        delay(2000) // Show splash for 2 seconds
        navController.navigate(Screen.Login.route) {
            popUpTo(Screen.SplashScreen.route) { inclusive = true }
        }
    }
    
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.radialGradient(
                    colors = listOf(
                        RiggerHireColors.DarkBackground,
                        RiggerHireColors.DarkSurface.copy(alpha = 0.8f),
                        RiggerHireColors.DarkBackground
                    )
                )
            ),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            // App Icon
            Icon(
                imageVector = Icons.Default.Construction,
                contentDescription = "RiggerHire Logo",
                modifier = Modifier.size(120.dp),
                tint = RiggerHireColors.NeonCyan
            )
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // App Name
            Text(
                text = "🏗️ RiggerHire",
                fontSize = 36.sp,
                fontWeight = FontWeight.Bold,
                color = RiggerHireColors.NeonCyan
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            // Tagline
            Text(
                text = "Connect. Work. Succeed.",
                fontSize = 18.sp,
                color = RiggerHireColors.NeonMagenta,
                fontWeight = FontWeight.Medium
            )
            
            Spacer(modifier = Modifier.height(32.dp))
            
            // Loading indicator
            CircularProgressIndicator(
                color = RiggerHireColors.NeonCyan,
                strokeWidth = 3.dp,
                modifier = Modifier.size(32.dp)
            )
        }
        
        // Footer
        Column(
            modifier = Modifier.align(Alignment.BottomCenter),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = "🏗️ Built for Western Australia's Mining Industry",
                fontSize = 14.sp,
                color = RiggerHireColors.TextSecondary,
                fontWeight = FontWeight.Medium
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = "© 2024 Tiation • Enterprise-Grade Security",
                fontSize = 12.sp,
                color = RiggerHireColors.TextSecondary
            )
            
            Spacer(modifier = Modifier.height(48.dp))
        }
    }
}
