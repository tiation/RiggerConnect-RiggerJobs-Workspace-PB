package com.tiation.riggerhire.ui.payments

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
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.tiation.riggerhire.ui.theme.RiggerHireTheme

/**
 * Comprehensive Payments Activity
 * Features earnings tracking, payment history, tax documents, and Stripe integration
 */
class PaymentsActivity : ComponentActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        setContent {
            RiggerHireTheme {
                PaymentsScreen()
            }
        }
    }
    
    @OptIn(ExperimentalMaterial3Api::class)
    @Composable
    fun PaymentsScreen() {
        var selectedTab by remember { mutableStateOf(0) }
        val tabs = listOf("Earnings", "Payments", "Tax Docs", "Settings")
        
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = Color(0xFF0D0D0D)
        ) {
            Column(
                modifier = Modifier.fillMaxSize()
            ) {
                // Header
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
                                text = "💰 Financial Hub",
                                fontSize = 24.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF00FFFF)
                            )
                            
                            IconButton(
                                onClick = { /* Download report */ }
                            ) {
                                Icon(
                                    Icons.Default.Download,
                                    contentDescription = "Download",
                                    tint = Color(0xFFFF00FF)
                                )
                            }
                        }
                        
                        Spacer(modifier = Modifier.height(16.dp))
                        
                        // Earnings Overview
                        EarningsOverviewCard()
                        
                        Spacer(modifier = Modifier.height(16.dp))
                        
                        // Tab Row
                        TabRow(
                            selectedTabIndex = selectedTab,
                            containerColor = Color.Transparent,
                            contentColor = Color(0xFF00FFFF),
                            indicator = { tabPositions ->
                                Box(
                                    modifier = Modifier
                                        .tabIndicatorOffset(tabPositions[selectedTab])
                                        .height(3.dp)
                                        .background(
                                            Brush.horizontalGradient(
                                                colors = listOf(
                                                    Color(0xFF00FFFF),
                                                    Color(0xFFFF00FF)
                                                )
                                            ),
                                            RoundedCornerShape(topStart = 2.dp, topEnd = 2.dp)
                                        )
                                )
                            }
                        ) {
                            tabs.forEachIndexed { index, title ->
                                Tab(
                                    selected = selectedTab == index,
                                    onClick = { selectedTab = index },
                                    text = {
                                        Text(
                                            text = title,
                                            fontSize = 14.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (selectedTab == index) 
                                                Color(0xFF00FFFF) else Color(0xFFB3B3B3)
                                        )
                                    }
                                )
                            }
                        }
                    }
                }
                
                // Tab Content
                when (selectedTab) {
                    0 -> EarningsTab()
                    1 -> PaymentsTab()
                    2 -> TaxDocsTab()
                    3 -> PaymentSettingsTab()
                }
            }
        }
    }
    
    @Composable
    fun EarningsOverviewCard() {
        val earnings = getEarningsData()
        
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
                    .padding(20.dp)
            ) {
                Column {
                    Text(
                        text = "Total Earnings",
                        fontSize = 14.sp,
                        color = Color(0xFFB3B3B3)
                    )
                    
                    Text(
                        text = earnings.totalEarnings,
                        fontSize = 32.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF39FF14)
                    )
                    
                    Spacer(modifier = Modifier.height(16.dp))
                    
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        EarningMetric(
                            label = "This Month",
                            value = earnings.thisMonth,
                            color = Color(0xFF00FFFF)
                        )
                        
                        EarningMetric(
                            label = "Last Month",
                            value = earnings.lastMonth,
                            color = Color(0xFFFF00FF)
                        )
                        
                        EarningMetric(
                            label = "Pending",
                            value = earnings.pending,
                            color = Color(0xFFFFFF00)
                        )
                    }
                }
            }
        }
    }
    
    @Composable
    fun EarningMetric(label: String, value: String, color: Color) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = value,
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = color
            )
            Text(
                text = label,
                fontSize = 12.sp,
                color = Color(0xFFB3B3B3)
            )
        }
    }
    
    @Composable
    fun EarningsTab() {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                EarningsChartCard()
            }
            
            item {
                MonthlyBreakdownCard()
            }
            
            items(getRecentJobs()) { job ->
                JobEarningCard(job)
            }
            
            item {
                Spacer(modifier = Modifier.height(80.dp))
            }
        }
    }
    
    @Composable
    fun PaymentsTab() {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                PaymentMethodCard()
            }
            
            items(getPaymentHistory()) { payment ->
                PaymentHistoryCard(payment)
            }
            
            item {
                Spacer(modifier = Modifier.height(80.dp))
            }
        }
    }
    
    @Composable
    fun EarningsChartCard() {
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
                    text = "📈 Earnings Trend",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF00FFFF)
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Simplified chart representation
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(120.dp)
                        .background(
                            Color(0xFF262626),
                            RoundedCornerShape(8.dp)
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "📊 Interactive Chart\n(Chart component would go here)",
                        textAlign = TextAlign.Center,
                        color = Color(0xFFB3B3B3),
                        fontSize = 14.sp
                    )
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "Peak: $8,450 (March)",
                        fontSize = 12.sp,
                        color = Color(0xFF39FF14)
                    )
                    Text(
                        text = "Avg: $6,200/month",
                        fontSize = 12.sp,
                        color = Color(0xFF00FFFF)
                    )
                }
            }
        }
    }
    
    @Composable
    fun JobEarningCard(job: JobEarning) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = Color(0xFF1A1A1A)
            ),
            shape = RoundedCornerShape(12.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = job.jobTitle,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFFFFFFFF)
                    )
                    Text(
                        text = job.company,
                        fontSize = 14.sp,
                        color = Color(0xFF00FFFF)
                    )
                    Text(
                        text = "${job.hoursWorked}h • ${job.date}",
                        fontSize = 12.sp,
                        color = Color(0xFFB3B3B3)
                    )
                }
                
                Column(
                    horizontalAlignment = Alignment.End
                ) {
                    Text(
                        text = job.amount,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF39FF14)
                    )
                    
                    Box(
                        modifier = Modifier
                            .background(
                                when (job.status) {
                                    "Paid" -> Color(0xFF39FF14).copy(alpha = 0.2f)
                                    "Pending" -> Color(0xFFFFFF00).copy(alpha = 0.2f)
                                    else -> Color(0xFFFF073A).copy(alpha = 0.2f)
                                },
                                RoundedCornerShape(8.dp)
                            )
                            .padding(horizontal = 8.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = job.status,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = when (job.status) {
                                "Paid" -> Color(0xFF39FF14)
                                "Pending" -> Color(0xFFFFFF00)
                                else -> Color(0xFFFF073A)
                            }
                        )
                    }
                }
            }
        }
    }
    
    @Composable
    fun PaymentMethodCard() {
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
                        text = "💳 Payment Method",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF00FFFF)
                    )
                    
                    TextButton(
                        onClick = { /* Update payment method */ }
                    ) {
                        Text(
                            text = "Update",
                            color = Color(0xFFFF00FF)
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(
                        modifier = Modifier
                            .size(40.dp)
                            .background(
                                Brush.linearGradient(
                                    colors = listOf(
                                        Color(0xFF00FFFF),
                                        Color(0xFFFF00FF)
                                    )
                                ),
                                RoundedCornerShape(8.dp)
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            Icons.Default.CreditCard,
                            contentDescription = null,
                            tint = Color(0xFF0D0D0D)
                        )
                    }
                    
                    Spacer(modifier = Modifier.width(12.dp))
                    
                    Column {
                        Text(
                            text = "Commonwealth Bank",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFFFFFFFF)
                        )
                        Text(
                            text = "BSB: 062-000 • Account: ****4521",
                            fontSize = 14.sp,
                            color = Color(0xFFB3B3B3)
                        )
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text(
                        text = "Next payment: July 25, 2024",
                        fontSize = 12.sp,
                        color = Color(0xFF39FF14)
                    )
                    Text(
                        text = "Auto-deposit enabled",
                        fontSize = 12.sp,
                        color = Color(0xFF00FFFF)
                    )
                }
            }
        }
    }
    
    @Composable
    fun PaymentHistoryCard(payment: PaymentHistory) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(
                containerColor = Color(0xFF1A1A1A)
            ),
            shape = RoundedCornerShape(12.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        when (payment.type) {
                            "Deposit" -> Icons.Default.ArrowDownward
                            "Withdrawal" -> Icons.Default.ArrowUpward
                            else -> Icons.Default.AttachMoney
                        },
                        contentDescription = null,
                        tint = when (payment.type) {
                            "Deposit" -> Color(0xFF39FF14)
                            "Withdrawal" -> Color(0xFFFF073A)
                            else -> Color(0xFF00FFFF)
                        },
                        modifier = Modifier.size(20.dp)
                    )
                    
                    Spacer(modifier = Modifier.width(12.dp))
                    
                    Column {
                        Text(
                            text = payment.description,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFFFFFFFF)
                        )
                        Text(
                            text = "${payment.date} • ${payment.reference}",
                            fontSize = 12.sp,
                            color = Color(0xFFB3B3B3)
                        )
                    }
                }
                
                Text(
                    text = if (payment.type == "Deposit") "+${payment.amount}" else "-${payment.amount}",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                    color = when (payment.type) {
                        "Deposit" -> Color(0xFF39FF14)
                        "Withdrawal" -> Color(0xFFFF073A)
                        else -> Color(0xFFFFFFFF)
                    }
                )
            }
        }
    }
    
    @Composable
    fun TaxDocsTab() {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                TaxSummaryCard()
            }
            
            items(getTaxDocuments()) { doc ->
                TaxDocumentCard(doc)
            }
            
            item {
                Spacer(modifier = Modifier.height(80.dp))
            }
        }
    }
    
    @Composable
    fun TaxSummaryCard() {
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
                    text = "📄 Tax Summary 2024",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF00FFFF)
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    TaxMetric("Total Income", "$74,250", Color(0xFF39FF14))
                    TaxMetric("Tax Withheld", "$18,563", Color(0xFFFF00FF))
                    TaxMetric("Super Paid", "$8,103", Color(0xFF00FFFF))
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Button(
                    onClick = { /* Generate tax summary */ },
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFF00FFFF)
                    ),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(
                        Icons.Default.Download,
                        contentDescription = null,
                        tint = Color(0xFF0D0D0D)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Download Tax Summary",
                        color = Color(0xFF0D0D0D),
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }
    }
    
    @Composable
    fun TaxMetric(label: String, value: String, color: Color) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = value,
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = color
            )
            Text(
                text = label,
                fontSize = 12.sp,
                color = Color(0xFFB3B3B3),
                textAlign = TextAlign.Center
            )
        }
    }
    
    @Composable
    fun MonthlyBreakdownCard() {
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
                    text = "📊 Monthly Breakdown",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF00FFFF)
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                val months = listOf(
                    "June 2024" to "$7,250",
                    "May 2024" to "$6,480", 
                    "April 2024" to "$8,120",
                    "March 2024" to "$8,450"
                )
                
                months.forEach { (month, amount) ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 8.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = month,
                            fontSize = 14.sp,
                            color = Color(0xFFB3B3B3)
                        )
                        Text(
                            text = amount,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF39FF14)
                        )
                    }
                }
            }
        }
    }
    
    @Composable
    fun TaxDocumentCard(document: TaxDocument) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .clickable { /* Download document */ },
            colors = CardDefaults.cardColors(
                containerColor = Color(0xFF1A1A1A)
            ),
            shape = RoundedCornerShape(12.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(
                        Icons.Default.Description,
                        contentDescription = null,
                        tint = Color(0xFF00FFFF),
                        modifier = Modifier.size(24.dp)
                    )
                    
                    Spacer(modifier = Modifier.width(12.dp))
                    
                    Column {
                        Text(
                            text = document.name,
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFFFFFFFF)
                        )
                        Text(
                            text = document.period,
                            fontSize = 14.sp,
                            color = Color(0xFFB3B3B3)
                        )
                    }
                }
                
                Icon(
                    Icons.Default.Download,
                    contentDescription = null,
                    tint = Color(0xFFFF00FF),
                    modifier = Modifier.size(20.dp)
                )
            }
        }
    }
    
    @Composable
    fun PaymentSettingsTab() {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                PaymentPreferencesCard()
            }
            
            item {
                SecuritySettingsCard()
            }
            
            item {
                NotificationSettingsCard()
            }
            
            item {
                Spacer(modifier = Modifier.height(80.dp))
            }
        }
    }
    
    @Composable
    fun PaymentPreferencesCard() {
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
                    text = "⚙️ Payment Preferences",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF00FFFF)
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                val preferences = listOf(
                    "Auto-deposit enabled" to true,
                    "Weekly payment schedule" to false,
                    "Email payment confirmations" to true,
                    "SMS payment alerts" to false
                )
                
                preferences.forEach { (label, enabled) ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 8.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = label,
                            fontSize = 14.sp,
                            color = Color(0xFFB3B3B3)
                        )
                        
                        Switch(
                            checked = enabled,
                            onCheckedChange = { /* Handle toggle */ },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = Color(0xFF00FFFF),
                                checkedTrackColor = Color(0xFF00FFFF).copy(alpha = 0.3f)
                            )
                        )
                    }
                }
            }
        }
    }
    
    @Composable
    fun SecuritySettingsCard() {
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
                    text = "🔐 Security Settings",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF00FFFF)
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                val securityOptions = listOf(
                    SecurityOption("Two-factor authentication", Icons.Default.Security, true),
                    SecurityOption("Biometric payment approval", Icons.Default.Fingerprint, false),
                    SecurityOption("Transaction notifications", Icons.Default.Notifications, true)
                )
                
                securityOptions.forEach { option ->
                    SecurityOptionRow(option)
                    if (option != securityOptions.last()) {
                        Spacer(modifier = Modifier.height(12.dp))
                    }
                }
            }
        }
    }
    
    @Composable
    fun SecurityOptionRow(option: SecurityOption) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    option.icon,
                    contentDescription = null,
                    tint = Color(0xFFFF00FF),
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(12.dp))
                Text(
                    text = option.label,
                    fontSize = 14.sp,
                    color = Color(0xFFB3B3B3)
                )
            }
            
            Switch(
                checked = option.enabled,
                onCheckedChange = { /* Handle toggle */ },
                colors = SwitchDefaults.colors(
                    checkedThumbColor = Color(0xFFFF00FF),
                    checkedTrackColor = Color(0xFFFF00FF).copy(alpha = 0.3f)
                )
            )
        }
    }
    
    @Composable
    fun NotificationSettingsCard() {
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
                    text = "🔔 Payment Notifications",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF00FFFF)
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                val notifications = listOf(
                    "Payment received" to true,
                    "Payment failed" to true,
                    "Weekly earning summary" to false,
                    "Tax document ready" to true
                )
                
                notifications.forEach { (label, enabled) ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 8.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = label,
                            fontSize = 14.sp,
                            color = Color(0xFFB3B3B3)
                        )
                        
                        Switch(
                            checked = enabled,
                            onCheckedChange = { /* Handle toggle */ },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = Color(0xFF39FF14),
                                checkedTrackColor = Color(0xFF39FF14).copy(alpha = 0.3f)
                            )
                        )
                    }
                }
            }
        }
    }
    
    // Data classes
    data class EarningsData(
        val totalEarnings: String,
        val thisMonth: String,
        val lastMonth: String,
        val pending: String
    )
    
    data class JobEarning(
        val jobTitle: String,
        val company: String,
        val amount: String,
        val hoursWorked: Int,
        val date: String,
        val status: String
    )
    
    data class PaymentHistory(
        val description: String,
        val amount: String,
        val date: String,
        val type: String,
        val reference: String
    )
    
    data class TaxDocument(
        val name: String,
        val period: String,
        val downloadUrl: String
    )
    
    data class SecurityOption(
        val label: String,
        val icon: ImageVector,
        val enabled: Boolean
    )
    
    // Sample data functions
    private fun getEarningsData() = EarningsData(
        totalEarnings = "$74,250",
        thisMonth = "$7,250",
        lastMonth = "$6,480",
        pending = "$1,920"
    )
    
    private fun getRecentJobs() = listOf(
        JobEarning("Senior Rigger", "BHP Billiton", "$1,280", 16, "Jul 15", "Paid"),
        JobEarning("Crane Operator", "Rio Tinto", "$1,440", 18, "Jul 12", "Paid"),
        JobEarning("Scaffolder", "Fortescue", "$960", 12, "Jul 10", "Pending"),
        JobEarning("Dogman", "CIMIC Group", "$800", 10, "Jul 8", "Paid")
    )
    
    private fun getPaymentHistory() = listOf(
        PaymentHistory("Weekly Earnings", "$2,150", "Jul 19, 2024", "Deposit", "WE240719"),
        PaymentHistory("Weekly Earnings", "$1,980", "Jul 12, 2024", "Deposit", "WE240712"),
        PaymentHistory("Weekly Earnings", "$2,340", "Jul 5, 2024", "Deposit", "WE240705"),
        PaymentHistory("Tax Refund", "$520", "Jun 28, 2024", "Deposit", "TR240628")
    )
    
    private fun getTaxDocuments() = listOf(
        TaxDocument("Payment Summary 2024", "Jul 1, 2023 - Jun 30, 2024", ""),
        TaxDocument("PAYG Summary Q3", "Apr 1 - Jun 30, 2024", ""),
        TaxDocument("Superannuation Statement", "2024 Financial Year", ""),
        TaxDocument("Work-related Expenses", "Jan 1 - Dec 31, 2024", "")
    )
}
