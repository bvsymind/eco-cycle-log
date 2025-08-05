import { useState } from "react";
import { Edit2, Trash2, Package, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { AddWasteTypeModal } from "./AddWasteTypeModal";
import { EditWasteTypeModal } from "./EditWasteTypeModal";
import { mockJenisSampah, formatRupiah } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export function SampahPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWasteType, setEditingWasteType] = useState<any>(null);
  const [wasteTypes, setWasteTypes] = useState(mockJenisSampah);
  const { toast } = useToast();

  const handleAddWasteType = (newWasteType: any) => {
    setWasteTypes(prev => [...prev, newWasteType]);
    toast({
      title: "Berhasil",
      description: "Jenis sampah baru berhasil ditambahkan"
    });
  };

  const handleEdit = (wasteType: any) => {
    setEditingWasteType(wasteType);
    setShowEditModal(true);
  };

  const handleUpdate = (updatedWasteType: any) => {
    setWasteTypes(prev => prev.map(w => 
      w.id === updatedWasteType.id ? updatedWasteType : w
    ));
    toast({
      title: "Berhasil",
      description: "Jenis sampah berhasil diperbarui"
    });
    setShowEditModal(false);
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
                <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {wasteType.foto_url && wasteType.foto_url !== "/placeholder-waste.jpg" ? (
                    <img 
                      src={wasteType.foto_url} 
                      alt={wasteType.nama} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-primary">
                      <Package className="h-8 w-8 text-white" />
                    </div>
                  )}
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
                    onClick={() => handleEdit(wasteType)}
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
        
        <EditWasteTypeModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdate}
          wasteType={editingWasteType}
        />
      </div>
    </div>
  );
}