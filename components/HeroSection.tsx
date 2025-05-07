"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight, ArrowRight, ExternalLink, ChevronDown } from "lucide-react"

export default function HeroSection() {
  const [activeSection, setActiveSection] = useState(0)
  const [direction, setDirection] = useState(1) // 1 for right, -1 for left
  const [isMounted, setIsMounted] = useState(false) // Track if the component has mounted
  const heroRef = useRef(null)

  // Sections data
  const sections = [
    {
      id: "achievements",
      title: "Achievements",
      subtitle: "Our Achievements",
      description:
        "We partner with leading tech companies to create opportunities for our students and drive innovation through joint research initiatives and technology transfer programs.",
      image: "/assets/a8.jpg",
      image1: "/assets/a2.jpg",
      color: "from-cyan-600 to-blue-700",
      accent: "bg-cyan-500",
      stats: [
        { value: "5+", label: "Startups" },
        { value: "5+", label: "Industry Labs" },
        { value: "40+", label: "Consultancy Projects" },
      ],
    },
    {
      id: "education",
      title: "Transformative Education",
      subtitle: "Shaping Tomorrow's Tech Innovators",
      description:
        "Our curriculum combines theoretical foundations with hands-on experience in cutting-edge technologies, preparing students for leadership in the digital era.",
      image: "/assets/a1.jpg",
      image1: "/assets/a2.jpg",
      color: "from-blue-600 to-indigo-700",
      accent: "bg-blue-500",
      stats: [
        { value: "80%", label: "Placement Rate" },
        { value: "90+", label: "Industry Partners" },
        { value: "5+", label: "Research Labs" },
      ],
    },
    {
      id: "research",
      title: "Pioneering Research",
      subtitle: "Advancing the Frontiers of Technology",
      description:
        "Our faculty and students collaborate on groundbreaking research that addresses real-world challenges across AI, cybersecurity, data science, and emerging technologies.",
      image: "/assets/a7.jpg",
      image1: "/assets/a2.jpg",
      color: "from-purple-600 to-indigo-700",
      accent: "bg-purple-500",
      stats: [
        { value: "200+", label: "Publications" },
        { value: "₹15Cr+", label: "Research Grants" },
        { value: "10+", label: "Patents Filed" },
      ],
    },
  ]

  // Auto-rotate sections
  useEffect(() => {
    setIsMounted(true) // Set to true after component mounts

    const interval = setInterval(() => {
      setDirection(1) // Always move forward for auto-rotation
      setActiveSection((prev) => (prev + 1) % sections.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [sections.length])

  // Handle manual section change
  const changeSection = (index: number) => {
    setDirection(index > activeSection ? 1 : -1)
    setActiveSection(index)
  }

  // Handle explore button click
  const handleExploreClick = (id: string) => {
    if (id === "achievements") {
      const achievementsElement = document.getElementById("sidebar-achievements");
      if (achievementsElement) {
        achievementsElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  // Scroll to content
  const scrollToContent = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    })
  }

  // Variants for slide animations
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  }

  // Ensure the component renders only on the client-side
  if (!isMounted) {
    return null
  }

  return (
    <div ref={heroRef} className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-[#001233]">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeSection}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              type: "tween",
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1.0], // Cubic bezier for smooth motion
            }}
            className="absolute inset-0"
          >
            <Image
              src={sections[activeSection].image || "/placeholder.svg"}
              alt={sections[activeSection].title}
              fill
              className="object-cover"
              priority
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${sections[activeSection].color} opacity-80`} />

            {/* Professional overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#001233]/90 via-transparent to-[#001233]/90" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Top navigation indicators */}
        <div className="container mx-auto px-4 pt-8">
          <div className="flex justify-center md:justify-start space-x-2">
            {sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => changeSection(index)}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  index === activeSection ? "text-white" : "text-white/70 hover:text-white/90"
                }`}
              >
                {section.id.charAt(0).toUpperCase() + section.id.slice(1)}
                {index === activeSection && (
                  <motion.div
                    layoutId="activeIndicator"
                    className={`absolute bottom-0 left-0 right-0 h-0.5 ${section.accent}`}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left content */}
              <div className="md:col-span-6 lg:col-span-5">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={activeSection}
                    custom={direction}
                    initial={{ opacity: 0, y: 10 * direction }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 * direction }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                  >
                    {/* Department badge */}
                    <div className="inline-flex items-center space-x-2 bg-white/10 rounded-md pl-2 pr-4 py-1.5">
                      <div
                        className={`w-7 h-7 rounded-md flex items-center justify-center ${sections[activeSection].accent}`}
                      >
                        <span className="text-white text-xs font-bold">CSE</span>
                      </div>
                      <span className="text-white/90 text-sm font-medium">Department of Computer Science</span>
                    </div>

                    {/* Heading */}
                    <div className="space-y-2">
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
                        {sections[activeSection].title}
                        <div className="mt-2 text-xl md:text-2xl font-medium text-white/80">
                          {sections[activeSection].subtitle}
                        </div>
                      </h1>
                    </div>

                    {/* Description */}
                    <p className="text-base md:text-lg text-white/70 max-w-xl leading-relaxed">
                      {sections[activeSection].description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3">
                      {sections[activeSection].stats.map((stat, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                          className="bg-white/10 rounded-md p-3 border border-white/10"
                        >
                          <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
                          <div className="text-xs md:text-sm text-white/60">{stat.label}</div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Buttons */}
                    {/* <div className="flex flex-wrap gap-3 pt-2">
                      <Button
                        className={`${sections[activeSection].accent.replace("bg-", "bg-")} text-white hover:opacity-90 rounded-md`}
                        onClick={() => handleExploreClick(sections[activeSection].id)}
                      >
                        Explore{" "}
                        {sections[activeSection].id.charAt(0).toUpperCase() + sections[activeSection].id.slice(1)}
                        <ChevronRight className="ml-1.5 h-4 w-4" />
                      </Button>
                    </div> */}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right content - Feature card */}
              <div className="hidden md:block md:col-span-6 lg:col-span-7 -mt-8">
                <AnimatePresence mode="wait" custom={direction}>
                  <motion.div
                    key={activeSection}
                    custom={direction}
                    initial={{ opacity: 0, x: 20 * direction }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 * direction }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="relative"
                  >
                    {/* Main feature image */}
                    <div className="relative h-[450px] w-full rounded-lg overflow-hidden border border-white/20 shadow-lg">
                      <Image
                        src={sections[activeSection].image1 || "/placeholder.svg"}
                        alt={sections[activeSection].title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#001233]/90 via-[#001233]/30 to-transparent" />

                     
                    </div>

                    {/* Small floating card */}
                    
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {sections.map((_, index) => (
            <button
              key={index}
              onClick={() => changeSection(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeSection ? `w-6 ${sections[activeSection].accent.replace("bg-", "bg-")}` : "bg-white/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 flex flex-col items-center cursor-pointer"
          onClick={scrollToContent}
        >
          {/* <span className="text-white/70 text-xs mb-1.5 px-3 py-1 rounded-md bg-white/10">Scroll to explore</span> */}
          <div className="w-7 h-7 rounded-md bg-white/10 flex items-center justify-center">
            <ChevronDown className="h-4 w-4 text-white" />
          </div>
        </div>
      </div>
    </div>
  )
}
