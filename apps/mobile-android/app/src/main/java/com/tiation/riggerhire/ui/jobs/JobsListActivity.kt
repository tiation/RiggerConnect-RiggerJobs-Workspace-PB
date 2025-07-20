package com.tiation.riggerhire.ui.jobs

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tiation.riggerhire.ui.theme.RiggerHireTheme

/**
 * Enhanced Jobs List Activity
 * Features job search, filtering, location-based discovery with dark neon theme
 */
class JobsListActivity : ComponentActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        setContent {
            RiggerHireTheme {
                JobsListScreen()
            }
        }
    }
    
    @OptIn(ExperimentalMaterial3Api::class)
    @Composable
    fun JobsListScreen() {
        val context = LocalContext.current
        var searchQuery by remember { mutableStateOf("") }
        var showFilters by remember { mutableStateOf(false) }
        var selectedLocation by remember { mutableStateOf("All Locations") }
        var selectedCategory by remember { mutableStateOf("All Categories") }
        var selectedExperience by remember { mutableStateOf("All Levels") }
        val jobs by remember { mutableStateOf(getSampleJobs()) }
        
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = Color(0xFF0D0D0D)
        ) {
            Column(
                modifier = Modifier.fillMaxSize()
            ) {
                // Header with Search and Filters
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    colors = CardDefaults.cardColors(
                        containerColor = Color(0xFF1A1A1A)
                    ),
                    shape = RoundedCornerShape(bottomStart = 16.dp, bottomEnd = 16.dp),
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
                                text = "🔍 Find Jobs",
                                fontSize = 24.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF00FFFF)
                            )
                            
                            Row {
                                IconButton(
                                    onClick = { showFilters = !showFilters }
                                ) {
                                    Icon(
                                        Icons.Default.FilterList,
                                        contentDescription = "Filters",
                                        tint = Color(0xFF00FFFF)
                                    )
                                }
                                IconButton(
                                    onClick = { /* Open map view */ }
                                ) {
                                    Icon(
                                        Icons.Default.Map,
                                        contentDescription = "Map",
                                        tint = Color(0xFFFF00FF)
                                    )
                                }
                            }
                        }
                        
                        Spacer(modifier = Modifier.height(16.dp))
                        
                        // Search Bar
                        OutlinedTextField(
                            value = searchQuery,
                            onValueChange = { searchQuery = it },
                            placeholder = { 
                                Text("Search rigging jobs...", color = Color(0xFF808080)) 
                            },
                            leadingIcon = {
                                Icon(
                                    Icons.Default.Search,
                                    contentDescription = null,
                                    tint = Color(0xFF00FFFF)
                                )
                            },
                            modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = Color(0xFF00FFFF),
                                unfocusedBorderColor = Color(0xFF404040),
                                focusedTextColor = Color(0xFFFFFFFF),
                                unfocusedTextColor = Color(0xFFB3B3B3),
                                cursorColor = Color(0xFF00FFFF)
                            ),
                            shape = RoundedCornerShape(12.dp),
                            singleLine = true
                        )
                        
                        // Filter Chips (when expanded)
                        if (showFilters) {
                            Spacer(modifier = Modifier.height(16.dp))
                            
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                FilterChip(
                                    selected = selectedLocation != "All Locations",
                                    onClick = { /* Open location picker */ },
                                    label = { Text(selectedLocation, fontSize = 12.sp) },
                                    colors = FilterChipDefaults.filterChipColors(
                                        selectedContainerColor = Color(0xFF00FFFF).copy(alpha = 0.2f),
                                        selectedLabelColor = Color(0xFF00FFFF)
                                    )
                                )
                                
                                FilterChip(
                                    selected = selectedCategory != "All Categories",
                                    onClick = { /* Open category picker */ },
                                    label = { Text(selectedCategory, fontSize = 12.sp) },
                                    colors = FilterChipDefaults.filterChipColors(
                                        selectedContainerColor = Color(0xFFFF00FF).copy(alpha = 0.2f),
                                        selectedLabelColor = Color(0xFFFF00FF)
                                    )
                                )
                                
                                FilterChip(
                                    selected = selectedExperience != "All Levels",
                                    onClick = { /* Open experience picker */ },
                                    label = { Text(selectedExperience, fontSize = 12.sp) },
                                    colors = FilterChipDefaults.filterChipColors(
                                        selectedContainerColor = Color(0xFF39FF14).copy(alpha = 0.2f),
                                        selectedLabelColor = Color(0xFF39FF14)
                                    )
                                )
                            }
                        }
                        
                        // Stats Row
                        Spacer(modifier = Modifier.height(16.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Text(
                                text = "${jobs.size} jobs found",
                                color = Color(0xFFB3B3B3),
                                fontSize = 14.sp
                            )
                            Text(
                                text = "📍 Within 50km",
                                color = Color(0xFF00FFFF),
                                fontSize = 14.sp
                            )
                        }
                    }
                }
                
                // Jobs List
                LazyColumn(
                    modifier = Modifier.fillMaxSize(),
                    contentPadding = PaddingValues(16.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(jobs) { job ->
                        JobCard(
                            job = job,
                            onClick = {
                                context.startActivity(
                                    Intent(context, JobDetailActivity::class.java).apply {
                                        putExtra("job_id", job.id)
                                    }
                                )
                            }
                        )
                    }
                    
                    item {
                        Spacer(modifier = Modifier.height(80.dp))
                    }
                }
            }
        }
    }
    
    @Composable
    fun JobCard(
        job: Job,
        onClick: () -> Unit
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .clickable { onClick() },
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
                    verticalAlignment = Alignment.Top
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = job.title,
                            fontSize = 18.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFFFFFFFF),
                            maxLines = 2,
                            overflow = TextOverflow.Ellipsis
                        )
                        
                        Spacer(modifier = Modifier.height(4.dp))
                        
                        Text(
                            text = job.company,
                            fontSize = 14.sp,
                            color = Color(0xFF00FFFF),
                            fontWeight = FontWeight.Medium
                        )
                    }
                    
                    // Salary Badge
                    Box(
                        modifier = Modifier
                            .background(
                                Brush.horizontalGradient(
                                    colors = listOf(
                                        Color(0xFF00FFFF).copy(alpha = 0.2f),
                                        Color(0xFFFF00FF).copy(alpha = 0.2f)
                                    )
                                ),
                                RoundedCornerShape(20.dp)
                            )
                            .padding(horizontal = 12.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = job.salary,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF00FFFF)
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(12.dp))
                
                // Location and Type Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
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
                            text = job.location,
                            fontSize = 14.sp,
                            color = Color(0xFFB3B3B3)
                        )
                    }
                    
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Icon(
                            Icons.Default.Work,
                            contentDescription = null,
                            tint = Color(0xFF39FF14),
                            modifier = Modifier.size(16.dp)
                        )
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(
                            text = job.type,
                            fontSize = 14.sp,
                            color = Color(0xFFB3B3B3)
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(12.dp))
                
                // Description
                Text(
                    text = job.description,
                    fontSize = 14.sp,
                    color = Color(0xFFB3B3B3),
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    lineHeight = 20.sp
                )
                
                Spacer(modifier = Modifier.height(12.dp))
                
                // Requirements and Actions Row
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        job.requirements.take(2).forEach { requirement ->
                            Box(
                                modifier = Modifier
                                    .background(
                                        Color(0xFF404040),
                                        RoundedCornerShape(12.dp)
                                    )
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    text = requirement,
                                    fontSize = 10.sp,
                                    color = Color(0xFFB3B3B3)
                                )
                            }
                        }
                    }
                    
                    Row(
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = job.postedTime,
                            fontSize = 12.sp,
                            color = Color(0xFF808080)
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Icon(
                            Icons.Default.ChevronRight,
                            contentDescription = null,
                            tint = Color(0xFF00FFFF),
                            modifier = Modifier.size(16.dp)
                        )
                    }
                }
            }
        }
    }
    
    data class Job(
        val id: String,
        val title: String,
        val company: String,
        val location: String,
        val salary: String,
        val type: String,
        val description: String,
        val requirements: List<String>,
        val postedTime: String,
        val distance: String
    )
    
    private fun getSampleJobs(): List<Job> {
        return listOf(
            Job(
                id = "1",
                title = "Senior Rigger - Mining Operations",
                company = "BHP Billiton",
                location = "Newman, WA",
                salary = "$55-65/hr",
                type = "Full-time",
                description = "Experienced rigger required for iron ore mining operations. Must have current certifications and 5+ years experience.",
                requirements = listOf("Rigging Cert", "EWP", "Construction"),
                postedTime = "2 hours ago",
                distance = "12.5km"
            ),
            Job(
                id = "2", 
                title = "Crane Dogman - Port Operations",
                company = "Fortescue Metals",
                location = "Port Hedland, WA",
                salary = "$48-55/hr",
                type = "Contract",
                description = "Dogman position available for port loading operations. FIFO arrangements available.",
                requirements = listOf("Dogman Cert", "Port Security", "FIFO"),
                postedTime = "4 hours ago",
                distance = "28.3km"
            ),
            Job(
                id = "3",
                title = "Scaffolder - Maintenance Shutdown",
                company = "Rio Tinto",
                location = "Karratha, WA",
                salary = "$50-58/hr",
                type = "Temporary",
                description = "3-month shutdown work available. Accommodation and meals provided.",
                requirements = listOf("Scaffolding", "Heights", "Shutdown"),
                postedTime = "6 hours ago",
                distance = "45.1km"
            ),
            Job(
                id = "4",
                title = "Rigger - Construction Project",
                company = "CIMIC Group",
                location = "Perth, WA",
                salary = "$45-52/hr",
                type = "Full-time",
                description = "Commercial construction project in Perth CBD. Modern equipment and excellent conditions.",
                requirements = listOf("Construction", "CBD", "Modern"),
                postedTime = "1 day ago",
                distance = "1.2km"
            ),
            Job(
                id = "5",
                title = "Mobile Crane Operator",
                company = "Liebherr Australia",
                location = "Geraldton, WA",
                salary = "$60-70/hr",
                type = "Full-time",
                description = "Operating mobile cranes for various construction and mining projects across WA.",
                requirements = listOf("Mobile Crane", "HR License", "Travel"),
                postedTime = "2 days ago",
                distance = "67.8km"
            )
        )
    }
}
