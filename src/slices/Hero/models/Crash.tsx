'use client';

import { useRef, useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { useGLTF, useAnimations, useTexture } from '@react-three/drei';
import { useControls } from 'leva';
import { CheckerGround } from './CheckerGround';
import useClickToToggle from '../hooks/useClickToToggle';
import { GroupProps } from '@react-three/fiber';

interface CrashProps extends GroupProps {}

const createCustomMaterial = (
  color: string,
  jitterLevel: number,
  texture?: THREE.Texture
): THREE.MeshStandardMaterial => {
  const material = new THREE.MeshStandardMaterial({
    color,
    map: texture || null,
    // Use 'any' to bypass TypeScript checks for this specific property
    onBeforeCompile: (shader: any) => {
      shader.uniforms.uJitterLevel = { value: jitterLevel };

      shader.vertexShader = `
        uniform float uJitterLevel;
        ${shader.vertexShader}
      `.replace(
        `#include <project_vertex>`,
        `
          vec4 mvPosition = modelViewMatrix * vec4( transformed, 1.0 );
          gl_Position = projectionMatrix * mvPosition;

          gl_Position.xy /= gl_Position.w;
          gl_Position.xy = floor(gl_Position.xy * uJitterLevel) / uJitterLevel * gl_Position.w;
        `
      );

      shader.fragmentShader = shader.fragmentShader.replace(
        `vec4 diffuseColor = vec4( diffuse, opacity );`,
        `
         vec4 diffuseColor = vec4( diffuse, opacity );
         diffuseColor.rgb *= 0.8;
        `
      );
    },
  } as any); // Cast to 'any' to avoid the TypeScript error

  return material;
};

const Crash: React.FC<CrashProps> = (props) => {
  const [isRunning, setIsRunning] = useState(false);
  const [clickDisabled, setClickDisabled] = useState(false);

  const group = useRef<THREE.Group>(null);
  const { nodes, animations } = useGLTF('/crash-bandicoot.glb') as { nodes: any; animations: any };
  const { actions } = useAnimations(animations, group);

  useClickToToggle(setIsRunning, setClickDisabled, clickDisabled);

  const [crashTextureOne, crashTextureTwo, crashTextureThree] = useTexture([
    '/textures/texture.png',
    '/textures/texture-1.png',
    '/textures/texture-2.png',
  ]);

  const { jitterLevel } = useControls('Jitter Setting', {
    jitterLevel: {
      value: 310,
      min: 30,
      max: 650,
    },
  });

  const { enableTexture, tFlipY } = useControls('Texture Settings', {
    enableTexture: true,
    tFlipY: true,
  });

  const crashMaterials = useMemo(() => {
    const baseColor = '#ffffff';
    return [
      createCustomMaterial(baseColor, jitterLevel, enableTexture ? crashTextureOne : undefined),
      createCustomMaterial(baseColor, jitterLevel, enableTexture ? crashTextureTwo : undefined),
      createCustomMaterial(baseColor, jitterLevel, enableTexture ? crashTextureThree : undefined),
      createCustomMaterial(baseColor, jitterLevel),
    ];
  }, [jitterLevel, enableTexture, crashTextureOne, crashTextureTwo, crashTextureThree]);

  useEffect(() => {
    const textures = [crashTextureOne, crashTextureTwo, crashTextureThree];

    textures.forEach((texture) => {
      if (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.flipY = !tFlipY;
        texture.needsUpdate = true;
      }
    });
  }, [tFlipY, crashTextureOne, crashTextureTwo, crashTextureThree]);

  useEffect(() => {
    if (isRunning) {
      actions?.['idle']?.fadeOut(0.4);
      actions?.['run']?.reset().fadeIn(0.4).play();
    } else {
      actions?.['run']?.fadeOut(0.4);
      actions?.['idle']?.reset().fadeIn(0.4).play();
    }
  }, [isRunning, actions]);

  return (
    <group position={[0, -0.5, 0]} ref={group} {...props} dispose={null}>
      <CheckerGround isRunning={isRunning} />
      <group name="Scene">
        <group name="Armature" rotation={[Math.PI / 2, 0, 0]} scale={0.001}>
          <skinnedMesh
            castShadow
            name="Material2"
            geometry={nodes.Material2.geometry}
            material={crashMaterials[2]}
            skeleton={nodes.Material2.skeleton}
          />
          <skinnedMesh
            castShadow
            name="Material2001"
            geometry={nodes.Material2001.geometry}
            material={crashMaterials[0]}
            skeleton={nodes.Material2001.skeleton}
          />
          <skinnedMesh
            castShadow
            name="Material2002"
            geometry={nodes.Material2002.geometry}
            material={crashMaterials[1]}
            skeleton={nodes.Material2002.skeleton}
          />
          <skinnedMesh
            castShadow
            name="Material2003"
            geometry={nodes.Material2003.geometry}
            material={crashMaterials[3]}
            skeleton={nodes.Material2003.skeleton}
          />
          <primitive object={nodes.mixamorigHips} />
        </group>
      </group>
    </group>
  );
};

export default Crash;
