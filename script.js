let defaultTexts = ["สินค้าแนะนำ", "฿199.-", "8851234567890", "ลดล้างสต๊อก", "PROMO-2026"];
let defaultStyles = ["normal", "bold", "normal", "normal", "normal"];

function generateInputFields() {
    const rowCount = parseInt(document.getElementById('row-count').value);
    const isBarcodeEnabled = document.getElementById('enable-barcode').checked;
    const container = document.getElementById('text-inputs-container');
    container.innerHTML = '';

    const textRowsCount = isBarcodeEnabled ? rowCount - 1 : rowCount;

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

    if (isBarcodeEnabled) {
        const barcodeIndex = rowCount - 1;
        const barcodeDiv = document.createElement('div');
        barcodeDiv.className = 'dynamic-row-input';
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

        const barcodeInput = document.getElementById('barcode-numeric-input');
        barcodeInput.addEventListener('input', (e) => {
            let cleanValue = e.target.value.replace(/\D/g, '');
            if (cleanValue.length > 13) {
                cleanValue = cleanValue.substring(0, 13);
            }
            e.target.value = cleanValue;
            defaultTexts[barcodeIndex] = cleanValue;
        });
    }

    document.querySelectorAll('.label-input-text').forEach(input => {
        if (input.id !== 'barcode-numeric-input') {
            input.addEventListener('input', (e) => {
                const idx = e.target.getAttribute('data-index');
                defaultTexts[idx] = e.target.value;
            });
        }
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

    const widthMm = parseFloat(document.getElementById('label-width').value) || 10;
    const heightMm = parseFloat(document.getElementById('label-height').value) || 10;
    const gapX = parseFloat(document.getElementById('gap-x').value) || 0;
    const gapY = parseFloat(document.getElementById('gap-y').value) || 0;
    const borderStyle = document.getElementById('border-style').value;
    const rowCount = parseInt(document.getElementById('row-count').value);
    const isBarcodeEnabled = document.getElementById('enable-barcode').checked;
    
    // ดึงค่าจำนวนดวงที่ต้องการพิมพ์จริงจากผู้ใช้
    const totalPrintQty = parseInt(document.getElementById('total-print-qty').value) || 1;

    const maxPrintableWidth = 210 - (marginLeft + marginRight); 
    const maxPrintableHeight = 297 - (marginTop + marginBottom);

    const cols = Math.floor((maxPrintableWidth + gapX) / (widthMm + gapX));
    const rows = Math.floor((maxPrintableHeight + gapY) / (heightMm + gapY));
    const labelsPerPage = cols * rows; // จำนวนดวงสูงสุดต่อ 1 หน้ากระดาษ

    const statusBadge = document.getElementById('live-status-badge');
    const pagesContainer = document.getElementById('a4-pages-container');
    pagesContainer.innerHTML = ''; // ล้างหน้าเก่าทั้งหมดออกก่อน

    if (cols <= 0 || rows <= 0) {
        statusBadge.innerHTML = `<span style="color:#ef4444;">❌ ระยะขอบหรือขนาดฉลากใหญ่เกินพิกัด A4</span>`;
        return;
    }

    // คำนวณจำนวนหน้ากระดาษที่ต้องใช้จริงตามจำนวนดวงที่ระบุ
    const totalPagesRequired = Math.ceil(totalPrintQty / labelsPerPage);
    statusBadge.innerHTML = `📊 เต็มหน้าจุได้: ${cols}×${rows} (${labelsPerPage} ดวง/หน้า) | พิมพ์จริง: ${totalPrintQty} ดวง (ใช้กระดาษ ${totalPagesRequired} หน้า)`;

    let currentLabelIndex = 0;

    // ลูปสร้างหน้ากระดาษ A4 ตามจำนวนหน้าที่คำนวณได้จริง
    for (let p = 0; p < totalPagesRequired; p++) {
        const a4Page = document.createElement('div');
        a4Page.className = 'a4-page';
        a4Page.style.paddingTop = `${marginTop}mm`;
        a4Page.style.paddingBottom = `${marginBottom}mm`;
        a4Page.style.paddingLeft = `${marginLeft}mm`;
        a4Page.style.paddingRight = `${marginRight}mm`;

        const gridContainer = document.createElement('div');
        gridContainer.className = 'label-grid';
        gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${widthMm}mm)`;
        gridContainer.style.gridTemplateRows = `repeat(${rows}, ${heightMm}mm)`;
        gridContainer.style.gap = `${gapY}mm ${gapX}mm`;

        // คำนวณจำนวนดวงที่จะใส่ในหน้าปัจจุบัน (หน้าสุดท้ายอาจไม่เต็มหน้า)
        const labelsInThisPage = Math.min(labelsPerPage, totalPrintQty - currentLabelIndex);

        for (let i = 0; i < labelsInThisPage; i++) {
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
                    const svgHtml = generateEAN13Svg(barcodeValue, widthMm);
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
            currentLabelIndex++;
        }

        a4Page.appendChild(gridContainer);
        pagesContainer.appendChild(a4Page);
    }

    autoFitLabelFonts();
}

function generateEAN13Svg(value, labelWidthMm) {
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

    let startX = 10; 
    let barWidth = 1.2; 
    let totalBarModules = binaryString.length * barWidth;
    let svgWidth = totalBarModules + startX + 10; 
    let svgHeight = 44; 

    let paths = "";
    for (let i = 0; i < binaryString.length; i++) {
        if (binaryString[i] === '1') {
            let isGuard = (i < 3 || (i >= 45 && i < 50) || i >= 92);
            let barHeight = isGuard ? 29 : 23;
            paths += `<rect x="${startX + (i * barWidth)}" y="1" width="${barWidth}" height="${barHeight}" fill="#000000"/>`;
        }
    }

    let textY = 38;
    let labelHtml = `
        <text x="${startX - 7}" y="${textY - 3}" font-family="Arial, sans-serif" font-weight="bold" font-size="8.5" fill="#000">${fullCode[0]}</text>
        <text x="${startX + (barWidth * 3.5)}" y="${textY}" font-family="Arial, sans-serif" font-size="8.5" letter-spacing="${barWidth * 1.1}" fill="#000">${fullCode.substring(1,7)}</text>
        <text x="${startX + (barWidth * 51.5)}" y="${textY}" font-family="Arial, sans-serif" font-size="8.5" letter-spacing="${barWidth * 1.1}" fill="#000">${fullCode.substring(7,13)}</text>
    `;

    return `<svg class="barcode-svg" style="width: 100%; height: 100%; max-height: 100%; display: block; overflow: visible;" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="xMidYMid meet">${paths}${labelHtml}</svg>`;
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
        printQty: document.getElementById('total-print-qty').value, // เพิ่มบันทึกจำนวนดวง
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
            document.getElementById('total-print-qty').value = configData.printQty || 40; // โหลดค่าจำนวนดวงกลับมา
            
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

document.getElementById('enable-barcode').addEventListener('change', (e) => {
    const rowCountSelect = document.getElementById('row-count');
    let currentRows = parseInt(rowCountSelect.value);

    if (e.target.checked) {
        if (currentRows < 5) {
            rowCountSelect.value = (currentRows + 1).toString();
        }
    } else {
        if (currentRows > 1) {
            rowCountSelect.value = (currentRows - 1).toString();
        }
    }
    
    generateInputFields();
});

window.onload = function() {
    generateInputFields();
};