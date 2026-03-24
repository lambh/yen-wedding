import * as THREE from "three";

export const LiquidShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uHover: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    uRes: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uHover;
    uniform vec2 uMouse;
    uniform vec2 uRes;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      
      // Liquid-like distortion based on mouse and time
      float dist = distance(uv, uMouse);
      float strength = 0.05 * uHover;
      float wave = sin(dist * 10.0 - uTime * 2.0) * strength;
      
      vec2 distortedUv = uv + wave * (uv - uMouse);
      
      // Grain/Noise effect when not hovered
      float grain = fract(sin(dot(uv ,vec2(12.9898,78.233))) * 43758.5453) * 0.1;
      
      vec4 color = texture2D(tDiffuse, distortedUv);
      
      // Blend noise and photo
      float reveal = smoothstep(0.4, 0.0, dist * (1.0 - uHover * 0.5));
      vec4 finalColor = mix(color * (0.5 + grain), color, uHover);
      
      gl_FragColor = finalColor;
    }
  `,
};
