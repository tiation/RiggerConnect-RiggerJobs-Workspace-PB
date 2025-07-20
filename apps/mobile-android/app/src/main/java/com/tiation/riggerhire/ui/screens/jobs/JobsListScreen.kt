package com.tiation.riggerhire.ui.screens.jobs

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.tiation.riggerhire.data.models.*
import com.tiation.riggerhire.ui.theme.RiggerHireColors
import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.*

/**
 * Jobs List Screen for RiggerHire Android App
 * Matches iOS JobsListView.swift with dark neon theme
 */
@Composable
fun JobsListScreen(navController: NavHostController) {
    var searchQuery by remember { mutableStateOf("") }
    var selectedFilter by remember { mutableStateOf(JobFilters()) }
    var isLoading by remember { mutableStateOf(false) }
    var jobs by remember { mutableStateOf(getSampleJobs()) }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(RiggerHireColors.DarkBackground)
    ) {
        // Header
        JobsHeader(
            searchQuery = searchQuery,
            onSearchQueryChange = { searchQuery = it },
            onFilterClick = { /* TODO: Open filter dialog */ }
        )
        
        // Quick Filters
        QuickFilters(
            selectedFilters = selectedFilter,
            onFilterSelected = { selectedFilter = it }
        )
        
        // Jobs List
        if (isLoading) {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator(
                    color = RiggerHireColors.NeonCyan
                )
            }
        } else {
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                items(jobs) { job ->
                    JobCard(
                        job = job,
                        onJobClick = { 
                            // TODO: Navigate to job details
                        },
                        onSaveJob = {
                            // TODO: Save/unsave job
                        }
                    )
                }
            }
        }
    }
}

@Composable
private fun JobsHeader(
    searchQuery: String,
    onSearchQueryChange: (String) -> Unit,
    onFilterClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
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
                text = "🔍 Find Your Next Job",
                fontSize = 24.sp,
                fontWeight = FontWeight.Bold,
                color = RiggerHireColors.NeonCyan
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Search Bar
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                OutlinedTextField(
                    value = searchQuery,
                    onValueChange = onSearchQueryChange,
                    placeholder = { Text("Search jobs...", color = RiggerHireColors.TextSecondary) },
                    leadingIcon = {
                        Icon(
                            imageVector = Icons.Default.Search,
                            contentDescription = "Search",
                            tint = RiggerHireColors.NeonCyan
                        )
                    },
                    modifier = Modifier.weight(1f),
                    shape = RoundedCornerShape(12.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = RiggerHireColors.NeonCyan,
                        unfocusedBorderColor = RiggerHireColors.BorderPrimary,
                        focusedTextColor = RiggerHireColors.TextPrimary,
                        unfocusedTextColor = RiggerHireColors.TextPrimary,
                        cursorColor = RiggerHireColors.NeonCyan
                    )
                )
                
                Spacer(modifier = Modifier.width(12.dp))
                
                // Filter Button
                IconButton(
                    onClick = onFilterClick,
                    modifier = Modifier
                        .size(56.dp)
                        .background(
                            RiggerHireColors.NeonCyan.copy(alpha = 0.2f),
                            RoundedCornerShape(12.dp)
                        )
                ) {
                    Icon(
                        imageVector = Icons.Default.FilterList,
                        contentDescription = "Filters",
                        tint = RiggerHireColors.NeonCyan
                    )
                }
            }
        }
    }
}

@Composable
private fun QuickFilters(
    selectedFilters: JobFilters,
    onFilterSelected: (JobFilters) -> Unit
) {
    val filterOptions = listOf(
        "All Jobs" to JobType.CONTRACT,
        "Mining" to null,
        "Construction" to null,
        "Remote" to null,
        "FIFO" to null
    )
    
    LazyRow(
        modifier = Modifier.padding(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items(filterOptions) { (label, type) ->
            FilterChip(
                onClick = { /* TODO: Apply filter */ },
                label = { Text(label) },
                selected = false,
                colors = FilterChipDefaults.filterChipColors(
                    selectedContainerColor = RiggerHireColors.NeonCyan.copy(alpha = 0.3f),
                    selectedLabelColor = RiggerHireColors.NeonCyan,
                    containerColor = RiggerHireColors.DarkSurface,
                    labelColor = RiggerHireColors.TextSecondary
                )
            )
        }
    }
}

@Composable
private fun JobCard(
    job: Job,
    onJobClick: () -> Unit,
    onSaveJob: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onJobClick() },
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(
            containerColor = RiggerHireColors.DarkSurface
        ),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Column(
            modifier = Modifier.padding(20.dp)
        ) {
            // Header Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = job.title,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = RiggerHireColors.TextPrimary,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis
                    )
                    
                    Spacer(modifier = Modifier.height(4.dp))
                    
                    Text(
                        text = job.companyName,
                        fontSize = 16.sp,
                        color = RiggerHireColors.NeonCyan,
                        fontWeight = FontWeight.Medium
                    )
                }
                
                // Save Button
                IconButton(
                    onClick = onSaveJob,
                    modifier = Modifier
                        .size(40.dp)
                        .background(
                            RiggerHireColors.NeonMagenta.copy(alpha = 0.2f),
                            RoundedCornerShape(8.dp)
                        )
                ) {
                    Icon(
                        imageVector = Icons.Default.BookmarkBorder,
                        contentDescription = "Save Job",
                        tint = RiggerHireColors.NeonMagenta
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Job Details
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // Location
                JobDetailItem(
                    icon = Icons.Default.LocationOn,
                    text = job.location?.city ?: "Remote"
                )
                
                // Job Type
                JobDetailItem(
                    icon = Icons.Default.Work,
                    text = job.jobType.name
                )
                
                // Industry
                JobDetailItem(
                    icon = Icons.Default.Business,
                    text = job.industry.name
                )
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Description
            Text(
                text = job.shortDescription.ifEmpty { job.description },
                fontSize = 14.sp,
                color = RiggerHireColors.TextSecondary,
                maxLines = 3,
                overflow = TextOverflow.Ellipsis,
                lineHeight = 20.sp
            )
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Tags
            if (job.tags.isNotEmpty()) {
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(job.tags.take(3)) { tag ->
                        AssistChip(
                            onClick = { },
                            label = { Text(tag, fontSize = 12.sp) },
                            colors = AssistChipDefaults.assistChipColors(
                                containerColor = RiggerHireColors.NeonCyan.copy(alpha = 0.2f),
                                labelColor = RiggerHireColors.NeonCyan
                            )
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
            }
            
            // Footer Row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Bottom
            ) {
                // Salary/Rate
                Column {
                    if (job.hourlyRate > 0) {
                        Text(
                            text = "${NumberFormat.getCurrencyInstance(Locale("en", "AU")).format(job.hourlyRate)}/hr",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = RiggerHireColors.NeonMagenta
                        )
                    } else if (job.salaryMin > 0) {
                        Text(
                            text = "${NumberFormat.getCurrencyInstance(Locale("en", "AU")).format(job.salaryMin)}+",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = RiggerHireColors.NeonMagenta
                        )
                    }
                    
                    Text(
                        text = "Posted ${formatTimeAgo(job.postedDate)}",
                        fontSize = 12.sp,
                        color = RiggerHireColors.TextSecondary
                    )
                }
                
                // Urgent Badge
                if (job.isUrgent) {
                    Card(
                        shape = RoundedCornerShape(6.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = RiggerHireColors.NeonRed.copy(alpha = 0.2f)
                        )
                    ) {
                        Text(
                            text = "URGENT",
                            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = RiggerHireColors.NeonRed
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun JobDetailItem(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    text: String
) {
    Row(
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = RiggerHireColors.NeonCyan,
            modifier = Modifier.size(16.dp)
        )
        Spacer(modifier = Modifier.width(4.dp))
        Text(
            text = text,
            fontSize = 12.sp,
            color = RiggerHireColors.TextSecondary
        )
    }
}

// Helper functions
private fun formatTimeAgo(date: Date): String {
    val now = Date()
    val diffInMillis = now.time - date.time
    val diffInHours = diffInMillis / (1000 * 60 * 60)
    
    return when {
        diffInHours < 1 -> "just now"
        diffInHours < 24 -> "${diffInHours}h ago"
        else -> "${diffInHours / 24}d ago"
    }
}

private fun getSampleJobs(): List<Job> {
    return listOf(
        Job(
            title = "Senior Rigger - Mining Operations",
            companyName = "BHP Billiton",
            description = "Experienced rigger required for iron ore mining operations in the Pilbara region. Must have valid high risk work licence and experience with heavy lifting equipment.",
            shortDescription = "Senior rigger position for iron ore mining operations in Pilbara region.",
            jobType = JobType.CONTRACT,
            industry = Industry.MINING,
            location = Location(
                city = "Port Hedland",
                state = "WA",
                country = "Australia"
            ),
            hourlyRate = 65.0,
            isUrgent = true,
            shift = ShiftType.FIFO,
            tags = listOf("FIFO", "Mining", "Heavy Lifting"),
            postedDate = Date(System.currentTimeMillis() - 86400000) // 1 day ago
        ),
        Job(
            title = "Construction Rigger - High Rise",
            companyName = "Multiplex",
            description = "Construction rigger needed for high-rise building project in Perth CBD. Experience with tower cranes essential.",
            shortDescription = "Construction rigger for high-rise building project in Perth CBD.",
            jobType = JobType.PERMANENT,
            industry = Industry.CONSTRUCTION,
            location = Location(
                city = "Perth",
                state = "WA",
                country = "Australia"
            ),
            hourlyRate = 58.0,
            isUrgent = false,
            shift = ShiftType.DAY_SHIFT,
            tags = listOf("High Rise", "Tower Crane", "Perth CBD"),
            postedDate = Date(System.currentTimeMillis() - 172800000) // 2 days ago
        ),
        Job(
            title = "Marine Rigger - Oil & Gas",
            companyName = "Woodside Energy",
            description = "Marine rigger position for offshore oil and gas operations. Must have offshore survival training and marine rigging experience.",
            shortDescription = "Marine rigger for offshore oil and gas operations.",
            jobType = JobType.CONTRACT,
            industry = Industry.ENERGY,
            location = Location(
                city = "Dampier",
                state = "WA",
                country = "Australia"
            ),
            hourlyRate = 75.0,
            isUrgent = false,
            shift = ShiftType.ROSTER_2_1,
            tags = listOf("Offshore", "Marine", "Oil & Gas"),
            postedDate = Date(System.currentTimeMillis() - 259200000) // 3 days ago
        )
    )
}
