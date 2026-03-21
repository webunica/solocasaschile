import * as XLSX from 'xlsx';
import * as fs from 'fs';

try {
    const workbook = XLSX.readFile('c:/Users/studioo/Desktop/000000000_COMPARADOR_INMO - copia/dataset_constructoras_prefabricadas_chile_ficticio.xlsx');
    
    const output: any = {};

    ['Empresas', 'Modelos_Casa'].forEach(sheetName => {
        if (!workbook.Sheets[sheetName]) return;
        const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
        output[sheetName] = data[0]; // first row is headers
    });

    fs.writeFileSync('c:/Users/studioo/Desktop/000000000_COMPARADOR_INMO - copia/web/temp_cols.json', JSON.stringify(output, null, 2));
    console.log("Columnas escritas en temp_cols.json");

} catch (e: any) {
    console.error("Error:", e);
}
