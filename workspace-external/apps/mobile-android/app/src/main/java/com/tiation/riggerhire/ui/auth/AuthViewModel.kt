package com.tiation.riggerhire.ui.auth

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.tiation.riggerhire.data.models.AuthState
import com.tiation.riggerhire.data.models.User
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

/**
 * ViewModel for managing authentication
 */
class AuthViewModel : ViewModel() {

    private val _authState = MutableStateFlow(AuthState())
    val authState: StateFlow<AuthState> get() = _authState

    init {
        checkIfAuthenticated()
    }

    fun signIn(email: String, password: String) {
        // Placeholder for actual sign-in logic
        viewModelScope.launch {
            _authState.value = _authState.value.copy(isLoading = true)

            // Simulate network request
            kotlinx.coroutines.delay(1000)

            val user = User(email = email, firstName = "John", lastName = "Doe")
            _authState.value = AuthState(isAuthenticated = true, user = user, isLoading = false)
        }
    }

    fun signOut() {
        // Placeholder for actual sign-out logic
        viewModelScope.launch {
            _authState.value = AuthState()
        }
    }

    private fun checkIfAuthenticated() {
        // Placeholder for check if user is authenticated
        viewModelScope.launch {
            // Simulate checking stored credentials
            kotlinx.coroutines.delay(500)
            _authState.value = AuthState()
        }
    }
}
