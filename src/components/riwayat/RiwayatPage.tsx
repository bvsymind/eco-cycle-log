import { useState, useMemo, useEffect } from "react";
import { Download, Scale, RefreshCw, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { transaksiService, nasabahService, type Transaksi, type Nasabah, formatRupiah, formatDateOnly } from "@/services/firebase";
import { useToast } from "@/hooks/use-toast";
import * as XLSX from 'xlsx';

export function RiwayatPage() {
  const [selectedCustomer, setSelectedCustomer] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [transactions, setTransactions] = useState<Transaksi[]>([]);
  const [nasabahList, setNasabahList] = useState<Nasabah[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [transactionsData, nasabahData] = await Promise.all([
        transaksiService.getAll(),
        nasabahService.getAll()
      ]);
      setTransactions(transactionsData);
      setNasabahList(nasabahData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Gagal memuat data. Periksa koneksi internet."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await loadData();
      toast({
        title: "Data Diperbarui",
        description: "Data transaksi berhasil diperbarui"
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

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      if (startDate) {
        const transactionDate = transaction.timestamp.toISOString().split('T')[0];
        if (transactionDate < startDate) return false;
      }
      if (endDate) {
        const transactionDate = transaction.timestamp.toISOString().split('T')[0];
        if (transactionDate > endDate) return false;
      }
      if (selectedCustomer !== "all" && transaction.id_nasabah !== selectedCustomer) {
        return false;
      }
      return true;
    });
  }, [transactions, startDate, endDate, selectedCustomer]);

  const summary = useMemo(() => {
    const totalSetoran = filteredTransactions
      .filter(t => t.tipe === 'setor')
      .reduce((sum, t) => sum + (Number(t.total_berat_kg) || 0), 0);
    
    const totalSaldo = filteredTransactions
      .reduce((sum, t) => sum + (Number(t.total_harga) || 0), 0);

    return { totalSetoran, totalSaldo };
  }, [filteredTransactions]);

  const getTransactionDescription = (transaction: Transaksi) => {
    if (transaction.tipe === 'tarik') {
      return "Penarikan Saldo";
    }
    if (!transaction.items || transaction.items.length === 0) {
        return "Setor: Tidak ada detail item";
    }
    return `Setor: ${transaction.items.map(item => item.nama_sampah).join(', ')}`;
  };

  const handleExport = () => {
    if (filteredTransactions.length === 0) {
      toast({
        variant: "destructive",
        title: "Tidak Ada Data",
        description: "Tidak ada data untuk diekspor sesuai filter yang dipilih.",
      });
      return;
    }

    setIsExporting(true);

    try {
      const dataToExport = filteredTransactions.map(trx => ({
        'Tanggal': new Date(trx.timestamp).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' }),
        'Nama Nasabah': trx.nama_nasabah,
        'Tipe Transaksi': trx.tipe === 'setor' ? 'Setoran' : 'Penarikan',
        'Deskripsi': getTransactionDescription(trx),
        'Berat (kg)': trx.tipe === 'setor' ? (Number(trx.total_berat_kg) || 0) : '-',
        'Total (Rp)': Number(trx.total_harga) || 0,
      }));

      const worksheet = XLSX.utils.json_to_sheet(dataToExport);

      const objectMaxLength = Object.keys(dataToExport[0]).map(key => key.length);
      const wscols = objectMaxLength.map((w, i) => ({
        wch: Math.max(w, ...dataToExport.map(obj => (obj[Object.keys(obj)[i]]?.toString() ?? "").length)) + 2,
      }));
      worksheet["!cols"] = wscols;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Riwayat Transaksi");

      const fileName = `Riwayat_Transaksi_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);
      
      toast({
        title: "Export Berhasil",
        description: `${filteredTransactions.length} baris data telah diekspor.`,
      });

    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast({
        variant: "destructive",
        title: "Export Gagal",
        description: "Terjadi kesalahan saat membuat file Excel.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 pb-20">
        <div className="py-6 space-y-6">
          {/* Skeleton UI */}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-20">
      <div className="py-6 space-y-6">
        <Card className="p-4 bg-gradient-card border-0 shadow-card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Filter Transaksi</h3>
            <Button 
              onClick={handleRefresh} 
              disabled={refreshing || isExporting}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
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
                  <SelectItem value="all">Semua Nasabah</SelectItem>
                  {nasabahList.map(nasabah => (
                    <SelectItem key={nasabah.id_nasabah} value={nasabah.id_nasabah}>
                      {nasabah.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

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
                <p className="text-sm text-muted-foreground">Total Nilai Transaksi</p>
                <p className="text-lg font-bold text-primary">
                  {formatRupiah(summary.totalSaldo)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleExport}
            disabled={isExporting || refreshing}
            variant="outline" 
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Download className={`h-4 w-4 mr-2 ${isExporting ? 'animate-spin' : ''}`} />
            {isExporting ? 'Mengekspor...' : 'Export ke Excel'}
          </Button>
        </div>

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
                      {transactions.length === 0 ? "Belum ada data transaksi" : "Tidak ada data yang sesuai dengan filter"}
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
                          ? `${(Number(transaction.total_berat_kg) || 0).toFixed(1)} kg`
                          : '-'
                        }
                      </td>
                      <td className="p-4 text-right">
                        <span className={`font-semibold ${
                          transaction.tipe === 'setor' 
                            ? 'text-success' 
                            : 'text-destructive'
                        }`}>
                          {formatRupiah(Number(transaction.total_harga) || 0)}
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