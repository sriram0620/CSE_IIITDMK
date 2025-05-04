"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { researchAreas, getIconByKey } from "./FacultyData"
import FacultyImage from "./FacultyImage"

interface ResearchAreasProps {
  facultyData: any[]
  selectedResearchArea: string
  setSelectedResearchArea: (area: string) => void
  setSelectedPosition: (position: string) => void
  setSearchQuery: (query: string) => void
  contentInView: boolean
  getRandomGradient: (id: number) => string
}

const ResearchAreas: React.FC<ResearchAreasProps> = ({
  facultyData,
  selectedResearchArea,
  setSelectedResearchArea,
  setSelectedPosition,
  setSearchQuery,
  contentInView,
  getRandomGradient,
}) => {
  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {researchAreas
          .filter((area) => area.value !== "all")
          .map((area, index) => {
            const facultyInArea = facultyData.filter((faculty) =>
              faculty.interests.some(
                (interest: string) =>
                  interest.toLowerCase().includes(area.value.toLowerCase()) ||
                  area.value.toLowerCase().includes(interest.toLowerCase()),
              ),
            )

            return (
              <motion.div
                key={area.value}
                initial={{ opacity: 0, y: 20 }}
                animate={contentInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300">
                  <CardHeader className={`pb-3 bg-gradient-to-r ${getRandomGradient(index)} text-white`}>
                    <div className="flex items-center">
                      {getIconByKey(area.icon, "w-4 h-4")}
                      <CardTitle className="text-lg ml-2">{area.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5">
                    <p className="text-gray-600 mb-4">{facultyInArea.length} faculty members specializing in this area</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {facultyInArea.slice(0, 3).map((faculty, idx) => (
                        <div key={idx} className="flex items-center">
                          <div className="w-6 h-6 rounded-full overflow-hidden mr-1">
                            <FacultyImage
                              src={faculty.image}
                              alt={faculty.name}
                              width={24}
                              height={24}
                              className="rounded-full"
                              autoSize={true}
                            />
                          </div>
                          <span className="text-sm text-gray-700">{faculty.name.split(" ").slice(-1)[0]}</span>
                        </div>
                      ))}
                      {facultyInArea.length > 3 && (
                        <span className="text-sm text-gray-500">+{facultyInArea.length - 3} more</span>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                      onClick={() => {
                        setSelectedResearchArea(area.value)
                        setSelectedPosition("all")
                        setSearchQuery("")
                        
                        // Scroll to the faculty members section
                        setTimeout(() => {
                          const facultyMembersSection = document.getElementById('faculty-members')
                          if (facultyMembersSection) {
                            facultyMembersSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
                            
                            // After a short delay, scroll to show the faculty cards or list
                            setTimeout(() => {
                              // Check if grid or list view is active
                              const facultyCardsSection = document.getElementById('faculty-cards')
                              const facultyListSection = document.getElementById('faculty-list')
                              
                              // Try to scroll to either the cards or list view
                              if (facultyCardsSection && facultyCardsSection.offsetHeight > 0) {
                                facultyCardsSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
                              } else if (facultyListSection && facultyListSection.offsetHeight > 0) {
                                facultyListSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
                              }
                            }, 300)
                          }
                        }, 100) // Small delay to allow state updates to process
                      }}
                    >
                      View Faculty in this Area
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
      </div>
    </Card>
  )
}

export default ResearchAreas

