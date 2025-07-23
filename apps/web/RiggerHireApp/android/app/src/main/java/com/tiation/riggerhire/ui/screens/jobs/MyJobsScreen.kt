package com.tiation.riggerhire.ui.screens.jobs

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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavHostController
import com.tiation.riggerhire.ui.theme.RiggerHireColors
import com.tiation.riggerhire.data.models.Job

/**
 * MyJobs Screen for RiggerHire Android App
 * Shows user's applied and active jobs with status tracking
 */
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MyJobsScreen(navController: NavHostController) {
    var selectedTab by remember { mutableIntStateOf(0) }
    var isLoading by remember { mutableStateOf(true) }
    
    // Simulated jobs data
    val appliedJobs = remember {
        listOf(
            Job(
                id = "1",
                title = "Senior Rigger",
                company = "Mining Corp",
                location = "Perth, WA",
                status = "Under Review"
            ),
            Job(
                id = "2",
                title = "Crane Operator",
                company = "Construction Ltd",
                location = "Karratha, WA",
                status = "Interview Scheduled"
            )
        )
    }
    
    val activeJobs = remember {
        listOf(
            Job(
                id = "3",
                title = "Lead Rigger",
                company = "Industrial Solutions",
                location = "Port Hedland, WA",
                status = "Active"
            )
        )
    }

    Surface(
        modifier = Modifier.fillMaxSize(),
        color = RiggerHireColors.DarkBackground
    ) {
        Column(
            modifier = Modifier.fillMaxSize()
        ) {
            // Top App Bar
            TopAppBar(
                title = {
                    Text(
                        text = "My Jobs",
                        color = RiggerHireColors.TextPrimary,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold
                    )
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = RiggerHireColors.DarkSurface
                )
            )

            // Tabs
            TabRow(
                selectedTabIndex = selectedTab,
                containerColor = RiggerHireColors.DarkSurface,
                contentColor = RiggerHireColors.NeonCyan
            ) {
                Tab(
                    selected = selectedTab == 0,
                    onClick = { selectedTab = 0 },
                    text = { Text("Applied (${appliedJobs.size})") }
                )
                Tab(
                    selected = selectedTab == 1,
                    onClick = { selectedTab = 1 },
                    text = { Text("Active (${activeJobs.size})") }
                )
            }

            // Content
            Box(modifier = Modifier.weight(1f)) {
                when (selectedTab) {
                    0 -> JobsList(
                        jobs = appliedJobs,
                        navController = navController,
                        emptyMessage = "No applications yet"
                    )
                    1 -> JobsList(
                        jobs = activeJobs,
                        navController = navController,
                        emptyMessage = "No active jobs"
                    )
                }

                // Loading indicator
                if (isLoading) {
                    CircularProgressIndicator(
                        modifier = Modifier.align(Alignment.Center),
                        color = RiggerHireColors.NeonCyan
                    )
                }
            }
        }
    }

    // Simulate loading
    LaunchedEffect(Unit) {
        kotlinx.coroutines.delay(1000)
        isLoading = false
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun JobsList(
    jobs: List<Job>,
    navController: NavHostController,
    emptyMessage: String
) {
    if (jobs.isEmpty()) {
        Box(
            modifier = Modifier.fillMaxSize(),
            contentAlignment = Alignment.Center
        ) {
            Text(
                text = emptyMessage,
                color = RiggerHireColors.TextSecondary,
                fontSize = 16.sp
            )
        }
    } else {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(jobs) { job ->
                Card(
                    onClick = { navController.navigate("job_detail/${job.id}") },
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = RiggerHireColors.DarkerSurface
                    )
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp)
                    ) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = job.title,
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold,
                                color = RiggerHireColors.TextPrimary
                            )
                            StatusChip(status = job.status)
                        }

                        Spacer(modifier = Modifier.height(8.dp))

                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.Business,
                                contentDescription = null,
                                tint = RiggerHireColors.TextSecondary,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = job.company,
                                fontSize = 14.sp,
                                color = RiggerHireColors.TextSecondary
                            )
                        }

                        Spacer(modifier = Modifier.height(4.dp))

                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.LocationOn,
                                contentDescription = null,
                                tint = RiggerHireColors.TextSecondary,
                                modifier = Modifier.size(16.dp)
                            )
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(
                                text = job.location,
                                fontSize = 14.sp,
                                color = RiggerHireColors.TextSecondary
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun StatusChip(status: String) {
    val (color, backgroundColor) = when (status) {
        "Under Review" -> RiggerHireColors.NeonYellow to RiggerHireColors.NeonYellow.copy(alpha = 0.2f)
        "Interview Scheduled" -> RiggerHireColors.NeonCyan to RiggerHireColors.NeonCyan.copy(alpha = 0.2f)
        "Active" -> RiggerHireColors.NeonGreen to RiggerHireColors.NeonGreen.copy(alpha = 0.2f)
        else -> RiggerHireColors.TextSecondary to RiggerHireColors.TextSecondary.copy(alpha = 0.2f)
    }

    Surface(
        color = backgroundColor,
        shape = RoundedCornerShape(16.dp)
    ) {
        Text(
            text = status,
            color = color,
            fontSize = 12.sp,
            fontWeight = FontWeight.Medium,
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
        )
    }
}
