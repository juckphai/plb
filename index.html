<!DOCTYPE html>
<html lang="th">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>โปรแกรมออกแบบและพิมพ์ฉลากอเนกประสงค์อัตโนมัติ (A4) - Vector Text PDF</title>
    <link rel="stylesheet" href="style.css">
    
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#2b579a">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <link class="apple-touch-icon" href="https://cdn-icons-png.flaticon.com/512/1040/1040232.png">
    
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(reg => console.log('Service Worker ลงทะเบียนสำเร็จ!', reg))
                    .catch(err => console.log('Service Worker ลงทะเบียนล้มเหลว:', err));
            });
        }
    </script>
</head>
<body>

    <div class="page-view active" id="setup-page">
        <div class="control-panel">
            <div class="panel-title">⚙️ ระบบตั้งค่าการพิมพ์ฉลากทีละขั้นตอน</div>
            
            <button id="pwa-install-btn" class="btn btn-success" style="display: none; background-color: #1e3d6b; margin-bottom: 4px;">
                📲 ติดตั้งแอปนี้ลงบนเครื่อง (ใช้งานแบบ Offline)
            </button>

            <div class="step-container" style="background-color: #fffbeb; border: 1px solid #fef3c7;">
                <div class="step-title" style="color: var(--orange-color)">💾 จัดการไฟล์ต้นฉบับ (.json)</div>
                <div class="grid-2col">
                    <button class="btn btn-orange" onclick="exportTemplate()" style="font-size: 0.8rem; padding: 6px 10px;">
                        📥 บันทึกต้นฉบับ
                    </button>
                    <button class="btn btn-orange" onclick="document.getElementById('import-file').click()" style="font-size: 0.8rem; padding: 6px 10px;">
                        📂 โหลดต้นฉบับ
                    </button>
                </div>
                <input type="file" id="import-file" style="display: none;" accept=".json" onchange="importTemplate(event)">
            </div>

            <div class="step-container">
                <div class="step-title">📋 ขั้นตอนที่ 1: ตั้งค่าระยะขอบกระดาษ A4 (มม.)</div>
                <div class="grid-4col">
                    <div class="input-group">
                        <label>ขอบบน</label>
                        <input type="number" id="margin-top" value="10" min="0" max="50" step="0.5">
                    </div>
                    <div class="input-group">
                        <label>ขอบล่าง</label>
                        <input type="number" id="margin-bottom" value="10" min="0" max="50" step="0.5">
                    </div>
                    <div class="input-group">
                        <label>ขอบซ้าย</label>
                        <input type="number" id="margin-left" value="10" min="0" max="50" step="0.5">
                    </div>
                    <div class="input-group">
                        <label>ขอบขวา</label>
                        <input type="number" id="margin-right" value="10" min="0" max="50" step="0.5">
                    </div>
                </div>
                <p style="margin: 0; font-size: 0.75rem; color: #6b7280;">*ขยับระยะขอบเพื่อดันพื้นที่ใช้งานให้เต็มหน้ากระดาษได้อิสระ</p>
            </div>

            <div class="step-container">
                <div class="step-title">📏 ขั้นตอนที่ 2: ขนาดฉลาก & ช่องว่างตัด (มม.)</div>
                <div class="grid-2col">
                    <div class="input-group">
                        <label>ความกว้างฉลาก (W)</label>
                        <input type="number" id="label-width" value="40" min="5" max="190" step="0.5">
                    </div>
                    <div class="input-group">
                        <label>ความสูงฉลาก (H)</label>
                        <input type="number" id="label-height" value="25" min="5" max="270" step="0.5">
                    </div>
                </div>
                <div class="grid-2col">
                    <div class="input-group">
                        <label>ช่องว่างแนวนอน (Gap X)</label>
                        <input type="number" id="gap-x" value="2" min="0" max="20" step="0.5">
                    </div>
                    <div class="input-group">
                        <label>ช่องว่างแนวตั้ง (Gap Y)</label>
                        <input type="number" id="gap-y" value="2" min="0" max="20" step="0.5">
                    </div>
                </div>
                <div class="input-group">
                    <label>รูปแบบเส้นขอบพรีวิวเพื่อตัด</label>
                    <select id="border-style">
                        <option value="dashed">เส้นประสีเทา (แนะนำ)</option>
                        <option value="dotted">จุดไข่ปลาบางๆ</option>
                        <option value="solid">เส้นทึบบาง</option>
                        <option value="none">ไม่มีเส้นขอบ</option>
                    </select>
                </div>
            </div>

            <div class="step-container">
                <div class="step-title">✍️ ขั้นตอนที่ 3: กำหนดแถวและข้อความ</div>
                <div class="input-group">
                    <label>เลือกจำนวนแถวข้อความบนฉลาก</label>
                    <select id="row-count">
                        <option value="1">1 แถว</option>
                        <option value="2">2 แถว</option>
                        <option value="3" selected>3 แถว</option>
                        <option value="4">4 แถว</option>
                        <option value="5">5 แถว</option>
                    </select>
                </div>

                <div class="input-group checkbox-group" style="flex-direction: row; align-items: center; gap: 8px; margin-top: 4px;">
                    <input type="checkbox" id="enable-barcode" style="width: auto; cursor: pointer;">
                    <label for="enable-barcode" style="cursor: pointer; color: #b45309; font-weight: bold;">📊 เปิดใช้งานบาร์โค้ด EAN-13 ในบรรทัดสุดท้าย</label>
                </div>
                
                <div id="text-inputs-container"></div>
            </div>

            <button class="btn btn-primary" onclick="generateAndShowPreview()" style="font-size: 1.1rem; padding: 14px;">
                👁️ อัปเดตและแสดงตัวอย่างฉลาก
            </button>

            <div id="live-status-badge" class="status-badge">
                พร้อมสำหรับการคำนวณพื้นที่...
            </div>
        </div>
    </div>

    <div class="page-view" id="preview-page">
        <div class="preview-toolbar">
            <button class="btn btn-primary" onclick="backToSetup()" style="width: auto; padding: 8px 16px;">
                ⬅️ ปิดหน้าตัวอย่าง (กลับไปแก้ไข)
            </button>
            <div class="toolbar-actions">
                <button class="btn btn-success" onclick="exportToTextPDF()">
                    📄 บันทึกเป็น Text PDF
                </button>
                <button class="btn btn-excel" onclick="exportToExcel()">
                    📊 ส่งออก Excel
                </button>
            </div>
        </div>

        <div class="preview-area">
            <div class="a4-scroll-wrapper">
                <div class="a4-page" id="printable-a4-page">
                    <div class="label-grid" id="label-grid-container"></div>
                </div>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>