'use client'

import React from 'react'
import Image from 'next/image'

export default function Navbar() {
  // Responsive layout classes: mobile, tablet (iPad), and desktop sizes
  const buttonClass = "group relative flex items-center justify-center " +
    "py-1 px-2 sm:py-2 sm:px-5 lg:py-2 lg:px-8 " +
    "bg-[#FAF6EE] border-2 sm:border-[2.5px] border-dashed border-[#4A4542] rounded-[10px] " +
    "text-[#4A4542] hover:bg-[#5A504D] hover:border-[#5A504D] hover:text-[#FAF6EE] " +
    "active:bg-[#4E4542] active:border-[#4E4542] active:text-[#FAF6EE] active:scale-95 " +
    "transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_1px_rgba(0,0,0,0.05)] cursor-pointer"
  
  const iconLeftClass = "absolute left-[5px] sm:left-2 lg:left-3.5 top-1/2 -translate-y-1/2 " +
    "w-[13.5px] h-[13.5px] sm:w-[22px] sm:h-[22px] lg:w-7 lg:h-7 hidden sm:flex items-center justify-center " +
    "transition-all duration-300 group-hover:opacity-0 group-hover:scale-50 group-active:opacity-0 group-active:scale-50 pointer-events-none"
    
  const iconRightClass = "absolute right-[5px] sm:right-2 lg:right-3.5 top-1/2 -translate-y-1/2 " +
    "w-[13.5px] h-[13.5px] sm:w-[22px] sm:h-[22px] lg:w-7 lg:h-7 hidden sm:flex items-center justify-center " +
    "transition-all duration-300 group-hover:opacity-0 group-hover:scale-50 group-active:opacity-0 group-active:scale-50 pointer-events-none"
    
  const textClass = "font-semibold text-[13px] sm:text-[29px] lg:text-[31px] tracking-wider transition-colors duration-300 relative translate-x-[-1px] -translate-y-[1px] sm:translate-x-[2px] sm:-translate-y-[1.5px] lg:translate-x-[4px] lg:-translate-y-[2px]"

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <header 
      className="w-full pt-4 sm:pt-6 lg:pt-9 pb-4 px-2 sm:px-6 lg:px-[clamp(12px,2vw,24px)] bg-transparent flex flex-nowrap items-center justify-between gap-1.5 sm:gap-4 lg:gap-0 select-none font-mono"
    >
      {/* COMMISSION BUTTON */}
      <button 
        type="button" 
        onClick={() => scrollToSection('commission')}
        className={`${buttonClass} min-w-[85px] sm:min-w-[228px] lg:min-w-[276px]`}
      >
        <div className={iconLeftClass}>
          <Image
            src="/images/Button.png"
            alt="button icon"
            fill
            className="object-contain"
          />
        </div>
        <span className={textClass}>
          (COMMISSION)
        </span>
        <div className={iconRightClass}>
          <Image
            src="/images/Button.png"
            alt="button icon"
            fill
            className="object-contain"
          />
        </div>
      </button>

      {/* GALLERY BUTTON */}
      <button 
        type="button" 
        onClick={() => scrollToSection('gallery')}
        className={`${buttonClass} relative left-0 sm:left-0 lg:-left-[10px] min-w-[70px] sm:min-w-[192px] lg:min-w-[234px]`}
      >
        <div className={iconLeftClass}>
          <Image
            src="/images/Button.png"
            alt="button icon"
            fill
            className="object-contain"
          />
        </div>
        <span className={textClass}>
          (GALLERY)
        </span>
        <div className={iconRightClass}>
          <Image
            src="/images/Button.png"
            alt="button icon"
            fill
            className="object-contain"
          />
        </div>
      </button>

      {/* CONTACTS BUTTON */}
      <button 
        type="button" 
        onClick={() => scrollToSection('contacts')}
        className={`${buttonClass} min-w-[77px] sm:min-w-[204px] lg:min-w-[246px]`}
      >
        <div className={iconLeftClass}>
          <Image
            src="/images/Button.png"
            alt="button icon"
            fill
            className="object-contain"
          />
        </div>
        <span className={textClass}>
          (CONTACTS)
        </span>
        <div className={iconRightClass}>
          <Image
            src="/images/Button.png"
            alt="button icon"
            fill
            className="object-contain"
          />
        </div>
      </button>

    </header>
  )
}
