import { useCarStore } from '../../store/useCarStore';
import { AMBIENT_LIGHTING_OPTIONS, HEADLIGHT_STYLE_OPTIONS } from '../../data/vehicleCatalog';
import { findOption } from '../../utils/pricing';

export default function CarLighting() {
  const headlights = useCarStore((s) => s.lighting.headlights);
  const taillights = useCarStore((s) => s.lighting.taillights);
  const interiorLight = useCarStore((s) => s.lighting.interiorLight);
  const headlightStyle = useCarStore((s) => s.headlightStyle);
  const ambientLighting = useCarStore((s) => s.interior.ambientLighting);

  const headOpt = findOption(HEADLIGHT_STYLE_OPTIONS, headlightStyle);
  const ambientOpt = findOption(AMBIENT_LIGHTING_OPTIONS, ambientLighting);

  return (
    <>
      <ambientLight intensity={0.28} color="#d8e0ec" />

      {/* Primary Overhead Studio Key Light */}
      <directionalLight
        position={[5.5, 9.5, 6.5]}
        intensity={2.2}
        color="#ffffff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={24}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
        shadow-bias={-0.0004}
      />

      {/* Cool Rim Light */}
      <spotLight
        position={[-6, 4.5, -5.5]}
        angle={0.55}
        penumbra={0.85}
        intensity={1.6}
        color="#c6d8ff"
      />

      {/* Warm Fill Accent */}
      <spotLight
        position={[6, 3.2, -3.5]}
        angle={0.6}
        penumbra={0.9}
        intensity={0.95}
        color="#ffe8d4"
      />

      {/* Active Headlight Projection Glow */}
      {headlights && (
        <pointLight
          position={[0, 0.56, 2.85]}
          intensity={1.6}
          distance={6}
          decay={2}
          color={headOpt.color}
        />
      )}

      {/* Active Taillight Floor Glow */}
      {taillights && (
        <pointLight
          position={[0, 0.6, -2.7]}
          intensity={1.1}
          distance={4.5}
          decay={2}
          color="#ef4444"
        />
      )}

      {/* Interior Cabin Ambient Glow */}
      {interiorLight && (
        <pointLight
          position={[0, 0.92, 0.12]}
          intensity={0.9}
          distance={2.2}
          decay={2}
          color={ambientOpt.hex}
        />
      )}
    </>
  );
}
