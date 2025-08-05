// import { useState, useMemo } from "react";
// import { Calendar, Download, TrendingUp, Scale } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { mockTransaksi, mockNasabah } from "@/data/mockData";

// // Tambahkan fungsi helper jika belum ada di mockData
// const formatRupiah = (value: number) => {
//   return new Intl.NumberFormat('id-ID', {
//     style: 'currency',
//     currency: 'IDR',
//     minimumFractionDigits: 0,
//   }).format(value);
// };

// const formatDateOnly = (date: Date | string) => {
//   if (typeof date === 'string') {
//     return new Date(date).toLocaleDateString('id-ID');
//   }
//   return date.toLocaleDateString('id-ID');
// };

// export function RiwayatPage() {
//   const [startDate, setStartDate] = useState("");
//   const [endDate, setEndDate] = useState("");
//   // PERBAIKAN 1: Gunakan nilai khusus "all" untuk semua nasabah
//   const [selectedCustomer, setSelectedCustomer] = useState("all");

//   const filteredTransactions = useMemo(() => {
//     return mockTransaksi.filter(transaction => {
//       try {
//         // Handle berbagai format tanggal
//         const transactionDate = transaction.timestamp instanceof Date 
//           ? transaction.timestamp.toISOString().split('T')[0]
//           : new Date(transaction.timestamp).toISOString().split('T')[0];

//         if (startDate && transactionDate < startDate) return false;
//         if (endDate && transactionDate > endDate) return false;

//         // PERBAIKAN 2: Handle nilai khusus "all"
//         if (selectedCustomer !== "all" && transaction.id_nasabah !== selectedCustomer) {
//           return false;
//         }

//         return true;
//       } catch (error) {
//         console.error("Error processing transaction:", transaction, error);
//         return false;
//       }
//     });
//   }, [startDate, endDate, selectedCustomer]);

//   const summary = useMemo(() => {
//     const totalSetoran = filteredTransactions
//       .filter(t => t.tipe === 'setor')
//       .reduce((sum, t) => sum + (t.total_berat_kg || 0), 0);
    
//     const totalSaldo = filteredTransactions
//       .reduce((sum, t) => sum + (t.total_harga || 0), 0);

//     return { totalSetoran, totalSaldo };
//   }, [filteredTransactions]);

//   const getTransactionDescription = (transaction: any) => {
//     if (transaction.tipe === 'tarik') {
//       return "Penarikan Saldo";
//     }
    
//     // Handle undefined items
//     const items = transaction.items || [];
//     const itemNames = items.map((item: any) => item.nama_sampah || 'Unknown').join(', ');
//     return `Setor: ${itemNames}`;
//   };

//   return (
//     <div className="container mx-auto px-4 pb-20">
//       <div className="py-6 space-y-6">
//         {/* Filter Section */}
//         <Card className="p-4 bg-gradient-card border-0 shadow-card">
//           <h3 className="font-semibold mb-4">Filter Transaksi</h3>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium mb-2">Tanggal Mulai</label>
//               <Input
//                 type="date"
//                 value={startDate}
//                 onChange={(e) => setStartDate(e.target.value)}
//                 className="bg-input"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-2">Tanggal Akhir</label>
//               <Input
//                 type="date"
//                 value={endDate}
//                 onChange={(e) => setEndDate(e.target.value)}
//                 className="bg-input"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium mb-2">Nasabah</label>
//               <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
//                 <SelectTrigger className="bg-input">
//                   <SelectValue placeholder="Semua Nasabah" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-popover">
//                   {/* PERBAIKAN 3: Gunakan nilai khusus "all" */}
//                   <SelectItem value="all">Semua Nasabah</SelectItem>
//                   {mockNasabah.map(nasabah => (
//                     <SelectItem key={nasabah.id_nasabah} value={nasabah.id_nasabah}>
//                       {nasabah.nama}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </Card>

//         {/* Overview Cards */}
//         <div className="grid grid-cols-2 gap-4">
//           <Card className="p-4 bg-gradient-card border-0 shadow-card">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
//                 <Scale className="h-5 w-5 text-success" />
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Total Setoran</p>
//                 <p className="text-lg font-bold text-foreground">
//                   {summary.totalSetoran.toFixed(1)} kg
//                 </p>
//               </div>
//             </div>
//           </Card>

//           <Card className="p-4 bg-gradient-card border-0 shadow-card">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
//                 <TrendingUp className="h-5 w-5 text-primary" />
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Total Transaksi</p>
//                 <p className="text-lg font-bold text-primary">
//                   {formatRupiah(summary.totalSaldo)}
//                 </p>
//               </div>
//             </div>
//           </Card>
//         </div>

//         {/* Export Button */}
//         <div className="flex justify-end">
//           <Button 
//             variant="outline" 
//             className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
//           >
//             <Download className="h-4 w-4 mr-2" />
//             Export ke Excel
//           </Button>
//         </div>

//         {/* Transaction Table */}
//         <Card className="border-0 shadow-card overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="border-b bg-muted/50">
//                 <tr>
//                   <th className="text-left p-4 font-semibold">Tanggal</th>
//                   <th className="text-left p-4 font-semibold">Nasabah</th>
//                   <th className="text-left p-4 font-semibold">Deskripsi</th>
//                   <th className="text-right p-4 font-semibold">Berat</th>
//                   <th className="text-right p-4 font-semibold">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredTransactions.length === 0 ? (
//                   <tr>
//                     <td colSpan={5} className="text-center py-8 text-muted-foreground">
//                       Tidak ada data transaksi
//                     </td>
//                   </tr>
//                 ) : (
//                   filteredTransactions.map((transaction) => {
//                     // Handle berbagai format tanggal
//                     const timestamp = transaction.timestamp instanceof Date
//                       ? transaction.timestamp
//                       : new Date(transaction.timestamp);

//                     return (
//                       <tr key={transaction.id} className="border-b hover:bg-muted/50">
//                         <td className="p-4">
//                           <div>
//                             <p className="font-medium">{formatDateOnly(timestamp)}</p>
//                             <p className="text-sm text-muted-foreground">
//                               {timestamp.toLocaleTimeString('id-ID', { 
//                                 hour: '2-digit', 
//                                 minute: '2-digit' 
//                               })}
//                             </p>
//                           </div>
//                         </td>
//                         <td className="p-4 font-medium">{transaction.nama_nasabah || 'Unknown'}</td>
//                         <td className="p-4">
//                           <p className="text-sm">{getTransactionDescription(transaction)}</p>
//                         </td>
//                         <td className="p-4 text-right">
//                           {transaction.tipe === 'setor' 
//                             ? `${(transaction.total_berat_kg || 0).toFixed(1)} kg`
//                             : '-'
//                           }
//                         </td>
//                         <td className="p-4 text-right">
//                           <span className={`font-semibold ${
//                             transaction.tipe === 'setor' 
//                               ? 'text-success' 
//                               : 'text-destructive'
//                           }`}>
//                             {formatRupiah(Math.abs(transaction.total_harga || 0))}
//                           </span>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// }

import { useState, useMemo } from "react";
import { Calendar, Download, TrendingUp, Scale } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockTransaksi, mockNasabah } from "@/data/mockData";
import * as XLSX from 'xlsx'; // Import library Excel

// Tambahkan fungsi helper jika belum ada di mockData
const formatRupiah = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

const formatDateOnly = (date: Date | string) => {
  if (typeof date === 'string') {
    return new Date(date).toLocaleDateString('id-ID');
  }
  return date.toLocaleDateString('id-ID');
};

export function RiwayatPage() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("all");

  const filteredTransactions = useMemo(() => {
    return mockTransaksi.filter(transaction => {
      try {
        // Handle berbagai format tanggal
        const transactionDate = transaction.timestamp instanceof Date 
          ? transaction.timestamp.toISOString().split('T')[0]
          : new Date(transaction.timestamp).toISOString().split('T')[0];

        if (startDate && transactionDate < startDate) return false;
        if (endDate && transactionDate > endDate) return false;

        if (selectedCustomer !== "all" && transaction.id_nasabah !== selectedCustomer) {
          return false;
        }

        return true;
      } catch (error) {
        console.error("Error processing transaction:", transaction, error);
        return false;
      }
    });
  }, [startDate, endDate, selectedCustomer]);

  const summary = useMemo(() => {
    const totalSetoran = filteredTransactions
      .filter(t => t.tipe === 'setor')
      .reduce((sum, t) => sum + (t.total_berat_kg || 0), 0);
    
    const totalSaldo = filteredTransactions
      .reduce((sum, t) => sum + (t.total_harga || 0), 0);

    return { totalSetoran, totalSaldo };
  }, [filteredTransactions]);

  const getTransactionDescription = (transaction: any) => {
    if (transaction.tipe === 'tarik') {
      return "Penarikan Saldo";
    }
    
    // Handle undefined items
    const items = transaction.items || [];
    const itemNames = items.map((item: any) => item.nama_sampah || 'Unknown').join(', ');
    return `Setor: ${itemNames}`;
  };

  // Fungsi untuk export ke Excel
  const exportToExcel = () => {
    // Siapkan data untuk Excel
    const excelData = filteredTransactions.map(transaction => {
      const timestamp = transaction.timestamp instanceof Date
        ? transaction.timestamp
        : new Date(transaction.timestamp);
      
      return {
        Tanggal: formatDateOnly(timestamp),
        Waktu: timestamp.toLocaleTimeString('id-ID', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        Nasabah: transaction.nama_nasabah || 'Unknown',
        Deskripsi: getTransactionDescription(transaction),
        Berat: transaction.tipe === 'setor' 
          ? `${(transaction.total_berat_kg || 0).toFixed(1)} kg`
          : '-',
        Total: formatRupiah(Math.abs(transaction.total_harga || 0)),
        Tipe: transaction.tipe === 'setor' ? 'Setor' : 'Tarik'
      };
    });

    // Buat worksheet dari data
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Buat workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Riwayat Transaksi");
    
    // Tambahkan summary
    const summaryRow = [
      { t: "s", v: "" }, // Cell kosong
      { t: "s", v: "" },
      { t: "s", v: "TOTAL SETORAN" },
      { t: "s", v: `${summary.totalSetoran.toFixed(1)} kg` },
      { t: "s", v: "" },
      { t: "s", v: "" },
    ];
    
    const summaryRow2 = [
      { t: "s", v: "" },
      { t: "s", v: "" },
      { t: "s", v: "TOTAL TRANSAKSI" },
      { t: "s", v: "" },
      { t: "s", v: formatRupiah(summary.totalSaldo) },
      { t: "s", v: "" },
    ];
    
    // Tambahkan baris summary
    XLSX.utils.sheet_add_aoa(ws, [summaryRow], { origin: -1 });
    XLSX.utils.sheet_add_aoa(ws, [summaryRow2], { origin: -1 });
    
    // Sesuaikan lebar kolom
    const colWidths = [
      { wch: 12 }, // Tanggal
      { wch: 8 },  // Waktu
      { wch: 20 }, // Nasabah
      { wch: 30 }, // Deskripsi
      { wch: 10 }, // Berat
      { wch: 15 }, // Total
      { wch: 10 }, // Tipe
    ];
    ws['!cols'] = colWidths;
    
    // Export ke file Excel
    XLSX.writeFile(wb, `Riwayat_Transaksi_${new Date().toISOString().slice(0, 10)}.xlsx`);
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
                  <SelectItem value="all">Semua Nasabah</SelectItem>
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
            onClick={exportToExcel}
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
                  filteredTransactions.map((transaction) => {
                    // Handle berbagai format tanggal
                    const timestamp = transaction.timestamp instanceof Date
                      ? transaction.timestamp
                      : new Date(transaction.timestamp);

                    return (
                      <tr key={transaction.id} className="border-b hover:bg-muted/50">
                        <td className="p-4">
                          <div>
                            <p className="font-medium">{formatDateOnly(timestamp)}</p>
                            <p className="text-sm text-muted-foreground">
                              {timestamp.toLocaleTimeString('id-ID', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                              })}
                            </p>
                          </div>
                        </td>
                        <td className="p-4 font-medium">{transaction.nama_nasabah || 'Unknown'}</td>
                        <td className="p-4">
                          <p className="text-sm">{getTransactionDescription(transaction)}</p>
                        </td>
                        <td className="p-4 text-right">
                          {transaction.tipe === 'setor' 
                            ? `${(transaction.total_berat_kg || 0).toFixed(1)} kg`
                            : '-'
                          }
                        </td>
                        <td className="p-4 text-right">
                          <span className={`font-semibold ${
                            transaction.tipe === 'setor' 
                              ? 'text-success' 
                              : 'text-destructive'
                          }`}>
                            {formatRupiah(Math.abs(transaction.total_harga || 0))}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}