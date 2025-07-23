package com.tiation.riggerconnect.domain.finance

import javax.inject.Inject
import java.math.BigDecimal

class PaymentService @Inject constructor() {
    fun processPayment(payment: Payment): Result<PaymentResult> {
        TODO("Implement payment processing")
    }

    fun getPaymentHistory(userId: String): List<Payment> {
        TODO("Implement payment history retrieval")
    }

    fun generateInvoice(jobId: String): Result<Invoice> {
        TODO("Implement invoice generation")
    }
}

data class Payment(
    val id: String,
    val amount: BigDecimal,
    val currency: String = "AUD",
    val paymentMethod: PaymentMethod,
    val status: PaymentStatus,
    val jobId: String,
    val payerId: String,
    val payeeId: String,
    val createdAt: Long
)

enum class PaymentMethod {
    CREDIT_CARD,
    BANK_TRANSFER,
    PAYPAL
}

enum class PaymentStatus {
    PENDING,
    PROCESSING,
    COMPLETED,
    FAILED,
    REFUNDED
}

data class PaymentResult(
    val paymentId: String,
    val status: PaymentStatus,
    val transactionId: String?,
    val errorMessage: String?
)

data class Invoice(
    val id: String,
    val jobId: String,
    val businessId: String,
    val workerId: String,
    val amount: BigDecimal,
    val tax: BigDecimal,
    val total: BigDecimal,
    val dueDate: Long,
    val status: InvoiceStatus,
    val lineItems: List<InvoiceLineItem>,
    val createdAt: Long
)

enum class InvoiceStatus {
    DRAFT,
    SENT,
    PAID,
    OVERDUE,
    CANCELLED
}

data class InvoiceLineItem(
    val description: String,
    val quantity: Int,
    val unitPrice: BigDecimal,
    val total: BigDecimal
)
