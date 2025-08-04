import { useState } from "react";
import { CustomerInput } from "./CustomerInput";
import { WasteTypeGrid } from "./WasteTypeGrid";
import { WeightInputModal } from "./WeightInputModal";
import { TransactionSummary, type TransactionItem } from "./TransactionSummary";
import { type Nasabah, type JenisSampah } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export function KasirPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Nasabah | null>(null);
  const [selectedWasteType, setSelectedWasteType] = useState<JenisSampah | null>(null);
  const [showWeightModal, setShowWeightModal] = useState(false);
  const [transactionItems, setTransactionItems] = useState<TransactionItem[]>([]);
  const { toast } = useToast();

  const handleWasteTypeSelect = (wasteType: JenisSampah) => {
    if (!selectedCustomer) {
      toast({
        variant: "destructive",
        title: "Peringatan",
        description: "Silakan pilih nasabah terlebih dahulu"
      });
      return;
    }
    
    setSelectedWasteType(wasteType);
    setShowWeightModal(true);
  };

  const handleAddItem = (weight: number, subtotal: number) => {
    if (!selectedWasteType) return;

    const newItem: TransactionItem = {
      id: Date.now().toString(),
      nama_sampah: selectedWasteType.nama,
      berat_kg: weight,
      harga_kg: selectedWasteType.harga_kg,
      subtotal: subtotal
    };

    setTransactionItems(prev => [...prev, newItem]);
    
    toast({
      title: "Item Ditambahkan",
      description: `${selectedWasteType.nama} ${weight}kg berhasil ditambahkan`
    });
  };

  const handleRemoveItem = (itemId: string) => {
    setTransactionItems(prev => prev.filter(item => item.id !== itemId));
    
    toast({
      title: "Item Dihapus",
      description: "Item berhasil dihapus dari transaksi"
    });
  };

  const handleSaveTransaction = () => {
    if (!selectedCustomer || transactionItems.length === 0) return;

    // Simulate saving transaction
    toast({
      title: "Transaksi Berhasil",
      description: `Transaksi untuk ${selectedCustomer.nama} berhasil disimpan`
    });

    // Reset form
    setSelectedCustomer(null);
    setTransactionItems([]);
  };

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="py-6 space-y-6">
        <CustomerInput
          onCustomerSelect={setSelectedCustomer}
          selectedCustomer={selectedCustomer}
        />

        <WasteTypeGrid
          onWasteTypeSelect={handleWasteTypeSelect}
          disabled={!selectedCustomer}
        />

        <TransactionSummary
          items={transactionItems}
          onRemoveItem={handleRemoveItem}
          onSaveTransaction={handleSaveTransaction}
          disabled={!selectedCustomer}
        />

        <WeightInputModal
          isOpen={showWeightModal}
          onClose={() => setShowWeightModal(false)}
          wasteType={selectedWasteType}
          onAdd={handleAddItem}
        />
      </div>
    </div>
  );
}