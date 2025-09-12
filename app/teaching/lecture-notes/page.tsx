"use client"

import { useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import HeroSection from "@/components/teaching/lecture-notes/HeroSection"
import CourseFilters from "@/components/teaching/lecture-notes/CourseFilters"
import ResourceCard from "@/components/teaching/lecture-notes/ResourceCard"
import InstructorSelection from "@/components/teaching/lecture-notes/InstructorSelection"
import AdditionalResources from "@/components/teaching/lecture-notes/AdditionalResources"
import Pagination from "@/components/teaching/lecture-notes/Pagination"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { BookText, FileText, Folder, Video } from "lucide-react"

// Define types for structured data
interface LectureNote {
  id: number
  title: string
  course: string
  instructor: string
  date?: string
  duration?: string
  fileSize?: string
  fileType: "PDF" | "PPT" | "DOC" | "VIDEO"
  url: string
  tags: string[]
  downloads?: number
  category?: "lecture" | "assignment" | "problem" | "practice" | "video" | "resource"
}

// Structured data from the HTML file
const extractedLectureNotes: LectureNote[] = [
  // Dr. N Sadagopan - Discrete Structures
  {
    id: 101,
    title: "Logic",
    course: "Discrete Structures for Computer Engineering",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/Discrete/Logic.pdf",
    tags: ["Discrete Structures", "Logic", "Core Course"],
    category: "lecture"
  },
  {
    id: 102,
    title: "Proof Techniques",
    course: "Discrete Structures for Computer Engineering",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/Discrete/ProofTechniques.pdf",
    tags: ["Discrete Structures", "Proof Techniques", "Core Course"],
    category: "lecture"
  },
  {
    id: 103,
    title: "Relations",
    course: "Discrete Structures for Computer Engineering",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/Discrete/Relations.pdf",
    tags: ["Discrete Structures", "Relations", "Core Course"],
    category: "lecture"
  },
  {
    id: 104,
    title: "Functions and Infinite Sets",
    course: "Discrete Structures for Computer Engineering",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/Discrete/FunctionsInfiniteSets.pdf",
    tags: ["Discrete Structures", "Functions", "Infinite Sets", "Core Course"],
    category: "lecture"
  },
  {
    id: 105,
    title: "Graph Theory",
    course: "Discrete Structures for Computer Engineering",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/Discrete/GraphTheory.pdf",
    tags: ["Discrete Structures", "Graph Theory", "Core Course"],
    category: "lecture"
  },
  // Problem Sessions
  {
    id: 106,
    title: "Problem Session: Logic",
    course: "Discrete Structures for Computer Engineering",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/Discrete/2019-problem-session-1-solutions.pdf",
    tags: ["Discrete Structures", "Logic", "Problem Session"],
    category: "problem"
  },
  {
    id: 107,
    title: "Problem Session: More on Logic",
    course: "Discrete Structures for Computer Engineering",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/Discrete/2019-problem-session-2-solutions.pdf",
    tags: ["Discrete Structures", "Logic", "Problem Session"],
    category: "problem"
  },
  {
    id: 108,
    title: "Problem Session: Proof Techniques and Relations",
    course: "Discrete Structures for Computer Engineering",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/Discrete/2019-problem-session-3-solutions.pdf",
    tags: ["Discrete Structures", "Proof Techniques", "Relations", "Problem Session"],
    category: "problem"
  },
  // Assignments
  {
    id: 109,
    title: "Assignment: Logic",
    course: "Discrete Structures for Computer Engineering",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/Discrete/2019-discrete-assignment-1-solutions.pdf",
    tags: ["Discrete Structures", "Logic", "Assignment"],
    category: "assignment"
  },
  {
    id: 110,
    title: "Assignment: More on Logic",
    course: "Discrete Structures for Computer Engineering",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/Discrete/2019-disc-assignment-2-solutions.pdf",
    tags: ["Discrete Structures", "Logic", "Assignment"],
    category: "assignment"
  },
  {
    id: 111,
    title: "Assignment: Proof Techniques",
    course: "Discrete Structures for Computer Engineering",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/Discrete/2019-disc-assignment-3-solutions.pdf",
    tags: ["Discrete Structures", "Proof Techniques", "Assignment"],
    category: "assignment"
  },
  {
    id: 112,
    title: "Assignment: Functions and Infinite Sets",
    course: "Discrete Structures for Computer Engineering",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/Discrete/2019-disc-assignment-4-solutions.pdf",
    tags: ["Discrete Structures", "Functions", "Infinite Sets", "Assignment"],
    category: "assignment"
  },
  // Practice Questions
  {
    id: 113,
    title: "Practice Questions: Graph Theory",
    course: "Discrete Structures for Computer Engineering",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/Discrete/practice-questions-graph-theory.pdf",
    tags: ["Discrete Structures", "Graph Theory", "Practice"],
    category: "practice"
  },
  {
    id: 114,
    title: "Practice Questions: Infinite Sets",
    course: "Discrete Structures for Computer Engineering",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/Discrete/practice-questions-infinite-sets.pdf",
    tags: ["Discrete Structures", "Infinite Sets", "Practice"],
    category: "practice"
  },
  {
    id: 115,
    title: "Practice Questions: Logic",
    course: "Discrete Structures for Computer Engineering",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/Discrete/practice--questions-logic.pdf",
    tags: ["Discrete Structures", "Logic", "Practice"],
    category: "practice"
  },
  {
    id: 116,
    title: "Practice Questions: Relations and Proof Techniques",
    course: "Discrete Structures for Computer Engineering",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/Discrete/practice-questions-relations-prooftech.pdf",
    tags: ["Discrete Structures", "Relations", "Proof Techniques", "Practice"],
    category: "practice"
  },
  {
    id: 117,
    title: "Previous Questions 2015-2019",
    course: "Discrete Structures for Computer Engineering",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/Discrete/DM-prev-qpapers-2015-2019.pdf",
    tags: ["Discrete Structures", "Previous Year", "Exam"],
    category: "practice"
  },
  
  // Dr. N Sadagopan - Design and Analysis of Algorithms
  {
    id: 201,
    title: "Introduction to Computer Science",
    course: "Design and Analysis of Algorithms",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/DAA/new/Lecture-introduction.pdf",
    tags: ["DAA", "Introduction", "Core Course"],
    category: "lecture"
  },
  {
    id: 202,
    title: "Asymptotic Analysis",
    course: "Design and Analysis of Algorithms",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/DAA/new/asymptotic-analysis.pdf",
    tags: ["DAA", "Asymptotic Analysis", "Core Course"],
    category: "lecture"
  },
  {
    id: 203,
    title: "Recurrence Relations",
    course: "Design and Analysis of Algorithms",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/DAA/new/recurrence-relations-V3.pdf",
    tags: ["DAA", "Recurrence Relations", "Core Course"],
    category: "lecture"
  },
  {
    id: 204,
    title: "Sorting Algorithms",
    course: "Design and Analysis of Algorithms",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/DAA/new/SortingAlgorithms.pdf",
    tags: ["DAA", "Sorting", "Core Course"],
    category: "lecture"
  },
  {
    id: 205,
    title: "Dynamic Programming",
    course: "Design and Analysis of Algorithms",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/DAA/new/dp.pdf",
    tags: ["DAA", "Dynamic Programming", "Core Course"],
    category: "lecture"
  },
  {
    id: 206,
    title: "Greedy Algorithms",
    course: "Design and Analysis of Algorithms",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/DAA/new/greedy.pdf",
    tags: ["DAA", "Greedy Algorithms", "Core Course"],
    category: "lecture"
  },
  {
    id: 207,
    title: "Graph Algorithms",
    course: "Design and Analysis of Algorithms",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/DAA/new/graphalgorithms.pdf",
    tags: ["DAA", "Graph Algorithms", "Core Course"],
    category: "lecture"
  },
  {
    id: 208,
    title: "Theory of NP-completeness",
    course: "Design and Analysis of Algorithms",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/DAA/new/NPC.pdf",
    tags: ["DAA", "NP-completeness", "Core Course"],
    category: "lecture"
  },
  // Problem Session
  {
    id: 209,
    title: "Problem Session-1",
    course: "Design and Analysis of Algorithms",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/DAA/problemsession-1.pdf",
    tags: ["DAA", "Problem Session", "Core Course"],
    category: "problem"
  },
  // Assignments
  {
    id: 210,
    title: "DAA Assignment-1",
    course: "Design and Analysis of Algorithms",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/DAA/2016-daa-assignment-1.pdf",
    tags: ["DAA", "Assignment", "Core Course"],
    category: "assignment"
  },
  {
    id: 211,
    title: "DAA Assignment-2",
    course: "Design and Analysis of Algorithms",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/DAA/2016-daa-assignment-2.pdf",
    tags: ["DAA", "Assignment", "Core Course"],
    category: "assignment"
  },
  {
    id: 212,
    title: "DAA Assignment-3",
    course: "Design and Analysis of Algorithms",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/DAA/2016-daa-assignment-3.pdf",
    tags: ["DAA", "Assignment", "Core Course"],
    category: "assignment"
  },
  
  // Dr. Umarani Jayaraman - Human Computer Interaction
  {
    id: 301,
    title: "Course Overview and Learning Objectives",
    course: "Human Computer Interaction",
    instructor: "Dr. Umarani Jayaraman",
    fileType: "PPT",
    url: "http://www.cse.iiitdm.ac.in/Faculty_Teaching/Umarani/doc/hci/uma-L01%20(Course%20overview%20and%20LO).ppt",
    tags: ["HCI", "Introduction", "Elective"],
    category: "lecture"
  },
  {
    id: 302,
    title: "Early HCI",
    course: "Human Computer Interaction",
    instructor: "Dr. Umarani Jayaraman",
    fileType: "PPT",
    url: "http://iiitdm.ac.in/old/Faculty_Teaching/Umarani/doc/hci/uma-L02%20(Early%20HCI).ppt",
    tags: ["HCI", "History", "Elective"],
    category: "lecture"
  },
  {
    id: 303,
    title: "What is HCI",
    course: "Human Computer Interaction",
    instructor: "Dr. Umarani Jayaraman",
    fileType: "PPT",
    url: "http://iiitdm.ac.in/old/Faculty_Teaching/Umarani/doc/hci/uma-L03%20(What%20is%20HCI).ppt",
    tags: ["HCI", "Introduction", "Elective"],
    category: "lecture"
  },
  {
    id: 304,
    title: "The Human IO Channel",
    course: "Human Computer Interaction",
    instructor: "Dr. Umarani Jayaraman",
    fileType: "PPT",
    url: "http://iiitdm.ac.in/old/Faculty_Teaching/Umarani/doc/hci/uma-L04(The%20human%20IO%20channel).ppt",
    tags: ["HCI", "Human Factors", "Elective"],
    category: "lecture"
  },
  {
    id: 305,
    title: "The Human Memory",
    course: "Human Computer Interaction",
    instructor: "Dr. Umarani Jayaraman",
    fileType: "PPT",
    url: "http://iiitdm.ac.in/old/Faculty_Teaching/Umarani/doc/hci/uma-L05%20(The%20human%20memory).ppt",
    tags: ["HCI", "Human Factors", "Memory", "Elective"],
    category: "lecture"
  },
  // In-Class Activities
  {
    id: 306,
    title: "In-Class Activity: Document Reading",
    course: "Human Computer Interaction",
    instructor: "Dr. Umarani Jayaraman",
    fileType: "DOC",
    url: "http://iiitdm.ac.in/old/Faculty_Teaching/Umarani/doc/hci_ICA/Activity-1-Inclass-doument%20reading.docx",
    tags: ["HCI", "Activity", "Elective"],
    category: "assignment"
  },
  {
    id: 307,
    title: "Universal Design - The World Comfortable for All",
    course: "Human Computer Interaction",
    instructor: "Dr. Umarani Jayaraman",
    fileType: "VIDEO",
    url: "http://iiitdm.ac.in/old/Faculty_Teaching/Umarani/doc/hci_Video/_Universal%20Design_-%20The%20World%20Comfortable%20for%20All.mp4",
    tags: ["HCI", "Universal Design", "Video", "Elective"],
    category: "video"
  },
  {
    id: 308,
    title: "Free Speech Recognition Tutorial",
    course: "Human Computer Interaction",
    instructor: "Dr. Umarani Jayaraman",
    fileType: "VIDEO",
    url: "http://iiitdm.ac.in/old/Faculty_Teaching/Umarani/doc/hci_Video/Free%20Speech%20Recognition%20Tutorial%201%20-%20Setting%20Up%20Windows%20Speech%20Recognition%20W7%208%20Vista%20WSR.mp4",
    tags: ["HCI", "Speech Recognition", "Video", "Elective"],
    category: "video"
  },

//Dr Sadagopan
   {
    id: 309,
    title: "Turing Machines and Input Representation",
    course: "Advanced Data Structures and Algorithms",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/ADSA/new/scribe-TM-intro.pdf",
    tags: ["ADSA", "Turing Machines and Input Representation", "Core Course"],
    category: "lecture"
  },

  {
    id: 310,
    title: "Average Case Analysis",
    course: "Advanced Data Structures and Algorithms",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/ADSA/new/average-analysis.pdf",
    tags: ["DAA", "Average Case Analysis", "Core Course"],
    category: "lecture"
  },

    {
    id: 311,
    title: "Order Statistics",
    course: "Advanced Data Structures and Algorithms",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/ADSA/new/order-statistics.pdf",
    tags: ["DAA", "Order Statistics", "Core Course"],
    category: "lecture"
  },

    {
    id: 312,
    title: "M in-Max Heap and Deap",
    course: "Advanced Data Structures and Algorithms",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/ADSA/new/min_max%20_heap.pdf",
    tags: ["DAA", "M in-Max Heap and Deap", "Core Course"],
    category: "lecture"
  },

     {
    id: 313,
    title: "Binomial Heap",
    course: "Advanced Data Structures and Algorithms",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/ADSA/new/binomialheap.pdf",
    tags: ["DAA", "Binomial Heap", "Core Course"],
    category: "lecture"
  },

    {
    id: 314,
    title: "Amortized Analysis",
    course: "Advanced Data Structures and Algorithms",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/ADSA/new/amortized-analysis.pdf",
    tags: ["DAA", "Amortized Analysis", "Core Course"],
    category: "lecture"
  },

     {
    id: 315,
    title: "Amortized Analysis - Dynamic Tables",
    course: "Advanced Data Structures and Algorithms",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/ADSA/new/amortized-analysis-part-2.pdf",
    tags: ["DAA", "Amortized Analysis - Dynamic Tables", "Core Course"],
    category: "lecture"
  },

    {
    id: 316,
    title: "Fibonacci Heap",
    course: "Advanced Data Structures and Algorithms",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/ADSA/new/fibonnaciHeap.pdf",
    tags: ["DAA", "Fibonacci Heap", "Core Course"],
    category: "lecture"
  },

  
    {
    id: 317,
    title: " Greedy Algorithms",
    course: "Advanced Data Structures and Algorithms",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/ADSA/new/greedy-part-2.pdf",
    tags: ["DAA", "Greedy Algorithms", "Core Course"],
    category: "lecture"
  },

  {
    id: 318,
    title: "More on NP and Reductions",
    course: "Advanced Data Structures and Algorithms",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/ADSA/new/np-take-2.pdf",
    tags: ["DAA", "More on NP and Reductions", "Core Course"],
    category: "lecture"
  },

  /*
  //Dr. Sadagopan - C Programmaing
  {
    id: 319,
    title: "Introduction, Evolution and Base Conversion",
    course: "C Programming",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/C/introduction-base-conversion.pdf",
    tags: ["C Programming", "Introduction, Evolution and Base Conversion", "Core Course"],
    category: "lecture"
  },

    {
    id: 320,
    title: "Sequence Statements - Input, Output, Formatted I/O",
    course: "C Programming",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/C/1.declaration-in-out-escape-sequence.c",
    tags: ["C Programming", "Sequence Statements - Input, Output, Formatted I/O", "Core Course"],
    category: "lecture"
  },

   {
    id: 321,
    title: "Selection Statements - IF-ELSE",
    course: "C Programming",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/C/2.if-else.c",
    tags: ["C Programming", "Selection Statements - IF-ELSE"],
    category: "lecture"
  },

   {
    id: 322,
    title: "Selection Statements - Nested-IF-ELSE, Switch-Case",
    course: "C Programming",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/C/3.nested-if-switch-case.c",
    tags: ["C Programming", "Selection Statements - Nested-IF-ELSE, Switch-Case"],
    category: "lecture"
  },

   {
    id: 323,
    title: "Selection Statements - Nested-IF-ELSE, Switch-Case",
    course: "C Programming",
    instructor: "Dr. N Sadagopan",
    fileType: "PDF",
    url: "/doc/Faculty_Teaching/Sadagopan/pdf/C/3.nested-if-switch-case.c",
    tags: ["C Programming", "Selection Statements - Nested-IF-ELSE, Switch-Case"],
    category: "lecture"
  },
*/
];

// Combine with original sample data
const lectureNotes = [
  ...extractedLectureNotes,
  // Original sample data
  {
    id: 1,
    title: "Introduction to Data Structures",
    course: "CS2023: Data Structures and Algorithms",
    instructor: "Dr. N Sadagopan",
    date: "Jan 10, 2023",
    duration: "45 mins",
    fileSize: "2.4 MB",
    fileType: "PDF",
    url: "#",
    tags: ["Core Course", "CS", "Beginner"],
    downloads: 245,
  },
  {
    id: 2,
    title: "Arrays and Linked Lists",
    course: "CS2023: Data Structures and Algorithms",
    instructor: "Dr. N Sadagopan",
    date: "Jan 15, 2023",
    duration: "50 mins",
    fileSize: "3.1 MB",
    fileType: "PDF",
    url: "#",
    tags: ["Core Course", "CS", "Beginner"],
    downloads: 230,
  },
  {
    id: 3,
    title: "Stacks and Queues",
    course: "CS2023: Data Structures and Algorithms",
    instructor: "Dr. N Sadagopan",
    date: "Jan 20, 2023",
    duration: "55 mins",
    fileSize: "3.5 MB",
    fileType: "PDF",
    url: "#",
    tags: ["Core Course", "CS", "Intermediate"],
    downloads: 210,
  },
  {
    id: 4,
    title: "Trees and Binary Search Trees",
    course: "CS2023: Data Structures and Algorithms",
    instructor: "Dr. N Sadagopan",
    date: "Jan 25, 2023",
    duration: "60 mins",
    fileSize: "4.2 MB",
    fileType: "PDF",
    url: "#",
    tags: ["Core Course", "CS", "Intermediate"],
    downloads: 195,
  },
  {
    id: 5,
    title: "Graphs and Graph Algorithms",
    course: "CS2023: Data Structures and Algorithms",
    instructor: "Dr. N Sadagopan",
    date: "Jan 30, 2023",
    duration: "65 mins",
    fileSize: "4.8 MB",
    fileType: "PDF",
    url: "#",
    tags: ["Core Course", "CS", "Advanced"],
    downloads: 180,
  },
  {
    id: 6,
    title: "Introduction to Machine Learning",
    course: "CS3045: Machine Learning",
    instructor: "Dr. Umarani Jayaraman",
    date: "Feb 5, 2023",
    duration: "50 mins",
    fileSize: "3.2 MB",
    fileType: "PDF",
    url: "#",
    tags: ["Elective", "CS", "Beginner"],
    downloads: 320,
  },
  {
    id: 7,
    title: "Supervised Learning Algorithms",
    course: "CS3045: Machine Learning",
    instructor: "Dr. Umarani Jayaraman",
    date: "Feb 10, 2023",
    duration: "55 mins",
    fileSize: "3.8 MB",
    fileType: "PDF",
    url: "#",
    tags: ["Elective", "CS", "Intermediate"],
    downloads: 290,
  },
  {
    id: 8,
    title: "Neural Networks Fundamentals",
    course: "CS3045: Machine Learning",
    instructor: "Dr. Umarani Jayaraman",
    date: "Feb 15, 2023",
    duration: "60 mins",
    fileSize: "4.5 MB",
    fileType: "PDF",
    url: "#",
    tags: ["Elective", "CS", "Advanced"],
    downloads: 275,
  },
];

// Get unique instructors
const instructors = [...new Set(lectureNotes.map(note => note.instructor))];

// Get unique courses
const courses = [...new Set(lectureNotes.map(note => note.course))];

export default function LectureNotesPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedInstructor, setSelectedInstructor] = useState<string>("")
  const [selectedCourse, setSelectedCourse] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")

  // Apply filters to lecture notes
  const filteredNotes = lectureNotes.filter(note => {
    let matches = true;
    
    if (selectedInstructor && note.instructor !== selectedInstructor) {
      matches = false;
    }
    
    if (selectedCourse && note.course !== selectedCourse) {
      matches = false;
    }
    
    if (selectedCategory && note.category !== selectedCategory) {
      matches = false;
    }
    
    return matches;
  });

  // Sort by recent uploads (just for demonstration)
  const recentNotes = [...filteredNotes].sort((a, b) => b.id - a.id);
  
  // Sort by popularity (downloads)
  const popularNotes = [...filteredNotes].sort((a, b) => 
    (b.downloads || 0) - (a.downloads || 0)
  );

  // Get active notes based on tab
  const getActiveNotes = () => {
    switch (activeTab) {
      case "recent":
        return recentNotes;
      case "popular":
        return popularNotes;
      default:
        return filteredNotes;
    }
  };

  const activeNotes = getActiveNotes();
  const itemsPerPage = 5
  const totalPages = Math.ceil(activeNotes.length / itemsPerPage)

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = activeNotes.slice(indexOfFirstItem, indexOfLastItem)

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    // Scroll to top of results
    window.scrollTo({
      top: document.getElementById("results-section")?.offsetTop - 100,
      behavior: "smooth",
    })
  }

  // Reset pagination when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  }

  // Get file type icon
  const getFileTypeIcon = (fileType: string) => {
    switch (fileType) {
      case "PDF":
        return <FileText className="h-5 w-5 text-red-500" />;
      case "PPT":
        return <FileText className="h-5 w-5 text-orange-500" />;
      case "DOC":
        return <FileText className="h-5 w-5 text-blue-500" />;
      case "VIDEO":
        return <Video className="h-5 w-5 text-purple-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="">
        <HeroSection />

        <section id="results-section" className="py-16">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-blue-900">Browse Lecture Notes</h2>
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
                  <TabsTrigger
                    value="all"
                    className="py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    onClick={() => {
                      setActiveTab("all");
                      handleFilterChange();
                    }}
                  >
                    All Notes
                  </TabsTrigger>
                  <TabsTrigger
                    value="recent"
                    className="py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    onClick={() => {
                      setActiveTab("recent");
                      handleFilterChange();
                    }}
                  >
                    Recent Uploads
                  </TabsTrigger>
                  <TabsTrigger
                    value="popular"
                    className="py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    onClick={() => {
                      setActiveTab("popular");
                      handleFilterChange();
                    }}
                  >
                    Most Popular
                  </TabsTrigger>
                  <TabsTrigger
                    value="my-courses"
                    className="py-3 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    onClick={() => {
                      setActiveTab("my-courses");
                      handleFilterChange();
                    }}
                  >
                    My Courses
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Custom filters */}
              <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-medium mb-4">Filter Resources</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Instructor filter */}
                  <div>
                    <label htmlFor="instructor" className="block text-sm font-medium text-gray-700 mb-2">
                      Instructor
                    </label>
                    <select
                      id="instructor"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={selectedInstructor}
                      onChange={(e) => {
                        setSelectedInstructor(e.target.value);
                        handleFilterChange();
                      }}
                    >
                      <option value="">All Instructors</option>
                      {instructors.map((instructor) => (
                        <option key={instructor} value={instructor}>
                          {instructor}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Course filter */}
                  <div>
                    <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                      Course
                    </label>
                    <select
                      id="course"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={selectedCourse}
                      onChange={(e) => {
                        setSelectedCourse(e.target.value);
                        handleFilterChange();
                      }}
                    >
                      <option value="">All Courses</option>
                      {courses.map((course) => (
                        <option key={course} value={course}>
                          {course}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Resource type filter */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      Resource Type
                    </label>
                    <select
                      id="category"
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={selectedCategory}
                      onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        handleFilterChange();
                      }}
                    >
                      <option value="">All Types</option>
                      <option value="lecture">Lecture Notes</option>
                      <option value="assignment">Assignments</option>
                      <option value="problem">Problem Sessions</option>
                      <option value="practice">Practice Questions</option>
                      <option value="video">Videos</option>
                    </select>
                  </div>
                </div>
                
                {/* Reset filters */}
                {(selectedInstructor || selectedCourse || selectedCategory) && (
                  <div className="mt-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedInstructor("");
                        setSelectedCourse("");
                        setSelectedCategory("");
                        handleFilterChange();
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>

              <TabsContent value="all" className="mt-0">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  {currentItems.length > 0 ? (
                    <div className="space-y-6">
                      {currentItems.map((note) => (
                        <div 
                          key={note.id}
                          className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                        >
                          <div className="p-6">
                            <div className="flex items-start">
                              <div className="mr-4 mt-1">
                                {getFileTypeIcon(note.fileType)}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-900 mb-1">
                                  <a href={note.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                                    {note.title}
                                  </a>
                                </h3>
                                <p className="text-sm text-gray-500 mb-3">
                                  {note.course} • {note.instructor}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-2">
                                  {note.tags.map((tag, idx) => (
                                    <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  {note.fileType && (
                                    <span className="mr-3">{note.fileType}</span>
                                  )}
                                  {note.fileSize && (
                                    <span className="mr-3">{note.fileSize}</span>
                                  )}
                                  {note.duration && (
                                    <span className="mr-3">{note.duration}</span>
                                  )}
                                  {note.downloads !== undefined && (
                                    <span className="mr-3">{note.downloads} downloads</span>
                                  )}
                                  {note.date && (
                                    <span>{note.date}</span>
                                  )}
                                </div>
                              </div>
                              <div className="ml-4">
                                <a 
                                  href={note.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  Download
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                      <Folder className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No matching lecture notes found</h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        Try adjusting your filters or search terms to find what you're looking for.
                      </p>
                    </div>
                  )}

                  {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="recent" className="mt-0">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  {currentItems.length > 0 ? (
                    <div className="space-y-6">
                      {currentItems.map((note) => (
                        <div 
                          key={note.id}
                          className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                        >
                          <div className="p-6">
                            <div className="flex items-start">
                              <div className="mr-4 mt-1">
                                {getFileTypeIcon(note.fileType)}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-900 mb-1">
                                  <a href={note.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                                    {note.title}
                                  </a>
                                </h3>
                                <p className="text-sm text-gray-500 mb-3">
                                  {note.course} • {note.instructor}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-2">
                                  {note.tags.map((tag, idx) => (
                                    <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  {note.fileType && (
                                    <span className="mr-3">{note.fileType}</span>
                                  )}
                                  {note.fileSize && (
                                    <span className="mr-3">{note.fileSize}</span>
                                  )}
                                  {note.duration && (
                                    <span className="mr-3">{note.duration}</span>
                                  )}
                                  {note.downloads !== undefined && (
                                    <span className="mr-3">{note.downloads} downloads</span>
                                  )}
                                  {note.date && (
                                    <span>{note.date}</span>
                                  )}
                                </div>
                              </div>
                              <div className="ml-4">
                                <a 
                                  href={note.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  Download
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                      <p className="text-gray-600">No recent lecture notes match your filters.</p>
                    </div>
                  )}

                  {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                  )}
                </motion.div>
              </TabsContent>

              <TabsContent value="popular" className="mt-0">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  {currentItems.length > 0 ? (
                    <div className="space-y-6">
                      {currentItems.map((note) => (
                        <div 
                          key={note.id}
                          className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow"
                        >
                          <div className="p-6">
                            <div className="flex items-start">
                              <div className="mr-4 mt-1">
                                {getFileTypeIcon(note.fileType)}
                              </div>
                              <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-900 mb-1">
                                  <a href={note.url} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                                    {note.title}
                                  </a>
                                </h3>
                                <p className="text-sm text-gray-500 mb-3">
                                  {note.course} • {note.instructor}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-2">
                                  {note.tags.map((tag, idx) => (
                                    <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  {note.fileType && (
                                    <span className="mr-3">{note.fileType}</span>
                                  )}
                                  {note.fileSize && (
                                    <span className="mr-3">{note.fileSize}</span>
                                  )}
                                  {note.duration && (
                                    <span className="mr-3">{note.duration}</span>
                                  )}
                                  {note.downloads !== undefined && (
                                    <span className="mr-3">{note.downloads} downloads</span>
                                  )}
                                  {note.date && (
                                    <span>{note.date}</span>
                                  )}
                                </div>
                              </div>
                              <div className="ml-4">
                                <a 
                                  href={note.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                  Download
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                      <p className="text-gray-600">No popular lecture notes match your filters.</p>
                    </div>
                  )}

                  {totalPages > 1 && (
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                  )}
                </motion.div>
              </TabsContent>

              {/* <TabsContent value="my-courses" className="mt-0">
                <div className="p-8 text-center bg-white rounded-lg shadow-sm">
                  <BookText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Sign in to view your course materials</h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-4">
                    You need to sign in to access lecture notes from your enrolled courses.
                  </p>
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Sign In
                  </button>
                </div>
              </TabsContent> */}
            </Tabs>
          </div>
        </section>

        {/* Instructor Selection Section */}
        {/* <InstructorSelection instructors={instructors} onSelect={setSelectedInstructor} /> */}

        {/* <AdditionalResources /> */}
      </main>

      <Footer />
    </div>
  )
}

