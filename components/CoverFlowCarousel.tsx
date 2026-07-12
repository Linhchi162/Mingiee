"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';


interface SlideItem {
  id: number | string;
  src: string;
  title: string;
  author: string;
}

const SLIDES: SlideItem[] = [
  {
    id: 0,
    src: '/images/slider/couple_rain.jpg',
    title: 'Shelter in the Rain',
    author: 'Robbie Arnett',
  },
  {
    id: 1,
    src: '/images/slider/white_horse.jpg',
    title: 'Spring Meadow',
    author: 'Robbie Arnett',
  },
  {
    id: 2,
    src: '/images/slider/golden_deer.jpg',
    title: 'Keeper of the Night',
    author: 'Robbie Arnett',
  },
  {
    id: 3,
    src: '/images/slider/kids_street.jpg',
    title: 'Childhood Sunshine',
    author: 'Robbie Arnett',
  },
  {
    id: 4,
    src: '/images/slider/waterfall.jpg',
    title: 'Midnight Falls',
    author: 'Robbie Arnett',
  },
];

export default function CoverFlowCarousel({ slides = SLIDES }: { slides?: SlideItem[] }) {
  const currentSlides = slides && slides.length > 0 ? slides : SLIDES;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [leftBtnState, setLeftBtnState] = useState<'default' | 'hover' | 'active'>('default');
  const [rightBtnState, setRightBtnState] = useState<'default' | 'hover' | 'active'>('default');
  
  // Ref for handling swipe/drag
  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const totalSlides = currentSlides.length;

  // Initialize active index to center
  useEffect(() => {
    if (currentSlides.length > 0) {
      setActiveIndex(Math.floor(currentSlides.length / 2));
    }
  }, [currentSlides.length]);

  // Handle responsive design in client
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScreenSize('mobile');
      } else if (window.innerWidth < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    
    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 500); // match transition duration
    return () => clearTimeout(timer);
  }, [activeIndex]);

  // Helper to calculate circular shortest distance offset
  const getOffset = (index: number) => {
    let diff = index - activeIndex;
    while (diff < -Math.floor(totalSlides / 2)) diff += totalSlides;
    while (diff > Math.floor(totalSlides / 2)) diff -= totalSlides;
    return diff;
  };

  // Get style properties for a slide based on its offset and screen size
  const getSlideStyle = (offset: number) => {
    const absOffset = Math.abs(offset);
    
    // Scale factor (center card is 0.9, neighbors 0.82, outer cards 0.61)
    let scale = 0.9;
    if (absOffset === 1) scale = 0.82;
    if (absOffset === 2) scale = 0.61;
    
    // Rotate factor (degrees)
    let rotateY = 0;
    if (offset > 0) rotateY = -24;
    if (offset < 0) rotateY = 24;
    // Rotate more for outer cards
    if (offset > 1) rotateY = -40;
    if (offset < -1) rotateY = 40;

    // Translation calculations (X: spacing, Y: arch shape)
    let translateX = 0;
    let translateY = 0;

    if (screenSize === 'desktop') {
      // Desktop spacing (constant 275px/510px, 10% larger than 250px/460px)
      if (offset === 1) translateX = 275;
      if (offset === -1) translateX = -275;
      if (offset === 2) translateX = 510;
      if (offset === -2) translateX = -510;

      if (offset === 0) translateY = 80;
      if (absOffset === 1) translateY = 22;
      if (absOffset === 2) translateY = -12;
    } else if (screenSize === 'tablet') {
      // Tablet spacing (designed to fit 5 cards fully in 768px width)
      if (offset === 1) translateX = 160;
      if (offset === -1) translateX = -160;
      if (offset === 2) translateX = 300;
      if (offset === -2) translateX = -300;

      if (offset === 0) translateY = 50;
      if (absOffset === 1) translateY = 14;
      if (absOffset === 2) translateY = -8;
    } else {
      // Mobile spacing (designed to support wider cards flowing off-screen)
      if (offset === 1) translateX = 76;
      if (offset === -1) translateX = -76;
      if (offset === 2) translateX = 148;
      if (offset === -2) translateX = -148;

      if (offset === 0) translateY = 20;
      if (absOffset === 1) translateY = 5;
      if (absOffset === 2) translateY = -3;
    }

    // Z index and Opacity
    let zIndex = 30 - absOffset * 10;
    let opacity = 1;
    let pointerEvents: 'auto' | 'none' = 'auto';

    if (absOffset === 1) opacity = 0.88;
    if (absOffset === 2) opacity = 0.7;
    if (absOffset > 2) {
      opacity = 0;
      pointerEvents = 'none';
    }

    // Depth push (Z translation)
    let translateZ = 0;
    if (absOffset === 0) translateZ = 60;
    if (absOffset === 1) translateZ = 0;
    if (absOffset === 2) translateZ = -60;

    return {
      transform: `translate3d(calc(-50% + ${translateX}px), calc(-50% + ${translateY}px), ${translateZ}px) scale(${scale}) rotateY(${rotateY}deg)`,
      zIndex,
      opacity,
      pointerEvents,
      willChange: 'transform, opacity',
    };
  };

  // Gesture handling
  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || dragStartX.current === null) return;
    const diff = dragStartX.current - e.touches[0].clientX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      isDragging.current = false;
      dragStartX.current = null;
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    dragStartX.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || dragStartX.current === null) return;
    const diff = dragStartX.current - e.clientX;
    if (Math.abs(diff) > 60) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      isDragging.current = false;
      dragStartX.current = null;
    }
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
    dragStartX.current = null;
  };

  return (
    <div className="w-full max-w-5xl mx-auto pt-0 pb-10 px-4 flex flex-col items-center">


      {/* 3D Coverflow Container */}
      <div 
        className="relative w-full h-[250px] sm:h-[340px] lg:h-[540px] flex items-center justify-center overflow-visible select-none cursor-grab active:cursor-grabbing"
        style={{ perspective: '1200px' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        <div className="relative w-full h-full flex items-center justify-center overflow-visible" style={{ transformStyle: 'preserve-3d' }}>
          {currentSlides.map((slide, index) => {
            const offset = getOffset(index);
            const slideStyle = getSlideStyle(offset);
            const isActive = offset === 0;

            return (
              <div
                key={slide.id}
                onClick={() => {
                  if (!isActive && !isTransitioning) {
                    setActiveIndex(index);
                  }
                }}
                className={`absolute left-1/2 top-1/2 w-[96px] sm:w-[170px] lg:w-[280px] aspect-[5/8] rounded-[14px] sm:rounded-[20px] overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.18)] transition-all duration-500 ease-out origin-center cursor-pointer`}
                style={{
                  ...slideStyle,
                  transitionProperty: 'transform, opacity, z-index',
                }}
              >
                {/* Image Component */}
                <div className="relative w-full h-full bg-[#E5E7EB]">
                  <Image
                    src={slide.src}
                    alt={slide.title}
                    fill
                    sizes="(max-width: 640px) 96px, (max-width: 1024px) 170px, 280px"
                    className={`object-cover pointer-events-none transition-all duration-500 ${isActive ? 'grayscale-0' : 'grayscale'}`}
                    priority={isActive}
                  />
                  {/* Subtle vignette/shading overlay on non-active images for depth */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-black/10 transition-opacity duration-500" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-4 sm:gap-6 mt-[10px] sm:mt-[60px] lg:mt-[100px]">
        <button
          onClick={prevSlide}
          disabled={isTransitioning}
          onMouseEnter={() => setLeftBtnState('hover')}
          onMouseLeave={() => setLeftBtnState('default')}
          onMouseDown={() => setLeftBtnState('active')}
          onMouseUp={() => setLeftBtnState('hover')}
          style={{
            backgroundColor: leftBtnState === 'active' ? '#B3D6EE' : leftBtnState === 'hover' ? '#CBE3F3' : '#FAF6EE'
          }}
          className="w-[43px] h-[29px] sm:w-[80px] sm:h-[52px] lg:w-[100px] lg:h-[64px] rounded-[10px] border-2 sm:border-[2.5px] lg:border-[3px] border-dashed border-[#4A4542] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
          aria-label="Previous slide"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/left-arrow.png"
            alt="Previous"
            className="w-[11px] h-[11px] sm:w-[22px] sm:h-[22px] lg:w-8 lg:h-8 object-contain pointer-events-none select-none"
          />
        </button>
        <button
          onClick={nextSlide}
          disabled={isTransitioning}
          onMouseEnter={() => setRightBtnState('hover')}
          onMouseLeave={() => setRightBtnState('default')}
          onMouseDown={() => setRightBtnState('active')}
          onMouseUp={() => setRightBtnState('hover')}
          style={{
            backgroundColor: rightBtnState === 'active' ? '#B3D6EE' : rightBtnState === 'hover' ? '#CBE3F3' : '#FAF6EE'
          }}
          className="w-[43px] h-[29px] sm:w-[80px] sm:h-[52px] lg:w-[100px] lg:h-[64px] rounded-[10px] border-2 sm:border-[2.5px] lg:border-[3px] border-dashed border-[#4A4542] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
          aria-label="Next slide"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/right-arrow.png"
            alt="Next"
            className="w-[11px] h-[11px] sm:w-[22px] sm:h-[22px] lg:w-8 lg:h-8 object-contain pointer-events-none select-none"
          />
        </button>
      </div>
    </div>
  );
}
