import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random';

function Stars(props) {
    const ref = useRef();
    const [sphere] = useMemo(() => {
        const positions = random.inSphere(new Float32Array(600), { radius: 1.5 });
        for (let i = 0; i < positions.length; i++) {
            if (!Number.isFinite(positions[i])) positions[i] = 0;
        }
        return [positions];
    }, []);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.x -= delta / 15;
            ref.current.rotation.y -= delta / 20;
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={true} {...props}>
                <PointMaterial
                    transparent
                    color="#FFD700"
                    size={0.0025}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
}

const StarField = () => {
    const containerRef = useRef(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsVisible(entry.isIntersecting);
            },
            { threshold: 0.05 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 z-0 bg-void pointer-events-none">
            {isVisible && (
                <Canvas
                    camera={{ position: [0, 0, 1] }}
                    dpr={[1, 1.5]}
                    gl={{ powerPreference: 'low-power', antialias: false }}
                    performance={{ min: 0.5 }}
                >
                    <Stars />
                </Canvas>
            )}
        </div>
    );
};

export default React.memo(StarField);
