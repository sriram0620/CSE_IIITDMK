"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Quote } from "lucide-react"
import Image from "next/image"

const testimonials = [
  {
    quote:
      "The teaching methodology at IIITDM Kancheepuram has been instrumental in shaping my career. The hands-on approach and industry-relevant curriculum gave me a competitive edge in the job market.",
    name: "Priya Sharma",
    title: "Software Engineer, Google",
    image: "/assets/12.png",
  },
  {
    quote:
      "What sets IIITDM apart is the faculty's commitment to student success. They go above and beyond to ensure that every student understands the concepts and can apply them in real-world scenarios.",
    name: "Rahul Verma",
    title: "Data Scientist, Microsoft",
    image: "/assets/11.png",
  },
  {
    quote:
      "The project-based learning approach helped me develop not just technical skills but also teamwork, communication, and problem-solving abilities that are crucial in today's workplace.",
    name: "Ananya Patel",
    title: "Product Manager, Amazon",
    image: "/assets/10.png",
  },
]

export default function TeachingTestimonials() {
  const [current, setCurrent] = useState(0)
  const [isMounted, setIsMounted] = useState(false)

  const nextTestimonial = () => {
    setCurrent(current === testimonials.length - 1 ? 0 : current + 1)
  }

  const prevTestimonial = () => {
    setCurrent(current === 0 ? testimonials.length - 1 : current - 1)
  }

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // If not mounted yet, show a simplified version without interactive elements
  if (!isMounted) {
    return (
      <section className="py-20 bg-gradient-to-br from-white to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-[#003366]">Student Testimonials</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto mb-6"></div>
            <p className="text-lg text-gray-700 leading-relaxed">
              Hear what our students and alumni have to say about their learning experience at IIITDM Kancheepuram.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 md:p-10 h-[300px]"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-white to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 text-[#003366]">Student Testimonials</h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 leading-relaxed">
            Hear what our students and alumni have to say about their learning experience at IIITDM Kancheepuram.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          <AnimatePresence mode="wait">
            {testimonials.map(
              (testimonial, index) =>
                index === current && (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg shadow-lg p-8 md:p-10"
                  >
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-blue-100 relative">
                          <Image
                            src={testimonial.image}
                            alt={testimonial.name}
                            fill
                            sizes="100px"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      </div>
                      <div className="flex-grow">
                        <Quote className="w-10 h-10 text-blue-100 mb-4" />
                        <p className="text-lg text-gray-700 italic mb-6">{testimonial.quote}</p>
                        <div>
                          <h4 className="text-xl font-semibold text-[#003366]">{testimonial.name}</h4>
                          <p className="text-gray-500">{testimonial.title}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ),
            )}
          </AnimatePresence>

          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-5 md:-translate-x-10 bg-white rounded-full p-2 shadow-md hover:bg-blue-50 transition-colors duration-300"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6 text-[#003366]" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-5 md:translate-x-10 bg-white rounded-full p-2 shadow-md hover:bg-blue-50 transition-colors duration-300"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6 text-[#003366]" />
          </button>

          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrent(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === current ? "bg-blue-600 w-8" : "bg-gray-300"
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

