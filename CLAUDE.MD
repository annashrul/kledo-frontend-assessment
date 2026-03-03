Frontend Developer
Mulai: Selasa, 03/03/2026 13:14:29
Durasi waktu pengerjaan adalah 24 jam sejak soal ini tampil.
Soal
Buat satu halaman untuk kebutuhan filter wilayah dengan layout seperti berikut.

Layout Wilayah

Kondisi awal, hanya data Provinsi yang terisi di komponen combobox Provinsi.
Jika user memilih Provinsi, maka data Kota/Kabupaten akan terisi di komponen combobox Kota/Kabupaten berdasarkan Provinsi yang dipilih. Begitu juga dengan Kecamatan.
Pastikan komponen combobox memiliki name berikut:
Provinsi - province.
Kota/Kabupaten - regency.
Kecamatan - district.
Breadcrumb dan konten utama menampilkan wilayah sesuai kondisi filter yang terpilih.
Pastikan komponen breadcrumb memiliki class breadcrumb.
Pastikan komponen konten utama menggunakan tag <main>.
Kondisi filter wilayah tidak terpengaruh meskipun browser di-refresh.
Tombol Reset berfungsi untuk mereset semua filter dan kembali ke kondisi awal.
Implementasikan kebutuhan di atas menggunakan React Router dengan mode data (bukan framework) tanpa library tambahan. Untuk kebutuhan styling, gunakan Tailwind CSS. Gunakan data dummy yang tersedia di bagian Jawaban Anda untuk mengisi combobox wilayah, melalui data loader. Setelah selesai, publikasikan hasilnya.

Jawaban Anda
Ambil data dummy menggunakan fetch('/data/indonesia_regions.json')

districts = di file districts.json
provinces = di file province.json
regencies = di file regencies.json

https://your-project.pages.dev
Tempat dimana hasil assessment dapat diakses publik.


import {} from 'react-router-dom';

// Komponen ini merangkum seluruh kebutuhan dalam satu halaman.
export default function FilterPage() {
    return (
        <></>
    );
}

Lampirkan satu file TSX yang menunjukkan bagaimana Anda merealisasikan kebutuhan.

Tulis kesan dan pesan singkat tentang soal dan pengalaman pengerjaan...
Kirim Jawaban