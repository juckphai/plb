let defaultTexts = ["สินค้าแนะนำ", "฿199.-", "8851234567890", "ลดล้างสต๊อก", "PROMO-2026"];
let defaultStyles = ["normal", "bold", "normal", "normal", "normal"];

function generateInputFields() {
    const rowCount = parseInt(document.getElementById('row-count').value);
    const isBarcodeEnabled = document.getElementById('enable-barcode').checked;
    const container = document.getElementById('text-inputs-container');
    container.innerHTML = '';

    // จำนวนแถวที่เป็นข้อความปกติ (ถ้าเปิดบาร์โค้ด แถวสุดท้ายจะถูกหักออกไปเป็นช่องบาร์โค้ดแยก)
    const textRowsCount = isBarcodeEnabled ? rowCount - 1 : rowCount;

    // 1. สร้างช่องกรอกข้อความปกติ
    for (let i = 0; i < textRowsCount; i++) {
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

    // 2. ถ้าเปิดใช้งานบาร์โค้ด ให้สร้างช่องกรอกบาร์โค้ดพิเศษโผล่ขึ้นมาต่อท้าย
    if (isBarcodeEnabled) {
        const barcodeIndex = rowCount - 1; // ชี้ไปที่ดัชนีแถวสุดท้ายเสมอ
        const barcodeDiv = document.createElement('div');
        barcodeDiv.className = 'dynamic-row-input';
        // กำหนดกรอบสีทอง/ส้มเพื่อให้ผู้ใช้เห็นเด่นชัดว่าเป็นช่องระบบบาร์โค้ด
        barcodeDiv.style.borderLeft = '3px solid var(--orange-color)';
        barcodeDiv.style.backgroundColor = '#fffbeb';
        
        barcodeDiv.innerHTML = `
            <div class="input-group">
                <label style="color: #b45309; font-weight: bold;">📊 ระบุรหัสบาร์โค้ดสำหรับบรรทัดสุดท้าย (เฉพาะตัวเลข 12-13 หลัก)</label>
                <input type="text" 
                       id="barcode-numeric-input" 
                       class="label-input-text" 
                       data-index="${barcodeIndex}" 
                       value="${defaultTexts[barcodeIndex] || ''}" 
                       placeholder="ตัวอย่าง: 8851234567890"
                       maxlength="13" 
                       inputmode="numeric">
            </div>
        `;
        container.appendChild(barcodeDiv);

        // เพิ่มระบบจำกัดการป้อนข้อมูล: บังคับกรอกเฉพาะตัวเลขและห้ามเกิน 13 หลัก
        const barcodeInput = document.getElementById('barcode-numeric-input');
        barcodeInput.addEventListener('input', (e) => {
            // ลบทุกอักขระที่ไม่ใช่ตัวเลขออกทันที (Regex \D)
            let cleanValue = e.target.value.replace(/\D/g, '');
            
            // ตัดให้เหลือไม่เกิน 13 หลัก
            if (cleanValue.length > 13) {
                cleanValue = cleanValue.substring(0, 13);
            }
            
            e.target.value = cleanValue;
            defaultTexts[barcodeIndex] = cleanValue; // อัปเดตลงในฐานข้อมูล
        });
    }

    // ผูก Event Listener สำหรับช่องข้อความปกติ
    document.querySelectorAll('.label-input-text').forEach(input => {
        if (input.id !== 'barcode-numeric-input') { // ยกเว้นช่องบาร์โค้ดที่จัดการแยกไปแล้ว
            input.addEventListener('input', (e) => {
                const idx = e.target.getAttribute('data-index');
                defaultTexts[idx] = e.target.value;
            });
        }
    });

    // ผูก Event Listener สำหรับสไตล์ตัวอักษร
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
    const isBarcodeEnabled = document.getElementById('enable-barcode').checked;

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
        
        if (isBarcodeEnabled && rowCount > 1) {
            let templates = "";
            for(let r=0; r<rowCount-1; r++) templates += "1fr ";
            templates += "1.8fr"; 
            labelBox.style.gridTemplateRows = templates;
        } else {
            labelBox.style.gridTemplateRows = `repeat(${rowCount}, 1fr)`;
        }
        
        if (borderStyle === 'none') {
            labelBox.style.border = 'none';
        } else {
            labelBox.style.border = `1px ${borderStyle} #cbd5e1`;
        }

        for (let r = 0; r < rowCount; r++) {
            const textRow = document.createElement('div');
            
            if (isBarcodeEnabled && r === rowCount - 1) {
                textRow.className = 'label-barcode-row';
                
                let barcodeValue = (defaultTexts[r] || "0000000000000").trim();
                const svgHtml = generateEAN13Svg(barcodeValue);
                textRow.innerHTML = svgHtml;
                
                labelBox.appendChild(textRow);
            } else {
                textRow.className = 'label-text-row';
                textRow.style.padding = '1px 0';
                textRow.style.boxSizing = 'border-box';
                textRow.style.fontWeight = defaultStyles[r];

                const textWrapper = document.createElement('span');
                textWrapper.className = 'scale-wrapper';
                textWrapper.innerText = defaultTexts[r] || ' ';

                textRow.appendChild(textWrapper);
                labelBox.appendChild(textRow);
            }
        }

        gridContainer.appendChild(labelBox);
    }

    autoFitLabelFonts();
}

/* ─── ระบบวิเคราะห์และสร้างโครงสร้างบาร์โค้ด EAN-13 แบบ Native SVG ─── */
function generateEAN13Svg(value) {
    let digits = value.replace(/\D/g, ''); 
    if (digits.length < 12) digits = digits.padStart(12, '0');
    digits = digits.substring(0, 12);
    
    let sum = 0;
    for (let i = 0; i < 12; i++) {
        sum += parseInt(digits[i]) * (i % 2 === 0 ? 1 : 3);
    }
    let checkDigit = (10 - (sum % 10)) % 10;
    let fullCode = digits + checkDigit;

    const L_CODE = ["0001101", "0011001", "0010011", "0111101", "0100011", "0110001", "0101111", "0111011", "0110111", "0001011"];
    const G_CODE = ["0100111", "0110011", "0011011", "0100001", "0011101", "0111001", "0000101", "0010001", "0001001", "0010111"];
    const R_CODE = ["1110010", "1100110", "1101100", "1000010", "1011100", "1001110", "1010000", "1000100", "1001000", "1110100"];
    const PARITY = ["LLLLLL", "LLGLGG", "LLGGLG", "LLGGGL", "LGLLGG", "LGGLLG", "LGGGLL", "LGLGLG", "LGLGGL", "LGGLGL"];

    let firstDigit = parseInt(fullCode[0]);
    let parityPattern = PARITY[firstDigit];

    let binaryString = "101"; 
    
    for (let i = 1; i <= 6; i++) {
        let digit = parseInt(fullCode[i]);
        if (parityPattern[i - 1] === 'L') {
            binaryString += L_CODE[digit];
        } else {
            binaryString += G_CODE[digit];
        }
    }
    
    binaryString += "01010"; 
    
    for (let i = 7; i <= 12; i++) {
        let digit = parseInt(fullCode[i]);
        binaryString += R_CODE[digit];
    }
    
    binaryString += "101"; 

    let svgWidth = 115;
    let svgHeight = 40;
    let startX = 10;
    let barWidth = 0.85;

    let paths = "";
    for (let i = 0; i < binaryString.length; i++) {
        if (binaryString[i] === '1') {
            let isGuard = (i < 3 || (i >= 45 && i < 50) || i >= 92);
            let barHeight = isGuard ? 30 : 24;
            paths += `<rect x="${startX + (i * barWidth)}" y="2" width="${barWidth}" height="${barHeight}" fill="#000000"/>`;
        }
    }

    let textY = 36;
    let labelHtml = `
        <text x="${startX - 6}" y="${textY - 3}" font-family="Arial" font-size="8" fill="#000">${fullCode[0]}</text>
        <text x="${startX + 4}" y="${textY}" font-family="Arial" font-size="8" letter-spacing="1.2" fill="#000">${fullCode.substring(1,7)}</text>
        <text x="${startX + 50}" y="${textY}" font-family="Arial" font-size="8" letter-spacing="1.2" fill="#000">${fullCode.substring(7,13)}</text>
    `;

    return `<svg class="barcode-svg" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet">${paths}${labelHtml}</svg>`;
}

function autoFitLabelFonts() {
    const items = document.querySelectorAll('.label-item');

    items.forEach(labelBox => {
        const wrappers = labelBox.querySelectorAll('.scale-wrapper');
        const rows = labelBox.querySelectorAll('.label-text-row');

        let fontSize = 36;

        const applyFont = (size) => {
            wrappers.forEach(span => {
                span.style.fontSize = size + 'px';
                span.style.lineHeight = '1';
                span.style.transform = 'scale(1)';
            });
        };

        applyFont(fontSize);

        if (rows.length > 0) {
            const isBarcodeEnabled = document.getElementById('enable-barcode').checked;
            const barcodeSpace = isBarcodeEnabled ? 1.8 : 0;
            const availableHeightPerRow = (labelBox.clientHeight / (rows.length + barcodeSpace)) * 0.88;
            
            let overflow = true;

            while (overflow && fontSize > 4) {
                overflow = false;
                applyFont(fontSize);

                rows.forEach(row => {
                    const span = row.querySelector('.scale-wrapper');
                    if(span) {
                        const textHeight = span.getBoundingClientRect().height;
                        if (textHeight > (availableHeightPerRow * 0.92)) {
                            overflow = true;
                        }
                    }
                });

                if (overflow) {
                    fontSize -= 0.5;
                }
            }
        }

        wrappers.forEach(span => {
            const maxAllowedWidth = labelBox.clientWidth * 0.94; 
            const textWidth = span.getBoundingClientRect().width;

            if (textWidth > maxAllowedWidth) {
                const ratio = maxAllowedWidth / textWidth;
                span.style.transform = `scale(${ratio})`;
            }
        });
    });
}

function generateAndShowPreview() {
    renderLabelsGrid();
    document.getElementById('setup-page').className = 'page-view'; // ใช้รูปแบบเดิมเคลียร์คลาส
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
        barcodeEnabled: document.getElementById('enable-barcode').checked,
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
            document.getElementById('enable-barcode').checked = configData.barcodeEnabled || false;
            
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

document.getElementById('enable-barcode').addEventListener('change', () => {
    generateInputFields();
});

window.onload = function() {
    generateInputFields();
};