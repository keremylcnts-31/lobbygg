// =============================================
// ILAN DETAY INLINE VIEW  (Hero-Banner Layout)
// =============================================
async function showIlanDetayInline(ilanId) {
  const container = document.getElementById('ilan-detay-container');
  container.innerHTML = '';
  document.getElementById('ilanlar-grid').style.display = 'none';
  document.querySelector('.ilanlar-header').style.display = 'none';
  document.querySelector('.ilanlar-toolbar').style.display = 'none';
  container.style.display = 'block';
  container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;padding:80px 0;color:var(--text-3);font-size:14px;"><span style="font-size:28px;margin-right:10px;">&#x23F3;</span>Y\u00fckleniyor...</div>';
  window.scrollTo({ top: 0, behavior: 'instant' });

  const goBack = () => {
    container.style.display = 'none';
    container.innerHTML = '';
    document.getElementById('ilanlar-grid').style.display = 'grid';
    document.querySelector('.ilanlar-header').style.display = 'block';
    document.querySelector('.ilanlar-toolbar').style.display = 'flex';
    history.pushState({ ilanlar: true }, '', '?page=ilanlar');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  try {
    const { data: ilan, error } = await sb.from('ilanlar').select('*').eq('id', ilanId).single();
    if (error || !ilan) throw new Error('not found');

    let owner = {};
    if (ilan.kullanici_id) {
      const { data: od } = await sb.from('kullanicilar')
        .select('id,kullanici_adi,avatar_url,kategori,alt_kategori,abonelik,dogrulama_rozeti')
        .eq('id', ilan.kullanici_id).maybeSingle();
      owner = od || {};
    }

    container.innerHTML = '';

    const bannerSrc = ilan.banner_url || ilan.gorsel_url || ilan.resim_url;
    const catColor = ILAN_CAT_COLORS[ilan.kategori] || '#2a4a6b';
    const catGrad  = ILAN_CAT_GRADIENT[ilan.kategori] || 'linear-gradient(135deg,#0d1a2a,#1a2a4a)';
    const catIcon  = ILAN_CAT_ICONS[ilan.kategori] || '\uD83D\uDCCB';
    const priceObj = formatIlanPrice(ilan.fiyat);
    const mcSeed   = encodeURIComponent(owner.kullanici_adi || ilan.kullanici_nick || 'Steve');
    const avSrc    = owner.avatar_url || `https://mc-heads.net/avatar/${mcSeed}/128`;

    // ===== HERO BANNER (full-width, 230px) =====
    const hero = document.createElement('div');
    hero.style.cssText = 'position:relative;width:100%;height:230px;overflow:hidden;border:3px solid #000;border-radius:var(--radius);box-shadow:0 8px 32px rgba(0,0,0,0.6);margin-bottom:0;';

    if (bannerSrc) {
      const bImg = document.createElement('img');
      bImg.src = bannerSrc; bImg.alt = ilan.baslik;
      bImg.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block;';
      hero.appendChild(bImg);
    } else {
      const gDiv = document.createElement('div');
      gDiv.style.cssText = `width:100%;height:100%;background:${catGrad};display:flex;align-items:center;justify-content:center;font-size:80px;`;
      gDiv.textContent = catIcon;
      hero.appendChild(gDiv);
    }

    // Dark overlay
    const ov = document.createElement('div');
    ov.style.cssText = 'position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,0.02) 0%,rgba(0,0,0,0.12) 35%,rgba(0,0,0,0.74) 72%,rgba(0,0,0,0.95) 100%);';
    hero.appendChild(ov);

    // Back button (top-left)
    const bkBtn = document.createElement('button');
    bkBtn.className = 'btn mc-gray mc-sm';
    bkBtn.style.cssText = 'position:absolute;top:12px;left:12px;z-index:10;background:rgba(0,0,0,0.6)!important;backdrop-filter:blur(6px);border-color:#000!important;';
    bkBtn.textContent = '\u2190 \u0130lanlara D\u00f6n';
    bkBtn.addEventListener('click', goBack);
    hero.appendChild(bkBtn);

    // Badges (top-right)
    const topBdg = document.createElement('div');
    topBdg.style.cssText = 'position:absolute;top:12px;right:12px;display:flex;gap:6px;z-index:10;flex-wrap:wrap;justify-content:flex-end;';
    if (ilan.one_cikan) { const ob = document.createElement('span'); ob.className = 'badge b-gold'; ob.textContent = '\u2B50 \u00d6ne \u00c7\u0131kan'; topBdg.appendChild(ob); }
    const cb = document.createElement('span'); cb.className = 'badge';
    cb.style.cssText = `background:${catColor}cc;color:#fff;border-color:${catColor};`;
    cb.textContent = catIcon + ' ' + (ilan.kategori || ''); topBdg.appendChild(cb);
    hero.appendChild(topBdg);

    // Remaining pill
    const remPill = document.createElement('div');
    remPill.style.cssText = 'position:absolute;bottom:76px;left:16px;z-index:10;background:rgba(0,0,0,0.65);border:1.5px solid rgba(255,255,255,0.1);padding:3px 10px;border-radius:4px;font-size:10px;font-weight:800;color:#bbb;';
    remPill.textContent = formatIlanRemaining(ilan.created_at);
    hero.appendChild(remPill);

    // Title + owner row (banner bottom)
    const heroFoot = document.createElement('div');
    heroFoot.style.cssText = 'position:absolute;bottom:0;left:0;right:0;padding:14px 16px;z-index:10;';
    const heroTitle = document.createElement('div');
    heroTitle.style.cssText = 'font-size:22px;font-weight:900;color:#fff;text-shadow:2px 2px 0 #000,0 0 24px rgba(0,0,0,0.7);line-height:1.2;margin-bottom:9px;';
    heroTitle.textContent = ilan.baslik || '\u0130lan';
    heroFoot.appendChild(heroTitle);
    const heroOwRow = document.createElement('div');
    heroOwRow.style.cssText = 'display:flex;align-items:center;gap:8px;';
    const hoAv = document.createElement('img'); hoAv.src = avSrc; hoAv.onerror = () => { hoAv.src = 'https://mc-heads.net/avatar/Steve/32'; };
    hoAv.style.cssText = 'width:26px;height:26px;border-radius:4px;border:2px solid rgba(255,255,255,0.3);object-fit:cover;';
    const hoName = document.createElement('span');
    hoName.style.cssText = 'font-size:12px;font-weight:800;color:#fff;text-shadow:1px 1px 0 #000;';
    hoName.textContent = owner.kullanici_adi || ilan.kullanici_nick || 'Anonim';
    if (owner.dogrulama_rozeti) { const vb = document.createElement('img'); vb.src = 'https://i.imgur.com/VDpHaPy.png'; vb.style.cssText = 'width:12px;height:12px;vertical-align:middle;margin-left:3px;'; hoName.appendChild(vb); }
    const hoTime = document.createElement('span');
    hoTime.style.cssText = 'font-size:10px;color:rgba(255,255,255,0.55);';
    hoTime.textContent = '\u2022 ' + relativeTime(ilan.created_at);
    heroOwRow.appendChild(hoAv); heroOwRow.appendChild(hoName); heroOwRow.appendChild(hoTime);
    heroFoot.appendChild(heroOwRow);
    hero.appendChild(heroFoot);
    container.appendChild(hero);

    // ===== CONTENT BELOW (2-col grid) =====
    const cGrid = document.createElement('div');
    cGrid.style.cssText = 'display:grid;grid-template-columns:1fr 260px;gap:16px;margin-top:16px;align-items:start;';

    // LEFT
    const leftCol = document.createElement('div');
    leftCol.style.cssText = 'display:flex;flex-direction:column;gap:14px;';

    const descCard = document.createElement('div'); descCard.className = 'ilan-detay-inline-card';
    const dLbl = document.createElement('div'); dLbl.className = 'ilan-detay-section-label'; dLbl.textContent = '\uD83D\uDCC4 A\u00e7\u0131klama';
    const dTxt = document.createElement('div'); dTxt.className = 'ilan-detay-inline-desc'; dTxt.style.marginTop = '10px';
    dTxt.textContent = ilan.aciklama || 'A\u00e7\u0131klama bulunmuyor.';
    const tagsRow = document.createElement('div');
    tagsRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;margin-top:14px;padding-top:12px;border-top:1px solid rgba(255,255,255,0.07);';
    const tCat = document.createElement('span'); tCat.className = 'badge';
    tCat.style.cssText = `background:${catColor}22;color:${catColor};border:1.5px solid ${catColor}55;`;
    tCat.textContent = catIcon + ' ' + (ilan.kategori || ''); tagsRow.appendChild(tCat);
    if (ilan.alt_kategori) { const aB = document.createElement('span'); aB.className = 'badge b-diger'; aB.textContent = ilan.alt_kategori; tagsRow.appendChild(aB); }
    const tTime = document.createElement('span'); tTime.style.cssText = 'font-size:11px;color:var(--text-dim);display:flex;align-items:center;';
    tTime.textContent = '\uD83D\uDD50 ' + relativeTime(ilan.created_at); tagsRow.appendChild(tTime);
    descCard.appendChild(dLbl); descCard.appendChild(dTxt); descCard.appendChild(tagsRow);
    leftCol.appendChild(descCard);

    const owCard = document.createElement('div'); owCard.className = 'ilan-detay-inline-card';
    const owLbl = document.createElement('div'); owLbl.className = 'ilan-detay-section-label'; owLbl.textContent = '\uD83D\uDC64 \u0130lan Sahibi';
    const owLink = document.createElement('a'); owLink.href = `profil.html?id=${ilan.kullanici_id}`; owLink.className = 'ilan-detay-owner-link'; owLink.style.marginTop = '8px';
    const owAv = document.createElement('img'); owAv.src = avSrc; owAv.onerror = () => { owAv.src = 'https://mc-heads.net/avatar/Steve/96'; }; owAv.alt = 'Avatar';
    const owInf = document.createElement('div');
    const owNm = document.createElement('div'); owNm.className = 'ilan-detay-owner-name'; owNm.textContent = owner.kullanici_adi || ilan.kullanici_nick || 'Anonim';
    if (owner.dogrulama_rozeti) { const vb = document.createElement('img'); vb.src = 'https://i.imgur.com/VDpHaPy.png'; vb.style.cssText = 'width:14px;height:14px;vertical-align:middle;margin-left:4px;'; owNm.appendChild(vb); }
    const owSb = document.createElement('div'); owSb.className = 'ilan-detay-owner-sub';
    owSb.textContent = owner.kategori ? `${owner.kategori}${owner.alt_kategori ? ' \u2022 '+owner.alt_kategori : ''}` : 'LOBBY.GG \u00dcyesi';
    owInf.appendChild(owNm); owInf.appendChild(owSb);
    owLink.appendChild(owAv); owLink.appendChild(owInf);
    owCard.appendChild(owLbl); owCard.appendChild(owLink);
    leftCol.appendChild(owCard);

    // RIGHT
    const rightCol = document.createElement('div');
    rightCol.style.cssText = 'display:flex;flex-direction:column;gap:14px;position:sticky;top:80px;';

    const pCard = document.createElement('div'); pCard.className = 'ilan-detay-inline-card';
    const pLbl = document.createElement('div'); pLbl.className = 'ilan-detay-section-label'; pLbl.textContent = '\uD83D\uDCB0 Fiyat';
    const pBig = document.createElement('div'); pBig.className = 'ilan-detay-price-big ' + priceObj.cls; pBig.style.cssText += 'font-size:32px;margin:8px 0 2px;'; pBig.textContent = priceObj.text;
    const pSub = document.createElement('div'); pSub.className = 'ilan-detay-price-sub'; pSub.textContent = 'M\u00fczakere edilebilir';
    const pDiv2 = document.createElement('div'); pDiv2.style.cssText = 'height:1px;background:rgba(255,255,255,0.07);margin:10px 0;';
    const ctDiv = document.createElement('div'); ctDiv.style.cssText = 'display:flex;flex-direction:column;gap:8px;';

    if (ilan.discord) {
      const db = document.createElement('button'); db.className = 'btn mc-discord'; db.style.cssText = 'width:100%;justify-content:center;font-size:12px;gap:6px;';
      db.innerHTML = `<svg width="14" height="14" viewBox="0 0 127.14 96.36" fill="currentColor"><path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.5-5c1-.73,2-1.5,2.92-2.3a75.46,75.46,0,0,0,75.12,0c.91.8,1.91,1.57,2.92,2.3a68.43,68.43,0,0,1-10.5,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31-18.83C129.87,50.7,123.82,27.82,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.83,46,53.83,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.07,46,96.07,53,91,65.69,84.69,65.69Z"/></svg> Discord ile \u0130leti\u015fim`;
      db.addEventListener('click', () => navigator.clipboard.writeText(ilan.discord).then(() => showToast('Discord kopyaland\u0131! \uD83D\uDCAC', 'success')));
      ctDiv.appendChild(db);
    }
    if (ilan.email) {
      const eb = document.createElement('a'); eb.href = `mailto:${ilan.email}`; eb.className = 'btn mc-blue';
      eb.style.cssText = 'width:100%;justify-content:center;text-decoration:none;font-size:12px;'; eb.textContent = '\u2709\uFE0F E-posta G\u00f6nder';
      ctDiv.appendChild(eb);
    }
    if (!ilan.discord && !ilan.email) {
      const nc = document.createElement('div'); nc.style.cssText = 'font-size:11px;color:var(--text-dim);text-align:center;padding:8px 0;'; nc.textContent = '\u0130leti\u015fim bilgisi payla\u015f\u0131lmam\u0131\u015f.'; ctDiv.appendChild(nc);
    }
    const shrBtn = document.createElement('button'); shrBtn.className = 'btn mc-gray'; shrBtn.style.cssText = 'width:100%;justify-content:center;margin-top:8px;font-size:11px;'; shrBtn.textContent = '\uD83D\uDD17 \u0130lan\u0131 Payla\u015f';
    shrBtn.addEventListener('click', () => navigator.clipboard.writeText(location.origin + location.pathname + '?ilan=' + ilan.id).then(() => showToast('Link kopyaland\u0131! \uD83D\uDD17', 'success')));
    pCard.appendChild(pLbl); pCard.appendChild(pBig); pCard.appendChild(pSub); pCard.appendChild(pDiv2); pCard.appendChild(ctDiv); pCard.appendChild(shrBtn);
    rightCol.appendChild(pCard);

    // Similar
    try {
      const { data: sims } = await sb.from('ilanlar')
        .select('id,baslik,fiyat,kategori,banner_url,gorsel_url,resim_url')
        .eq('kategori', ilan.kategori).eq('durum', 'onaylandi').neq('id', ilan.id).limit(3);
      if (sims && sims.length > 0) {
        const sCard = document.createElement('div'); sCard.className = 'ilan-detay-inline-card';
        const sLbl2 = document.createElement('div'); sLbl2.className = 'ilan-detay-section-label'; sLbl2.textContent = '\uD83D\uDCCC Benzer \u0130lanlar';
        const sList = document.createElement('div'); sList.style.cssText = 'display:flex;flex-direction:column;gap:8px;margin-top:8px;';
        sims.forEach(s => {
          const si = document.createElement('div');
          si.style.cssText = 'display:flex;gap:10px;align-items:center;padding:10px;background:var(--bg-card2);border:2px solid #000;border-radius:var(--radius);cursor:pointer;transition:transform 0.12s,box-shadow 0.12s;';
          si.onmouseenter = () => { si.style.transform = 'translate(-2px,-2px)'; si.style.boxShadow = '2px 2px 0 #000'; };
          si.onmouseleave = () => { si.style.transform = ''; si.style.boxShadow = ''; };
          const sb2 = s.banner_url || s.gorsel_url || s.resim_url;
          const thumb = document.createElement('div');
          thumb.style.cssText = `width:40px;height:40px;border-radius:4px;border:2px solid #000;flex-shrink:0;overflow:hidden;background:${ILAN_CAT_GRADIENT[s.kategori]||'#111'};display:flex;align-items:center;justify-content:center;font-size:16px;`;
          if (sb2) { const ti = document.createElement('img'); ti.src = sb2; ti.style.cssText = 'width:100%;height:100%;object-fit:cover;'; thumb.appendChild(ti); }
          else { thumb.textContent = ILAN_CAT_ICONS[s.kategori] || '\uD83D\uDCCB'; }
          const sInf = document.createElement('div');
          const sT = document.createElement('div'); sT.style.cssText = 'font-size:11px;font-weight:800;color:var(--text-1);line-height:1.3;margin-bottom:3px;'; sT.textContent = s.baslik;
          const sP = formatIlanPrice(s.fiyat); const sPE = document.createElement('div'); sPE.className = 'ilan-card-price ' + sP.cls; sPE.style.fontSize = '10px'; sPE.textContent = sP.text;
          sInf.appendChild(sT); sInf.appendChild(sPE);
          si.appendChild(thumb); si.appendChild(sInf);
          si.addEventListener('click', () => showIlanDetayInline(s.id));
          sList.appendChild(si);
        });
        sCard.appendChild(sLbl2); sCard.appendChild(sList); rightCol.appendChild(sCard);
      }
    } catch(e2) {}

    cGrid.appendChild(leftCol); cGrid.appendChild(rightCol);
    container.appendChild(cGrid);
    history.pushState({ ilanDetay: ilanId }, '', '?ilan=' + ilanId);
    window.scrollTo({ top: 0, behavior: 'instant' });

  } catch(e) {
    console.error(e);
    container.innerHTML = `<div class="ilan-detay-inline-card" style="text-align:center;padding:48px;"><div style="font-size:48px;margin-bottom:16px;">\uD83D\uDE15</div><div style="font-size:16px;font-weight:900;color:var(--text-1);margin-bottom:16px;">\u0130lan bulunamad\u0131</div><button class="btn mc-gray" onclick="document.getElementById('ilan-detay-container').style.display='none';document.getElementById('ilanlar-grid').style.display='grid';document.querySelector('.ilanlar-header').style.display='block';document.querySelector('.ilanlar-toolbar').style.display='flex';">\u2190 D\u00f6n</button></div>`;
  }
}
