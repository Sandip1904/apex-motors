import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import { useUIStore } from '../../store/useUIStore';

/**
 * Self-contained dark luxury showroom studio environment using procedural Lightformers.
 * Requires zero external HDRI network fetches.
 */
export default function CarEnvironment() {
  const quality = useUIStore((s) => s.performanceQuality);

  return (
    <>
      <color attach="background" args={['#07080b']} />
      <fog attach="fog" args={['#07080b', 11, 26]} />

      {/* Procedural Studio Softboxes for crisp automotive paint reflections */}
      <Environment resolution={quality === 'high' ? 256 : 128} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.4}
          position={[0, 7, 0]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[10, 4.5, 1]}
          color="#f8fafc"
        />
        <Lightformer
          form="rect"
          intensity={1.7}
          position={[6, 2.8, 2]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[8, 1.4, 1]}
          color="#dbeafe"
        />
        <Lightformer
          form="rect"
          intensity={1.6}
          position={[-6, 2.8, -1]}
          rotation={[0, Math.PI / 2, 0]}
          scale={[8, 1.4, 1]}
          color="#f1f5f9"
        />
        <Lightformer
          form="ring"
          intensity={1.2}
          position={[0, 3.5, -7]}
          scale={5}
          color="#fca5a5"
        />
      </Environment>

      {/* Showroom Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.002, 0]} receiveShadow>
        <circleGeometry args={[22, 64]} />
        <meshStandardMaterial color="#0b0d12" roughness={0.34} metalness={0.55} />
      </mesh>

      {/* Subtle Turntable Ring */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[2.92, 2.96, 64]} />
        <meshBasicMaterial color="#d92638" transparent opacity={0.45} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]}>
        <ringGeometry args={[3.45, 3.47, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </mesh>

      {/* Grounded Contact Shadows */}
      <ContactShadows
        position={[0, 0.002, 0]}
        opacity={0.72}
        scale={11}
        blur={2.1}
        far={3.5}
        resolution={quality === 'high' ? 512 : 256}
        color="#000000"
      />
    </>
  );
}
