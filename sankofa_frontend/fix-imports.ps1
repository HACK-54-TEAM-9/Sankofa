# Fix all versioned imports in UI components

$uiPath = "c:\Users\revic\OneDrive\Desktop\sankofa_v2\components\ui"

# Get all .tsx files in the ui folder
Get-ChildItem -Path $uiPath -Filter "*.tsx" | ForEach-Object {
    $filePath = $_.FullName
    $content = Get-Content -Path $filePath -Raw
    
    # Remove version numbers from all package imports
    $content = $content -replace '@radix-ui/react-([a-z-]+)@[\d.]+', '@radix-ui/react-$1'
    $content = $content -replace 'class-variance-authority@[\d.]+', 'class-variance-authority'
    $content = $content -replace 'lucide-react@[\d.]+', 'lucide-react'
    $content = $content -replace 'vaul@[\d.]+', 'vaul'
    $content = $content -replace 'cmdk@[\d.]+', 'cmdk'
    $content = $content -replace 'embla-carousel-react@[\d.]+', 'embla-carousel-react'
    $content = $content -replace 'recharts@[\d.]+', 'recharts'
    $content = $content -replace 'react-day-picker@[\d.]+', 'react-day-picker'
    $content = $content -replace 'react-hook-form@[\d.]+', 'react-hook-form'
    $content = $content -replace 'react-resizable-panels@[\d.]+', 'react-resizable-panels'
    $content = $content -replace 'input-otp@[\d.]+', 'input-otp'
    
    # Write back the fixed content
    Set-Content -Path $filePath -Value $content -NoNewline
    Write-Host "Fixed: $($_.Name)"
}

Write-Host "`nAll UI component imports fixed!"
