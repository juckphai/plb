
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

            statusBadge.innerHTML = `📊 บรรจุได้เต็มที่: ${cols} คอลัมน์ × ${rows} แถว<br>(รวมทั้งสิ้น ${totalLabels} ดวง / หน้า A4)`;

            const gridContainer = document.getElementById('label-grid-container');
            gridContainer.style.gridTemplateColumns = `repeat(${cols}, ${widthMm}mm)`;
            gridContainer.style.gridTemplateRows = `repeat(${rows}, ${heightMm}mm)`;
            gridContainer.style.gap = `${gapY}mm ${gapX}mm`;
            gridContainer.innerHTML = '';

            for (let i = 0; i < totalLabels; i++) {
                const labelBox = document.createElement('div');
                labelBox.className = 'label-item';
                
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

        function autoFitLabelFonts() {
            const items = document.querySelectorAll('.label-item');
            
            items.forEach(labelBox => {
                const wrappers = labelBox.querySelectorAll('.scale-wrapper');
                let fontSize = 36; 
                
                const setFonts = (size) => {
                    wrappers.forEach(span => {
                        span.style.fontSize = size + 'px';
                        span.style.transform = 'scale(1)';
                    });
                };

                setFonts(fontSize);

                while (labelBox.scrollHeight > labelBox.clientHeight && fontSize > 5) {
                    fontSize -= 0.5;
                    setFonts(fontSize);
                }

                wrappers.forEach(span => {
                    const parentRow = span.parentElement;
                    if (span.scrollWidth > parentRow.clientWidth) {
                        const ratio = parentRow.clientWidth / span.scrollWidth;
                        span.style.transform = `scale(${ratio * 0.94})`;
                    }
                });
            });
        }

        // ฟังก์ชันในการเซฟโครงสร้างข้อมูลทั้งหมดออกเป็นไฟล์ .json (ต้นฉบับ) รองรับการตั้งชื่อแบบ Dynamic & Auto-timestamp
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

            // แสดงกล่องข้อความให้ผู้ใช้กรอกชื่อไฟล์ที่ต้องการ
            let userFilename = prompt("✍️ กรุณาตั้งชื่อไฟล์ต้นฉบับของคุณ:", "");
            
            // กรณีผู้ใช้กด Cancel (ยกเลิกการบันทึก)
            if (userFilename === null) return; 

            // ลบช่องว่างหัวท้ายข้อความ
            userFilename = userFilename.trim();

            // หากผู้ใช้ไม่กรอกชื่อไฟล์ หรือใส่เป็นค่าว่าง ระบบจะจัดทำชื่อไฟล์อัตโนมัติพ่วงวันเวลาปัจจุบันให้
            if (userFilename === "") {
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');
                
                userFilename = `label_template_${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
            }

            // ตรวจสอบและเติมคอมพลีทนามสกุลไฟล์ .json
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
                    renderLabelsGrid();
                    
                    alert("📂 โหลดโครงสร้างต้นฉบับเรียบร้อยแล้วครับ!");
                } catch (err) {
                    alert("❌ ไฟล์ต้นฉบับไม่ถูกต้องหรือไม่สมบูรณ์ ไม่สามารถเปิดได้ครับ");
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
            renderLabelsGrid();
            setTimeout(renderLabelsGrid, 400);
        };
