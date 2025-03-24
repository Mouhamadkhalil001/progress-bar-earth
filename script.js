/**
 * Advanced Cosmic Terraforming Progress Visualization
 * Created for: Mouhamadkhalil001
 * Date: 2025-03-20 18:19:53
 * 
 * Features:
 * - 3D planet with orbital elements
 * - Dynamic ocean filling with wave animations
 * - Particle systems for interactive effects
 * - Atmospheric lighting and cloud movement
 * - Holographic user interface
 */

document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const ocean = document.getElementById('ocean');
    const progressText = document.getElementById('progressText');
    const progressPlanet = document.getElementById('progressPlanet');
    const resetBtn = document.getElementById('resetBtn');
    const particles = document.getElementById('particles');
    const satellite = document.getElementById('satellite');
    
    // Config
    const targetProgress = 70;
    const incrementStep = 1;
    const incrementInterval = 10;
    
    // State
    let progress = 0;
    let isAnimating = false;
    let particlePool = [];
    
    // Initialize 3D tilt effect
    initTiltEffect();
    
    // Create star particles
    createStarfield();
    
    /**
     * Update the terraforming progress visualization
     * @param {number} percent - Current progress percentage
     */
    function updateProgress(percent) {
        // Update text display
        progressText.textContent = `${percent}%`;
        
        // Update ocean height
        ocean.style.height = `${percent}%`;
        
        // Dynamic ocean color based on progress
        updateOceanColor(percent);
        
        // Update atmosphere intensity
        updateAtmosphere(percent);
        
        // Show celebration effect at target
        if (percent >= targetProgress && percent < targetProgress + incrementStep) {
            celebrateCompletion();
        }
    }
    
    /**
     * Update ocean color based on terraforming progress
     */
    function updateOceanColor(percent) {
        // Start with a murky color and evolve to vibrant blue
        const hue = 190 + (percent / 100 * 10);  // 190-200 range
        const saturation = 70 + (percent / 100 * 30);  // 70-100% range
        const lightness = 40 + (percent / 100 * 10);  // 40-50% range
        
        // Apply color transformations
        ocean.style.filter = `
            hue-rotate(${(percent / 100 * 10) - 5}deg) 
            saturate(${1 + percent/100})
        `;
        
        // Update wave animation speeds based on progress
        const waveSpeed = Math.max(5, 13 - (percent / 10));
        document.querySelector('.ocean-wave-1').style.animationDuration = `${waveSpeed}s`;
        document.querySelector('.ocean-wave-2').style.animationDuration = `${waveSpeed * 0.6}s`;
        document.querySelector('.ocean-wave-3').style.animationDuration = `${waveSpeed * 0.8}s`;
    }
    
    /**
     * Update atmospheric effects based on progress
     */
    function updateAtmosphere(percent) {
        const atmosphere = document.querySelector('.atmosphere');
        atmosphere.style.opacity = 0.4 + (percent / 100 * 0.4);
        
        // More clouds become visible as terraforming progresses
        const clouds = document.querySelectorAll('.cloud');
        clouds.forEach((cloud, index) => {
            const visibilityThreshold = index * 20; // Each cloud appears at different progress points
            cloud.style.opacity = percent > visibilityThreshold ? 0.7 : 0.1;
        });
    }
    
    /**
     * Create special effects when reaching the target
     */
    function celebrateCompletion() {
        // Visual celebration
        progressPlanet.classList.add('terraform-complete');
        setTimeout(() => progressPlanet.classList.remove('terraform-complete'), 1000);
        
        // Create particle burst
        createParticleBurst(150);
        
        // Add satellite flash
        const satelliteGlow = satellite.querySelector('.satellite-glow');
        satelliteGlow.style.boxShadow = '0 0 30px 15px rgba(var(--satellite), 1), 0 0 50px 25px rgba(var(--satellite), 0.7)';
        setTimeout(() => {
            satelliteGlow.style.boxShadow = '';
        }, 1000);
        
        // Play success sound
        playSoundEffect('success');
    }
    
    /**
     * Initialize interactive tilt effect
     */
    function initTiltEffect() {
        const planetContainer = document.querySelector('.planet-container');
        const universe = document.querySelector('.universe');
        
        // Track mouse position
        universe.addEventListener('mousemove', (e) => {
            if (isAnimating) return;
            
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;
            
            planetContainer.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg) translateY(-5px)`;
        });
        
        // Reset position when mouse leaves
        universe.addEventListener('mouseleave', () => {
            planetContainer.style.transform = 'rotateY(0) rotateX(0) translateY(0)';
        });
    }
    
    /**
     * Create particles for the starfield
     */
    function createStarfield() {
        const stars = document.querySelector('.stars');
        
        // Add twinkling stars
        for (let i = 0; i < 100; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.style.cssText = `
                position: absolute;
                width: ${Math.random() * 2 + 1}px;
                height: ${Math.random() * 2 + 1}px;
                background: white;
                border-radius: 50%;
                top: ${Math.random() * 100}vh;
                left: ${Math.random() * 100}vw;
                opacity: ${Math.random() * 0.7 + 0.3};
                animation: twinkle ${Math.random() * 5 + 3}s infinite alternate;
            `;
            stars.appendChild(star);
        }
    }
    
    /**
     * Create a burst of particles
     * @param {number} count - Number of particles to create
     */
    function createParticleBurst(count) {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        for (let i = 0; i < count; i++) {
            // Recycle particles from pool or create new ones
            let particle = particlePool.pop() || document.createElement('div');
            particle.className = 'particle';
            
            // Random position around planet
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 50 + 150;  // Distance from planet center
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            
            // Random size and color
            const size = Math.random() * 4 + 2;
            const hue = Math.random() * 40 + 180;  // Ocean blue to teal range
            
            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                background: hsl(${hue}, 100%, 70%);
                border-radius: 50%;
                box-shadow: 0 0 ${size * 2}px hsl(${hue}, 100%, 70%);
                left: ${x}px;
                top: ${y}px;
                opacity: ${Math.random() * 0.5 + 0.5};
                pointer-events: none;
            `;
            
            particles.appendChild(particle);
            
            // Animate particle
            const speedX = (Math.random() - 0.5) * 3;
            const speedY = (Math.random() - 0.5) * 3;
            const rotationSpeed = (Math.random() - 0.5) * 2;
            const startTime = Date.now();
            const duration = Math.random() * 1500 + 500;
            
            function animateParticle() {
                const elapsed = Date.now() - startTime;
                const progress = elapsed / duration;
                
                if (progress < 1) {
                    const newX = parseFloat(particle.style.left) + speedX;
                    const newY = parseFloat(particle.style.top) + speedY;
                    
                    particle.style.left = `${newX}px`;
                    particle.style.top = `${newY}px`;
                    particle.style.transform = `rotate(${rotationSpeed * elapsed / 100}deg)`;
                    particle.style.opacity = 1 - progress;
                    
                    requestAnimationFrame(animateParticle);
                } else {
                    particle.remove();
                    // Return to pool for reuse
                    particlePool.push(particle);
                }
            }
            
            requestAnimationFrame(animateParticle);
        }
    }
    
    /**
     * Play sound effects
     * @param {string} type - Type of sound to play
     */
    function playSoundEffect(type) {
        // Sound effects could be implemented here
        // Using Web Audio API for immersive sounds
        // Omitted for simplicity but would enhance the experience
        console.log(`Playing ${type} sound effect`);
    }
    
    /**
     * Start the terraforming process
     */
    function startTerraforming() {
        // Reset progress
        progress = 0;
        isAnimating = true;
        progressPlanet.classList.add('loading');
        
        // Initial update
        updateProgress(progress);
        
        // Run the progress animation
        const timer = setInterval(() => {
            progress += incrementStep;
            updateProgress(progress);
            
            if (progress >= targetProgress) {
                clearInterval(timer);
                progressPlanet.classList.remove('loading');
                isAnimating = false;
            }
        }, incrementInterval);
    }
    
    // Set up click handlers
    progressPlanet.addEventListener('click', (e) => {
        if (!isAnimating) {
            // Create ripple effect at click point
            const ripple = document.createElement('div');
            const rect = progressPlanet.getBoundingClientRect();
            
            ripple.className = 'ripple';
            ripple.style.cssText = `
                position: absolute;
                left: ${e.clientX - rect.left}px;
                top: ${e.clientY - rect.top}px;
                width: 5px;
                height: 5px;
                background: rgba(var(--ocean-glow), 0.7);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                animation: ripple 1s linear forwards;
            `;
            
            progressPlanet.appendChild(ripple);
            
            setTimeout(() => ripple.remove(), 1000);
            
            // Start terraforming
            startTerraforming();
            
            // Create particle effect
            createParticleBurst(30);
        }
    });
    
    resetBtn.addEventListener('click', () => {
        if (!isAnimating) {
            startTerraforming();
        }
    });
    
    // Add ripple animation to styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            0% {
                width: 0;
                height: 0;
                opacity: 0.8;
            }
            100% {
                width: 200px;
                height: 200px;
                opacity: 0;
            }
        }
        
        @keyframes twinkle {
            0% { opacity: 0.3; }
            100% { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Start initial animation
    setTimeout(startTerraforming, 500);
});