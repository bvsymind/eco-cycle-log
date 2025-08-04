import { useState } from "react";
import { Edit2, Trash2, UserPlus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { AddNasabahModal } from "./AddNasabahModal";
import { mockNasabah, formatRupiah } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export function NasabahPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [nasabahList, setNasabahList] = useState(mockNasabah);
  const { toast } = useToast();

  const handleAddNasabah = (newNasabah: any) => {
    setNasabahList(prev => [...prev, newNasabah]);
    toast({
      title: "Berhasil",
      description: "Nasabah baru berhasil ditambahkan"
    });
  };

  const handleEdit = (id: string) => {
    toast({
      title: "Fitur Edit",
      description: "Fitur edit sedang dalam pengembangan"
    });
  };

  const handleDelete = (id: string) => {
    setNasabahList(prev => prev.filter(n => n.id_nasabah !== id));
    toast({
      title: "Berhasil",
      description: "Nasabah berhasil dihapus"
    });
  };

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="py-6 space-y-6">
        <div className="grid gap-4">
          {nasabahList.map((nasabah) => (
            <Card key={nasabah.id_nasabah} className="p-4 bg-gradient-card border-0 shadow-card">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {nasabah.nama.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {nasabah.nama}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        ID: {nasabah.id_nasabah}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                      {nasabah.alamat}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Saldo:</span>
                      <span className="font-semibold text-primary">
                        {formatRupiah(nasabah.saldo)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(nasabah.id_nasabah)}
                    className="h-8 w-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(nasabah.id_nasabah)}
                    className="h-8 w-8 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
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
          <UserPlus className="h-6 w-6" />
        </FloatingActionButton>

        <AddNasabahModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddNasabah}
          existingIds={nasabahList.map(n => n.id_nasabah)}
        />
      </div>
    </div>
  );
}