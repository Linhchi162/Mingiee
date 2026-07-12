"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';


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
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop' | 'desktop-small'>('desktop');
  const [windowWidth, setWindowWidth] = useState(1200);
  const [leftBtnState, setLeftBtnState] = useState<'default' | 'hover' | 'active'>('default');
  const [rightBtnState, setRightBtnState] = useState<'default' | 'hover' | 'active'>('default');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxSlide, setLightboxSlide] = useState<SlideItem | null>(null);
  const [mounted, setMounted] = useState(false);

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

  // Set mounted state for portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle responsive design in client
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (window.innerWidth < 640) {
        setScreenSize('mobile');
      } else if (window.innerWidth < 1024) {
        setScreenSize('tablet');
      } else if (window.innerWidth < 1536) {
        setScreenSize('desktop-small');
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
 
    let cardWidth = screenSize === 'mobile' ? 106 : screenSize === 'tablet' ? 187 : screenSize === 'desktop-small' ? 250 : 280;
    let spacing = screenSize === 'desktop' ? 270 : screenSize === 'desktop-small' ? 235 : screenSize === 'tablet' ? 160 : 70;
 
    if (screenSize === 'desktop-small') {
      const ratio = (windowWidth - 768) / (1280 - 768);
      const clampedRatio = Math.max(0, Math.min(1, ratio));
      cardWidth = Math.round(187 + clampedRatio * (250 - 187));
      spacing = Math.round(160 + clampedRatio * (235 - 160));
    }
 
    // Adjust spacing for outer cards (offset = 2) to make spacing more even
    if (screenSize === 'tablet' && absOffset === 2) {
      translateX = offset * 143;
    } else {
      translateX = offset * spacing;
    }
 
    if (screenSize === 'desktop') {
      if (offset === 0) translateY = 80;
      if (absOffset === 1) translateY = 22;
      if (absOffset === 2) translateY = -12;
    } else if (screenSize === 'desktop-small') {
      const ratio = (windowWidth - 768) / (1280 - 768);
      const clampedRatio = Math.max(0, Math.min(1, ratio));
      if (offset === 0) translateY = Math.round(55 + clampedRatio * (68 - 55));
      if (absOffset === 1) translateY = Math.round(15 + clampedRatio * (20 - 15));
      if (absOffset === 2) translateY = Math.round(-9 + clampedRatio * (-10 - (-9)));
    } else if (screenSize === 'tablet') {
      if (offset === 0) translateY = 55;
      if (absOffset === 1) translateY = 15;
      if (absOffset === 2) translateY = -9;
    } else {
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
      width: cardWidth,
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
        className="relative w-full h-[250px] sm:h-[340px] lg:h-[480px] 2xl:h-[540px] flex items-center justify-center overflow-visible select-none cursor-grab active:cursor-grabbing"
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
                  if (isActive && !isTransitioning) {
                    setLightboxSlide(slide);
                    setIsLightboxOpen(true);
                  } else if (!isActive && !isTransitioning) {
                    setActiveIndex(index);
                  }
                }}
                className={`absolute left-1/2 top-1/2 w-[106px] sm:w-[187px] lg:w-[250px] 2xl:w-[280px] aspect-[5/8] rounded-[14px] sm:rounded-[20px] overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.18)] transition-all duration-500 ease-out origin-center cursor-pointer`}
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
                    sizes="(max-width: 640px) 106px, (max-width: 1024px) 187px, (max-width: 1536px) 250px, 280px"
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
      <div className="flex items-center gap-4 sm:gap-6 mt-[10px] sm:mt-[60px] lg:mt-[100px] sm:translate-y-[35px] lg:translate-y-0">
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
          className="w-[43px] h-[29px] sm:w-[64px] sm:h-[42px] md:w-[64px] md:h-[42px] lg:w-[80px] lg:h-[52px] rounded-[10px] border-2 sm:border-[2.5px] md:border-[2.5px] lg:border-[3px] border-dashed border-[#4A4542] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
          aria-label="Previous slide"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/left-arrow.png"
            alt="Previous"
            className="w-[14px] h-[14px] sm:w-[24px] sm:h-[24px] md:w-[24px] md:h-[24px] lg:w-[26px] lg:h-[26px] object-contain pointer-events-none select-none"
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
          className="w-[43px] h-[29px] sm:w-[64px] sm:h-[42px] md:w-[64px] md:h-[42px] lg:w-[80px] lg:h-[52px] rounded-[10px] border-2 sm:border-[2.5px] md:border-[2.5px] lg:border-[3px] border-dashed border-[#4A4542] flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer disabled:opacity-50"
          aria-label="Next slide"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/right-arrow.png"
            alt="Next"
            className="w-[14px] h-[14px] sm:w-[24px] sm:h-[24px] md:w-[24px] md:h-[24px] lg:w-[26px] lg:h-[26px] object-contain pointer-events-none select-none"
          />
        </button>
      </div>

      {/* Lightbox Modal */}
      {mounted && isLightboxOpen && lightboxSlide && createPortal(
        <div
          className="fixed inset-0 z-[9999] overflow-y-auto bg-black/90 backdrop-blur-sm animate-in fade-in duration-200 flex flex-col items-center py-6 px-4 w-screen h-screen top-0 left-0"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Fixed Close Button always visible at top-right of screen */}
          <button
            onClick={() => setIsLightboxOpen(false)}
            className="fixed top-6 right-6 w-10 h-10 bg-[#5A504D] border-[3px] border-dashed border-[#5A504D] rounded-full flex items-center justify-center text-[#FAF6EE] hover:bg-[#4A4542] hover:text-[#FAF6EE] hover:border-[#4A4542] transition-all duration-300 cursor-pointer z-[10000] font-bold text-lg shadow-lg"
          >
            ✕
          </button>
          
          <div
            className="relative my-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightboxSlide.src}
              alt={lightboxSlide.title}
              className="w-full max-w-[92vw] sm:max-w-[480px] lg:max-w-[560px] h-auto rounded-[14px] shadow-2xl block"
            />
          </div>
        </div>,
        document.body
      )}

      {/* Preload all images for lightbox */}
      <div className="hidden">
        {currentSlides.map((slide) => (
          <Image
            key={`preload-${slide.id}`}
            src={slide.src}
            alt={slide.title}
            width={800}
            height={1280}
            priority
          />
        ))}
      </div>
    </div>
  );
}
