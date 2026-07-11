'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

interface User {
    id: string
    email?: string
}

interface Price {
    id?: number
    type: string
    price_vnd: string
    display_order: number
}

interface Slide {
    id?: number
    image_url: string
    title: string
    author: string
    display_order: number
}

interface PlatformLink {
    id?: number
    label: string
    url: string
    display_order: number
}

interface SiteContent {
    key: string
    value: string
}

export default function DashboardComponent() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'gallery' | 'prices' | 'links' | 'content'>('gallery')

    // Data states
    const [slides, setSlides] = useState<Slide[]>([])
    const [prices, setPrices] = useState<Price[]>([])
    const [links, setLinks] = useState<PlatformLink[]>([])
    const [contents, setContents] = useState<Record<string, string>>({
        welcome_line1: "HI, I'M MINGIEE!",
        welcome_line2: "WELCOME TO MY CREATIVE SPACE!",
        commission_scope_title: 'BẢNG GIÁ TRÊN ÁP DỤNG VỚI TRANH GỒM:',
        commission_scope_items: "1 nhân vật có thiết kế đơn giản\nBackground đơn giản (màu, gradient, hiệu ứng nhẹ)\nCanvas 3000 pixels trở lên, 400DPI\nCanvas dọc / vuông (1:1, 3:4, 4:5)",
        commission_extra_fees_title: 'PHỤ PHÍ',
        commission_extra_fees_items: "Thiết kế nhân vật nhiều chi tiết: 100.000VND up tuỳ mức độ phức tạp\nCanvas dài (16:9): +50% giá cơ bản\nThêm nhân vật: +100% giá gốc/char\nBackground chi tiết (kiến trúc, nội thất, phong cảnh, nhiều vật thể...): Thương lượng riêng\nPrivate commission (không đăng tải công khai): +40%\nCommercial use: 200% giá cơ bản",
        commission_extra_fees_note: "Phụ phí sẽ được mình báo và thống nhất sau khi hoàn thiện bước sketch",
        terms_payment_items: "Thanh toán qua chuyển khoản ngân hàng.\nThanh toán trước 50% khi 2 bên đã thống nhất giá.\nSau khi duyệt bản nháp thô (Rough sketch), khách vui lòng thanh toán 100% để mình bắt đầu line và render.\nSau 24 giờ kể từ khi gửi thông tin thanh toán mà chưa nhận được phản hồi, mình có quyền hủy slot.",
        terms_process_flow: "Brief ➔ Sketch ➔ Thanh toán ➔ Lineart ➔ Render ➔ Final",
        terms_process_items: "Reference nhân vật đầy đủ\nMô tả tính cách hoặc biểu cảm mong muốn\nPose hoặc ý tưởng cụ thể (nếu có)\nReference màu sắc, ánh sáng, mood tranh (nếu có)",
        terms_process_note: "Reference càng đầy đủ thì kết quả càng sát mong muốn.",
        terms_revision_sketch_items: "Được sửa miễn phí tối đa 3 lần.\nVui lòng tổng hợp các chỉnh sửa trong cùng một lần phản hồi.",
        terms_revision_after_sketch_items: "Các thay đổi lớn như:\n- Đổi pose\n- Đổi outfit\n- Đổi hairstyle\n- Đổi thiết kế nhân vật",
        terms_revision_render_items: "Chỉ hỗ trợ chỉnh các lỗi nhỏ.\nKhông nhận thay đổi lớn sau khi đã bắt đầu render.",
        terms_time_items: "Thời gian hoàn thành dự kiến: 3-5 tuần tùy độ phức tạp và số lượng đơn đang chờ.\nNếu có deadline, vui lòng báo trước khi đặt commission.\nMình sẽ cố gắng hoàn thiện đúng thời hạn nhưng không nhận deadline quá gấp.",
        terms_declined_items: "NSFW\nOld man\nMecha/Gundam phức tạp\nFurry\nGore nặng\nNội dung vi phạm pháp luật hoặc mang tính xúc phạm",
        terms_declined_note: "(Có thể từ chối commission nếu cảm thấy không phù hợp với khả năng hoặc phong cách hiện tại.)",
        terms_usage_allowed_items: "Sử dụng cho mục đích cá nhân.\nĐăng tải lên mạng xã hội có credit.\nIn ấn cá nhân với số lượng nhỏ.",
        terms_usage_forbidden_items: "Chỉnh sửa artwork khi chưa có sự đồng ý.\nSử dụng cho AI, NFT hoặc các mục đích tương tự.\nSử dụng cho mục đích thương mại khi chưa mua quyền Commercial use.",
        terms_copyright_items: "Mình giữ bản quyền đối với artwork do mình thực hiện.\nQuyền sở hữu OC/nhân vật vẫn thuộc về khách hàng.\nMọi hình thức sử dụng thương mại cần được thỏa thuận riêng.",
        terms_posting_items: "Mình có quyền sử dụng commission làm portfolio, sample hoặc đăng tải trên các nền tảng mạng xã hội.\nNếu không muốn artwork được công khai, vui lòng đăng ký Private commission (+40%).",
        terms_cancel_client_items: "Sau khi duyệt sketch: hoàn lại 50% giá trị commission.\nSau khi đã bắt đầu line/render: không hoàn tiền.",
        terms_cancel_artist_items: "Hoàn lại toàn bộ hoặc một phần chi phí tùy theo tiến độ đã thực hiện.",
        terms_note_items: "Vui lòng chỉ đặt commission khi bạn có thể chủ động thanh toán và phản hồi trong quá trình làm việc.\nMình ưu tiên những khách hàng lịch sự, hợp tác và phản hồi rõ ràng.\nKhi đặt commission đồng nghĩa với việc bạn đã đọc và đồng ý với toàn bộ điều khoản trên."
    })

    // Missing table flags (to warn user if they haven't run SQL)
    const [missingTables, setMissingTables] = useState<string[]>([])

    // Form states
    const [slideForm, setSlideForm] = useState<Slide>({ image_url: '', title: '', author: '', display_order: 1 })
    const [editingSlideId, setEditingSlideId] = useState<number | null>(null)

    const [priceForm, setPriceForm] = useState<Price>({ type: '', price_vnd: '', display_order: 1 })
    const [editingPriceId, setEditingPriceId] = useState<number | null>(null)

    const [linkForm, setLinkForm] = useState<PlatformLink>({ label: '', url: '', display_order: 1 })
    const [editingLinkId, setEditingLinkId] = useState<number | null>(null)

    const [savingContent, setSavingContent] = useState(false)
    const [actionMessage, setActionMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) {
                    window.location.href = '/login'
                } else {
                    setUser(user)
                    // Fetch all admin data
                    await fetchData()
                }
            } catch (error) {
                console.error('Error fetching user:', error)
                window.location.href = '/login'
            } finally {
                setLoading(false)
            }
        }

        getUser()
    }, [])

    const showMessage = (text: string, type: 'success' | 'error' = 'success') => {
        setActionMessage({ text, type })
        setTimeout(() => setActionMessage(null), 4000)
    }

    const fetchData = async () => {
        const missing: string[] = []

        // 1. Fetch Slides
        const { data: slidesData, error: slidesError } = await supabase
            .from('gallery_slides')
            .select('*')
            .order('display_order', { ascending: true })
        if (slidesError) {
            console.error('Error loading gallery_slides:', slidesError)
            missing.push('gallery_slides')
        } else {
            setSlides(slidesData || [])
        }

        // 2. Fetch Prices
        const { data: pricesData, error: pricesError } = await supabase
            .from('prices')
            .select('*')
            .order('display_order', { ascending: true })
        if (pricesError) {
            console.error('Error loading prices:', pricesError)
            missing.push('prices')
        } else {
            setPrices(pricesData || [])
        }

        // 3. Fetch Platform Links
        const { data: linksData, error: linksError } = await supabase
            .from('platform_links')
            .select('*')
            .order('display_order', { ascending: true })
        if (linksError) {
            console.warn('Table platform_links not found. Needs database setup.')
            missing.push('platform_links')
        } else {
            setLinks(linksData || [])
        }

        // 4. Fetch Site Content
        const { data: contentData, error: contentError } = await supabase
            .from('site_content')
            .select('key, value')
        if (contentError) {
            console.warn('Table site_content not found. Needs database setup.')
            missing.push('site_content')
        } else if (contentData) {
            const mappedContent = { ...contents }
            contentData.forEach(item => {
                mappedContent[item.key] = item.value
            })
            setContents(mappedContent)
        }

        setMissingTables(missing)
    }

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut()
            window.location.href = '/'
        } catch (error) {
            console.error('Error signing out:', error)
        }
    }

    // GALLERY CRUD
    const saveSlide = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editingSlideId !== null) {
                const { error } = await supabase
                    .from('gallery_slides')
                    .update(slideForm)
                    .eq('id', editingSlideId)
                if (error) throw error
                showMessage('Slide updated successfully!')
            } else {
                const { error } = await supabase
                    .from('gallery_slides')
                    .insert([slideForm])
                if (error) throw error
                showMessage('Slide created successfully!')
            }
            setSlideForm({ image_url: '', title: '', author: '', display_order: slides.length + 2 })
            setEditingSlideId(null)
            fetchData()
        } catch (err: any) {
            showMessage(err.message, 'error')
        }
    }

    const startEditSlide = (slide: Slide) => {
        setSlideForm({
            image_url: slide.image_url,
            title: slide.title,
            author: slide.author,
            display_order: slide.display_order
        })
        setEditingSlideId(slide.id || null)
    }

    const deleteSlide = async (id: number) => {
        if (!confirm('Are you sure you want to delete this slide?')) return
        try {
            const { error } = await supabase
                .from('gallery_slides')
                .delete()
                .eq('id', id)
            if (error) throw error
            showMessage('Slide deleted successfully!')
            fetchData()
        } catch (err: any) {
            showMessage(err.message, 'error')
        }
    }

    // PRICES CRUD
    const savePrice = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editingPriceId !== null) {
                const { error } = await supabase
                    .from('prices')
                    .update(priceForm)
                    .eq('id', editingPriceId)
                if (error) throw error
                showMessage('Price item updated successfully!')
            } else {
                const { error } = await supabase
                    .from('prices')
                    .insert([priceForm])
                if (error) throw error
                showMessage('Price item created successfully!')
            }
            setPriceForm({ type: '', price_vnd: '', display_order: prices.length + 2 })
            setEditingPriceId(null)
            fetchData()
        } catch (err: any) {
            showMessage(err.message, 'error')
        }
    }

    const startEditPrice = (price: Price) => {
        setPriceForm({
            type: price.type,
            price_vnd: price.price_vnd,
            display_order: price.display_order
        })
        setEditingPriceId(price.id || null)
    }

    const deletePrice = async (id: number) => {
        if (!confirm('Are you sure you want to delete this price item?')) return
        try {
            const { error } = await supabase
                .from('prices')
                .delete()
                .eq('id', id)
            if (error) throw error
            showMessage('Price item deleted successfully!')
            fetchData()
        } catch (err: any) {
            showMessage(err.message, 'error')
        }
    }

    // PLATFORM LINKS CRUD
    const saveLink = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editingLinkId !== null) {
                const { error } = await supabase
                    .from('platform_links')
                    .update(linkForm)
                    .eq('id', editingLinkId)
                if (error) throw error
                showMessage('Platform link updated successfully!')
            } else {
                const { error } = await supabase
                    .from('platform_links')
                    .insert([linkForm])
                if (error) throw error
                showMessage('Platform link created successfully!')
            }
            setLinkForm({ label: '', url: '', display_order: links.length + 2 })
            setEditingLinkId(null)
            fetchData()
        } catch (err: any) {
            showMessage(err.message, 'error')
        }
    }

    const startEditLink = (link: PlatformLink) => {
        setLinkForm({
            label: link.label,
            url: link.url,
            display_order: link.display_order
        })
        setEditingLinkId(link.id || null)
    }

    const deleteLink = async (id: number) => {
        if (!confirm('Are you sure you want to delete this link?')) return
        try {
            const { error } = await supabase
                .from('platform_links')
                .delete()
                .eq('id', id)
            if (error) throw error
            showMessage('Link deleted successfully!')
            fetchData()
        } catch (err: any) {
            showMessage(err.message, 'error')
        }
    }

    // SITE CONTENT SAVE
    const saveContentSettings = async (e: React.FormEvent) => {
        e.preventDefault()
        setSavingContent(true)
        try {
            const upsertData = Object.entries(contents).map(([key, value]) => ({
                key,
                value
            }))

            const { error } = await supabase
                .from('site_content')
                .upsert(upsertData, { onConflict: 'key' })
            if (error) throw error
            showMessage('Website text contents updated successfully!')
            fetchData()
        } catch (err: any) {
            showMessage(err.message, 'error')
        } finally {
            setSavingContent(false)
        }
    }

    const handleContentChange = (key: string, value: string) => {
        setContents(prev => ({
            ...prev,
            [key]: value
        }))
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
            {/* Header */}
            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-amber-400 to-amber-600 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-slate-950 shadow-md">
                            M
                        </div>
                        <h1 className="text-xl font-bold tracking-wider text-slate-100">MINGIEE ADMIN PANEL</h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="hidden sm:inline text-xs text-slate-400 font-mono">Logged in: {user?.email}</span>
                        <Button 
                            onClick={handleLogout} 
                            variant="destructive"
                            className="bg-red-950 border border-red-800 text-red-200 hover:bg-red-900 text-xs px-3 py-1.5 h-auto transition-all"
                        >
                            Log Out
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Admin Section */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-6 lg:px-8">
                {/* Warning Alert for missing tables */}
                {missingTables.length > 0 && (
                    <div className="mb-6 bg-amber-950/40 border border-amber-800/80 rounded-xl p-5 text-amber-200 text-sm shadow-lg shadow-amber-950/20 backdrop-blur-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-amber-500 text-lg font-bold">⚠️</span>
                            <span className="font-bold text-amber-400 tracking-wide uppercase text-xs">Supabase Schema Action Required</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed mb-3">
                            The following tables were not found: <strong className="text-amber-400">{missingTables.join(', ')}</strong>. 
                            To use all admin features, please execute the SQL script in your Supabase SQL Editor:
                        </p>
                        <details className="cursor-pointer bg-slate-900 border border-slate-800 rounded-lg p-3">
                            <summary className="text-xs text-slate-400 hover:text-slate-300 font-semibold select-none">Show SQL Setup Script</summary>
                            <pre className="mt-2 text-xs text-amber-300 overflow-x-auto p-3 bg-slate-950 rounded border border-slate-900 font-mono leading-relaxed select-all">
{`CREATE TABLE IF NOT EXISTS platform_links (
  id BIGSERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE platform_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON platform_links FOR SELECT USING (true);
CREATE POLICY "Allow auth all access" ON platform_links FOR ALL USING (auth.role() = 'authenticated');

CREATE TABLE IF NOT EXISTS site_content (
  id BIGSERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON site_content FOR SELECT USING (true);
CREATE POLICY "Allow auth all access" ON site_content FOR ALL USING (auth.role() = 'authenticated');`}
                            </pre>
                        </details>
                    </div>
                )}

                {/* Floating Messages Alert */}
                {actionMessage && (
                    <div className={`fixed bottom-5 right-5 z-50 px-5 py-3.5 rounded-xl border shadow-xl flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-300 ${
                        actionMessage.type === 'success' 
                            ? 'bg-slate-900 border-green-800 text-green-300 shadow-green-950/20' 
                            : 'bg-slate-900 border-red-800 text-red-300 shadow-red-950/20'
                    }`}>
                        <span>{actionMessage.type === 'success' ? '✅' : '❌'}</span>
                        <span className="font-semibold text-sm">{actionMessage.text}</span>
                    </div>
                )}

                {/* Tab buttons */}
                <div className="flex flex-wrap border-b border-slate-800 gap-1 mb-8">
                    {[
                        { id: 'gallery', label: '🎨 Gallery Manager' },
                        { id: 'prices', label: '💰 Prices Manager' },
                        { id: 'links', label: '🔗 Social Links' },
                        { id: 'content', label: '📝 Website Text Content' },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-5 py-3 font-semibold text-sm tracking-wide rounded-t-xl transition-all ${
                                activeTab === tab.id
                                    ? 'bg-slate-900 border-t-2 border-amber-500 text-slate-100'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* GALLERY TAB */}
                {activeTab === 'gallery' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Column */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg h-fit">
                            <h2 className="text-lg font-bold mb-4 tracking-wide text-slate-200 border-b border-slate-800 pb-2">
                                {editingSlideId !== null ? '✏️ Edit Slide' : '➕ Add Slide'}
                            </h2>
                            <form onSubmit={saveSlide} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Image URL</label>
                                    <input
                                        type="text"
                                        value={slideForm.image_url}
                                        onChange={(e) => setSlideForm({ ...slideForm, image_url: e.target.value })}
                                        placeholder="https://example.com/slide.jpg"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Title</label>
                                        <input
                                            type="text"
                                            value={slideForm.title}
                                            onChange={(e) => setSlideForm({ ...slideForm, title: e.target.value })}
                                            placeholder="Illustration"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Author</label>
                                        <input
                                            type="text"
                                            value={slideForm.author}
                                            onChange={(e) => setSlideForm({ ...slideForm, author: e.target.value })}
                                            placeholder="Mingiee"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Display Order</label>
                                    <input
                                        type="number"
                                        value={slideForm.display_order}
                                        onChange={(e) => setSlideForm({ ...slideForm, display_order: parseInt(e.target.value) || 0 })}
                                        placeholder="1"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                                        required
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button type="submit" className="flex-1 bg-amber-500 text-slate-950 hover:bg-amber-600 font-bold">
                                        {editingSlideId !== null ? 'Update Slide' : 'Create Slide'}
                                    </Button>
                                    {editingSlideId !== null && (
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={() => {
                                                setEditingSlideId(null)
                                                setSlideForm({ image_url: '', title: '', author: '', display_order: slides.length + 1 })
                                            }}
                                            className="border-slate-800 hover:bg-slate-800 text-slate-300"
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* List Column */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-lg font-bold tracking-wide text-slate-200 mb-4 flex justify-between items-center">
                                <span>🖼️ Gallery Slides ({slides.length})</span>
                            </h2>
                            {slides.length === 0 ? (
                                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
                                    No slides found. Add a slide to get started.
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {slides.map(slide => (
                                        <div key={slide.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md flex flex-col">
                                            <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800">
                                                <img 
                                                    src={slide.image_url} 
                                                    alt={slide.title} 
                                                    className="object-contain max-h-40 w-full h-full p-2"
                                                    onError={(e) => { (e.target as any).src = 'https://placehold.co/600x400/1e293b/cbd5e1?text=Invalid+Image+URL' }}
                                                />
                                                <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur border border-slate-800 text-xs px-2 py-1 rounded font-mono">
                                                    Order: {slide.display_order}
                                                </div>
                                            </div>
                                            <div className="p-4 flex-1 flex flex-col justify-between">
                                                <div className="mb-4">
                                                    <h3 className="font-bold text-sm text-slate-200">{slide.title || '(No Title)'}</h3>
                                                    <p className="text-xs text-slate-400 mt-1">By {slide.author || '(Unknown)'}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button 
                                                        onClick={() => startEditSlide(slide)} 
                                                        className="flex-1 bg-slate-800 text-amber-500 hover:bg-slate-700 text-xs font-semibold py-1.5"
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button 
                                                        onClick={() => deleteSlide(slide.id!)} 
                                                        variant="destructive"
                                                        className="flex-1 bg-red-950/50 hover:bg-red-900 text-red-200 border border-red-900 text-xs py-1.5"
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* PRICES TAB */}
                {activeTab === 'prices' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Column */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg h-fit">
                            <h2 className="text-lg font-bold mb-4 tracking-wide text-slate-200 border-b border-slate-800 pb-2">
                                {editingPriceId !== null ? '✏️ Edit Price Item' : '➕ Add Price Item'}
                            </h2>
                            <form onSubmit={savePrice} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Type / Position</label>
                                    <input
                                        type="text"
                                        value={priceForm.type}
                                        onChange={(e) => setPriceForm({ ...priceForm, type: e.target.value })}
                                        placeholder="BUST-UP, FULL-BODY"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Price (VND)</label>
                                    <input
                                        type="text"
                                        value={priceForm.price_vnd}
                                        onChange={(e) => setPriceForm({ ...priceForm, price_vnd: e.target.value })}
                                        placeholder="1.900.000 VND"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Display Order</label>
                                    <input
                                        type="number"
                                        value={priceForm.display_order}
                                        onChange={(e) => setPriceForm({ ...priceForm, display_order: parseInt(e.target.value) || 0 })}
                                        placeholder="1"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                                        required
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button type="submit" className="flex-1 bg-amber-500 text-slate-950 hover:bg-amber-600 font-bold">
                                        {editingPriceId !== null ? 'Update Price' : 'Create Price'}
                                    </Button>
                                    {editingPriceId !== null && (
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={() => {
                                                setEditingPriceId(null)
                                                setPriceForm({ type: '', price_vnd: '', display_order: prices.length + 1 })
                                            }}
                                            className="border-slate-800 hover:bg-slate-800 text-slate-300"
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* List Column */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-lg font-bold tracking-wide text-slate-200 mb-4">💰 Price Options ({prices.length})</h2>
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                            <th className="p-4 w-12 text-center">#</th>
                                            <th className="p-4">Type</th>
                                            <th className="p-4">Price (VND)</th>
                                            <th className="p-4 w-40 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60">
                                        {prices.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="p-8 text-center text-slate-400">No prices loaded. Add one on the left.</td>
                                            </tr>
                                        ) : (
                                            prices.map((price, idx) => (
                                                <tr key={price.id} className="hover:bg-slate-900/50 transition-colors">
                                                    <td className="p-4 text-center font-mono text-xs text-slate-400">{price.display_order}</td>
                                                    <td className="p-4 font-bold text-slate-200">{price.type}</td>
                                                    <td className="p-4 font-mono text-slate-300">{price.price_vnd}</td>
                                                    <td className="p-4 flex justify-center gap-2">
                                                        <Button 
                                                            onClick={() => startEditPrice(price)} 
                                                            className="bg-slate-800 text-amber-500 hover:bg-slate-700 text-xs py-1 px-3 h-auto"
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button 
                                                            onClick={() => deletePrice(price.id!)} 
                                                            variant="destructive"
                                                            className="bg-red-950/50 hover:bg-red-900 text-red-200 border border-red-900 text-xs py-1 px-3 h-auto"
                                                        >
                                                            Delete
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* LINKS TAB */}
                {activeTab === 'links' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Column */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg h-fit">
                            <h2 className="text-lg font-bold mb-4 tracking-wide text-slate-200 border-b border-slate-800 pb-2">
                                {editingLinkId !== null ? '✏️ Edit Link' : '➕ Add Link'}
                            </h2>
                            <form onSubmit={saveLink} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Label</label>
                                    <input
                                        type="text"
                                        value={linkForm.label}
                                        onChange={(e) => setLinkForm({ ...linkForm, label: e.target.value })}
                                        placeholder="FACEBOOK, INSTAGRAM, TWITTER"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 uppercase"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">URL</label>
                                    <input
                                        type="text"
                                        value={linkForm.url}
                                        onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                                        placeholder="https://facebook.com/yourpage"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Display Order</label>
                                    <input
                                        type="number"
                                        value={linkForm.display_order}
                                        onChange={(e) => setLinkForm({ ...linkForm, display_order: parseInt(e.target.value) || 0 })}
                                        placeholder="1"
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                                        required
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button type="submit" className="flex-1 bg-amber-500 text-slate-950 hover:bg-amber-600 font-bold">
                                        {editingLinkId !== null ? 'Update Link' : 'Create Link'}
                                    </Button>
                                    {editingLinkId !== null && (
                                        <Button 
                                            type="button" 
                                            variant="outline" 
                                            onClick={() => {
                                                setEditingLinkId(null)
                                                setLinkForm({ label: '', url: '', display_order: links.length + 1 })
                                            }}
                                            className="border-slate-800 hover:bg-slate-800 text-slate-300"
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </div>
                            </form>
                        </div>

                        {/* List Column */}
                        <div className="lg:col-span-2 space-y-4">
                            <h2 className="text-lg font-bold tracking-wide text-slate-200 mb-4">🔗 Platforms Social Links ({links.length})</h2>
                            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-md">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-xs font-bold uppercase tracking-wider">
                                            <th className="p-4 w-12 text-center">#</th>
                                            <th className="p-4">Platform Label</th>
                                            <th className="p-4">Direct URL</th>
                                            <th className="p-4 w-40 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800/60">
                                        {links.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="p-8 text-center text-slate-400">
                                                    No links found. 
                                                    {missingTables.includes('platform_links') 
                                                        ? ' (Please run the SQL Editor setup script above to create this table).' 
                                                        : ' Add one on the left.'}
                                                </td>
                                            </tr>
                                        ) : (
                                            links.map((link) => (
                                                <tr key={link.id} className="hover:bg-slate-900/50 transition-colors">
                                                    <td className="p-4 text-center font-mono text-xs text-slate-400">{link.display_order}</td>
                                                    <td className="p-4 font-bold text-slate-200">{link.label}</td>
                                                    <td className="p-4 font-mono text-slate-400 text-xs truncate max-w-xs">{link.url}</td>
                                                    <td className="p-4 flex justify-center gap-2">
                                                        <Button 
                                                            onClick={() => startEditLink(link)} 
                                                            className="bg-slate-800 text-amber-500 hover:bg-slate-700 text-xs py-1 px-3 h-auto"
                                                        >
                                                            Edit
                                                        </Button>
                                                        <Button 
                                                            onClick={() => deleteLink(link.id!)} 
                                                            variant="destructive"
                                                            className="bg-red-950/50 hover:bg-red-900 text-red-200 border border-red-900 text-xs py-1 px-3 h-auto"
                                                        >
                                                            Delete
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTENT TAB */}
                {activeTab === 'content' && (
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
                        <h2 className="text-lg font-bold mb-4 tracking-wide text-slate-200 border-b border-slate-800 pb-2">
                            📝 Website Text Content Settings
                        </h2>
                        {missingTables.includes('site_content') ? (
                            <div className="p-8 text-center text-slate-400 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                                This feature requires the `site_content` table. Please run the SQL Setup Script above in your Supabase project first.
                            </div>
                        ) : (
                            <form onSubmit={saveContentSettings} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Greetings Box */}
                                    <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                                        <h3 className="text-sm font-bold text-amber-500 tracking-wide uppercase border-b border-slate-900 pb-1">👋 Banner Greetings</h3>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Welcome Text Line 1</label>
                                            <input
                                                type="text"
                                                value={contents.welcome_line1 || ''}
                                                onChange={(e) => handleContentChange('welcome_line1', e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Welcome Text Line 2</label>
                                            <input
                                                type="text"
                                                value={contents.welcome_line2 || ''}
                                                onChange={(e) => handleContentChange('welcome_line2', e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Commission Scope Card Header */}
                                    <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                                        <h3 className="text-sm font-bold text-amber-500 tracking-wide uppercase border-b border-slate-900 pb-1">📐 Pricing Scope Title</h3>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Scope Header Title</label>
                                            <input
                                                type="text"
                                                value={contents.commission_scope_title || ''}
                                                onChange={(e) => handleContentChange('commission_scope_title', e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Scope Guideline Items (One per line)</label>
                                            <textarea
                                                rows={4}
                                                value={contents.commission_scope_items || ''}
                                                onChange={(e) => handleContentChange('commission_scope_items', e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono leading-relaxed"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Extra Fees Manager */}
                                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                                    <h3 className="text-sm font-bold text-amber-500 tracking-wide uppercase border-b border-slate-900 pb-1">💰 Extra Fees & Notes</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="md:col-span-1">
                                            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Extra Fees Title</label>
                                            <input
                                                type="text"
                                                value={contents.commission_extra_fees_title || ''}
                                                onChange={(e) => handleContentChange('commission_extra_fees_title', e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                                                required
                                            />
                                            <label className="block text-xs font-semibold text-slate-400 mt-4 mb-1 uppercase tracking-wider">Notice / Note text</label>
                                            <textarea
                                                rows={4}
                                                value={contents.commission_extra_fees_note || ''}
                                                onChange={(e) => handleContentChange('commission_extra_fees_note', e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                                                required
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Extra Fees Items List (One per line)</label>
                                            <textarea
                                                rows={7}
                                                value={contents.commission_extra_fees_items || ''}
                                                onChange={(e) => handleContentChange('commission_extra_fees_items', e.target.value)}
                                                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono leading-relaxed"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Terms of Service Editor */}
                                <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-4">
                                    <h3 className="text-sm font-bold text-amber-500 tracking-wide uppercase border-b border-slate-900 pb-1">📜 Terms of Service Sections</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Col 1 */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Row 1: Payment Items (One per line)</label>
                                                <textarea
                                                    rows={4}
                                                    value={contents.terms_payment_items || ''}
                                                    onChange={(e) => handleContentChange('terms_payment_items', e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Row 2: Process Flow String</label>
                                                <input
                                                    type="text"
                                                    value={contents.terms_process_flow || ''}
                                                    onChange={(e) => handleContentChange('terms_process_flow', e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Row 2: Process Items (One per line)</label>
                                                <textarea
                                                    rows={4}
                                                    value={contents.terms_process_items || ''}
                                                    onChange={(e) => handleContentChange('terms_process_items', e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Row 2: Process Guideline Note</label>
                                                <input
                                                    type="text"
                                                    value={contents.terms_process_note || ''}
                                                    onChange={(e) => handleContentChange('terms_process_note', e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Row 3: Revision Sketch Stage Items (One per line)</label>
                                                <textarea
                                                    rows={3}
                                                    value={contents.terms_revision_sketch_items || ''}
                                                    onChange={(e) => handleContentChange('terms_revision_sketch_items', e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Row 3: Revision After Sketch Stage Items (One per line)</label>
                                                <textarea
                                                    rows={4}
                                                    value={contents.terms_revision_after_sketch_items || ''}
                                                    onChange={(e) => handleContentChange('terms_revision_after_sketch_items', e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Row 3: Revision Render Stage Items (One per line)</label>
                                                <textarea
                                                    rows={3}
                                                    value={contents.terms_revision_render_items || ''}
                                                    onChange={(e) => handleContentChange('terms_revision_render_items', e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Row 4: Time / Turnaround Items (One per line)</label>
                                                <textarea
                                                    rows={4}
                                                    value={contents.terms_time_items || ''}
                                                    onChange={(e) => handleContentChange('terms_time_items', e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        {/* Col 2 */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Row 5: Will Not Draw (Declined) Items (One per line)</label>
                                                <textarea
                                                    rows={5}
                                                    value={contents.terms_declined_items || ''}
                                                    onChange={(e) => handleContentChange('terms_declined_items', e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Row 5: Will Not Draw Guideline Note</label>
                                                <input
                                                    type="text"
                                                    value={contents.terms_declined_note || ''}
                                                    onChange={(e) => handleContentChange('terms_declined_note', e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Row 6: Usage Allowed Items (One per line)</label>
                                                <textarea
                                                    rows={3}
                                                    value={contents.terms_usage_allowed_items || ''}
                                                    onChange={(e) => handleContentChange('terms_usage_allowed_items', e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Row 6: Usage Forbidden Items (One per line)</label>
                                                <textarea
                                                    rows={3}
                                                    value={contents.terms_usage_forbidden_items || ''}
                                                    onChange={(e) => handleContentChange('terms_usage_forbidden_items', e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Row 7: Copyright & Ownership Items (One per line)</label>
                                                <textarea
                                                    rows={3}
                                                    value={contents.terms_copyright_items || ''}
                                                    onChange={(e) => handleContentChange('terms_copyright_items', e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Row 8: Image Posting / Publishing Items (One per line)</label>
                                                <textarea
                                                    rows={3}
                                                    value={contents.terms_posting_items || ''}
                                                    onChange={(e) => handleContentChange('terms_posting_items', e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Row 9: Cancel - Client Refund Items (One per line)</label>
                                                <textarea
                                                    rows={2}
                                                    value={contents.terms_cancel_client_items || ''}
                                                    onChange={(e) => handleContentChange('terms_cancel_client_items', e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Row 9: Cancel - Artist Refund Items (One per line)</label>
                                                <textarea
                                                    rows={2}
                                                    value={contents.terms_cancel_artist_items || ''}
                                                    onChange={(e) => handleContentChange('terms_cancel_artist_items', e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-400 mb-1 uppercase tracking-wider">Row 10: Crucial Notes (One per line)</label>
                                                <textarea
                                                    rows={4}
                                                    value={contents.terms_note_items || ''}
                                                    onChange={(e) => handleContentChange('terms_note_items', e.target.value)}
                                                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 border-t border-slate-800 flex justify-end">
                                    <Button 
                                        type="submit" 
                                        disabled={savingContent}
                                        className="bg-amber-500 text-slate-950 hover:bg-amber-600 font-bold px-8"
                                    >
                                        {savingContent ? 'Saving Settings...' : 'Save Settings'}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}
