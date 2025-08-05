import { useState, useEffect } from "react";
import { Edit2, Trash2, UserPlus, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FloatingActionButton } from "@/components/ui/floating-action-button";
import { AddNasabahModal } from "./AddNasabahModal";
import { EditNasabahModal } from "./EditNasabahModal";
import { nasabahService, type Nasabah, formatRupiah } from "@/services/firebase";
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

export function NasabahPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingNasabah, setEditingNasabah] = useState<Nasabah | null>(null);
  const [nasabahList, setNasabahList] = useState<Nasabah[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadNasabah();
  }, []);

  const loadNasabah = async () => {
    try {
      setLoading(true);
      const data = await nasabahService.getAll();
      setNasabahList(data);
    } catch (error) {
      console.error("Error loading nasabah:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat data nasabah. Periksa koneksi internet."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadNasabah();
      toast({
        title: "Data Diperbarui",
        description: "Data nasabah berhasil diperbarui"
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

  const handleAddNasabah = async (newNasabah: Omit<Nasabah, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      await nasabahService.add(newNasabah);
      await loadNasabah();
      toast({
        title: "Berhasil",
        description: "Nasabah baru berhasil ditambahkan"
      });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding nasabah:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menambahkan nasabah. Silakan coba lagi."
      });
    }
  };

  const handleEdit = (nasabahToEdit: Nasabah) => {
    setEditingNasabah(nasabahToEdit);
    setShowEditModal(true);
  };

  const handleUpdateNasabah = async (updatedData: Partial<Nasabah>) => {
    if (!editingNasabah?.id) return;

    try {
      await nasabahService.update(editingNasabah.id, updatedData);
      await loadNasabah();
      toast({
        title: "Berhasil",
        description: "Data nasabah berhasil diperbarui."
      });
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating nasabah:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memperbarui data nasabah."
      });
    }
  };

  const handleDelete = async (nasabah: Nasabah) => {
    if (!nasabah.id) return;
    
    try {
      await nasabahService.delete(nasabah.id);
      setNasabahList(prev => prev.filter(n => n.id !== nasabah.id));
      toast({
        title: "Berhasil Dihapus",
        description: `Nasabah "${nasabah.nama}" telah dihapus.`
      });
    } catch (error) {
      console.error("Error deleting nasabah:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal menghapus nasabah. Silakan coba lagi."
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
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-muted rounded-full"></div>
                      <div className="space-y-1">
                        <div className="h-4 bg-muted rounded w-32"></div>
                        <div className="h-3 bg-muted rounded w-20"></div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="h-3 bg-muted rounded w-48"></div>
                      <div className="h-3 bg-muted rounded w-24"></div>
                    </div>
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
          <h2 className="text-lg font-semibold">Data Nasabah ({nasabahList.length})</h2>
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

        {nasabahList.length === 0 ? (
          <Card className="p-8 text-center">
            <UserPlus className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">Belum ada nasabah yang terdaftar</p>
            <Button onClick={() => setShowAddModal(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Tambah Nasabah Pertama
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4">
            {nasabahList.map((nasabah) => (
              <Card key={nasabah.id} className="p-4 bg-gradient-card border-0 shadow-card">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-semibold">
                        <span>{nasabah.nama.charAt(0).toUpperCase()}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground truncate">{nasabah.nama}</h3>
                        <p className="text-sm text-muted-foreground">ID: {nasabah.id_nasabah}</p>
                      </div>
                    </div>
                    <div className="pl-12 space-y-1">
                      <p className="text-sm text-muted-foreground truncate">{nasabah.alamat}</p>
                      <div className="flex justify-between text-sm">
                        <span>Saldo:</span>
                        <span className="font-semibold text-primary">{formatRupiah(nasabah.saldo)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Bergabung:</span>
                        <span>{new Date(nasabah.created_at).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(nasabah)}
                      className="h-8 w-8 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Apakah Anda Yakin?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tindakan ini tidak dapat diurungkan. Ini akan menghapus data nasabah bernama{" "}
                            <span className="font-semibold">{nasabah.nama}</span> secara permanen.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(nasabah)}>
                            Hapus
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

        <FloatingActionButton onClick={() => setShowAddModal(true)}>
          <UserPlus className="h-6 w-6" />
        </FloatingActionButton>

        <AddNasabahModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddNasabah}
          existingIds={nasabahList.map(n => n.id_nasabah)}
        />
        
        <EditNasabahModal 
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateNasabah}
          nasabah={editingNasabah}
        />
      </div>
    </div>
  );
}