/**
 * SaaS Pricing Page Component
 * Enterprise-grade subscription management with dark neon theme
 * Supports Stripe and Supabase payment processing
 */

import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import './SaaSPricingPage.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const SaaSPricingPage = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [user, setUser] = useState(null);

    // Subscription plans with enterprise-grade features
    const subscriptionPlans = [
        {
            id: 'basic',
            name: 'Basic Rigger',
            price: 29,
            currency: 'AUD',
            description: 'Perfect for individual riggers getting started',
            features: [
                'Post up to 10 jobs per month',
                'Basic job matching algorithm',
                'Email support',
                'Mobile app access',
                'Basic safety compliance tracking'
            ],
            highlighted: false,
            ctaText: 'Start Basic Plan'
        },
        {
            id: 'professional',
            name: 'Professional Rigger',
            price: 79,
            currency: 'AUD',
            description: 'For serious riggers and small businesses',
            features: [
                'Unlimited job postings',
                'Advanced AI-powered matching',
                'Priority support',
                'Analytics dashboard',
                'Equipment rental marketplace',
                'Custom profile branding',
                'Advanced safety reporting'
            ],
            highlighted: true,
            ctaText: 'Choose Professional'
        },
        {
            id: 'enterprise',
            name: 'Enterprise',
            price: 199,
            currency: 'AUD',
            description: 'For large mining companies and contractors',
            features: [
                'White-label platform',
                'Custom integrations',
                '24/7 dedicated support',
                'Advanced analytics & reporting',
                'Multi-tenant architecture',
                'Custom compliance workflows',
                'API access',
                'Dedicated account manager'
            ],
            highlighted: false,
            ctaText: 'Contact Enterprise'
        }
    ];

    useEffect(() => {
        setPlans(subscriptionPlans);
        // Load user data from your auth system
        // setUser(getCurrentUser());
    }, []);

    const handleSubscribe = async (planId) => {
        setLoading(true);
        setSelectedPlan(planId);

        try {
            if (!user) {
                // Redirect to login if user not authenticated
                window.location.href = '/login?redirect=/pricing';
                return;
            }

            // Create Stripe customer if needed
            const customerResponse = await fetch('/api/payments/stripe/customers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.authToken}`
                },
                body: JSON.stringify({
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    company: user.company
                })
            });

            const { data: customerData } = await customerResponse.json();

            // Create subscription
            const subscriptionResponse = await fetch('/api/payments/stripe/subscriptions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.authToken}`
                },
                body: JSON.stringify({
                    customer_id: customerData.customer_id,
                    plan_id: planId
                })
            });

            const { data: subscriptionData } = await subscriptionResponse.json();

            // Redirect to Stripe Checkout or handle payment
            const stripe = await stripePromise;
            const { error } = await stripe.confirmPayment({
                clientSecret: subscriptionData.client_secret,
                confirmParams: {
                    return_url: `${window.location.origin}/subscription/success`
                }
            });

            if (error) {
                console.error('Payment failed:', error);
                alert('Payment failed. Please try again.');
            }
        } catch (error) {
            console.error('Subscription error:', error);
            alert('Failed to create subscription. Please try again.');
        } finally {
            setLoading(false);
            setSelectedPlan(null);
        }
    };

    const handleEnterpriseContact = () => {
        window.location.href = 'mailto:tiatheone@protonmail.com?subject=Enterprise%20Rigger%20Platform%20Inquiry';
    };

    return (
        <div className="saas-pricing-page">
            {/* Hero Section */}
            <div className="pricing-hero">
                <div className="hero-content">
                    <h1 className="hero-title">
                        <span className="gradient-text">Choose Your Rigger Plan</span>
                    </h1>
                    <p className="hero-subtitle">
                        Enterprise-grade solutions for riggers, crane operators, and mining companies
                    </p>
                    <div className="hero-stats">
                        <div className="stat">
                            <span className="stat-number">$300K+</span>
                            <span className="stat-label">Annual Revenue Potential</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">5%</span>
                            <span className="stat-label">Marketplace Commission</span>
                        </div>
                        <div className="stat">
                            <span className="stat-number">24/7</span>
                            <span className="stat-label">Enterprise Support</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="pricing-section">
                <div className="pricing-container">
                    <div className="pricing-grid">
                        {plans.map((plan) => (
                            <div 
                                key={plan.id} 
                                className={`pricing-card ${plan.highlighted ? 'highlighted' : ''}`}
                            >
                                {plan.highlighted && (
                                    <div className="popular-badge">
                                        <span>Most Popular</span>
                                    </div>
                                )}
                                
                                <div className="card-header">
                                    <h3 className="plan-name">{plan.name}</h3>
                                    <div className="price-container">
                                        <span className="currency">{plan.currency}</span>
                                        <span className="price">${plan.price}</span>
                                        <span className="period">/month</span>
                                    </div>
                                    <p className="plan-description">{plan.description}</p>
                                </div>

                                <div className="card-body">
                                    <ul className="features-list">
                                        {plan.features.map((feature, index) => (
                                            <li key={index} className="feature-item">
                                                <span className="feature-icon">✓</span>
                                                <span className="feature-text">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="card-footer">
                                    <button 
                                        className={`cta-button ${plan.highlighted ? 'primary' : 'secondary'}`}
                                        onClick={() => 
                                            plan.id === 'enterprise' 
                                                ? handleEnterpriseContact() 
                                                : handleSubscribe(plan.id)
                                        }
                                        disabled={loading && selectedPlan === plan.id}
                                    >
                                        {loading && selectedPlan === plan.id ? (
                                            <span className="loading-spinner"></span>
                                        ) : (
                                            plan.ctaText
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Marketplace Section */}
            <div className="marketplace-section">
                <div className="marketplace-container">
                    <h2 className="section-title">
                        <span className="gradient-text">B2B Marketplace Revenue</span>
                    </h2>
                    <div className="marketplace-grid">
                        <div className="marketplace-card">
                            <div className="marketplace-icon">🏗️</div>
                            <h3>Equipment Rentals</h3>
                            <p>Rent cranes, rigging equipment, and safety gear with integrated payment processing</p>
                            <span className="revenue-info">5% commission on all transactions</span>
                        </div>
                        <div className="marketplace-card">
                            <div className="marketplace-icon">👷‍♂️</div>
                            <h3>Job Placements</h3>
                            <p>Connect riggers with mining companies and construction projects</p>
                            <span className="revenue-info">Platform fee on successful placements</span>
                        </div>
                        <div className="marketplace-card">
                            <div className="marketplace-icon">📊</div>
                            <h3>Service Bookings</h3>
                            <p>Book certified rigging services, inspections, and consulting</p>
                            <span className="revenue-info">Recurring service subscriptions</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="faq-section">
                <div className="faq-container">
                    <h2 className="section-title">Frequently Asked Questions</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h4>What payment methods do you accept?</h4>
                            <p>We accept all major credit cards, bank transfers, and PayPal through our Stripe integration. Enterprise customers can also set up invoice billing.</p>
                        </div>
                        <div className="faq-item">
                            <h4>Can I change my plan anytime?</h4>
                            <p>Yes, you can upgrade or downgrade your plan at any time. Changes are prorated and will be reflected in your next billing cycle.</p>
                        </div>
                        <div className="faq-item">
                            <h4>Is there a free trial?</h4>
                            <p>We offer a 14-day free trial for all plans. No credit card required to start your trial.</p>
                        </div>
                        <div className="faq-item">
                            <h4>What about marketplace fees?</h4>
                            <p>Our marketplace charges a 5% commission on successful transactions with a minimum fee of $2.50. This covers payment processing and platform maintenance.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="cta-section">
                <div className="cta-container">
                    <h2 className="cta-title">Ready to Transform Your Rigging Business?</h2>
                    <p className="cta-subtitle">
                        Join hundreds of riggers and mining companies already using our platform
                    </p>
                    <div className="cta-buttons">
                        <button 
                            className="cta-button primary large"
                            onClick={() => handleSubscribe('professional')}
                        >
                            Start Free Trial
                        </button>
                        <button 
                            className="cta-button secondary large"
                            onClick={handleEnterpriseContact}
                        >
                            Contact Enterprise Sales
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SaaSPricingPage;
