import { Search, List, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchFilters({ 
  searchQuery, 
  onSearchChange, 
  filterStatus, 
  onFilterChange 
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 mb-8">
      {/* Search Bar */}
      <div className="flex-1 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="text-gray-400" size={20} />
        </div>
        <Input
          type="text"
          placeholder="Rechercher une compétence..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl shadow-lg border-2 border-transparent focus:border-primary focus:outline-none focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-gray-700"
        />
      </div>
      
      {/* Filter Buttons */}
      <div className="flex space-x-3">
        <Button
          variant={filterStatus === "all" ? "default" : "outline"}
          onClick={() => onFilterChange("all")}
          className={`px-6 py-3 rounded-xl shadow-md transition-all duration-300 font-medium ${
            filterStatus === "all" 
              ? "bg-primary text-white hover:bg-primary/80" 
              : "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-primary"
          }`}
        >
          <List className="mr-2" size={16} />
          Toutes
        </Button>
        <Button
          variant={filterStatus === "validated" ? "default" : "outline"}
          onClick={() => onFilterChange("validated")}
          className={`px-6 py-3 rounded-xl shadow-md transition-all duration-300 font-medium ${
            filterStatus === "validated" 
              ? "bg-success text-white hover:bg-success/80" 
              : "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-success"
          }`}
        >
          <Check className="mr-2" size={16} />
          Validées
        </Button>
        <Button
          variant={filterStatus === "non-validated" ? "default" : "outline"}
          onClick={() => onFilterChange("non-validated")}
          className={`px-6 py-3 rounded-xl shadow-md transition-all duration-300 font-medium ${
            filterStatus === "non-validated" 
              ? "bg-danger text-white hover:bg-danger/80" 
              : "bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-danger"
          }`}
        >
          <X className="mr-2" size={16} />
          Non Validées
        </Button>
      </div>
    </div>
  );
}
