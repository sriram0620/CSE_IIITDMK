"use client"

import type React from "react"

import { motion } from "framer-motion"
import { BookOpen, Award, Users, FileText } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500 to-purple-600 opacity-20"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500 opacity-20"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-purple-500 opacity-20"></div>
        <div className="grid grid-cols-10 gap-4 w-full h-full">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="w-2 h-2 rounded-full bg-gray-300 opacity-20"></div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Research Publications
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Explore the cutting-edge research publications from our faculty members in various domains of Computer
            Science and Engineering.
          </p>
        </motion.div>

        
      </div>
    </section>
  )
}

interface StatsCardProps {
  icon: React.ReactNode
  title: string
  value: string
  description: string
}

function StatsCard({ icon, title, value, description }: StatsCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.1)" }}
      className="bg-white rounded-xl shadow-md p-6 transition-all duration-200"
    >
      <div className="flex items-center mb-4">
        <div className="p-3 rounded-lg bg-gray-50">{icon}</div>
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className="font-medium text-gray-700 mb-1">{title}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </motion.div>
  )
}

