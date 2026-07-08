var SHEET_ENDPOINT = "https://paymegpt.com/api/public/landing-pages/5382/sheet-data";

  function escapeHtml(s){ var d = document.createElement('div'); d.innerText = s || ''; return d.innerHTML; }

  function loadLeads(){
    document.getElementById('tableContainer').innerHTML = '<div class="loading">Loading leads...</div>';
    fetch(SHEET_ENDPOINT)
      .then(function(r){ return r.json(); })
      .then(function(json){
        var rows = json.rows || json.data || json || [];
        renderTable(rows);
      })
      .catch(function(){ document.getElementById('tableContainer').innerHTML = '<div class="empty">Unable to load leads right now. Try refreshing.</div>'; });
  }

  function renderTable(rows){
    document.getElementById('totalLeads').innerText = rows.length;
    var today = new Date().toLocaleDateString();
    var todayCount = rows.filter(function(r){ var d = r['Submitted At'] || ''; return d.indexOf(today) !== -1; }).length;
    document.getElementById('todayLeads').innerText = todayCount;
    if (!rows.length){
      document.getElementById('tableContainer').innerHTML = '<div class="empty">No leads yet. New submissions from the listing page will appear here.</div>';
      return;
    }
    var html = '<table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Message</th><th>Submitted</th><th>Status</th></tr></thead><tbody>';
    rows.slice().reverse().forEach(function(r){
      html += '<tr><td>' + escapeHtml(r['Full Name']) + '</td><td>' + escapeHtml(r['Email']) + '</td><td>' + escapeHtml(r['Phone']) + '</td><td>' + escapeHtml(r['Message']) + '</td><td>' + escapeHtml(r['Submitted At']) + '</td><td><span class="status-badge">' + escapeHtml(r['Status'] || 'New') + '</span></td></tr>';
    });
    html += '</tbody></table>';
    document.getElementById('tableContainer').innerHTML = html;
  }
  loadLeads();
  setInterval(loadLeads, 30000);