package com.tiation.riggerhire.ui.navigation

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.tiation.riggerhire.ui.theme.RiggerHireColors
import com.tiation.riggerhire.ui.screens.SplashScreen
import com.tiation.riggerhire.ui.screens.auth.LoginScreen
import com.tiation.riggerhire.ui.screens.auth.RegisterScreen
import com.tiation.riggerhire.ui.screens.jobs.JobsListScreen
import com.tiation.riggerhire.ui.screens.profile.ProfileScreen

/**
 * Navigation structure for RiggerHire Android App
 * Matches the comprehensive iOS navigation with 47 screens
 */

// Navigation destinations matching iOS views
sealed class Screen(val route: String, val title: String, val icon: ImageVector? = null) {
    
    // Main Tab Navigation
    object Jobs : Screen("jobs", "Jobs", Icons.Default.Work)
    object MyJobs : Screen("my_jobs", "My Jobs", Icons.Default.Assignment)
    object Profile : Screen("profile", "Profile", Icons.Default.Person)
    object Settings : Screen("settings", "Settings", Icons.Default.Settings)
    object Payments : Screen("payments", "Payments", Icons.Default.Payment)
    
    // Authentication
    object Login : Screen("login", "Login")
    object Register : Screen("register", "Register") 
    object ForgotPassword : Screen("forgot_password", "Forgot Password")
    object PasswordReset : Screen("password_reset", "Reset Password")
    object SplashScreen : Screen("splash", "Splash")
    
    // Onboarding (3 screens)
    object OnboardingWelcome : Screen("onboarding_welcome", "Welcome")
    object OnboardingPermissions : Screen("onboarding_permissions", "Permissions")
    object OnboardingSkills : Screen("onboarding_skills", "Skills")
    object OnboardingPreferences : Screen("onboarding_preferences", "Preferences")
    
    // Jobs (5 screens)
    object JobsList : Screen("jobs_list", "Browse Jobs")
    object JobDetail : Screen("job_detail/{jobId}", "Job Details")
    object JobSearch : Screen("job_search", "Search Jobs")
    object JobFilters : Screen("job_filters", "Filters")
    object SavedJobs : Screen("saved_jobs", "Saved Jobs")
    object JobApplication : Screen("job_application/{jobId}", "Apply")
    object ApplicationStatus : Screen("application_status/{applicationId}", "Application Status")
    object AppliedJobs : Screen("applied_jobs", "Applied Jobs")
    
    // Profile (7 screens)
    object ProfileView : Screen("profile_view", "My Profile")
    object ProfileDetail : Screen("profile_detail/{userId}", "Profile Details")
    object EditProfile : Screen("edit_profile", "Edit Profile")
    object Documents : Screen("documents", "Documents")
    object Certifications : Screen("certifications", "Certifications")
    object SkillsManagement : Screen("skills_management", "Skills")
    object Experience : Screen("experience", "Experience")
    object Portfolio : Screen("portfolio", "Portfolio")
    object Reviews : Screen("reviews", "Reviews")
    
    // Payments (5 screens)
    object PaymentsView : Screen("payments_view", "Payments")
    object PaymentHistory : Screen("payment_history", "Payment History")
    object BillingInfo : Screen("billing_info", "Billing Info")
    object Subscription : Screen("subscription", "Subscription")
    object AddPaymentMethod : Screen("add_payment_method", "Add Payment")
    object EditPaymentMethod : Screen("edit_payment_method/{methodId}", "Edit Payment")
    
    // Analytics (3 screens)
    object CareerAnalytics : Screen("career_analytics", "Career Analytics")
    object EarningsAnalytics : Screen("earnings_analytics", "Earnings Analytics")
    object ApplicationAnalytics : Screen("application_analytics", "Application Analytics")
    
    // Settings (6 screens)
    object SettingsOverview : Screen("settings_overview", "Settings")
    object NotificationSettings : Screen("notification_settings", "Notifications")
    object PrivacySettings : Screen("privacy_settings", "Privacy")
    object SecuritySettings : Screen("security_settings", "Security")
    object BillingSettings : Screen("billing_settings", "Billing Settings")
    object AccountSettings : Screen("account_settings", "Account Settings")
    
    // Notifications (1 screen)
    object NotificationDetail : Screen("notification_detail/{notificationId}", "Notification Details")
    
    // Support (4 screens)
    object SupportOverview : Screen("support_overview", "Support")
    object ContactSupport : Screen("contact_support", "Contact Support")
    object FAQ : Screen("faq", "FAQ")
    object Feedback : Screen("feedback", "Feedback")
}

/**
 * Main Navigation Host
 */
@Composable
fun RiggerHireNavHost(
    navController: NavHostController = rememberNavController(),
    startDestination: String = Screen.SplashScreen.route
) {
    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        // Authentication Flow
        composable(Screen.SplashScreen.route) {
            SplashScreenContent(navController)
        }
        composable(Screen.Login.route) {
            LoginContent(navController)
        }
        composable(Screen.Register.route) {
            RegisterContent(navController)
        }
        composable(Screen.ForgotPassword.route) {
            ForgotPasswordContent(navController)
        }
        composable(Screen.PasswordReset.route) {
            PasswordResetContent(navController)
        }
        
        // Onboarding Flow
        composable(Screen.OnboardingWelcome.route) {
            OnboardingWelcomeContent(navController)
        }
        composable(Screen.OnboardingPermissions.route) {
            OnboardingPermissionsContent(navController)
        }
        composable(Screen.OnboardingSkills.route) {
            OnboardingSkillsContent(navController)
        }
        composable(Screen.OnboardingPreferences.route) {
            OnboardingPreferencesContent(navController)
        }
        
        // Main App Content
        composable(Screen.Jobs.route) {
            MainTabContent(navController)
        }
        
        // Additional screens would be added here...
        // For brevity, showing the structure pattern
    }
}

/**
 * Bottom Tab Bar Navigation
 */
@Composable
fun MainTabContent(navController: NavHostController) {
    var selectedTab by remember { mutableIntStateOf(0) }
    val tabs = listOf(
        Screen.Jobs,
        Screen.MyJobs, 
        Screen.Profile,
        Screen.Payments,
        Screen.Settings
    )
    
    Column {
        // Main Content Area
        Box(modifier = Modifier.weight(1f)) {
            when (selectedTab) {
                0 -> JobsContent(navController)
                1 -> MyJobsContent(navController)
                2 -> ProfileContent(navController)
                3 -> PaymentsContent(navController)
                4 -> SettingsContent(navController)
            }
        }
        
        // Bottom Navigation
        NavigationBar(
            containerColor = RiggerHireColors.DarkSurface,
            contentColor = RiggerHireColors.NeonCyan
        ) {
            tabs.forEachIndexed { index, tab ->
                NavigationBarItem(
                    selected = selectedTab == index,
                    onClick = { selectedTab = index },
                    icon = {
                        tab.icon?.let { icon ->
                            Icon(
                                imageVector = icon,
                                contentDescription = tab.title,
                                tint = if (selectedTab == index) 
                                    RiggerHireColors.NeonCyan else RiggerHireColors.TextSecondary
                            )
                        }
                    },
                    label = {
                        Text(
                            text = tab.title,
                            color = if (selectedTab == index) 
                                RiggerHireColors.NeonCyan else RiggerHireColors.TextSecondary,
                            fontWeight = if (selectedTab == index) FontWeight.Bold else FontWeight.Normal
                        )
                    },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = RiggerHireColors.NeonCyan,
                        selectedTextColor = RiggerHireColors.NeonCyan,
                        unselectedIconColor = RiggerHireColors.TextSecondary,
                        unselectedTextColor = RiggerHireColors.TextSecondary,
                        indicatorColor = RiggerHireColors.NeonCyan.copy(alpha = 0.2f)
                    )
                )
            }
        }
    }
}

// Screen content implementations
@Composable
fun SplashScreenContent(navController: NavHostController) {
    SplashScreen(navController)
}

@Composable
fun LoginContent(navController: NavHostController) {
    LoginScreen(navController)
}

@Composable
fun RegisterContent(navController: NavHostController) {
    RegisterScreen(navController)
}

@Composable
fun ForgotPasswordContent(navController: NavHostController) {
    // TODO: Implement forgot password screen
    PlaceholderScreen("Forgot Password", navController)
}

@Composable
fun PasswordResetContent(navController: NavHostController) {
    // TODO: Implement password reset screen
    PlaceholderScreen("Password Reset", navController)
}

@Composable
fun OnboardingWelcomeContent(navController: NavHostController) {
    // TODO: Implement onboarding welcome screen
    PlaceholderScreen("Onboarding Welcome", navController)
}

@Composable
fun OnboardingPermissionsContent(navController: NavHostController) {
    // TODO: Implement onboarding permissions screen
    PlaceholderScreen("Onboarding Permissions", navController)
}

@Composable
fun OnboardingSkillsContent(navController: NavHostController) {
    // TODO: Implement onboarding skills screen
    PlaceholderScreen("Onboarding Skills", navController)
}

@Composable
fun OnboardingPreferencesContent(navController: NavHostController) {
    // TODO: Implement onboarding preferences screen
    PlaceholderScreen("Onboarding Preferences", navController)
}

@Composable
fun JobsContent(navController: NavHostController) {
    JobsListScreen(navController)
}

@Composable
fun MyJobsContent(navController: NavHostController) {
    // TODO: Implement my jobs screen
    PlaceholderScreen("My Jobs", navController)
}

@Composable
fun ProfileContent(navController: NavHostController) {
    ProfileScreen(navController)
}

@Composable
fun PaymentsContent(navController: NavHostController) {
    // TODO: Implement payments screen
    PlaceholderScreen("Payments", navController)
}

@Composable
fun SettingsContent(navController: NavHostController) {
    // TODO: Implement settings screen
    PlaceholderScreen("Settings", navController)
}

@Composable
fun PlaceholderScreen(title: String, navController: NavHostController) {
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = RiggerHireColors.DarkBackground
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(
                text = title,
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = RiggerHireColors.NeonCyan
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "Coming Soon",
                fontSize = 16.sp,
                color = RiggerHireColors.TextSecondary
            )
        }
    }
}
