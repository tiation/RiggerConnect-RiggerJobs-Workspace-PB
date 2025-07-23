package com.tiation.riggerconnect.domain.notification

import javax.inject.Inject

class NotificationService @Inject constructor() {
    fun sendNotification(notification: Notification): Result<Unit> {
        TODO("Implement notification sending")
    }

    fun getNotifications(userId: String): List<Notification> {
        TODO("Implement notifications retrieval")
    }

    fun markAsRead(notificationId: String): Result<Unit> {
        TODO("Implement mark as read")
    }
}

data class Notification(
    val id: String,
    val userId: String,
    val type: NotificationType,
    val title: String,
    val message: String,
    val data: Map<String, String>,
    val priority: NotificationPriority,
    val status: NotificationStatus,
    val createdAt: Long,
    val readAt: Long?
)

enum class NotificationType {
    JOB_POSTED,
    APPLICATION_RECEIVED,
    JOB_STARTED,
    JOB_COMPLETED,
    PAYMENT_RECEIVED,
    PAYMENT_SENT,
    COMPLIANCE_ALERT,
    SYSTEM_UPDATE
}

enum class NotificationPriority {
    LOW,
    NORMAL,
    HIGH,
    URGENT
}

enum class NotificationStatus {
    PENDING,
    SENT,
    DELIVERED,
    READ,
    FAILED
}

data class NotificationPreferences(
    val userId: String,
    val emailEnabled: Boolean = true,
    val pushEnabled: Boolean = true,
    val smsEnabled: Boolean = false,
    val doNotDisturbStart: Int? = null, // Hour of day (0-23)
    val doNotDisturbEnd: Int? = null,   // Hour of day (0-23)
    val disabledTypes: Set<NotificationType> = emptySet()
)
