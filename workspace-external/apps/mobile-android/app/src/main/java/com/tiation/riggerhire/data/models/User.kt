package com.tiation.riggerhire.data.models

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import java.util.*

/**
 * User model for RiggerHire Android App
 * Corresponds to iOS User.swift model
 */
@Parcelize
data class User(
    val id: String = UUID.randomUUID().toString(),
    val firstName: String = "",
    val lastName: String = "",
    val email: String = "",
    val phoneNumber: String = "",
    val profileImageUrl: String = "",
    val userType: UserType = UserType.RIGGER,
    val isVerified: Boolean = false,
    val isActive: Boolean = true,
    val profileCompleteness: Float = 0.0f,
    val averageRating: Float = 0.0f,
    val totalJobs: Int = 0,
    val yearsOfExperience: Int = 0,
    val hourlyRate: Double = 0.0,
    val skills: List<String> = emptyList(),
    val certifications: List<String> = emptyList(),
    val location: Location? = null,
    val createdAt: Date = Date(),
    val updatedAt: Date = Date()
) : Parcelable

@Parcelize
data class Location(
    val latitude: Double = 0.0,
    val longitude: Double = 0.0,
    val address: String = "",
    val city: String = "",
    val state: String = "WA",
    val country: String = "Australia"
) : Parcelable

enum class UserType {
    RIGGER,
    EMPLOYER,
    ADMIN
}

/**
 * Authentication state management
 */
data class AuthState(
    val isAuthenticated: Boolean = false,
    val user: User? = null,
    val token: String = "",
    val refreshToken: String = "",
    val isLoading: Boolean = false,
    val error: String? = null
)
