import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export function CompetencyModal({ open, onOpenChange }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    code: "",
    nom: "",
    sousCompetences: [{ nom: "", validee: false }]
  });

  const createCompetencyMutation = useMutation({
    mutationFn: async (data) => {
      const response = await apiRequest("POST", "/api/competencies", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/competencies"] });
      toast({
        title: "Succès",
        description: "Compétence créée avec succès",
      });
      onOpenChange(false);
      setFormData({
        code: "",
        nom: "",
        sousCompetences: [{ nom: "", validee: false }]
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de créer la compétence",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.code || !formData.nom) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }

    const validSousCompetences = formData.sousCompetences.filter(sc => sc.nom.trim() !== "");
    
    if (validSousCompetences.length === 0) {
      toast({
        title: "Erreur",
        description: "Veuillez ajouter au moins une sous-compétence",
        variant: "destructive",
      });
      return;
    }

    createCompetencyMutation.mutate({
      ...formData,
      sousCompetences: validSousCompetences
    });
  };

  const addSubCompetency = () => {
    setFormData(prev => ({
      ...prev,
      sousCompetences: [...prev.sousCompetences, { nom: "", validee: false }]
    }));
  };

  const removeSubCompetency = (index) => {
    setFormData(prev => ({
      ...prev,
      sousCompetences: prev.sousCompetences.filter((_, i) => i !== index)
    }));
  };

  const updateSubCompetency = (index, nom) => {
    setFormData(prev => ({
      ...prev,
      sousCompetences: prev.sousCompetences.map((sc, i) => 
        i === index ? { ...sc, nom } : sc
      )
    }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Nouvelle Compétence</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </Button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <Label htmlFor="code" className="block text-sm font-semibold text-gray-700 mb-2">
              Code de la compétence
            </Label>
            <Input
              id="code"
              type="text"
              placeholder="Ex: C9"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            />
          </div>
          
          <div>
            <Label htmlFor="nom" className="block text-sm font-semibold text-gray-700 mb-2">
              Nom de la compétence
            </Label>
            <Input
              id="nom"
              type="text"
              placeholder="Ex: Sécurité applicative"
              value={formData.nom}
              onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
            />
          </div>
          
          <div>
            <Label className="block text-sm font-semibold text-gray-700 mb-2">
              Sous-compétences
            </Label>
            <div className="space-y-3">
              {formData.sousCompetences.map((sousComp, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <Input
                    type="text"
                    placeholder="Nom de la sous-compétence"
                    value={sousComp.nom}
                    onChange={(e) => updateSubCompetency(index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSubCompetency(index)}
                    className="text-danger hover:text-danger/80 transition-colors"
                    disabled={formData.sousCompetences.length <= 1}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addSubCompetency}
                className="w-full px-4 py-3 bg-primary/10 text-primary border-primary/20 rounded-xl hover:bg-primary/20 transition-colors font-medium"
              >
                <Plus className="mr-2" size={16} />
                Ajouter une sous-compétence
              </Button>
            </div>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={createCompetencyMutation.isPending}
              className="flex-1 px-6 py-3 gradient-bg text-white rounded-xl hover:shadow-lg transition-all duration-300 font-medium"
            >
              {createCompetencyMutation.isPending ? "Création..." : "Créer la compétence"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
