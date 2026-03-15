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

const SUPABASE_URL = 'https://uplgiqvxqjlyhouyekox.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwbGdpcXZ4cWpseWhvdXlla294Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyODEzNTQsImV4cCI6MjA4ODg1NzM1NH0.IINgeJiWnON0Yy-guCZwAcvQUNjyZJkEzg04D4mG2-o';
const SCRIPT_URL = `${SUPABASE_URL}/functions/v1/submit-rsvp`;

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

  const email = form.email?.value.trim() || '';
  const attending = document.querySelector('input[name="attending"]:checked')?.value || 'yes';
  const dietaryRestrictions = form.dietary?.value.trim() || '';
  const message = form.message?.value.trim() || '';

  const eventCheckboxes = document.querySelectorAll('input[name="event_option"]:checked');
  const events = Array.from(eventCheckboxes).map(cb => cb.value);

  try {
    const response = await fetch(SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        attending,
        guests,
        dietaryRestrictions,
        message,
        events
      })
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
  }
});

/* ============================================================
   Banner Video Interaction
   ============================================================ */
const bannerVideo = document.getElementById('bannerVideo');
const unmuteHint  = document.getElementById('unmuteHint');
const muteBtn     = document.getElementById('muteBtn');
const muteIcon    = document.getElementById('muteIcon');
const muteLbl     = document.getElementById('muteLbl');
const enterOverlay = document.getElementById('enterOverlay');

function updateMuteBtn() {
  if (bannerVideo.muted) {
    muteIcon.className = 'fas fa-volume-mute';
    muteLbl.textContent = 'Unmute';
  } else {
    muteIcon.className = 'fas fa-volume-high';
    muteLbl.textContent = 'Mute';
  }
}

if (enterOverlay) {
  enterOverlay.addEventListener('click', () => {
    // Add seal press animation
    const sealBtn = document.querySelector('.enter-btn');
    if (sealBtn) {
      sealBtn.style.transform = 'scale(0.85)';
      setTimeout(() => {
        sealBtn.style.transform = 'scale(1)';
      }, 150);
    }

    // Elegant fade out with scale effect
    enterOverlay.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    enterOverlay.style.opacity = '0';
    enterOverlay.style.transform = 'scale(1.1)';

    setTimeout(() => {
      enterOverlay.style.display = 'none';

      // Animate page content in
      const pageWrapper = document.querySelector('.page-wrapper');
      if (pageWrapper) {
        pageWrapper.style.opacity = '0';
        pageWrapper.style.transform = 'translateY(30px)';
        setTimeout(() => {
          pageWrapper.style.transition = 'opacity 1s ease, transform 1s ease';
          pageWrapper.style.opacity = '1';
          pageWrapper.style.transform = 'translateY(0)';
        }, 100);
      }
    }, 800);

    // Play video WITH sound (user gesture just happened)
    if (bannerVideo) {
      bannerVideo.muted = false;
      bannerVideo.play().catch(e => {
        console.warn('Play failed:', e);
        bannerVideo.muted = true; // fallback
      });
      updateMuteBtn();
    }
  });
}

if (bannerVideo && muteBtn) {
  // Click video → toggle pause/play
  bannerVideo.addEventListener('click', () => {
    if (bannerVideo.paused) {
      bannerVideo.play();
    } else {
      bannerVideo.pause();
    }
  });

  // Mute button toggles mute
  muteBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // don't pause video
    bannerVideo.muted = !bannerVideo.muted;
    updateMuteBtn();
  });
}
