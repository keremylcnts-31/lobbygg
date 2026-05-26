$search = "avatarLink.appendChild(avatarImg);`r`n      navRight.appendChild(avatarLink);"
$replace = "avatarLink.appendChild(avatarImg);
      
      const userWrap = document.createElement('div');
      userWrap.className = 'nav-user';
      userWrap.appendChild(avatarLink);
      
      const pData = (typeof kuProfile !== 'undefined' ? kuProfile : (typeof userProfile !== 'undefined' ? userProfile : (typeof currentProfile !== 'undefined' ? currentProfile : (typeof profileUser !== 'undefined' ? profileUser : null))));
      if (pData) {
        const info = document.createElement('div');
        info.className = 'nav-user-info';
        const nickEl = document.createElement('div');
        nickEl.className = 'nav-nick';
        nickEl.textContent = pData.kullanici_adi || 'Kullanıcı';
        const roleEl = document.createElement('div');
        roleEl.className = 'nav-role';
        const roleNames = {yonetici:'👑 Yönetici', admin:'🔑 Admin', moderator:'🛡️ Moderatör', rehber:'📞 Rehber', kurucu:'🚀 Kurucu', premium:'⭐ Premium', abone:'💎 Abone', uye:'👤 Üye'};
        roleEl.textContent = roleNames[pData.abonelik] || '👤 Üye';
        info.appendChild(nickEl);
        info.appendChild(roleEl);
        userWrap.appendChild(info);
      }
      navRight.appendChild(userWrap);"

$files = Get-ChildItem -Path "C:\Users\Casper\.gemini\antigravity\scratch\lobbygg" -Filter "*.html"
foreach ($file in $files) {
    if ($file.Name -eq "admin.html") { continue }
    $content = Get-Content -Raw -Path $file.FullName
    if ($content -match "avatarLink.appendChild\(avatarImg\);\s+navRight.appendChild\(avatarLink\);") {
        $newContent = $content -replace "avatarLink.appendChild\(avatarImg\);\s*navRight.appendChild\(avatarLink\);", $replace
        Set-Content -Path $file.FullName -Value $newContent
        Write-Host "Updated $($file.Name)"
    }
}
