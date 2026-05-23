// db-helper.js — Supabase Database & LocalStorage Fallback Operations Wrapper

(function() {
  const DEFAULT_SETTINGS = {
    lcoin_50_price: 25,
    lcoin_120_price: 50,
    lcoin_250_price: 100,
    lcoin_600_price: 200,
    sub_abone_price: 29,
    sub_premium_price: 59,
    limit_uye: 3,
    limit_abone: 10,
    limit_premium: 9999,
    boost_cost_uye: 15,
    boost_cost_abone: 10,
    boost_cost_premium: 5
  };

  // Safe client resolution
  function getClient() {
    if (window.sb) return window.sb;
    if (window.db) return window.db;
    if (window.supabase) {
      const SUPABASE_URL = 'https://hmkeedyqmzblnmkhdste.supabase.co';
      const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhta2VlZHlxbXpibG5ta2hkc3RlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODE3MzYsImV4cCI6MjA5NDM1NzczNn0.5HUInmQs_LsXYovJgI7Ir9q8M9aPlQW6jM5C43aYmqA';
      window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
      return window.sb;
    }
    return null;
  }

  // ==========================================
  // SITE SETTINGS (site_ayarlari)
  // ==========================================
  async function getSiteSettings() {
    const sb = getClient();
    if (sb) {
      try {
        const { data, error } = await sb.from('site_ayarlari').select('*').maybeSingle();
        if (!error && data) {
          return data;
        }
      } catch (err) {
        console.warn("Supabase site_ayarlari table not available, using localStorage fallback.");
      }
    }
    // LocalStorage fallback
    const local = localStorage.getItem('lobby_site_ayarlari');
    if (local) {
      try { return JSON.parse(local); } catch(e) {}
    }
    localStorage.setItem('lobby_site_ayarlari', JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  }

  async function updateSiteSettings(settings) {
    const sb = getClient();
    let success = false;
    if (sb) {
      try {
        // Try getting single first to see if we should insert or update
        const { data } = await sb.from('site_ayarlari').select('id').maybeSingle();
        let res;
        if (data) {
          res = await sb.from('site_ayarlari').update(settings).eq('id', data.id);
        } else {
          res = await sb.from('site_ayarlari').insert([settings]);
        }
        if (!res.error) success = true;
      } catch (err) {
        console.warn("Supabase site_ayarlari update failed, writing to localStorage.");
      }
    }
    // Always sync with localStorage
    localStorage.setItem('lobby_site_ayarlari', JSON.stringify(settings));
    return true;
  }

  // ==========================================
  // PAYMENTS (odemeler)
  // ==========================================
  async function getPayments() {
    const sb = getClient();
    if (sb) {
      try {
        const { data, error } = await sb.from('odemeler').select('*').order('tarih', { ascending: false });
        if (!error && data) return data;
      } catch (err) {
        console.warn("Supabase odemeler table not available, using localStorage fallback.");
      }
    }
    // Fallback
    const local = localStorage.getItem('lobby_odemeler');
    return local ? JSON.parse(local) : [];
  }

  async function addPayment(payment) {
    const sb = getClient();
    const record = {
      ...payment,
      id: payment.id || 'pay_' + Math.random().toString(36).substr(2, 9),
      tarih: payment.tarih || new Date().toISOString()
    };

    if (sb) {
      try {
        const { error } = await sb.from('odemeler').insert([record]);
        if (!error) return record;
      } catch (err) {
        console.warn("Supabase odemeler insert failed, using localStorage fallback.");
      }
    }

    // Fallback
    const list = await getPayments();
    list.unshift(record);
    localStorage.setItem('lobby_odemeler', JSON.stringify(list));
    return record;
  }

  // ==========================================
  // SUPPORT TICKETS (destek_talepleri)
  // ==========================================
  async function getTickets() {
    const sb = getClient();
    if (sb) {
      try {
        const { data, error } = await sb.from('destek_talepleri').select('*').order('tarih', { ascending: false });
        if (!error && data) {
          // Parse stringified messages if stored as JSON/text in DB
          return data.map(t => {
            if (typeof t.mesajlar === 'string') {
              try { t.mesajlar = JSON.parse(t.mesajlar); } catch(e) { t.mesajlar = []; }
            }
            return t;
          });
        }
      } catch (err) {
        console.warn("Supabase destek_talepleri table not available, using localStorage fallback.");
      }
    }
    // Fallback
    const local = localStorage.getItem('lobby_destek_talepleri');
    return local ? JSON.parse(local) : [];
  }

  async function getTicketsByUser(userId) {
    const sb = getClient();
    if (sb) {
      try {
        const { data, error } = await sb.from('destek_talepleri')
          .select('*')
          .eq('kullanici_id', userId)
          .order('tarih', { ascending: false });
        if (!error && data) {
          return data.map(t => {
            if (typeof t.mesajlar === 'string') {
              try { t.mesajlar = JSON.parse(t.mesajlar); } catch(e) { t.mesajlar = []; }
            }
            return t;
          });
        }
      } catch (err) {
        console.warn("Supabase getTicketsByUser failed, using localStorage fallback.");
      }
    }
    const list = await getTickets();
    return list.filter(t => t.kullanici_id === userId);
  }

  async function getTicketById(ticketId) {
    const sb = getClient();
    if (sb) {
      try {
        const { data, error } = await sb.from('destek_talepleri').select('*').eq('id', ticketId).maybeSingle();
        if (!error && data) {
          if (typeof data.mesajlar === 'string') {
            try { data.mesajlar = JSON.parse(data.mesajlar); } catch(e) { data.mesajlar = []; }
          }
          return data;
        }
      } catch (err) {
        console.warn("Supabase getTicketById failed, using localStorage fallback.");
      }
    }
    const list = await getTickets();
    return list.find(t => t.id === ticketId) || null;
  }

  async function createTicket(ticket) {
    const sb = getClient();
    const record = {
      ...ticket,
      id: ticket.id || 'ticket_' + Math.random().toString(36).substr(2, 9),
      tarih: ticket.tarih || new Date().toISOString(),
      durum: ticket.durum || 'Acik',
      mesajlar: ticket.mesajlar || []
    };

    if (sb) {
      try {
        // Serialize mesajlar for insertion
        const dbRecord = {
          ...record,
          mesajlar: JSON.stringify(record.mesajlar)
        };
        const { error } = await sb.from('destek_talepleri').insert([dbRecord]);
        if (!error) return record;
      } catch (err) {
        console.warn("Supabase destek_talepleri insert failed, using localStorage fallback.");
      }
    }

    const list = await getTickets();
    list.unshift(record);
    localStorage.setItem('lobby_destek_talepleri', JSON.stringify(list));
    return record;
  }

  async function addTicketMessage(ticketId, message) {
    const sb = getClient();
    const ticket = await getTicketById(ticketId);
    if (!ticket) return null;

    ticket.mesajlar.push({
      ...message,
      tarih: message.tarih || new Date().toISOString()
    });

    // Update status to 'Cevaplandi' if sent by staff, 'Acik' if sent by user
    if (message.gonderen_rol && ['yonetici', 'admin', 'rehber'].includes(message.gonderen_rol)) {
      ticket.durum = 'Cevaplandi';
    } else {
      ticket.durum = 'Acik';
    }

    if (sb) {
      try {
        const { error } = await sb.from('destek_talepleri').update({
          mesajlar: JSON.stringify(ticket.mesajlar),
          durum: ticket.durum
        }).eq('id', ticketId);
        if (!error) return ticket;
      } catch (err) {
        console.warn("Supabase addTicketMessage failed, using localStorage fallback.");
      }
    }

    const list = await getTickets();
    const index = list.findIndex(t => t.id === ticketId);
    if (index !== -1) {
      list[index] = ticket;
      localStorage.setItem('lobby_destek_talepleri', JSON.stringify(list));
    }
    return ticket;
  }

  async function updateTicketStatus(ticketId, status) {
    const sb = getClient();
    if (sb) {
      try {
        const { error } = await sb.from('destek_talepleri').update({ durum: status }).eq('id', ticketId);
        if (!error) return true;
      } catch (err) {
        console.warn("Supabase updateTicketStatus failed, using localStorage fallback.");
      }
    }

    const list = await getTickets();
    const index = list.findIndex(t => t.id === ticketId);
    if (index !== -1) {
      list[index].durum = status;
      localStorage.setItem('lobby_destek_talepleri', JSON.stringify(list));
      return true;
    }
    return false;
  }

  // ==========================================
  // EXPOSE GLOBAL API
  // ==========================================
  window.dbHelper = {
    getSiteSettings,
    updateSiteSettings,
    getPayments,
    addPayment,
    getTickets,
    getTicketsByUser,
    getTicketById,
    createTicket,
    addTicketMessage,
    updateTicketStatus
  };
})();
