'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'
import { MapPin, Clock, Phone, Star, Coffee, Users, Wifi, Car, Utensils, MessageCircle, Send } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [particleCanvas, setParticleCanvas] = useState<HTMLCanvasElement | null>(null)

  // Add schema markup for local business
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Wakop Kemiri",
    "image": "https://images.unsplash.com/photo-1501339847302-ac4264aaae2b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=600&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FmZXx8fHx8fDE3NjE2MzU4ODR8MA&ixlib=rb-4.1.0&q=80&w=800",
    "@id": "https://wakopkemiri.com",
    "url": "https://wakopkemiri.com",
    "telephone": "+622212345678",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Jl. Raya Cijenuk No. 123",
      "addressLocality": "Cililin",
      "addressRegion": "West Java",
      "postalCode": "40553",
      "addressCountry": "ID"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -6.860127,
      "longitude": 107.583859
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ],
        "opens": "00:00",
        "closes": "23:59"
      }
    ],
    "priceRange": "$$",
    "description": "Warkop terdekat di Cijenuk, Cililin, dan Citalem dengan suasana nyaman dan kopi pilihan. Tempat nongkrong asyik dengan menu lengkap.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "1000"
    },
    "additionalType": [
      "https://schema.org/CafeOrCoffeeShop",
      "https://schema.org/Restaurant"
    ]
  }

  const heroRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const facilitiesRef = useRef<HTMLDivElement>(null)
  const testimonialRef = useRef<HTMLDivElement>(null)
  const locationRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)

  // Particle background effect
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      document.body.appendChild(canvas)
      setParticleCanvas(canvas)

      const particles: any[] = []
      const particleCount = 100

      class Particle {
        x: number
        y: number
        size: number
        speedX: number
        speedY: number
        color: string

        constructor() {
          this.x = Math.random() * canvas.width
          this.y = Math.random() * canvas.height
          this.size = Math.random() * 2 + 0.5
          this.speedX = Math.random() * 1 - 0.5
          this.speedY = Math.random() * 1 - 0.5
          this.color = `rgba(255, ${165 + Math.random() * 30}, ${120 + Math.random() * 35}, 0.5)`
        }

        update() {
          this.x += this.speedX
          this.y += this.speedY

          if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX
          if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY
        }

        draw() {
          ctx.fillStyle = this.color
          ctx.beginPath()
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }

      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        for (let i = 0; i < particles.length; i++) {
          particles[i].update()
          particles[i].draw()
        }
        requestAnimationFrame(animate)
      }

      animate()

      const handleResize = () => {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas)
        }
      }
    }
  }, [])

  // Testimonial carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % 3)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const testimonials = [
    {
      name: "Budi Santoso",
      text: "Tempat nongkrong asyik di Cililin! Kopinya enak dan suasana tenang. Warkop terdekat yang paling recommended!",
      rating: 5
    },
    {
      name: "Siti Rahayu",
      text: "Wakop Kemiri tempat favorit saya dan teman-teman. Pelayanannya ramah dan menu lengkap. Cocok buat nugas atau sekedar bersantai.",
      rating: 5
    },
    {
      name: "Andi Pratama",
      text: "Salah satu warkop terdekat di kawasan Cijenuk dengan kopi yang mantap. Tempatnya nyaman dan harga terjangkau.",
      rating: 4
    }
  ]

  const facilities = [
    {
      icon: <Wifi className="w-8 h-8" />,
      title: "Wi-Fi Gratis",
      description: "Akses internet cepat untuk kerja atau belajar"
    },
    {
      icon: <Coffee className="w-8 h-8" />,
      title: "Kopi Pilihan",
      description: "Ragam jenis kopi dengan cita rasa terbaik"
    },
    {
      icon: <Utensils className="w-8 h-8" />,
      title: "Menu Lengkap",
      description: "Makanan ringan hingga berat tersedia"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Area Santai",
      description: "Tempat duduk nyaman untuk bersantai"
    },
    {
      icon: <Car className="w-8 h-8" />,
      title: "Parkir Luas",
      description: "Area parkir yang aman dan luas"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Buka 24 Jam",
      description: "Buka sepanjang hari untuk kenyamanan Anda"
    }
  ]

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // This would typically send to your database or contact form service
      const { error } = await supabase
        .from('contact_messages') // Assuming you have this table
        .insert([{
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message,
          created_at: new Date().toISOString()
        }])

      if (error) throw error

      toast.success('Pesan berhasil dikirim! Kami akan segera menghubungi Anda.')
      setContactForm({ name: '', email: '', message: '' })
    } catch (error) {
      toast.error('Gagal mengirim pesan. Silakan coba lagi.')
      console.error('Error sending message:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' })
    setIsMenuOpen(false)
  }

  return (
    <>
      {/* Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 font-sans selection:bg-amber-200 relative overflow-x-hidden">
        {/* Particle Background */}
        <div className="fixed inset-0 -z-10" style={{ background: 'linear-gradient(to bottom, #FEF5EF, #FDF6F0)' }}></div>

      {/* Navigation */}
      <header className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-[#4A2C1A]">Wakop <span className="text-[#FF9AA2]">Kemiri</span></h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <button onClick={() => scrollToSection(heroRef)} className="text-[#4A2C1A] hover:text-[#FF9AA2] font-medium transition-colors">Beranda</button>
            <button onClick={() => scrollToSection(aboutRef)} className="text-[#4A2C1A] hover:text-[#FF9AA2] font-medium transition-colors">Tentang</button>
            <button onClick={() => scrollToSection(facilitiesRef)} className="text-[#4A2C1A] hover:text-[#FF9AA2] font-medium transition-colors">Fasilitas</button>
            <button onClick={() => scrollToSection(testimonialRef)} className="text-[#4A2C1A] hover:text-[#FF9AA2] font-medium transition-colors">Testimoni</button>
            <button onClick={() => scrollToSection(locationRef)} className="text-[#4A2C1A] hover:text-[#FF9AA2] font-medium transition-colors">Lokasi</button>
            <button onClick={() => scrollToSection(contactRef)} className="text-[#4A2C1A] hover:text-[#FF9AA2] font-medium transition-colors">Kontak</button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[#4A2C1A]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white py-4 px-4 shadow-lg">
            <div className="flex flex-col space-y-3">
              <button onClick={() => scrollToSection(heroRef)} className="text-[#4A2C1A] hover:text-[#FF9AA2] font-medium py-2">Beranda</button>
              <button onClick={() => scrollToSection(aboutRef)} className="text-[#4A2C1A] hover:text-[#FF9AA2] font-medium py-2">Tentang</button>
              <button onClick={() => scrollToSection(facilitiesRef)} className="text-[#4A2C1A] hover:text-[#FF9AA2] font-medium py-2">Fasilitas</button>
              <button onClick={() => scrollToSection(testimonialRef)} className="text-[#4A2C1A] hover:text-[#FF9AA2] font-medium py-2">Testimoni</button>
              <button onClick={() => scrollToSection(locationRef)} className="text-[#4A2C1A] hover:text-[#FF9AA2] font-medium py-2">Lokasi</button>
              <button onClick={() => scrollToSection(contactRef)} className="text-[#4A2C1A] hover:text-[#FF9AA2] font-medium py-2">Kontak</button>
              <Link href="/order/select-table" className="w-full">
                <Button className="w-full bg-[#FF9AA2] hover:bg-[#FF8096] text-white">Pesan Sekarang</Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section - Wakop Terdekat di Cijenuk, Cililin, Citalem */}
      <section
        ref={heroRef}
        className="min-h-screen flex items-center pt-16 pb-20 relative overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-amber-100/80 to-orange-100/60"></div>
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#4A2C1A] mb-6 leading-tight">
                Wakop <span className="text-[#FF9AA2]">Kemiri</span> - Warkop Terdekat di <span className="text-[#B5EAD7]">Cijenuk, Cililin, Citalem</span>
              </h1>
              <p className="text-xl text-[#4A2C1A] mb-8 max-w-2xl">
                Temukan tempat nongkrong asyik dengan kopi pilihan dan suasana yang menenangkan.
                Salah satu warkop terdekat yang menyajikan pengalaman nongkrong tak terlupakan di kawasan Cililin.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/order/select-table">
                  <Button size="lg" className="bg-[#FF9AA2] hover:bg-[#FF8096] text-white text-lg px-8 py-6 rounded-full font-black">
                    Pesan Sekarang
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection(locationRef)}
                  className="border-2 border-[#B5EAD7] text-[#4A2C1A] hover:bg-[#B5EAD7]/20 text-lg px-8 py-6 rounded-full font-black"
                >
                  Lihat Lokasi
                </Button>
              </div>

              <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-6">
                <div className="flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 fill-current mr-1" />
                  <span className="font-bold text-[#4A2C1A]">4.8/5</span>
                  <span className="text-[#4A2C1A] ml-1">Rating</span>
                </div>
                <div className="flex items-center">
                  <Coffee className="w-5 h-5 text-[#B5EAD7] mr-1" />
                  <span className="font-bold text-[#4A2C1A]">100+</span>
                  <span className="text-[#4A2C1A] ml-1">Menu Kopi</span>
                </div>
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-[#FF9AA2] mr-1" />
                  <span className="font-bold text-[#4A2C1A]">1000+</span>
                  <span className="text-[#4A2C1A] ml-1">Pelanggan</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative w-full h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1501339847302-ac4264aaae2b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=600&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FmZXx8fHx8fDE3NjE2MzU4ODR8MA&ixlib=rb-4.1.0&q=80&w=800"
                  alt="Wakop Kemiri - Warkop Terdekat di Cijenuk, Cililin, Citalem"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center">
                  <div className="bg-[#B5EAD7] p-3 rounded-xl mr-4">
                    <MapPin className="w-6 h-6 text-[#4A2C1A]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Lokasi</p>
                    <p className="font-bold text-[#4A2C1A]">Cijenuk, Cililin, Citalem</p>
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center">
                  <div className="bg-[#FF9AA2] p-3 rounded-xl mr-4">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Buka</p>
                    <p className="font-bold text-[#4A2C1A]">24 Jam</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        ref={aboutRef}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#4A2C1A] mb-4">Tentang <span className="text-[#FF9AA2]">Wakop Kemiri</span></h2>
            <div className="w-24 h-1 bg-[#B5EAD7] mx-auto mb-6"></div>
            <p className="text-xl text-[#4A2C1A] max-w-3xl mx-auto">
              Warkop terdekat yang menyajikan pengalaman nongkrong tak terlupakan di kawasan Cijenuk, Cililin, dan Citalem
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-80 rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1554119921-79a852b2a3bf?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FmZXx8fHx8fDE3NjE2MzU4ODR8MA&ixlib=rb-4.1.0&q=80&w=400"
                  alt="Interior Wakop Kemiri"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-80 rounded-2xl overflow-hidden mt-8">
                <Image
                  src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FmZXx8fHx8fDE3NjE2MzU4ODR8MA&ixlib=rb-4.1.0&q=80&w=400"
                  alt="Kopi di Wakop Kemiri"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-80 rounded-2xl overflow-hidden lg:col-span-2">
                <Image
                  src="https://images.unsplash.com/photo-1514933651103-005eec06c04b?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=300&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2FmZXx8fHx8fDE3NjE2MzU4ODR8MA&ixlib=rb-4.1.0&q=80&w=800"
                  alt="Suasana Wakop Kemiri"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-black text-[#4A2C1A] mb-6">Warkop Terdekat dengan Suasana Nyaman</h3>
              <p className="text-[#4A2C1A] mb-6 leading-relaxed">
                Wakop Kemiri hadir sebagai warkop terdekat yang menyediakan tempat nongkrong asyik di kawasan Cijenuk, Cililin, dan Citalem.
                Kami menghadirkan suasana yang tenang dan nyaman untuk bersantai, bekerja, atau berkumpul bersama teman dan keluarga.
              </p>
              <p className="text-[#4A2C1A] mb-6 leading-relaxed">
                Dengan pilihan kopi yang lezat dan menu makanan yang lengkap, Wakop Kemiri menjadi destinasi favorit
                bagi warga sekitar dan pendatang yang mencari warkop terdekat dengan kualitas terbaik.
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-[#B5EAD7] p-2 rounded-lg mr-4">
                    <Coffee className="w-5 h-5 text-[#4A2C1A]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#4A2C1A]">Kopi Pilihan</h4>
                    <p className="text-[#4A2C1A] text-sm">Ragam jenis kopi dengan cita rasa terbaik</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#FF9AA2] p-2 rounded-lg mr-4">
                    <Utensils className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#4A2C1A]">Menu Lengkap</h4>
                    <p className="text-[#4A2C1A] text-sm">Makanan ringan hingga berat tersedia</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-[#FFE8D6] p-2 rounded-lg mr-4">
                    <Users className="w-5 h-5 text-[#4A2C1A]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#4A2C1A]">Area Santai</h4>
                    <p className="text-[#4A2C1A] text-sm">Tempat duduk nyaman untuk bersantai</p>
                  </div>
                </div>
              </div>

              <Link href="/order/select-table">
                <Button className="mt-8 bg-[#FF9AA2] hover:bg-[#FF8096] text-white">
                  Pesan Menu Favorit Anda
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section
        ref={facilitiesRef}
        className="py-20 bg-gradient-to-br from-amber-50 to-orange-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#4A2C1A] mb-4">Fasilitas <span className="text-[#FF9AA2]">Wakop Kemiri</span></h2>
            <div className="w-24 h-1 bg-[#B5EAD7] mx-auto mb-6"></div>
            <p className="text-xl text-[#4A2C1A] max-w-3xl mx-auto">
              Warkop terdekat dengan fasilitas lengkap untuk kenyamanan Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facilities.map((facility, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-2 border-[#FFE8D6] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8 text-center">
                  <div className="bg-[#B5EAD7]/20 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                    <div className="text-[#4A2C1A]">
                      {facility.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-[#4A2C1A] mb-3">{facility.title}</h3>
                  <p className="text-[#4A2C1A]">{facility.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section
        ref={testimonialRef}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#4A2C1A] mb-4">Apa Kata <span className="text-[#FF9AA2]">Mereka</span>?</h2>
            <div className="w-24 h-1 bg-[#B5EAD7] mx-auto mb-6"></div>
            <p className="text-xl text-[#4A2C1A] max-w-3xl mx-auto">
              Testimoni dari pelanggan warkop terdekat di Cijenuk, Cililin, dan Citalem
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-gradient-to-r from-[#FFE8D6] to-[#FFDAC1] border-0 rounded-3xl p-8 text-center">
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-xl text-[#4A2C1A] italic mb-8 max-w-2xl mx-auto">
                "{testimonials[currentTestimonial].text}"
              </p>
              <p className="font-black text-[#4A2C1A] text-lg">
                {testimonials[currentTestimonial].name}
              </p>
            </Card>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentTestimonial ? 'bg-[#FF9AA2]' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section
        ref={locationRef}
        className="py-20 bg-gradient-to-br from-orange-50 to-amber-50"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#4A2C1A] mb-4">Lokasi <span className="text-[#FF9AA2]">Wakop Kemiri</span></h2>
            <div className="w-24 h-1 bg-[#B5EAD7] mx-auto mb-6"></div>
            <p className="text-xl text-[#4A2C1A] max-w-3xl mx-auto">
              Warkop terdekat di kawasan Cijenuk, Cililin, dan Citalem
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <h3 className="text-2xl font-black text-[#4A2C1A] mb-6">Temukan Kami</h3>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="w-6 h-6 text-[#FF9AA2] mt-1 mr-4" />
                    <div>
                      <h4 className="font-bold text-[#4A2C1A]">Alamat</h4>
                      <p className="text-[#4A2C1A]">Jl. Raya Cijenuk No. 123, Cililin, Bandung Barat</p>
                      <p className="text-[#4A2C1A]">Cililin, Cijenuk, Citalem - Warkop Terdekat</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="w-6 h-6 text-[#B5EAD7] mt-1 mr-4" />
                    <div>
                      <h4 className="font-bold text-[#4A2C1A]">Jam Operasional</h4>
                      <p className="text-[#4A2C1A]">Buka 24 Jam</p>
                      <p className="text-[#4A2C1A]">Setiap Hari</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-6 h-6 text-[#FFE8D6] mt-1 mr-4" />
                    <div>
                      <h4 className="font-bold text-[#4A2C1A]">Kontak</h4>
                      <p className="text-[#4A2C1A]">+62 22 1234 5678</p>
                      <p className="text-[#4A2C1A]">info@wakopkemiri.com</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h4 className="font-bold text-[#4A2C1A] mb-4">Kenapa Memilih Wakop Kemiri?</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-[#FF9AA2] rounded-full mr-3"></div>
                      <span className="text-[#4A2C1A]">Warkop terdekat di Cijenuk, Cililin, Citalem</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-[#B5EAD7] rounded-full mr-3"></div>
                      <span className="text-[#4A2C1A]">Kopi pilihan dengan cita rasa terbaik</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-[#FFE8D6] rounded-full mr-3"></div>
                      <span className="text-[#4A2C1A]">Suasana nyaman untuk bersantai</span>
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-[#FFDAC1] rounded-full mr-3"></div>
                      <span className="text-[#4A2C1A]">Menu lengkap untuk semua selera</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl overflow-hidden shadow-xl h-96">
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-[#FF9AA2] mx-auto mb-4" />
                  <p className="text-[#4A2C1A] font-medium">Lokasi Wakop Kemiri</p>
                  <p className="text-[#4A2C1A] text-sm">Warkop Terdekat di Cijenuk, Cililin, Citalem</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        ref={contactRef}
        className="py-20 bg-white"
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black text-[#4A2C1A] mb-4">Hubungi <span className="text-[#FF9AA2]">Kami</span></h2>
            <div className="w-24 h-1 bg-[#B5EAD7] mx-auto mb-6"></div>
            <p className="text-xl text-[#4A2C1A] max-w-3xl mx-auto">
              Punya pertanyaan tentang warkop terdekat kami? Hubungi kami!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Card className="bg-gradient-to-br from-[#FFE8D6] to-[#FFDAC1] border-0 rounded-2xl p-8">
                <h3 className="text-2xl font-black text-[#4A2C1A] mb-6">Info Kontak</h3>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="w-6 h-6 text-[#FF9AA2] mt-1 mr-4" />
                    <div>
                      <h4 className="font-bold text-[#4A2C1A]">Alamat</h4>
                      <p className="text-[#4A2C1A]">Jl. Raya Cijenuk No. 123, Cililin, Bandung Barat</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Phone className="w-6 h-6 text-[#B5EAD7] mt-1 mr-4" />
                    <div>
                      <h4 className="font-bold text-[#4A2C1A]">Telepon</h4>
                      <p className="text-[#4A2C1A]">+62 22 1234 5678</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <MessageCircle className="w-6 h-6 text-[#FFE8D6] mt-1 mr-4" />
                    <div>
                      <h4 className="font-bold text-[#4A2C1A]">Email</h4>
                      <p className="text-[#4A2C1A]">info@wakopkemiri.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <Clock className="w-6 h-6 text-[#FFDAC1] mt-1 mr-4" />
                    <div>
                      <h4 className="font-bold text-[#4A2C1A]">Jam Operasional</h4>
                      <p className="text-[#4A2C1A]">Buka 24 Jam - Setiap Hari</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/50">
                  <h4 className="font-bold text-[#4A2C1A] mb-4">Ikuti Kami</h4>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="sm" className="border-2 border-[#B5EAD7] text-[#4A2C1A] hover:bg-[#B5EAD7]/20">
                      Facebook
                    </Button>
                    <Button variant="outline" size="sm" className="border-2 border-[#FF9AA2] text-[#4A2C1A] hover:bg-[#FF9AA2]/20">
                      Instagram
                    </Button>
                    <Button variant="outline" size="sm" className="border-2 border-[#FFE8D6] text-[#4A2C1A] hover:bg-[#FFE8D6]/20">
                      WhatsApp
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <Card className="border-0 rounded-2xl p-8 bg-[#FDF6F0]">
                <h3 className="text-2xl font-black text-[#4A2C1A] mb-6">Kirim Pesan</h3>

                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-[#4A2C1A] font-medium mb-2">Nama</label>
                    <Input
                      id="name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      placeholder="Nama Anda"
                      required
                      className="bg-white border-2 border-[#FFE8D6] focus:border-[#B5EAD7] text-[#4A2C1A]"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-[#4A2C1A] font-medium mb-2">Email</label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      placeholder="Email Anda"
                      required
                      className="bg-white border-2 border-[#FFE8D6] focus:border-[#B5EAD7] text-[#4A2C1A]"
                    />
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-[#4A2C1A] font-medium mb-2">Pesan</label>
                    <Textarea
                      id="message"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                      placeholder="Pesan Anda..."
                      required
                      rows={5}
                      className="bg-white border-2 border-[#FFE8D6] focus:border-[#B5EAD7] text-[#4A2C1A]"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-[#FF9AA2] hover:bg-[#FF8096] text-white font-black py-6"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Mengirim...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Send className="w-5 h-5 mr-2" />
                        Kirim Pesan
                      </div>
                    )}
                  </Button>
                </form>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#4A2C1A] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-black mb-4">Wakop <span className="text-[#FF9AA2]">Kemiri</span></h3>
              <p className="text-gray-300 mb-4">
                Warkop terdekat di Cijenuk, Cililin, dan Citalem dengan suasana nyaman dan kopi pilihan.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-300 hover:text-white">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-300 hover:text-white">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-black mb-4">Tautan</h3>
              <ul className="space-y-2">
                <li><button onClick={() => scrollToSection(heroRef)} className="text-gray-300 hover:text-white">Beranda</button></li>
                <li><button onClick={() => scrollToSection(aboutRef)} className="text-gray-300 hover:text-white">Tentang</button></li>
                <li><button onClick={() => scrollToSection(facilitiesRef)} className="text-gray-300 hover:text-white">Fasilitas</button></li>
                <li><button onClick={() => scrollToSection(testimonialRef)} className="text-gray-300 hover:text-white">Testimoni</button></li>
                <li><button onClick={() => scrollToSection(locationRef)} className="text-gray-300 hover:text-white">Lokasi</button></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-black mb-4">Menu</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Kopi</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Minuman Non-Kopi</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Makanan</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Snack</a></li>
                <li><a href="/order/select-table" className="text-gray-300 hover:text-white">Pesan Online</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-black mb-4">Kontak</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <MapPin className="w-4 h-4 mt-1 mr-2" />
                  <span>Jl. Raya Cijenuk No. 123, Cililin, Bandung Barat</span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  <span>+62 22 1234 5678</span>
                </li>
                <li className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  <span>info@wakopkemiri.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Wakop Kemiri. Warkop terdekat di Cijenuk, Cililin, dan Citalem. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
    </>
  )
}