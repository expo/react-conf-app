// HoloIridescent.tsx
import MaskedView from "@react-native-masked-view/masked-view";
import { Canvas, Fill, Shader, Skia, vec } from "@shopify/react-native-skia";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const { width } = Dimensions.get("window");
const HEIGHT = 600;

// Main component dimensions - change these to quickly resize the entire component
const CONTAINER_SIZE = 300;
const SHADER_SIZE = 230;
const LOGO_SIZE = 200;

// Calculated positioning values
const SHADER_OFFSET = (CONTAINER_SIZE - SHADER_SIZE) / 2;
const LOGO_OFFSET = (CONTAINER_SIZE - LOGO_SIZE) / 2;
const BORDER_RADIUS = SHADER_SIZE / 2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  maskedView: {
    width: width,
    height: HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  maskElement: {
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  layeredView: {
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: "transparent",
  },
  shaderBackground: {
    position: "absolute",
    width: SHADER_SIZE,
    height: SHADER_SIZE,
    borderRadius: BORDER_RADIUS, // Makes it perfectly circular
    overflow: "hidden",
    top: SHADER_OFFSET,
    left: SHADER_OFFSET,
    experimental_backgroundImage:
      "linear-gradient(45deg, #CABBF3 0%, #D9E7D5 33%, #FDE1CB 66%, #FEF5F000 100%)",
  },
  logoOverlay: {
    position: "absolute",
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    resizeMode: "contain",
    zIndex: 2,
    top: LOGO_OFFSET, // Center it automatically
    left: LOGO_OFFSET, // Center it automatically
  },
  holographicText: {
    fontSize: 80,
    fontWeight: "bold",
    color: "black", // This will be the mask shape
    textAlign: "center",
  },
});

// Gesture Container for 3D tilt effect
interface GestureContainerProps {
  children: React.ReactNode;
  width: number;
  height: number;
  maxAngle?: number;
  onRotationChange?: (rx: number, ry: number) => void;
}

function GestureContainer({
  children,
  width,
  height,
  maxAngle = 10,
  onRotationChange,
}: GestureContainerProps) {
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const lastHapticTime = useRef(0);

  // Helper functions for haptic feedback
  const triggerLightHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const triggerMediumHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const interpolateRotation = (
    value: number,
    size: number,
    isReverse = false,
  ) => {
    "worklet";
    return interpolate(
      value,
      [0, size],
      isReverse ? [maxAngle, -maxAngle] : [-maxAngle, maxAngle],
      Extrapolation.CLAMP,
    );
  };

  // Simplified - removed the problematic useAnimatedReaction for now

  const gesture = Gesture.Pan()
    .onBegin((event) => {
      // Light haptic feedback when starting interaction
      scheduleOnRN(triggerLightHaptic);

      const x = event.x || 0;
      const y = event.y || 0;
      rotateX.value = withTiming(interpolateRotation(y, height, true));
      rotateY.value = withTiming(interpolateRotation(x, width));
    })
    .onUpdate((event) => {
      const x = event.x || 0;
      const y = event.y || 0;
      rotateX.value = interpolateRotation(y, height, true);
      rotateY.value = interpolateRotation(x, width);

      // Throttled light haptic feedback during movement (every 100ms)
      const now = Date.now();
      if (now - lastHapticTime.current > 100) {
        scheduleOnRN(triggerLightHaptic);
        lastHapticTime.current = now;
      }
    })
    .onFinalize(() => {
      // Medium haptic feedback when finishing interaction
      scheduleOnRN(triggerMediumHaptic);

      rotateX.value = withTiming(0);
      rotateY.value = withTiming(0);
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 300 },
        { rotateX: `${rotateX.value}deg` },
        { rotateY: `${rotateY.value}deg` },
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          {
            height,
            width,
            backgroundColor: "transparent",
          },
          rStyle,
        ]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
}

// ---- SkSL (RN Skia) ----
const HOLO_SOURCE = Skia.RuntimeEffect.Make(`
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

// Reusable gradient component
function HolographicGradient() {
  // Create our own sheetAnim shared value (0..1)
  const sheetAnim = useSharedValue(0);

  // Continuous time value that never resets
  const time = useSharedValue(0);

  useEffect(() => {
    // Use a very long duration to minimize restart artifacts
    // The shader will handle the cycling naturally with modular arithmetic
    time.value = withRepeat(
      withTiming(1000, { duration: 1000000, easing: Easing.linear }), // Very long smooth animation
      -1,
    );

    // Start the sheet animation (you can customize this as needed)
    sheetAnim.value = withRepeat(
      withTiming(1, { duration: 8000, easing: Easing.inOut(Easing.sin) }),
      -1,
      true, // reverse on repeat for a back-and-forth effect
    );
  }, [time, sheetAnim]);

  // uniforms as a Reanimated derived value
  const uniforms = useDerivedValue(
    () => ({
      time: time.value, // Continuous time that never restarts
      sheetAnim: sheetAnim.value,
      size: vec(CONTAINER_SIZE, CONTAINER_SIZE), // Fixed size for the circular wheel
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

type MaskType = "react-logo" | "text" | "none" | "expo-wheel";

interface MaskedHolographicProps {
  maskType?: MaskType;
  text?: string;
}

export function PoweredByExpo2({
  maskType = "expo-wheel",
  text = "HOLO",
}: MaskedHolographicProps) {
  if (maskType === "none") {
    // Return the gradient without masking
    return (
      <View style={styles.container}>
        <HolographicGradient />
      </View>
    );
  }

  if (maskType === "expo-wheel") {
    // Layer the shader behind the PNG for wheel effect with 3D gesture
    return (
      <View style={styles.container}>
        <GestureContainer
          width={CONTAINER_SIZE}
          height={CONTAINER_SIZE}
          maxAngle={15}
        >
          <View style={styles.layeredView}>
            {/* Shader background extends as wheel/halo */}
            <View style={styles.shaderBackground}>
              <HolographicGradient />
            </View>
            {/* PNG overlay with transparent cutout */}
            <Image
              source={require("../../assets/images/sub-expo.png")}
              style={styles.logoOverlay}
            />
          </View>
        </GestureContainer>
      </View>
    );
  }

  const renderMaskElement = () => {
    switch (maskType) {
      case "text":
        return (
          <View style={styles.maskElement}>
            <Text style={styles.holographicText}>{text}</Text>
          </View>
        );
      default:
        return (
          <View style={styles.maskElement}>
            <Text style={styles.holographicText}>{text}</Text>
          </View>
        );
    }
  };

  return (
    <MaskedView style={styles.maskedView} maskElement={renderMaskElement()}>
      <HolographicGradient />
    </MaskedView>
  );
}
