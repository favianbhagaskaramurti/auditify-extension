# Auditify Google Workspace Extension

Audit dokumen akademik Anda langsung dari Google Docs dengan analisis AI yang powerful.

---

## 🚀 Cara Pakai (Step-by-Step)

### Step 1: Install Extension
1. Buka Google Docs
2. Klik **Extensions** → **Apps Script**
3. Copy semua file dari folder `extension/` ke Apps Script project Anda:
   - `Code.gs`
   - `Sidebar.html`
   - `appsscript.json`
4. Klik **Deploy** → **Test deployments** → **Install**

### Step 2: Login ke Auditify
1. Buka dokumen Google Docs
2. Klik **Extensions** → **Auditify** → **Show Sidebar**
3. Klik tombol **Settings** (⚙️)
4. Klik **Open Login Page**
5. Login dengan akun Auditify Anda (Google atau Email/Password)
6. Setelah login, copy **Firebase ID Token** dari dashboard
7. Paste token ke Settings dialog
8. Klik **Save Token**

### Step 3: Audit Dokumen
1. Tulis atau buka dokumen Anda di Google Docs
2. Buka sidebar Auditify
3. Pilih **Academic Level** (SMP/SMA/Universitas/Pascasarjana)
4. Pilih **Focus Areas** yang ingin dianalisis
5. Klik **Audit Full Document** atau select text lalu klik **Audit Selected Text**
6. Tunggu hasil analisis muncul

### Step 4: Review Hasil
Setelah audit selesai, Anda akan melihat:
- **Integrity Score** (0-100)
- **Grade** (Excellent/Good/Fair/Poor)
- **Summary** singkat
- **Detailed Issues** dengan severity level

### Step 5: Highlight Issues (Opsional)
1. Klik tombol **Highlight Issues** di hasil audit
2. Issues akan di-highlight di dokumen dengan warna:
   - 🔴 **Merah**: Critical (severity tinggi)
   - 🟠 **Orange**: High priority
   - 🟡 **Kuning**: Medium priority
   - 🟢 **Hijau**: Low priority

### Step 6: Insert Report (Opsional)
1. Klik tombol **Insert Report**
2. Laporan lengkap akan ditambahkan di akhir dokumen
3. Laporan berisi semua findings dengan detail lengkap

---

## 🎯 Kemampuan Sistem

### 1. **Audit Logical Fallacies**
Mendeteksi kesalahan logika dalam argumen:
- Ad Hominem (menyerang pribadi)
- Straw Man (mengubah argumen lawan)
- False Dilemma (pilihan palsu)
- Slippery Slope (efek domino berlebihan)
- Appeal to Authority (otoritas tidak relevan)
- Hasty Generalization (generalisasi terburu-buru)
- Red Herring (mengalihkan topik)
- Circular Reasoning (argumen melingkar)
- Dan 20+ fallacy lainnya

**Output**: Lokasi fallacy, severity, penjelasan, dan saran perbaikan

### 2. **Audit Weak Arguments**
Menganalisis kekuatan argumen:
- Argumen tanpa bukti
- Bukti tidak relevan
- Bukti lemah atau anekdotal
- Klaim berlebihan (overgeneralization)
- Asumsi tidak terverifikasi
- Kontradiksi internal

**Output**: Argumen lemah dengan severity, penjelasan, dan patch suggestion

### 3. **Pentest Questions**
Menghasilkan pertanyaan kritis untuk menguji argumen:
- Pertanyaan tentang asumsi tersembunyi
- Pertanyaan tentang validitas bukti
- Pertanyaan tentang alternatif argumen
- Pertanyaan tentang implikasi logis

**Output**: 5-10 pertanyaan strategis untuk memperkuat argumen

### 4. **Academic Level Adaptation**
Analisis disesuaikan dengan level akademik:
- **SMP**: Analisis dasar, bahasa sederhana
- **SMA**: Analisis menengah, pengenalan konsep akademik
- **Universitas**: Analisis mendalam, standar akademik tinggi
- **Pascasarjana**: Analisis expert-level, standar publikasi ilmiah

### 5. **Focus Areas**
Pilih area fokus analisis:
- **Kekuatan Logika**: Fokus pada struktur argumen dan reasoning
- **Kebenaran Fakta**: Fokus pada akurasi dan verifikasi fakta
- **Netralitas Sentimen**: Fokus pada bias dan objektivitas

### 6. **Integrity Scoring**
Sistem scoring komprehensif:
- **90-100**: Excellent - Argumen sangat kuat
- **75-89**: Good - Argumen solid dengan minor issues
- **60-74**: Fair - Argumen cukup tapi perlu perbaikan
- **0-59**: Poor - Argumen lemah, perlu revisi major

### 7. **Real-time Highlighting**
Highlight issues langsung di dokumen:
- Color-coded berdasarkan severity
- Preserve formatting dokumen
- Bisa di-undo dengan Ctrl+Z

### 8. **Comprehensive Reports**
Generate laporan audit lengkap:
- Executive summary
- Detailed findings per kategori
- Severity breakdown
- Actionable recommendations
- Timestamp dan metadata

---

## 🔐 Keamanan & Privasi

- ✅ Token disimpan aman di Google User Properties
- ✅ Semua komunikasi via HTTPS
- ✅ Tidak ada penyimpanan dokumen di server
- ✅ Read-only access ke dokumen
- ✅ OAuth scopes minimal yang diperlukan

---

## 📊 Tier & Limits

### Free Tier
- 2 audits per hari
- Analisis basic
- Deteksi fallacy terbatas

### Premium Tier
- Unlimited audits
- Analisis advanced
- Full fallacy detection
- Priority support
- Detailed patch suggestions

[Upgrade ke Premium →](https://auditify-app-744909172024.us-central1.run.app/pricing)

---

## 🆘 Troubleshooting

### "Not logged in" Error
**Solusi**: Buka Settings → Login → Copy token dari dashboard → Paste di Settings

### "Token expired" Error
**Solusi**: Token Firebase expired setelah 1 jam. Login ulang dan paste token baru.

### "No text selected" Error
**Solusi**: Select text di dokumen sebelum klik "Audit Selected Text"

### API Connection Issues
**Solusi**: 
1. Cek koneksi internet
2. Verify token masih valid
3. Cek quota harian (Free: 2/day)

---

## 🤝 Support

- **Email**: support@auditify.edu
- **Web**: [auditify-app-744909172024.us-central1.run.app](https://auditify-app-744909172024.us-central1.run.app)

---

## 📄 License

Copyright © 2024 Auditify. All rights reserved.

---

**Developed with ❤️ for Academic Integrity**
