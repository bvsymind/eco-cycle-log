import { useState, useMemo } from "react";
import { Calendar, Download, TrendingUp, Scale } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockTransaksi, mockNasabah, formatRupiah, formatDate, formatDateOnly } from "@/data/mockData";

export function RiwayatPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");

  const filteredTransactions = useMemo(() => {
    return mockTransaksi.filter(transaction => {
      // Filter by date range
      if (startDate) {
        const transactionDate = transaction.timestamp.toISOString().split('T')[0];
        if (transactionDate < startDate) return false;
      }
      if (endDate) {
        const transactionDate = transaction.timestamp.toISOString().split('T')[0];
        if (transactionDate > endDate) return false;
      }

      // Filter by customer
      if (selectedCustomer && transaction.id_nasabah !== selectedCustomer) {
        return false;
      }

      return true;
    });
  }, [startDate, endDate, selectedCustomer]);

  const summary = useMemo(() => {
    const totalSetoran = filteredTransactions
      .filter(t => t.tipe === 'setor')
      .reduce((sum, t) => sum + t.total_berat_kg, 0);
    
    const totalSaldo = filteredTransactions
      .reduce((sum, t) => sum + t.total_harga, 0);

    return { totalSetoran, totalSaldo };
  }, [filteredTransactions]);

  const getTransactionDescription = (transaction: any) => {
    if (transaction.tipe === 'tarik') {
      return "Penarikan Saldo";
    }
    
    return `Setor: ${transaction.items.map((item: any) => item.nama_sampah).join(', ')}`;
  };

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="py-6 space-y-6">
        {/* Filter Section */}
        <Card className="p-4 bg-gradient-card border-0 shadow-card">
          <h3 className="font-semibold mb-4">Filter Transaksi</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tanggal Mulai</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tanggal Akhir</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nasabah</label>
              <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                <SelectTrigger className="bg-input">
                  <SelectValue placeholder="Semua Nasabah" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="">Semua Nasabah</SelectItem>
                  {mockNasabah.map(nasabah => (
                    <SelectItem key={nasabah.id_nasabah} value={nasabah.id_nasabah}>
                      {nasabah.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-gradient-card border-0 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                <Scale className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Setoran</p>
                <p className="text-lg font-bold text-foreground">
                  {summary.totalSetoran.toFixed(1)} kg
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-card border-0 shadow-card">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Transaksi</p>
                <p className="text-lg font-bold text-primary">
                  {formatRupiah(summary.totalSaldo)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Export Button */}
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Download className="h-4 w-4 mr-2" />
            Export ke Excel
          </Button>
        </div>

        {/* Transaction Table */}
        <Card className="border-0 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-semibold">Tanggal</th>
                  <th className="text-left p-4 font-semibold">Nasabah</th>
                  <th className="text-left p-4 font-semibold">Deskripsi</th>
                  <th className="text-right p-4 font-semibold">Berat</th>
                  <th className="text-right p-4 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                      Tidak ada data transaksi
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <tr key={transaction.id} className="border-b hover:bg-muted/50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium">{formatDateOnly(transaction.timestamp)}</p>
                          <p className="text-sm text-muted-foreground">
                            {transaction.timestamp.toLocaleTimeString('id-ID', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </td>
                      <td className="p-4 font-medium">{transaction.nama_nasabah}</td>
                      <td className="p-4">
                        <p className="text-sm">{getTransactionDescription(transaction)}</p>
                      </td>
                      <td className="p-4 text-right">
                        {transaction.tipe === 'setor' 
                          ? `${transaction.total_berat_kg.toFixed(1)} kg`
                          : '-'
                        }
                      </td>
                      <td className="p-4 text-right">
                        <span className={`font-semibold ${
                          transaction.tipe === 'setor' 
                            ? 'text-success' 
                            : 'text-destructive'
                        }`}>
                          {formatRupiah(Math.abs(transaction.total_harga))}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}