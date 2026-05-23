$searchDir = "C:\Users\Casper\.gemini\antigravity\scratch\lobbygg"

# Search 1: desteklened_sunucu references
$results1 = @()
Get-ChildItem -Path $searchDir -Filter *.html -Recurse | ForEach-Object {
    $file = $_.FullName
    $lines = Get-Content $file
    for ($i=0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -like "*desteklened_sunucu*") {
            $results1 += "$($_.Name):$($i + 1): $($lines[$i].Trim())"
        }
    }
}

# Search 2: admin.html backtick template literals
$results2 = @()
$adminFile = Join-Path $searchDir "admin.html"
if (Test-Path $adminFile) {
    $lines = Get-Content $adminFile
    for ($i=0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match "``") {
            $results2 += "admin.html:$($i + 1): $($lines[$i].Trim())"
        }
    }
}

$output = @(
    "=== DESTEKLENED_SUNUCU SEARCH ==="
    $results1
    ""
    "=== ADMIN.HTML BACKTICKS ==="
    $results2
)

$output | Set-Content (Join-Path $searchDir "search_output.txt") -Encoding utf8
