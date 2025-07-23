# Shared Libraries

📚 **Reusable Core Components  Accelerating Software Development**

![Shared Libraries](./docs/images/shared-libraries-banner.png)

## 📱 Mobile-First Shared Components

### Utility Functions
- **Cross-Platform Helpers**: Universal utility methods for React Native and native apps
- **Theme Management**: Centralized styling with context-aware theme switching
- **State Management**: Lightweight state hooks with enterprise-grade performance
- **Session Handling**: Secure storage and retrieval for session tokens and state

### Dark Neon Themed Components
- **UI Components**: Pre-styled React components with dark neon themes
- **Gradient Animations**: Lifecycle-aware gradient transitions and effects
- **Glow Effects**: Optimized neon glow effects with high frame-rate support
- **Accessibility Hooks**: Implement boilerplate-free accessibility integration

## 🏗️ Architecture

```mermaid
graph TD
    A[Mobile Apps] -- B[Shared Library]
    C[Web Applications] -- B
    B -- D[Utility Functions]
    B -- E[UI Components]
    B -- F[API Clients]
    D -- G[Cross-Platform Utilities]
    E -- H[Theming System]
    F -- I[GraphQL/REST Clients]
    J[Analytics Dashboard] -- B
```

## 🔧 Core Features

### Common Components Package
- **Reusable Buttons**: Configurable buttons with safety-compliant design modes
- **Responsive Forms**: Adaptive forms with validation and accessibility hooks
- **List & Grid Components**: Data-driven lists and grids with performance optimizations
- **Dialogues & Alerts**: Themed modal dialogues with neon-style alerts and prompts

### API Client Library
- **GraphQL Client**: Unified GraphQL queries and mutations with mobile optimization
- **REST Client**: Efficient REST resource management with caching strategies
- **Socket Handling**: Real-time data update clients for mobile and web apps
- **Third-Party Integration**: Interface clients for external platform services

### Theming  Applied Enterprise Themes
- **Dynamic Theming**: Runtime theme switching for light/dark modes and accessibility enhancements
- **Design Tokens**: Centralized theme management with environmental-specific tokens
- **Brand Styling**: Cyan/Magenta gradient and fluorescent tones for cohesive visuals
- **Accessible Colors**: Ensures all themed components meet accessibility guidelines

## 📚 Modules Overview

### Utility Functions
- **Date  Time Utilities**: Robust date-time parsing, formatting, and time zone conversions
- **Networking**: Simplified REST/GraphQL request helpers with retry logic
- **Math & Algorithm Libraries**: Pre-built computations and common algorithms for data science
- **IoT Data Handling**: Mining IoT-specific data parsers and normalizers

### API Clients
- **Auth Client**: JWT token handling and refresh mechanisms
- **Safety Compliance Client**: API for managing worker and equipment compliance records
- **Payment Client**: Interfaces for Stripe and Supabase billing and revenue sharing

## 🔧 Development Guidelines

### Prerequisites
```bash
# Required Libraries
node = 18.0.0
typescript = 4.5

# UI/UX Frameworks
react = 18.2.0
react-native = 0.72.0

# Styling Language
tailwindcss = 3.0.0
```

### Development Setup
```bash
# Clone repository
git clone https://github.com/yourusername/tiation-rigger-workspace.git
cd SharedLibraries

# Install dependencies
npm install

tsc --init  # Initialize TypeScript configuration

# Start development
npm run dev

# Build shared libraries
npm run build

# Run tests
npm test

# Format code
npm run format
```

### Using Shared Components

## React Native Component Usage
```typescript
// Import shared library components
import { Button, ThemedView, useTheme, Utilities } from '@rigger/shared';

const JobButton = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        ThemedView style={styles.container}__)
            __Button 
                __title='Apply Now'
                theme={theme}
                onPress={Utilities.navigateToJobDetail}
                style={styles.button}
            __
            __Button
                __title='Toggle Theme'
                onPress={toggleTheme}
                style={styles.toggleButton}
                textColor={theme.secondary}
            __
        __ThemedView__
    );
}

export default JobButton;

const styles = {
    container: {
        padding: 16,
        backgroundColor: 'theme.background',
    },
    button: {
        marginVertical: 10,
        padding: 12,
        backgroundColor: 'theme.primary',
        borderRadius: 8,
    },
    toggleButton: {
        marginVertical: 10,
        padding: 12,
        backgroundColor: 'theme.surface',
        borderRadius: 8,
    }
};
```

## ⚙️ Themed Component Styling
```json
{
    "sharedThemes": {
        "dark-neon": {
            "colors": {
                "background": "#0A0A0A",
                "surface": "#1A1A1A",
                "primary": "#00FFFF",
                "secondary": "#FF00FF",
                "text": "#FFFFFF",
                "accent": "#00FF00",
                
                "error": "#FF3366",
                "border": "#333333",
                "placeholder": "#888888"
            },
            "glowEffects": {
                "glowColor": "#00FFFF",
                "intensity": 0.8,
                "blurRadius": 10
            },
            "typography": {
                "heading": {
                    "fontSize": 28,
                    "fontWeight": "bold",
                    "color": "#00FFFF"
                },
                "subheading": {
                    "fontSize": 24,
                    "fontWeight": "600",
                    "color": "#FFFFFF"
                }
            },
            "shadows": {
                "lightShadow": {
                    "shadowColor": "#000000",
                    "shadowOffset": {"width": 1, "height": 1},
                    "shadowOpacity": 0.2,
                    "shadowRadius": 3
                },
                "deepShadow": {
                    "shadowColor": "#00FFFF",
                    "shadowOffset": {"width": 0, "height": 0},
                    "shadowOpacity": 0.6,
                    "shadowRadius": 8
                }
            }
        }
    }
}
```

## 🤝 Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for shared libraries contribution guidelines.

## 📄 License

MIT License - see [LICENSE.md](./LICENSE.md) for details.

## 📞 Support

- 📧 **Development Support**: tiatheone@protonmail.com
- 🐙 **GitHub Issues**: [Shared Libraries Issues](https://github.com/yourusername/tiation-rigger-workspace/issues)

---

**Building reusable components for fast and reliable software engineering**

*Efficiency, consistency, dark-neon styling*
