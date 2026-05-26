$path = "C:\Users\Casper\.gemini\antigravity\scratch\lobbygg\klan.html"
$content = Get-Content -Raw -Encoding UTF8 $path

$content = $content.Replace("<title>Profil", "<title>Klan")
$content = $content.Replace("urlParams.get('id')", "urlParams.get('tag')")
$content = $content.Replace("const userId =", "const clanTag =")
$content = $content.Replace("userId ? userId : (currentUser ? currentUser.id : null)", "clanTag ? clanTag : (currentUser ? currentUser.klan_tag : null)")
$content = $content.Replace("loadProfile()", "loadClan()")
$content = $content.Replace("async function loadProfile()", "async function loadClan()")
$content = $content.Replace("profileUser", "clanData")
$content = $content.Replace("'kullanicilar'", "'klanlar'")
$content = $content.Replace(".eq('id', targetId)", ".eq('tag', targetId)")

Set-Content -Path $path -Value $content -Encoding UTF8
Write-Host "Done"
