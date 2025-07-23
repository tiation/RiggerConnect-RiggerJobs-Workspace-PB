package com.tiation.riggerhire.data.models

import android.os.Parcelable
import kotlinx.parcelize.Parcelize
import java.util.*

/**
 * Job model for RiggerHire Android App
 * Corresponds to iOS Job.swift model
 */
@Parcelize
data class Job(
    val id: String = UUID.randomUUID().toString(),
    val title: String = "",
    val companyName: String = "",
    val description: String = "",
    val shortDescription: String = "",
    val requirements: List<String> = emptyList(),
    val benefits: List<String> = emptyList(),
    val jobType: JobType = JobType.CONTRACT,
    val industry: Industry = Industry.MINING,
    val location: Location? = null,
    val salaryMin: Double = 0.0,
    val salaryMax: Double = 0.0,
    val hourlyRate: Double = 0.0,
    val isRemote: Boolean = false,
    val isUrgent: Boolean = false,
    val experienceLevel: ExperienceLevel = ExperienceLevel.MID_LEVEL,
    val skillsRequired: List<String> = emptyList(),
    val certificationsRequired: List<String> = emptyList(),
    val contactEmail: String = "",
    val contactPhone: String = "",
    val applicationDeadline: Date? = null,
    val startDate: Date? = null,
    val endDate: Date? = null,
    val duration: String = "",
    val shift: ShiftType = ShiftType.DAY_SHIFT,
    val accommodation: Boolean = false,
    val transport: Boolean = false,
    val meals: Boolean = false,
    val ppe: Boolean = false,
    val postedDate: Date = Date(),
    val isActive: Boolean = true,
    val viewCount: Int = 0,
    val applicationCount: Int = 0,
    val employerId: String = "",
    val tags: List<String> = emptyList(),
    val images: List<String> = emptyList(),
    val coordinates: Coordinates? = null
) : Parcelable

@Parcelize
data class Coordinates(
    val latitude: Double = 0.0,
    val longitude: Double = 0.0
) : Parcelable

enum class JobType {
    PERMANENT,
    CONTRACT,
    CASUAL,
    TEMP,
    APPRENTICESHIP,
    INTERNSHIP
}

enum class Industry {
    MINING,
    CONSTRUCTION,
    INDUSTRIAL,
    INFRASTRUCTURE,
    ENERGY,
    MANUFACTURING,
    LOGISTICS
}

enum class ExperienceLevel {
    ENTRY_LEVEL,
    MID_LEVEL,
    SENIOR_LEVEL,
    EXPERT_LEVEL
}

enum class ShiftType {
    DAY_SHIFT,
    NIGHT_SHIFT,
    SWING_SHIFT,
    FIFO, // Fly In Fly Out
    DIDO, // Drive In Drive Out
    ROSTER_2_1, // 2 weeks on, 1 week off
    ROSTER_4_1, // 4 weeks on, 1 week off
    ROSTER_8_6  // 8 days on, 6 days off
}

/**
 * Job Application model
 */
@Parcelize
data class JobApplication(
    val id: String = UUID.randomUUID().toString(),
    val jobId: String = "",
    val userId: String = "",
    val coverLetter: String = "",
    val proposedRate: Double = 0.0,
    val status: ApplicationStatus = ApplicationStatus.PENDING,
    val appliedDate: Date = Date(),
    val reviewedDate: Date? = null,
    val notes: String = "",
    val attachments: List<String> = emptyList()
) : Parcelable

enum class ApplicationStatus {
    PENDING,
    REVIEWED,
    SHORTLISTED,
    INTERVIEW,
    REJECTED,
    ACCEPTED,
    WITHDRAWN
}

/**
 * Job search filters
 */
data class JobFilters(
    val searchQuery: String = "",
    val location: String = "",
    val radius: Int = 50, // km
    val jobTypes: List<JobType> = emptyList(),
    val industries: List<Industry> = emptyList(),
    val experienceLevel: ExperienceLevel? = null,
    val salaryMin: Double? = null,
    val salaryMax: Double? = null,
    val isRemote: Boolean? = null,
    val isUrgent: Boolean? = null,
    val hasAccommodation: Boolean? = null,
    val hasTransport: Boolean? = null,
    val skills: List<String> = emptyList(),
    val sortBy: SortBy = SortBy.NEWEST
)

enum class SortBy {
    NEWEST,
    OLDEST,
    SALARY_HIGH_TO_LOW,
    SALARY_LOW_TO_HIGH,
    DISTANCE,
    RELEVANCE
}
