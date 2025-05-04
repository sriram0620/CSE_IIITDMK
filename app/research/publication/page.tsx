"use client"

import { useState, useEffect, Suspense } from "react"
import { AnimatePresence } from "framer-motion"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import HeroSection from "@/components/research/publications/HeroSection"
import FacultySelector from "@/components/research/publications/FacultySelector"
import PublicationFilters from "@/components/research/publications/PublicationFilters"
import PublicationsList from "@/components/research/publications/PublicationsList"
import PublicationDetail from "@/components/research/publications/PublicationDetail"
import Pagination from "@/components/research/publications/Pagination"
import { AlertCircle, Loader2 } from "lucide-react"
import FacultyImage from "@/components/faculty/FacultyImage"
import { StringifyOptions } from "node:querystring"

// Type definitions
interface Publication {
  id: number
  title: StringifyOptions
}

interface FacultyMember {
  id: number
  name: string
  title: string
  area: string
  image: string
  publications: Publication[]
  publicationCount?: number
  email?: string
}

// Helper function to determine publication type
function determinePublicationType(citation: string, venue: string): string {
  const lowerCitation = citation.toLowerCase();
  const lowerVenue = venue.toLowerCase();
  
  // Check for book indicators
  if (
    lowerCitation.includes("book") || 
    lowerCitation.includes("publisher") || 
    lowerCitation.includes("press") || 
    lowerCitation.includes("edition") ||
    lowerCitation.includes("isbn") ||
    /published by|publishing/.test(lowerCitation)
  ) {
    // Determine if it's a chapter or a whole book
    if (lowerCitation.includes("chapter") || lowerCitation.includes("in:")) {
      return "chapter";
    }
    return "book";
  }
  
  // Check for journal
  if (
    lowerVenue.includes("journal") || 
    lowerVenue.includes("transactions") || 
    lowerVenue.includes("review") ||
    lowerVenue.includes("letters") ||
    /vol(\.|ume)/.test(lowerVenue)
  ) {
    return "journal";
  }
  
  // Check for conference
  if (
    lowerVenue.includes("conference") || 
    lowerVenue.includes("proceedings") || 
    lowerVenue.includes("symposium") ||
    lowerVenue.includes("workshop") ||
    lowerCitation.includes("conference") ||
    lowerCitation.includes("proceedings")
  ) {
    return "conference";
  }
  
  // Default to conference as fallback
  return "conference";
}

// Helper function to split any kind of line breaks (reused from FacultyDetail.tsx)
const splitLines = (text: string): string[] => {
  if (!text) return [];
  // Handle all types of line breaks: \r\n (Windows), \n (Unix), \r (Old Mac)
  return text.split(/\r\n|\r|\n/).filter(line => line.trim().length > 0);
};

// Helper function to parse publication citations (reused from FacultyDetail.tsx)
function parsePublicationCitation(citation: string): {
  authors?: string;
  title?: string;
  journal?: string;
  year?: string;
  doi?: string;
  pubType?: string;
} {
  const result: {
    authors?: string;
    title?: string;
    journal?: string;
    year?: string;
    doi?: string;
    pubType?: string;
  } = {};
  
  // Extract DOI if present
  const doiMatch = citation.match(/https?:\/\/doi\.org\/([^\s]+)/);
  if (doiMatch) {
    result.doi = doiMatch[1];
  }
  
  // Extract year if present (common pattern is 4 digits in parentheses or after year indicators)
  const yearMatch = citation.match(/\((\d{4})\)/) || citation.match(/(\d{4})/) || citation.match(/Volume \d+.* (\d{4})/);
  if (yearMatch) {
    result.year = yearMatch[1];
  }
  
  // Enhanced author extraction for books and publications
  // Try multiple patterns for author extraction in this order of priority
  
  // Try to extract authors with pattern "Author1, Author2, and Author3" or "Author1, Author2, Author3,"
  const multipleAuthorsMatch = citation.match(/^([^\.]+(?:,\s+(?:and\s+)?[^\.]+)+)[\.,]/i);
  if (multipleAuthorsMatch) {
    result.authors = multipleAuthorsMatch[1].trim();
  } 
  // Books often have pattern "Author1, Author2, Author3 (year)" or "Author1, Author2, Author3. Title"
  else if (citation.includes('(') && citation.indexOf('(') > 10) {
    const authorsPart = citation.substring(0, citation.indexOf('(')).trim();
    if (authorsPart.includes(',')) {
      result.authors = authorsPart.endsWith(',') ? authorsPart.slice(0, -1) : authorsPart;
    }
  }
  // If citation starts with names and then has a year
  else if (yearMatch && yearMatch.index && yearMatch.index > 10) {
    const beforeYear = citation.substring(0, yearMatch.index).trim();
    if (beforeYear.includes(',')) {
      const lastComma = beforeYear.lastIndexOf(',');
      result.authors = beforeYear.substring(0, lastComma).trim();
    }
  }
  // Fallback to traditional pattern (authors before first period or comma)
  else {
    const authorsMatch = citation.match(/^(.+?)\./) || citation.match(/^(.+?),/);
    if (authorsMatch) {
      result.authors = authorsMatch[1].trim();
    }
  }
  
  // Clean up authors string: remove trailing periods, "and" at the end
  if (result.authors) {
    result.authors = result.authors.replace(/\s+and\s*$/, '').replace(/\.$/, '').trim();
    
    // If we have a long string without commas, it might not be authors
    if (result.authors.length > 100 && !result.authors.includes(',')) {
      result.authors = undefined;
    }
  }
  
  // Look for ISBN (indicates a book)
  if (citation.toLowerCase().includes('isbn')) {
    result.pubType = 'book';
  }
  
  // Look for publisher indicators
  const publisherMatch = citation.match(/published by (.+?)[,\.]/i) || 
                         citation.match(/(.+?) press/i) || 
                         citation.match(/(.+?) publisher/i);
  if (publisherMatch) {
    result.journal = publisherMatch[1].trim();
    // Default to book if we find a publisher
    if (!result.pubType) {
      result.pubType = 'book';
    }
  }
  
  // Look for "in:" which often indicates a book chapter
  if (citation.toLowerCase().match(/in:\s+(.+?)[\.,]/i) || citation.toLowerCase().includes('chapter')) {
    result.pubType = 'chapter';
  }
  
  // Try to extract journal/venue (often in italics or between quotes)
  const journalMatch = citation.match(/[\.,]\s*["'](.+?)["']/) || citation.match(/in\s+(.+?),/i);
  if (journalMatch && !result.journal) {
    result.journal = journalMatch[1].trim();
  }
  
  // For books, try to extract title after the authors and before the publisher
  if ((result.pubType === 'book' || result.pubType === 'chapter') && result.authors) {
    const afterAuthors = citation.substring(citation.indexOf(result.authors) + result.authors.length);
    const titleMatch = afterAuthors.match(/[,\.]\s*["'](.+?)["']/) || afterAuthors.match(/[,\.]\s*(.+?)[,\.]/);
    if (titleMatch) {
      result.title = titleMatch[1].trim();
    }
  }
  
  return result;
}

// Helper function to process authors for better display
function processAuthors(authorsString: string | undefined): string {
  if (!authorsString) return 'Unknown';
  
  // Clean up the authors string
  let cleanedAuthors = authorsString
    .replace(/\s+et\s+al\.?/i, ' et al.') // standardize "et al"
    .replace(/\band\b/g, ',') // replace "and" with commas for consistent splitting
    .replace(/\s+,\s+/g, ', ') // standardize spacing around commas
    .replace(/\s{2,}/g, ' ') // remove extra spaces
    .replace(/,+/g, ',') // remove duplicate commas
    .trim();
  
  // Split by commas to get individual authors
  let authors = cleanedAuthors.split(',').map(a => a.trim()).filter(a => a.length > 0);
  
  // Format author list properly
  if (authors.length === 0) {
    return 'Unknown';
  } else if (authors.length === 1) {
    return authors[0];
  } else if (authors.length === 2) {
    return `${authors[0]} and ${authors[1]}`;
  } else {
    const lastAuthor = authors.pop();
    return `${authors.join(', ')} and ${lastAuthor}`;
  }
}

// Fallback component for when data is loading
const LoadingState = () => (
  <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center justify-center space-y-4">
    <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
    <p className="text-gray-600">Loading faculty data...</p>
  </div>
)

// Error component for when data fetching fails
const ErrorState = ({ message }: { message: string }) => (
  <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center justify-center space-y-4">
    <AlertCircle className="h-12 w-12 text-red-500" />
    <h3 className="text-xl font-medium text-gray-700">Failed to load data</h3>
    <p className="text-gray-600">{message}</p>
    <button 
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
    >
      Try Again
    </button>
  </div>
)

export default function PublicationsPage() {
  // State for faculty data
  const [facultyData, setFacultyData] = useState<FacultyMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // UI state
  const [selectedFaculty, setSelectedFaculty] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  // Fetch faculty data
  useEffect(() => {
    const fetchFacultyData = async () => {
      setLoading(true)
      try {
        // First fetch the faculty list with basic info
        const response = await fetch('/api/faculty', {
          cache: 'no-store',
          signal: AbortSignal.timeout(10000) // 10 second timeout
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch faculty data: ${response.status}`)
        }

        const data = await response.json()
        
        if (!data.faculty || !Array.isArray(data.faculty)) {
          throw new Error('Invalid data structure returned from API')
        }

        // Transform API data to our format, now processing them with email-based detail fetching
        const transformedData: FacultyMember[] = await Promise.all(
          data.faculty.map(async (faculty: any, index: number) => {
            // Only proceed with email-based fetching if we have an email
            let publications: Publication[] = [];
            // Use a global ID counter for publications to ensure uniqueness
            let pubIdCounter = 0;

            if (faculty.email) {
              try {
                // Fetch detailed faculty information using email
                const detailResponse = await fetch(`/api/faculty/${encodeURIComponent(faculty.email)}`, {
                  cache: 'no-store',
                  signal: AbortSignal.timeout(8000) // 8 second timeout per faculty
                });

                if (detailResponse.ok) {
                  const detailData = await detailResponse.json();
                  const facultyInfo = detailData.facinfo && detailData.facinfo.length > 0 
                    ? detailData.facinfo[0] 
                    : null;

                  // Process publications if we have detailed data
                  if (facultyInfo) {
                    console.log("Processing faculty publications for:", faculty.nickname);
                    
                    // Print out facultyInfo keys to see if any book-related fields exist
                    console.log("Available faculty fields:", Object.keys(facultyInfo));
                    
                    // Extract publications from pubCite3 and pubCite4 fields
                    if (facultyInfo.pubCite3) {
                      const pubList = splitLines(facultyInfo.pubCite3);
                      console.log(`Found ${pubList.length} publications in pubCite3`);
                      
                      pubList.forEach((pub: string) => {
                        const parts = parsePublicationCitation(pub);
                        const venue = parts.journal || 'Unknown Journal/Conference';
                        const pubType = parts.pubType || determinePublicationType(pub, venue);
                        
                        // Debug publication type detection
                        if (pubType === 'book' || pubType === 'chapter') {
                          console.log("Found book/chapter in pubCite3:", pubType, pub.substring(0, 80) + "...");
                        }
                        
                        publications.push({
<<<<<<< HEAD
                          id: idx,
                          title: parts.title || pub.trim()
                          // authors: parts.authors || 'Unknown',
=======
                          id: pubIdCounter++,
                          title: parts.title || pub.trim(),

                          authors: processAuthors(parts.authors),
                         
                         
>>>>>>> 90624c3016edfa3bdec4bc81d7e8afe71c1e64cf
                          // venue: parts.journal || 'Unknown Journal/Conference',
                          // year: parts.year ? parseInt(parts.year) : 2023,
                          // type: (parts.journal || '').toLowerCase().includes('journal') ? 'journal' : 'conference',
                          // doi: parts.doi || '',
                          // citations: Math.floor(Math.random() * 10), // Still random as citation data isn't available
<<<<<<< HEAD
                          // abstract: 'Abstract not available',
                          // keywords: facultyInfo.schoolName1 
                          //   ? facultyInfo.schoolName1.split(/[\r\n,]+/).map((i: string) => i.trim()).filter(Boolean)
                          //   : ['Computer Science']
=======
                          // abstract: 'Abstract not availab
                          keywords: facultyInfo.schoolName1 
                            ? facultyInfo.schoolName1.split(/[\r\n,]+/).map((i: string) => i.trim()).filter(Boolean)
                            : ['Computer Science']
>>>>>>> 90624c3016edfa3bdec4bc81d7e8afe71c1e64cf
                        });
                      });
                    }
                    
                    if (facultyInfo.pubCite4) {
                      const pubList = splitLines(facultyInfo.pubCite4);
                      console.log(`Found ${pubList.length} publications in pubCite4`);
                      
                      pubList.forEach((pub: string) => {
                        const parts = parsePublicationCitation(pub);
                        const venue = parts.journal || 'Unknown Journal/Conference';
                        const pubType = parts.pubType || determinePublicationType(pub, venue);
                        
                        // Debug publication type detection
                        if (pubType === 'book' || pubType === 'chapter') {
                          console.log("Found book/chapter in pubCite4:", pubType, pub.substring(0, 80) + "...");
                        }
                        
                        publications.push({
<<<<<<< HEAD
                          id: publications.length + idx,
                          title: parts.title || pub.trim()
                          // authors: parts.authors || 'Unknown',
                          // venue: parts.journal || 'Unknown Journal/Conference',
                          // year: parts.year ? parseInt(parts.year) : 2023,
                          // type: (parts.journal || '').toLowerCase().includes('journal') ? 'journal' : 'conference',
                          // doi: parts.doi || '',
                          // citations: Math.floor(Math.random() * 10), // Still random as citation data isn't available
                          // abstract: 'Abstract not available',
                          // keywords: facultyInfo.schoolName1 
                          //   ? facultyInfo.schoolName1.split(/[\r\n,]+/).map((i: string) => i.trim()).filter(Boolean) 
                          //   : ['Computer Science']
=======
                          id: pubIdCounter++,
                          title: parts.title || pub.trim(),

                          authors: processAuthors(parts.authors),
      
                          keywords: facultyInfo.schoolName1 
                            ? facultyInfo.schoolName1.split(/[\r\n,]+/).map((i: string) => i.trim()).filter(Boolean) 
                            : ['Computer Science']
>>>>>>> 90624c3016edfa3bdec4bc81d7e8afe71c1e64cf
                        });
                      });
                    }
                    
                    // Check for book publications field which might exist in some faculty profiles
                    if (facultyInfo.bookPublications) {
                      const bookPubList = splitLines(facultyInfo.bookPublications);
                      console.log(`Found ${bookPubList.length} publications in bookPublications field`);
                      
                      bookPubList.forEach((pub: string) => {
                        const parts = parsePublicationCitation(pub);
                        const venue = parts.journal || 'Book Publisher';
                        
                        console.log("Processing book publication:", pub.substring(0, 80) + "...");
                        
                        publications.push({
                          id: pubIdCounter++,
                          title: parts.title || pub.trim(),
                          authors: processAuthors(parts.authors),
                          venue: venue,
                          year: parts.year ? parseInt(parts.year) : 2023,
                          type: 'book', // Explicitly set as book since it's from the book publications field
                          doi: parts.doi || '',
                          citations: Math.floor(Math.random() * 15) + 5, // Books typically have more citations
                          abstract: 'Abstract not available',
                          keywords: facultyInfo.schoolName1 
                            ? facultyInfo.schoolName1.split(/[\r\n,]+/).map((i: string) => i.trim()).filter(Boolean) 
                            : ['Computer Science']
                        });
                      });
                    }
                    
                    // Also check for additional book-related fields that might exist
                    ["books", "bookChapters", "bookPublished", "publishedBooks", "editedBooks", "technicalReports"].forEach(fieldName => {
                      if (facultyInfo[fieldName]) {
                        const bookList = splitLines(facultyInfo[fieldName]);
                        console.log(`Found ${bookList.length} publications in ${fieldName} field`);
                        
                        bookList.forEach((pub: string) => {
                          const parts = parsePublicationCitation(pub);
                          const venue = parts.journal || 'Book Publisher';
                          const isChapter = fieldName === 'bookChapters';
                          
                          console.log(`Processing book from ${fieldName}:`, pub.substring(0, 80) + "...");
                          
                          publications.push({
                            id: pubIdCounter++,
                            title: parts.title || pub.trim(),
                            authors: processAuthors(parts.authors),
                            venue: venue,
                            year: parts.year ? parseInt(parts.year) : 2023,
                            type: isChapter ? 'chapter' : 'book',
                            doi: parts.doi || '',
                            citations: Math.floor(Math.random() * 15) + 5,
                            abstract: 'Abstract not available',
                            keywords: facultyInfo.schoolName1 
                              ? facultyInfo.schoolName1.split(/[\r\n,]+/).map((i: string) => i.trim()).filter(Boolean) 
                              : ['Computer Science']
                          });
                        });
                      }
                    });
                    
                    // Also check for any other pubCite fields that might contain book data
                    // Some faculty profiles might have additional publication fields (pubCite1, pubCite2, etc.)
                    for (const key in facultyInfo) {
                      if (key.startsWith('pubCite') && key !== 'pubCite3' && key !== 'pubCite4' && facultyInfo[key]) {
                        const pubList = splitLines(facultyInfo[key]);
                        console.log(`Found ${pubList.length} publications in ${key} field`);
                        
                        pubList.forEach((pub: string) => {
                          const parts = parsePublicationCitation(pub);
                          const venue = parts.journal || 'Unknown Venue';
                          const pubType = parts.pubType || determinePublicationType(pub, venue);
                          
                          // Debug publication type detection
                          if (pubType === 'book' || pubType === 'chapter') {
                            console.log(`Found book/chapter in ${key}:`, pubType, pub.substring(0, 80) + "...");
                          }
                          
                          publications.push({
                            id: pubIdCounter++,
                            title: parts.title || pub.trim(),
                            authors: processAuthors(parts.authors),
                            venue: venue,
                            year: parts.year ? parseInt(parts.year) : 2023,
                            type: pubType,
                            doi: parts.doi || '',
                            citations: Math.floor(Math.random() * 10),
                            abstract: 'Abstract not available',
                            keywords: facultyInfo.schoolName1 
                              ? facultyInfo.schoolName1.split(/[\r\n,]+/).map((i: string) => i.trim()).filter(Boolean) 
                              : ['Computer Science']
                          });
                        });
                      }
                    }
                    
                    // Report statistics
                    console.log(`Total publications: ${publications.length}`);
                    const bookCount = publications.filter(p => p.type === 'book').length;
                    const chapterCount = publications.filter(p => p.type === 'chapter').length;
                    console.log(`Found ${bookCount} books and ${chapterCount} book chapters`);
                  }
                }
              } catch (detailError) {
                console.warn(`Error fetching details for faculty ${faculty.nickname}:`, detailError);
                // Continue with empty publications if detail fetch fails
              }
            }
            
            // Improved image URL construction with multiple fallbacks
            let imageUrl = "/placeholder.svg";
            //console.log(faculty)
            // First try localimg from our IIITDM server
            if (faculty.imageUrl && faculty.imageUrl !== 'null' && faculty.imageUrl.startsWith('https')) {
              console.log('Faculty image URL:', faculty.imageUrl)
              imageUrl = faculty.imageUrl;
            } 
            // Then try the pic field if it exists and is a valid URL
            else if (faculty.pic && faculty.pic !== 'null' && faculty.pic.startsWith('https')) {
              imageUrl = faculty.pic;
            }
            
            return {
              id: index + 1,
              name: faculty.nickname || 'Unknown Faculty',
              title: faculty.desig || 'Faculty',
              area: faculty.schoolName1 || 'Computer Science',
              image: faculty.image,
              publications,
              publicationCount: publications.length,
              email: faculty.email // Store email for potential later use
            };
          })
        );

        setFacultyData(transformedData)
        setError(null)
      } catch (err) {
        console.error('Error fetching faculty data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load faculty data')
        
        // Load fallback data if API fails
        setFacultyData(getFallbackFacultyData())
      } finally {
        setLoading(false)
      }
    }

    fetchFacultyData()
  }, [])

  // Fallback data in case API fails
  const getFallbackFacultyData = (): FacultyMember[] => {
    return [
      {
        id: 1,
        name: "Dr. Masilamani V",
        title: "Professor",
        area: "Image Processing, Biometrics, Pattern Recognition",
        image: "/placeholder.svg?height=300&width=300",
        publications: [
          {
            id: 101,
            title: "Recent Advances in Image Processing Techniques",

            authors: processAuthors("Masilamani V, K. Patel"),
         

          },
          {
            id: 102,
            title: "Biometric Authentication Systems: A Survey",

            authors: processAuthors("Masilamani V, S. Kumar"),
          },
          {
            id: 103,
            title: "Computer Vision and Image Processing: Fundamentals and Applications",
            authors: processAuthors("Masilamani V, R. Jain"),
            

          }
        ],
        publicationCount: 3
      },
      {
        id: 2,
        name: "Dr. Noor Mahammad",
        title: "Associate Professor",
        area: "High Performance Architectures, VLSI Design, High Speed Networks",
        image: "/placeholder.svg?height=300&width=300",
        publications: [
          {
            id: 201,
            title: "High Performance Computing Architectures for Edge Computing",

            authors: processAuthors("Noor Mahammad, R. Singh"),

          },
          {
            id: 202,
            title: "VLSI Design Optimization for IoT Devices",

            authors: processAuthors("Noor Mahammad, P. Reddy"),
          },
          {
            id: 203,
            title: "Advances in Computer Architecture Design: Chapter 5 - Network-on-Chip Architectures",
            authors: processAuthors("Noor Mahammad, J. Lee, S. Patel"),

          }
        ],
        publicationCount: 3
      }
    ]
  }

  // Get the selected faculty data
  const faculty = selectedFaculty !== null ? facultyData.find((f) => f.id === selectedFaculty) : null

  // Log publication types if faculty is selected
  useEffect(() => {
    if (faculty && faculty.publications.length > 0) {
      // Count publications by type
      const typeCounts = faculty.publications.reduce((acc, pub) => {
        acc[pub.type] = (acc[pub.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('Publication types for selected faculty:', typeCounts);
      
      // Log all book publications for debugging
      const bookPublications = faculty.publications.filter(pub => pub.type === 'book' || pub.type === 'chapter');
      console.log(`Found ${bookPublications.length} book/chapter publications`, 
        bookPublications.map(p => ({ id: p.id, type: p.type, title: p.title.substring(0, 50) })));
    }
  }, [faculty]);

  // Filter publications based on search only
  const filteredPublications =
    faculty?.publications.filter((pub) => {
      const matchesSearch =
        searchQuery === "" ||
<<<<<<< HEAD
        pub.title.toLowerCase().includes(searchQuery.toLowerCase())
=======
        pub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||

        pub.authors.toLowerCase().includes(searchQuery.toLowerCase())

>>>>>>> 90624c3016edfa3bdec4bc81d7e8afe71c1e64cf
      return matchesSearch
    }) || []
  
  // Log filtered publication types
  useEffect(() => {
    if (filteredPublications.length > 0) {
      // Count publications by type
      const typeCounts = filteredPublications.reduce((acc, pub) => {
        acc[pub.type] = (acc[pub.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      console.log('Filtered publication types:', typeCounts);
    }
  }, [filteredPublications]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredPublications.length / itemsPerPage)
  const paginatedPublications = filteredPublications.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedFaculty])

  // Reset search
  const handleResetFilters = () => {
    setSearchQuery("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />

      <main className="pb-20">
        <Suspense fallback={<div className="h-48 bg-blue-50"></div>}>
          <HeroSection />
        </Suspense>

        <div className="container mx-auto px-4 mt-12">
          {loading ? (
            <LoadingState />
          ) : error && facultyData.length === 0 ? (
            <ErrorState message={error} />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Faculty Selection Sidebar */}
              <div className="lg:col-span-1">
                <Suspense fallback={<div className="h-96 bg-gray-100 rounded-xl animate-pulse"></div>}>
                  <FacultySelector
                    facultyData={facultyData as any}
                    selectedFaculty={selectedFaculty}
                    onSelectFaculty={setSelectedFaculty}
                  />
                </Suspense>
              </div>

              {/* Publications Content */}
              <div className="lg:col-span-3">
                {selectedFaculty === null ? (
                  <div className="bg-white rounded-xl shadow-md p-8 text-center">
                    <div className="mb-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-16 w-16 mx-auto text-blue-500 opacity-50"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        />
                      </svg>
                    </div>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">Select a Faculty Member</h3>
                    <p className="text-gray-500">
                      Please select a faculty member from the list to view their publications.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Faculty Profile */}
                    <Suspense fallback={<div className="h-32 bg-gray-100 rounded-xl animate-pulse mb-6"></div>}>
                      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                          <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                            <FacultyImage
                              src={faculty?.image || null}
                              alt={faculty?.name || "Faculty"}
                              className="rounded-full"
                              width={96}
                              height={96}
                            />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold text-gray-800">{faculty?.name}</h2>
                            <p className="text-gray-600 mb-2">{faculty?.title}</p>
                            <p className="text-sm text-gray-500 mb-4">Research Area: {faculty?.area}</p>

                            <div className="flex flex-wrap gap-2">
                              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                  />
                                </svg>
                                {faculty?.publications.length} Publications
                              </span>
                              {/* <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                  />
                                </svg>
                                {faculty?.publications.reduce((acc, pub) => acc + pub.citations, 0)} Citations
                              </span> */}
                              {/* <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                {{Math.min(...(faculty?.publications.map((p) => p.year) || [new Date().getFullYear()]))} -{" "}
                                {Math.max(...(faculty?.publications.map((p) => p.year) || [new Date().getFullYear()]))} }
                              </span> */}
                            </div>
                            
                            <div className="mt-4">
                              <button
                                onClick={() => {
                                  const area = faculty?.area?.toLowerCase() || '';
                                  const searchParam = encodeURIComponent(area);
                                  // Navigate to faculty page with area filter and smooth scroll to the faculty section
                                  window.location.href = `/people/faculty?area=${searchParam}#faculty-members`;
                                }}
                                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                  />
                                </svg>
                                View Faculty in this Area
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Suspense>

                    {/* Search */}
                    <Suspense fallback={<div className="h-24 bg-gray-100 rounded-xl animate-pulse mb-6"></div>}>
                      <PublicationFilters
                        searchQuery={searchQuery}
                        onSearchChange={setSearchQuery}
                        onResetFilters={handleResetFilters}
                      />
                    </Suspense>

                    {/* Publications List */}
                    <Suspense fallback={<div className="h-96 bg-gray-100 rounded-xl animate-pulse mb-6"></div>}>
                      <PublicationsList publications={paginatedPublications} onSelectPublication={setSelectedPublication} />
                    </Suspense>

                    {/* Pagination */}
                    {filteredPublications.length > itemsPerPage && (
                      <Suspense fallback={<div className="h-12 bg-gray-100 rounded-xl animate-pulse mt-6"></div>}>
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                      </Suspense>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Publication Detail Modal */}
      <AnimatePresence>
        {selectedPublication && (
          <PublicationDetail publication={selectedPublication} onClose={() => setSelectedPublication(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

