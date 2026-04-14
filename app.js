// Read guest name from URL ?gjest=
const params  = new URLSearchParams(window.location.search);
const gjest   = params.get('gjest');

if (gjest) {
  const name = decodeURIComponent(gjest.replace(/\+/g, ' '));
  document.getElementById('guestName').textContent  = name;
  document.getElementById('nameInput').value         = name;
  document.getElementById('dearLabel').style.display = 'block';
} else {
  document.getElementById('guestName').style.display = 'none';
  document.getElementById('dearLabel').style.display = 'none';
}
if (gjest) {
  fetch(SUPABASE_URL + '/rest/v1/visits', {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_ANON,
      'Authorization': 'Bearer ' + SUPABASE_ANON,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ url_param: gjest })
  });
}
let attending = null;

function showForm(isAttending) {
  attending = isAttending;
  const row  = document.getElementById('btnRow');
  row.style.opacity       = '0.4';
  row.style.pointerEvents = 'none';
  const form = document.getElementById('rsvpForm');
  form.classList.add('on');
  form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

async function submitRsvp() {
  const name = document.getElementById('nameInput').value.trim() || (gjest || 'Gjest');
  const msg  = document.getElementById('msgInput').value.trim();

  // Show loading state
  document.getElementById('rsvpForm').classList.remove('on');
  document.getElementById('btnRow').style.display = 'none';
  const conf = document.getElementById('conf');
  document.getElementById('confIco').textContent = '⏳';
  document.getElementById('confTxt').textContent  = 'Sender svar...';
  conf.classList.add('on');

  // Save to Supabase
  try {
    const res = await fetch(SUPABASE_URL + '/rest/v1/rsvps', {
      method:  'POST',
      headers: {
        'apikey':        SUPABASE_ANON,
        'Authorization': 'Bearer ' + SUPABASE_ANON,
        'Content-Type':  'application/json',
        'Prefer':        'return=minimal'
      },
      body: JSON.stringify({
        guest_name: name,
        url_param:  gjest || null,
        attending:  attending,
        message:    msg || null
      })
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
  } catch (e) {
    console.error('Supabase feil:', e);
  }

  // Show confirmation
  document.getElementById('confIco').textContent = attending ? '🎀' : '🌷';
  document.getElementById('confTxt').textContent  = attending
    ? 'Tusen takk, ' + name + '! Vi gleder oss til å feire sammen med deg.'
    : 'Takk for at du ga oss beskjed, ' + name + '. Vi savner deg!';
}
