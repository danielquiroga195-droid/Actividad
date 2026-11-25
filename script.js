document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================
    // 1. REPRODUCTOR INTERACTIVO (Pantalla 1)
    // ==========================================
    const playBtn = document.getElementById('play-btn');
    const nextSongBtn = document.getElementById('next-song-btn');
    const prevSongBtn = document.getElementById('prev-song-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const equalizer = document.getElementById('equalizer');
    const albumArt = document.getElementById('album-art');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const listenersNum = document.getElementById('listeners-num');

    const playlist = [
        { title: "Noches de Neon en Starfish Island", artist: "DJ El Chacal ft. La Reina del Perreo", tempo: 260 },
        { title: "Cocoteo en el Lamborghini", artist: "Yandelito & Los de Leonida", tempo: 230 },
        { title: "Salsa y Plomo en Little Havana", artist: "Orquesta La Furia 104.9", tempo: 210 },
        { title: "Perreo en el Helipuerto", artist: "Bad Coco", tempo: 275 }
    ];

    let currentTrack = 0;
    let isPlaying = false;
    let audioCtx = null;
    let beatInterval = null;
    let masterVolume = 0.5;

    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            masterVolume = parseFloat(e.target.value);
        });
    }

    function startRadioBeat() {
        stopRadioBeat();
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        let step = 0;
        const speed = playlist[currentTrack].tempo;

        beatInterval = setInterval(() => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.connect(gain);
            gain.connect(audioCtx.destination);

            if (step % 4 === 0) {
                osc.frequency.setValueAtTime(110, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.15);
                gain.gain.setValueAtTime(0.35 * masterVolume, audioCtx.currentTime);
            } else if (step % 4 === 2 || step % 4 === 3) {
                osc.frequency.setValueAtTime(220, audioCtx.currentTime);
                gain.gain.setValueAtTime(0.15 * masterVolume, audioCtx.currentTime);
            } else {
                gain.gain.setValueAtTime(0, audioCtx.currentTime);
            }

            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
            osc.start();
            osc.stop(audioCtx.currentTime + 0.18);
            step++;
        }, speed);
    }

    function stopRadioBeat() {
        if (beatInterval) clearInterval(beatInterval);
    }

    function updateTrackUI() {
        songTitle.textContent = playlist[currentTrack].title;
        songArtist.textContent = playlist[currentTrack].artist;
        if (isPlaying) startRadioBeat();
    }

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            if (isPlaying) {
                playBtn.textContent = "⏸ PAUSAR RADIO";
                equalizer.classList.add('playing');
                if (albumArt) albumArt.classList.add('spinning');
                startRadioBeat();
            } else {
                playBtn.textContent = "▶ ESCUCHAR EN VIVO";
                equalizer.classList.remove('playing');
                if (albumArt) albumArt.classList.remove('spinning');
                stopRadioBeat();
            }
        });
    }

    if (nextSongBtn) {
        nextSongBtn.addEventListener('click', () => {
            currentTrack = (currentTrack + 1) % playlist.length;
            updateTrackUI();
        });
    }

    if (prevSongBtn) {
        prevSongBtn.addEventListener('click', () => {
            currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
            updateTrackUI();
        });
    }

    // Simulación dinámica de oyentes conectados
    if (listenersNum) {
        setInterval(() => {
            const base = 14800;
            const variation = Math.floor(Math.random() * 120);
            listenersNum.textContent = (base + variation).toLocaleString();
        }, 4000);
    }

    // ==========================================
    // 2. FILTRO Y BUSCADOR DE PROGRAMACIÓN (Pantalla 2)
    // ==========================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const djCards = document.querySelectorAll('.dj-card');
    const djSearch = document.getElementById('dj-search');

    function filterSchedule() {
        const activeBtn = document.querySelector('.filter-btn.active');
        const category = activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
        const query = djSearch ? djSearch.value.toLowerCase().trim() : '';

        djCards.forEach(card => {
            const matchesCategory = category === 'all' || card.getAttribute('data-category') === category;
            const matchesText = card.textContent.toLowerCase().includes(query);
            card.style.display = (matchesCategory && matchesText) ? 'block' : 'none';
        });
    }

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                filterSchedule();
            });
        });
    }

    if (djSearch) {
        djSearch.addEventListener('input', filterSchedule);
    }

    // ==========================================
    // 3. PEDIDOS CON LOCALSTORAGE Y CARRITO VIP (Pantalla 3)
    // ==========================================
    const requestForm = document.getElementById('request-form');
    const requestsList = document.getElementById('requests-list');
    const clearRequestsBtn = document.getElementById('clear-requests-btn');

    if (requestForm && requestsList) {
        const savedRequests = JSON.parse(localStorage.getItem('cocoteo_requests')) || [];
        savedRequests.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${item.name}:</strong> Pidió <em>"${item.song}"</em> ${item.msg ? '- ' + item.msg : ''}`;
            requestsList.prepend(li);
        });

        requestForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('listener-name').value.trim();
            const song = document.getElementById('song-request').value.trim();
            const msg = document.getElementById('shoutout').value.trim();

            const newReq = { name, song, msg };
            savedRequests.push(newReq);
            localStorage.setItem('cocoteo_requests', JSON.stringify(savedRequests));

            const li = document.createElement('li');
            li.innerHTML = `<strong>${name}:</strong> Pidió <em>"${song}"</em> ${msg ? '- ' + msg : ''}`;
            requestsList.prepend(li);

            requestForm.reset();
        });

        if (clearRequestsBtn) {
            clearRequestsBtn.addEventListener('click', () => {
                localStorage.removeItem('cocoteo_requests');
                requestsList.innerHTML = '<li><strong>Lucía_VC:</strong> Pidió <em>"Titi Me Preguntó"</em> - ¡Saludos desde el motel!</li>';
            });
        }
    }

    // Carrito de Merch
    const buyBtns = document.querySelectorAll('.buy-btn');
    const cartToast = document.getElementById('cart-notification');
    const cartItemsList = document.getElementById('cart-items-list');
    const cartTotalEl = document.getElementById('cart-total');
    const cartCountEl = document.getElementById('cart-count');
    const checkoutBtn = document.getElementById('checkout-btn');

    let cart = [];

    function showToast(message) {
        if (!cartToast) return;
        cartToast.textContent = message;
        cartToast.classList.remove('hidden');
        setTimeout(() => cartToast.classList.add('hidden'), 3000);
    }

    function renderCart() {
        if (!cartItemsList) return;
        cartItemsList.innerHTML = '';
        let total = 0;

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<li class="empty-cart">Aún no has agregado mercancía.</li>';
        } else {
            cart.forEach((product) => {
                total += product.price;
                const li = document.createElement('li');
                li.innerHTML = `<span>${product.name}</span> <strong>$${product.price}</strong>`;
                cartItemsList.appendChild(li);
            });
        }

        cartTotalEl.textContent = total;
        cartCountEl.textContent = cart.length;
    }

    if (buyBtns.length > 0) {
        buyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const name = btn.getAttribute('data-item');
                const price = parseInt(btn.getAttribute('data-price'), 10);
                cart.push({ name, price });
                renderCart();
                showToast(`🔥 ¡"${name}" agregada a tu bolsa VIP!`);
            });
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showToast('⚠️ Tu bolsa VIP está vacía.');
                return;
            }
            showToast('✅ ¡Pedido confirmado! Entrega en punto seguro de Vice Beach.');
            cart = [];
            renderCart();
        });
    }
});