package com.tiation.riggerhire.ui.onboarding

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tiation.riggerhire.R
import com.tiation.riggerhire.ui.theme.RiggerHireTheme

/**
 * Onboarding Welcome Screen
 * First screen users see when opening the app
 * Features dark neon theme with cyan/magenta gradients
 */
class OnboardingWelcomeActivity : ComponentActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        setContent {
            RiggerHireTheme {
                OnboardingWelcomeScreen()
            }
        }
    }
    
    @Composable
    fun OnboardingWelcomeScreen() {
        val context = LocalContext.current
        
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = Color(0xFF0D0D0D) // dark_background
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                Spacer(modifier = Modifier.height(48.dp))
                
                // Hero Section
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    // App Logo/Icon
                    Box(
                        modifier = Modifier
                            .size(120.dp)
                            .background(
                                Brush.radialGradient(
                                    colors = listOf(
                                        Color(0xFF00FFFF).copy(alpha = 0.3f),
                                        Color(0xFFFF00FF).copy(alpha = 0.1f)
                                    )
                                ),
                                RoundedCornerShape(30.dp)
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "🏗️",
                            fontSize = 48.sp
                        )
                    }
                    
                    Spacer(modifier = Modifier.height(32.dp))
                    
                    Text(
                        text = "Welcome to RiggerHire",
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFFFFFFF),
                        textAlign = TextAlign.Center
                    )
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    Text(
                        text = "Australia's Premier\nRigging Jobs Platform",
                        fontSize = 20.sp,
                        color = Color(0xFF00FFFF),
                        textAlign = TextAlign.Center,
                        lineHeight = 28.sp
                    )
                    
                    Spacer(modifier = Modifier.height(24.dp))
                    
                    Text(
                        text = "Connecting certified riggers with mining, construction, and industrial projects across the Pilbara region",
                        fontSize = 16.sp,
                        color = Color(0xFFB3B3B3),
                        textAlign = TextAlign.Center,
                        lineHeight = 24.sp
                    )
                }
                
                // Feature Highlights
                Column(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    FeatureHighlight(
                        icon = "🔍",
                        title = "Smart Job Matching",
                        description = "AI-powered recommendations based on your skills"
                    )
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    FeatureHighlight(
                        icon = "📍",
                        title = "Location-Based Jobs",
                        description = "Find opportunities near you with GPS discovery"
                    )
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    FeatureHighlight(
                        icon = "💰",
                        title = "Transparent Rates",
                        description = "See exact pay rates upfront, no hidden fees"
                    )
                }
                
                // Action Button
                Button(
                    onClick = { 
                        context.startActivity(
                            Intent(context, OnboardingPermissionsActivity::class.java)
                        )
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFF00FFFF)
                    ),
                    shape = RoundedCornerShape(16.dp)
                ) {
                    Text(
                        text = "Get Started",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF0D0D0D)
                    )
                }
                
                Spacer(modifier = Modifier.height(24.dp))
            }
        }
    }
    
    @Composable
    fun FeatureHighlight(
        icon: String,
        title: String,
        description: String
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = icon,
                fontSize = 24.sp,
                modifier = Modifier.padding(end = 16.dp)
            )
            
            Column {
                Text(
                    text = title,
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFFFFFFFF)
                )
                Text(
                    text = description,
                    fontSize = 14.sp,
                    color = Color(0xFFB3B3B3),
                    lineHeight = 20.sp
                )
            }
        }
    }
}
