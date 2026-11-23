import { useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { useCarStore } from '../../store/useCarStore';

/**
 * Orchestrates smooth GSAP pivot animations for doors, hood, engine cover,
 * blinking indicators, and subtle engine idle vibration. Prevents conflicting tweens.
 */
export default function CarAnimations({
  carRootRef,
  driverDoorRef,
  passengerDoorRef,
  hoodRef,
  engineCoverRef,
  indicatorMatRef,
}) {
  const driverDoor = useCarStore((s) => s.animations.driverDoor);
  const passengerDoor = useCarStore((s) => s.animations.passengerDoor);
  const hood = useCarStore((s) => s.animations.hood);
  const engineCover = useCarStore((s) => s.animations.engineCover);
  const engineRunning = useCarStore((s) => s.animations.engineRunning);
  const indicators = useCarStore((s) => s.lighting.indicators);

  // Driver dihedral door animation
  useEffect(() => {
    const group = driverDoorRef?.current;
    if (!group) return;
    gsap.killTweensOf(group.rotation);
    gsap.to(group.rotation, {
      y: driverDoor ? -0.95 : 0,
      z: driverDoor ? -0.35 : 0,
      duration: 0.9,
      ease: 'power3.inOut',
    });
  }, [driverDoor, driverDoorRef]);

  // Passenger dihedral door animation
  useEffect(() => {
    const group = passengerDoorRef?.current;
    if (!group) return;
    gsap.killTweensOf(group.rotation);
    gsap.to(group.rotation, {
      y: passengerDoor ? 0.95 : 0,
      z: passengerDoor ? 0.35 : 0,
      duration: 0.9,
      ease: 'power3.inOut',
    });
  }, [passengerDoor, passengerDoorRef]);

  // Front hood animation
  useEffect(() => {
    const group = hoodRef?.current;
    if (!group) return;
    gsap.killTweensOf(group.rotation);
    gsap.to(group.rotation, {
      x: hood ? -0.68 : 0,
      duration: 0.85,
      ease: 'power2.inOut',
    });
  }, [hood, hoodRef]);

  // Rear engine cover animation
  useEffect(() => {
    const group = engineCoverRef?.current;
    if (!group) return;
    gsap.killTweensOf(group.rotation);
    gsap.to(group.rotation, {
      x: engineCover ? 0.72 : 0,
      duration: 0.95,
      ease: 'power2.inOut',
    });
  }, [engineCover, engineCoverRef]);

  // Subtle idle vibration & turn-signal blink loop
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (indicatorMatRef?.current) {
      indicatorMatRef.current.emissiveIntensity = indicators ? (Math.sin(t * 7.5) > 0 ? 3.8 : 0.1) : 0;
    }
    if (carRootRef?.current) {
      if (engineRunning) {
        carRootRef.current.position.y = Math.sin(t * 42) * 0.0022;
      } else if (carRootRef.current.position.y !== 0) {
        carRootRef.current.position.y = 0;
      }
    }
  });

  return null;
}
