import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { PrismicNextImage } from '@prismicio/next';
import { ImageFieldImage } from '@prismicio/client';

interface ShiningImageProps {
    field: ImageFieldImage; // Ensure the correct type
}

const ShiningImage: React.FC<ShiningImageProps> = ({ field }) => {
    const boxRef = useRef<HTMLDivElement | null>(null);

    const mouseMove = (e: MouseEvent) => {
        if (!boxRef.current) return;

        const xPos = (e.clientX / window.innerWidth) - 0.5;
        const yPos = (e.clientY / window.innerHeight) - 0.5;

        // Apply rotation based on mouse position
        gsap.to(boxRef.current, {
            rotationY: 15 * xPos,
            rotationX: -15 * yPos, // Invert Y for a more natural tilt
            ease: "power1.out",
            transformPerspective: 900,
            transformOrigin: 'center',
            duration: 0.6,
        });
    };

    const handleMouseEnter = () => {
        // Attach mousemove event
        window.addEventListener('mousemove', mouseMove);
    };

    const handleMouseLeave = () => {
        // Detach mousemove event
        window.removeEventListener('mousemove', mouseMove);
        gsap.to(boxRef.current, {
            rotationY: 0,
            rotationX: 0,
            ease: "power1.out",
            duration: 0.3,
            delay: 0.3,
        });
    };

    return (
        <div
            className="box"
            ref={boxRef}
            style={{
                perspective: '900px',
                display: 'inline-block',
                position: 'relative',
                cursor: 'pointer',
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <PrismicNextImage
                field={field}
                alt=''
                style={{
                    display: 'block',
                    width: '100%', // Adjust as needed
                    borderRadius: '10px',
                    backfaceVisibility: 'hidden', // Prevents showing the back side
                }}
            />
        </div>
    );
};

export default ShiningImage;
