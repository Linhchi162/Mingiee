'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isCommissionDropdownOpen, setIsCommissionDropdownOpen] = useState(false)
  const [dropdownItems, setDropdownItems] = useState([
    { label: 'FACEBOOK', url: '#' },
    { label: 'INSTAGRAM', url: '#' },
    { label: 'TWITTER', url: '#' },
  ])
  const dropdownRef = useRef<HTMLDivElement>(null)
  const commissionDropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchLinks() {
      try {
        const { data, error } = await supabase
          .from('platform_links')
          .select('label, url')
          .order('display_order', { ascending: true })
        if (error) {
          // If table doesn't exist yet, it's fine, we use default fallbacks
          console.warn('Table platform_links not found or not accessible. Using defaults.')
        } else if (data && data.length > 0) {
          setDropdownItems(data)
        }
      } catch (err) {
        console.error('Error fetching platform links:', err)
      }
    }
    fetchLinks()
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
      if (commissionDropdownRef.current && !commissionDropdownRef.current.contains(event.target as Node)) {
        setIsCommissionDropdownOpen(false)
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

  const toggleCommissionDropdown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsCommissionDropdownOpen(prev => !prev)
  }

  const handleCommissionItemClick = (e: React.MouseEvent, sectionId: string) => {
    e.preventDefault()
    scrollToSection(sectionId)
    setIsCommissionDropdownOpen(false)
  }

  const handleClick = (e: React.MouseEvent, url: string) => {
    if (!url || url === '#' || url === '') {
      e.preventDefault()
    }
  }

  // Responsive layout classes: mobile, tablet (iPad), and desktop sizes
  const buttonBaseClass = "group relative flex items-center justify-center gap-1 sm:gap-1.5 lg:gap-0 " +
    "py-[4px] px-[clamp(4px,1.6vw,7px)] sm:py-[6px] sm:px-[14px] lg:py-[8px] lg:px-[24px] " +
    "rounded-[7px] transition-all duration-300 shadow-[0_1.4px_2.7px_rgba(0,0,0,0.05),0_0.7px_0.7px_rgba(0,0,0,0.05)] cursor-pointer"

  const defaultButtonClass = `${buttonBaseClass} bg-[#FAF6EE] border-[1.6px] sm:border-[2px] lg:border-[2.3px] border-dashed border-[#4A4542] text-[#4A4542] hover:bg-[#5A504D] hover:border-[#5A504D] hover:text-[#FAF6EE] active:bg-[#4E4542] active:border-[#4E4542] active:text-[#FAF6EE] active:scale-95`
  
  const iconLeftClass = "relative lg:absolute lg:left-[5.5px] lg:top-1/2 lg:-translate-y-1/2 shrink-0 " +
    "w-[clamp(7.5px,2.2vw,9.2px)] h-[clamp(7.5px,2.2vw,9.2px)] sm:w-[15px] sm:h-[15px] lg:w-[19px] lg:h-[19px] flex items-center justify-center " +
    "transition-all duration-300 group-hover:opacity-0 group-hover:scale-50 group-active:opacity-0 group-active:scale-50 pointer-events-none"
    
  const iconRightClass = "relative lg:absolute lg:right-[5.5px] lg:top-1/2 lg:-translate-y-1/2 shrink-0 " +
    "w-[clamp(7.5px,2.2vw,9.2px)] h-[clamp(7.5px,2.2vw,9.2px)] sm:w-[15px] sm:h-[15px] lg:w-[19px] lg:h-[19px] flex items-center justify-center " +
    "transition-all duration-300 group-hover:opacity-0 group-hover:scale-50 group-active:opacity-0 group-active:scale-50 pointer-events-none"
    
  const textClass = "font-semibold lg:font-normal text-[clamp(8px,2.5vw,10px)] sm:text-[15px] lg:text-[16px] tracking-wider transition-colors duration-300 relative translate-x-[0.7px] translate-y-[1.3px] sm:translate-x-[1.4px] sm:translate-y-[1px] lg:translate-x-[2.7px] lg:translate-y-[0.6px] lg:px-0"

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <header 
      className="w-full pt-3 sm:pt-[20px] lg:pt-[30px] pb-3 px-[4%] sm:px-[4%] lg:px-[5%] bg-transparent flex flex-nowrap items-center justify-between gap-1 sm:gap-[6px] lg:gap-0 select-none font-mono"
    >
      {/* COMMISSION BUTTON */}
      <div ref={commissionDropdownRef} className="relative z-50">
        <button 
          type="button" 
          onClick={toggleCommissionDropdown}
          className={`${isCommissionDropdownOpen ? `${buttonBaseClass} bg-[#5A504D] border-[1.6px] sm:border-[2px] lg:border-[2.3px] border-[#5A504D] text-[#FAF6EE]` : defaultButtonClass} min-w-[64px] sm:min-w-[143px] lg:min-w-[188px]`}
        >
          <div className={`${iconLeftClass} ${isCommissionDropdownOpen ? 'opacity-0 scale-50' : ''}`}>
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
          <div className={`${iconRightClass} ${isCommissionDropdownOpen ? 'opacity-0 scale-50' : ''}`}>
            <Image
              src="/images/Button.png"
              alt="button icon"
              fill
              className="object-contain"
            />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isCommissionDropdownOpen && (
          <div 
            className="absolute left-0 mt-[6.8px] sm:mt-[11px] lg:mt-[13.6px] p-[12px] sm:p-[19px] lg:p-[24.5px] bg-[#5A504D] rounded-[10px] sm:rounded-[13.5px] flex flex-col items-start gap-[2px] sm:gap-[16px] lg:gap-[21.8px] shadow-[0_5.4px_16.3px_rgba(0,0,0,0.18)] min-w-[121px] sm:min-w-[180px] lg:min-w-[210px] animate-in fade-in slide-in-from-top-2 duration-200"
            style={{ transformOrigin: 'top left' }}
          >
            <button
              type="button"
              onClick={(e) => handleCommissionItemClick(e, 'commission')}
              className="text-[#FAF6EE] text-[10px] sm:text-[15px] lg:text-[16px] tracking-wider font-semibold lg:font-normal hover:opacity-85 hover:translate-x-[2px] transition-all duration-200 cursor-pointer select-none text-left w-full bg-transparent border-none"
            >
              PRICE LIST
            </button>
            <button
              type="button"
              onClick={(e) => handleCommissionItemClick(e, 'terms')}
              className="text-[#FAF6EE] text-[10px] sm:text-[15px] lg:text-[16px] tracking-wider font-semibold lg:font-normal hover:opacity-85 hover:translate-x-[2px] transition-all duration-200 cursor-pointer select-none text-left w-full bg-transparent border-none"
            >
              TERMS OF SERVICE
            </button>
          </div>
        )}
      </div>

      {/* GALLERY BUTTON */}
      <button 
        type="button" 
        onClick={() => scrollToSection('gallery')}
        className={`${defaultButtonClass} relative left-0 sm:left-0 lg:-left-[7px] min-w-[53px] sm:min-w-[120px] lg:min-w-[159px]`}
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
          className={`${isDropdownOpen ? `${buttonBaseClass} bg-[#5A504D] border-[1.6px] sm:border-[2px] lg:border-[2.3px] border-[#5A504D] text-[#FAF6EE]` : defaultButtonClass} min-w-[57px] sm:min-w-[128px] lg:min-w-[167px]`}
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
            className="absolute right-0 mt-[6.8px] sm:mt-[11px] lg:mt-[13.6px] p-[12px] sm:p-[19px] lg:p-[24.5px] bg-[#5A504D] rounded-[10px] sm:rounded-[13.5px] flex flex-col items-start gap-[2px] sm:gap-[16px] lg:gap-[21.8px] shadow-[0_5.4px_16.3px_rgba(0,0,0,0.18)] min-w-[97px] sm:min-w-[139px] lg:min-w-[167px] animate-in fade-in slide-in-from-top-2 duration-200"
            style={{ transformOrigin: 'top right' }}
          >
            {dropdownItems.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => handleClick(e, item.url)}
                className="text-[#FAF6EE] text-[11px] sm:text-[19.5px] lg:text-[16px] tracking-wider font-semibold lg:font-normal hover:opacity-85 hover:translate-x-[2px] transition-all duration-200 cursor-pointer select-none"
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
