"""
Mobile Stability Fix Script
Applies surgical fixes to all components to prevent iPhone Safari overflow issues.
"""

import os
import re
from pathlib import Path

# Base directory
BASE_DIR = Path(r"c:\Projetos VS Code\credimestre\credimestre-prototype\src")

def fix_app_layout():
    """Fix AppLayout.tsx - add overflow protection"""
    file_path = BASE_DIR / "components" / "layout" / "AppLayout.tsx"
    content = file_path.read_text(encoding="utf-8")
    
    # Replace root div
    content = content.replace(
        'className="min-h-dvh bg-background font-sans text-foreground selection:bg-primary/10"',
        'className="min-h-dvh bg-background font-sans text-foreground selection:bg-primary/10 w-full max-w-full overflow-x-hidden"'
    )
    
    # Fix main tag
    content = content.replace(
        'className="md:pl-64 min-h-dvh transition-all duration-300 ease-in-out"',
        'className="md:pl-64 min-h-dvh w-full max-w-full overflow-x-hidden transition-all duration-300 ease-in-out"'
    )
    
    # Fix container div
    content = content.replace(
        'className="container max-w-7xl mx-auto px-4 md:p-8 pb-24 md:pb-8 animate-fade-in"',
        'className="container max-w-7xl mx-auto px-4 md:p-8 pb-24 md:pb-8 w-full max-w-full overflow-x-hidden animate-fade-in"'
    )
    
    file_path.write_text(content, encoding="utf-8")
    print(f"✅ Fixed: {file_path}")

def fix_dashboard_page():
    """Fix DashboardPage.tsx - add overflow protection and min-w-0"""
    file_path = BASE_DIR / "pages" / "DashboardPage.tsx"
    content = file_path.read_text(encoding="utf-8")
    
    # Fix main container
    content = content.replace(
       'className="space-y-8"',
        'className="space-y-8 w-full max-w-full overflow-x-hidden"'
    )
    
    # Wrap DashboardCards
    content = content.replace(
        '<DashboardCards data={data} />',
        '<div className="w-full max-w-full overflow-x-hidden">\n                <DashboardCards data={data} />\n            </div>'
    )
    
    # Wrap AlertsSection
    content = content.replace(
        '<AlertsSection />',
        '<div className="w-full max-w-full overflow-x-hidden">\n                <AlertsSection />\n            </div>'
    )
    
    # Fix grid
    content = content.replace(
        'className="grid gap-6 grid-cols-1 lg:grid-cols-7"',
        'className="grid gap-6 grid-cols-1 lg:grid-cols-7 w-full max-w-full min-w-0"'
    )
    
    # Fix grid children
    content = content.replace(
        'className="lg:col-span-4"',
        'className="lg:col-span-4 min-w-0 w-full max-w-full overflow-hidden"'
    )
    content = content.replace(
        'className="lg:col-span-3"',
        'className="lg:col-span-3 min-w-0 w-full max-w-full overflow-hidden"'
    )
    
    file_path.write_text(content, encoding="utf-8")
    print(f"✅ Fixed: {file_path}")

def fix_revenue_chart():
    """Fix RevenueChart.tsx - wrap chart"""
    file_path = BASE_DIR / "components" / "dashboard" / "RevenueChart.tsx"
    content = file_path.read_text(encoding="utf-8")
    
    # Wrap entire return with overflow protection
    content = content.replace(
        'export function RevenueChart({ data }: RevenueChartProps) {\n    return (',
        'export function RevenueChart({ data }: RevenueChartProps) {\n    return (\n        <div className="w-full max-w-full overflow-hidden min-w-0">'
    )
    
    # Add closing div before final )
    content = content.replace(
        '        </Card>\n    )\n}',
        '        </Card>\n        </div>\n    )\n}'
    )
    
    # Add overflow to Card
    content = content.replace(
        'className="col-span-4 border-white/10 bg-card/50 backdrop-blur-sm shadow-soft hover:shadow-medium transition-all duration-300"',
        'className="col-span-4 border-white/10 bg-card/50 backdrop-blur-sm shadow-soft hover:shadow-medium transition-all duration-300 w-full max-w-full overflow-hidden"'
    )
    
    # Wrap ResponsiveContainer
    content = content.replace(
        '            <CardContent className="pl-2">\n                <ResponsiveContainer',
        '            <CardContent className="pl-2">\n                <div className="w-full max-w-full overflow-hidden min-w-0">\n                    <ResponsiveContainer'
    )
    
    content = content.replace(
        '                </ResponsiveContainer>\n            </CardContent>',
        '                </ResponsiveContainer>\n                </div>\n            </CardContent>'
    )
    
    file_path.write_text(content, encoding="utf-8")
    print(f"✅ Fixed: {file_path}")

def fix_recent_loans():
    """Fix RecentLoans.tsx - wrap table"""
    file_path = BASE_DIR / "components" / "dashboard" / "RecentLoans.tsx"
    content = file_path.read_text(encoding="utf-8")
    
    # Wrap Table with overflow-x-auto
    content = content.replace(
        '                <Table>',
        '                <div className="w-full max-w-full overflow-x-auto min-w-0">\n                    <Table>'
    )
    
    content = content.replace(
        '                </Table>\n            </CardContent>',
        '                </Table>\n                </div>\n            </CardContent>'
    )
    
    file_path.write_text(content, encoding="utf-8")
    print(f"✅ Fixed: {file_path}")

def main():
    print("=" * 60)
    print("🚀 MOBILE STABILITY FIX SCRIPT")
    print("=" * 60)
    
    try:
        fix_app_layout()
        fix_dashboard_page()
        fix_revenue_chart()
        fix_recent_loans()
        
        print("\n✅ ALL FIXES APPLIED SUCCESSFULLY!")
        print("\nNext steps:")
        print("1. Test in browser")
        print("2. Create git branch: fix/responsiveness-$(date +%s)")
        print("3. Commit and push")
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        raise

if __name__ == "__main__":
    main()
