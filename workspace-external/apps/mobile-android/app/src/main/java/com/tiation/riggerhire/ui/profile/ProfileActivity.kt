package com.tiation.riggerhire.ui.profile

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tiation.riggerhire.ui.theme.RiggerHireTheme
import com.tiation.riggerhire.ui.auth.LoginActivity

/**
 * Comprehensive Profile Activity
 * Features user profile, certifications, experience, and settings
 */
class ProfileActivity : ComponentActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        setContent {
            RiggerHireTheme {
                ProfileScreen()
            }
        }
    }
    
    @OptIn(ExperimentalMaterial3Api::class)
    @Composable
    fun ProfileScreen() {
        val context = LocalContext.current
        val user = getUserProfile()
        
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = Color(0xFF0D0D0D)
        ) {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                item {
                    // Profile Header
                    ProfileHeaderCard(user = user)
                }
                
                item {
                    // Quick Stats
                    ProfileStatsCard(
                        applicationsCount = user.applicationsCount,
                        completedJobs = user.completedJobs,
                        rating = user.rating
                    )
                }
                
                item {
                    // Certifications
                    CertificationsCard(certifications = user.certifications)
                }
                
                item {
                    // Experience
                    ExperienceCard(experience = user.experience)
                }
                
                item {
                    // Skills
                    SkillsCard(skills = user.skills)
                }
                
                item {
                    // Settings & Actions
                    SettingsCard()
                }
                
                item {
                    Spacer(modifier = Modifier.height(80.dp))
                }
            }
        }
    }
    
    @Composable
    fun ProfileHeaderCard(user: UserProfile) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = Color(0xFF1A1A1A)
            ),
            shape = RoundedCornerShape(20.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.verticalGradient(
                            colors = listOf(
                                Color(0xFF00FFFF).copy(alpha = 0.1f),
                                Color(0xFFFF00FF).copy(alpha = 0.1f),
                                Color.Transparent
                            )
                        )
                    )
                    .padding(24.dp)
            ) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    // Profile Picture
                    Box(
                        modifier = Modifier
                            .size(100.dp)
                            .clip(CircleShape)
                            .background(
                                Brush.radialGradient(
                                    colors = listOf(
                                        Color(0xFF00FFFF),
                                        Color(0xFFFF00FF)
                                    )
                                )
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = user.name.first().toString(),
                            fontSize = 40.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF0D0D0D)
                        )
                    }
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    Text(
                        text = user.name,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFFFFFFF),
                        textAlign = TextAlign.Center
                    )
                    
                    Spacer(modifier = Modifier.height(4.dp))
                    
                    Text(
                        text = user.title,
                        fontSize = 16.sp,
                        color = Color(0xFF00FFFF),
                        fontWeight = FontWeight.Medium
                    )
                    
                    Spacer(modifier = Modifier.height(8.dp))
                    
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            Icons.Default.LocationOn,
                            contentDescription = null,
                            tint = Color(0xFFFF00FF),
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = user.location,
                            fontSize = 14.sp,
                            color = Color(0xFFB3B3B3)
                        )
                    }
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    // Action Buttons Row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Button(
                            onClick = { /* Edit profile */ },
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Color(0xFF00FFFF)
                            ),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Icon(
                                Icons.Default.Edit,
                                contentDescription = null,
                                tint = Color(0xFF0D0D0D),
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "Edit",
                                color = Color(0xFF0D0D0D),
                                fontWeight = FontWeight.Bold
                            )
                        }
                        
                        OutlinedButton(
                            onClick = { /* View CV */ },
                            modifier = Modifier.weight(1f),
                            colors = ButtonDefaults.outlinedButtonColors(
                                contentColor = Color(0xFFFF00FF)
                            ),
                            border = androidx.compose.foundation.BorderStroke(
                                2.dp, Color(0xFFFF00FF)
                            ),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Icon(
                                Icons.Default.Description,
                                contentDescription = null,
                                tint = Color(0xFFFF00FF),
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "CV",
                                fontWeight = FontWeight.Bold
                            )
                        }
                    }
                }
            }
        }
    }
    
    @Composable
    fun ProfileStatsCard(applicationsCount: Int, completedJobs: Int, rating: Float) {
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
                    .padding(24.dp),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                StatItem(
                    value = "$applicationsCount",
                    label = "Applications",
                    icon = Icons.Default.Work,
                    color = Color(0xFF00FFFF)
                )
                
                StatItem(
                    value = "$completedJobs",
                    label = "Completed Jobs",
                    icon = Icons.Default.Check,
                    color = Color(0xFF39FF14)
                )
                
                StatItem(
                    value = String.format("%.1f", rating),
                    label = "Rating",
                    icon = Icons.Default.Star,
                    color = Color(0xFFFF00FF)
                )
            }
        }
    }
    
    @Composable
    fun StatItem(value: String, label: String, icon: ImageVector, color: Color) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                icon,
                contentDescription = null,
                tint = color,
                modifier = Modifier.size(24.dp)
            )
            Spacer(modifier = Modifier.height(8.dp))
            Text(
                text = value,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFFFFFFF)
            )
            Text(
                text = label,
                fontSize = 12.sp,
                color = Color(0xFFB3B3B3)
            )
        }
    }
    
    @Composable
    fun CertificationsCard(certifications: List<Certification>) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = Color(0xFF1A1A1A)
            ),
            shape = RoundedCornerShape(16.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
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
                        color = Color(0xFF00FFFF)
                    )
                    
                    TextButton(
                        onClick = { /* Add certification */ }
                    ) {
                        Icon(
                            Icons.Default.Add,
                            contentDescription = null,
                            tint = Color(0xFFFF00FF)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = "Add",
                            color = Color(0xFFFF00FF)
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(certifications) { cert ->
                        CertificationChip(cert)
                    }
                }
            }
        }
    }
    
    @Composable
    fun CertificationChip(certification: Certification) {
        Box(
            modifier = Modifier
                .background(
                    when (certification.status) {
                        "Valid" -> Color(0xFF39FF14).copy(alpha = 0.2f)
                        "Expiring" -> Color(0xFFFFFF00).copy(alpha = 0.2f)
                        else -> Color(0xFFFF073A).copy(alpha = 0.2f)
                    },
                    RoundedCornerShape(12.dp)
                )
                .padding(16.dp)
                .width(140.dp)
        ) {
            Column {
                Text(
                    text = certification.name,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFFFFFFFF),
                    maxLines = 2
                )
                
                Spacer(modifier = Modifier.height(4.dp))
                
                Text(
                    text = certification.issuer,
                    fontSize = 12.sp,
                    color = Color(0xFFB3B3B3)
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .background(
                                when (certification.status) {
                                    "Valid" -> Color(0xFF39FF14)
                                    "Expiring" -> Color(0xFFFFFF00)
                                    else -> Color(0xFFFF073A)
                                },
                                CircleShape
                            )
                    )
                    Spacer(modifier = Modifier.width(6.dp))
                    Text(
                        text = certification.status,
                        fontSize = 10.sp,
                        color = when (certification.status) {
                            "Valid" -> Color(0xFF39FF14)
                            "Expiring" -> Color(0xFFFFFF00)
                            else -> Color(0xFFFF073A)
                        },
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
    
    @Composable
    fun ExperienceCard(experience: List<Experience>) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = Color(0xFF1A1A1A)
            ),
            shape = RoundedCornerShape(16.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
        ) {
            Column(
                modifier = Modifier.padding(20.dp)
            ) {
                Text(
                    text = "💼 Work Experience",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF00FFFF)
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                experience.forEach { exp ->
                    ExperienceItem(exp)
                    if (exp != experience.last()) {
                        Spacer(modifier = Modifier.height(16.dp))
                    }
                }
            }
        }
    }
    
    @Composable
    fun ExperienceItem(experience: Experience) {
        Column {
            Text(
                text = experience.position,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFFFFFFF)
            )
            
            Spacer(modifier = Modifier.height(4.dp))
            
            Text(
                text = experience.company,
                fontSize = 14.sp,
                color = Color(0xFF00FFFF),
                fontWeight = FontWeight.Medium
            )
            
            Spacer(modifier = Modifier.height(2.dp))
            
            Text(
                text = "${experience.startDate} - ${experience.endDate}",
                fontSize = 12.sp,
                color = Color(0xFFB3B3B3)
            )
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Text(
                text = experience.description,
                fontSize = 14.sp,
                color = Color(0xFFB3B3B3),
                lineHeight = 20.sp
            )
        }
    }
    
    @Composable
    fun SkillsCard(skills: List<Skill>) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = Color(0xFF1A1A1A)
            ),
            shape = RoundedCornerShape(16.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
        ) {
            Column(
                modifier = Modifier.padding(20.dp)
            ) {
                Text(
                    text = "⚡ Skills",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF00FFFF)
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                skills.forEach { skill ->
                    SkillItem(skill)
                    if (skill != skills.last()) {
                        Spacer(modifier = Modifier.height(12.dp))
                    }
                }
            }
        }
    }
    
    @Composable
    fun SkillItem(skill: Skill) {
        Column {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(
                    text = skill.name,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFFFFFFFF)
                )
                Text(
                    text = "${skill.level}%",
                    fontSize = 14.sp,
                    color = Color(0xFF00FFFF),
                    fontWeight = FontWeight.Bold
                )
            }
            
            Spacer(modifier = Modifier.height(8.dp))
            
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(8.dp)
                    .background(
                        Color(0xFF404040),
                        RoundedCornerShape(4.dp)
                    )
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth(skill.level / 100f)
                        .height(8.dp)
                        .background(
                            Brush.horizontalGradient(
                                colors = listOf(
                                    Color(0xFF00FFFF),
                                    Color(0xFFFF00FF)
                                )
                            ),
                            RoundedCornerShape(4.dp)
                        )
                )
            }
        }
    }
    
    @Composable
    fun SettingsCard() {
        val context = LocalContext.current
        
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = Color(0xFF1A1A1A)
            ),
            shape = RoundedCornerShape(16.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
        ) {
            Column(
                modifier = Modifier.padding(20.dp)
            ) {
                Text(
                    text = "⚙️ Settings",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF00FFFF)
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                val settingsItems = listOf(
                    SettingItem("Notifications", Icons.Default.Notifications, Color(0xFF00FFFF)),
                    SettingItem("Privacy", Icons.Default.Security, Color(0xFFFF00FF)),
                    SettingItem("Help & Support", Icons.Default.Help, Color(0xFF39FF14)),
                    SettingItem("About", Icons.Default.Info, Color(0xFFFFFF00)),
                    SettingItem("Logout", Icons.Default.ExitToApp, Color(0xFFFF073A))
                )
                
                settingsItems.forEach { item ->
                    SettingsRow(
                        item = item,
                        onClick = {
                            when (item.title) {
                                "Logout" -> {
                                    context.startActivity(Intent(context, LoginActivity::class.java))
                                    (context as ComponentActivity).finish()
                                }
                                else -> { /* Handle other settings */ }
                            }
                        }
                    )
                    if (item != settingsItems.last()) {
                        Spacer(modifier = Modifier.height(12.dp))
                    }
                }
            }
        }
    }
    
    @Composable
    fun SettingsRow(item: SettingItem, onClick: () -> Unit) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .clickable { onClick() }
                .padding(vertical = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    item.icon,
                    contentDescription = null,
                    tint = item.color,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(12.dp))
                Text(
                    text = item.title,
                    fontSize = 16.sp,
                    color = Color(0xFFFFFFFF)
                )
            }
            
            Icon(
                Icons.Default.ChevronRight,
                contentDescription = null,
                tint = Color(0xFF808080),
                modifier = Modifier.size(20.dp)
            )
        }
    }
    
    data class UserProfile(
        val name: String,
        val title: String,
        val location: String,
        val email: String,
        val phone: String,
        val applicationsCount: Int,
        val completedJobs: Int,
        val rating: Float,
        val certifications: List<Certification>,
        val experience: List<Experience>,
        val skills: List<Skill>
    )
    
    data class Certification(
        val name: String,
        val issuer: String,
        val status: String,
        val expiryDate: String
    )
    
    data class Experience(
        val position: String,
        val company: String,
        val startDate: String,
        val endDate: String,
        val description: String
    )
    
    data class Skill(
        val name: String,
        val level: Int
    )
    
    data class SettingItem(
        val title: String,
        val icon: ImageVector,
        val color: Color
    )
    
    private fun getUserProfile(): UserProfile {
        return UserProfile(
            name = "Jake Wilson",
            title = "Senior Rigger",
            location = "Perth, WA",
            email = "jake.wilson@email.com",
            phone = "+61 400 123 456",
            applicationsCount = 12,
            completedJobs = 47,
            rating = 4.8f,
            certifications = listOf(
                Certification("Rigger Class III", "SafeWork WA", "Valid", "2025-06-15"),
                Certification("EWP Certificate", "RIIHAN", "Valid", "2024-12-20"),
                Certification("Dogman Certificate", "SafeWork WA", "Expiring", "2024-08-10"),
                Certification("Construction White Card", "Master Builders WA", "Valid", "2026-03-01")
            ),
            experience = listOf(
                Experience(
                    position = "Senior Rigger",
                    company = "BHP Billiton",
                    startDate = "Jan 2020",
                    endDate = "Present",
                    description = "Leading rigging operations for iron ore mining equipment. Supervising teams and ensuring safety compliance."
                ),
                Experience(
                    position = "Rigger",
                    company = "Rio Tinto",
                    startDate = "Mar 2017",
                    endDate = "Dec 2019",
                    description = "Performed rigging operations for heavy machinery maintenance and installation projects."
                )
            ),
            skills = listOf(
                Skill("Crane Operations", 95),
                Skill("Heavy Lifting", 90),
                Skill("Safety Compliance", 98),
                Skill("Team Leadership", 85),
                Skill("Equipment Maintenance", 80)
            )
        )
    }
}
