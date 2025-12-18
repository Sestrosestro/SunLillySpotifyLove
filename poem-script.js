// Elementos do DOM
const poemContainer = document.getElementById('poem-container');
const passwordInput = document.getElementById('password-input');
const submitButton = document.getElementById('submit-password');
const errorMessage = document.getElementById('error-message');
const transitionScreen = document.getElementById('transition-screen');
const heartsContainer = document.getElementById('hearts-container');

// Senha correta
const CORRECT_PASSWORD = 'ECLIPSE';

// Configuração de performance
const HEART_COUNT = 200; // MUITOS mais corações!
const SPECIAL_HEART_RATIO = 0.1; // 10% especiais

// Inicialização
function init() {
    console.log("Iniciando tela do poema...");
    
    // Criar MUITOS corações no fundo
    createMassiveHearts();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Focar no campo de senha
    setTimeout(() => {
        passwordInput.focus();
    }, 1000);
}

// Criar MUITOS corações flutuantes
function createMassiveHearts() {
    if (!heartsContainer) return;
    
    // Limpar corações existentes
    heartsContainer.innerHTML = '';
    
    console.log(`Criando ${HEART_COUNT} corações...`);
    
    // Criar corações em lotes para performance
    for (let i = 0; i < HEART_COUNT; i++) {
        createFloatingHeart(i);
        
        // Adicionar delay para não sobrecarregar o navegador
        if (i % 50 === 0) {
            setTimeout(() => {}, 0);
        }
    }
    
    console.log(`${HEART_COUNT} corações criados no fundo!`);
}

// Criar um coração flutuante individual
function createFloatingHeart(index) {
    const heart = document.createElement('div');
    
    // Escolher tipo de animação (1-6)
    const heartType = Math.floor(Math.random() * 6) + 1;
    
    // Determinar se é especial
    const isSpecial = Math.random() < SPECIAL_HEART_RATIO;
    
    // Escolher tamanho
    const sizeClass = getRandomSizeClass();
    
    // Configurar classe
    heart.className = `floating-heart type-${heartType} ${sizeClass}`;
    if (isSpecial) {
        heart.className += ' special';
    }
    
    // Conteúdo
    heart.innerHTML = '❤';
    
    // Posição inicial aleatória
    const startLeft = Math.random() * 120 - 10; // -10% a 110% para efeito de entrada/saída
    const animationDelay = Math.random() * 25; // 0-25s delay
    
    // Cor aleatória
    const color = getRandomHeartColor();
    
    // Duração da animação baseada no tipo
    const durations = [15, 20, 25, 30, 35, 40];
    const baseDuration = durations[heartType - 1];
    const durationVariation = Math.random() * 10 - 5; // ±5 segundos
    const finalDuration = baseDuration + durationVariation;
    
    // Aplicar estilos
    heart.style.left = `${startLeft}%`;
    heart.style.animationDelay = `${animationDelay}s`;
    heart.style.animationDuration = `${finalDuration}s`;
    heart.style.color = color;
    
    // Efeitos extras para corações especiais
    if (isSpecial) {
        heart.style.filter = `drop-shadow(0 0 20px ${color}) brightness(1.5)`;
        
        // Adicionar animação de pulsação extra
        heart.style.animation += `, gentlePulse ${Math.random() * 3 + 2}s infinite ${animationDelay}s`;
    }
    
    heartsContainer.appendChild(heart);
}

// Função auxiliar para obter classe de tamanho aleatória
function getRandomSizeClass() {
    const sizes = ['tiny', '', 'medium', '', 'large', '', 'xlarge'];
    const weights = [2, 3, 2, 3, 1, 3, 0.5]; // Probabilidades
    
    let totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    
    for (let i = 0; i < sizes.length; i++) {
        if (random < weights[i]) {
            return sizes[i];
        }
        random -= weights[i];
    }
    
    return ''; // tamanho padrão
}

// Função auxiliar para obter cor aleatória
function getRandomHeartColor() {
    const colors = [
        'rgba(255, 0, 100, 0.5)',     // Vermelho forte
        'rgba(255, 77, 148, 0.45)',   // Rosa médio
        'rgba(255, 150, 200, 0.4)',   // Rosa claro
        'rgba(255, 100, 150, 0.35)',  // Rosa avermelhado
        'rgba(255, 200, 220, 0.3)',   // Rosa muito claro
        'rgba(255, 50, 100, 0.55)',   // Vermelho vibrante
        'rgba(255, 120, 180, 0.4)',   // Rosa quente
        'rgba(255, 180, 220, 0.25)',  // Rosa pastel
    ];
    
    return colors[Math.floor(Math.random() * colors.length)];
}

// Configurar event listeners
function setupEventListeners() {
    // Botão de enviar senha
    submitButton.addEventListener('click', checkPassword);
    
    // Enter no campo de senha
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkPassword();
        }
    });
    
    // Limpar mensagem de erro ao digitar
    passwordInput.addEventListener('input', () => {
        if (errorMessage.classList.contains('show')) {
            errorMessage.classList.remove('show');
        }
    });
    
    // Foco no campo de senha
    passwordInput.addEventListener('focus', () => {
        passwordInput.style.borderColor = '#ff4d94';
    });
    
    passwordInput.addEventListener('blur', () => {
        if (!errorMessage.classList.contains('show')) {
            passwordInput.style.borderColor = 'rgba(255, 77, 148, 0.4)';
        }
    });
}

// Verificar senha
function checkPassword() {
    const enteredPassword = passwordInput.value.trim().toUpperCase();
    
    // Verificar se está vazio
    if (!enteredPassword) {
        showError('Por favor, digite a senha do coração.');
        return;
    }
    
    // Verificar se está correta
    if (enteredPassword === CORRECT_PASSWORD) {
        // Senha correta - prosseguir
        onPasswordCorrect();
    } else {
        // Senha incorreta
        showError('Senha incorreta. Tente novamente.');
    }
}

// Mostrar mensagem de erro
function showError(message) {
    errorMessage.querySelector('span').textContent = message;
    errorMessage.classList.add('show');
    passwordInput.style.borderColor = '#ff6666';
    
    // Adicionar efeito de shake no campo
    passwordInput.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        passwordInput.style.animation = '';
    }, 500);
    
    // Limpar campo e focar novamente
    setTimeout(() => {
        passwordInput.value = '';
        passwordInput.focus();
    }, 500);
}

// Quando a senha estiver correta
function onPasswordCorrect() {
    console.log("Senha correta! Redirecionando...");
    
    // Criar CHUVA MASSIVA de corações
    createMassiveHeartRain();
    
    // Adicionar efeito visual no botão
    submitButton.innerHTML = '✓';
    submitButton.style.background = 'linear-gradient(135deg, #00cc66, #00ff88, #00cc66)';
    submitButton.style.boxShadow = '0 0 40px rgba(0, 255, 136, 0.7)';
    submitButton.style.animation = 'gentlePulse 0.5s infinite';
    
    // Desabilitar inputs
    passwordInput.disabled = true;
    submitButton.disabled = true;
    
    // Animar saída do poema
    setTimeout(() => {
        poemContainer.classList.add('fade-out');
    }, 1000);
    
    // Mostrar tela de transição
    setTimeout(() => {
        transitionScreen.classList.add('show');
        
        // Simular loading por 3 segundos
        setTimeout(() => {
            redirectToMusicPage();
        }, 3000);
    }, 2000);
}

// Criar CHUVA MASSIVA de corações
function createMassiveHeartRain() {
    const rainContainer = document.createElement('div');
    rainContainer.id = 'heart-rain';
    rainContainer.style.position = 'fixed';
    rainContainer.style.top = '0';
    rainContainer.style.left = '0';
    rainContainer.style.width = '100%';
    rainContainer.style.height = '100%';
    rainContainer.style.pointerEvents = 'none';
    rainContainer.style.zIndex = '9999';
    rainContainer.style.overflow = 'hidden';
    document.body.appendChild(rainContainer);
    
    // Criar 100 corações caindo!
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            createRainHeart(rainContainer, i);
        }, i * 30); // Começar mais rápido
    }
    
    // Adicionar mais corações após um tempo
    setTimeout(() => {
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                createRainHeart(rainContainer, i + 100);
            }, i * 50);
        }
    }, 1000);
    
    // Remover após a animação
    setTimeout(() => {
        if (rainContainer.parentNode) {
            document.body.removeChild(rainContainer);
        }
    }, 8000);
}

// Criar coração da chuva
function createRainHeart(container, index) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = '❤';
    
    // Posição aleatória no topo (fora da tela)
    const left = Math.random() * 120 - 10;
    const size = Math.random() * 30 + 20;
    const duration = Math.random() * 2 + 1.5; // Mais rápido
    const delay = Math.random() * 0.5;
    
    // Cores da chuva (mais vibrantes)
    const colors = ['#ff0064', '#ff4d94', '#ff99c2', '#ff66aa', '#ff3388'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Tipo de animação para a chuva
    const rainTypes = [1, 2, 3];
    const rainType = rainTypes[Math.floor(Math.random() * rainTypes.length)];
    
    // Estilos
    heart.style.left = `${left}%`;
    heart.style.top = `-${size}px`;
    heart.style.fontSize = `${size}px`;
    heart.style.color = color;
    heart.style.opacity = '0.95';
    heart.style.animation = `floatHeart${rainType} ${duration}s linear forwards ${delay}s`;
    heart.style.filter = `drop-shadow(0 0 25px ${color}) brightness(1.3)`;
    heart.style.zIndex = '9999';
    
    container.appendChild(heart);
    
    // Remover após animação
    setTimeout(() => {
        if (heart.parentNode === container) {
            container.removeChild(heart);
        }
    }, (duration + delay) * 1000);
}

// Redirecionar para a página da música
function redirectToMusicPage() {
    // Adicionar efeito de fade out na tela de transição
    transitionScreen.style.opacity = '0';
    transitionScreen.style.transition = 'opacity 1s ease';
    
    // Adicionar mais corações durante o fade out
    createFinalHeartBurst();
    
    // Redirecionar após o fade out
    setTimeout(() => {
        window.location.href = 'music.html';
    }, 1500);
}

// Criar explosão final de corações
function createFinalHeartBurst() {
    const burstContainer = document.createElement('div');
    burstContainer.style.position = 'fixed';
    burstContainer.style.top = '0';
    burstContainer.style.left = '0';
    burstContainer.style.width = '100%';
    burstContainer.style.height = '100%';
    burstContainer.style.pointerEvents = 'none';
    burstContainer.style.zIndex = '10000';
    document.body.appendChild(burstContainer);
    
    // Criar explosão a partir do centro
    const centerX = 50;
    const centerY = 50;
    
    for (let i = 0; i < 60; i++) {
        const heart = document.createElement('div');
        heart.innerHTML = '❤';
        heart.style.position = 'absolute';
        heart.style.left = `${centerX}%`;
        heart.style.top = `${centerY}%`;
        heart.style.fontSize = `${Math.random() * 25 + 15}px`;
        heart.style.color = getRandomHeartColor();
        heart.style.opacity = '0.9';
        heart.style.transform = 'translate(-50%, -50%)';
        heart.style.zIndex = '10001';
        
        burstContainer.appendChild(heart);
        
        // Animação de explosão
        const angle = (i / 60) * Math.PI * 2;
        const distance = 100 + Math.random() * 50;
        const targetX = centerX + Math.cos(angle) * distance;
        const targetY = centerY + Math.sin(angle) * distance;
        const duration = 1.5 + Math.random();
        
        heart.animate([
            {
                transform: 'translate(-50%, -50%) scale(0.1)',
                opacity: 0
            },
            {
                transform: 'translate(-50%, -50%) scale(1)',
                opacity: 1,
                offset: 0.2
            },
            {
                transform: `translate(calc(-50% + ${targetX - centerX}vw), calc(-50% + ${targetY - centerY}vh)) scale(0.5)`,
                opacity: 0
            }
        ], {
            duration: duration * 1000,
            easing: 'cubic-bezier(0.2, 0.8, 0.3, 1)',
            fill: 'forwards'
        });
        
        // Remover após animação
        setTimeout(() => {
            if (heart.parentNode === burstContainer) {
                burstContainer.removeChild(heart);
            }
        }, duration * 1000);
    }
    
    // Remover container após explosão
    setTimeout(() => {
        if (burstContainer.parentNode) {
            document.body.removeChild(burstContainer);
        }
    }, 2000);
}

// Inicializar quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', init);