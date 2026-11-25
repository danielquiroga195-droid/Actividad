document.addEventListener('DOMContentLoaded', () => {
    
  
    const playBtn = document.getElementById('play-btn');
    const nextSongBtn = document.getElementById('next-song-btn');
    const equalizer = document.getElementById('equalizer');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');

    const playlist = [
        { title: "Noches de Neon en Starfish Island", artist: "DJ El Chacal ft. La Reina del Perreo" },
        { title: "Cocoteo en el Lamborghini", artist: "Yandelito & Los de Leonida" },
        { title: "Salsa y Plomo en Little Havana", artist: "Orquesta La Furia 104.9" },
        { title: "Perreo en el Helipuerto", artist: "Bad Coco" }
    ];

    let currentTrack = 0;
    let isPlaying = false;
    let audioCtx = null;
    let beatInterval = null;

    
    function startRadioBeat() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        let step = 0;
        beatInterval = setInterval(() => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            // Patrón rítmico tipo dembow
            if (step % 4 === 0) {
                osc.frequency.setValueAtTime(110, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
            } else if (step % 4 === 2 || step % 4 === 3) {
                osc.frequency.setValueAtTime(220, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
            } else {
                gain.gain.setValueAtTime(0, audioCtx.currentTime);
            }

            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.18);
            step++;
        }, 260);
    }

    function stopRadioBeat() {
        clearInterval(beatInterval);
    }

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            if (isPlaying) {
                playBtn.textContent = "⏸ PAUSAR RADIO";
                equalizer.classList.add('playing');
                startRadioBeat();
            } else {
                playBtn.textContent = "▶ ESCUCHAR EN VIVO";
                equalizer.classList.remove('playing');
                stopRadioBeat();
            }
        });
    }

    if (nextSongBtn) {
        nextSongBtn.addEventListener('click', () => {
            currentTrack = (currentTrack + 1) % playlist.length;
            songTitle.textContent = playlist[currentTrack].title;
            songArtist.textContent = playlist[currentTrack].artist;
        });
    }

    
    const filterBtns = document.querySelectorAll('.filter-btn');
    const djCards = document.querySelectorAll('.dj-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Quitar clase active de todos
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                djCards.forEach(card => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    
    const requestForm = document.getElementById('request-form');
    const requestsList = document.getElementById('requests-list');

    if (requestForm) {
        requestForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('listener-name').value.trim();
            const song = document.getElementById('song-request').value.trim();
            const msg = document.getElementById('shoutout').value.trim();

            const li = document.createElement('li');
            li.innerHTML = `<strong>${name}:</strong> Pidió <em>"${song}"</em> ${msg ? '- ' + msg : ''}`;
            requestsList.prepend(li);

            requestForm.reset();
        });
    }

    const buyBtns = document.querySelectorAll('.buy-btn');
    const cartToast = document.getElementById('cart-notification');

    if (buyBtns.length > 0) {
        buyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const item = btn.getAttribute('data-item');
                cartToast.textContent = `🔥 ¡"${item}" agregada a tu bolsa VIP de Vice City!`;
                cartToast.classList.remove('hidden');

                setTimeout(() => {
                    cartToast.classList.add('hidden');
                }, 3000);
            });
        });
    }
});