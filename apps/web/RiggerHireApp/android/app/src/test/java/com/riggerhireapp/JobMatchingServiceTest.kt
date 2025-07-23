package com.riggerhireapp

import org.junit.Before
import org.junit.Test
import org.junit.Assert.*
import java.util.*

class JobMatchingServiceTest {
    private lateinit var matchingService: JobMatchingService

    @Before
    fun setup() {
        matchingService = JobMatchingService()
    }

    @Test
    fun `test matching qualified worker with job`() {
        // Given
        val job = Job(
            id = UUID.randomUUID(),
            title = "Senior Crane Operator",
            requirements = listOf("crane-license", "5-years-experience"),
            location = "Perth, WA",
            startDate = Date(),
            salary = SalaryRange(85000, 95000, "AUD")
        )

        val worker = Worker(
            id = UUID.randomUUID(),
            name = "John Doe",
            certifications = listOf("crane-license"),
            experience = 6,
            location = "Perth, WA",
            availability = true
        )

        // When
        val isMatch = matchingService.isWorkerQualified(worker, job)

        // Then
        assertTrue("Worker should match job requirements", isMatch)
    }

    @Test
    fun `test matching underqualified worker with job`() {
        // Given
        val job = Job(
            id = UUID.randomUUID(),
            title = "Senior Crane Operator",
            requirements = listOf("crane-license", "10-years-experience"),
            location = "Perth, WA",
            startDate = Date(),
            salary = SalaryRange(85000, 95000, "AUD")
        )

        val worker = Worker(
            id = UUID.randomUUID(),
            name = "John Doe",
            certifications = listOf("crane-license"),
            experience = 5,
            location = "Perth, WA",
            availability = true
        )

        // When
        val isMatch = matchingService.isWorkerQualified(worker, job)

        // Then
        assertFalse("Worker should not match job requirements due to insufficient experience", isMatch)
    }

    @Test
    fun `test location based matching`() {
        // Given
        val job = Job(
            id = UUID.randomUUID(),
            title = "Rigger",
            requirements = listOf("rigging-license"),
            location = "Perth, WA",
            startDate = Date(),
            salary = SalaryRange(75000, 85000, "AUD")
        )

        val worker = Worker(
            id = UUID.randomUUID(),
            name = "Jane Smith",
            certifications = listOf("rigging-license"),
            experience = 3,
            location = "Sydney, NSW",
            availability = true
        )

        // When
        val isMatch = matchingService.isWorkerQualified(worker, job)

        // Then
        assertFalse("Worker should not match due to different location", isMatch)
    }
}
