#!/usr/bin/env python3
"""
RiggerHire Android App Integration Verification Script
Checks that all components work together properly
"""

import os
import re
import sys
from pathlib import Path
from typing import List, Dict, Set

class IntegrationChecker:
    def __init__(self):
        self.root_path = Path("/Users/tiaastor/tiation-github/RiggerHireApp-Android")
        self.issues = []
        self.warnings = []
        self.all_activities = set()
        self.all_imports = set()
        
    def check_file_structure(self):
        """Check that all necessary files exist"""
        print("🔍 Checking file structure...")
        
        required_files = [
            "app/build.gradle",
            "app/src/main/AndroidManifest.xml",
            "app/src/main/java/com/tiation/riggerhire/ui/MainActivity.kt",
            "app/src/main/java/com/tiation/riggerhire/ui/theme/RiggerHireTheme.kt",
            "app/src/main/java/com/tiation/riggerhire/ui/payments/PaymentsActivity.kt",
            "app/src/main/java/com/tiation/riggerhire/ui/jobs/JobDetailActivity.kt",
            "app/src/main/res/values/strings.xml",
            "app/src/main/res/values/colors.xml",
            "app/src/main/res/values/styles.xml"
        ]
        
        for file_path in required_files:
            full_path = self.root_path / file_path
            if not full_path.exists():
                self.issues.append(f"Missing required file: {file_path}")
            else:
                print(f"✅ {file_path}")
                
    def check_android_manifest(self):
        """Check AndroidManifest.xml for activity declarations"""
        print("\\n📋 Checking AndroidManifest.xml...")
        
        manifest_path = self.root_path / "app/src/main/AndroidManifest.xml"
        if not manifest_path.exists():
            self.issues.append("AndroidManifest.xml not found")
            return
            
        content = manifest_path.read_text()
        
        # Check for required activities
        required_activities = [
            "MainActivity",
            "LoginActivity", 
            "RegisterActivity",
            "JobDetailActivity",
            "JobsListActivity",
            "PaymentsActivity",
            "ProfileActivity"
        ]
        
        for activity in required_activities:
            # Pattern to match activity declaration
            pattern = rf'android:name=".*{activity}"'
            if re.search(pattern, content):
                print(f"✅ {activity} declared")
                self.all_activities.add(activity)
            else:
                self.warnings.append(f"Activity {activity} not found in manifest")
                
    def check_kotlin_files(self):
        """Check Kotlin files for common issues"""
        print("\\n🔧 Checking Kotlin files...")
        
        kotlin_files = list(self.root_path.glob("**/*.kt"))
        
        for kt_file in kotlin_files:
            self.check_kotlin_file(kt_file)
            
    def check_kotlin_file(self, file_path: Path):
        """Check individual Kotlin file"""
        try:
            content = file_path.read_text()
            file_name = file_path.name
            
            # Check for RiggerHireTheme import
            if "RiggerHireTheme" in content and "import com.tiation.riggerhire.ui.theme.RiggerHireTheme" not in content:
                # Check if it's MainActivity (which might have inline theme) or the theme file itself
                if "MainActivity.kt" not in str(file_path) and "RiggerHireTheme.kt" not in str(file_path):
                    self.warnings.append(f"{file_name}: Uses RiggerHireTheme but missing import")
                    
            # Check for common syntax issues
            if re.search(r'Color\(0x[0-9A-F]{1,5}\)', content):
                self.warnings.append(f"{file_name}: Found incomplete color definitions")
                
            # Check for missing @Composable annotations
            composable_functions = re.findall(r'fun\s+(\w+)\([^)]*\)\s*\{[^}]*Text\(', content)
            for func in composable_functions:
                if f"@Composable\n    fun {func}" not in content and re.search(rf"@Composable\s+fun {func}", content) is None:
                    self.warnings.append(f"{file_name}: Function {func} might need @Composable annotation")
                    
            print(f"✅ {file_name} - Basic syntax check passed")
            
        except Exception as e:
            self.issues.append(f"Error reading {file_path}: {e}")
            
    def check_theme_consistency(self):
        """Check theme color consistency across files"""
        print("\\n🎨 Checking theme consistency...")
        
        # Read colors.xml
        colors_file = self.root_path / "app/src/main/res/values/colors.xml"
        if colors_file.exists():
            colors_content = colors_file.read_text()
            
            # Extract color definitions
            color_definitions = re.findall(r'<color name="([^"]+)">#([0-9A-F]{6,8})</color>', colors_content)
            defined_colors = {name: value for name, value in color_definitions}
            
            print(f"✅ Found {len(defined_colors)} color definitions")
            
            # Check for consistent neon theme colors
            required_colors = ['neon_cyan', 'neon_magenta', 'dark_background', 'dark_surface', 'text_primary']
            for color in required_colors:
                if color in defined_colors:
                    print(f"✅ {color}: #{defined_colors[color]}")
                else:
                    self.issues.append(f"Missing required color: {color}")
        else:
            self.issues.append("colors.xml not found")
            
    def check_string_resources(self):
        """Check string resources are defined"""
        print("\\n📝 Checking string resources...")
        
        strings_file = self.root_path / "app/src/main/res/values/strings.xml"
        if strings_file.exists():
            strings_content = strings_file.read_text()
            
            # Check for app-specific strings
            required_strings = ['app_name', 'app_description', 'app_tagline']
            for string_name in required_strings:
                if f'<string name="{string_name}">' in strings_content:
                    print(f"✅ {string_name}")
                else:
                    self.issues.append(f"Missing required string: {string_name}")
        else:
            self.issues.append("strings.xml not found")
            
    def check_dependencies(self):
        """Check build.gradle dependencies"""
        print("\\n📦 Checking dependencies...")
        
        gradle_file = self.root_path / "app/build.gradle"
        if gradle_file.exists():
            gradle_content = gradle_file.read_text()
            
            required_deps = [
                'androidx.compose.material3:material3',
                'androidx.compose.ui:ui-tooling',
                'androidx.activity:activity-compose',
                'androidx.core:core-ktx'
            ]
            
            for dep in required_deps:
                if dep in gradle_content:
                    print(f"✅ {dep}")
                else:
                    self.warnings.append(f"Dependency might be missing: {dep}")
                    
            # Check Compose version compatibility
            if 'compose_version' in gradle_content:
                print("✅ Compose version variable found")
            else:
                self.warnings.append("compose_version variable not found")
                
        else:
            self.issues.append("build.gradle not found")
            
    def generate_summary(self):
        """Generate integration check summary"""
        print("\\n" + "="*60)
        print("🏗️ RiggerHire Android App - Integration Check Summary")
        print("="*60)
        
        if not self.issues and not self.warnings:
            print("🎉 ALL CHECKS PASSED! Your app structure looks good.")
            print("\\n✅ Ready for build and testing!")
            
            print("\\n📱 Available Activities:")
            for activity in sorted(self.all_activities):
                print(f"   • {activity}")
                
        else:
            if self.issues:
                print(f"\\n❌ CRITICAL ISSUES ({len(self.issues)}):")
                for issue in self.issues:
                    print(f"   • {issue}")
                    
            if self.warnings:
                print(f"\\n⚠️  WARNINGS ({len(self.warnings)}):")
                for warning in self.warnings:
                    print(f"   • {warning}")
                    
        print(f"\\n📊 Statistics:")
        print(f"   • Activities found: {len(self.all_activities)}")
        print(f"   • Critical issues: {len(self.issues)}")
        print(f"   • Warnings: {len(self.warnings)}")
        
        # Integration recommendations
        print("\\n💡 Next Steps:")
        if len(self.issues) == 0:
            print("   1. ✅ Structure verification complete")
            print("   2. 🔨 Ready to build with Android Studio")  
            print("   3. 📱 Test on device/emulator")
            print("   4. 🚀 Deploy to internal testing")
        else:
            print("   1. 🔧 Fix critical issues first")
            print("   2. ⚠️  Review warnings")
            print("   3. 🔄 Re-run verification")
            
    def run_all_checks(self):
        """Run all integration checks"""
        print("🏗️ RiggerHire Android App - Integration Verification")
        print("=" * 55)
        
        self.check_file_structure()
        self.check_android_manifest()
        self.check_kotlin_files()
        self.check_theme_consistency()
        self.check_string_resources()
        self.check_dependencies()
        self.generate_summary()
        
        return len(self.issues) == 0

def main():
    checker = IntegrationChecker()
    success = checker.run_all_checks()
    
    if success:
        sys.exit(0)
    else:
        sys.exit(1)

if __name__ == "__main__":
    main()
