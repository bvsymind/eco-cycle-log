import { useState, useEffect } from "react";
import { Edit2, Trash2, Package, Plus, RefreshCw, Image as ImageIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { AddWasteTypeModal } from "./AddWasteTypeModal";
import { EditWasteTypeModal } from "./EditWasteTypeModal";
import { jenisSampahService, type JenisSampah, formatRupiah } from "@/services/firebase";
import { useToast } from "@/hooks/use-toast";

// Impor komponen AlertDialog yang dibutuhkan
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function SampahPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingWasteType, setEditingWasteType] = useState<JenisSampah | null>(null);
  const [wasteTypes, setWasteTypes] = useState<JenisSampah[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadWasteTypes();
  }, []);

  const loadWasteTypes = async () => {
    try {
      setLoading(true);
      const data = await jenisSampahService.getAll();
      setWasteTypes(data);
    } catch (error) {
      console.error("Error loading waste types:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat jenis sampah."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadWasteTypes();
      toast({
        title: "Data Diperbarui",
        description: "Data jenis sampah berhasil diperbarui"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memperbarui data"
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleAddWasteType = async (newWasteType: Omit<JenisSampah, 'id' | 'created_at' | 'updated_at' | 'is_active'>) => {
    try {
      await jenisSampahService.add(newWasteType);
      await loadWasteTypes();
      toast({
        title: "Berhasil",
        description: "Jenis sampah baru berhasil ditambahkan"
      });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding waste type:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menambahkan jenis sampah."
      });
    }
  };

  const handleEdit = (wasteTypeToEdit: JenisSampah) => {
    setEditingWasteType(wasteTypeToEdit);
    setShowEditModal(true);
  };

  const handleUpdateWasteType = async (updatedData: Partial<JenisSampah>) => {
    if (!editingWasteType?.id) return;

    try {
      await jenisSampahService.update(editingWasteType.id, updatedData);
      await loadWasteTypes();
      toast({
        title: "Berhasil",
        description: "Jenis sampah berhasil diperbarui"
      });
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating waste type:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memperbarui jenis sampah."
      });
    }
  };

  const handleDelete = async (wasteType: JenisSampah) => {
    if (!wasteType.id) return;

    try {
      // Menggunakan metode delete yang sudah ada (soft delete)
      await jenisSampahService.delete(wasteType.id);
      await loadWasteTypes(); // Muat ulang untuk update status
      toast({
        title: "Berhasil Dinonaktifkan",
        description: `Jenis sampah "${wasteType.nama}" telah dinonaktifkan.`
      });
    } catch (error) {
      console.error("Error soft deleting waste type:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menonaktifkan jenis sampah."
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pb-20">
        <div className="py-6 space-y-6">
          <div className="flex justify-between items-center">
            <div className="h-6 bg-muted rounded w-32 animate-pulse"></div>
            <Button disabled>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          <div className="grid gap-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="p-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-muted rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-32"></div>
                    <div className="h-3 bg-muted rounded w-24"></div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="h-8 w-8 bg-muted rounded"></div>
                    <div className="h-8 w-8 bg-muted rounded"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="py-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Jenis Sampah ({wasteTypes.length})</h2>
          <Button 
            onClick={handleRefresh} 
            disabled={refreshing}
            variant="outline"
            size="sm"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {wasteTypes.length === 0 ? (
          <Card className="p-8 text-center">
            <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Belum ada jenis sampah yang terdaftar</p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Jenis Sampah Pertama
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {wasteTypes.map((wasteType) => (
              <Card key={wasteType.id} className="p-4 bg-gradient-card border-0 shadow-card">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                    {wasteType.foto_url && !wasteType.foto_url.includes("placeholder") ? (
                      <img 
                        src={wasteType.foto_url} 
                        alt={wasteType.nama}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                       <ImageIcon className="h-8 w-8 text-white" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-lg mb-1">
                      {wasteType.nama}
                    </h3>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div>
                        <p className="text-sm text-muted-foreground">Harga/kg</p>
                        <p className="font-semibold text-primary text-base">
                          {formatRupiah(Number(wasteType.harga_kg))}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          wasteType.is_active 
                            ? 'bg-success/10 text-success' 
                            : 'bg-destructive/10 text-destructive'
                        }`}>
                          {wasteType.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(wasteType)}
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    
                    {/* Bungkus Tombol Hapus dengan AlertDialog */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          title="Nonaktifkan Jenis Sampah"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Nonaktifkan Jenis Sampah?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tindakan ini akan membuat jenis sampah{" "}
                            <span className="font-semibold">{wasteType.nama}</span> tidak dapat dipilih saat transaksi. Anda dapat mengaktifkannya kembali nanti.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(wasteType)}>
                            Ya, Nonaktifkan
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

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
          onUpdate={handleUpdateWasteType}
          wasteType={editingWasteType}
        />
      </div>
    </div>
  );
}