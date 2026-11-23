import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useCarStore } from '../../store/useCarStore';
import {
  VEHICLE_INFO,
  PAINT_COLORS,
  PAINT_FINISHES,
  WHEEL_OPTIONS,
  WHEEL_FINISHES,
  BRAKE_CALIPERS,
  WINDOW_TINT_OPTIONS,
  HEADLIGHT_STYLE_OPTIONS,
  SEAT_COLOR_OPTIONS,
  LEATHER_MATERIAL_OPTIONS,
  DASHBOARD_OPTIONS,
  STEERING_WHEEL_OPTIONS,
  CARBON_TRIM_OPTIONS,
  STITCHING_OPTIONS,
  AMBIENT_LIGHTING_OPTIONS,
} from '../../data/vehicleCatalog';
import { findOption } from '../../utils/pricing';
import CarAnimations from './CarAnimations';

function createBodyProfileGeometry() {
  const shape = new THREE.Shape();
  shape.moveTo(-2.22, 0.24);
  shape.lineTo(-2.12, 0.56);
  shape.quadraticCurveTo(-1.7, 0.72, -1.15, 0.74);
  shape.quadraticCurveTo(-0.55, 1.18, 0.15, 1.16);
  shape.quadraticCurveTo(0.95, 1.04, 1.65, 0.88);
  shape.lineTo(2.2, 0.76);
  shape.lineTo(2.26, 0.34);
  shape.lineTo(1.98, 0.22);
  shape.lineTo(-2.05, 0.2);
  shape.closePath();

  const geom = new THREE.ExtrudeGeometry(shape, {
    depth: 1.72,
    bevelEnabled: true,
    bevelThickness: 0.14,
    bevelSize: 0.08,
    bevelSegments: 4,
  });
  geom.center();
  // Rotate so car faces +Z (length along Z, width along X)
  geom.rotateY(-Math.PI / 2);
  return geom;
}

function WheelAssembly({ position, side, wheelStyle, rimMaterial, tireMaterial, caliperMaterial, rotorMaterial }) {
  const spokeCount = wheelStyle?.spokes || 5;
  const style = wheelStyle?.style || 'blade';
  const angles = useMemo(
    () => Array.from({ length: spokeCount }, (_, i) => (i / spokeCount) * Math.PI * 2),
    [spokeCount]
  );

  const isLeft = side === 'left';
  const offsetSign = isLeft ? -1 : 1;

  return (
    <group position={position} name={`Wheel_${side}`}>
      {/* Tire */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow receiveShadow material={tireMaterial} name="Tire">
        <cylinderGeometry args={[0.37, 0.37, 0.31, 36]} />
      </mesh>
      {/* Tire outer sidewall bevel ring */}
      <mesh
        position={[offsetSign * 0.14, 0, 0]}
        rotation={[0, Math.PI / 2, 0]}
        material={rimMaterial}
        name="RimBarrel"
      >
        <torusGeometry args={[0.255, 0.022, 12, 32]} />
      </mesh>
      {/* Rim inner barrel */}
      <mesh rotation={[0, 0, Math.PI / 2]} material={rimMaterial}>
        <cylinderGeometry args={[0.25, 0.25, 0.27, 28]} />
      </mesh>

      {/* Center hub & lock nut */}
      <mesh position={[offsetSign * 0.135, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={rimMaterial}>
        <cylinderGeometry args={[0.062, 0.072, 0.04, 18]} />
      </mesh>
      <mesh position={[offsetSign * 0.16, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={caliperMaterial}>
        <cylinderGeometry args={[0.028, 0.028, 0.022, 6]} />
      </mesh>

      {/* Spokes (6 distinct procedural designs) */}
      <group position={[offsetSign * 0.12, 0, 0]}>
        {style === 'disc' && (
          <mesh rotation={[0, 0, Math.PI / 2]} material={rimMaterial}>
            <cylinderGeometry args={[0.23, 0.23, 0.018, 24]} />
          </mesh>
        )}
        {angles.map((angle, idx) => (
          <group key={idx} rotation={[angle, 0, 0]}>
            {style === 'y-spoke' ? (
              <>
                <mesh position={[0, 0.135, 0.022]} rotation={[0.18, 0, 0]} material={rimMaterial}>
                  <boxGeometry args={[0.024, 0.21, 0.018]} />
                </mesh>
                <mesh position={[0, 0.135, -0.022]} rotation={[-0.18, 0, 0]} material={rimMaterial}>
                  <boxGeometry args={[0.024, 0.21, 0.018]} />
                </mesh>
              </>
            ) : style === 'turbine' ? (
              <mesh position={[0, 0.13, 0.015]} rotation={[0.38, 0.22 * offsetSign, 0]} material={rimMaterial}>
                <boxGeometry args={[0.02, 0.22, 0.032]} />
              </mesh>
            ) : style === 'mesh' ? (
              <mesh position={[0, 0.135, 0]} rotation={[0.24, 0, 0]} material={rimMaterial}>
                <boxGeometry args={[0.018, 0.22, 0.015]} />
              </mesh>
            ) : style === 'monoblock' ? (
              <mesh position={[0, 0.13, 0]} material={rimMaterial}>
                <boxGeometry args={[0.028, 0.22, 0.04]} />
              </mesh>
            ) : (
              <mesh position={[0, 0.13, 0]} material={rimMaterial}>
                <boxGeometry args={[0.025, 0.22, 0.03]} />
              </mesh>
            )}
          </group>
        ))}
      </group>

      {/* Carbon-Ceramic Brake Rotor */}
      <mesh position={[offsetSign * 0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]} material={rotorMaterial}>
        <cylinderGeometry args={[0.2, 0.2, 0.028, 28]} />
      </mesh>

      {/* Brake Caliper */}
      <mesh
        position={[offsetSign * 0.06, 0.04, -0.13]}
        material={caliperMaterial}
        name="BrakeCaliper"
      >
        <boxGeometry args={[0.075, 0.16, 0.095]} />
      </mesh>
    </group>
  );
}

/**
 * Renders a loaded external GLB hypercar if present in /public/models/apex-r01.glb,
 * otherwise renders the sculpted procedural APEX R-01 demonstration vehicle with
 * full material customization and animated mechanical pivots.
 */
export default function CarModel() {
  const paintId = useCarStore((s) => s.paint);
  const customPaintHex = useCarStore((s) => s.customPaintHex);
  const paintFinishId = useCarStore((s) => s.paintFinish);
  const wheelsId = useCarStore((s) => s.wheels);
  const wheelFinishId = useCarStore((s) => s.wheelFinish);
  const brakeCalipersId = useCarStore((s) => s.brakeCalipers);
  const spoilerId = useCarStore((s) => s.spoiler);
  const sideMirrorsId = useCarStore((s) => s.sideMirrors);
  const bodyKitId = useCarStore((s) => s.bodyKit);
  const frontSplitterId = useCarStore((s) => s.frontSplitter);
  const rearDiffuserId = useCarStore((s) => s.rearDiffuser);
  const windowTintId = useCarStore((s) => s.windowTint);
  const headlightStyleId = useCarStore((s) => s.headlightStyle);
  const interior = useCarStore((s) => s.interior);
  const lighting = useCarStore((s) => s.lighting);
  const setModelSource = useCarStore((s) => s.setModelSource);
  const setModelLoadError = useCarStore((s) => s.setModelLoadError);

  const [glbScene, setGlbScene] = useState(null);

  // Refs for GSAP animation controller
  const carRootRef = useRef(null);
  const driverDoorRef = useRef(null);
  const passengerDoorRef = useRef(null);
  const hoodRef = useRef(null);
  const engineCoverRef = useRef(null);
  const indicatorMatRef = useRef(null);

  // Create persistent reusable Three.js materials once (disposed on unmount)
  const materials = useMemo(() => {
    const body = new THREE.MeshPhysicalMaterial({
      color: '#c8102e',
      metalness: 0.75,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      envMapIntensity: 1.4,
    });
    const carbon = new THREE.MeshPhysicalMaterial({
      color: '#1b1e24',
      metalness: 0.45,
      roughness: 0.24,
      clearcoat: 0.85,
      clearcoatRoughness: 0.12,
    });
    const matteCarbon = new THREE.MeshStandardMaterial({
      color: '#1a1c21',
      metalness: 0.3,
      roughness: 0.62,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: '#2b323d',
      transparent: true,
      opacity: 0.56,
      roughness: 0.06,
      metalness: 0.15,
      reflectivity: 0.95,
      clearcoat: 1,
    });
    const tire = new THREE.MeshStandardMaterial({
      color: '#14161a',
      roughness: 0.86,
      metalness: 0.06,
    });
    const rim = new THREE.MeshStandardMaterial({
      color: '#cfd5de',
      metalness: 0.92,
      roughness: 0.22,
    });
    const caliper = new THREE.MeshStandardMaterial({
      color: '#d92638',
      metalness: 0.4,
      roughness: 0.28,
    });
    const rotor = new THREE.MeshStandardMaterial({
      color: '#525864',
      metalness: 0.85,
      roughness: 0.38,
    });
    const headlight = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      emissive: '#f0f7ff',
      emissiveIntensity: 3.2,
      roughness: 0.1,
    });
    const taillight = new THREE.MeshStandardMaterial({
      color: '#7f1d1d',
      emissive: '#ef4444',
      emissiveIntensity: 3.0,
      roughness: 0.15,
    });
    const indicator = new THREE.MeshStandardMaterial({
      color: '#78350f',
      emissive: '#f59e0b',
      emissiveIntensity: 0,
      roughness: 0.2,
    });
    const seat = new THREE.MeshStandardMaterial({
      color: '#14161a',
      roughness: 0.55,
      metalness: 0.05,
    });
    const dashboard = new THREE.MeshStandardMaterial({
      color: '#181b21',
      roughness: 0.6,
      metalness: 0.12,
    });
    const steering = new THREE.MeshStandardMaterial({
      color: '#16181d',
      roughness: 0.45,
      metalness: 0.25,
    });
    const interiorTrim = new THREE.MeshStandardMaterial({
      color: '#252830',
      roughness: 0.3,
      metalness: 0.55,
    });
    const stitching = new THREE.MeshStandardMaterial({
      color: '#d92638',
      roughness: 0.5,
      metalness: 0.1,
    });
    const ambientStrip = new THREE.MeshStandardMaterial({
      color: '#ef4444',
      emissive: '#ef4444',
      emissiveIntensity: 2.2,
      roughness: 0.2,
    });
    const engineBlock = new THREE.MeshStandardMaterial({
      color: '#8e96a3',
      metalness: 0.9,
      roughness: 0.26,
    });

    return {
      body,
      carbon,
      matteCarbon,
      glass,
      tire,
      rim,
      caliper,
      rotor,
      headlight,
      taillight,
      indicator,
      seat,
      dashboard,
      steering,
      interiorTrim,
      stitching,
      ambientStrip,
      engineBlock,
    };
  }, []);

  indicatorMatRef.current = materials.indicator;

  const bodyGeometry = useMemo(() => createBodyProfileGeometry(), []);

  // Dispose geometries and materials cleanly on unmount
  useEffect(() => {
    return () => {
      bodyGeometry.dispose();
      Object.values(materials).forEach((m) => m.dispose());
    };
  }, [bodyGeometry, materials]);

  // Attempt optional GLB load from /models/apex-r01.glb without breaking if absent
  useEffect(() => {
    let active = true;
    const checkAndLoadGlb = async () => {
      try {
        const res = await fetch(VEHICLE_INFO.glbAssetPath, { method: 'HEAD' });
        const contentType = res.headers.get('content-type') || '';
        if (!res.ok || contentType.includes('text/html')) {
          if (active) {
            setGlbScene(null);
            setModelSource('procedural');
            setModelLoadError(null);
          }
          return;
        }
        const loader = new GLTFLoader();
        loader.load(
          VEHICLE_INFO.glbAssetPath,
          (gltf) => {
            if (!active) return;
            gltf.scene.traverse((node) => {
              if (!node.isMesh) return;
              node.castShadow = true;
              node.receiveShadow = true;
              const n = (node.name || '').toLowerCase();
              const m = (node.material?.name || '').toLowerCase();
              if (n.includes('body') || m.includes('paint') || m.includes('body')) {
                node.material = materials.body;
              } else if (n.includes('caliper')) {
                node.material = materials.caliper;
              } else if (n.includes('rim') || n.includes('wheel')) {
                node.material = materials.rim;
              } else if (n.includes('glass') || n.includes('window')) {
                node.material = materials.glass;
              } else if (n.includes('seat')) {
                node.material = materials.seat;
              } else if (n.includes('dash')) {
                node.material = materials.dashboard;
              } else if (n.includes('steer')) {
                node.material = materials.steering;
              }
            });
            setGlbScene(gltf.scene);
            setModelSource('glb');
            setModelLoadError(null);
          },
          undefined,
          () => {
            if (active) {
              setGlbScene(null);
              setModelSource('procedural');
              setModelLoadError('Custom GLB could not be parsed; using procedural demonstration model.');
            }
          }
        );
      } catch {
        if (active) {
          setGlbScene(null);
          setModelSource('procedural');
        }
      }
    };
    checkAndLoadGlb();
    return () => {
      active = false;
    };
  }, [materials, setModelSource, setModelLoadError]);

  // Synchronize centralized material properties whenever configuration updates
  useEffect(() => {
    const paint = findOption(PAINT_COLORS, paintId);
    const finish = findOption(PAINT_FINISHES, paintFinishId);
    const wheelFin = findOption(WHEEL_FINISHES, wheelFinishId);
    const caliperOpt = findOption(BRAKE_CALIPERS, brakeCalipersId);
    const tintOpt = findOption(WINDOW_TINT_OPTIONS, windowTintId);
    const headOpt = findOption(HEADLIGHT_STYLE_OPTIONS, headlightStyleId);
    const seatOpt = findOption(SEAT_COLOR_OPTIONS, interior.seatColor);
    const leatherOpt = findOption(LEATHER_MATERIAL_OPTIONS, interior.leatherMaterial);
    const dashOpt = findOption(DASHBOARD_OPTIONS, interior.dashboard);
    const steerOpt = findOption(STEERING_WHEEL_OPTIONS, interior.steeringWheel);
    const trimOpt = findOption(CARBON_TRIM_OPTIONS, interior.carbonTrim);
    const stitchOpt = findOption(STITCHING_OPTIONS, interior.stitching);
    const ambientOpt = findOption(AMBIENT_LIGHTING_OPTIONS, interior.ambientLighting);

    const activeHex = paintId === 'custom' ? customPaintHex : paint.hex;
    materials.body.color.set(activeHex);
    materials.body.roughness = finish.roughness;
    materials.body.metalness = finish.metalness;
    materials.body.clearcoat = finish.clearcoat;
    materials.body.clearcoatRoughness = finish.clearcoatRoughness;
    materials.body.needsUpdate = true;

    materials.rim.color.set(wheelFin.hex);
    materials.rim.roughness = wheelFin.roughness;
    materials.rim.metalness = wheelFin.metalness;

    materials.caliper.color.set(caliperOpt.hex);

    materials.glass.color.set(tintOpt.color);
    materials.glass.opacity = tintOpt.opacity;

    materials.headlight.color.set(headOpt.color);
    materials.headlight.emissive.set(headOpt.accent);
    materials.headlight.emissiveIntensity = lighting.headlights ? 3.5 : 0.1;

    materials.taillight.emissiveIntensity = lighting.taillights ? 3.2 : 0.1;

    materials.seat.color.set(seatOpt.hex);
    materials.seat.roughness = leatherOpt.roughness;
    materials.seat.metalness = leatherOpt.metalness;

    materials.dashboard.color.set(dashOpt.hex);
    materials.steering.color.set(steerOpt.hex);
    materials.interiorTrim.color.set(trimOpt.hex);
    materials.interiorTrim.roughness = trimOpt.roughness;
    materials.stitching.color.set(stitchOpt.hex);

    materials.ambientStrip.color.set(ambientOpt.hex);
    materials.ambientStrip.emissive.set(ambientOpt.hex);
    materials.ambientStrip.emissiveIntensity = lighting.interiorLight ? 2.4 : 0.05;
  }, [
    paintId,
    customPaintHex,
    paintFinishId,
    wheelFinishId,
    brakeCalipersId,
    windowTintId,
    headlightStyleId,
    interior,
    lighting,
    materials,
  ]);

  const activeWheelStyle = findOption(WHEEL_OPTIONS, wheelsId);
  const mirrorMaterial =
    sideMirrorsId === 'exposed-carbon'
      ? materials.carbon
      : sideMirrorsId === 'matte-carbon'
      ? materials.matteCarbon
      : sideMirrorsId === 'camera-pods'
      ? materials.carbon
      : materials.body;

  const isWidebody = bodyKitId === 'track-rs';
  const isCarbonPack = bodyKitId === 'carbon-pack' || isWidebody;

  return (
    <group ref={carRootRef} position={[0, 0, 0]} name="APEX_R01_Root">
      <CarAnimations
        carRootRef={carRootRef}
        driverDoorRef={driverDoorRef}
        passengerDoorRef={passengerDoorRef}
        hoodRef={hoodRef}
        engineCoverRef={engineCoverRef}
        indicatorMatRef={indicatorMatRef}
      />

      {glbScene ? (
        <primitive object={glbScene} />
      ) : (
        <group name="Procedural_APEX_R01">
          {/* Main Sculpted Chassis Body */}
          <mesh
            geometry={bodyGeometry}
            material={materials.body}
            position={[0, 0.62, 0]}
            castShadow
            receiveShadow
            name="Body"
          />

          {/* Sculpted Side Fenders / Widebody Flares */}
          {[-1, 1].map((side) => (
            <group key={side} name={side < 0 ? 'LeftFender' : 'RightFender'}>
              <mesh
                position={[side * (isWidebody ? 0.98 : 0.91), 0.5, 1.38]}
                material={materials.body}
                castShadow
              >
                <boxGeometry args={[isWidebody ? 0.24 : 0.16, 0.34, 1.02]} />
              </mesh>
              <mesh
                position={[side * (isWidebody ? 1.0 : 0.93), 0.54, -1.35]}
                material={materials.body}
                castShadow
              >
                <boxGeometry args={[isWidebody ? 0.28 : 0.18, 0.42, 1.15]} />
              </mesh>
              {/* Side Skirts */}
              <mesh
                position={[side * (isWidebody ? 1.02 : 0.94), 0.22, 0]}
                material={isCarbonPack ? materials.carbon : materials.body}
                castShadow
              >
                <boxGeometry args={[isWidebody ? 0.16 : 0.1, 0.09, 2.15]} />
              </mesh>
              {/* Side Aero Intake Blade */}
              <mesh
                position={[side * 0.93, 0.56, -0.58]}
                rotation={[0, side * 0.12, 0]}
                material={materials.carbon}
              >
                <boxGeometry args={[0.08, 0.26, 0.56]} />
              </mesh>
            </group>
          ))}

          {/* Underbody Carbon Floorpan */}
          <mesh position={[0, 0.17, 0]} material={materials.matteCarbon} receiveShadow>
            <boxGeometry args={[1.82, 0.06, 4.18]} />
          </mesh>

          {/* Front Bumper & Intake Grille */}
          <group position={[0, 0.35, 2.16]} name="FrontBumper">
            <mesh material={materials.carbon} castShadow>
              <boxGeometry args={[1.76, 0.22, 0.18]} />
            </mesh>
            {/* Front Splitter */}
            <mesh
              position={[0, -0.14, frontSplitterId === 'standard' ? 0.08 : 0.18]}
              material={materials.carbon}
              castShadow
              name="FrontSplitter"
            >
              <boxGeometry
                args={[
                  frontSplitterId === 'standard' ? 1.84 : 2.02,
                  0.04,
                  frontSplitterId === 'standard' ? 0.26 : 0.42,
                ]}
              />
            </mesh>
            {/* Track Canards */}
            {frontSplitterId === 'track-canards' &&
              [-1, 1].map((s) => (
                <mesh
                  key={s}
                  position={[s * 0.97, -0.02, 0.05]}
                  rotation={[0.2, s * 0.25, -s * 0.2]}
                  material={materials.carbon}
                >
                  <boxGeometry args={[0.16, 0.03, 0.24]} />
                </mesh>
              ))}
          </group>

          {/* Rear Bumper & Venturi Diffuser */}
          <group position={[0, 0.38, -2.18]} name="RearBumper">
            <mesh material={materials.carbon} castShadow>
              <boxGeometry args={[1.82, 0.34, 0.16]} />
            </mesh>
            {/* Dual Center Titanium Exhausts */}
            {[-0.22, 0.22].map((xPos, i) => (
              <mesh key={i} position={[xPos, 0.08, -0.08]} rotation={[Math.PI / 2, 0, 0]} material={materials.engineBlock}>
                <cylinderGeometry args={[0.055, 0.062, 0.16, 16]} />
              </mesh>
            ))}
            {/* Rear Diffuser Fins */}
            <group position={[0, -0.14, -0.04]} name="RearDiffuser">
              <mesh material={materials.carbon}>
                <boxGeometry
                  args={[1.74, 0.08, rearDiffuserId === 'standard' ? 0.22 : 0.36]}
                />
              </mesh>
              {[-0.65, -0.35, 0, 0.35, 0.65].map((fx, i) => (
                <mesh key={i} position={[fx, -0.04, -0.06]} material={materials.carbon}>
                  <boxGeometry
                    args={[
                      0.03,
                      rearDiffuserId === 'race-finned' ? 0.2 : 0.12,
                      rearDiffuserId === 'standard' ? 0.22 : 0.38,
                    ]}
                  />
                </mesh>
              ))}
            </group>
          </group>

          {/* Rear Spoiler Configurations */}
          <group position={[0, 0.95, -2.02]} name="Spoiler">
            {spoilerId === 'active-flush' && (
              <>
                <mesh position={[0, 0.08, 0]} rotation={[0.08, 0, 0]} material={materials.body} castShadow>
                  <boxGeometry args={[1.56, 0.04, 0.28]} />
                </mesh>
                {[-0.48, 0.48].map((x, idx) => (
                  <mesh key={idx} position={[x, 0, 0.04]} material={materials.carbon}>
                    <boxGeometry args={[0.05, 0.14, 0.1]} />
                  </mesh>
                ))}
              </>
            )}
            {spoilerId === 'carbon-swan' && (
              <>
                <mesh position={[0, 0.32, -0.05]} rotation={[0.1, 0, 0]} material={materials.carbon} castShadow>
                  <boxGeometry args={[1.92, 0.045, 0.34]} />
                </mesh>
                {[-0.96, 0.96].map((x, idx) => (
                  <mesh key={idx} position={[x, 0.28, -0.05]} material={materials.carbon}>
                    <boxGeometry args={[0.03, 0.2, 0.38]} />
                  </mesh>
                ))}
                {[-0.5, 0.5].map((x, idx) => (
                  <mesh key={idx} position={[x, 0.16, 0.02]} rotation={[-0.2, 0, 0]} material={materials.carbon}>
                    <boxGeometry args={[0.045, 0.36, 0.12]} />
                  </mesh>
                ))}
              </>
            )}
            {spoilerId === 'track-twin' && (
              <>
                <mesh position={[0, 0.28, -0.04]} rotation={[0.08, 0, 0]} material={materials.carbon} castShadow>
                  <boxGeometry args={[1.98, 0.04, 0.32]} />
                </mesh>
                <mesh position={[0, 0.42, -0.14]} rotation={[0.2, 0, 0]} material={materials.carbon} castShadow>
                  <boxGeometry args={[1.96, 0.032, 0.18]} />
                </mesh>
                {[-0.98, 0.98].map((x, idx) => (
                  <mesh key={idx} position={[x, 0.33, -0.08]} material={materials.carbon}>
                    <boxGeometry args={[0.035, 0.3, 0.46]} />
                  </mesh>
                ))}
                {[-0.52, 0.52].map((x, idx) => (
                  <mesh key={idx} position={[x, 0.16, 0.02]} material={materials.carbon}>
                    <boxGeometry args={[0.05, 0.38, 0.14]} />
                  </mesh>
                ))}
              </>
            )}
            {spoilerId === 'ducktail' && (
              <mesh position={[0, 0.03, -0.08]} rotation={[0.32, 0, 0]} material={materials.carbon} castShadow>
                <boxGeometry args={[1.68, 0.06, 0.28]} />
              </mesh>
            )}
          </group>

          {/* Greenhouse / Windshield & Glass Canopy */}
          <group name="Windows">
            <mesh position={[0, 1.03, 0.58]} rotation={[-0.98, 0, 0]} material={materials.glass}>
              <boxGeometry args={[1.38, 0.92, 0.03]} />
            </mesh>
            <mesh position={[0, 1.24, -0.05]} material={materials.carbon}>
              <boxGeometry args={[1.34, 0.05, 0.92]} />
            </mesh>
          </group>

          {/* Headlights & Front Indicators */}
          <group name="Headlights">
            {[-0.68, 0.68].map((x, i) => (
              <group key={i} position={[x, 0.54, 2.13]} rotation={[0.12, x < 0 ? -0.22 : 0.22, 0]}>
                <mesh material={materials.headlight}>
                  <boxGeometry args={[0.38, 0.055, 0.08]} />
                </mesh>
                <mesh position={[x < 0 ? -0.14 : 0.14, -0.045, -0.01]} material={materials.indicator}>
                  <boxGeometry args={[0.14, 0.025, 0.07]} />
                </mesh>
              </group>
            ))}
          </group>

          {/* Full-Width Blade Taillights & Rear Indicators */}
          <group position={[0, 0.68, -2.2]} name="Taillights">
            <mesh material={materials.taillight}>
              <boxGeometry args={[1.66, 0.052, 0.06]} />
            </mesh>
            {[-0.78, 0.78].map((x, i) => (
              <mesh key={i} position={[x, -0.05, 0]} material={materials.indicator}>
                <boxGeometry args={[0.18, 0.028, 0.05]} />
              </mesh>
            ))}
          </group>

          {/* Hinged Driver Door (Left, dihedral pivot) */}
          <group ref={driverDoorRef} position={[-0.9, 0.68, 0.66]} name="DriverDoorPivot">
            <mesh position={[0, -0.12, -0.58]} material={materials.body} castShadow>
              <boxGeometry args={[0.09, 0.44, 1.18]} />
            </mesh>
            <mesh position={[0.06, 0.24, -0.56]} rotation={[0, 0, -0.28]} material={materials.glass}>
              <boxGeometry args={[0.025, 0.34, 0.92]} />
            </mesh>
            {/* Left Side Mirror */}
            <group position={[-0.14, 0.16, -0.04]} name="MirrorLeft">
              <mesh material={mirrorMaterial} castShadow>
                <boxGeometry
                  args={[
                    sideMirrorsId === 'camera-pods' ? 0.14 : 0.22,
                    sideMirrorsId === 'camera-pods' ? 0.05 : 0.1,
                    0.12,
                  ]}
                />
              </mesh>
            </group>
          </group>

          {/* Hinged Passenger Door (Right, dihedral pivot) */}
          <group ref={passengerDoorRef} position={[0.9, 0.68, 0.66]} name="PassengerDoorPivot">
            <mesh position={[0, -0.12, -0.58]} material={materials.body} castShadow>
              <boxGeometry args={[0.09, 0.44, 1.18]} />
            </mesh>
            <mesh position={[-0.06, 0.24, -0.56]} rotation={[0, 0, 0.28]} material={materials.glass}>
              <boxGeometry args={[0.025, 0.34, 0.92]} />
            </mesh>
            {/* Right Side Mirror */}
            <group position={[0.14, 0.16, -0.04]} name="MirrorRight">
              <mesh material={mirrorMaterial} castShadow>
                <boxGeometry
                  args={[
                    sideMirrorsId === 'camera-pods' ? 0.14 : 0.22,
                    sideMirrorsId === 'camera-pods' ? 0.05 : 0.1,
                    0.12,
                  ]}
                />
              </mesh>
            </group>
          </group>

          {/* Hinged Front Hood */}
          <group ref={hoodRef} position={[0, 0.72, 0.95]} name="HoodPivot">
            <mesh position={[0, -0.05, 0.56]} rotation={[0.14, 0, 0]} material={materials.body} castShadow>
              <boxGeometry args={[1.26, 0.06, 1.12]} />
            </mesh>
            <mesh position={[0, -0.01, 0.6]} rotation={[0.14, 0, 0]} material={materials.carbon}>
              <boxGeometry args={[0.42, 0.03, 0.52]} />
            </mesh>
          </group>

          {/* Hinged Rear Engine Cover + Visible V12 Hybrid Engine Bay */}
          <group position={[0, 0.66, -1.22]} name="EngineBay">
            <mesh material={materials.engineBlock}>
              <boxGeometry args={[0.82, 0.26, 0.96]} />
            </mesh>
            {[-0.24, 0.24].map((x, idx) => (
              <mesh key={idx} position={[x, 0.14, 0]} rotation={[0, 0, x < 0 ? 0.28 : -0.28]} material={materials.caliper}>
                <boxGeometry args={[0.24, 0.09, 0.84]} />
              </mesh>
            ))}
          </group>
          <group ref={engineCoverRef} position={[0, 0.98, -0.56]} name="EngineCoverPivot">
            <mesh position={[0, -0.08, -0.68]} rotation={[-0.14, 0, 0]} material={materials.carbon} castShadow>
              <boxGeometry args={[1.18, 0.05, 1.24]} />
            </mesh>
            <mesh position={[0, -0.05, -0.68]} rotation={[-0.14, 0, 0]} material={materials.glass}>
              <boxGeometry args={[0.74, 0.03, 0.94]} />
            </mesh>
          </group>

          {/* Detailed Interior Cabin (visible in Interior Camera Mode & open doors) */}
          <group position={[0, 0.42, 0.08]} name="InteriorCabin">
            {/* Cabin Tub Floor & Center Console */}
            <mesh position={[0, 0, 0]} material={materials.dashboard}>
              <boxGeometry args={[1.44, 0.06, 1.4]} />
            </mesh>
            <mesh position={[0, 0.18, 0.12]} material={materials.interiorTrim}>
              <boxGeometry args={[0.24, 0.28, 1.18]} />
            </mesh>
            {/* Ambient Light Strips along Console & Doors */}
            {[-0.13, 0.13].map((x, idx) => (
              <mesh key={idx} position={[x, 0.31, 0.14]} material={materials.ambientStrip}>
                <boxGeometry args={[0.015, 0.015, 0.98]} />
              </mesh>
            ))}
            <mesh position={[0, 0.44, 0.64]} material={materials.ambientStrip}>
              <boxGeometry args={[1.26, 0.014, 0.014]} />
            </mesh>

            {/* Sculpted Racing Seats (Driver & Passenger) */}
            {[-0.4, 0.4].map((x, idx) => (
              <group key={idx} position={[x, 0.16, -0.18]} name={idx === 0 ? 'DriverSeat' : 'PassengerSeat'}>
                {/* Cushion */}
                <mesh position={[0, 0, 0.12]} material={materials.seat}>
                  <boxGeometry args={[0.46, 0.1, 0.48]} />
                </mesh>
                {/* Backrest */}
                <mesh position={[0, 0.28, -0.12]} rotation={[-0.22, 0, 0]} material={materials.seat}>
                  <boxGeometry args={[0.44, 0.56, 0.1]} />
                </mesh>
                {/* Contrast Stitching Accent */}
                <mesh position={[0, 0.3, -0.06]} rotation={[-0.22, 0, 0]} material={materials.stitching}>
                  <boxGeometry args={[0.04, 0.46, 0.02]} />
                </mesh>
              </group>
            ))}

            {/* Dashboard & Digital Cluster */}
            <group position={[0, 0.42, 0.58]} name="Dashboard">
              <mesh material={materials.dashboard}>
                <boxGeometry args={[1.38, 0.22, 0.36]} />
              </mesh>
              <mesh position={[0, 0.09, -0.04]} material={materials.interiorTrim}>
                <boxGeometry args={[1.32, 0.04, 0.26]} />
              </mesh>
              {/* Driver Telemetry Screen */}
              <mesh position={[-0.38, 0.04, -0.19]} material={materials.ambientStrip}>
                <boxGeometry args={[0.34, 0.1, 0.015]} />
              </mesh>
            </group>

            {/* Steering Wheel */}
            <group position={[-0.38, 0.46, 0.34]} rotation={[0.25, 0, 0]} name="SteeringWheel">
              <mesh material={materials.steering}>
                <torusGeometry args={[0.14, 0.022, 12, 28]} />
              </mesh>
              <mesh material={materials.interiorTrim}>
                <boxGeometry args={[0.24, 0.045, 0.03]} />
              </mesh>
              <mesh position={[0, 0.14, 0.01]} material={materials.stitching}>
                <boxGeometry args={[0.028, 0.03, 0.028]} />
              </mesh>
            </group>
          </group>

          {/* 4 Wheel Assemblies */}
          <WheelAssembly
            position={[-0.92, 0.37, 1.38]}
            side="left"
            wheelStyle={activeWheelStyle}
            rimMaterial={materials.rim}
            tireMaterial={materials.tire}
            caliperMaterial={materials.caliper}
            rotorMaterial={materials.rotor}
          />
          <WheelAssembly
            position={[0.92, 0.37, 1.38]}
            side="right"
            wheelStyle={activeWheelStyle}
            rimMaterial={materials.rim}
            tireMaterial={materials.tire}
            caliperMaterial={materials.caliper}
            rotorMaterial={materials.rotor}
          />
          <WheelAssembly
            position={[-0.94, 0.37, -1.35]}
            side="left"
            wheelStyle={activeWheelStyle}
            rimMaterial={materials.rim}
            tireMaterial={materials.tire}
            caliperMaterial={materials.caliper}
            rotorMaterial={materials.rotor}
          />
          <WheelAssembly
            position={[0.94, 0.37, -1.35]}
            side="right"
            wheelStyle={activeWheelStyle}
            rimMaterial={materials.rim}
            tireMaterial={materials.tire}
            caliperMaterial={materials.caliper}
            rotorMaterial={materials.rotor}
          />
        </group>
      )}
    </group>
  );
}
