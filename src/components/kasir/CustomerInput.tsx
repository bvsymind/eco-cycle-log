import { useState } from "react";
import { Search, QrCode, CheckCircle, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockNasabah, type Nasabah } from "@/data/mockData";
import { cn } from "@/lib/utils";
import { QRScannerModal } from "./QRScannerModal";

interface CustomerInputProps {
  onCustomerSelect: (customer: Nasabah | null) => void;
  selectedCustomer: Nasabah | null;
}

export function CustomerInput({ onCustomerSelect, selectedCustomer }: CustomerInputProps) {
  const [customerId, setCustomerId] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);

  const handleQRScan = (scannedId: string) => {
    setCustomerId(scannedId);
    // Auto check customer after QR scan
    setTimeout(() => {
      const customer = mockNasabah.find(n => n.id_nasabah === scannedId.trim());
      onCustomerSelect(customer || null);
    }, 100);
  };

  const handleCheckCustomer = () => {
    if (!customerId.trim()) return;
    
    setIsChecking(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const customer = mockNasabah.find(n => n.id_nasabah === customerId.trim());
      onCustomerSelect(customer || null);
      setIsChecking(false);
    }, 500);
  };

  const handleInputChange = (value: string) => {
    setCustomerId(value);
    // Reset customer when input changes
    if (selectedCustomer) {
      onCustomerSelect(null);
    }
  };

  return (
    <Card className="p-4 mb-6 bg-gradient-card border-0 shadow-card">
      <h3 className="font-semibold text-foreground mb-3">
        Data Nasabah
      </h3>
      
      <div className="space-y-3">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="Masukkan ID Nasabah"
              value={customerId}
              onChange={(e) => handleInputChange(e.target.value)}
              className="bg-input border-border"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            onClick={() => setShowQRScanner(true)}
          >
            <QrCode className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleCheckCustomer}
            disabled={!customerId.trim() || isChecking}
            className="bg-primary hover:bg-primary-glow"
          >
            {isChecking ? (
              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Cek
          </Button>
        </div>

        {/* Customer Status */}
        {customerId && !isChecking && (
          <div className={cn(
            "flex items-center gap-2 p-3 rounded-lg border",
            selectedCustomer 
              ? "bg-success/10 border-success text-success-foreground" 
              : "bg-destructive/10 border-destructive text-destructive-foreground"
          )}>
            {selectedCustomer ? (
              <>
                <CheckCircle className="h-5 w-5 text-success" />
                <div>
                  <p className="font-medium text-success">
                    {selectedCustomer.nama}
                  </p>
                  <p className="text-sm text-success/80">
                    ID: {selectedCustomer.id_nasabah} • Saldo: Rp {selectedCustomer.saldo.toLocaleString('id-ID')}
                  </p>
                </div>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-destructive" />
                <p className="font-medium text-destructive">
                  ID Nasabah tidak ditemukan
                </p>
              </>
            )}
          </div>
        )}
      </div>

      <QRScannerModal
        isOpen={showQRScanner}
        onClose={() => setShowQRScanner(false)}
        onScan={handleQRScan}
      />
    </Card>
  );
}