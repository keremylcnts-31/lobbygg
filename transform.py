import re

path = r'C:\Users\Casper\.gemini\antigravity\scratch\lobbygg\klan.html'
with open(path, 'r', encoding='utf-8') as f:
    html = f.read()

# Change title
html = html.replace('<title>Profil', '<title>Klan')

# We need to change the data fetching from 'kullanicilar' to 'klanlar'
# The URL params might be ?tag=XXX instead of ?id=XXX
html = html.replace("urlParams.get('id')", "urlParams.get('tag')")
html = html.replace("const userId =", "const clanTag =")
html = html.replace("userId ? userId : (currentUser ? currentUser.id : null)", "clanTag ? clanTag : (currentUser ? currentUser.klan_tag : null)")

# Rewrite loadProfile function name to loadClan
html = html.replace("loadProfile()", "loadClan()")
html = html.replace("async function loadProfile()", "async function loadClan()")
html = html.replace("profileUser", "clanData")
html = html.replace("kullanicilar", "klanlar")
html = html.replace(".eq('id', targetId)", ".eq('tag', targetId)")

with open(path, 'w', encoding='utf-8') as f:
    f.write(html)
print("Done modifying klan.html")
