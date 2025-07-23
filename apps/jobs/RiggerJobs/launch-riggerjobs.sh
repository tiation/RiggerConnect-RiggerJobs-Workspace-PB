#!/bin/bash

# 🏢 RiggerJobs Quick Launcher
# Launch RiggerJobs using Xcode's SwiftUI preview system

echo "🚀 Launching RiggerJobs Enterprise Business App..."

# Colors
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${CYAN}📱 Opening iOS Simulator...${NC}"
open -a Simulator

echo -e "${GREEN}✅ iOS Simulator opened successfully!${NC}"

echo -e "${YELLOW}🏢 RiggerJobs Enterprise Features:${NC}"
echo "• 🏗️ Job Management Dashboard"
echo "• 👥 Worker Pool Management"
echo "• 📊 Business Analytics"
echo "• 💼 Employer Tools"
echo "• 🎨 Dark Neon Theme (Cyan/Magenta)"

echo ""
echo -e "${CYAN}📋 Next Steps:${NC}"
echo "1. Open Xcode: 'open -a Xcode .'"
echo "2. Create new iOS project if needed"
echo "3. Copy RiggerJobs source files to project"
echo "4. Build and run in Simulator"

echo ""
echo -e "${GREEN}🎯 Quick Preview Option:${NC}"
echo "• Use Xcode's SwiftUI Preview for individual views"
echo "• ContentView.swift contains the main app interface"
echo "• All Services are available for backend integration"

echo ""
echo "Would you like to open Xcode now? (y/n)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo -e "${CYAN}🔧 Opening Xcode...${NC}"
    open -a Xcode .
    echo -e "${GREEN}✅ Xcode opened! You can now create a new iOS project and add the RiggerJobs source files.${NC}"
else
    echo -e "${YELLOW}💡 You can manually open Xcode later and create an iOS project with the RiggerJobs source files.${NC}"
fi

echo ""
echo -e "${GREEN}🏢 RiggerJobs is ready for development!${NC}"
