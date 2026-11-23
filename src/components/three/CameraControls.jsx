import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import gsap from 'gsap';
import { CAMERA_PRESETS } from '../../data/vehicleCatalog';
import { useUIStore } from '../../store/useUIStore';

export default function CameraControls() {
  const controlsRef = useRef(null);
  const { camera } = useThree();

  const cameraPreset = useUIStore((s) => s.cameraPreset);
  const cameraResetTrigger = useUIStore((s) => s.cameraResetTrigger);
  const autoRotate = useUIStore((s) => s.autoRotate);

  useEffect(() => {
    const preset = CAMERA_PRESETS[cameraPreset] || CAMERA_PRESETS.cinematic;
    const controls = controlsRef.current;

    gsap.killTweensOf(camera.position);
    gsap.to(camera.position, {
      x: preset.position[0],
      y: preset.position[1],
      z: preset.position[2],
      duration: 1.05,
      ease: 'power3.inOut',
      onUpdate: () => {
        if (controls) controls.update();
      },
    });

    if (controls) {
      gsap.killTweensOf(controls.target);
      gsap.to(controls.target, {
        x: preset.target[0],
        y: preset.target[1],
        z: preset.target[2],
        duration: 1.05,
        ease: 'power3.inOut',
        onUpdate: () => controls.update(),
      });
    }

    if (preset.fov && camera.fov !== preset.fov) {
      gsap.killTweensOf(camera);
      gsap.to(camera, {
        fov: preset.fov,
        duration: 0.9,
        ease: 'power2.inOut',
        onUpdate: () => camera.updateProjectionMatrix(),
      });
    }
  }, [cameraPreset, cameraResetTrigger, camera]);

  const isInterior = cameraPreset === 'interior';

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.07}
      enablePan={false}
      autoRotate={autoRotate && !isInterior}
      autoRotateSpeed={1.1}
      minDistance={isInterior ? 0.25 : 2.6}
      maxDistance={isInterior ? 1.8 : 10.5}
      minPolarAngle={isInterior ? 0.45 : 0.12}
      maxPolarAngle={isInterior ? Math.PI / 1.7 : Math.PI / 2 - 0.03}
    />
  );
}
