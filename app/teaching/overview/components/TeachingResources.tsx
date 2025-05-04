"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, FileText, Calendar, Award, Lightbulb, GraduationCap, ArrowRight, Search, Filter } from "lucide-react"

const resources = [
  {
    title: "Curriculum",
    icon: <BookOpen className="w-8 h-8" />,
    description: "Comprehensive curriculum designed to cover fundamental and advanced topics in computer science.",
    link: "https://iiitdm.ac.in/students/existing-students/curriculum-info",
    category: "core",
  },
  {
    title: "Lecture Notes",
    icon: <FileText className="w-8 h-8" />,
    description: "Detailed lecture notes and study materials for all courses offered by the department.",
    link: "/teaching/lecture-notes",
    category: "materials",
  },
  {
    title: "Best Projects",
    icon: <Award className="w-8 h-8" />,
    description: "Showcase of outstanding student projects that demonstrate excellence in application of concepts.",
    link: "/teaching/best-projects",
    category: "projects",
  },
  {
    title: "Research Opportunities",
    icon: <GraduationCap className="w-8 h-8" />,
    description: "Information about research opportunities available for undergraduate and graduate students.",
    link: "/research/overview",
    category: "research",
  },
  {
    title: "Academic Calendar",
    icon: <Calendar className="w-8 h-8" />,
    description: "Important dates for the academic year including exams, holidays, and events.",
    link: "https://iiitdm.ac.in/students/existing-students/academic-calendar",
    category: "schedule",
  },
]

export default function TeachingResources() {
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isMounted, setIsMounted] = useState(false)
  const itemsPerPage = 6

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Filter resources based on category and search term
  const filteredResources = resources.filter((resource) => {
    const matchesCategory = filter === "all" || resource.category === filter
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredResources.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredResources.length / itemsPerPage)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // Simplified version for SSR
  if (!isMounted) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-[#003366]">Teaching Resources</h2>
            <div className="w-20 h-1 bg-blue-500 mx-auto mb-6"></div>
            <p className="text-lg text-gray-700 leading-relaxed">
              We provide a variety of resources to support the learning journey of our students. These resources are
              designed to enhance the classroom experience and facilitate self-directed learning.
            </p>
          </div>
          <div className="max-w-5xl mx-auto mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 h-12"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-white rounded-lg shadow-sm border border-gray-100"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4 text-[#003366]">Teaching Resources</h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto mb-6"></div>
          <p className="text-lg text-gray-700 leading-relaxed">
            We provide a variety of resources to support the learning journey of our students. These resources are
            designed to enhance the classroom experience and facilitate self-directed learning.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="relative w-full md:w-auto flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center space-x-2 w-full md:w-auto">
              <Filter className="text-gray-500 w-5 h-5" />
              <span className="text-sm text-gray-500">Filter:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="py-2 px-3 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="all">All Resources</option>
                <option value="core">Core Curriculum</option>
                <option value="materials">Study Materials</option>
                <option value="schedule">Schedules</option>
                <option value="electives">Electives</option>
                <option value="projects">Projects</option>
                <option value="research">Research</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {currentItems.length > 0 ? (
            currentItems.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="h-full"
              >
                <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                      {resource.icon}
                    </div>
                    <h3 className="text-xl font-bold text-[#003366] mb-2">{resource.title}</h3>
                    <p className="text-gray-600 flex-grow">{resource.description}</p>
                    <Link href={resource.link} target="_blank">
                      <Button
                        variant="ghost"
                        className="mt-4 text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-0 flex items-center group"
                      >
                        Explore
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <p className="text-gray-500 text-lg">No resources found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("")
                  setFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredResources.length > itemsPerPage && (
          <div className="flex justify-center mt-12">
            <nav className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="text-sm px-3"
              >
                Previous
              </Button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                  className={`w-8 h-8 p-0 ${currentPage === page ? "bg-blue-600" : "text-gray-700"}`}
                >
                  {page}
                </Button>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="text-sm px-3"
              >
                Next
              </Button>
            </nav>
          </div>
        )}
      </div>
    </section>
  )
}

