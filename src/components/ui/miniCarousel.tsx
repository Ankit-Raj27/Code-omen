"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface Slide {
  id: string
  title: string
  button: string
  src: string
  redirectPath: string
}

interface CarouselProps {
  slides: Slide[]
  isLoading?: boolean
}

export function Carousel({ slides, isLoading = false }: CarouselProps) {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === slides.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  // Auto-advance slides every 5 seconds
  useEffect(() => {
    if (slides.length <= 1) { return }

    const slideInterval = setInterval(goToNext, 5000)
    return () => clearInterval(slideInterval)
  }, [currentIndex, slides.length])

  if (isLoading) {
    return (
      <div className="relative w-full h-[300px] md:h-[400px] bg-gray-900/50 rounded-lg animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  if (!slides || slides.length === 0) {
    return (
      <div className="relative w-full h-[300px] md:h-[400px] bg-gray-900/50 rounded-lg">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-gray-400">No slides available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-lg">
      {/* Navigation Arrows */}
      <div className="absolute inset-0 flex items-center justify-between z-10 px-4">
        <button
          onClick={goToPrevious}
          className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={goToNext}
          className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white hover:bg-black/50 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Slide Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[currentIndex].id} // More stable key
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          <div className="relative w-full h-full">
            <Image
              src={slides[currentIndex].src || "/placeholder.svg"}
              alt={slides[currentIndex].title}
              fill
              className="object-cover"
              priority={currentIndex === 0} // Only prioritize the first image
            />
            <div className="absolute inset-0  bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
              <h4 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {slides[currentIndex].title}
              </h4>
              <button
                className="inline-flex z-10 items-center justify-center px-6 py-2 bg-white text-black font-medium rounded-md hover:bg-gray-200 transition-colors w-fit"
                onClick={() => router.push(slides[currentIndex].redirectPath)}
              >
                {slides[currentIndex].button}
              </button>
            </div>
          </div>
        </motion.div>

      </AnimatePresence>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? "bg-white w-6" : "bg-white/50"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
