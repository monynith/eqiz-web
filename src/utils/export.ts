const colLetter = (index: number): string => {
    let s = '';
    let n = index;
    while (n >= 0) {
        s = String.fromCharCode((n % 26) + 65) + s;
        n = Math.floor(n / 26) - 1;
    }
    return s;
};

const escapeXml = (value: string): string => {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
};

const isNumber = (value: unknown): boolean => {
    return value !== null && value !== '' && !isNaN(value as number);
};

const triggerDownload = (blob: Blob, filename: string): void => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const exportToCsv = (headers: string[], rows: (string | number)[][], filename: string): void => {
    const escapeCell = (value: string | number): string => {
        const str = value === null || value === undefined ? '' : String(value);
        if (/[",\n\r]/.test(str)) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const lines = [headers.map(escapeCell).join(',')];
    for (const row of rows) {
        lines.push(row.map(escapeCell).join(','));
    }

    const csv = '﻿' + lines.join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    triggerDownload(blob, filename);
};

export const exportToExcel = async (
    headers: string[],
    rows: (string | number)[][],
    filename: string
): Promise<void> => {
    const { default: JSZip } = await import('jszip');

    const HEADER_STYLE = 1;
    const BODY_STYLE = 2;

    const sheetRows: string[] = [];

    const buildRow = (cells: (string | number)[], isHeader: boolean): string => {
        const style = isHeader ? HEADER_STYLE : BODY_STYLE;
        const cellXml = cells
            .map((value, i) => {
                const ref = `${colLetter(i)}${sheetRows.length + 1}`;
                if (isHeader || !isNumber(value)) {
                    const text = value === null || value === undefined ? '' : String(value);
                    return `<c r="${ref}" s="${style}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(text)}</t></is></c>`;
                }
                return `<c r="${ref}" s="${style}"><v>${value}</v></c>`;
            })
            .join('');
        return `<row r="${sheetRows.length + 1}">${cellXml}</row>`;
    };

    sheetRows.push(buildRow(headers, true));
    for (const row of rows) {
        sheetRows.push(buildRow(row, false));
    }

    const allRows = [headers, ...rows];
    const colCount = Math.max(headers.length, ...rows.map((r) => r.length));
    const colsXml = Array.from({ length: colCount }, (_, i) => {
        let maxLen = 0;
        for (const r of allRows) {
            const cell = r[i];
            if (cell !== null && cell !== undefined) {
                maxLen = Math.max(maxLen, String(cell).length);
            }
        }
        const width = Math.min(60, Math.max(8, maxLen + 2));
        return `<col min="${i + 1}" max="${i + 1}" width="${width}" customWidth="1" bestFit="1"/>`;
    }).join('');

    const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`;

    const rootRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`;

    const workbook = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="Apps" sheetId="1" r:id="rId1"/></sheets>
</workbook>`;

    const workbookRels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`;

    const styles = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="2">
<font><sz val="11"/><name val="Calibri"/></font>
<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>
</fonts>
<fills count="3">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFDB7093"/><bgColor indexed="64"/></patternFill></fill>
</fills>
<borders count="2">
<border><left/><right/><top/><bottom/><diagonal/></border>
<border>
<left style="thin"><color rgb="FFD0D0D0"/></left>
<right style="thin"><color rgb="FFD0D0D0"/></right>
<top style="thin"><color rgb="FFD0D0D0"/></top>
<bottom style="thin"><color rgb="FFD0D0D0"/></bottom>
<diagonal/>
</border>
</borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="3">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>
<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1"/>
</cellXfs>
</styleSheet>`;

    const worksheet = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<cols>${colsXml}</cols>
<sheetData>
${sheetRows.join('\n')}
</sheetData>
</worksheet>`;

    const zip = new JSZip();
    zip.file('[Content_Types].xml', contentTypes);
    zip.folder('_rels')!.file('.rels', rootRels);
    const xl = zip.folder('xl')!;
    xl.file('workbook.xml', workbook);
    xl.file('styles.xml', styles);
    xl.folder('_rels')!.file('workbook.xml.rels', workbookRels);
    xl.folder('worksheets')!.file('sheet1.xml', worksheet);

    const blob = await zip.generateAsync({ type: 'blob' });
    triggerDownload(blob, filename);
};
