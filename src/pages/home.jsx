import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CompetencyCard } from "@/components/competency-card.jsx";
import { CompetencyModal } from "@/components/competency-modal.jsx";
import { StatsCards } from "@/components/stats-cards.jsx";
import { SearchFilters } from "@/components/search-filters.jsx";

export default function Home() {
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const { data: competencies = [], isLoading } = useQuery({
    queryKey: ["/api/competencies"],
  });

  const calculateCompetencyStatus = (competency) => {
    const validated = competency.sousCompetences.filter(sc => sc.validee).length;
    const nonValidated = competency.sousCompetences.filter(sc => !sc.validee).length;
    return {
      validated,
      nonValidated,
      total: competency.sousCompetences.length,
      isValidated: validated >= nonValidated,
      percentage: Math.round((validated / competency.sousCompetences.length) * 100)
    };
  };

  const filteredCompetencies = competencies.filter(competency => {
    const matchesSearch = competency.nom.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         competency.code.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (filterStatus === "all") return true;
    
    const status = calculateCompetencyStatus(competency);
    if (filterStatus === "validated") return status.isValidated;
    if (filterStatus === "non-validated") return !status.isValidated;
    
    return true;
  });

  const stats = competencies.reduce((acc, comp) => {
    const status = calculateCompetencyStatus(comp);
    acc.total += 1;
    if (status.isValidated) acc.validated += 1;
    else acc.nonValidated += 1;
    return acc;
  }, { total: 0, validated: 0, nonValidated: 0 });

  const progressPercentage = stats.total > 0 ? Math.round((stats.validated / stats.total) * 100) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-2xl font-semibold text-gray-600">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="gradient-bg text-white p-6 shadow-2xl">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="bg-white/20 p-3 rounded-full">
                <Trophy className="text-2xl text-yellow-300" size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Gestionnaire de Compétences</h1>
                <p className="text-purple-200">Suivez l'acquisition des compétences - 404.js</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 px-6 py-3 rounded-full">
                <span className="text-sm font-semibold">{stats.total} Compétences</span>
              </div>
              <Button 
                onClick={() => setShowModal(true)}
                className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 px-6 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
              >
                <Plus className="mr-2" size={16} />
                Nouvelle Compétence
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <section className="container mx-auto px-6 py-8">
        <SearchFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
        />
        
        <StatsCards
          total={stats.total}
          validated={stats.validated}
          nonValidated={stats.nonValidated}
          progressPercentage={progressPercentage}
        />
      </section>

      {/* Competency Grid */}
      <section className="container mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCompetencies.map(competency => (
            <CompetencyCard
              key={competency.id}
              competency={competency}
              status={calculateCompetencyStatus(competency)}
            />
          ))}
        </div>
        
        {filteredCompetencies.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg">
              {searchQuery || filterStatus !== "all" 
                ? "Aucune compétence trouvée avec les critères actuels"
                : "Aucune compétence disponible"}
            </div>
          </div>
        )}
      </section>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={() => setShowModal(true)}
          className="gradient-bg text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 group"
        >
          <Plus className="text-xl group-hover:rotate-45 transition-transform duration-300" size={24} />
        </Button>
      </div>

      {/* Modal */}
      <CompetencyModal 
        open={showModal} 
        onOpenChange={setShowModal}
      />
    </div>
  );
}
