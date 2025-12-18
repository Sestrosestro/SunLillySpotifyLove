// Elementos do DOM
const carouselTrack = document.getElementById('carousel-track');
const heartsContainer = document.getElementById('hearts-container');
const lightSnake = document.getElementById('light-snake');
const audioPlayer = document.getElementById('audio-player');
const playBtn = document.getElementById('play-btn');
const playIcon = document.getElementById('play-icon');
const progressBar = document.getElementById('progress-bar');
const progress = document.getElementById('progress');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');
const volumeLevel = document.getElementById('volume-level');
const volumeIcon = document.getElementById('volume-icon');

// Estado do player
let isPlaying = false;
let currentImageIndex = 0;
let carouselInterval;
let snakeSegments = [];

// Lista de imagens do casal (31 imagens)
const imageFiles = Array.from({length: 31}, (_, i) => `assets/images/img${i + 1}.jpeg`);

// Inicialização
function init() {
    console.log("Iniciando Sun and Moon Player com MUITOS corações...");
    
    // Criar MUITOS corações no fundo
    createMassiveHearts();
    
    // Carregar imagens
    loadImages();
    
    // Criar cobrinha de luz
    createLightSnake();
    
    // Configurar player de áudio
    setupAudioPlayer();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Iniciar animação de corações extras
    startHeartAnimations();
    
    // Criar corações dentro do carrossel
    createCarouselHearts();
    
    // Iniciar a música nos 30 segundos
    setTimeout(() => {
        audioPlayer.currentTime = 30;
        updateProgress();
        
        // Tentar tocar automaticamente
        setTimeout(() => {
            audioPlayer.play().then(() => {
                console.log("Música iniciada automaticamente");
                isPlaying = true;
                playIcon.className = 'fas fa-pause';
                startCarousel();
                startSnakeAnimation();
            }).catch(e => {
                console.log("Autoplay bloqueado, aguardando interação do usuário");
                startCarousel();
                startSnakeAnimation();
            });
        }, 500);
    }, 1000);
}

// Criar MUITOS corações flutuantes no fundo
function createMassiveHearts() {
    if (!heartsContainer) return;
    
    heartsContainer.innerHTML = '';
    
    // Criar 300 corações! (MUITOS corações)
    for (let i = 0; i < 300; i++) {
        createFloatingHeart(i);
        
        // Criar em batches para não travar o navegador
        if (i % 50 === 0) setTimeout(() => {}, 0);
    }
    
    console.log("300 corações criados no fundo!");
}

// Criar um coração flutuante
function createFloatingHeart(index) {
    const heart = document.createElement('div');
    
    const heartType = Math.floor(Math.random() * 4) + 1;
    const isSpecial = Math.random() < 0.15; // 15% são especiais
    const sizeClass = getRandomSizeClass();
    
    heart.className = `floating-heart-music type-${heartType} ${sizeClass}`;
    if (isSpecial) heart.className += ' special';
    
    heart.innerHTML = '❤';
    
    const startLeft = Math.random() * 130 - 15;
    const animationDelay = Math.random() * 40;
    const color = getRandomHeartColor();
    const durations = [18, 22, 26, 30];
    const duration = durations[heartType - 1] + Math.random() * 10 - 5;
    
    heart.style.left = `${startLeft}%`;
    heart.style.animationDelay = `${animationDelay}s`;
    heart.style.animationDuration = `${duration}s`;
    heart.style.color = color;
    
    if (isSpecial) {
        heart.style.filter = `drop-shadow(0 0 30px ${color}) brightness(1.5)`;
        heart.style.zIndex = '2';
    }
    
    heartsContainer.appendChild(heart);
}

// Funções auxiliares para tamanho e cor
function getRandomSizeClass() {
    const sizes = ['tiny', 'tiny', '', 'medium', 'medium', 'large', 'xlarge'];
    const weights = [4, 4, 5, 3, 3, 2, 1];
    
    let totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < sizes.length; i++) {
        if (random < weights[i]) return sizes[i];
        random -= weights[i];
    }
    
    return '';
}

function getRandomHeartColor() {
    const colors = [
        'rgba(255, 0, 100, 0.7)',
        'rgba(255, 77, 148, 0.65)',
        'rgba(255, 150, 200, 0.6)',
        'rgba(255, 100, 150, 0.55)',
        'rgba(255, 200, 220, 0.5)',
        'rgba(255, 50, 100, 0.75)',
        'rgba(255, 120, 180, 0.6)',
        'rgba(255, 180, 220, 0.45)',
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
}

// Criar cobrinha de luz ao redor da foto
function createLightSnake() {
    if (!lightSnake) return;
    
    lightSnake.innerHTML = '';
    snakeSegments = [];
    
    // Criar 16 segmentos para a cobrinha
    for (let i = 0; i < 16; i++) {
        const segment = document.createElement('div');
        segment.className = 'snake-segment';
        segment.dataset.index = i;
        
        // Posições iniciais (ao redor do retângulo)
        if (i < 4) {
            // Topo
            segment.style.top = '-10px';
            segment.style.left = `${(i * 25) + 12.5}%`;
            segment.style.width = '60px';
            segment.style.height = '20px';
        } else if (i < 8) {
            // Direita
            segment.style.top = `${((i - 4) * 25) + 12.5}%`;
            segment.style.left = '100%';
            segment.style.width = '20px';
            segment.style.height = '60px';
        } else if (i < 12) {
            // Base
            segment.style.top = '100%';
            segment.style.left = `${((i - 8) * 25) + 12.5}%`;
            segment.style.width = '60px';
            segment.style.height = '20px';
        } else {
            // Esquerda
            segment.style.top = `${((i - 12) * 25) + 12.5}%`;
            segment.style.left = '-10px';
            segment.style.width = '20px';
            segment.style.height = '60px';
        }
        
        lightSnake.appendChild(segment);
        snakeSegments.push(segment);
    }
    
    console.log("Cobrinha de luz criada!");
}

// Animar a cobrinha
function startSnakeAnimation() {
    let angle = 0;
    
    function animateSnake() {
        angle += 0.02;
        
        snakeSegments.forEach((segment, index) => {
            const segmentAngle = angle + (index * 0.3);
            const wave = Math.sin(segmentAngle) * 0.3 + 0.7;
            
            // Atualizar opacidade e brilho
            segment.style.opacity = (0.6 + wave * 0.4).toString();
            segment.style.filter = `
                blur(${2 + wave}px)
                drop-shadow(0 0 ${10 + wave * 10}px #ff0064)
                drop-shadow(0 0 ${15 + wave * 15}px #ff4d94)
                drop-shadow(0 0 ${20 + wave * 20}px #ff99c2)
            `;
            
            // Pequeno movimento
            const moveX = Math.sin(segmentAngle * 1.5) * 3;
            const moveY = Math.cos(segmentAngle * 1.5) * 3;
            
            if (index < 4) {
                segment.style.transform = `translateX(${moveX}px)`;
            } else if (index < 8) {
                segment.style.transform = `translateY(${moveY}px)`;
            } else if (index < 12) {
                segment.style.transform = `translateX(${-moveX}px)`;
            } else {
                segment.style.transform = `translateY(${-moveY}px)`;
            }
        });
        
        requestAnimationFrame(animateSnake);
    }
    
    animateSnake();
}

// Criar corações dentro do carrossel
function createCarouselHearts() {
    const carousel = document.querySelector('.photo-carousel');
    if (!carousel) return;
    
    const innerHearts = carousel.querySelector('.carousel-inner-hearts');
    if (!innerHearts) return;
    
    // Criar 50 corações dentro do carrossel
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            createInnerHeart(innerHearts, i);
        }, i * 200);
    }
}

function createInnerHeart(container, index) {
    const heart = document.createElement('div');
    heart.className = 'inner-heart';
    heart.innerHTML = '❤';
    
    const startX = Math.random() * 100;
    const endX = startX + (Math.random() * 40 - 20);
    const delay = Math.random() * 30;
    const duration = 15 + Math.random() * 10;
    const colors = ['#ff0064', '#ff4d94', '#ff99c2'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = Math.random() * 20 + 10;
    
    heart.style.setProperty('--start-x', `${startX}%`);
    heart.style.setProperty('--end-x', `${endX}%`);
    heart.style.left = `${startX}%`;
    heart.style.animationDelay = `${delay}s`;
    heart.style.animationDuration = `${duration}s`;
    heart.style.color = color;
    heart.style.fontSize = `${size}px`;
    heart.style.filter = `drop-shadow(0 0 15px ${color})`;
    
    container.appendChild(heart);
    
    // Remover após animação
    setTimeout(() => {
        if (heart.parentNode === container) {
            container.removeChild(heart);
            
            // Criar novo coração
            setTimeout(() => createInnerHeart(container, index), Math.random() * 5000 + 2000);
        }
    }, (delay + duration) * 1000);
}

// Carregar imagens no carrossel
function loadImages() {
    console.log("Carregando imagens...");
    
    carouselTrack.innerHTML = '';
    
    if (imageFiles.length === 0) {
        carouselTrack.innerHTML = `
            <div class="loading-images">
                <div class="heart-icon">❤</div>
                <p>Adicione suas fotos na pasta assets/images/</p>
                <p>Nomeie-as como img1.jpeg até img31.jpeg</p>
            </div>
        `;
        return;
    }
    
    imageFiles.forEach((imageSrc, index) => {
        const slide = document.createElement('div');
        slide.className = 'carousel-slide';
        slide.dataset.index = index;
        
        slide.style.backgroundImage = `url('${imageSrc}')`;
        slide.style.backgroundSize = 'cover';
        slide.style.backgroundPosition = 'center';
        slide.style.backgroundRepeat = 'no-repeat';
        
        carouselTrack.appendChild(slide);
    });
    
    showImage(0);
    console.log(`${imageFiles.length} imagens carregadas`);
}

// Mostrar imagem específica
function showImage(index) {
    const slides = document.querySelectorAll('.carousel-slide');
    
    slides.forEach(slide => slide.classList.remove('active'));
    
    if (slides[index]) {
        slides[index].classList.add('active');
        
        // Efeito especial na cobrinha quando muda a imagem
        if (snakeSegments.length > 0) {
            snakeSegments.forEach(segment => {
                segment.style.transition = 'all 0.3s ease';
                segment.style.filter += ' brightness(1.8)';
                
                setTimeout(() => {
                    segment.style.transition = '';
                    segment.style.filter = segment.style.filter.replace(' brightness(1.8)', '');
                }, 300);
            });
        }
    }
    
    currentImageIndex = index;
}

// Iniciar transição automática do carrossel
function startCarousel() {
    clearInterval(carouselInterval);
    
    carouselInterval = setInterval(() => {
        let nextIndex = currentImageIndex + 1;
        if (nextIndex >= imageFiles.length) nextIndex = 0;
        showImage(nextIndex);
    }, 3000);
    
    console.log("Carrossel iniciado");
}

// Configurar player de áudio
function setupAudioPlayer() {
    console.log("Configurando player de áudio...");
    
    audioPlayer.loop = true;
    audioPlayer.currentTime = 30;
    
    audioPlayer.addEventListener('loadedmetadata', () => {
        console.log("Metadados do áudio carregados");
        updateTimer();
        
        if (audioPlayer.duration && audioPlayer.duration > 0) {
            const progressPercent = (30 / audioPlayer.duration) * 100;
            progress.style.width = `${progressPercent}%`;
        }
    });
    
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.volume = 0.8;
    volumeLevel.style.width = '80%';
}

// Configurar event listeners
function setupEventListeners() {
    // Botão play/pause
    playBtn.addEventListener('click', togglePlay);
    
    // Barra de progresso
    progressBar.addEventListener('click', seek);
    
    // Controle de volume
    volumeSlider.addEventListener('click', changeVolume);
    
    // Quando a música começar a tocar
    audioPlayer.addEventListener('play', () => {
        console.log("Música iniciada");
        startCarousel();
        
        // Efeito especial nos corações quando a música começa
        createMusicStartEffect();
    });
    
    // Quando a música pausar
    audioPlayer.addEventListener('pause', () => {
        console.log("Música pausada");
        clearInterval(carouselInterval);
    });
    
    // Tratar erros de áudio
    audioPlayer.addEventListener('error', (e) => {
        console.error("Erro no áudio:", e);
    });
}

// Tocar/pausar música
function togglePlay() {
    if (isPlaying) {
        audioPlayer.pause();
        playIcon.className = 'fas fa-play';
        clearInterval(carouselInterval);
    } else {
        audioPlayer.play().then(() => {
            playIcon.className = 'fas fa-pause';
            startCarousel();
            createMusicStartEffect();
        }).catch(e => {
            console.log("Erro ao tocar música:", e);
        });
    }
    isPlaying = !isPlaying;
}

// Efeito especial quando a música começa
function createMusicStartEffect() {
    // Adicionar mais corações
    for (let i = 0; i < 30; i++) {
        setTimeout(() => createRandomHeart(), i * 50);
    }
    
    // Efeito na cobrinha
    if (snakeSegments.length > 0) {
        snakeSegments.forEach((segment, index) => {
            setTimeout(() => {
                segment.style.transition = 'all 0.5s ease';
                segment.style.filter += ' brightness(2) contrast(2)';
                
                setTimeout(() => {
                    segment.style.transition = '';
                    segment.style.filter = segment.style.filter.replace(' brightness(2) contrast(2)', '');
                }, 500);
            }, index * 100);
        });
    }
}

// Criar coração aleatório
function createRandomHeart() {
    if (!heartsContainer) return;
    
    const heart = document.createElement('div');
    heart.className = 'floating-heart-music';
    
    const heartType = Math.floor(Math.random() * 4) + 1;
    heart.classList.add(`type-${heartType}`);
    
    const sizes = ['tiny', 'medium', 'large'];
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    if (size) heart.classList.add(size);
    
    heart.innerHTML = '❤';
    
    const left = Math.random() * 100;
    const sizePx = size === 'tiny' ? 16 : size === 'medium' ? 32 : 42;
    const duration = Math.random() * 8 + 15;
    const delay = Math.random() * 3;
    const color = getRandomHeartColor();
    
    heart.style.left = `${left}%`;
    heart.style.bottom = '0';
    heart.style.fontSize = `${sizePx}px`;
    heart.style.color = color;
    heart.style.opacity = '0.9';
    heart.style.animationDuration = `${duration}s`;
    heart.style.animationDelay = `${delay}s`;
    heart.style.filter = `drop-shadow(0 0 20px ${color}) brightness(1.3)`;
    
    heartsContainer.appendChild(heart);
    
    setTimeout(() => {
        if (heart.parentNode === heartsContainer) {
            heartsContainer.removeChild(heart);
        }
    }, (duration + delay) * 1000);
}

// Atualizar barra de progresso e timer
function updateProgress() {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    
    if (duration && duration > 0) {
        const progressPercent = (currentTime / duration) * 100;
        progress.style.width = `${progressPercent}%`;
    }
    
    updateTimer();
}

// Atualizar timer
function updateTimer() {
    const currentTime = audioPlayer.currentTime;
    const duration = audioPlayer.duration;
    
    const currentMinutes = Math.floor(currentTime / 60);
    const currentSeconds = Math.floor(currentTime % 60);
    if (currentTimeEl) {
        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds < 10 ? '0' : ''}${currentSeconds}`;
    }
    
    if (duration && duration > 0 && durationEl) {
        const durationMinutes = Math.floor(duration / 60);
        const durationSeconds = Math.floor(duration % 60);
        durationEl.textContent = `${durationMinutes}:${durationSeconds < 10 ? '0' : ''}${durationSeconds}`;
    }
}

// Buscar posição na música
function seek(e) {
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
}

// Alterar volume
function changeVolume(e) {
    const rect = volumeSlider.getBoundingClientRect();
    let percent = (e.clientX - rect.left) / rect.width;
    percent = Math.max(0, Math.min(1, percent));
    
    audioPlayer.volume = percent;
    volumeLevel.style.width = `${percent * 100}%`;
    updateVolumeIcon(percent);
}

// Atualizar ícone de volume
function updateVolumeIcon(volume) {
    if (!volumeIcon) return;
    
    if (volume === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (volume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

// Iniciar animações de corações extras
function startHeartAnimations() {
    const headerHearts = document.querySelectorAll('.logo .heart-icon, .carousel-hearts .heart, .extra-hearts .heart, .footer-hearts .heart');
    
    headerHearts.forEach((heart, index) => {
        heart.style.animation = `gentlePulse ${Math.random() * 2 + 2}s infinite ${index * 0.3}s`;
    });
    
    // Adicionar corações periodicamente
    setInterval(() => {
        createRandomHeart();
    }, 2000);
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    init();
    loadLyrics();
});

// Redimensionar cobrinha quando a janela for redimensionada
window.addEventListener('resize', () => {
    setTimeout(() => {
        createLightSnake();
    }, 100);
});

console.log("Script com MUITOS corações e cobrinha de luz carregado!");