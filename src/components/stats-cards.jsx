import { Layers, CheckCircle, XCircle, TrendingUp } from "lucide-react";

export function StatsCards({ total, validated, nonValidated, progressPercentage }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-2xl shadow-lg hover-scale">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Total Compétences</p>
            <p className="text-3xl font-bold text-gray-800">{total}</p>
          </div>
          <div className="bg-primary/10 p-3 rounded-full">
            <Layers className="text-primary text-xl" size={20} />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-lg hover-scale">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Validées</p>
            <p className="text-3xl font-bold text-success">{validated}</p>
          </div>
          <div className="bg-success/10 p-3 rounded-full">
            <CheckCircle className="text-success text-xl" size={20} />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-lg hover-scale">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Non Validées</p>
            <p className="text-3xl font-bold text-danger">{nonValidated}</p>
          </div>
          <div className="bg-danger/10 p-3 rounded-full">
            <XCircle className="text-danger text-xl" size={20} />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl shadow-lg hover-scale">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm font-medium">Progression</p>
            <p className="text-3xl font-bold text-warning">{progressPercentage}%</p>
          </div>
          <div className="bg-warning/10 p-3 rounded-full">
            <TrendingUp className="text-warning text-xl" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}
