package com.tiation.riggerhire.ui.theme

import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

/**
 * RiggerHire Dark Neon Theme
 * Consistent theme across all activities
 */
@Composable
fun RiggerHireTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = darkColorScheme(
            primary = Color(0xFF00FFFF), // neon_cyan
            secondary = Color(0xFFFF00FF), // neon_magenta
            tertiary = Color(0xFF39FF14), // neon_green
            background = Color(0xFF0D0D0D), // dark_background
            surface = Color(0xFF1A1A1A), // dark_surface
            surfaceVariant = Color(0xFF262626), // darker_surface
            onPrimary = Color(0xFF0D0D0D), // text_on_neon
            onSecondary = Color(0xFF0D0D0D), // text_on_neon
            onTertiary = Color(0xFF0D0D0D), // text_on_neon
            onBackground = Color(0xFFFFFFFF), // text_primary
            onSurface = Color(0xFFFFFFFF), // text_primary
            onSurfaceVariant = Color(0xFFB3B3B3), // text_secondary
            outline = Color(0xFF404040), // border_color
            outlineVariant = Color(0xFF808080) // border_secondary
        ),
        content = content
    )
}

// Color constants for consistency
object RiggerHireColors {
    val NeonCyan = Color(0xFF00FFFF)
    val NeonMagenta = Color(0xFFFF00FF) 
    val NeonGreen = Color(0xFF39FF14)
    val NeonYellow = Color(0xFFFFFF00)
    val NeonRed = Color(0xFFFF073A)
    
    val DarkBackground = Color(0xFF0D0D0D)
    val DarkSurface = Color(0xFF1A1A1A)
    val DarkerSurface = Color(0xFF262626)
    
    val TextPrimary = Color(0xFFFFFFFF)
    val TextSecondary = Color(0xFFB3B3B3)
    val TextTertiary = Color(0xFF808080)
    val TextOnNeon = Color(0xFF0D0D0D)
    
    val BorderPrimary = Color(0xFF404040)
    val BorderSecondary = Color(0xFF808080)
}
