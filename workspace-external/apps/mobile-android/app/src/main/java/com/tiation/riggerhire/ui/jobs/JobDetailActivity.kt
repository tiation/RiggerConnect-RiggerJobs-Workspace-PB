package com.tiation.riggerhire.ui.jobs

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tiation.riggerhire.ui.theme.RiggerHireTheme

/**
 * Comprehensive Job Detail Activity
 * Features detailed job information, application flow, and company details
 */
class JobDetailActivity : ComponentActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        val jobId = intent.getStringExtra("job_id") ?: "1"
        
        setContent {
            RiggerHireTheme {
                JobDetailScreen(jobId = jobId)
            }
        }
    }
    
    @OptIn(ExperimentalMaterial3Api::class)
    @Composable
    fun JobDetailScreen(jobId: String) {
        val context = LocalContext.current
        val job = getJobDetails(jobId)
        var hasApplied by remember { mutableStateOf(false) }
        var isFavorited by remember { mutableStateOf(false) }
        var showApplicationDialog by remember { mutableStateOf(false) }
        
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = Color(0xFF0D0D0D)
        ) {
            Column(
                modifier = Modifier.fillMaxSize()
            ) {
                // Top Bar
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = Color(0xFF1A1A1A)
                    ),
                    shape = RoundedCornerShape(bottomStart = 16.dp, bottomEnd = 16.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(20.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        IconButton(
                            onClick = { finish() }
                        ) {
                            Icon(
                                Icons.Default.ArrowBack,
                                contentDescription = "Back",
                                tint = Color(0xFF00FFFF)
                            )
                        }
                        
                        Text(
                            text = "Job Details",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFFFFFFFF)
                        )
                        
                        Row {
                            IconButton(
                                onClick = { isFavorited = !isFavorited }
                            ) {
                                Icon(
                                    if (isFavorited) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                                    contentDescription = "Favorite",
                                    tint = if (isFavorited) Color(0xFFFF00FF) else Color(0xFFB3B3B3)
                                )
                            }
                            
                            IconButton(
                                onClick = { /* Share job */ }
                            ) {
                                Icon(
                                    Icons.Default.Share,
                                    contentDescription = "Share",
                                    tint = Color(0xFF00FFFF)
                                )
                            }
                        }
                    }
                }
                
                // Job Content
                LazyColumn(
                    modifier = Modifier.weight(1f),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    item {
                        // Job Header
                        JobHeaderCard(job = job)
                    }
                    
                    item {
                        // Company Info
                        CompanyInfoCard(company = job.company)
                    }
                    
                    item {
                        // Job Description
                        JobDescriptionCard(description = job.description)
                    }
                    
                    item {
                        // Requirements
                        RequirementsCard(requirements = job.requirements)
                    }
                    
                    item {
                        // Benefits
                        BenefitsCard(benefits = job.benefits)
                    }
                    
                    item {
                        // Location & Map
                        LocationCard(location = job.location)
                    }
                    
                    item {
                        // Application Stats
                        ApplicationStatsCard(
                            applicants = job.applicantCount,
                            views = job.viewCount,
                            deadline = job.applicationDeadline
                        )
                    }
                    
                    item {
                        Spacer(modifier = Modifier.height(100.dp))
                    }
                }
                
                // Bottom Action Bar
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = Color(0xFF1A1A1A)
                    ),
                    shape = RoundedCornerShape(topStart = 16.dp, topEnd = 16.dp),
                    elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(20.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        if (hasApplied) {
                            Button(
                                onClick = { /* View application status */ },
                                modifier = Modifier.weight(1f).height(56.dp),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = Color(0xFF39FF14)
                                ),
                                shape = RoundedCornerShape(16.dp)
                            ) {
                                Icon(
                                    Icons.Default.Check,
                                    contentDescription = null,
                                    tint = Color(0xFF0D0D0D)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(
                                    text = "Applied",
                                    fontSize = 16.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF0D0D0D)
                                )
                            }
                        } else {
                            Button(
                                onClick = { showApplicationDialog = true },
                                modifier = Modifier.weight(1f).height(56.dp),
                                colors = ButtonDefaults.buttonColors(
                                    containerColor = Color(0xFF00FFFF)
                                ),
                                shape = RoundedCornerShape(16.dp)
                            ) {
                                Text(
                                    text = "Apply Now",
                                    fontSize = 18.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color(0xFF0D0D0D)
                                )
                            }
                        }
                        
                        OutlinedButton(
                            onClick = { 
                                val intent = Intent(Intent.ACTION_DIAL).apply {
                                    data = Uri.parse("tel:${job.contactPhone}")
                                }
                                context.startActivity(intent)
                            },
                            modifier = Modifier.height(56.dp),
                            colors = ButtonDefaults.outlinedButtonColors(
                                contentColor = Color(0xFFFF00FF)
                            ),
                            border = androidx.compose.foundation.BorderStroke(
                                2.dp, Color(0xFFFF00FF)
                            ),
                            shape = RoundedCornerShape(16.dp)
                        ) {
                            Icon(
                                Icons.Default.Phone,
                                contentDescription = "Call",
                                tint = Color(0xFFFF00FF)
                            )
                        }
                    }
                }
            }
        }
        
        // Application Dialog
        if (showApplicationDialog) {
            ApplicationDialog(
                onDismiss = { showApplicationDialog = false },
                onApply = { 
                    hasApplied = true
                    showApplicationDialog = false
                }
            )
        }
    }
    
    @Composable
    fun JobHeaderCard(job: JobDetail) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = Color(0xFF1A1A1A)
            ),
            shape = RoundedCornerShape(16.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(
                        Brush.horizontalGradient(
                            colors = listOf(
                                Color(0xFF00FFFF).copy(alpha = 0.1f),
                                Color(0xFFFF00FF).copy(alpha = 0.1f)
                            )
                        )
                    )
                    .padding(24.dp)
            ) {
                Column {
                    Text(
                        text = job.title,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFFFFFFF)
                    )
                    
                    Spacer(modifier = Modifier.height(8.dp))
                    
                    Text(
                        text = job.company,
                        fontSize = 18.sp,
                        color = Color(0xFF00FFFF),
                        fontWeight = FontWeight.Medium
                    )
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        InfoChip(
                            icon = Icons.Default.AttachMoney,
                            text = job.salary,
                            color = Color(0xFF39FF14)
                        )
                        
                        InfoChip(
                            icon = Icons.Default.LocationOn,
                            text = job.location,
                            color = Color(0xFFFF00FF)
                        )
                        
                        InfoChip(
                            icon = Icons.Default.Work,
                            text = job.type,
                            color = Color(0xFF00FFFF)
                        )
                    }
                }
            }
        }
    }
    
    @Composable
    fun InfoChip(
        icon: androidx.compose.ui.graphics.vector.ImageVector,
        text: String,
        color: Color
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .background(
                    color.copy(alpha = 0.2f),
                    RoundedCornerShape(12.dp)
                )
                .padding(horizontal = 12.dp, vertical = 8.dp)
        ) {
            Icon(
                icon,
                contentDescription = null,
                tint = color,
                modifier = Modifier.size(16.dp)
            )
            Spacer(modifier = Modifier.width(6.dp))
            Text(
                text = text,
                fontSize = 12.sp,
                fontWeight = FontWeight.Bold,
                color = color
            )
        }
    }
    
    @Composable
    fun ApplicationDialog(
        onDismiss: () -> Unit,
        onApply: () -> Unit
    ) {
        AlertDialog(
            onDismissRequest = onDismiss,
            containerColor = Color(0xFF1A1A1A),
            titleContentColor = Color(0xFFFFFFFF),
            textContentColor = Color(0xFFB3B3B3),
            title = {
                Text(
                    text = "Apply for this Job?",
                    fontWeight = FontWeight.Bold
                )
            },
            text = {
                Column {
                    Text("Your profile and CV will be sent to the employer.")
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        "Make sure your profile is up to date for the best chance of success.",
                        fontSize = 14.sp,
                        color = Color(0xFF808080)
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = onApply,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFF00FFFF)
                    ),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text(
                        "Apply",
                        color = Color(0xFF0D0D0D),
                        fontWeight = FontWeight.Bold
                    )
                }
            },
            dismissButton = {
                TextButton(
                    onClick = onDismiss,
                    colors = ButtonDefaults.textButtonColors(
                        contentColor = Color(0xFFB3B3B3)
                    )
                ) {
                    Text("Cancel")
                }
            }
        )
    }
    
    // Additional card composables would go here...
    @Composable
    fun CompanyInfoCard(company: String) {
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
                    text = "🏢 Company",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF00FFFF)
                )
                
                Spacer(modifier = Modifier.height(12.dp))
                
                Text(
                    text = company,
                    fontSize = 16.sp,
                    color = Color(0xFFFFFFFF),
                    fontWeight = FontWeight.Medium
                )
                
                Text(
                    text = "Leading mining and construction company in Western Australia with over 50 years of experience.",
                    fontSize = 14.sp,
                    color = Color(0xFFB3B3B3),
                    lineHeight = 20.sp
                )
            }
        }
    }
    
    @Composable 
    fun JobDescriptionCard(description: String) {
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
                    text = "📋 Description",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF00FFFF)
                )
                
                Spacer(modifier = Modifier.height(12.dp))
                
                Text(
                    text = description,
                    fontSize = 14.sp,
                    color = Color(0xFFB3B3B3),
                    lineHeight = 20.sp
                )
            }
        }
    }
    
    @Composable
    fun RequirementsCard(requirements: List<String>) {
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
                    text = "✅ Requirements",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF00FFFF)
                )
                
                Spacer(modifier = Modifier.height(12.dp))
                
                requirements.forEach { requirement ->
                    Row(
                        modifier = Modifier.padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .size(6.dp)
                                .background(
                                    Color(0xFF39FF14),
                                    RoundedCornerShape(3.dp)
                                )
                        )
                        Spacer(modifier = Modifier.width(12.dp))
                        Text(
                            text = requirement,
                            fontSize = 14.sp,
                            color = Color(0xFFB3B3B3)
                        )
                    }
                }
            }
        }
    }
    
    @Composable
    fun BenefitsCard(benefits: List<String>) {
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
                    text = "🎁 Benefits",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF00FFFF)
                )
                
                Spacer(modifier = Modifier.height(12.dp))
                
                benefits.forEach { benefit ->
                    Row(
                        modifier = Modifier.padding(vertical = 4.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            Icons.Default.Check,
                            contentDescription = null,
                            tint = Color(0xFFFF00FF),
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = benefit,
                            fontSize = 14.sp,
                            color = Color(0xFFB3B3B3)
                        )
                    }
                }
            }
        }
    }
    
    @Composable
    fun LocationCard(location: String) {
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
                    text = "📍 Location",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF00FFFF)
                )
                
                Spacer(modifier = Modifier.height(12.dp))
                
                Text(
                    text = location,
                    fontSize = 16.sp,
                    color = Color(0xFFFFFFFF),
                    fontWeight = FontWeight.Medium
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "📏 12.5km from your location",
                        fontSize = 14.sp,
                        color = Color(0xFFB3B3B3)
                    )
                    
                    Text(
                        text = "🚗 15 min drive",
                        fontSize = 14.sp,
                        color = Color(0xFF39FF14)
                    )
                }
            }
        }
    }
    
    @Composable
    fun ApplicationStatsCard(applicants: Int, views: Int, deadline: String) {
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
                    text = "📊 Application Stats",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF00FFFF)
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    StatItem("$applicants", "Applicants")
                    StatItem("$views", "Views") 
                    StatItem(deadline, "Deadline")
                }
            }
        }
    }
    
    @Composable
    fun StatItem(value: String, label: String) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = value,
                fontSize = 20.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFFFF00FF)
            )
            Text(
                text = label,
                fontSize = 12.sp,
                color = Color(0xFFB3B3B3)
            )
        }
    }
    
    data class JobDetail(
        val id: String,
        val title: String,
        val company: String,
        val location: String,
        val salary: String,
        val type: String,
        val description: String,
        val requirements: List<String>,
        val benefits: List<String>,
        val contactPhone: String,
        val applicantCount: Int,
        val viewCount: Int,
        val applicationDeadline: String
    )
    
    private fun getJobDetails(jobId: String): JobDetail {
        return JobDetail(
            id = jobId,
            title = "Senior Rigger - Mining Operations",
            company = "BHP Billiton",
            location = "Newman, WA",
            salary = "$55-65/hr",
            type = "Full-time",
            description = "We are seeking an experienced Senior Rigger to join our mining operations team in Newman. This role involves working with heavy machinery, rigging operations, and ensuring safety compliance across our iron ore operations.",
            requirements = listOf(
                "Current Rigging Certificate (CI, CII, or CIII)",
                "Minimum 5 years mining experience",
                "EWP (Elevated Work Platform) certification",
                "Valid driver's license",
                "Strong safety focus and attention to detail",
                "Ability to work FIFO arrangements"
            ),
            benefits = listOf(
                "Competitive hourly rates ($55-65/hr)",
                "FIFO accommodation provided",
                "Career development opportunities",
                "Comprehensive health insurance",
                "Site allowances and overtime rates",
                "Employee assistance programs"
            ),
            contactPhone = "+61 8 9999 1234",
            applicantCount = 23,
            viewCount = 156,
            applicationDeadline = "5 days"
        )
    }
}
