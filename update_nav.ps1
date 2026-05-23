$newNav = [System.IO.File]::ReadAllText("C:\Users\Casper\.gemini\antigravity\scratch\lobbygg\new_nav.txt")

$files = Get-ChildItem "C:\Users\Casper\.gemini\antigravity\scratch\lobbygg\*.html"

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    if ($content -match "function buildNavMenu") {
        Write-Host "Updating $($file.Name)..."
        $regex = [regex]'(?s)function buildNavMenu\(kullanici\) \{.*?updateBadgeCounts\(\);\s*\}'
        $newContent = $regex.Replace($content, $newNav)
        [System.IO.File]::WriteAllText($file.FullName, $newContent)
    }
}
Write-Host "All nav menus updated!"
