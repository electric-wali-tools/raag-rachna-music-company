/* ==========================================================================
   RAAG RACHNA MUSIC COMPANY - INTERACTIVE JAVASCRIPT & AUDIO ENGINE
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    initHeroSlider();
    initAudioPlayer();
    updateEstimator();
});

// Hero Slider Functions
let currentHeroSlideIndex = 0;
let heroSlideTimer = null;

function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (!slides.length) return;

    startHeroSliderTimer();

    const sliderWrapper = document.getElementById('heroSlidesWrapper');
    if (sliderWrapper) {
        let touchStartX = 0;
        let touchEndX = 0;

        sliderWrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        sliderWrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            if (touchStartX - touchEndX > 40) {
                nextHeroSlide(); // Swipe left -> Next slide
            } else if (touchEndX - touchStartX > 40) {
                prevHeroSlide(); // Swipe right -> Prev slide
            }
        }, { passive: true });
    }
}

function startHeroSliderTimer() {
    clearInterval(heroSlideTimer);
    heroSlideTimer = setInterval(() => {
        nextHeroSlide();
    }, 3800); // Auto-slides every 3.8 seconds continuously
}

function showHeroSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('#heroSliderDots .dot');
    if (!slides.length) return;

    if (index >= slides.length) currentHeroSlideIndex = 0;
    else if (index < 0) currentHeroSlideIndex = slides.length - 1;
    else currentHeroSlideIndex = index;

    slides.forEach((slide, i) => {
        if (i === currentHeroSlideIndex) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });

    dots.forEach((dot, i) => {
        if (i === currentHeroSlideIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

function nextHeroSlide() {
    showHeroSlide(currentHeroSlideIndex + 1);
    startHeroSliderTimer();
}

function prevHeroSlide() {
    showHeroSlide(currentHeroSlideIndex - 1);
    startHeroSliderTimer();
}

function goToHeroSlide(index) {
    showHeroSlide(index);
    startHeroSliderTimer();
}

// Mobile Drawer Navigation
function toggleMobileMenu() {
    const drawer = document.getElementById('mobileDrawer');
    drawer.classList.toggle('active');
}

// Store Product Filtering
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (filterValue === 'all' || cardCategory === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

// Audio Player Sample Engine
const sampleTracks = [
    {
        title: "Dil Ki Dhadkan (Romantic Original)",
        artist: "Produced by Raag Rachna Sound Team • Lead Vocals by Rahul",
        genre: "Bollywood Pop",
        cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600&auto=format&fit=crop",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        duration: "2:45"
    },
    {
        title: "Neon Street Anthem (Trap Beat)",
        artist: "Beat by Raag Rachna Beat Lab • Vocals by KD",
        genre: "Hip-Hop Trap",
        cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600&auto=format&fit=crop",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        duration: "2:10"
    },
    {
        title: "Sufi Acoustic Vibes (Live Session)",
        artist: "Acoustic Band • Live Recorded at Studio A",
        genre: "Sufi Rock",
        cover: "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=600&auto=format&fit=crop",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        duration: "3:15"
    },
    {
        title: "Midnight Lo-Fi Chill Beats",
        artist: "Raag Rachna Chill Hop Division",
        genre: "Lo-Fi Instrumental",
        cover: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=600&auto=format&fit=crop",
        url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        duration: "2:30"
    }
];

let currentTrackIndex = 0;
let isAudioPlaying = false;
let audioObj = null;

function initAudioPlayer() {
    audioObj = document.getElementById('audioPlayer');
    if (!audioObj) return;

    audioObj.addEventListener('timeupdate', updateAudioProgress);
    audioObj.addEventListener('ended', nextTrack);
}

function selectTrack(index) {
    currentTrackIndex = index;
    const track = sampleTracks[index];

    document.getElementById('trackTitle').textContent = track.title;
    document.getElementById('trackArtist').textContent = track.artist;
    document.getElementById('trackGenre').textContent = track.genre;
    document.getElementById('trackCover').src = track.cover;
    document.getElementById('durationTime').textContent = track.duration;

    const items = document.querySelectorAll('.playlist-item');
    items.forEach((item, i) => {
        if (i === index) item.classList.add('active');
        else item.classList.remove('active');
    });

    audioObj.src = track.url;
    audioObj.play();
    isAudioPlaying = true;
    updatePlayBtnIcon();
}

function togglePlay() {
    if (!audioObj) return;

    if (isAudioPlaying) {
        audioObj.pause();
        isAudioPlaying = false;
    } else {
        audioObj.play();
        isAudioPlaying = true;
    }
    updatePlayBtnIcon();
}

function updatePlayBtnIcon() {
    const playBtn = document.getElementById('playBtn');
    const visualizer = document.querySelector('.waveform-visualizer');

    if (isAudioPlaying) {
        playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        if (visualizer) visualizer.classList.add('playing');
    } else {
        playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        if (visualizer) visualizer.classList.remove('playing');
    }
}

function prevTrack() {
    let prevIndex = currentTrackIndex - 1;
    if (prevIndex < 0) prevIndex = sampleTracks.length - 1;
    selectTrack(prevIndex);
}

function nextTrack() {
    let nextIndex = currentTrackIndex + 1;
    if (nextIndex >= sampleTracks.length) nextIndex = 0;
    selectTrack(nextIndex);
}

function updateAudioProgress() {
    if (!audioObj || !audioObj.duration) return;

    const cur = audioObj.currentTime;
    const dur = audioObj.duration;
    const pct = (cur / dur) * 100;

    const fill = document.getElementById('progressFill');
    if (fill) fill.style.width = `${pct}%`;

    const curSpan = document.getElementById('currentTime');
    if (curSpan) {
        const mins = Math.floor(cur / 60);
        const secs = Math.floor(cur % 60);
        curSpan.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
}

function seekAudio(e) {
    if (!audioObj || !audioObj.duration) return;
    const track = e.currentTarget;
    const clickX = e.offsetX;
    const width = track.clientWidth;
    const pct = clickX / width;
    audioObj.currentTime = pct * audioObj.duration;
}

// Dynamic Music Estimator
function updateEstimator() {
    const chkComposing = document.getElementById('chkComposing');
    const chkRecording = document.getElementById('chkRecording');
    const chkMixing = document.getElementById('chkMixing');
    const chkVideo = document.getElementById('chkVideo');
    const chkDistribution = document.getElementById('chkDistribution');

    let totalCost = 0;
    let count = 0;
    let maxDays = 3;

    if (chkComposing && chkComposing.checked) { totalCost += 8000; count++; maxDays += 3; }
    if (chkRecording && chkRecording.checked) { totalCost += 4000; count++; maxDays += 1; }
    if (chkMixing && chkMixing.checked) { totalCost += 5000; count++; maxDays += 2; }
    if (chkVideo && chkVideo.checked) { totalCost += 25000; count++; maxDays += 5; }
    if (chkDistribution && chkDistribution.checked) { totalCost += 3000; count++; maxDays += 2; }

    const countSpan = document.getElementById('selectedServicesCount');
    const daysSpan = document.getElementById('estimatedTime');
    const costSpan = document.getElementById('totalEstimateVal');

    if (countSpan) countSpan.textContent = `${count} Services`;
    if (daysSpan) daysSpan.textContent = `${maxDays - 2} to ${maxDays} Days`;
    if (costSpan) costSpan.textContent = `₹${totalCost.toLocaleString('en-IN')}`;
}

function claimEstimateOffer() {
    const cost = document.getElementById('totalEstimateVal').textContent;
    openBookingModal(`Custom Package (${cost})`);
}

// Product Buying Direct WhatsApp Handler
function buyProduct(productName, price) {
    const message = `Hello Raag Rachna Music Store!\n\nI want to buy the following music studio product:\n\n🛒 Product: ${productName}\n💰 Special Price: ₹${parseInt(price).toLocaleString('en-IN')}\n\nPlease confirm availability & order process.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919580613911?text=${encodedMessage}`;

    alert(`Redirecting your order inquiry for "${productName}" to Raag Rachna Music Store on WhatsApp...`);
    window.open(whatsappUrl, '_blank');
}

// Booking Modal Functions
function openBookingModal(serviceName = 'Song Composing & Beats') {
    const modal = document.getElementById('bookingModal');
    const modalServiceSpan = document.getElementById('modalServiceName');
    if (modalServiceSpan) modalServiceSpan.textContent = serviceName;

    // Sync selected service dropdown in contact form
    const selectDropdown = document.getElementById('selectedService');
    if (selectDropdown) {
        for (let i = 0; i < selectDropdown.options.length; i++) {
            if (selectDropdown.options[i].value.toLowerCase().includes(serviceName.toLowerCase()) || 
                serviceName.toLowerCase().includes(selectDropdown.options[i].value.toLowerCase())) {
                selectDropdown.selectedIndex = i;
                break;
            }
        }
    }

    if (modal) modal.classList.add('active');
}

function closeBookingModal() {
    const modal = document.getElementById('bookingModal');
    if (modal) modal.classList.remove('active');
}

window.addEventListener('click', (e) => {
    const modal = document.getElementById('bookingModal');
    if (e.target === modal) {
        closeBookingModal();
    }
});

// Form Submissions
function handleFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('userName').value;
    const phone = document.getElementById('userPhone').value;
    const service = document.getElementById('selectedService').value;
    const date = document.getElementById('preferredDate').value || 'As soon as possible';
    const city = document.getElementById('userCity').value || 'Mumbai / Online Booking';

    const message = `Hello Raag Rachna Music Company!\n\nI want to book a Session / Inquire about Music Services:\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n🎵 Service: ${service}\n📅 Preferred Date: ${date}\n📍 Location: ${city}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919580613911?text=${encodedMessage}`;

    alert(`Thank you ${name}! Redirecting your booking request to Raag Rachna Music Studio on WhatsApp...`);
    window.open(whatsappUrl, '_blank');
}

function handleModalSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('modalName').value;
    const phone = document.getElementById('modalPhone').value;
    const locality = document.getElementById('modalLocality').value || 'Studio Booking';
    const service = document.getElementById('modalServiceName').textContent;

    const message = `Hello Raag Rachna Music Company!\n\nI am interested in booking / inquiring for ${service}:\n\n👤 Name: ${name}\n📞 Phone: ${phone}\n📍 City / Preferred Date: ${locality}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/919580613911?text=${encodedMessage}`;

    closeBookingModal();
    window.open(whatsappUrl, '_blank');
}

// Active Nav Link Scroll Highlight
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
});

// YouTube Interactive Video Sound Engine
function toggleVideoSound(btn, iframeId) {
    const iframe = document.getElementById(iframeId);
    if (!iframe || !iframe.contentWindow) return;

    // Send YouTube IFrame API command to unmute & play video with audio
    iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'unMute',
        args: ''
    }), '*');

    iframe.contentWindow.postMessage(JSON.stringify({
        event: 'command',
        func: 'playVideo',
        args: ''
    }), '*');

    if (btn) {
        btn.classList.add('active');
        btn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Sound On';
    }
}

// Instant Click-to-Play Video Sound Engine (Zero Error Guarantee)
function playVideoDirect(wrapperId, videoId) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;

    // Replace cover with clean active youtube-nocookie player with audio enabled directly on site
    wrapper.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&controls=1" title="Raag Rachna Music Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"></iframe>`;
}
