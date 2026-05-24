let defaultTexts = ["PROMO-2026", "฿199.-", "รหัสสินค้า", "ลดล้างสต๊อก", "สินค้าแนะนำ"];
let defaultStyles = ["normal", "bold", "normal", "normal", "normal"];

function generateInputFields() {
    const rowCount = parseInt(document.getElementById('row-count').value);
    const container = document.getElementById('text-inputs-container');
    container.innerHTML = '';

    for (let i = 0; i < rowCount; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.className = 'dynamic-row-input';
        rowDiv.innerHTML = `
            <div class="input-group">
                <label>ระบุข้อความ แถวที่ ${i + 1}</label>
                <input type="text" class="label-input-text" data-index="${i}" value="${defaultTexts[i] || ''}" placeholder="ข้อความแถวที่ ${i + 1}">
            </div>
            <div class="input-group" style="margin-top:4px;">
                <select class="label-input-style" data-index="${i}">
                    <option value="normal" ${defaultStyles[i] === 'normal' ? 'selected' : ''}>ตัวปกติ (Normal)</option>
                    <option value="bold" ${defaultStyles[i] === 'bold' ? 'selected' : ''}>ตัวหนา (Bold)</option>
                </select>
            </div>
        `;
        container.appendChild(rowDiv);
    }

    document.querySelectorAll('.label-input-text').forEach(input => {
        input.addEventListener('input', (e) => {
            const idx = e.target.getAttribute('data-index');
            defaultTexts[idx] = e.target.value;
        });
    });

    document.querySelectorAll('.label-input-style').forEach(select => {
        select.addEventListener('change', (e) => {
            const idx = e.target.getAttribute('data-index');
            defaultStyles[idx] = e.target.value;
        });
    });
}

function renderLabelsGrid() {
    const marginTop = parseFloat(document.getElementById('margin-top').value) || 0;
    const marginBottom = parseFloat(document.getElementById('margin-bottom').value) || 0;
    const marginLeft = parseFloat(document.getElementById('margin-left').value) || 0;
    const marginRight = parseFloat(document.getElementById('margin-right').value) || 0;

    const a4Page = document.getElementById('printable-a4-page');
    a4Page.style.paddingTop = `${marginTop}mm`;
    a4Page.style.paddingBottom = `${marginBottom}mm`;
    a4Page.style.paddingLeft = `${marginLeft}mm`;
    a4Page.style.paddingRight = `${marginRight}mm`;

    const widthMm = parseFloat(document.getElementById('label-width').value) || 10;
    const heightMm = parseFloat(document.getElementById('label-height').value) || 10;
    const gapX = parseFloat(document.getElementById('gap-x').value) || 0;
    const gapY = parseFloat(document.getElementById('gap-y').value) || 0;
    const borderStyle = document.getElementById('border-style').value;
    const rowCount = parseInt(document.getElementById('row-count').value);

    const maxPrintableWidth = 210 - (marginLeft + marginRight); 
    const maxPrintableHeight = 297 - (marginTop + marginBottom);

    const cols = Math.floor((maxPrintableWidth + gapX) / (widthMm + gapX));
    const rows = Math.floor((maxPrintableHeight + gapY) / (heightMm + gapY));
    const totalLabels = cols * rows;

    const statusBadge = document.getElementById('live-status-badge');

    if (cols <= 0 || rows <= 0) {
        statusBadge.innerHTML = `<span style="color:#ef4444;">❌ ระยะขอบหรือขนาดฉลากใหญ่เกินพิกัด A4</span>`;
        document.getElementById('label-grid-container').innerHTML = '';
        return;
    }

    statusBadge.innerHTML = `📊 บรรจุได้เต็มที่: ${cols} คอลัมน์ × ${rows} แถว (รวม ${totalLabels} ดวง/หน้า)`;

    const gridContainer = document.getElementById('label-grid-container');
    gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${widthMm}mm)`;
    gridContainer.style.gridTemplateRows = `repeat(${rows}, ${heightMm}mm)`;
    gridContainer.style.gap = `${gapY}mm ${gapX}mm`;
    gridContainer.innerHTML = '';

    for (let i = 0; i < totalLabels; i++) {
        const labelBox = document.createElement('div');
        labelBox.className = 'label-item';
        labelBox.style.display = 'grid';
        labelBox.style.gridTemplateRows = `repeat(${rowCount}, 1fr)`;
        
        if (borderStyle === 'none') {
            labelBox.style.border = 'none';
        } else {
            labelBox.style.border = `1px ${borderStyle} #cbd5e1`;
        }

        for (let r = 0; r < rowCount; r++) {
            const textRow = document.createElement('div');
            textRow.className = 'label-text-row';
            textRow.style.fontWeight = defaultStyles[r];

            const textWrapper = document.createElement('span');
            textWrapper.className = 'scale-wrapper';
            textWrapper.innerText = defaultTexts[r] || ' ';

            textRow.appendChild(textWrapper);
            labelBox.appendChild(textRow);
        }

        gridContainer.appendChild(labelBox);
    }

    autoFitLabelFonts();
}

/* ─── ฟังก์ชันคำนวณขนาดอักษรอัตโนมัติ (เวอร์ชันปรับปรุงความแม่นยำภาษาไทย) ─── */
function autoFitLabelFonts() {
    const items = document.querySelectorAll('.label-item');

    items.forEach(labelBox => {
        const wrappers = labelBox.querySelectorAll('.scale-wrapper');
        const rows = labelBox.querySelectorAll('.label-text-row');

        let fontSize = 36;

        const applyFont = (size) => {
            wrappers.forEach(span => {
                span.style.fontSize = size + 'px';
                span.style.transform = 'scale(1)';
            });
        };

        applyFont(fontSize);

        // คำนวณความสูงต่อแถวจริง
        const availableHeightPerRow = labelBox.clientHeight / rows.length;
        let overflow = true;

        while (overflow && fontSize > 4) {
            overflow = false;
            applyFont(fontSize);

            rows.forEach(row => {
                const span = row.querySelector('.scale-wrapper');
                // ใช้ getBoundingClientRect แม่นยำกว่าตรวจสอบจากตัวกล่องโดยรวม
                const textHeight = span.getBoundingClientRect().height;

                // เผื่อพื้นที่ 8% สำหรับสระบน-ล่างและส่วนประกอบอักษรภาษาไทย
                if (textHeight > (availableHeightPerRow * 0.92)) {
                    overflow = true;
                }
            });

            if (overflow) {
                fontSize -= 0.5;
            }
        }

        // ปรับขนาดความกว้างแนวนอน (บีบอักษรหากข้อความยาวเกินพิกัดขอบฉลาก)
        wrappers.forEach(span => {
            const maxAllowedWidth = labelBox.clientWidth * 0.94; // เผื่อขอบข้าง 6% ปลอดภัยไว้ก่อน
            const textWidth = span.getBoundingClientRect().width;

            if (textWidth > maxAllowedWidth) {
                const ratio = maxAllowedWidth / textWidth;
                span.style.transform = `scale(${ratio})`;
            }
        });
    });
}

// ─── ระบบควบคุมการเปลี่ยนหน้าจอ ───
function generateAndShowPreview() {
    renderLabelsGrid();
    document.getElementById('setup-page').classList.remove('active');
    document.getElementById('preview-page').classList.add('active');
    
    setTimeout(autoFitLabelFonts, 50);
    setTimeout(autoFitLabelFonts, 150); 
}

function backToSetup() {
    document.getElementById('preview-page').classList.remove('active');
    document.getElementById('setup-page').classList.add('active');
}

function exportTemplate() {
    const configData = {
        marginTop: document.getElementById('margin-top').value,
        marginBottom: document.getElementById('margin-bottom').value,
        marginLeft: document.getElementById('margin-left').value,
        marginRight: document.getElementById('margin-right').value,
        labelWidth: document.getElementById('label-width').value,
        labelHeight: document.getElementById('label-height').value,
        gapX: document.getElementById('gap-x').value,
        gapY: document.getElementById('gap-y').value,
        borderStyle: document.getElementById('border-style').value,
        rowCount: document.getElementById('row-count').value,
        texts: defaultTexts,
        styles: defaultStyles
    };

    let userFilename = prompt("✍️ กรุณาตั้งชื่อไฟล์ต้นฉบับของคุณ:", "");
    if (userFilename === null) return; 
    userFilename = userFilename.trim();

    if (userFilename === "") {
        const now = new Date();
        userFilename = `label_template_${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }

    if (!userFilename.toLowerCase().endsWith('.json')) {
        userFilename += '.json';
    }

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(configData));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", userFilename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
}

function importTemplate(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const configData = JSON.parse(e.target.result);
            
            document.getElementById('margin-top').value = configData.marginTop;
            document.getElementById('margin-bottom').value = configData.marginBottom;
            document.getElementById('margin-left').value = configData.marginLeft;
            document.getElementById('margin-right').value = configData.marginRight;
            document.getElementById('label-width').value = configData.labelWidth;
            document.getElementById('label-height').value = configData.labelHeight;
            document.getElementById('gap-x').value = configData.gapX;
            document.getElementById('gap-y').value = configData.gapY;
            document.getElementById('border-style').value = configData.borderStyle;
            document.getElementById('row-count').value = configData.rowCount;
            
            defaultTexts = configData.texts;
            defaultStyles = configData.styles;

            generateInputFields();
            alert("📂 โหลดโครงสร้างต้นฉบับเรียบร้อยแล้วครับ! (กดปุ่มอัปเดตเพื่อดูตัวอย่าง)");
            backToSetup();
        } catch (err) {
            alert("❌ ไฟล์ต้นฉบับไม่ถูกต้องหรือไม่สมบูรณ์");
        }
    };
    reader.readAsText(file);
    event.target.value = ''; 
}

function exportToTextPDF() {
    const originalTitle = document.title;
    document.title = "labels_export_text";
    window.print();
    document.title = originalTitle;
}

function exportToExcel() {
    const rowCount = parseInt(document.getElementById('row-count').value);
    let csvContent = "data:text/csv;charset=utf-8,\uFEFF"; 
    csvContent += "ลำดับแถวบนฉลาก,ข้อความ,รูปแบบตัวอักษร\n";

    for (let i = 0; i < rowCount; i++) {
        const text = (defaultTexts[i] || "").replace(/"/g, '""'); 
        const style = defaultStyles[i] === "bold" ? "ตัวหนา" : "ตัวปกติ";
        csvContent += `แถวที่ ${i+1},"${text}",${style}\n`;
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "label_text_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.getElementById('row-count').addEventListener('change', () => {
    generateInputFields();
});

window.onload = function() {
    generateInputFields();
};