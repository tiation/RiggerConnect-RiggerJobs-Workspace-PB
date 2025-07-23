package com.tiation.riggerhire.ui

import android.os.Bundle
import android.util.Log
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.tiation.riggerhire.ui.auth.AuthViewModel
import com.tiation.riggerhire.ui.navigation.RiggerHireNavHost
import com.tiation.riggerhire.ui.navigation.Screen
import com.tiation.riggerhire.ui.theme.RiggerHireTheme

/**
 * MainActivity for RiggerHire Android App
 * Features dark neon theme with enterprise-grade UI
 */
class MainActivity : ComponentActivity() {
    
    companion object {
        const val TAG = "MainActivity"
    }
    
    private val authViewModel: AuthViewModel by viewModels()
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        Log.d(TAG, "🏗️ RiggerHire MainActivity launched")
        
        setContent {
            RiggerHireTheme {
                val navController = rememberNavController()
                val authState by authViewModel.authState.collectAsState()
                
                // Determine start destination based on auth state
                val startDestination = when {
                    authState.isAuthenticated -> Screen.Jobs.route
                    else -> Screen.SplashScreen.route
                }
                
                RiggerHireNavHost(
                    navController = navController,
                    startDestination = startDestination
                )
            }
        }
    }
    
}
