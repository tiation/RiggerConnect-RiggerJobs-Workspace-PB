package com.tiation.riggerhire.ui.screens.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.tiation.riggerhire.data.models.User
import com.tiation.riggerhire.data.models.UserType
import com.tiation.riggerhire.ui.theme.RiggerHireColors

/**
 * Profile Screen for RiggerHire Android App
 * Matches iOS ProfileView.swift with dark neon theme
 */
@Composable
fun ProfileScreen(navController: NavHostController) {
    val sampleUser = getSampleUser()
    
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(RiggerHireColors.DarkBackground),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item {
            ProfileHeader(user = sampleUser)
        }
        
        item {
            ProfileStats(user = sampleUser)
        }
        
        item {
            SkillsSection(skills = sampleUser.skills)
        }
        
        item {
            CertificationsSection(certifications = sampleUser.certifications)
        }
        
        item {
            ProfileActions()
        }
        
        item {
            RecentActivity()
        }
    }
}

@Composable
private fun ProfileHeader(user: User) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(20.dp),
        colors = CardDefaults.cardColors(
            containerColor = RiggerHireColors.DarkSurface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 12.dp)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    brush = Brush.radialGradient(
                        colors = listOf(
                            RiggerHireColors.NeonCyan.copy(alpha = 0.2f),
                            RiggerHireColors.NeonMagenta.copy(alpha = 0.1f),
                            androidx.compose.ui.graphics.Color.Transparent
                        )
                    )
                )
                .padding(24.dp)
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Profile Image
                Box(
                    modifier = Modifier
                        .size(100.dp)
                        .background(
                            brush = Brush.radialGradient(
                                colors = listOf(
                                    RiggerHireColors.NeonCyan,
                                    RiggerHireColors.NeonMagenta
                                )
                            ),
                            shape = CircleShape
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Box(
                        modifier = Modifier
                            .size(96.dp)
                            .background(
                                RiggerHireColors.DarkSurface,
                                CircleShape
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "${user.firstName.first()}${user.lastName.first()}",
                            fontSize = 36.sp,
                            fontWeight = FontWeight.Bold,
                            color = RiggerHireColors.NeonCyan
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Name and Title
                Text(
                    text = "${user.firstName} ${user.lastName}",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = RiggerHireColors.TextPrimary
                )
                
                Text(
                    text = "Certified ${user.userType.name.lowercase().replaceFirstChar { it.uppercase() }}",
                    fontSize = 16.sp,
                    color = RiggerHireColors.NeonCyan,
                    fontWeight = FontWeight.Medium
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                // Location
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        imageVector = Icons.Default.LocationOn,
                        contentDescription = "Location",
                        tint = RiggerHireColors.TextSecondary,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "${user.location?.city ?: "Perth"}, WA",
                        fontSize = 14.sp,
                        color = RiggerHireColors.TextSecondary
                    )
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Verification Badge
                if (user.isVerified) {
                    Card(
                        shape = RoundedCornerShape(20.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = RiggerHireColors.NeonGreen.copy(alpha = 0.2f)
                        )
                    ) {
                        Row(
                            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Verified,
                                contentDescription = "Verified",
                                tint = RiggerHireColors.NeonGreen,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(
                                text = "Verified Professional",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = RiggerHireColors.NeonGreen
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ProfileStats(user: User) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = RiggerHireColors.DarkSurface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(20.dp),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            StatItem(
                title = "Experience",
                value = "${user.yearsOfExperience} Years",
                icon = Icons.Default.Work
            )
            
            VerticalDivider()
            
            StatItem(
                title = "Rating",
                value = String.format("%.1f ⭐", user.averageRating),
                icon = Icons.Default.Star
            )
            
            VerticalDivider()
            
            StatItem(
                title = "Jobs",
                value = "${user.totalJobs}",
                icon = Icons.Default.Assignment
            )
        }
    }
}

@Composable
private fun StatItem(
    title: String,
    value: String,
    icon: ImageVector
) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            imageVector = icon,
            contentDescription = title,
            tint = RiggerHireColors.NeonCyan,
            modifier = Modifier.size(24.dp)
        )
        Spacer(modifier = Modifier.height(8.dp))
        Text(
            text = value,
            fontSize = 18.sp,
            fontWeight = FontWeight.Bold,
            color = RiggerHireColors.NeonMagenta
        )
        Text(
            text = title,
            fontSize = 12.sp,
            color = RiggerHireColors.TextSecondary
        )
    }
}

@Composable
private fun VerticalDivider() {
    Box(
        modifier = Modifier
            .width(1.dp)
            .height(60.dp)
            .background(RiggerHireColors.BorderPrimary)
    )
}

@Composable
private fun SkillsSection(skills: List<String>) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = RiggerHireColors.DarkSurface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "🔧 Skills & Expertise",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = RiggerHireColors.TextPrimary
                )
                
                TextButton(onClick = { /* Navigate to skills management */ }) {
                    Text(
                        text = "Edit",
                        color = RiggerHireColors.NeonCyan
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(skills) { skill ->
                    AssistChip(
                        onClick = { },
                        label = { Text(skill, fontSize = 14.sp) },
                        colors = AssistChipDefaults.assistChipColors(
                            containerColor = RiggerHireColors.NeonCyan.copy(alpha = 0.2f),
                            labelColor = RiggerHireColors.NeonCyan
                        )
                    )
                }
            }
        }
    }
}

@Composable
private fun CertificationsSection(certifications: List<String>) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = RiggerHireColors.DarkSurface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "🏆 Certifications",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = RiggerHireColors.TextPrimary
                )
                
                TextButton(onClick = { /* Navigate to certifications */ }) {
                    Text(
                        text = "View All",
                        color = RiggerHireColors.NeonCyan
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(12.dp))
            
            Column(
                verticalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                certifications.take(3).forEach { certification ->
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            imageVector = Icons.Default.CheckCircle,
                            contentDescription = "Certified",
                            tint = RiggerHireColors.NeonGreen,
                            modifier = Modifier.size(20.dp)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = certification,
                            fontSize = 14.sp,
                            color = RiggerHireColors.TextPrimary
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun ProfileActions() {
    val actions = listOf(
        ProfileAction("Edit Profile", Icons.Default.Edit, RiggerHireColors.NeonCyan),
        ProfileAction("Documents", Icons.Default.Description, RiggerHireColors.NeonMagenta),
        ProfileAction("Portfolio", Icons.Default.Work, RiggerHireColors.NeonGreen),
        ProfileAction("Settings", Icons.Default.Settings, RiggerHireColors.TextSecondary)
    )
    
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = RiggerHireColors.DarkSurface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Text(
                text = "⚡ Quick Actions",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = RiggerHireColors.TextPrimary
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Column(
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                actions.forEach { action ->
                    ProfileActionItem(
                        action = action,
                        onClick = { /* Handle action click */ }
                    )
                }
            }
        }
    }
}

@Composable
private fun ProfileActionItem(
    action: ProfileAction,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth(),
        onClick = onClick,
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(
            containerColor = action.color.copy(alpha = 0.1f)
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = action.icon,
                contentDescription = action.title,
                tint = action.color,
                modifier = Modifier.size(24.dp)
            )
            Spacer(modifier = Modifier.width(16.dp))
            Text(
                text = action.title,
                fontSize = 16.sp,
                fontWeight = FontWeight.Medium,
                color = RiggerHireColors.TextPrimary,
                modifier = Modifier.weight(1f)
            )
            Icon(
                imageVector = Icons.Default.ChevronRight,
                contentDescription = "Go",
                tint = RiggerHireColors.TextSecondary,
                modifier = Modifier.size(20.dp)
            )
        }
    }
}

@Composable
private fun RecentActivity() {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = RiggerHireColors.DarkSurface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            Text(
                text = "📊 Recent Activity",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = RiggerHireColors.TextPrimary
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Activity items
            val activities = listOf(
                "Applied to Senior Rigger position at BHP",
                "Updated skills and certifications",
                "Completed safety training course"
            )
            
            Column(
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                activities.forEach { activity ->
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .background(RiggerHireColors.NeonCyan, CircleShape)
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = activity,
                            fontSize = 14.sp,
                            color = RiggerHireColors.TextSecondary
                        )
                    }
                }
            }
        }
    }
}

data class ProfileAction(
    val title: String,
    val icon: ImageVector,
    val color: androidx.compose.ui.graphics.Color
)

private fun getSampleUser(): User {
    return User(
        firstName = "John",
        lastName = "Doe",
        email = "john.doe@email.com",
        phoneNumber = "+61 400 123 456",
        userType = UserType.RIGGER,
        isVerified = true,
        isActive = true,
        profileCompleteness = 0.85f,
        averageRating = 4.7f,
        totalJobs = 23,
        yearsOfExperience = 8,
        hourlyRate = 65.0,
        skills = listOf(
            "Heavy Rigging", "Crane Operation", "Safety Management", 
            "Team Leadership", "Equipment Maintenance", "Quality Control"
        ),
        certifications = listOf(
            "High Risk Work License - Rigging",
            "Crane Operator License",
            "White Card - Construction",
            "First Aid & CPR Certified",
            "Working at Heights Certificate"
        )
    )
}
