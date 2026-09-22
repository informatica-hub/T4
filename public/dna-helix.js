/**
 * DNA Double Helix Animation - Three.js
 * ======================================
 * Animación de doble hélice de ADN hiperrealista
 * con efectos de post-processing (Bloom/Glow)
 *
 * Opciones:
 * 1. Modelo procedural (generado por código)
 * 2. Modelo GLTF importado (mayor realismo)
 */

// ============================================
// CONFIGURACIÓN
// ============================================

const DNA_CONFIG = {
    helix: {
        radius: 1,
        height: 8,
        turns: 3,
        pointsPerTurn: 30,
        phaseOffset: 3.14,
    },

    basePairs: {
        count: 24,
        width: 0.1,
        connectorSize: 1,
        highlightIndex: 12,
        highlightColor: 0x00ff00,
        highlightIntensity: 1.5,
        colors: {
            adenine: 0x4a4082,
            thymine: 0x854452,
            guanine: 0x799458,
            cytosine: 0x978c30,
        }
    },

    backbone: {
        tubeRadius: 0.075,
        roughness: 0.95,
        color1: 0x384747,
        color2: 0x384747,
    },

    animation: {
        rotationSpeed: 0.005,
        floatAmplitude: 0.1,
        floatSpeed: 0.5,
    },

    postProcessing: {
        enabled: false,
        bloom: {
            strength: 0,
            radius: 0,
            threshold: 0
        }
    },

    particles: {
        count: 1250,
        size: 0.02,
        color: 0x021b31,
        spread: 5
    }
};

// ============================================
// CLASE PRINCIPAL
// ============================================

class DNAHelix {
    constructor(container, options = {}) {
        this.container = container || document.body;
        this.config = { ...DNA_CONFIG, ...options };

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.composer = null;
        this.dnaGroup = null;
        this.particles = null;
        this.clock = new THREE.Clock();
        this.mouse = { x: 0, y: 0 };
        this.isDragging = false;
        this.dragStart = { x: 0, y: 0 };
        this.manualRotation = { x: 0, y: 0 };
        this.autoRotationDirection = 1; // 1 = normal, -1 = inverso

        this.init();
    }

    // ============================================
    // INICIALIZACIÓN
    // ============================================

    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createLights();
        this.lumpyTexture = this.createLumpyTexture();
        this.createDNA();
        this.createParticles();
        this.setupPostProcessing();
        this.setupEventListeners();
        this.animate();
    }

    createScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xFAF5F2);
        this.scene.fog = new THREE.FogExp2(0xFAF5F2, 0.05);
    }

    createCamera() {
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
        this.camera.position.set(0, 0, 8);
        this.camera.lookAt(0, 0, 0);
    }

    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: false,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.0;
        this.renderer.domElement.style.cursor = 'grab';
        this.container.appendChild(this.renderer.domElement);
    }

    createLights() {
        // Luz ambiental suave (reducida para sombras más profundas)
        const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
        this.scene.add(ambientLight);

        // Luz principal (aumentada para contraste)
        const mainLight = new THREE.DirectionalLight(0xffffff, 1.5);
        mainLight.position.set(5, 5, 5);
        this.scene.add(mainLight);

        // Luz de relleno (color)
        const fillLight = new THREE.PointLight(0x6366f1, 0.8, 20);
        fillLight.position.set(-3, 2, 3);
        this.scene.add(fillLight);

        // Luz de acento
        const accentLight = new THREE.PointLight(0x8b5cf6, 0.6, 15);
        accentLight.position.set(3, -2, 2);
        this.scene.add(accentLight);

        // Luz trasera (rim light)
        const rimLight = new THREE.PointLight(0x00ff88, 0.4, 20);
        rimLight.position.set(0, 0, -5);
        this.scene.add(rimLight);
    }

    // ============================================
    // CREACIÓN DEL ADN PROCEDURAL
    // ============================================

    createDNA() {
        this.dnaGroup = new THREE.Group();

        // Crear las dos cadenas del backbone
        this.createBackboneStrands();

        // Crear los pares de bases
        this.createBasePairs();

        // Crear esferas decorativas (átomos)
        this.createAtomSpheres();

        // Centrar el modelo
        this.dnaGroup.position.y = -this.config.helix.height / 2;

        this.scene.add(this.dnaGroup);
    }

    createBackboneStrands() {
        const { radius, height, turns, pointsPerTurn, phaseOffset } = this.config.helix;
        const totalPoints = turns * pointsPerTurn;

        // Sensibilidad orgánica: aumentar segmentos para mayor suavidad
        const radialSegments = 20;
        const tubularSegments = totalPoints * 3;

        // Generar puntos para ambas cadenas
        const points1 = [];
        const points2 = [];

        for (let i = 0; i <= totalPoints; i++) {
            const t = i / totalPoints;
            const angle = t * turns * Math.PI * 2;
            const y = t * height;

            // Cadena 1
            points1.push(new THREE.Vector3(
                Math.cos(angle) * radius,
                y,
                Math.sin(angle) * radius
            ));

            // Cadena 2 (desfasada 180°)
            points2.push(new THREE.Vector3(
                Math.cos(angle + phaseOffset) * radius,
                y,
                Math.sin(angle + phaseOffset) * radius
            ));
        }

        // Crear curvas suaves
        const curve1 = new THREE.CatmullRomCurve3(points1);
        const curve2 = new THREE.CatmullRomCurve3(points2);

        // Material para las cadenas (con efecto orgánico/grumoso acentuado)
        const material1 = new THREE.MeshStandardMaterial({
            color: this.config.backbone.color1,
            emissive: this.config.backbone.color1,
            emissiveIntensity: 0.05, // Muy bajo para notar sombras
            metalness: 0.2,
            roughness: this.config.backbone.roughness || 0.9,
            bumpMap: this.lumpyTexture,
            bumpScale: 0.12,         // Aumentado para definición
        });

        const material2 = new THREE.MeshStandardMaterial({
            color: this.config.backbone.color2,
            emissive: this.config.backbone.color2,
            emissiveIntensity: 0.05,
            metalness: 0.2,
            roughness: this.config.backbone.roughness || 0.9,
            bumpMap: this.lumpyTexture,
            bumpScale: 0.12,
        });

        // Crear geometría de tubo con más detalle
        const tubeGeometry1 = new THREE.TubeGeometry(
            curve1,
            tubularSegments,
            this.config.backbone.tubeRadius,
            radialSegments,
            false
        );
        const tubeGeometry2 = new THREE.TubeGeometry(
            curve2,
            tubularSegments,
            this.config.backbone.tubeRadius,
            radialSegments,
            false
        );

        // Crear meshes
        const strand1 = new THREE.Mesh(tubeGeometry1, material1);
        const strand2 = new THREE.Mesh(tubeGeometry2, material2);

        this.dnaGroup.add(strand1);
        this.dnaGroup.add(strand2);

        // Guardar referencias para animación
        this.strand1 = strand1;
        this.strand2 = strand2;
    }

    createBasePairs() {
        const { radius, height, turns, phaseOffset } = this.config.helix;
        const { count, width, colors, connectorSize, highlightIndex, highlightColor, highlightIntensity } = this.config.basePairs;

        const basePairColors = [
            [colors.adenine, colors.thymine],    // A-T
            [colors.guanine, colors.cytosine],   // G-C
        ];

        for (let i = 0; i < count; i++) {
            const t = i / count;
            const angle = t * turns * Math.PI * 2;
            const y = t * height;

            // Posiciones de los puntos de conexión
            const x1 = Math.cos(angle) * radius;
            const z1 = Math.sin(angle) * radius;
            const x2 = Math.cos(angle + phaseOffset) * radius;
            const z2 = Math.sin(angle + phaseOffset) * radius;

            // Seleccionar color (alternando A-T y G-C)
            const colorPair = basePairColors[i % 2];

            const isHighlighted = (i === highlightIndex);

            // Crear la conexión (par de bases)
            this.createBasePairConnection(
                new THREE.Vector3(x1, y, z1),
                new THREE.Vector3(x2, y, z2),
                colorPair,
                width,
                connectorSize !== undefined ? connectorSize : 1.5,
                isHighlighted,
                highlightColor !== undefined ? highlightColor : 0x00ff00,
                highlightIntensity !== undefined ? highlightIntensity : 1.5
            );
        }
    }

    createBasePairConnection(start, end, colors, width, connectorSize, isHighlighted, highlightColor, highlightIntensity) {
        const midPoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);

        // Primera mitad (desde cadena 1 al centro)
        const geometry1 = new THREE.CylinderGeometry(width, width, start.distanceTo(midPoint), 12);
        const material1 = new THREE.MeshStandardMaterial({
            color: colors[0],
            emissive: colors[0],
            emissiveIntensity: 0.1,
            metalness: 0.1,
            roughness: 0.9,
            bumpMap: this.lumpyTexture,
            bumpScale: 0.08,
        });
        const cylinder1 = new THREE.Mesh(geometry1, material1);

        // Posicionar y rotar
        const pos1 = new THREE.Vector3().addVectors(start, midPoint).multiplyScalar(0.5);
        cylinder1.position.copy(pos1);
        cylinder1.lookAt(midPoint);
        cylinder1.rotateX(Math.PI / 2);

        // Segunda mitad (desde centro a cadena 2)
        const geometry2 = new THREE.CylinderGeometry(width, width, midPoint.distanceTo(end), 12);
        const material2 = new THREE.MeshStandardMaterial({
            color: colors[1],
            emissive: colors[1],
            emissiveIntensity: 0.1,
            metalness: 0.1,
            roughness: 0.9,
            bumpMap: this.lumpyTexture,
            bumpScale: 0.08,
        });
        const cylinder2 = new THREE.Mesh(geometry2, material2);

        const pos2 = new THREE.Vector3().addVectors(midPoint, end).multiplyScalar(0.5);
        cylinder2.position.copy(pos2);
        cylinder2.lookAt(end);
        cylinder2.rotateX(Math.PI / 2);

        // Esfera central (enlace de hidrógeno)
        const sphereRadius = width * connectorSize;
        const sphereGeometry = new THREE.SphereGeometry(sphereRadius, 16, 16);

        let sphereColor, sphereEmissive, sphereEmissiveIntensity, sphereMetalness, sphereRoughness;
        if (isHighlighted) {
            sphereColor = highlightColor;
            sphereEmissive = highlightColor;
            sphereEmissiveIntensity = highlightIntensity;
            sphereMetalness = 0.3;
            sphereRoughness = 0.1;
        } else {
            sphereColor = 0xffffff;
            sphereEmissive = 0xffffff;
            sphereEmissiveIntensity = 0.5;
            sphereMetalness = 0.8;
            sphereRoughness = 0.2;
        }

        const sphereMaterial = new THREE.MeshStandardMaterial({
            color: sphereColor,
            emissive: sphereEmissive,
            emissiveIntensity: sphereEmissiveIntensity,
            metalness: sphereMetalness,
            roughness: sphereRoughness,
        });
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.copy(midPoint);

        this.dnaGroup.add(cylinder1);
        this.dnaGroup.add(cylinder2);
        this.dnaGroup.add(sphere);
    }

    createAtomSpheres() {
        const { radius, height, turns, phaseOffset } = this.config.helix;
        const atomCount = 48;

        const atomGeometry = new THREE.SphereGeometry(0.08, 16, 16);

        for (let i = 0; i < atomCount; i++) {
            const t = i / atomCount;
            const angle = t * turns * Math.PI * 2;
            const y = t * height;

            // Átomos en cadena 1
            const atomMaterial1 = new THREE.MeshStandardMaterial({
                color: this.config.backbone.color1,
                emissive: this.config.backbone.color1,
                emissiveIntensity: 0.1,
                metalness: 0.4,
                roughness: 0.6,
                bumpMap: this.lumpyTexture,
                bumpScale: 0.05,
            });
            const atom1 = new THREE.Mesh(atomGeometry, atomMaterial1);
            atom1.position.set(
                Math.cos(angle) * radius,
                y,
                Math.sin(angle) * radius
            );
            this.dnaGroup.add(atom1);

            // Átomos en cadena 2
            const atomMaterial2 = new THREE.MeshStandardMaterial({
                color: this.config.backbone.color2,
                emissive: this.config.backbone.color2,
                emissiveIntensity: 0.1,
                metalness: 0.4,
                roughness: 0.6,
                bumpMap: this.lumpyTexture,
                bumpScale: 0.05,
            });
            const atom2 = new THREE.Mesh(atomGeometry, atomMaterial2);
            atom2.position.set(
                Math.cos(angle + phaseOffset) * radius,
                y,
                Math.sin(angle + phaseOffset) * radius
            );
            this.dnaGroup.add(atom2);
        }
    }

    // ============================================
    // PARTÍCULAS AMBIENTALES
    // ============================================

    createParticles() {
        const { count, size, color, spread } = this.config.particles;

        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        const colorObj = new THREE.Color(color);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Posiciones aleatorias en un volumen
            positions[i3] = (Math.random() - 0.5) * spread * 2;
            positions[i3 + 1] = (Math.random() - 0.5) * spread * 2;
            positions[i3 + 2] = (Math.random() - 0.5) * spread * 2;

            // Colores con variación
            const colorVariation = 0.5 + Math.random() * 0.5;
            colors[i3] = colorObj.r * colorVariation;
            colors[i3 + 1] = colorObj.g * colorVariation;
            colors[i3 + 2] = colorObj.b * colorVariation;

            // Tamaños variados
            sizes[i] = size * (0.5 + Math.random());
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.PointsMaterial({
            size: size,
            vertexColors: true,
            transparent: true,
            opacity: 0.5,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        this.particles = new THREE.Points(geometry, material);
        this.scene.add(this.particles);
    }

    // ============================================
    // TEXTURAS ORGÁNICAS
    // ============================================

    createLumpyTexture() {
        const size = 512;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        // Fondo gris base (neutral para bump)
        ctx.fillStyle = '#888888';
        ctx.fillRect(0, 0, size, size);

        // Añadir ruido de "grumos"
        for (let i = 0; i < 2000; i++) {
            const x = Math.random() * size;
            const y = Math.random() * size;
            const radius = 2 + Math.random() * 8;
            const alpha = 0.1 + Math.random() * 0.3;
            const color = Math.random() > 0.5 ? 255 : 0; // Manchas claras y oscuras

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color},${color},${color},${alpha})`;
            ctx.fill();
        }

        // Difuminado para suavizar los grumos
        ctx.filter = 'blur(4px)';
        ctx.drawImage(canvas, 0, 0);

        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 8); // Ajustar para que se vea natural en los tubos

        return texture;
    }

    // ============================================
    // POST-PROCESSING
    // ============================================

    setupPostProcessing() {
        if (!this.config.postProcessing.enabled) return;

        // Verificar si EffectComposer está disponible
        if (typeof THREE.EffectComposer === 'undefined') {
            console.warn('EffectComposer not loaded. Post-processing disabled.');
            return;
        }

        const { bloom } = this.config.postProcessing;

        this.composer = new THREE.EffectComposer(this.renderer);

        // Render pass
        const renderPass = new THREE.RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        // Bloom pass
        const bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            bloom.strength,
            bloom.radius,
            bloom.threshold
        );
        this.composer.addPass(bloomPass);

        this.bloomPass = bloomPass;
    }

    // ============================================
    // EVENTOS
    // ============================================

    setupEventListeners() {
        window.addEventListener('resize', this.onResize.bind(this));
        window.addEventListener('mousemove', this.onMouseMove.bind(this));
        
        // Eventos para arrastrar y girar
        this.renderer.domElement.addEventListener('mousedown', this.onMouseDown.bind(this));
        window.addEventListener('mouseup', this.onMouseUp.bind(this));
        
        // Touch events para móvil
        this.renderer.domElement.addEventListener('touchstart', this.onTouchStart.bind(this));
        window.addEventListener('touchend', this.onTouchEnd.bind(this));
        window.addEventListener('touchmove', this.onTouchMove.bind(this));
    }

    onResize() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);

        if (this.composer) {
            this.composer.setSize(width, height);
        }
    }

    onMouseMove(event) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        
        // Si está arrastrando, aplicar rotación manual
        if (this.isDragging) {
            const deltaX = event.clientX - this.dragStart.x;
            const deltaY = event.clientY - this.dragStart.y;
            
            this.manualRotation.y = deltaX * 0.006;
            this.manualRotation.x = deltaY * 0.006;
            
            // Invertir dirección de auto-rotación si arrastra en sentido contrario
            if (Math.abs(deltaX) > 50) {
                this.autoRotationDirection = deltaX > 0 ? -1 : 1;
            }
        }
    }

    onMouseDown(event) {
        this.isDragging = true;
        this.dragStart.x = event.clientX;
        this.dragStart.y = event.clientY;
        this.renderer.domElement.style.cursor = 'grabbing';
    }

    onMouseUp() {
        this.isDragging = false;
        this.manualRotation = { x: 0, y: 0 };
        this.renderer.domElement.style.cursor = 'grab';
    }

    onTouchStart(event) {
        if (event.touches.length === 1) {
            this.isDragging = true;
            this.dragStart.x = event.touches[0].clientX;
            this.dragStart.y = event.touches[0].clientY;
        }
    }

    onTouchEnd() {
        this.isDragging = false;
        this.manualRotation = { x: 0, y: 0 };
    }

    onTouchMove(event) {
        if (this.isDragging && event.touches.length === 1) {
            const deltaX = event.touches[0].clientX - this.dragStart.x;
            const deltaY = event.touches[0].clientY - this.dragStart.y;
            
            this.manualRotation.y = deltaX * 0.006;
            this.manualRotation.x = deltaY * 0.006;
            
            if (Math.abs(deltaX) > 50) {
                this.autoRotationDirection = deltaX > 0 ? -1 : 1;
            }
        }
    }

    // ============================================
    // ANIMACIÓN
    // ============================================

    animate() {
        requestAnimationFrame(this.animate.bind(this));

        const delta = this.clock.getDelta();
        const elapsed = this.clock.getElapsedTime();

        // Rotación del ADN
        if (this.dnaGroup) {
            // Auto-rotación con dirección controlable
            this.dnaGroup.rotation.y += this.config.animation.rotationSpeed * this.autoRotationDirection;
            
            // Rotación manual por arrastre
            if (this.isDragging) {
                this.dnaGroup.rotation.y += this.manualRotation.y;
                this.dnaGroup.rotation.x += this.manualRotation.x;
            }

            // Efecto de flotación suave
            this.dnaGroup.position.y =
                -this.config.helix.height / 2 +
                Math.sin(elapsed * this.config.animation.floatSpeed) *
                this.config.animation.floatAmplitude;

            // Inclinación sutil basada en el mouse (solo si no está arrastrando)
            if (!this.isDragging) {
                this.dnaGroup.rotation.x = this.mouse.y * 0.1;
                this.dnaGroup.rotation.z = this.mouse.x * 0.1;
            }
        }

        // Animar partículas
        if (this.particles) {
            this.particles.rotation.y += 0.0005;
            this.particles.rotation.x += 0.0002;

            // Animar posiciones de partículas
            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += Math.sin(elapsed + i) * 0.001;
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
        }

        // Render
        if (this.composer) {
            this.composer.render();
        } else {
            this.renderer.render(this.scene, this.camera);
        }
    }

    // ============================================
    // MÉTODOS PÚBLICOS
    // ============================================

    setRotationSpeed(speed) {
        this.config.animation.rotationSpeed = speed;
    }

    setBloomIntensity(intensity) {
        if (this.bloomPass) {
            this.bloomPass.strength = intensity;
        }
    }

    // Cargar modelo GLTF externo
    async loadGLTFModel(url) {
        return new Promise((resolve, reject) => {
            if (typeof THREE.GLTFLoader === 'undefined') {
                reject(new Error('GLTFLoader not loaded'));
                return;
            }

            const loader = new THREE.GLTFLoader();
            loader.load(
                url,
                (gltf) => {
                    // Remover el ADN procedural
                    if (this.dnaGroup) {
                        this.scene.remove(this.dnaGroup);
                    }

                    // Agregar el modelo importado
                    const model = gltf.scene;
                    model.scale.set(1, 1, 1);

                    // Aplicar materiales emisivos para el glow
                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.material.emissive = child.material.color;
                            child.material.emissiveIntensity = 0.3;
                        }
                    });

                    this.dnaGroup = model;
                    this.scene.add(model);
                    resolve(model);
                },
                (progress) => {
                    console.log('Loading:', (progress.loaded / progress.total * 100) + '%');
                },
                reject
            );
        });
    }

    // Limpiar recursos
    dispose() {
        window.removeEventListener('resize', this.onResize);
        window.removeEventListener('mousemove', this.onMouseMove);

        this.scene.traverse((object) => {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(m => m.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });

        this.renderer.dispose();
        if (this.composer) this.composer.dispose();
    }
}

// ============================================
// EXPORTAR
// ============================================

// Para uso como módulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DNAHelix, DNA_CONFIG };
}

// Para uso global
window.DNAHelix = DNAHelix;
window.DNA_CONFIG = DNA_CONFIG;
