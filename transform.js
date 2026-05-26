const fs = require('fs');
const path = 'C:\\Users\\Casper\\.gemini\\antigravity\\scratch\\lobbygg\\klan.html';

let html = fs.readFileSync(path, 'utf8');

// Replacements
html = html.replace(/<title>Profil/g, '<title>Klan');
html = html.replace(/urlParams\.get\('id'\)/g, "urlParams.get('tag')");
html = html.replace(/const userId =/g, "const clanTag =");
html = html.replace(/userId \? userId : \(currentUser \? currentUser\.id : null\)/g, "clanTag ? clanTag : (currentUser ? currentUser.klan_tag : null)");
html = html.replace(/loadProfile\(\)/g, "loadClan()");
html = html.replace(/async function loadProfile\(\)/g, "async function loadClan()");
html = html.replace(/profileUser/g, "clanData");
html = html.replace(/'kullanicilar'/g, "'klanlar'");
html = html.replace(/\.eq\('id', targetId\)/g, ".eq('tag', targetId)");

// Remove "Kapak Fotoğrafı Yükle"
html = html.replace(/<button class="btn mc-gray mc-sm" id="btn-banner-upload">.*<\/button>/g, "");

// Write back
fs.writeFileSync(path, html, 'utf8');
console.log("Done");
