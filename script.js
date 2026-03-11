/* ============================================================
   Particle System
   ============================================================ */
(function spawnParticles() {
  const container = document.getElementById('particles');
  const colors = ['#e0e0e0', '#c0c0c0', '#ffffff', '#f8f8f8', '#a8a8a8'];
  const count = 35;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'particle star'; // Add star class
    const size = Math.random() * 8 + 6; // slightly larger for stars
    el.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}vw;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration: ${Math.random() * 14 + 10}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: 0;
    `;
    container.appendChild(el);
  }
})();

/* ============================================================
   RSVP Form Logic
   ============================================================ */
const form         = document.getElementById('weddingForm');
const formCont     = document.getElementById('form-container');
const loadingState = document.getElementById('loading-state');
const successState = document.getElementById('success-state');

// Local Custom API endpoint
const SCRIPT_URL = 'http://localhost:3000/api/rsvp';

function showPanel(panel) {
  [formCont, loadingState, successState].forEach(p => p.style.display = 'none');
  panel.style.display = 'flex';
}

/* Inject shake keyframe */
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%,100%{ transform:translateX(0) }
    20%    { transform:translateX(-8px) }
    40%    { transform:translateX(8px) }
    60%    { transform:translateX(-6px) }
    80%    { transform:translateX(6px) }
  }
`;
document.head.appendChild(style);

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name   = form.name.value.trim();
  const phone  = form.phone.value.trim();
  const guests = form.guests.value.trim();

  // Shake empty required fields
  let hasError = false;
  [{ el: form.name, val: name }, { el: form.phone, val: phone }, { el: form.guests, val: guests }]
    .forEach(({ el, val }) => {
      if (!val) {
        el.style.animation = 'shake 0.4s ease';
        setTimeout(() => el.style.animation = '', 500);
        hasError = true;
      }
    });
  if (hasError) return;

  showPanel(loadingState);

  const events = Array.from(
    document.querySelectorAll('input[name="event_option"]:checked')
  ).map(cb => cb.value).join(', ');

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, phone, guests, events })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error details:', errorText);
      throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
    }

    showPanel(successState);
    document.getElementById('rsvp-form').scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    console.error('Submission error:', err);
    alert('Something went wrong submitting your RSVP. Check browser console for details: ' + err.message);
    showPanel(formCont);
  }
});

/* ============================================================
   Banner Video Interaction
   ============================================================ */
const bannerVideo = document.getElementById('bannerVideo');
if (bannerVideo) {
  // Allow toggling play/pause via click
  bannerVideo.addEventListener('click', () => {
    if (bannerVideo.paused) {
      bannerVideo.play();
    } else {
      bannerVideo.pause();
    }
  });

  // Force autoplay immediately on load (try unmuted first, fallback to muted)
  const attemptAutoplay = async () => {
    try {
      bannerVideo.muted = false; // Try loudly first
      await bannerVideo.play();
    } catch (error) {
      console.warn('Unmuted autoplay blocked. Falling back to muted autoplay.', error);
      bannerVideo.muted = true; // Browsers allow muted autoplay
      await bannerVideo.play().catch(e => console.error("Total autoplay failure", e));
    }
  };

  attemptAutoplay();
}
