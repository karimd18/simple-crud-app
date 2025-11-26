import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
}

export const StatsCard = ({ title, value, icon: Icon, color }: StatsCardProps) => {
  return (
    <Card className="p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-3xl font-bold mt-2">{value}</h3>
        </div>
        <div className={`p-4 rounded-lg ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};
