
# fix_nav_all.ps1
# Updates nav links in all lobbygg HTML files:
#  - Adds Magaza and Destek links
#  - Adds activePage active class highlighting

$dir = "C:\Users\Casper\.gemini\antigravity\scratch\lobbygg"

# The old links block (same in all files)
$oldLinks = @"
  // Links
  const links = [
    { label: 'Ana Sayfa', href: 'lobbyx.html' },
    { label: '\.lanlar',   href: 'ilanlar.html' },
    { label: 'Klanlar',   href: 'klanlar.html' },
    { label: 'Ke.fet',    href: 'kesfet.html'  }
  ];
  const linksWrap = document.createElement\('div'\);
  linksWrap.className = 'nav-links';
  links.forEach\(l => \{
    const a = document.createElement\('a'\);
    a.href = l.href;
    a.className = 'nav-link';
"@

$files = Get-ChildItem -Path $dir -Filter "*.html" | Where-Object { $_.Name -ne "giris.html" }

$updatedCount = 0

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    
    # Check if already updated
    if ($content -match "Magaza.*key.*market") {
        Write-Host "SKIP (already updated): $($file.Name)"
        continue
    }
    
    # Check if it has the old pattern (Ana Sayfa link without key)
    if ($content -notmatch "label: 'Ana Sayfa', href: 'lobbyx\.html' \}") {
        Write-Host "SKIP (pattern not found): $($file.Name)"
        continue
    }
    
    # Old pattern to replace
    $oldPattern = "  // Links`r`n  const links = \[`r`n    \{ label: 'Ana Sayfa', href: 'lobbyx\.html' \},`r`n    \{ label: '\.lanlar',   href: 'ilanlar\.html' \},`r`n    \{ label: 'Klanlar',   href: 'klanlar\.html' \},`r`n    \{ label: 'Ke.fet',    href: 'kesfet\.html'  \}`r`n  \];`r`n  const linksWrap = document\.createElement\('div'\);`r`n  linksWrap\.className = 'nav-links';`r`n  links\.forEach\(l => \{`r`n    const a = document\.createElement\('a'\);`r`n    a\.href = l\.href;`r`n    a\.className = 'nav-link';"
    
    # Exact string to find (no regex)
    $oldText = "  // Links`r`n  const links = [`r`n    { label: 'Ana Sayfa', href: 'lobbyx.html' },`r`n    { label: 'İlanlar',   href: 'ilanlar.html' },`r`n    { label: 'Klanlar',   href: 'klanlar.html' },`r`n    { label: 'Keşfet',    href: 'kesfet.html'  }`r`n  ];`r`n  const linksWrap = document.createElement('div');`r`n  linksWrap.className = 'nav-links';`r`n  links.forEach(l => {`r`n    const a = document.createElement('a');`r`n    a.href = l.href;`r`n    a.className = 'nav-link';"
    
    $newText = "  // Active page detection`r`n  const activePage = window.location.pathname.split('/').pop().replace('.html', '') || 'lobbyx';`r`n`r`n  // Links`r`n  const links = [`r`n    { label: 'Ana Sayfa', href: 'lobbyx.html',   key: 'lobbyx'   },`r`n    { label: 'İlanlar',   href: 'ilanlar.html',  key: 'ilanlar'  },`r`n    { label: 'Klanlar',   href: 'klanlar.html',  key: 'klanlar'  },`r`n    { label: 'Keşfet',    href: 'kesfet.html',   key: 'kesfet'   },`r`n    { label: 'Mağaza',    href: 'market.html',   key: 'market'   },`r`n    { label: 'Destek',    href: 'destek.html',   key: 'destek'   }`r`n  ];`r`n  const linksWrap = document.createElement('div');`r`n  linksWrap.className = 'nav-links';`r`n  links.forEach(l => {`r`n    const a = document.createElement('a');`r`n    a.href = l.href;`r`n    a.className = 'nav-link' + (activePage === l.key ? ' active' : '');"
    
    if ($content.Contains($oldText)) {
        $newContent = $content.Replace($oldText, $newText)
        [System.IO.File]::WriteAllText($file.FullName, $newContent, [System.Text.Encoding]::UTF8)
        Write-Host "UPDATED: $($file.Name)"
        $updatedCount++
    } else {
        Write-Host "NO MATCH: $($file.Name) - checking manually..."
        # Try to find what the actual text looks like
        $idx = $content.IndexOf("label: 'Ana Sayfa'")
        if ($idx -ge 0) {
            Write-Host "  Found 'Ana Sayfa' at char $idx"
            Write-Host "  Context: $($content.Substring([Math]::Max(0,$idx-50), 200))"
        }
    }
}

Write-Host ""
Write-Host "Done! Updated $updatedCount files."
