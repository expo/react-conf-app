import { Canvas, Fill, Shader, Skia, vec } from "@shopify/react-native-skia";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";

const CONTAINER_SIZE = 260;

export function HolographicGradient() {
  const sheetAnim = useSharedValue(0);
  const time = useSharedValue(0);

  useEffect(() => {
    time.value = withRepeat(
      withTiming(1000, { duration: 1000000, easing: Easing.linear }),
      -1,
    );

    sheetAnim.value = withRepeat(
      withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [time, sheetAnim]);

  const uniforms = useDerivedValue(
    () => ({
      time: time.value,
      sheetAnim: sheetAnim.value,
      size: vec(CONTAINER_SIZE, CONTAINER_SIZE),
    }),
    [time, sheetAnim],
  );

  return (
    <Canvas style={{ width: CONTAINER_SIZE, height: CONTAINER_SIZE }}>
      <Fill>
        <Shader source={HOLO_SOURCE} uniforms={uniforms} />
      </Fill>
    </Canvas>
  );
}

export const HOLO_SOURCE = Skia.RuntimeEffect.Make(`
  uniform float time;      // seconds
  uniform float sheetAnim; // 0..1
  uniform vec2  size;      // canvas size
  
  // value noise + fbm
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
  float noise(vec2 p){
    vec2 i=floor(p), f=fract(p);
    float a=hash(i), b=hash(i+vec2(1,0)), c=hash(i+vec2(0,1)), d=hash(i+vec2(1,1));
    vec2 u=f*f*(3.0-2.0*f);
    return mix(mix(a,b,u.x), mix(c,d,u.x), u.y);
  }
  float fbm(vec2 p){
    float v=0.0, a=0.5;
    for(int i=0;i<4;i++){ v+=a*noise(p); p*=2.0; a*=0.5; }
    return v;
  }
  
  
  vec4 main(vec2 pos){
    vec2 uv = pos / size;           // 0..1
    vec2 c  = uv - 0.5;
  
    // soft pearly turbulence
    float n = fbm(uv*3.0 + time*0.05);
  
    // Vibrant shiny metallic holographic color palette
    vec3 color1 = vec3(0.95, 0.3, 0.7);    // Hot pink metallic
    vec3 color2 = vec3(1.0, 0.6, 0.1);     // Bright gold
    vec3 color3 = vec3(0.2, 0.5, 1.0);     // Electric blue
    vec3 color4 = vec3(0.8, 0.1, 0.9);     // Vibrant purple
    vec3 color5 = vec3(0.1, 0.9, 0.4);     // Emerald green
    vec3 color6 = vec3(0.9, 0.9, 0.2);     // Bright yellow
    vec3 color7 = vec3(1.0, 0.3, 0.3);     // Bright red
    vec3 color8 = vec3(0.3, 0.8, 0.9);     // Cyan blue
  
    // Create multiple noise layers for faster, more visible color mixing
    float n1 = fract(n + uv.x*0.8 + sheetAnim*0.7 + time*0.08);
    float n2 = fract(n*1.5 + uv.y*0.9 + time*0.12);
    float n3 = fract(n*2.1 + (uv.x + uv.y)*0.6 + sheetAnim*0.5 + time*0.06);
    
    // Multi-stage color blending for rich transitions
    vec3 colorA, colorB, colorC, colorD;
    
    // First layer - blend between 4 colors
    if (n1 < 0.25) {
      colorA = mix(color1, color2, n1 * 4.0);
    } else if (n1 < 0.5) {
      colorA = mix(color2, color3, (n1 - 0.25) * 4.0);
    } else if (n1 < 0.75) {
      colorA = mix(color3, color4, (n1 - 0.5) * 4.0);
    } else {
      colorA = mix(color4, color1, (n1 - 0.75) * 4.0);
    }
    
    // Second layer - blend between other 4 colors
    if (n2 < 0.25) {
      colorB = mix(color5, color6, n2 * 4.0);
    } else if (n2 < 0.5) {
      colorB = mix(color6, color7, (n2 - 0.25) * 4.0);
    } else if (n2 < 0.75) {
      colorB = mix(color7, color8, (n2 - 0.5) * 4.0);
    } else {
      colorB = mix(color8, color5, (n2 - 0.75) * 4.0);
    }
    
    // Combine the two layers with more pronounced color blending
    vec3 baseColor = mix(colorA, colorB, 0.4 + 0.6 * sin(n3 * 8.0 + time*0.3));
    
    // Enhanced multi-layer shimmer for ultra-shiny effect
    float shimmer1 = 0.5 + 0.5 * sin(dot(uv, vec2(15.0,10.0)) + n*8.0 + time*2.0);
    float shimmer2 = 0.5 + 0.5 * cos(dot(uv, vec2(8.0,12.0)) + n*5.0 + time*1.5);
    float shimmer3 = 0.5 + 0.5 * sin(dot(uv, vec2(20.0,6.0)) + n*10.0 + time*2.5);
    
    // Apply subtle shimmer layers that enhance without overpowering
    baseColor = mix(baseColor, baseColor * 1.3, shimmer1 * 0.2);
    baseColor = mix(baseColor, baseColor * 1.2, shimmer2 * 0.15);
    baseColor = mix(baseColor, vec3(1.0, 0.95, 0.9), shimmer3 * 0.1); // Subtle chrome highlights
  
    // More controlled highlight bloom
    float highlight = smoothstep(0.4, 0.9, fbm(uv*4.0 + time*0.08));
    float metallic = smoothstep(0.5, 0.8, fbm(uv*5.0 + time*0.10 + n*1.5));
    baseColor = mix(baseColor, baseColor * 1.4, 0.15*highlight); // Enhance existing colors
    baseColor = mix(baseColor, vec3(0.9, 0.85, 0.7), 0.08*metallic); // Subtle golden reflections
  
    // Create alpha gradient - stronger in center, fading to edges
    float d = distance(uv, vec2(0.5));
    float alpha = 1.0 - smoothstep(0.2, 0.6, d);
    
    // Add some noise-based transparency variation
    alpha *= 0.7 + 0.3 * (0.5 + 0.5 * n);
    
    // Gentle pulsing alpha based on sheetAnim
    alpha *= 0.8 + 0.2 * sin(sheetAnim * 6.28);
  
    return vec4(baseColor, alpha);
  }
  `)!;
