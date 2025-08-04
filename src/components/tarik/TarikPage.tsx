import { useState } from "react";
import { CreditCard, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockNasabah, formatRupiah } from "@/data/mockData";
import { useToast } from "@/hooks/use-toast";

export function TarikPage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const { toast } = useToast();

  const selectedCustomer = mockNasabah.find(n => n.id_nasabah === selectedCustomerId);

  const handleWithdraw = () => {
    if (!selectedCustomer) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Silakan pilih nasabah terlebih dahulu"
      });
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Jumlah penarikan harus berupa angka positif"
      });
      return;
    }

    if (amount > selectedCustomer.saldo) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Jumlah penarikan melebihi saldo yang tersedia"
      });
      return;
    }

    // Simulate withdrawal
    toast({
      title: "Penarikan Berhasil",
      description: `Penarikan ${formatRupiah(amount)} untuk ${selectedCustomer.nama} berhasil diproses`
    });

    // Reset form
    setSelectedCustomerId("");
    setWithdrawAmount("");
  };

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="py-6 space-y-6">
        <Card className="p-6 bg-gradient-card border-0 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                Penarikan Saldo
              </h2>
              <p className="text-muted-foreground">
                Proses penarikan dana nasabah
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Pilih Nasabah
              </label>
              <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                <SelectTrigger className="bg-input">
                  <SelectValue placeholder="Cari dan pilih nasabah..." />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {mockNasabah.map(nasabah => (
                    <SelectItem key={nasabah.id_nasabah} value={nasabah.id_nasabah}>
                      <div className="flex items-center justify-between w-full">
                        <span>{nasabah.nama}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ID: {nasabah.id_nasabah}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCustomer && (
              <Card className="p-4 bg-primary/5 border-primary/20">
                <h4 className="font-semibold text-foreground mb-2">
                  Informasi Nasabah
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nama:</span>
                    <span className="font-medium">{selectedCustomer.nama}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ID Nasabah:</span>
                    <span className="font-medium">{selectedCustomer.id_nasabah}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saldo Saat Ini:</span>
                    <span className="font-bold text-primary text-lg">
                      {formatRupiah(selectedCustomer.saldo)}
                    </span>
                  </div>
                </div>
              </Card>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">
                Jumlah Penarikan (Rp)
              </label>
              <Input
                type="number"
                placeholder="0"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="bg-input text-lg"
                min="0"
                step="1000"
                disabled={!selectedCustomer}
              />
              
              {selectedCustomer && withdrawAmount && (
                <div className="mt-2">
                  {parseFloat(withdrawAmount) > selectedCustomer.saldo ? (
                    <div className="flex items-center gap-2 text-destructive">
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm">
                        Jumlah melebihi saldo yang tersedia
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Saldo setelah penarikan: {formatRupiah(selectedCustomer.saldo - (parseFloat(withdrawAmount) || 0))}
                    </p>
                  )}
                </div>
              )}
            </div>

            <Button
              onClick={handleWithdraw}
              disabled={
                !selectedCustomer || 
                !withdrawAmount || 
                parseFloat(withdrawAmount) <= 0 ||
                parseFloat(withdrawAmount) > (selectedCustomer?.saldo || 0)
              }
              className="w-full bg-gradient-primary hover:bg-primary-glow text-lg py-6"
            >
              Proses Penarikan
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}