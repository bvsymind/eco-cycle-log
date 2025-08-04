import { useState } from "react";
import { Edit2, Trash2, Package, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { AddWasteTypeModal } from "./AddWasteTypeModal";
import { mockJenisSampah, formatRupiah } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export function SampahPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [wasteTypes, setWasteTypes] = useState(mockJenisSampah);
  const { toast } = useToast();

  const handleAddWasteType = (newWasteType: any) => {
    setWasteTypes(prev => [...prev, newWasteType]);
    toast({
      title: "Berhasil",
      description: "Jenis sampah baru berhasil ditambahkan"
    });
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Fitur Edit",
      description: "Fitur edit sedang dalam pengembangan"
    });
  };

  const handleDelete = (id: string) => {
    setWasteTypes(prev => prev.filter(w => w.id !== id));
    toast({
      title: "Berhasil",
      description: "Jenis sampah berhasil dihapus"
    });
  };

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="py-6 space-y-6">
        <div className="grid gap-4">
          {wasteTypes.map((wasteType) => (
            <Card key={wasteType.id} className="p-4 bg-gradient-card border-0 shadow-card">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Package className="h-8 w-8 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground text-lg mb-1">
                    {wasteType.nama}
                  </h3>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Harga per kg</p>
                      <p className="font-semibold text-primary text-lg">
                        {formatRupiah(wasteType.harga_kg)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ditambahkan</p>
                      <p className="text-sm">
                        {wasteType.created_at.toLocaleDateString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(wasteType.id)}
                    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(wasteType.id)}
                    className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <FloatingActionButton
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="h-6 w-6" />
        </FloatingActionButton>

        <AddWasteTypeModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddWasteType}
        />
      </div>
    </div>
  );
}