package com.tiation.riggerhire.ui.onboarding

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.core.content.ContextCompat
import com.tiation.riggerhire.ui.theme.RiggerHireTheme
import com.tiation.riggerhire.ui.auth.LoginActivity

/**
 * Onboarding Permissions Screen
 * Requests essential permissions for location and notifications
 */
class OnboardingPermissionsActivity : ComponentActivity() {
    
    private val permissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { permissions ->
        // Handle permission results
        val allGranted = permissions.all { it.value }
        if (allGranted) {
            proceedToLogin()
        }
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        setContent {
            RiggerHireTheme {
                OnboardingPermissionsScreen()
            }
        }
    }
    
    @Composable
    fun OnboardingPermissionsScreen() {
        val context = LocalContext.current
        
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = Color(0xFF0D0D0D)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Spacer(modifier = Modifier.height(48.dp))
                    
                    Text(
                        text = "🔐",
                        fontSize = 64.sp,
                        modifier = Modifier.padding(bottom = 24.dp)
                    )
                    
                    Text(
                        text = "Permissions Required",
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFFFFFFF),
                        textAlign = TextAlign.Center
                    )
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    Text(
                        text = "To provide the best job matching experience, we need access to the following:",
                        fontSize = 16.sp,
                        color = Color(0xFFB3B3B3),
                        textAlign = TextAlign.Center,
                        lineHeight = 24.sp
                    )
                    
                    Spacer(modifier = Modifier.height(40.dp))
                    
                    // Permission Cards
                    PermissionCard(
                        icon = Icons.Default.LocationOn,
                        title = "Location Access",
                        description = "Find jobs near you and calculate distances to work sites",
                        importance = "Essential for job matching"
                    )
                    
                    Spacer(modifier = Modifier.height(20.dp))
                    
                    PermissionCard(
                        icon = Icons.Default.Notifications,
                        title = "Push Notifications",
                        description = "Get instant alerts when new jobs match your profile",
                        importance = "Stay updated with opportunities"
                    )
                    
                    Spacer(modifier = Modifier.height(20.dp))
                    
                    PermissionCard(
                        icon = Icons.Default.CameraAlt,
                        title = "Camera Access",
                        description = "Upload photos of certifications and work documents",
                        importance = "Optional - for profile verification"
                    )
                }
                
                Column(
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Button(
                        onClick = { requestPermissions() },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(56.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = Color(0xFF00FFFF)
                        ),
                        shape = RoundedCornerShape(16.dp)
                    ) {
                        Text(
                            text = "Grant Permissions",
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF0D0D0D)
                        )
                    }
                    
                    Spacer(modifier = Modifier.height(12.dp))
                    
                    OutlinedButton(
                        onClick = { proceedToLogin() },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(56.dp),
                        colors = ButtonDefaults.outlinedButtonColors(
                            contentColor = Color(0xFF00FFFF)
                        ),
                        border = androidx.compose.foundation.BorderStroke(
                            2.dp, Color(0xFF00FFFF)
                        ),
                        shape = RoundedCornerShape(16.dp)
                    ) {
                        Text(
                            text = "Maybe Later",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                    
                    Spacer(modifier = Modifier.height(24.dp))
                }
            }
        }
    }
    
    @Composable
    fun PermissionCard(
        icon: ImageVector,
        title: String,
        description: String,
        importance: String
    ) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = Color(0xFF1A1A1A)
            ),
            shape = RoundedCornerShape(16.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(20.dp),
                verticalAlignment = Alignment.Top
            ) {
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .background(
                            Color(0xFF00FFFF).copy(alpha = 0.2f),
                            RoundedCornerShape(12.dp)
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = icon,
                        contentDescription = null,
                        tint = Color(0xFF00FFFF),
                        modifier = Modifier.size(24.dp)
                    )
                }
                
                Spacer(modifier = Modifier.width(16.dp))
                
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = title,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFFFFFFF)
                    )
                    
                    Spacer(modifier = Modifier.height(4.dp))
                    
                    Text(
                        text = description,
                        fontSize = 14.sp,
                        color = Color(0xFFB3B3B3),
                        lineHeight = 20.sp
                    )
                    
                    Spacer(modifier = Modifier.height(8.dp))
                    
                    Text(
                        text = importance,
                        fontSize = 12.sp,
                        color = Color(0xFF00FFFF),
                        fontWeight = FontWeight.Medium
                    )
                }
            }
        }
    }
    
    private fun requestPermissions() {
        val permissions = arrayOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION,
            Manifest.permission.CAMERA,
            Manifest.permission.POST_NOTIFICATIONS
        )
        
        permissionLauncher.launch(permissions)
    }
    
    private fun proceedToLogin() {
        startActivity(Intent(this, LoginActivity::class.java))
        finish()
    }
}
