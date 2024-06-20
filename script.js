document.addEventListener("DOMContentLoaded", function() {
    // Data penjualan produk selama seminggu dan pendapatan (misal harga produk * 10)
    const salesData = [70, 64, 92, 100, 30, 28, 59];
    const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
    const revenue = salesData.map(sales => sales * 10); 

    // Mengisi tabel dengan data
    const tableBody = document.querySelector("#salesTable tbody");
    salesData.forEach((sales, index) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${days[index]}</td>
        <td>${sales}</td>
        <td>${revenue[index].toLocaleString('id-ID', { style: 'currency', currency: 'IDR' })}</td>
      `;
      tableBody.appendChild(row);
    });
  
    // Membuat grafik menggunakan Chart.js
    const ctx = document.getElementById('salesChart').getContext('2d');
    const salesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: days,
        datasets: [{
          label: 'Produk Terjual',
          data: salesData,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  });
document.getElementById('generate-pdf').addEventListener('click', function () {
    
    // Mendapatkan referensi ke pustaka jsPDF
    const { jsPDF } = window.jspdf;

    // Membuat objek PDF baru
    const doc = new jsPDF();

    // Data penjualan produk selama seminggu dan pendapatan (misal harga produk * 10)
    const salesData = [70, 64, 92, 100, 30, 28, 59];
    const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];
    const revenue = salesData.map(sales => sales * 10); 

    // ---- Judul Laporan ----
    doc.setFontSize(20);  // Atur ukuran font judul
    // Menambahkan teks judul ke halaman PDF, di tengah secara horizontal
    doc.text("Laporan Penjualan Mingguan", doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

    // ---- Grafik Bar ----
    const chartWidth = doc.internal.pageSize.getWidth() - 40; // Lebar grafik (dengan margin)
    const chartHeight = 150; // Tinggi grafik
    const barWidth = chartWidth / salesData.length; // Lebar setiap bar
    const maxSales = Math.max(...salesData); // Nilai penjualan tertinggi
    const y = 40; // Posisi awal grafik pada sumbu Y

    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF5', '#F5FF33']; // Warna bar
    doc.setFontSize(10); // Ukuran font label

    // Menggambar setiap bar dan menambahkan label
    salesData.forEach((sales, index) => {
        const barHeight = (sales / maxSales) * chartHeight; // Tinggi bar
        const x = 20 + index * barWidth; // Posisi bar

        doc.setFillColor(colors[index]); // Set warna bar
        doc.rect(x, y + chartHeight - barHeight, barWidth - 5, barHeight, 'F'); // Gambar bar

        doc.text(sales.toString(), x + barWidth / 2 - 5, y + chartHeight - barHeight - 5, { align: 'center' }); // Label jumlah produk
        doc.text(days[index], x + barWidth / 2, y + chartHeight + 10, { align: 'center' }); // Label hari
    });

    // ---- Label Sumbu Y ----
    doc.setFontSize(12);
    doc.text("Jumlah Produk", 10, y + chartHeight / 2, { angle: 90 }); // Label sumbu Y

    // ---- Membuat Halaman Baru untuk Tabel ----
    doc.addPage(); // Tambahkan halaman baru

    // ---- Tabel ----
    const tableData = days.map((day, index) => [day, salesData[index], revenue[index]]); // Data tabel

    // Membuat tabel dengan autoTable
    doc.autoTable({
        head: [['Hari', 'Produk Terjual', 'Pendapatan']], // Header tabel
        body: tableData, // Data tabel
        startY: y, // Posisi awal tabel
        theme: 'grid', // Tema tabel
        styles: { fontSize: 10, cellPadding: 5, halign: 'center' }, // Gaya sel tabel
        headStyles: { fillColor: [41, 128, 185], textColor: [255, 255, 255] }, // Gaya header
        alternateRowStyles: { fillColor: [240, 240, 240] } // Warna baris ganjil
    });

    // ---- Menampilkan atau Mencetak PDF ----
    doc.output('dataurlnewwindow'); // Tampilkan PDF di tab baru
});
