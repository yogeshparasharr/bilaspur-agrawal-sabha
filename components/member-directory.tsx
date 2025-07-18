"use client"

import { useState, useEffect } from "react"
import { Search, Filter, User, MapPin, Briefcase, Phone, Mail } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Member {
  id: number
  user: {
    name: string
    email: string
    phone?: string
  }
  firstName?: string
  lastName?: string
  city?: string
  locality?: string
  nativePlace?: string
  businessName?: string
  businessCategory?: string
  gotra?: string
  profileImageUrl?: string
  phonePrimary?: string
  membershipType: string
  status: string
  isApproved: boolean
}

export default function MemberDirectory() {
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [cityFilter, setCityFilter] = useState("")
  const [localityFilter, setLocalityFilter] = useState("")
  const [gotraFilter, setGotraFilter] = useState("")
  const [businessCategoryFilter, setBusinessCategoryFilter] = useState("")
  const [membershipTypeFilter, setMembershipTypeFilter] = useState("")
  const [loading, setLoading] = useState(true)

  const [cities, setCities] = useState<string[]>([])
  const [localities, setLocalities] = useState<string[]>([])
  const [gotras, setGotras] = useState<string[]>([])
  const [businessCategories, setBusinessCategories] = useState<string[]>([])
  const [membershipTypes, setMembershipTypes] = useState<string[]>([])

  useEffect(() => {
    fetchMembers()
  }, [])

  useEffect(() => {
    filterMembers()
  }, [members, searchTerm, cityFilter, localityFilter, gotraFilter, businessCategoryFilter, membershipTypeFilter])

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members')
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
        
        // Extract unique values for filters
        const uniqueCities = [...new Set(data.map((m: Member) => m.city))].filter(Boolean) as string[]
        const uniqueLocalities = [...new Set(data.map((m: Member) => m.locality))].filter(Boolean) as string[]
        const uniqueGotras = [...new Set(data.map((m: Member) => m.gotra))].filter(Boolean) as string[]
        const uniqueBusinessCategories = [...new Set(data.map((m: Member) => m.businessCategory))].filter(Boolean) as string[]
        const uniqueMembershipTypes = [...new Set(data.map((m: Member) => m.membershipType))].filter(Boolean) as string[]
        
        setCities(uniqueCities)
        setLocalities(uniqueLocalities)
        setGotras(uniqueGotras)
        setBusinessCategories(uniqueBusinessCategories)
        setMembershipTypes(uniqueMembershipTypes)
      }
    } catch (error) {
      console.error('Error fetching members:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterMembers = () => {
    let filtered = members

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(member =>
        member.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.businessName && member.businessName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (member.gotra && member.gotra.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    // City filter
    if (cityFilter) {
      filtered = filtered.filter(member => member.city === cityFilter)
    }

    // Locality filter
    if (localityFilter) {
      filtered = filtered.filter(member => member.locality === localityFilter)
    }

    // Gotra filter
    if (gotraFilter) {
      filtered = filtered.filter(member => member.gotra === gotraFilter)
    }

    // Business category filter
    if (businessCategoryFilter) {
      filtered = filtered.filter(member => member.businessCategory === businessCategoryFilter)
    }

    // Membership type filter
    if (membershipTypeFilter) {
      filtered = filtered.filter(member => member.membershipType === membershipTypeFilter)
    }

    setFilteredMembers(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setCityFilter("")
    setLocalityFilter("")
    setGotraFilter("")
    setBusinessCategoryFilter("")
    setMembershipTypeFilter("")
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading members...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search members by name or business..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Locality</label>
              <select
                value={localityFilter}
                onChange={(e) => setLocalityFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Localities</option>
                {localities.map(locality => (
                  <option key={locality} value={locality}>{locality}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gotra</label>
              <select
                value={gotraFilter}
                onChange={(e) => setGotraFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Gotras</option>
                {gotras.map(gotra => (
                  <option key={gotra} value={gotra}>{gotra}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business Category</label>
              <select
                value={businessCategoryFilter}
                onChange={(e) => setBusinessCategoryFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Categories</option>
                {businessCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Membership</label>
              <select
                value={membershipTypeFilter}
                onChange={(e) => setMembershipTypeFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Types</option>
                {membershipTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {filteredMembers.length} of {members.length} members
            </p>
            <button
              onClick={clearFilters}
              className="text-sm text-orange-600 hover:text-orange-500"
            >
              Clear all filters
            </button>
          </div>
        </div>
      </div>

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No members found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search criteria or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {member.profileImageUrl ? (
                      <img
                        className="h-16 w-16 rounded-full object-cover"
                        src={member.profileImageUrl}
                        alt={member.user.name}
                      />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center">
                        <User className="h-8 w-8 text-orange-600" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {member.user.name}
                    </h3>
                    
                    <div className="mt-2 space-y-1">
                      {member.city && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                          {member.locality ? `${member.locality}, ${member.city}` : member.city}
                        </div>
                      )}
                      
                      {member.gotra && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="text-gray-400 mr-1">🏛️</span>
                          Gotra: {member.gotra}
                        </div>
                      )}
                      
                      {member.businessName && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Briefcase className="h-4 w-4 mr-1 text-gray-400" />
                          {member.businessName}
                        </div>
                      )}
                      
                      {(member.user.phone || member.phonePrimary) && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-1 text-gray-400" />
                          {member.user.phone || member.phonePrimary}
                        </div>
                      )}
                      
                      {member.user.email && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Mail className="h-4 w-4 mr-1 text-gray-400" />
                          {member.user.email}
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge variant="secondary" className="text-xs">
                        {member.membershipType}
                      </Badge>
                      {member.businessCategory && (
                        <Badge variant="outline" className="text-xs">
                          {member.businessCategory}
                        </Badge>
                      )}
                      {member.isApproved && (
                        <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                          Approved
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}