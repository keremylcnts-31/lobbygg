$searchDir = "C:\Users\Casper\.gemini\antigravity\scratch\lobbygg"
Get-ChildItem -Path $searchDir -Filter *.html -Recurse | ForEach-Object {
    $lines = Get-Content $_.FullName
    for ($i=0; $i -lt $lines.Count; $i++) {
        if ($lines[$i] -match "storage\.from") {
            Write-Output "$($_.Name):$($i+1): $($lines[$i].Trim())"
        }
    }
}
