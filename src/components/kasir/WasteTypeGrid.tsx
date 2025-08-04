import { Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { mockJenisSampah, type JenisSampah, formatRupiah } from "@/data/mockData";

interface WasteTypeGridProps {
  onWasteTypeSelect: (wasteType: JenisSampah) => void;
  disabled?: boolean;
}

export function WasteTypeGrid({ onWasteTypeSelect, disabled }: WasteTypeGridProps) {
  return (
    <div className="mb-6">
      <h3 className="font-semibold text-foreground mb-3">
        Pilih Jenis Sampah
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {mockJenisSampah.map((wasteType) => (
          <Card
            key={wasteType.id}
            className={`
              p-3 cursor-pointer transition-all duration-200
              hover:shadow-card hover:scale-105
              border border-border
              ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary'}
            `}
            onClick={() => !disabled && onWasteTypeSelect(wasteType)}
          >
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-white" />
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-foreground line-clamp-2">
                  {wasteType.nama}
                </h4>
                <p className="text-xs text-primary font-semibold">
                  {formatRupiah(wasteType.harga_kg)}/kg
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}