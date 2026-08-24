'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uTransition; // 0.0 = Tiny Planet, 1.0 = Regular 360 Frame
  uniform float uDarkness;   // Content overlay dimming for readability
  
  varying vec2 vUv;
  
  #define PI 3.1415926535897932384626433832795
  
  mat3 rotateY(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(
      c, 0.0, -s,
      0.0, 1.0, 0.0,
      s, 0.0, c
    );
  }
  
  mat3 rotateX(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(
      1.0, 0.0, 0.0,
      0.0, c, s,
      0.0, -s, c
    );
  }
  
  void main() {
    // Dynamic aspect-ratio independent normalization
    vec2 st = (gl_FragCoord.xy - 0.5 * uResolution.xy) / min(uResolution.x, uResolution.y);
    
    // Smooth transition curve (sine ease in-out)
    float t = smoothstep(0.0, 1.0, uTransition);
    
    // Interactive mouse / touch look offsets
    float mouseYaw = (uMouse.x - 0.5) * 2.0 * PI * 0.45;
    float mousePitch = (uMouse.y - 0.5) * PI * 0.28;
    
    // Adjust Tiny Planet scale dynamically for portrait / mobile viewports
    bool isPortrait = uResolution.y > uResolution.x;
    float planetFovBase = isPortrait ? 1.65 : 1.30;
    
    // ── 1. Tiny Planet (Stereographic Fisheye Projection) ──
    float r = length(st);
    float fovPlanet = planetFovBase + (1.0 - t) * 0.40;
    float phiPlanet = 2.0 * atan(r * fovPlanet);
    float thetaPlanet = atan(st.y, st.x) + uTime * 0.035 + mouseYaw * 0.4;
    
    // Tiny Planet ray looking down from above into the planet center
    vec3 dirPlanet = vec3(
      sin(phiPlanet) * cos(thetaPlanet),
      -cos(phiPlanet),
      sin(phiPlanet) * sin(thetaPlanet)
    );
    dirPlanet = rotateX(0.22 + mousePitch * 0.25) * dirPlanet;
    
    // ── 2. Normal View (Rectilinear Architectural Perspective) ──
    float fovNormal = isPortrait ? 1.05 : 0.85; // Wider horizontal view on portrait mobile
    vec3 dirNormal = normalize(vec3(st.x * fovNormal, st.y * fovNormal, 1.0));
    
    float autoYaw = uTime * 0.012;
    dirNormal = rotateX(-mousePitch) * dirNormal;
    dirNormal = rotateY(mouseYaw + autoYaw - 0.20) * dirNormal;
    
    // ── 3. Seamless Ray Morph (Insta360 Unroll) ──
    vec3 rayDir = normalize(mix(dirPlanet, dirNormal, t));
    
    // Map 3D direction vector to Equirectangular UVs with float clamping against GPU edge errors
    float lon = atan(rayDir.z, rayDir.x);
    float lat = asin(clamp(rayDir.y, -0.9999, 0.9999));
    
    vec2 panoUv = vec2(
      (lon + PI) / (2.0 * PI),
      (lat + PI * 0.5) / PI
    );
    
    // Sample high-resolution real 360 photograph
    vec4 color = texture2D(uTexture, panoUv);
    
    // Color grade: lift shadow depth and add subtle contrast
    color.rgb = pow(color.rgb, vec3(0.96));
    
    // Subtle luxury film vignette
    float vig = 1.0 - smoothstep(0.45, 1.25, length(st) * 0.85);
    color.rgb *= (0.80 + vig * 0.20);
    
    // Content dark overlay (dimmed as user scrolls past hero)
    color.rgb = mix(color.rgb, vec3(0.024, 0.024, 0.031), uDarkness * 0.75);
    
    gl_FragColor = color;
  }
`;

export function InteractiveMeshBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const uniformsRef = useRef<any>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 });
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ── Three.js WebGL Setup ──
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const textureLoader = new THREE.TextureLoader();

    // Load authentic CC0 360° property panorama
    const initialTexture = textureLoader.load('/panoramas/illovo-beach-balcony.jpg', (tex) => {
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
    });

    // ── Shader Uniforms ──
    const uniforms = {
      uTexture: { value: initialTexture },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTransition: { value: 0.0 }, // 0 = Little Planet, 1 = Regular Frame
      uDarkness: { value: 0.0 },
    };
    uniformsRef.current = uniforms;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      depthWrite: false,
      depthTest: false,
    });

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
    scene.add(quad);

    // ── Animation Loop ──
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      const mouse = mouseRef.current;

      // Mouse/touch smoothing
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      uniforms.uTime.value = elapsed;
      uniforms.uMouse.value.set(mouse.x, mouse.y);

      // Hero scroll progress
      const scrollY = window.scrollY;
      const pinDistance = window.innerHeight * 1.1;
      
      // Calculate 0 -> 1 progress during the hero pin zone
      const heroUnrollProgress = Math.min(Math.max(scrollY / pinDistance, 0), 1);

      // Deep scroll darkness for subsequent sections
      const afterHeroScroll = Math.max(scrollY - pinDistance, 0);
      const fullContentHeight = document.documentElement.scrollHeight - window.innerHeight - pinDistance;
      const deepScroll = fullContentHeight > 0 ? Math.min(Math.max(afterHeroScroll / (fullContentHeight * 0.35), 0), 1) : 0;

      // Unroll transition driven naturally by scroll
      uniforms.uTransition.value = heroUnrollProgress;
      uniforms.uDarkness.value = deepScroll;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    // ── Robust Resize / Orientation Handlers ──
    const handleResize = () => {
      if (!rendererRef.current || !uniformsRef.current) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      rendererRef.current.setSize(width, height);
      rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      uniformsRef.current.uResolution.value.set(width, height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX / window.innerWidth;
      mouseRef.current.targetY = 1.0 - e.clientY / window.innerHeight;
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.targetX = e.touches[0].clientX / window.innerWidth;
        mouseRef.current.targetY = 1.0 - e.touches[0].clientY / window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('orientationchange', handleResize, { passive: true });
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      renderer.dispose();
      material.dispose();
      initialTexture.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
