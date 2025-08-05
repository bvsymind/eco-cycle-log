// src/components/nasabah/EditNasabahModal.tsx

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; // Menggunakan Textarea untuk alamat
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { type Nasabah, formatRupiah } from "@/services/firebase";

// Definisikan props untuk modal
export interface EditNasabahModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedData: Partial<Nasabah>) => Promise<void>;
  nasabah: Nasabah | null;
}

export function EditNasabahModal({ 
  isOpen, 
  onClose, 
  onUpdate,
  nasabah 
}: EditNasabahModalProps) {
  const [formData, setFormData] = useState({ nama: "", alamat: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Isi form dengan data nasabah yang ada saat modal dibuka
  useEffect(() => {
    if (nasabah) {
      setFormData({
        nama: nasabah.nama,
        alamat: nasabah.alamat
      });
    }
  }, [nasabah]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nasabah) return;

    // Validasi input tidak boleh kosong
    if (!formData.nama.trim() || !formData.alamat.trim()) {
      toast({ variant: "destructive", title: "Error", description: "Nama dan Alamat harus diisi" });
      return;
    }

    setIsSubmitting(true);
    try {
      // Siapkan data yang akan diupdate
      const updatedData: Partial<Nasabah> = {
        nama: formData.nama.trim(),
        alamat: formData.alamat.trim(),
      };

      await onUpdate(updatedData); // Kirim data ke parent component
      handleClose();

    } catch (error) {
      console.error("Error updating nasabah:", error);
      toast({ variant: "destructive", title: "Error", description: "Gagal memperbarui data nasabah." });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleClose = () => {
    onClose();
  };

  if (!isOpen || !nasabah) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-md bg-card animate-slide-up">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Edit Data Nasabah</h3>
            <Button type="button" variant="ghost" size="icon" onClick={handleClose} disabled={isSubmitting}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="space-y-4">
            {/* Menampilkan ID dan Saldo sebagai informasi (read-only) */}
            <div className="p-3 bg-muted/50 rounded-lg text-sm space-y-1">
                <p><strong>ID Nasabah:</strong> {nasabah.id_nasabah}</p>
                <p><strong>Saldo Saat Ini:</strong> {formatRupiah(nasabah.saldo)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nama Lengkap</label>
              <Input
                type="text"
                value={formData.nama}
                onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                className="bg-input"
                disabled={isSubmitting}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Alamat</label>
              <Textarea
                value={formData.alamat}
                onChange={(e) => setFormData(prev => ({ ...prev, alamat: e.target.value }))}
                className="bg-input"
                disabled={isSubmitting}
                required
                rows={3}
              />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" className="flex-1" onClick={handleClose} disabled={isSubmitting}>
                Batal
              </Button>
              <Button type="submit" className="flex-1 bg-primary hover:bg-primary-glow" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}