'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const toggleDropdown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDropdownOpen(prev => !prev)
  }

  const dropdownItems = [
    { label: 'FACEBOOK', url: '#' },
    { label: 'INSTAGRAM', url: '#' },
    { label: 'TWITTER', url: '#' },
  ]

  const handleClick = (e: React.MouseEvent, url: string) => {
    if (!url || url === '#' || url === '') {
      e.preventDefault()
    }
  }

  // Responsive layout classes: mobile, tablet (iPad), and desktop sizes
  const buttonBaseClass = "group relative flex items-center justify-center " +
    "py-1 px-2 sm:py-2 sm:px-5 lg:py-2 lg:px-8 " +
    "rounded-[10px] transition-all duration-300 shadow-[0_2px_4px_rgba(0,0,0,0.05),0_1px_1px_rgba(0,0,0,0.05)] cursor-pointer"

  const defaultButtonClass = `${buttonBaseClass} bg-[#FAF6EE] border-2 sm:border-[2.5px] border-dashed border-[#4A4542] text-[#4A4542] hover:bg-[#5A504D] hover:border-[#5A504D] hover:text-[#FAF6EE] active:bg-[#4E4542] active:border-[#4E4542] active:text-[#FAF6EE] active:scale-95`
  
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
        className={`${defaultButtonClass} min-w-[85px] sm:min-w-[228px] lg:min-w-[276px]`}
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
        className={`${defaultButtonClass} relative left-0 sm:left-0 lg:-left-[10px] min-w-[70px] sm:min-w-[192px] lg:min-w-[234px]`}
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

      {/* CONTACTS BUTTON WITH DROPDOWN */}
      <div ref={dropdownRef} className="relative z-50">
        <button 
          type="button" 
          onClick={toggleDropdown}
          className={`${isDropdownOpen ? `${buttonBaseClass} bg-[#5A504D] border-2 sm:border-[2.5px] border-[#5A504D] text-[#FAF6EE]` : defaultButtonClass} min-w-[77px] sm:min-w-[204px] lg:min-w-[246px]`}
        >
          <div className={`${iconLeftClass} ${isDropdownOpen ? 'opacity-0 scale-50' : ''}`}>
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
          <div className={`${iconRightClass} ${isDropdownOpen ? 'opacity-0 scale-50' : ''}`}>
            <Image
              src="/images/Button.png"
              alt="button icon"
              fill
              className="object-contain"
            />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div 
            className="absolute right-0 mt-2.5 sm:mt-4 lg:mt-5 p-4 sm:p-7 lg:p-9 bg-[#5A504D] rounded-[15px] sm:rounded-[20px] flex flex-col items-start gap-3 sm:gap-6 lg:gap-8 shadow-[0_8px_24px_rgba(0,0,0,0.18)] min-w-[130px] sm:min-w-[204px] lg:min-w-[246px] animate-in fade-in slide-in-from-top-2 duration-200"
            style={{ transformOrigin: 'top right' }}
          >
            {dropdownItems.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleClick(e, item.url)}
                className="text-[#FAF6EE] text-[12.5px] sm:text-[29px] lg:text-[29px] tracking-wider font-semibold hover:opacity-85 hover:translate-x-[2px] transition-all duration-200 cursor-pointer select-none"
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>

    </header>
  )
}
