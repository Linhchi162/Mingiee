import Image from 'next/image'
import Navbar from '@/components/Navbar'
import CoverFlowCarousel from '@/components/CoverFlowCarousel'
import { supabase } from '@/lib/supabase'

export const revalidate = 0;

function formatSentenceCase(str: string): string {
  if (!str) return str;
  return str
    .split(/\r?\n|\\n/)
    .map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      let formatted = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
      const uppercaseWords = ['Vnd', 'Nsfw', 'Dpi', 'Oc', 'Nft', 'Ai', 'Gundam', 'Mecha', 'Furry', 'Gore', 'Canvas', 'Brief', 'Sketch', 'Lineart', 'Render', 'Final'];
      uppercaseWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'gi');
        formatted = formatted.replace(regex, (match) => {
          if (match.toLowerCase() === 'vnd') return 'VND';
          if (match.toLowerCase() === 'nsfw') return 'NSFW';
          if (match.toLowerCase() === 'dpi') return 'DPI';
          if (match.toLowerCase() === 'oc') return 'OC';
          if (match.toLowerCase() === 'nft') return 'NFT';
          if (match.toLowerCase() === 'ai') return 'AI';
          return match.charAt(0).toUpperCase() + match.slice(1);
        });
      });
      return formatted;
    })
    .join('\n');
}

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

  // Fetch terms of service
  const { data: dbTerms } = await supabase
    .from('terms_of_service')
    .select('*')
    .order('display_order', { ascending: true })

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

  const defaultTerms = [
    {
      id: 1,
      title: 'THANH TOÁN',
      content: `- Thanh toán qua chuyển khoản ngân hàng.
- Thanh toán trước 50% khi 2 bên đã thống nhất giá.
- Sau khi duyệt bản nháp thô (Rough sketch), khách vui lòng thanh toán 100% để mình bắt đầu line và render.
- Sau 24 giờ kể từ khi gửi thông tin thanh toán mà chưa nhận được phản hồi, mình có quyền hủy slot.`
    },
    {
      id: 2,
      title: 'QUY TRÌNH LÀM VIỆC',
      content: `Brief ➔ Sketch ➔ Thanh toán ➔ Lineart ➔ Render ➔ Final
Khi gửi commission, chuẩn bị:
- Reference nhân vật đầy đủ
- Mô tả tính cách hoặc biểu cảm mong muốn
- Pose hoặc ý tưởng cụ thể (nếu có)
- Reference màu sắc, ánh sáng, mood tranh (nếu có)
Reference càng đầy đủ thì kết quả càng sát mong muốn.`
    },
    {
      id: 3,
      title: 'CHỈNH SỬA',
      content: `Giai đoạn Sketch
- Được sửa miễn phí tối đa 3 lần.
- Vui lòng tổng hợp các chỉnh sửa trong cùng một lần phản hồi.
Sau khi duyệt Sketch
- Các thay đổi lớn như:
-- Đổi pose
-- Đổi outfit
-- Đổi hairstyle
-- Đổi thiết kế nhân vật
Sẽ phát sinh phụ phí.
Giai đoạn Render
- Chỉ hỗ trợ chỉnh các lỗi nhỏ.
- Không nhận thay đổi lớn sau khi đã bắt đầu render.`
    },
    {
      id: 4,
      title: 'THỜI GIAN HOÀN THÀNH',
      content: `- Thời gian hoàn thành dự kiến: 3-5 tuần tùy độ phức tạp và số lượng đơn đang chờ.
- Nếu có deadline, vui lòng báo trước khi đặt commission.
- Mình sẽ cố gắng hoàn thiện đúng thời hạn nhưng không nhận deadline quá gấp.`
    },
    {
      id: 5,
      title: 'KHÔNG NHẬN',
      content: `Mình không nhận những đơn chứa nội dung sau:
- NSFW
- Old man
- Mecha/Gundam phức tạp
- Furry
- Gore nặng
- Nội dung vi phạm pháp luật hoặc mang tính xúc phạm
(Có thể từ chối commission nếu cảm thấy không phù hợp với khả năng hoặc phong cách hiện tại.)`
    },
    {
      id: 6,
      title: 'QUYỀN SỬ DỤNG',
      content: `Khách hàng được phép
- Sử dụng cho mục đích cá nhân.
- Đăng tải lên mạng xã hội có credit.
- In ấn cá nhân với số lượng nhỏ.
Khách hàng không được phép
- Chỉnh sửa artwork khi chưa có sự đồng ý.
- Sử dụng cho AI, NFT hoặc các mục đích tương tự.
- Sử dụng cho mục đích thương mại khi chưa mua quyền Commercial use.`
    },
    {
      id: 7,
      title: 'BẢN QUYỀN',
      content: `- Mình giữ bản quyền đối với artwork do mình thực hiện.
- Quyền sở hữu OC/nhân vật vẫn thuộc về khách hàng.
- Mọi hình thức sử dụng thương mại cần được thỏa thuận riêng.`
    },
    {
      id: 8,
      title: 'QUYỀN ĐĂNG TRANH',
      content: `- Mình có quyền sử dụng commission làm portfolio, sample hoặc đăng tải trên các nền tảng mạng xã hội.
- Nếu không muốn artwork được công khai, vui lòng đăng ký Private commission (+40%).`
    },
    {
      id: 9,
      title: 'VỀ VIỆC HỦY COMMISSION',
      content: `Khách hàng hủy:
- Sau khi duyệt sketch: hoàn lại 50% giá trị commission.
- Sau khi đã bắt đầu line/render: không hoàn tiền.
Nếu mình hủy:
- Hoàn lại toàn bộ hoặc một phần chi phí tùy theo tiến độ đã thực hiện.`
    },
    {
      id: 10,
      title: 'LƯU Ý',
      content: `- Vui lòng chỉ đặt commission khi bạn có thể chủ động thanh toán và phản hồi trong quá trình làm việc.
- Mình ưu tiên những khách hàng lịch sự, hợp tác và phản hồi rõ ràng.
- Khi đặt commission đồng nghĩa với việc bạn đã đọc và đồng ý với toàn bộ điều khoản trên.`
    }
  ]

  const terms = dbTerms && dbTerms.length > 0 ? dbTerms : defaultTerms
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
          <p className="text-[13px] sm:text-[clamp(23px,2.6vw,30px)] lg:text-[18px] font-extrabold tracking-widest leading-[1.2]">
            {getContent('welcome_line1', "HI, I'M MINGIEE!")}
          </p>
          <p className="text-[13px] sm:text-[clamp(23px,2.6vw,30px)] lg:text-[18px] font-extrabold tracking-widest leading-[1.2]">
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
        <section id="gallery" className="relative z-10 w-full min-h-[40vh] sm:min-h-[50vh] xl:min-h-screen flex flex-col items-center justify-start overflow-hidden pb-2 sm:pb-16">
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
              className="group relative flex items-center justify-center py-1 px-[26px] sm:px-10 lg:px-12 bg-[#FAF6EE] border-[1.6px] sm:border-[2px] lg:border-[2.3px] border-dashed border-[#4A4542] rounded-[7px] text-[#4A4542] min-w-[110px] sm:min-w-[180px] lg:min-w-[220px] shadow-[0_3px_6px_rgba(0,0,0,0.05)] cursor-default select-none mb-5 sm:mb-8 lg:mb-14"
            >
              <div className="absolute left-[13px] sm:left-3 lg:left-4 top-1/2 -translate-y-1/2 w-[11px] h-[11px] sm:w-[15px] sm:h-[15px] lg:w-[19px] lg:h-[19px] flex items-center justify-center">
                <Image
                  src="/images/sao.svg"
                  alt="star icon"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="font-extrabold text-[10px] sm:text-[19.5px] lg:text-[16px] tracking-widest font-mono relative translate-x-[3px]">
                (GALLERY)
              </span>
              <div className="absolute right-[9px] sm:right-3 lg:right-4 top-1/2 -translate-y-1/2 w-[11px] h-[11px] sm:w-[15px] sm:h-[15px] lg:w-[19px] lg:h-[19px] flex items-center justify-center">
                <Image
                  src="/images/sao.svg"
                  alt="star icon"
                  fill
                  className="object-contain"
                />
              </div>
            </div>
            {/* GALLERY CAROUSEL CONTAINER */}
            <div className="w-full max-w-4xl relative -mt-[28px] sm:-mt-12 md:-mt-16">
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
        <section id="commission" className="relative z-10 w-full min-h-screen flex flex-col items-center justify-start overflow-hidden pt-11 sm:pt-14 lg:pt-18 pb-[214px] px-2 sm:px-4 md:px-6">
          {/* PRICE LIST Title Header */}
          <div 
            className="group relative flex items-center justify-center py-1 px-[26px] sm:px-10 lg:px-12 bg-[#FAF6EE] border-[1.6px] sm:border-[2px] lg:border-[2.3px] border-dashed border-[#4A4542] rounded-[7px] text-[#4A4542] min-w-[110px] sm:min-w-[180px] lg:min-w-[220px] shadow-[0_3px_6px_rgba(0,0,0,0.05)] cursor-default select-none mb-5 sm:mb-8 lg:mb-14"
          >
            <div className="absolute left-[13px] sm:left-3 lg:left-4 top-1/2 -translate-y-1/2 w-[11px] h-[11px] sm:w-[15px] sm:h-[15px] lg:w-[19px] lg:h-[19px] flex items-center justify-center">
              <Image
                src="/images/sao.svg"
                alt="star icon"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-extrabold text-[10px] sm:text-[19.5px] lg:text-[16px] tracking-widest font-mono relative translate-x-[3px]">
              (PRICE LIST)
            </span>
            <div className="absolute right-[9px] sm:right-3 lg:right-4 top-1/2 -translate-y-1/2 w-[11px] h-[11px] sm:w-[15px] sm:h-[15px] lg:w-[19px] lg:h-[19px] flex items-center justify-center">
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
              className="relative w-full max-w-[372px] sm:max-w-[497px] lg:max-w-[594px] aspect-[950/611] flex items-center justify-center justify-self-center md:justify-self-start lg:translate-x-[10%]"
              style={{
                backgroundImage: "url('/images/lace2.svg')",
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              {/* Inner content wrapper, padded to fit inside the plain center box of the lace card */}
              <div className="w-[66%] h-[68%] flex flex-col justify-center text-[#4A4542] font-mono px-2 sm:px-4 lg:translate-x-[0px]">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-2 border-[#4A4542]">
                      <th className="pt-[4px] pb-[1px] sm:pt-[6px] sm:pb-[1px] lg:pt-[8px] lg:pb-[8px] font-extrabold text-[13px] sm:text-[15.5px] lg:text-[16.5px] tracking-wider w-[50%] whitespace-nowrap">
                        <span className="relative inline-block translate-y-[4px] sm:translate-y-[3.5px] lg:translate-y-[4.5px]">(TYPE)</span>
                      </th>
                      <th className="pt-[4px] pb-[1px] sm:pt-[6px] sm:pb-[1px] lg:pt-[8px] lg:pb-[8px] font-extrabold text-[13px] sm:text-[15.5px] lg:text-[16.5px] tracking-wider whitespace-nowrap">
                        <div className="w-full flex justify-end">
                          <div className="w-[144px] lg:w-[158px] text-left whitespace-nowrap translate-x-[37px] sm:translate-x-[12px]">
                            <span className="relative inline-block translate-y-[4px] sm:translate-y-[3.5px] lg:translate-y-[4.5px]">(PRICE)</span>
                          </div>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {prices.map((priceItem, index) => (
                      <tr key={priceItem.id || index} className="border-b border-[#4A4542]/40">
                        <td className={`pb-[1px] sm:pb-[1px] lg:pb-[2px] font-normal text-[13px] sm:text-[15.5px] lg:text-[16.5px] tracking-wide whitespace-nowrap ${index === 0 ? 'pt-[9px] sm:pt-[4px] lg:pt-[36px]' : 'pt-[2px] sm:pt-[4px] lg:pt-[6px]'}`}>
                          <span className="relative inline-block translate-y-[1px] sm:translate-y-[0.5px] lg:translate-y-[1.5px]">{priceItem.type}</span>
                        </td>
                        <td className={`pb-[1px] sm:pb-[1px] lg:pb-[2px] font-normal text-[13px] sm:text-[15.5px] lg:text-[16.5px] whitespace-nowrap ${index === 0 ? 'pt-[9px] sm:pt-[4px] lg:pt-[36px]' : 'pt-[2px] sm:pt-[4px] lg:pt-[6px]'}`}>
                          <div className="w-full flex justify-end">
                            <div className="w-[144px] lg:w-[158px] text-left whitespace-nowrap translate-x-[37px] sm:translate-x-[12px]">
                              <span className="relative inline-block translate-y-[1px] sm:translate-y-[0.5px] lg:translate-y-[1.5px]">{priceItem.price_vnd}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Silhouette Diagram */}
            <div className="relative w-full max-w-[377px] sm:max-w-[442px] lg:max-w-[533px] aspect-[651/970] justify-self-center md:justify-self-end md:-translate-x-12 lg:-translate-x-20">
              <Image
                src="/images/ana.png"
                alt="Crop limits diagram"
                fill
                sizes="(max-width: 640px) 377px, (max-width: 1024px) 442px, 533px"
                className="object-contain pointer-events-none select-none"
                priority
              />
            </div>
          </div>

          {/* Bottom rules & info lists */}
          {(() => {
            const rawScope = getContent('commission_scope_items', "1 nhân vật có thiết kế đơn giản\nBackground đơn giản (màu, gradient, hiệu ứng nhẹ)\nCanvas 3000 pixels trở lên, 400DPI\nCanvas dọc / vuông (1:1, 3:4, 4:5)");
            const scopeItems = formatSentenceCase(rawScope).split('\n').filter(Boolean);

            const rawExtraFees = getContent('commission_extra_fees_items', "Thiết kế nhân vật nhiều chi tiết: 100.000VND up tuỳ mức độ phức tạp\nCanvas dài (16:9): +50% giá cơ bản\nThêm nhân vật: +100% giá gốc/char\nBackground chi tiết (kiến trúc, nội thất, phong cảnh, nhiều vật thể...): Thương lượng riêng\nPrivate commission (không đăng tải công khai): +40%\nCommercial use: 200% giá cơ bản");
            const extraFeesItems = formatSentenceCase(rawExtraFees).split('\n').filter(Boolean);

            return (
              <div className="w-full max-w-[1240px] grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-11 lg:gap-16 px-4 font-mono text-black">
                
                {/* Bottom Left Card: Scope info */}
                <div className="flex flex-col items-start w-full max-w-[540px] justify-self-center md:justify-self-start">
                  <span className="inline-block bg-[#5A504D] text-[#FAF6EE] font-normal text-[13px] sm:text-[25px] lg:text-[16px] tracking-wider py-1 px-2.5 sm:py-1.2 sm:px-3.5 rounded-lg select-none whitespace-nowrap">
                    {getContent('commission_scope_title', 'BẢNG GIÁ TRÊN ÁP DỤNG VỚI TRANH GỒM:')}
                  </span>
                  <div className="pl-[10px] sm:pl-[14px] lg:pl-[17px] w-full">
                    <ul className="mt-3 space-y-[2px] text-[13px] sm:text-[25px] lg:text-[16px] leading-[1.3] font-normal">
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
                  <span className="inline-block bg-[#5A504D] text-[#FAF6EE] font-normal text-[13px] sm:text-[25px] lg:text-[16px] tracking-wider py-1 px-2.5 sm:py-1.2 sm:px-3.5 rounded-lg select-none">
                    {getContent('commission_extra_fees_title', 'PHỤ PHÍ')}
                  </span>
                  <div className="pl-[10px] sm:pl-[14px] lg:pl-[17px] w-full">
                    <ul className="mt-3 space-y-[2px] text-[13px] sm:text-[25px] lg:text-[16px] leading-[1.3] font-normal">
                      {extraFeesItems.map((item, i) => (
                        <li key={i}>
                          <span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span> {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="mt-2.5 pl-[8px] sm:pl-[10px] lg:pl-[12px] text-[13px] sm:text-[25px] lg:text-[16px] font-normal text-black leading-[1.3] w-full">
                    {formatSentenceCase(getContent('commission_extra_fees_note', 'Phụ phí sẽ được mình báo và thống nhất sau khi hoàn thiện bước sketch'))}
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
        <section id="terms" className="relative z-10 w-full min-h-screen flex flex-col items-center justify-start overflow-hidden pt-11 sm:pt-16 lg:pt-22 pb-16 px-4">
          {/* TERMS OF SERVICE Title Header */}
          <div 
            className="group relative z-20 flex items-center justify-center py-1 px-[26px] sm:px-10 lg:px-12 bg-[#FAF6EE] border-[1.6px] sm:border-[2px] lg:border-[2.3px] border-dashed border-[#4A4542] rounded-[7px] text-[#4A4542] min-w-[110px] sm:min-w-[180px] lg:min-w-[220px] shadow-[0_3px_6px_rgba(0,0,0,0.05)] cursor-default select-none mb-10 sm:mb-14 lg:mb-16"
          >
            <div className="absolute left-[13px] sm:left-3 lg:left-4 top-1/2 -translate-y-1/2 w-[11px] h-[11px] sm:w-[15px] sm:h-[15px] lg:w-[19px] lg:h-[19px] flex items-center justify-center">
              <Image
                src="/images/sao.svg"
                alt="star icon"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-extrabold text-[10px] sm:text-[19.5px] lg:text-[16px] tracking-widest font-mono relative translate-x-[3px]">
              (TERMS OF SERVICE)
            </span>
            <div className="absolute right-[9px] sm:right-3 lg:right-4 top-1/2 -translate-y-1/2 w-[11px] h-[11px] sm:w-[15px] sm:h-[15px] lg:w-[19px] lg:h-[19px] flex items-center justify-center">
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
            {terms.map((term, index) => {
              const isEven = index % 2 === 0;
              
              // Helper to parse content with custom bullet styling
              const lines = term.content.split(/\n/);
              
              const buttonStyles: Record<string, { className: string, aspect: string, src: string }> = {
                button1: { className: 'right-[-20px] sm:right-[-150px] top-[10%] sm:top-[-50px] w-[180px] sm:w-[450px] lg:w-[520px]', aspect: 'aspect-[879/513]', src: '/images/button1.png' },
                button2: { className: 'left-[-20px] sm:left-[-150px] top-[30px] sm:top-[-10px] w-[130px] sm:w-[340px] lg:w-[450px]', aspect: 'aspect-[567/479]', src: '/images/button2.png' },
                button3: { className: 'right-[-20px] sm:right-[-150px] top-[10px] sm:top-[20px] w-[180px] sm:w-[460px] lg:w-[520px]', aspect: 'aspect-[1/1]', src: '/images/button3.png' },
                button4: { className: 'right-[-30px] sm:right-[-195px] top-[10px] w-[200px] sm:w-[580px] lg:w-[660px]', aspect: 'aspect-[1029/531]', src: '/images/button4.png' },
                button5: { className: 'left-[-30px] sm:left-[-170px] top-[30px] sm:top-[-50px] w-[180px] sm:w-[480px] lg:w-[440px]', aspect: 'aspect-[834/671]', src: '/images/button5.png' },
                button6: { className: 'right-[20px] sm:right-[150px] top-[5px] sm:top-[10px] w-[80px] sm:w-[120px] lg:w-[160px]', aspect: 'aspect-[307/316]', src: '/images/button6.png' },
                button7: { className: 'left-[-20px] sm:left-[80px] bottom-[-50px] sm:bottom-[-470px] w-[80px] sm:w-[180px] lg:w-[290px]', aspect: 'aspect-[1/1]', src: '/images/button7.png' }
              };
              
              let decorationImage = 'none';
              if ((term as any).image_name !== undefined && (term as any).image_name !== null) {
                decorationImage = (term as any).image_name;
              } else {
                // Fallback to original positions
                const originalMap: Record<number, string> = {
                  0: 'button1',
                  1: 'button2',
                  2: 'button3',
                  3: 'none',
                  4: 'button4',
                  5: 'button5',
                  6: 'button6',
                  7: 'none',
                  8: 'button7',
                  9: 'none'
                };
                decorationImage = originalMap[index] || 'none';
              }
              
              const btnStyle = buttonStyles[decorationImage];

              return (
                <div key={term.id || index} className="w-full grid grid-cols-1 sm:grid-cols-2 gap-8 relative">
                  
                  {/* Left Column for Even, Spacer for Odd */}
                  {!isEven && <div className="hidden sm:block"></div>}
                  
                  {/* Content Container */}
                  <div className={`flex flex-col items-start w-full z-10 ${!isEven ? 'sm:translate-x-[70px]' : ''}`}>
                    <span className="inline-block bg-[#5A504D] text-[#FAF6EE] font-normal text-[13px] sm:text-[25px] lg:text-[16px] tracking-wider py-1 px-2.5 sm:py-1.2 sm:px-3.5 rounded-lg select-none mb-3">
                      {term.title}
                    </span>
                    <div className="pl-[10px] sm:pl-[14px] lg:pl-[17px] w-full space-y-1 text-[13px] sm:text-[22px] lg:text-[16px] leading-[1.3] font-normal text-black font-mono">
                      {lines.map((line: string, lineIdx: number) => {
                        const trimmed = line.trim();
                        if (!trimmed) return <div key={lineIdx} className="h-2" />;
                        
                        // Sub-bullet Check: starts with "-- " or "  - " or " - " or "- " inside nested indent
                        if (line.startsWith('  -') || line.startsWith(' -') || line.startsWith('--')) {
                          const text = line.replace(/^(\s*-\s*|\s*--\s*)/, '');
                          return (
                            <div key={lineIdx} className="pl-[10px] text-black">
                              <span className="text-[1.2em] inline-block align-middle mr-1.5 -translate-y-[1px] leading-[0]">o</span>
                              <span className="align-middle">{formatSentenceCase(text)}</span>
                            </div>
                          );
                        }
                        
                        // Main Bullet Check: starts with "- " or "* "
                        if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
                          const text = trimmed.replace(/^[-*]\s*/, '');
                          return (
                            <li key={lineIdx} className="list-none text-black">
                              <span className="text-[1.6em] inline-block align-middle mr-1.5 -translate-y-[2px] leading-[0]">•</span>
                              <span className="align-middle">{formatSentenceCase(text)}</span>
                            </li>
                          );
                        }
                        
                        // Default Plain Text / Header
                        return (
                          <p key={lineIdx} className="font-normal text-black">
                            {formatSentenceCase(trimmed)}
                          </p>
                        );
                      })}
                    </div>
                  </div>

                  {/* Decorative Button Images */}
                  {btnStyle && (
                    <div className={`absolute pointer-events-none select-none z-0 ${btnStyle.className} ${btnStyle.aspect}`}>
                      <Image
                        src={btnStyle.src}
                        alt={`Decorative Button Group ${decorationImage}`}
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                  )}
                </div>
              );
            })}
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
        <div className="font-mono text-[clamp(10px,2.5vw,33px)] lg:text-[16px] text-[#FFFFFF] opacity-100 select-none translate-y-0 lg:translate-y-[100px]">
          © Copyright 2026: Mingiee
        </div>
      </footer>

    </div>
  )
}
