package com.tiation.riggerconnect.domain.user

import javax.inject.Inject

class UserService @Inject constructor() {
    // User lifecycle management
    fun registerUser(registration: UserRegistration): Result<User> {
        TODO("Implement user registration")
    }

    fun updateProfile(userId: String, updates: ProfileUpdates): Result<User> {
        TODO("Implement profile update")
    }

    fun archiveUser(userId: String): Result<Unit> {
        TODO("Implement user archival")
    }
}

data class UserRegistration(
    val email: String,
    val password: String,
    val fullName: String,
    val role: UserRole,
    val phone: String,
    val businessDetails: BusinessDetails? = null
)

data class User(
    val id: String,
    val email: String,
    val fullName: String,
    val role: UserRole,
    val phone: String,
    val status: UserStatus,
    val businessDetails: BusinessDetails? = null,
    val createdAt: Long,
    val updatedAt: Long
)

enum class UserRole {
    ADMIN,
    BUSINESS,
    WORKER
}

enum class UserStatus {
    ACTIVE,
    SUSPENDED,
    ARCHIVED
}

data class BusinessDetails(
    val companyName: String,
    val abn: String,
    val address: Address,
    val insuranceDetails: InsuranceDetails
)

data class Address(
    val street: String,
    val city: String,
    val state: String,
    val postcode: String,
    val country: String = "Australia"
)

data class InsuranceDetails(
    val provider: String,
    val policyNumber: String,
    val expiryDate: Long,
    val coverageAmount: Double
)

data class ProfileUpdates(
    val fullName: String? = null,
    val phone: String? = null,
    val businessDetails: BusinessDetails? = null
)
