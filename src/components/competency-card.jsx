import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const getCompetencyColor = (index) => {
  const colors = [
    "bg-purple-500/10 text-purple-500",
    "bg-blue-500/10 text-blue-500", 
    "bg-cyan-500/10 text-cyan-500",
    "bg-amber-500/10 text-amber-500",
    "bg-violet-500/10 text-violet-500",
    "bg-emerald-500/10 text-emerald-500",
    "bg-indigo-500/10 text-indigo-500",
    "bg-pink-500/10 text-pink-500"
  ];
  return colors[index % colors.length];
};

export function CompetencyCard({ competency, status }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);

  const updateSubCompetencyMutation = useMutation({
    mutationFn: async ({ index, validee }) => {
      const response = await apiRequest(
        "PATCH",
        `/api/competencies/${competency.id}/sub-competency/${index}`,
        { validee }
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/competencies"] });
      toast({
        title: "Succès",
        description: "Statut de la sous-compétence mis à jour",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    },
  });

  const deleteCompetencyMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/competencies/${competency.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/competencies"] });
      toast({
        title: "Succès",
        description: "Compétence supprimée avec succès",
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la compétence",
        variant: "destructive",
      });
    },
  });

  const colorClass = getCompetencyColor(parseInt(competency.code.substring(1)) - 1);

  return (
    <div className="competency-card bg-white rounded-2xl shadow-lg overflow-hidden hover-scale">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${colorClass}`}>
              <span className="font-bold text-lg">{competency.code}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 text-sm leading-tight">
                {competency.nom}
              </h3>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-primary transition-colors"
            >
              <Edit size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-destructive transition-colors"
              onClick={() => deleteCompetencyMutation.mutate()}
              disabled={deleteCompetencyMutation.isPending}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className="mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            status.isValidated 
              ? "bg-success/10 text-success" 
              : status.percentage > 50 
                ? "bg-warning/10 text-warning"
                : "bg-danger/10 text-danger"
          }`}>
            {status.isValidated ? (
              <>
                <Check className="mr-1" size={12} />
                Validée
              </>
            ) : status.percentage > 50 ? (
              <>
                <div className="w-2 h-2 bg-warning rounded-full mr-1" />
                En cours
              </>
            ) : (
              <>
                <X className="mr-1" size={12} />
                Non Validée
              </>
            )}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progression</span>
            <span>{status.validated}/{status.total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                status.isValidated 
                  ? "success-gradient" 
                  : status.percentage > 50 
                    ? "warning-gradient"
                    : "danger-gradient"
              }`}
              style={{ width: `${status.percentage}%` }}
            />
          </div>
        </div>
        
        {/* Sub-competencies */}
        <div className="space-y-2">
          {competency.sousCompetences.slice(0, isExpanded ? undefined : 3).map((sousComp, index) => (
            <div key={index} className="sub-competency-item p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{sousComp.nom}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`text-xs px-2 py-1 rounded-full ${
                    sousComp.validee 
                      ? "bg-success text-white hover:bg-success/80" 
                      : "bg-danger text-white hover:bg-danger/80"
                  }`}
                  onClick={() => updateSubCompetencyMutation.mutate({ 
                    index, 
                    validee: !sousComp.validee 
                  })}
                  disabled={updateSubCompetencyMutation.isPending}
                >
                  {sousComp.validee ? "✓" : "✗"}
                </Button>
              </div>
            </div>
          ))}
          
          {competency.sousCompetences.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-gray-500 hover:text-gray-700"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded 
                ? "Voir moins" 
                : `Voir ${competency.sousCompetences.length - 3} de plus`}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
