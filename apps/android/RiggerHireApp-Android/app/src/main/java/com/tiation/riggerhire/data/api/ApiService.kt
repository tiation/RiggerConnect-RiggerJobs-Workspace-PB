package com.tiation.riggerhire.data.api

import com.tiation.riggerhire.data.models.*
import retrofit2.Response
import retrofit2.http.*

/**
 * API Service for RiggerHire Android App
 * Corresponds to iOS APIService.swift
 */
interface ApiService {
    
    // Authentication endpoints
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>
    
    @POST("auth/register") 
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>
    
    @POST("auth/logout")
    suspend fun logout(@Header("Authorization") token: String): Response<Unit>
    
    @POST("auth/refresh")
    suspend fun refreshToken(@Body request: RefreshTokenRequest): Response<AuthResponse>
    
    @POST("auth/forgot-password")
    suspend fun forgotPassword(@Body request: ForgotPasswordRequest): Response<MessageResponse>
    
    @POST("auth/reset-password")
    suspend fun resetPassword(@Body request: ResetPasswordRequest): Response<MessageResponse>
    
    // User profile endpoints
    @GET("users/profile")
    suspend fun getUserProfile(@Header("Authorization") token: String): Response<User>
    
    @PUT("users/profile")
    suspend fun updateUserProfile(
        @Header("Authorization") token: String,
        @Body user: User
    ): Response<User>
    
    @POST("users/upload-document")
    suspend fun uploadDocument(
        @Header("Authorization") token: String,
        @Body document: DocumentUpload
    ): Response<DocumentResponse>
    
    // Jobs endpoints
    @GET("jobs")
    suspend fun getJobs(
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20,
        @Query("search") search: String? = null,
        @Query("location") location: String? = null,
        @Query("job_type") jobType: String? = null,
        @Query("industry") industry: String? = null,
        @Query("salary_min") salaryMin: Double? = null,
        @Query("salary_max") salaryMax: Double? = null
    ): Response<JobsResponse>
    
    @GET("jobs/{jobId}")
    suspend fun getJobById(@Path("jobId") jobId: String): Response<Job>
    
    @POST("jobs/{jobId}/apply")
    suspend fun applyToJob(
        @Header("Authorization") token: String,
        @Path("jobId") jobId: String,
        @Body application: JobApplicationRequest
    ): Response<JobApplication>
    
    @GET("jobs/applied")
    suspend fun getAppliedJobs(
        @Header("Authorization") token: String,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20
    ): Response<ApplicationsResponse>
    
    @GET("jobs/saved")
    suspend fun getSavedJobs(
        @Header("Authorization") token: String,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20
    ): Response<JobsResponse>
    
    @POST("jobs/{jobId}/save")
    suspend fun saveJob(
        @Header("Authorization") token: String,
        @Path("jobId") jobId: String
    ): Response<MessageResponse>
    
    @DELETE("jobs/{jobId}/save")
    suspend fun unsaveJob(
        @Header("Authorization") token: String,
        @Path("jobId") jobId: String
    ): Response<MessageResponse>
    
    // Analytics endpoints
    @GET("analytics/career")
    suspend fun getCareerAnalytics(
        @Header("Authorization") token: String
    ): Response<CareerAnalytics>
    
    @GET("analytics/earnings")
    suspend fun getEarningsAnalytics(
        @Header("Authorization") token: String,
        @Query("period") period: String = "month"
    ): Response<EarningsAnalytics>
    
    @GET("analytics/applications")
    suspend fun getApplicationAnalytics(
        @Header("Authorization") token: String
    ): Response<ApplicationAnalytics>
    
    // Payments endpoints
    @GET("payments/history")
    suspend fun getPaymentHistory(
        @Header("Authorization") token: String,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20
    ): Response<PaymentHistoryResponse>
    
    @POST("payments/methods")
    suspend fun addPaymentMethod(
        @Header("Authorization") token: String,
        @Body paymentMethod: PaymentMethodRequest
    ): Response<PaymentMethod>
    
    @PUT("payments/methods/{methodId}")
    suspend fun updatePaymentMethod(
        @Header("Authorization") token: String,
        @Path("methodId") methodId: String,
        @Body paymentMethod: PaymentMethodRequest
    ): Response<PaymentMethod>
    
    @DELETE("payments/methods/{methodId}")
    suspend fun deletePaymentMethod(
        @Header("Authorization") token: String,
        @Path("methodId") methodId: String
    ): Response<MessageResponse>
    
    // Notifications endpoints
    @GET("notifications")
    suspend fun getNotifications(
        @Header("Authorization") token: String,
        @Query("page") page: Int = 1,
        @Query("limit") limit: Int = 20
    ): Response<NotificationsResponse>
    
    @PUT("notifications/{notificationId}/read")
    suspend fun markNotificationAsRead(
        @Header("Authorization") token: String,
        @Path("notificationId") notificationId: String
    ): Response<MessageResponse>
    
    // Support endpoints
    @POST("support/contact")
    suspend fun contactSupport(
        @Header("Authorization") token: String,
        @Body request: ContactSupportRequest
    ): Response<MessageResponse>
    
    @POST("support/feedback")
    suspend fun submitFeedback(
        @Header("Authorization") token: String,
        @Body request: FeedbackRequest
    ): Response<MessageResponse>
    
    @GET("support/faq")
    suspend fun getFAQ(): Response<FAQResponse>
}

// Request/Response data classes
data class LoginRequest(
    val email: String,
    val password: String
)

data class RegisterRequest(
    val firstName: String,
    val lastName: String,
    val email: String,
    val password: String,
    val phoneNumber: String? = null,
    val userType: String = "RIGGER"
)

data class AuthResponse(
    val user: User,
    val token: String,
    val refreshToken: String,
    val expiresIn: Long
)

data class RefreshTokenRequest(
    val refreshToken: String
)

data class ForgotPasswordRequest(
    val email: String
)

data class ResetPasswordRequest(
    val token: String,
    val newPassword: String
)

data class MessageResponse(
    val message: String,
    val success: Boolean = true
)

data class JobsResponse(
    val jobs: List<Job>,
    val totalCount: Int,
    val page: Int,
    val limit: Int,
    val hasMore: Boolean
)

data class ApplicationsResponse(
    val applications: List<JobApplication>,
    val totalCount: Int,
    val page: Int,
    val limit: Int,
    val hasMore: Boolean
)

data class JobApplicationRequest(
    val coverLetter: String,
    val proposedRate: Double?,
    val attachments: List<String>? = null
)

data class DocumentUpload(
    val documentType: String,
    val fileName: String,
    val fileData: String // Base64 encoded
)

data class DocumentResponse(
    val documentId: String,
    val url: String,
    val fileName: String
)

data class CareerAnalytics(
    val totalApplications: Int,
    val successRate: Float,
    val averageResponseTime: Int,
    val topSkills: List<String>,
    val industryBreakdown: Map<String, Int>,
    val monthlyStats: List<MonthlyStats>
)

data class MonthlyStats(
    val month: String,
    val applications: Int,
    val interviews: Int,
    val offers: Int
)

data class EarningsAnalytics(
    val totalEarnings: Double,
    val averageHourlyRate: Double,
    val totalHoursWorked: Int,
    val monthlyEarnings: List<MonthlyEarnings>,
    val topPayingIndustries: List<IndustryEarnings>
)

data class MonthlyEarnings(
    val month: String,
    val earnings: Double,
    val hoursWorked: Int
)

data class IndustryEarnings(
    val industry: String,
    val averageRate: Double,
    val totalJobs: Int
)

data class ApplicationAnalytics(
    val totalApplications: Int,
    val pendingApplications: Int,
    val acceptedApplications: Int,
    val rejectedApplications: Int,
    val applicationsByStatus: Map<String, Int>,
    val averageResponseTime: Int
)

data class PaymentHistoryResponse(
    val payments: List<PaymentHistory>,
    val totalCount: Int,
    val page: Int,
    val limit: Int
)

data class PaymentHistory(
    val id: String,
    val amount: Double,
    val currency: String,
    val description: String,
    val status: String,
    val createdAt: String,
    val jobTitle: String?
)

data class PaymentMethod(
    val id: String,
    val type: String,
    val last4: String,
    val brand: String,
    val expiryMonth: Int,
    val expiryYear: Int,
    val isDefault: Boolean
)

data class PaymentMethodRequest(
    val type: String,
    val token: String,
    val isDefault: Boolean = false
)

data class NotificationsResponse(
    val notifications: List<NotificationItem>,
    val totalCount: Int,
    val unreadCount: Int
)

data class NotificationItem(
    val id: String,
    val title: String,
    val body: String,
    val type: String,
    val isRead: Boolean,
    val createdAt: String,
    val data: Map<String, String>?
)

data class ContactSupportRequest(
    val subject: String,
    val message: String,
    val category: String
)

data class FeedbackRequest(
    val rating: Int,
    val message: String,
    val category: String
)

data class FAQResponse(
    val faqs: List<FAQItem>
)

data class FAQItem(
    val id: String,
    val question: String,
    val answer: String,
    val category: String
)
