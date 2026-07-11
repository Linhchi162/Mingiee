import Image from 'next/image'
import Navbar from '@/components/Navbar'
import CoverFlowCarousel from '@/components/CoverFlowCarousel'
import { supabase } from '@/lib/supabase'

export const revalidate = 0;

export default async function Home() {
  // Fetch prices
  const { data: dbPrices } = await supabase
    .from('prices')
    .select('*')
    .order('display_order', { ascending: true })

  // Fetch gallery slides
  const { data: dbSlides } = await supabase
    .from('gallery_slides')
    .select('*')
    .order('display_order', { ascending: true })

  // Fetch site content settings
  const { data: dbContent } = await supabase
    .from('site_content')
    .select('key, value')

  const contentMap: Record<string, string> = {}
  if (dbContent) {
    dbContent.forEach(item => {
      contentMap[item.key] = item.value
    })
  }

  const getContent = (key: string, fallback: string) => {
    return contentMap[key] !== undefined ? contentMap[key] : fallback
  }

  const defaultPrices = [
    { id: 1, type: 'BUST-UP', price_vnd: '1.900.000 VND' },
    { id: 2, type: 'HALF-BODY', price_vnd: '2.400.000 VND' },
    { id: 3, type: 'THIGH-UP', price_vnd: '3.200.000 VND' },
    { id: 4, type: 'FULL-BODY', price_vnd: '4.200.000 VND' },
  ]

  const prices = dbPrices && dbPrices.length > 0 ? dbPrices : defaultPrices

  const slides = dbSlides ? dbSlides.map(slide => ({
    id: slide.id,
    src: slide.image_url,
    title: slide.title || '',
    author: slide.author || ''
  })) : []
  return (
    <div className="w-full relative flex flex-col overflow-x-hidden">
      {/* Fixed background wrapper for rubber-band overscroll */}
      <div 
        className="fixed -inset-y-[50vh] inset-x-0 z-0 pointer-events-none"
        style={{
          backgroundImage: "url('/images/trang-chu-nau-v2.jpg')",
          backgroundRepeat: 'repeat',
          backgroundPosition: 'top center',
          backgroundSize: '100% auto',
        }}
      />
      {/* SECTION 1: Blue Grid Background Section */}
      <section className="relative z-10 w-full min-h-[65vh] sm:min-h-screen flex flex-col overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 pointer-events-none"
          style={{
            backgroundImage: "url('/images/trang-chu.jpg')",
            backgroundRepeat: 'repeat',
            backgroundPosition: 'bottom center',
            backgroundSize: '100% auto',
          }}
        />
        
        {/* Navbar */}
        <div className="relative z-20">
          <Navbar />
        </div>
        
        {/* Content */}
        <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 py-8">
          {/* Decorative Lace & GIF Container */}
          <div className="relative mt-5 sm:-mt-16 md:-mt-20 flex items-center justify-center w-full max-w-[235px] sm:max-w-[420px] md:max-w-[540px] aspect-square mb-2 sm:mb-6 select-none">
            {/* Lace PNG background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/images/lace.png"
                alt="Lace Decoration"
                width={1000}
                height={1000}
                className="object-contain w-full h-full opacity-95 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.06)]"
                priority
              />
            </div>
            
            {/* Moving Mingiee GIF foreground */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Image
                src="/images/moving-mingiee_transparent.gif?v=2"
                alt="Mingiee"
                width={2040}
                height={2040}
                className="object-contain w-[155%] h-[155%] max-w-none filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.1)] transition-transform duration-300 hover:scale-105"
                priority
                unoptimized
              />
            </div>
          </div>

        </main>

        {/* Bottom Left Greeting Text */}
        <div className="relative sm:absolute left-0 sm:left-[39px] md:left-[63px] bottom-0 sm:bottom-[64px] md:bottom-[88px] mt-1 sm:mt-0 pb-12 sm:pb-0 text-center sm:text-left font-mono text-[#4D4845] select-none z-10 w-full sm:w-auto px-4 sm:px-0">
          <p className="text-[clamp(23px,2.6vw,30px)] lg:text-[18px] font-extrabold tracking-widest leading-[1.2]">
            {getContent('welcome_line1', "HI, I'M MINGIEE!")}
          </p>
          <p className="text-[clamp(23px,2.6vw,30px)] lg:text-[18px] font-extrabold tracking-widest leading-[1.2]">
            {getContent('welcome_line2', "WELCOME TO MY CREATIVE SPACE!")}
          </p>
        </div>

      </section>

      {/* Combined Brown Background Wrapper */}
      <div 
        className="relative w-full flex flex-col"
        style={{
          backgroundImage: 'url("/images/trang-chu-nau-v2.jpg")',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'top center',
          backgroundSize: '100% auto',
        }}
      >

        {/* SECTION 2: Brown Textures Background Section */}
        <section id="gallery" className="relative z-10 w-full min-h-[50vh] xl:min-h-screen flex flex-col items-center justify-start overflow-hidden pb-16">
          {/* Scallop Edge Divider (ria_transparent.png) */}
          <div 
            className="absolute top-[-4px] lg:top-[-3px] left-0 right-0 z-20 w-full h-[150px] pointer-events-none"
            style={{
              backgroundImage: "url('/images/ria_transparent.png')",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'top center',
              backgroundSize: '100% auto',
            }}
          />
          
          {/* Content */}
          <div className="relative z-20 flex flex-col items-center justify-start w-full px-4 pt-11 sm:pt-28 lg:pt-36">
            {/* GALLERY Title Header (Static div, non-clickable) */}
            <div 
              className="group relative flex items-center justify-center py-1 px-8 sm:py-1.5 sm:px-14 lg:py-2.5 lg:px-18 bg-[#FAF6EE] border-2 sm:border-[3px] lg:border-[3.5px] border-dashed border-[#4A4542] rounded-[10px] text-[#4A4542] min-w-[170px] sm:min-w-[270px] lg:min-w-[370px] shadow-[0_3px_6px_rgba(0,0,0,0.05)] cursor-default select-none mb-5 sm:mb-8 lg:mb-14"
            >
              <div className="absolute left-2.5 sm:left-4 lg:left-5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] sm:w-[28px] sm:h-[28px] lg:w-[37px] lg:h-[37px] flex items-center justify-center">
                <Image
                  src="/images/sao.svg"
                  alt="star icon"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-extrabold text-[27px] sm:text-[38px] lg:text-[30px] tracking-widest font-mono relative translate-x-[3px]">
                (GALLERY)
              </span>
              <div className="absolute right-2.5 sm:right-4 lg:right-5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] sm:w-[28px] sm:h-[28px] lg:w-[37px] lg:h-[37px] flex items-center justify-center">
                <Image
                  src="/images/sao.svg"
                  alt="star icon"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            {/* GALLERY CAROUSEL CONTAINER */}
            <div className="w-full max-w-4xl relative -mt-2 sm:-mt-12 md:-mt-16">
              <CoverFlowCarousel slides={slides} />
            </div>
          </div>
        </section>
      </div>

      {/* Combined Next Blue Background Wrapper */}
      <div 
        className="relative w-full flex flex-col -mt-4 sm:-mt-[1.5px] lg:-mt-[26.5px]"
        style={{
          backgroundImage: "url('/images/trang-chu.jpg')",
          backgroundRepeat: 'repeat',
          backgroundPosition: 'top center',
          backgroundSize: '100% auto',
        }}
      >
        {/* SECTION 5: Next Blue Background Section 1 (Price List) */}
        <section id="commission" className="relative z-10 w-full min-h-screen flex flex-col items-center justify-start overflow-hidden pt-14 lg:pt-18 pb-[214px] px-2 sm:px-4 md:px-6">
          {/* PRICE LIST Title Header */}
          <div 
            className="group relative flex items-center justify-center py-1 px-8 sm:py-1.5 sm:px-14 lg:py-2.5 lg:px-18 bg-[#FAF6EE] border-2 sm:border-[3px] lg:border-[3.5px] border-dashed border-[#4A4542] rounded-[10px] text-[#4A4542] min-w-[170px] sm:min-w-[270px] lg:min-w-[370px] shadow-[0_3px_6px_rgba(0,0,0,0.05)] cursor-default select-none mb-5 sm:mb-8 lg:mb-14"
          >
            <div className="absolute left-2.5 sm:left-4 lg:left-5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] sm:w-[28px] sm:h-[28px] lg:w-[37px] lg:h-[37px] flex items-center justify-center">
              <Image
                src="/images/sao.svg"
                alt="star icon"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-extrabold text-[27px] sm:text-[38px] lg:text-[30px] tracking-widest font-mono relative translate-x-[3px]">
              (PRICE LIST)
            </span>
            <div className="absolute right-2.5 sm:right-4 lg:right-5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] sm:w-[28px] sm:h-[28px] lg:w-[37px] lg:h-[37px] flex items-center justify-center">
              <Image
                src="/images/sao.svg"
                alt="star icon"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Core pricing details: Table (Lace Card) & Diagram */}
          <div className="w-full max-w-[1360px] grid grid-cols-1 sm:grid-cols-[1.4fr_1fr] lg:grid-cols-[1.7fr_1fr] gap-6 md:gap-11 lg:gap-16 items-center justify-items-center mb-12 sm:mb-16">
            
            {/* Left Column: Pricing Table inside Lace Card */}
            <div 
              className="relative w-full max-w-[387px] sm:max-w-[517px] lg:max-w-[619px] aspect-[950/611] flex items-center justify-center justify-self-center md:justify-self-start lg:translate-x-[10%]"
              style={{
                backgroundImage: "url('/images/lace2.svg')",
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {/* Inner content wrapper, padded to fit inside the plain center box of the lace card */}
              <div className="w-[74%] h-[68%] flex flex-col justify-center text-black font-mono px-2 sm:px-4 lg:translate-x-[0px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-black">
                      <th className="pt-[4px] pb-[1px] sm:pt-[6px] sm:pb-[1px] lg:pt-[8px] lg:pb-[8px] font-normal text-[14px] sm:text-[15.5px] lg:text-[16.8px] tracking-wider w-[48%] whitespace-nowrap">
                        <span className="relative inline-block translate-y-[2px] sm:translate-y-[3.5px] lg:translate-y-[4.5px]">(TYPE)</span>
                      </th>
                      <th className="pt-[4px] pb-[1px] sm:pt-[6px] sm:pb-[1px] lg:pt-[8px] lg:pb-[8px] text-left font-normal text-[14px] sm:text-[15.5px] lg:text-[16.8px] tracking-wider whitespace-nowrap">
                        <span className="relative inline-block translate-y-[2px] sm:translate-y-[3.5px] lg:translate-y-[4.5px]">(PRICE)</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {prices.map((priceItem, index) => (
                      <tr key={priceItem.id || index} className="border-b border-black/40">
                        <td className="pt-[2px] pb-[1px] sm:pt-[4px] sm:pb-[1px] lg:pt-[6px] lg:pb-[2px] font-normal text-[14px] sm:text-[15.5px] lg:text-[16.8px] tracking-wide whitespace-nowrap">
                          <span className="relative inline-block translate-y-[-1px] sm:translate-y-[0.5px] lg:translate-y-[1.5px]">{priceItem.type}</span>
                        </td>
                        <td className="pt-[2px] pb-[1px] sm:pt-[4px] sm:pb-[1px] lg:pt-[6px] lg:pb-[2px] text-left font-normal text-[14px] sm:text-[15.5px] lg:text-[16.8px] whitespace-nowrap">
                          <span className="relative inline-block translate-y-[-1px] sm:translate-y-[0.5px] lg:translate-y-[1.5px]">{priceItem.price_vnd}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Silhouette Diagram */}
            <div className="relative w-full max-w-[290px] sm:max-w-[340px] lg:max-w-[410px] aspect-[651/970] justify-self-center md:justify-self-end md:-translate-x-12 lg:-translate-x-20">
              <Image
                src="/images/ana.png"
                alt="Crop limits diagram"
                fill
                sizes="(max-width: 640px) 290px, (max-width: 1024px) 340px, 410px"
                className="object-contain pointer-events-none select-none"
                priority
              />
            </div>
          </div>

          {/* Bottom rules & info lists */}
          {(() => {
            const scopeItems = getContent('commission_scope_items', "1 NHÂN VẬT CÓ THIẾT KẾ ĐƠN GIẢN\nBACKGROUND ĐƠN GIẢN (MÀU, GRADIENT, HIỆU ỨNG NHẸ)\nCANVAS 3000 PIXELS TRỞ LÊN, 400DPI\nCANVAS DỌC / VUÔNG (1:1, 3:4, 4:5)").split(/\r?\n|\\n/).filter(Boolean);
            const extraFeesItems = getContent('commission_extra_fees_items', "THIẾT KẾ NHÂN VẬT NHIỀU CHI TIẾT: 100.000VND UP TUỲ MỨC ĐỘ PHỨC TẠP\nCANVAS DÀI (16:9): +50% GIÁ CƠ BẢN\nTHÊM NHÂN VẬT: +100% GIÁ GỐC/CHAR\nBACKGROUND CHI TIẾT (KIẾN TRÚC, NỘI THẤT, PHONG CẢNH, NHIỀU VẬT THỂ...): THƯƠNG LƯỢNG RIÊNG\nPRIVATE COMMISSION (KHÔNG ĐĂNG TẢI CÔNG KHAI): +40%\nCOMMERCIAL USE: 200% GIÁ CƠ BẢN").split(/\r?\n|\\n/).filter(Boolean);

            return (
              <div className="w-full max-w-[1240px] grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-11 lg:gap-16 px-4 font-mono text-black">
                
                {/* Bottom Left Card: Scope info */}
                <div className="flex flex-col items-start w-full max-w-[540px] justify-self-center md:justify-self-start">
                  <span className="inline-block bg-[#5A504D] text-[#FAF6EE] font-normal text-[clamp(11px,3.2vw,28.5px)] lg:text-[16px] tracking-wider py-1 px-2.5 sm:py-1.2 sm:px-3.5 rounded-lg select-none whitespace-nowrap">
                    {getContent('commission_scope_title', 'BẢNG GIÁ TRÊN ÁP DỤNG VỚI TRANH GỒM:')}
                  </span>
                  <div className="pl-6 sm:pl-8 lg:pl-10 w-full">
                    <ul className="mt-3 space-y-[2px] text-[21.5px] sm:text-[25px] lg:text-[16px] leading-[1.3] font-normal">
                      {scopeItems.map((item, i) => (
                        <li key={i}>
                          <span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Right Card: Extra fees info */}
                <div className="flex flex-col items-start w-full max-w-[540px] justify-self-center md:justify-self-end md:translate-x-[5%]">
                  <span className="inline-block bg-[#5A504D] text-[#FAF6EE] font-normal text-[21.5px] sm:text-[25px] lg:text-[16px] tracking-wider py-1 px-2.5 sm:py-1.2 sm:px-3.5 rounded-lg select-none">
                    {getContent('commission_extra_fees_title', 'PHỤ PHÍ')}
                  </span>
                  <div className="pl-6 sm:pl-8 lg:pl-10 w-full">
                    <ul className="mt-3 space-y-[2px] text-[21.5px] sm:text-[25px] lg:text-[16px] leading-[1.3] font-normal">
                      {extraFeesItems.map((item, i) => (
                        <li key={i}>
                          <span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="mt-2.5 pl-3 sm:pl-4 lg:pl-5 text-[21.5px] sm:text-[25px] lg:text-[16px] font-normal text-black leading-[1.3] w-full">
                    {getContent('commission_extra_fees_note', 'PHỤ PHÍ SẼ ĐƯỢC MÌNH BÁO VÀ THỐNG NHẤT SAU KHI HOÀN THIỆN BƯỚC SKETCH')}
                  </p>
                </div>
              </div>
            );
          })()}
        </section>
      </div>

      {/* Combined White Background Wrapper */}
      <div 
        className="relative w-full flex flex-col -mt-4 sm:-mt-[1.5px] lg:-mt-[26.5px]"
        style={{
          backgroundImage: "url('/images/b%C3%ACa%20tr%E1%BA%AFng.png')",
          backgroundRepeat: 'repeat',
          backgroundPosition: 'top center',
          backgroundSize: '100% auto',
        }}
      >
        {/* Scallop Edge Divider (ria_transparent.png) */}
        <div 
          className="absolute top-[-12px] lg:top-[-11px] left-0 right-0 z-30 w-full h-[150px] pointer-events-none"
          style={{
            backgroundImage: "url('/images/ria_transparent.png')",
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'top center',
            backgroundSize: '100% auto',
            filter: 'brightness(1.03)',
            clipPath: 'inset(3px 0px 0px 0px)',
          }}
        />


        {/* SECTION 8: White Background Section 2 (Terms of Service) */}
        <section id="terms" className="relative z-10 w-full min-h-screen flex flex-col items-center justify-start overflow-hidden pt-6 sm:pt-16 lg:pt-22 pb-16 px-4">
          {/* TERMS OF SERVICE Title Header */}
          <div 
            className="group relative z-20 flex items-center justify-center py-1 px-8 sm:py-1.5 sm:px-14 lg:py-2.5 lg:px-18 bg-[#FAF6EE] border-2 sm:border-[3px] lg:border-[3.5px] border-dashed border-[#4A4542] rounded-[10px] text-[#4A4542] min-w-[170px] sm:min-w-[270px] lg:min-w-[370px] shadow-[0_3px_6px_rgba(0,0,0,0.05)] cursor-default select-none mb-10 sm:mb-14 lg:mb-16"
          >
            <div className="absolute left-2.5 sm:left-4 lg:left-5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] sm:w-[28px] sm:h-[28px] lg:w-[37px] lg:h-[37px] flex items-center justify-center">
              <Image
                src="/images/sao.svg"
                alt="star icon"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-extrabold text-[27px] sm:text-[38px] lg:text-[30px] tracking-widest font-mono relative translate-x-[3px]">
              (TERMS OF SERVICE)
            </span>
            <div className="absolute right-2.5 sm:right-4 lg:right-5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] sm:w-[28px] sm:h-[28px] lg:w-[37px] lg:h-[37px] flex items-center justify-center">
              <Image
                src="/images/sao.svg"
                alt="star icon"
                fill
                className="object-contain"
              />
            </div>
          </div>

          {/* Terms Container Grid (Cascading Staggered Rows) */}
          <div className="w-full max-w-[1240px] flex flex-col space-y-7 sm:space-y-12 lg:space-y-16 px-4 font-mono text-black mt-4">
            
            {/* Row 1: THANH TOÁN (Left) */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 relative">
              <div className="flex flex-col items-start w-full z-10">
                <span className="inline-block bg-[#5A504D] text-[#FAF6EE] font-normal text-[21.5px] sm:text-[25px] lg:text-[16px] tracking-wider py-1 px-2.5 sm:py-1.2 sm:px-3.5 rounded-lg select-none mb-3">
                  THANH TOÁN
                </span>
                <div className="pl-6 sm:pl-8 lg:pl-10 w-full">
                  <ul className="space-y-[2px] text-[18px] sm:text-[22px] lg:text-[16px] leading-[1.3] font-normal">
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> THANH TOÁN QUA CHUYỂN KHOẢN NGÂN HÀNG.</li>
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> THANH TOÁN TRƯỚC 50% KHI 2 BÊN ĐÃ THỐNG NHẤT GIÁ.</li>
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> SAU KHI DUYỆT BẢN NHÁP THÔ (ROUGH SKETCH), KHÁCH VUI LÒNG THANH TOÁN 100% ĐỂ MÌNH BẮT ĐẦU LINE VÀ RENDER.</li>
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> SAU 24 GIỜ KỂ TỪ KHI GỬI THÔNG TIN THANH TOÁN MÀ CHƯA NHẬN ĐƯỢC PHẢN HỒI, MÌNH CÓ QUYỀN HỦY SLOT.</li>
                  </ul>
                </div>
              </div>
              <div className="absolute right-[-20px] sm:right-[-150px] top-[10%] sm:top-[-50px] w-[180px] sm:w-[450px] lg:w-[520px] aspect-[879/513] pointer-events-none select-none z-0">
                <Image
                  src="/images/button1.png"
                  alt="Decorative Button Group 1"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Row 2: QUY TRÌNH LÀM VIỆC (Right) */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 relative">
              <div className="absolute left-[-20px] sm:left-[-150px] top-[-10px] w-[130px] sm:w-[340px] lg:w-[450px] aspect-[567/479] pointer-events-none select-none z-0">
                <Image
                  src="/images/button2.png"
                  alt="Decorative Button Group 2"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden sm:block"></div>
              <div className="flex flex-col items-start w-full md:translate-x-[5%] z-10">
                <span className="inline-block bg-[#5A504D] text-[#FAF6EE] font-normal text-[21.5px] sm:text-[25px] lg:text-[16px] tracking-wider py-1 px-2.5 sm:py-1.2 sm:px-3.5 rounded-lg select-none mb-3">
                  QUY TRÌNH LÀM VIỆC
                </span>
                <div className="pl-6 sm:pl-8 lg:pl-10 w-full text-[18px] sm:text-[22px] lg:text-[16px] leading-[1.3] font-normal">
                  <p className="mb-3 font-normal tracking-wide text-black">
                    BRIEF ➔ SKETCH ➔ THANH TOÁN ➔ LINEART ➔ RENDER ➔ FINAL
                  </p>
                  <p className="mb-2 font-normal text-black">KHI GỬI COMMISSION, CHUẨN BỊ:</p>
                  <ul className="space-y-[2px] pl-4 mb-2">
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> REFERENCE NHÂN VẬT ĐẦY ĐỦ</li>
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> MÔ TẢ TÍNH CÁCH HOẶC BIỂU CẢM MONG MUỐN</li>
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> POSE HOẶC Ý TƯỞNG CỤ THỂ (NẾU CÓ)</li>
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> REFERENCE MÀU SẮC, ÁNH SÁNG, MOOD TRANH (NẾU CÓ)</li>
                  </ul>
                  <p className="text-black text-[16px] sm:text-[20px] lg:text-[16px]">REFERENCE CÀNG ĐẦY ĐỦ THÌ KẾT QUẢ CÀNG SÁT MONG MUỐN.</p>
                </div>
              </div>
            </div>

            {/* Row 3: CHỈNH SỬA (Left) */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 relative">
              <div className="flex flex-col items-start w-full z-10">
                <span className="inline-block bg-[#5A504D] text-[#FAF6EE] font-normal text-[21.5px] sm:text-[25px] lg:text-[16px] tracking-wider py-1 px-2.5 sm:py-1.2 sm:px-3.5 rounded-lg select-none mb-3">
                  CHỈNH SỬA
                </span>
                <div className="pl-6 sm:pl-8 lg:pl-10 w-full text-[18px] sm:text-[22px] lg:text-[16px] leading-[1.2] font-normal text-black space-y-1">
                  <p>GIAI ĐOẠN SKETCH</p>
                  <p className="pl-4"><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> ĐƯỢC SỬA MIỄN PHÍ TỐI ĐA 3 LẦN.</p>
                  <p className="pl-4"><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> VUI LÒNG TỔNG HỢP CÁC CHỈNH SỬA TRONG CÙNG MỘT LẦN PHẢN HỒI.</p>
                  
                  <p className="pt-2">SAU KHI DUYỆT SKETCH</p>
                  <p className="pl-4"><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> CÁC THAY ĐỔI LỚN NHƯ:</p>
                  <p className="pl-10"><span className="text-[1.1em] inline-block align-middle mr-2 -translate-y-[1px] leading-[0]">o</span> ĐỔI POSE</p>
                  <p className="pl-10"><span className="text-[1.1em] inline-block align-middle mr-2 -translate-y-[1px] leading-[0]">o</span> ĐỔI OUTFIT</p>
                  <p className="pl-10"><span className="text-[1.1em] inline-block align-middle mr-2 -translate-y-[1px] leading-[0]">o</span> ĐỔI HAIRSTYLE</p>
                  <p className="pl-10"><span className="text-[1.1em] inline-block align-middle mr-2 -translate-y-[1px] leading-[0]">o</span> ĐỔI THIẾT KẾ NHÂN VẬT</p>
                  <p className="text-black">SẼ PHÁT SINH PHỤ PHÍ.</p>

                  <p className="pt-2">GIAI ĐOẠN RENDER</p>
                  <p className="pl-4"><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> CHỈ HỖ TRỢ CHỈNH CÁC LỖI NHỎ.</p>
                  <p className="pl-4"><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> KHÔNG NHẬN THAY ĐỔI LỚN SAU KHI ĐÃ BẮT ĐẦU RENDER.</p>
                </div>
              </div>
              <div className="absolute right-[-20px] sm:right-[-150px] top-[10px] sm:top-[20px] w-[180px] sm:w-[460px] lg:w-[520px] aspect-[1/1] pointer-events-none select-none z-0">
                <Image
                  src="/images/button3.png"
                  alt="Decorative Button Group 3"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Row 4: THỜI GIAN HOÀN THÀNH (Right) */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 relative">
              <div className="hidden sm:block"></div>
              <div className="flex flex-col items-start w-full md:translate-x-[5%] z-10">
                <span className="inline-block bg-[#5A504D] text-[#FAF6EE] font-normal text-[21.5px] sm:text-[25px] lg:text-[16px] tracking-wider py-1 px-2.5 sm:py-1.2 sm:px-3.5 rounded-lg select-none mb-3">
                  THỜI GIAN HOÀN THÀNH
                </span>
                <div className="pl-6 sm:pl-8 lg:pl-10 w-full text-[18px] sm:text-[22px] lg:text-[16px] leading-[1.3] font-normal text-black">
                  <ul className="space-y-[2px]">
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> THỜI GIAN HOÀN THÀNH DỰ KIẾN: 3-5 TUẦN TÙY ĐỘ PHỨC TẠP VÀ SỐ LƯỢNG ĐƠN ĐANG CHỜ.</li>
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> NẾU CÓ DEADLINE, VUI LÒNG BÁO TRƯỚC KHI ĐẶT COMMISSION.</li>
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> MÌNH SẼ CỐ GẮNG HOÀN THIỆN ĐÚNG THỜI HẠN NHƯNG KHÔNG NHẬN DEADLINE QUÁ GẤP.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Row 5: KHÔNG NHẬN (Left) */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 relative">
              <div className="flex flex-col items-start w-full z-10">
                <span className="inline-block bg-[#5A504D] text-[#FAF6EE] font-normal text-[21.5px] sm:text-[25px] lg:text-[16px] tracking-wider py-1 px-2.5 sm:py-1.2 sm:px-3.5 rounded-lg select-none mb-3">
                  KHÔNG NHẬN
                </span>
                <div className="pl-6 sm:pl-8 lg:pl-10 w-full text-[18px] sm:text-[22px] lg:text-[16px] leading-[1.3] font-normal text-black">
                  <p className="mb-2 font-normal text-black">MÌNH KHÔNG NHẬN NHỮNG ĐƠN CHỨA NỘI DUNG SAU:</p>
                  <ul className="space-y-[2px] pl-4 mb-2">
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> NSFW</li>
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> OLD MAN</li>
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> MECHA/GUNDAM PHỨC TẠP</li>
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> FURRY</li>
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> GORE NẶNG</li>
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> NỘI DUNG VI PHẠM PHÁP LUẬT HOẶC MANG TÍNH XÚC PHẠM</li>
                  </ul>
                  <p className="text-[16px] sm:text-[20px] lg:text-[16px] text-black/80 mt-2">
                    (CÓ THỂ TỪ CHỐI COMMISSION NẾU CẢM THẤY KHÔNG PHÙ HỢP VỚI KHẢ NĂNG HOẶC PHONG CÁCH HIỆN TẠI.)
                  </p>
                </div>
              </div>
              <div className="absolute right-[-30px] sm:right-[-195px] top-[10px] w-[200px] sm:w-[580px] lg:w-[660px] aspect-[1029/531] pointer-events-none select-none z-0">
                <Image
                  src="/images/button4.png"
                  alt="Decorative Button Group 4"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Row 6: QUYỀN SỬ DỤNG (Right) */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 relative">
              <div className="absolute left-[-30px] sm:left-[-170px] top-[30px] sm:top-[-50px] w-[180px] sm:w-[480px] lg:w-[440px] aspect-[834/671] pointer-events-none select-none z-0">
                <Image
                  src="/images/button5.png"
                  alt="Decorative Button Group 5"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              <div className="hidden sm:block"></div>
              <div className="flex flex-col items-start w-full md:translate-x-[5%] z-10">
                <span className="inline-block bg-[#5A504D] text-[#FAF6EE] font-normal text-[21.5px] sm:text-[25px] lg:text-[16px] tracking-wider py-1 px-2.5 sm:py-1.2 sm:px-3.5 rounded-lg select-none mb-3">
                  QUYỀN SỬ DỤNG
                </span>
                <div className="pl-6 sm:pl-8 lg:pl-10 w-full text-[18px] sm:text-[22px] lg:text-[16px] leading-[1.3] font-normal text-black">
                  <p className="mb-2 font-normal text-black">KHÁCH HÀNG ĐƯỢC PHÉP</p>
                  <ul className="space-y-[2px] pl-4 mb-4">
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> SỬ DỤNG CHO MỤC ĐÍCH CÁ NHÂN.</li>
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> ĐĂNG TẢI LÊN MẠNG XÃ HỘI CÓ CREDIT.</li>
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> IN ẤN CÁ NHÂN VỚI SỐ LƯỢNG NHỎ.</li>
                  </ul>
                  <p className="mb-2 font-normal text-black">KHÁCH HÀNG KHÔNG ĐƯỢC PHÉP</p>
                  <ul className="space-y-[2px] pl-4">
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> CHỈNH SỬA ARTWORK KHI CHƯA CÓ SỰ ĐỒNG Ý.</li>
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> SỬ DỤNG CHO AI, NFT HOẶC CÁC MỤC ĐÍCH TƯƠNG TỰ.</li>
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> SỬ DỤNG CHO MỤC ĐÍCH THƯƠNG MẠI KHI CHƯA MUA QUYỀN COMMERCIAL USE.</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Row 7: BẢN QUYỀN (Left) */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 relative">
              <div className="flex flex-col items-start w-full z-10">
                <span className="inline-block bg-[#5A504D] text-[#FAF6EE] font-normal text-[21.5px] sm:text-[25px] lg:text-[16px] tracking-wider py-1 px-2.5 sm:py-1.2 sm:px-3.5 rounded-lg select-none mb-3">
                  BẢN QUYỀN
                </span>
                <div className="pl-6 sm:pl-8 lg:pl-10 w-full">
                  <ul className="space-y-[2px] text-[18px] sm:text-[22px] lg:text-[16px] leading-[1.3] font-normal text-black font-mono">
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> MÌNH GIỮ BẢN QUYỀN ĐỐI VỚI ARTWORK DO MÌNH THỰC HIỆN.</li>
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> QUYỀN SỞ HỮU OC/NHÂN VẬT VẪN THUỘC VỀ KHÁCH HÀNG.</li>
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> MỌI HÌNH THỨC SỬ DỤNG THƯƠNG MẠI CẦN ĐƯỢC THỎA THUẬN RIÊNG.</li>
                  </ul>
                </div>
              </div>
              <div className="absolute right-[20px] sm:right-[150px] top-[5px] sm:top-[10px] w-[80px] sm:w-[120px] lg:w-[160px] aspect-[307/316] pointer-events-none select-none z-0">
                <Image
                  src="/images/button6.png"
                  alt="Decorative Button Group 6"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Row 8: QUYỀN ĐĂNG TRANH (Right) */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 relative">
              
              <div className="hidden sm:block"></div>
              <div className="flex flex-col items-start w-full md:translate-x-[5%] z-10">
                <span className="inline-block bg-[#5A504D] text-[#FAF6EE] font-normal text-[21.5px] sm:text-[25px] lg:text-[16px] tracking-wider py-1 px-2.5 sm:py-1.2 sm:px-3.5 rounded-lg select-none mb-3">
                  QUYỀN ĐĂNG TRANH
                </span>
                <div className="pl-6 sm:pl-8 lg:pl-10 w-full">
                  <ul className="space-y-[2px] text-[18px] sm:text-[22px] lg:text-[16px] leading-[1.3] font-normal text-black font-mono">
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> MÌNH CÓ QUYỀN SỬ DỤNG COMMISSION LÀM PORTFOLIO, SAMPLE HOẶC ĐĂNG TẢI TRÊN CÁC NỀN TẢNG MẠNG XÃ HỘI.</li>
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> NẾU KHÔNG MUỐN ARTWORK ĐƯỢC CÔNG KHAI, VUI LÒNG ĐĂNG KÝ PRIVATE COMMISSION (+40%).</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Row 9: TIỀN HÀNG HỦY (Left) */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 relative">
              <div className="flex flex-col items-start w-full z-10">
                <span className="inline-block bg-[#5A504D] text-[#FAF6EE] font-normal text-[21.5px] sm:text-[25px] lg:text-[16px] tracking-wider py-1 px-2.5 sm:py-1.2 sm:px-3.5 rounded-lg select-none mb-3">
                  VỀ VIỆC HỦY COMMISSION
                </span>
                <div className="pl-6 sm:pl-8 lg:pl-10 w-full text-[18px] sm:text-[22px] lg:text-[16px] leading-[1.3] font-normal text-black font-mono">
                  <p className="mb-2 font-normal text-black">KHÁCH HÀNG HỦY:</p>
                  <ul className="space-y-[2px] pl-4 mb-4">
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> SAU KHI DUYỆT SKETCH: HOÀN LẠI 50% GIÁ TRỊ COMMISSION.</li>
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> SAU KHI ĐÃ BẮT ĐẦU LINE/RENDER: KHÔNG HOÀN TIỀN.</li>
                  </ul>
                  
                  <p className="mb-2 font-normal text-black">NẾU MÌNH HỦY:</p>
                  <ul className="space-y-[2px] pl-4 text-black font-mono">
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> HOÀN LẠI TOÀN BỘ HOẶC MỘT PHẦN CHI PHÍ TÙY THEO TIẾN ĐỘ ĐÃ THỰC HIỆN.</li>
                  </ul>
                </div>
              </div>
              <div className="absolute left-[-20px] sm:left-[80px] bottom-[-50px] sm:bottom-[-470px] w-[80px] sm:w-[180px] lg:w-[290px] aspect-[1/1] pointer-events-none select-none z-0">
                <Image
                  src="/images/button7.png"
                  alt="Decorative Button Group 7"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Row 10: LƯU Ý (Right) */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 relative">
              <div className="hidden sm:block"></div>
              <div className="flex flex-col items-start w-full md:translate-x-[5%] z-10">
                <span className="inline-block bg-[#5A504D] text-[#FAF6EE] font-normal text-[21.5px] sm:text-[25px] lg:text-[16px] tracking-wider py-1 px-2.5 sm:py-1.2 sm:px-3.5 rounded-lg select-none mb-3">
                  LƯU Ý
                </span>
                <div className="pl-6 sm:pl-8 lg:pl-10 w-full text-black font-mono">
                  <ul className="space-y-[2px] text-[18px] sm:text-[22px] lg:text-[16px] leading-[1.3] font-normal">
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> VUI LÒNG CHỈ ĐẶT COMMISSION KHI BẠN CÓ THỂ CHỦ ĐỘNG THANH TOÁN VÀ PHẢN HỒI TRONG QUÁ TRÌNH LÀM VIỆC.</li>
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> MÌNH ƯU TIÊN NHỮNG KHÁCH HÀNG LỊCH SỰ, HỢP TÁC VÀ PHẢN HỒI RÕ RÀNG.</li>
                    <li><span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> KHI ĐẶT COMMISSION ĐỒNG NGHĨA VỚI VIỆC BẠN ĐÃ ĐỌC VÀ ĐỒNG Ý VỚI TOÀN BỘ ĐIỀU KHOẢN TRÊN.</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </section>

      </div>


      {/* Footer Section */}
      <footer 
        className="relative w-full py-8 md:py-12 px-4 sm:px-12 md:px-16 flex flex-row items-center justify-between gap-4 overflow-hidden z-30"
        style={{
          backgroundImage: "url('/images/trang-chu-nau-v2.jpg')",
          backgroundColor: '#4D4845',
        
          backgroundRepeat: 'repeat',
          backgroundPosition: 'top center',
          backgroundSize: '100% auto',
        }}
      >
        {/* Left: Signature with drop shadow */}
        <div className="relative w-[clamp(120px,26vw,380px)] aspect-[2049/1014] select-none pointer-events-none filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.3)] translate-y-0 lg:translate-y-[10px]">
          <Image
            src="/images/sign - Copy.png"
            alt="Mingiee Signature"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Right: Copyright text */}
        <div className="font-mono text-[clamp(10px,2.5vw,33px)] text-[#FFFFFF] opacity-100 select-none translate-y-0 lg:translate-y-[100px]">
          © Copyright 2026: Mingiee
        </div>
      </footer>

    </div>
  )
}
