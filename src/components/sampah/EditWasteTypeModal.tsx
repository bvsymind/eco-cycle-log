import { useState, useEffect, useRef } from "react";
import { X, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
// Pastikan Input benar-benar digunakan di JSX
import { Input } from "@/components/ui/input"; // eslint-disable-line
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { resizeImage } from "@/lib/imageUtils";

export interface EditWasteTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedWasteType: any) => void;
  wasteType: any;
}

export function EditWasteTypeModal({ 
  isOpen, 
  onClose, 
  onUpdate,
  wasteType 
}: EditWasteTypeModalProps) {
  const [formData, setFormData] = useState({
    nama: "",
    harga_kg: ""
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Isi form dengan data saat modal dibuka
  useEffect(() => {
    if (wasteType) {
      setFormData({
        nama: wasteType.nama,
        harga_kg: wasteType.harga_kg.toString()
      });
      setImagePreview(wasteType.foto_url);
    }
  }, [wasteType]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validasi tipe file
    if (!file.type.match('image.*')) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "File harus berupa gambar"
      });
      return;
    }
    
    try {
      // Resize gambar menjadi 100x100
      const resizedImage = await resizeImage(file);
      setImagePreview(resizedImage);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memproses gambar"
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.nama.trim() || !formData.harga_kg) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Semua field harus diisi"
      });
      return;
    }

    const hargaNum = parseFloat(formData.harga_kg);
    if (isNaN(hargaNum) || hargaNum <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Harga harus berupa angka positif"
      });
      return;
    }

    const updatedWasteType = {
      ...wasteType,
      nama: formData.nama.trim(),
      harga_kg: hargaNum,
      foto_url: imagePreview || wasteType.foto_url,
    };

    onUpdate(updatedWasteType);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-md bg-card animate-slide-up">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Edit Jenis Sampah
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Jenis Sampah
              </label>
              <Input
                type="text"
                placeholder="Contoh: Botol Plastik"
                value={formData.nama}
                onChange={(e) => setFormData(prev => ({ ...prev, nama: e.target.value }))}
                className="bg-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Harga per Kilogram (Rp)
              </label>
              <Input
                type="number"
                placeholder="0"
                value={formData.harga_kg}
                onChange={(e) => setFormData(prev => ({ ...prev, harga_kg: e.target.value }))}
                className="bg-input"
                min="0"
                step="100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Upload Foto
              </label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <div 
                onClick={triggerFileInput}
                className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-muted/50 cursor-pointer min-h-[150px] flex flex-col items-center justify-center"
              >
                {imagePreview ? (
                  <div className="flex justify-center">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="h-32 w-32 object-cover rounded-md"
                    />
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Klik untuk upload foto sampah
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      (Fitur upload sedang dalam pengembangan)
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={handleClose}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-primary hover:bg-primary-glow"
              >
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}