"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import FacultyImage from "@/components/faculty/FacultyImage"

interface Faculty {
  id: number
  name: string
  title: string
  area: string
  image: string
  publicationCount: number
}

interface FacultySelectorProps {
  facultyData: Faculty[]
  selectedFaculty: number | null
  onSelectFaculty: (id: number) => void
}

export default function FacultySelector({ facultyData, selectedFaculty, onSelectFaculty }: FacultySelectorProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredFaculty = facultyData.filter(
    (faculty) =>
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.area.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Faculty Members</h2>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search faculty..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 w-full rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <motion.ul
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto"
      >
        {filteredFaculty.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No faculty members found</p>
        ) : (
          filteredFaculty.map((faculty) => (
            <motion.li key={faculty.id} variants={itemVariants}>
              <button
                onClick={() => onSelectFaculty(faculty.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-200 flex items-center ${
                  selectedFaculty === faculty.id
                    ? "bg-blue-50 text-blue-600 border-l-4 border-blue-500"
                    : "hover:bg-gray-50 text-gray-700 hover:text-gray-900"
                }`}
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 mr-3">
                  <FacultyImage
                    src={faculty.image}
                    alt={faculty.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                    fallbackSrc="/placeholder.svg"
                  />
                </div>
                <div className="overflow-hidden">
                  <span className="block truncate font-medium">{faculty.name}</span>
                  <span className="block text-xs text-gray-500 truncate">{faculty.area}</span>
                </div>
              </button>
            </motion.li>
          ))
        )}
      </motion.ul>
    </div>
  )
}

