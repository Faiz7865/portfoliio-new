'use client'

import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { extend, useFrame } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";

const AnimatedCheckerboardMaterial = shaderMaterial(
  {
    uResolution: new THREE.Vector2(0, 0), // Set initial value
    uScale: new THREE.Vector2(40.0, 20.0),
    color1: new THREE.Color(0x5eca96),
    color2: new THREE.Color(0xc9f6b5),
    uTime: 0,
  },
  // Vertex shader
  `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment shader
  `
  uniform vec2 uResolution;
  uniform vec2 uScale;
  uniform vec3 color1;
  uniform vec3 color2;
  uniform float uTime;
  varying vec2 vUv;

  void main() {
    vec2 position = vUv * uResolution.xy / uScale;

    position.y -= uTime * 0.5;

    float checker = mod(floor(position.x) + floor(position.y), 2.0);

    vec3 color = mix(color1, color2, checker);

    gl_FragColor = vec4(color, 1.0);
  }
  `
);

extend({ AnimatedCheckerboardMaterial });

interface CheckerGroundProps {
  isRunning: boolean;
}

export const CheckerGround: React.FC<CheckerGroundProps> = ({ isRunning }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 600px)" });
  const materialRef = useRef<any>(null);
  const timeRef = useRef(0);
  const [resolution, setResolution] = useState(new THREE.Vector2(0, 0));

  useEffect(() => {
    const handleResize = () => {
      setResolution(new THREE.Vector2(window.innerWidth, window.innerHeight));
    };

    handleResize(); // Set initial resolution

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useFrame((_, delta) => {
    if (materialRef.current && isRunning) {
      timeRef.current += delta * (isMobile ? 25 : 15);
      materialRef.current.uTime = timeRef.current;
      materialRef.current.uResolution.set(resolution.x, resolution.y); // Update resolution
    }
  });

  return React.createElement(
    "mesh",
    { rotation: [4.725, 0, 0], position: [0, -0.5, 0] },
    React.createElement("planeGeometry", { args: [10, 10, 10, 10] }),
    React.createElement("animatedCheckerboardMaterial", {
      uScale: isMobile ? [5, 10] : [40, 20],
      ref: materialRef,
    })
  );
};
