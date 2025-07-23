/**
 * RiggerHire - Enterprise Grade JavaScript Application
 * Handles frontend functionality and backend API integration
 */

// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000'
    : 'https://riggerhire-api.herokuapp.com';

const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        LOGOUT: '/api/auth/logout',
        REFRESH: '/api/auth/refresh'
    },
    USERS: {
        PROFILE: '/api/users/profile',
        UPDATE: '/api/users/profile'
    },
    JOBS: {
        LIST: '/api/jobs',
        CREATE: '/api/jobs',
        DETAIL: '/api/jobs',
        UPDATE: '/api/jobs',
        DELETE: '/api/jobs'
    },
    APPLICATIONS: {
        LIST: '/api/applications',
        CREATE: '/api/applications',
        UPDATE: '/api/applications'
    },
    PAYMENTS: {
        CREATE_INTENT: '/api/payments/create-payment-intent',
        CONFIRM: '/api/payments/confirm-payment'
    },
    CONTACT: '/api/contact'
};

// Application State
class AppState {
    constructor() {
        this.user = null;
        this.token = localStorage.getItem('rigger_token');
        this.isAuthenticated = false;
        this.jobs = [];
        this.applications = [];
    }

    setUser(user) {
        this.user = user;
        this.isAuthenticated = true;
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('rigger_token', token);
    }

    clearAuth() {
        this.user = null;
        this.token = null;
        this.isAuthenticated = false;
        localStorage.removeItem('rigger_token');
    }
}

// API Service
class APIService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // Add authentication token if available
        if (appState.token) {
            config.headers.Authorization = `Bearer ${appState.token}`;
        }

        try {
            const response = await fetch(url, config);
            
            // Handle unauthorized responses
            if (response.status === 401) {
                appState.clearAuth();
                this.showNotification('Session expired. Please log in again.', 'error');
                return null;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'An error occurred');
            }

            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            this.showNotification(error.message || 'Network error occurred', 'error');
            throw error;
        }
    }

    async login(credentials) {
        const data = await this.makeRequest(API_ENDPOINTS.AUTH.LOGIN, {
            method: 'POST',
            body: JSON.stringify(credentials)
        });

        if (data && data.token) {
            appState.setToken(data.token);
            appState.setUser(data.user);
        }

        return data;
    }

    async register(userData) {
        const data = await this.makeRequest(API_ENDPOINTS.AUTH.REGISTER, {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        if (data && data.token) {
            appState.setToken(data.token);
            appState.setUser(data.user);
        }

        return data;
    }

    async logout() {
        await this.makeRequest(API_ENDPOINTS.AUTH.LOGOUT, {
            method: 'POST'
        });
        appState.clearAuth();
    }

    async sendContactMessage(messageData) {
        return await this.makeRequest(API_ENDPOINTS.CONTACT, {
            method: 'POST',
            body: JSON.stringify(messageData)
        });
    }

    showNotification(message, type = 'success') {
        const toast = document.getElementById('successToast');
        const toastBody = toast.querySelector('.toast-body');
        const toastHeader = toast.querySelector('.toast-header strong');
        const toastIcon = toast.querySelector('.toast-header i');

        // Update content based on type
        if (type === 'error') {
            toastHeader.textContent = 'Error';
            toastIcon.className = 'fas fa-exclamation-circle text-danger me-2';
        } else {
            toastHeader.textContent = 'Success';
            toastIcon.className = 'fas fa-check-circle text-success me-2';
        }

        toastBody.textContent = message;

        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    }
}

// UI Components and Interactions
class UIController {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollEffects();
        this.setupAnimations();
        this.validateForms();
    }

    setupEventListeners() {
        // Navigation scroll effect
        window.addEventListener('scroll', this.handleNavbarScroll.bind(this));

        // Form submissions
        document.getElementById('loginForm')?.addEventListener('submit', this.handleLogin.bind(this));
        document.getElementById('registerForm')?.addEventListener('submit', this.handleRegister.bind(this));
        document.getElementById('contactForm')?.addEventListener('submit', this.handleContact.bind(this));

        // Smooth scroll for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.handleSmoothScroll.bind(this));
        });

        // Modal events
        document.addEventListener('shown.bs.modal', this.handleModalShown.bind(this));
        document.addEventListener('hidden.bs.modal', this.handleModalHidden.bind(this));

        // Service card interactions
        document.querySelectorAll('.service-card').forEach(card => {
            card.addEventListener('mouseenter', this.handleServiceCardHover.bind(this));
            card.addEventListener('mouseleave', this.handleServiceCardLeave.bind(this));
        });

        // Pricing card interactions
        document.querySelectorAll('.pricing-card').forEach(card => {
            card.addEventListener('click', this.handlePricingCardClick.bind(this));
        });
    }

    handleNavbarScroll() {
        const navbar = document.querySelector('.navbar');
        const scrolled = window.scrollY > 50;

        if (scrolled) {
            navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.5)';
        } else {
            navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    }

    handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = e.currentTarget.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            e.currentTarget.classList.add('active');
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        
        const credentials = {
            email: document.getElementById('loginEmail').value,
            password: document.getElementById('loginPassword').value
        };

        try {
            this.showFormLoading(form, true);
            const result = await apiService.login(credentials);
            
            if (result) {
                apiService.showNotification('Login successful!');
                bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
                this.updateUIForAuthenticatedUser();
                form.reset();
            }
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            this.showFormLoading(form, false);
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const form = e.target;

        // Validate passwords match
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            apiService.showNotification('Passwords do not match', 'error');
            return;
        }

        const userData = {
            companyName: document.getElementById('companyName').value,
            abn: document.getElementById('abn').value,
            firstName: document.getElementById('contactFirstName').value,
            lastName: document.getElementById('contactLastName').value,
            email: document.getElementById('registerEmail').value,
            phone: document.getElementById('phone').value,
            password: password,
            userType: 'business',
            profile: {
                companyName: document.getElementById('companyName').value,
                abn: document.getElementById('abn').value,
                contactName: `${document.getElementById('contactFirstName').value} ${document.getElementById('contactLastName').value}`,
                phone: document.getElementById('phone').value
            }
        };

        try {
            this.showFormLoading(form, true);
            const result = await apiService.register(userData);
            
            if (result) {
                apiService.showNotification('Registration successful! Welcome to RiggerHire!');
                bootstrap.Modal.getInstance(document.getElementById('registerModal')).hide();
                this.updateUIForAuthenticatedUser();
                form.reset();
            }
        } catch (error) {
            console.error('Registration error:', error);
        } finally {
            this.showFormLoading(form, false);
        }
    }

    async handleContact(e) {
        e.preventDefault();
        const form = e.target;

        const contactData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            company: document.getElementById('company').value,
            message: document.getElementById('message').value,
            type: 'general_inquiry'
        };

        try {
            this.showFormLoading(form, true);
            const result = await apiService.sendContactMessage(contactData);
            
            if (result) {
                apiService.showNotification('Message sent successfully! We\'ll get back to you soon.');
                form.reset();
            }
        } catch (error) {
            console.error('Contact form error:', error);
        } finally {
            this.showFormLoading(form, false);
        }
    }

    showFormLoading(form, loading) {
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;

        if (loading) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
            submitButton.dataset.originalText = originalText;
        } else {
            submitButton.disabled = false;
            submitButton.innerHTML = submitButton.dataset.originalText || originalText;
        }
    }

    updateUIForAuthenticatedUser() {
        const loginBtn = document.querySelector('[data-bs-target="#loginModal"]');
        const registerBtn = document.querySelector('[data-bs-target="#registerModal"]');

        if (appState.isAuthenticated && appState.user) {
            // Update navigation for authenticated user
            if (loginBtn && registerBtn) {
                const navButtons = loginBtn.parentElement.parentElement;
                navButtons.innerHTML = `
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                            <i class="fas fa-user-circle me-2"></i>${appState.user.firstName || 'User'}
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><a class="dropdown-item" href="/dashboard"><i class="fas fa-tachometer-alt me-2"></i>Dashboard</a></li>
                            <li><a class="dropdown-item" href="/profile"><i class="fas fa-user-edit me-2"></i>Profile</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="#" onclick="handleLogout()"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
                        </ul>
                    </li>
                `;
            }
        }
    }

    handleModalShown(e) {
        const modal = e.target;
        const firstInput = modal.querySelector('input');
        if (firstInput) {
            firstInput.focus();
        }
    }

    handleModalHidden(e) {
        const modal = e.target;
        const form = modal.querySelector('form');
        if (form) {
            form.reset();
            // Clear any error states
            form.querySelectorAll('.is-invalid').forEach(input => {
                input.classList.remove('is-invalid');
            });
        }
    }

    handleServiceCardHover(e) {
        const card = e.currentTarget;
        const icon = card.querySelector('.service-icon i');
        
        // Add pulse animation to icon
        icon.style.animation = 'pulse 1s ease-in-out';
    }

    handleServiceCardLeave(e) {
        const card = e.currentTarget;
        const icon = card.querySelector('.service-icon i');
        
        // Remove animation
        icon.style.animation = '';
    }

    handlePricingCardClick(e) {
        const card = e.currentTarget;
        const planName = card.querySelector('h3').textContent;
        
        if (!appState.isAuthenticated) {
            apiService.showNotification('Please login or register to select a plan', 'error');
            return;
        }

        // Handle plan selection logic here
        apiService.showNotification(`${planName} plan selected! Redirecting to setup...`);
        
        // Redirect to dashboard or setup page
        setTimeout(() => {
            window.location.href = '/dashboard?plan=' + encodeURIComponent(planName.toLowerCase());
        }, 1500);
    }

    setupScrollEffects() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fadeInUp');
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        document.querySelectorAll('.service-card, .process-step, .pricing-card, .safety-feature').forEach(el => {
            observer.observe(el);
        });
    }

    setupAnimations() {
        // Counter animation for statistics
        const counters = document.querySelectorAll('.stat-number');
        
        const animateCounter = (counter) => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const increment = target / 50;
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.textContent = Math.ceil(current) + (counter.textContent.includes('%') ? '%' : '+');
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = counter.textContent.includes('%') ? target + '%' : target + '+';
                }
            };
            
            updateCounter();
        };

        // Trigger counter animation when stats come into view
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => statsObserver.observe(counter));
    }

    validateForms() {
        // Email validation
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', this.validateEmail.bind(this));
        });

        // Phone validation
        const phoneInputs = document.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('blur', this.validatePhone.bind(this));
        });

        // ABN validation
        const abnInput = document.getElementById('abn');
        if (abnInput) {
            abnInput.addEventListener('blur', this.validateABN.bind(this));
            abnInput.addEventListener('input', this.formatABN.bind(this));
        }

        // Password strength validation
        const passwordInput = document.getElementById('registerPassword');
        if (passwordInput) {
            passwordInput.addEventListener('input', this.validatePasswordStrength.bind(this));
        }
    }

    validateEmail(e) {
        const input = e.target;
        const email = input.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (email && !emailRegex.test(email)) {
            this.setInputError(input, 'Please enter a valid email address');
        } else {
            this.clearInputError(input);
        }
    }

    validatePhone(e) {
        const input = e.target;
        const phone = input.value.replace(/\D/g, '');
        
        if (phone && (phone.length < 10 || phone.length > 11)) {
            this.setInputError(input, 'Please enter a valid phone number');
        } else {
            this.clearInputError(input);
            // Format phone number
            if (phone.length === 10) {
                input.value = phone.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3');
            } else if (phone.length === 11) {
                input.value = phone.replace(/(\d{2})(\d{4})(\d{3})(\d{3})/, '+$1 $2 $3 $4');
            }
        }
    }

    validateABN(e) {
        const input = e.target;
        const abn = input.value.replace(/\s/g, '');
        
        if (abn && abn.length !== 11) {
            this.setInputError(input, 'ABN must be 11 digits');
        } else {
            this.clearInputError(input);
        }
    }

    formatABN(e) {
        const input = e.target;
        let value = input.value.replace(/\D/g, '');
        
        if (value.length > 11) {
            value = value.substring(0, 11);
        }
        
        // Format as XX XXX XXX XXX
        if (value.length > 2) {
            value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');
        }
        
        input.value = value;
    }

    validatePasswordStrength(e) {
        const input = e.target;
        const password = input.value;
        
        const requirements = [
            { regex: /.{8,}/, text: 'At least 8 characters' },
            { regex: /[A-Z]/, text: 'One uppercase letter' },
            { regex: /[a-z]/, text: 'One lowercase letter' },
            { regex: /\d/, text: 'One number' },
            { regex: /[!@#$%^&*(),.?":{}|<>]/, text: 'One special character' }
        ];

        const strength = requirements.filter(req => req.regex.test(password)).length;
        
        let strengthText = '';
        let strengthClass = '';
        
        switch (strength) {
            case 0:
            case 1:
                strengthText = 'Weak';
                strengthClass = 'text-danger';
                break;
            case 2:
            case 3:
                strengthText = 'Medium';
                strengthClass = 'text-warning';
                break;
            case 4:
            case 5:
                strengthText = 'Strong';
                strengthClass = 'text-success';
                break;
        }

        // Create or update password strength indicator
        let strengthIndicator = input.parentElement.querySelector('.password-strength');
        if (!strengthIndicator && password) {
            strengthIndicator = document.createElement('div');
            strengthIndicator.className = 'password-strength mt-2 small';
            input.parentElement.appendChild(strengthIndicator);
        }

        if (strengthIndicator) {
            if (password) {
                strengthIndicator.innerHTML = `<span class="${strengthClass}">Password strength: ${strengthText}</span>`;
            } else {
                strengthIndicator.remove();
            }
        }
    }

    setInputError(input, message) {
        input.classList.add('is-invalid');
        
        let feedback = input.parentElement.querySelector('.invalid-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            input.parentElement.appendChild(feedback);
        }
        feedback.textContent = message;
    }

    clearInputError(input) {
        input.classList.remove('is-invalid');
        const feedback = input.parentElement.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.remove();
        }
    }
}

// Utility Functions
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        const offsetTop = element.getBoundingClientRect().top + window.pageYOffset - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

async function handleLogout() {
    try {
        await apiService.logout();
        apiService.showNotification('Logged out successfully');
        // Reload page to reset UI
        window.location.reload();
    } catch (error) {
        console.error('Logout error:', error);
        // Clear local state even if API call fails
        appState.clearAuth();
        window.location.reload();
    }
}

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize global instances
    window.appState = new AppState();
    window.apiService = new APIService();
    window.uiController = new UIController();

    // Check if user is already authenticated
    if (appState.token) {
        // Verify token validity and get user info
        apiService.makeRequest('/api/auth/verify')
            .then(data => {
                if (data && data.user) {
                    appState.setUser(data.user);
                    uiController.updateUIForAuthenticatedUser();
                }
            })
            .catch(() => {
                // Token is invalid, clear it
                appState.clearAuth();
            });
    }

    console.log('🚀 RiggerHire application initialized successfully!');
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AppState,
        APIService,
        UIController,
        API_ENDPOINTS
    };
}
