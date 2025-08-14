// src/app/shared/export.service.ts
import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable, {CellInput, RowInput} from 'jspdf-autotable';

@Injectable({
    providedIn: 'root'
})
export class ExportService {

    // Export CSV
    exportCSV(data: any[], filename: string) {
        if (!data || data.length === 0) {
            console.warn('Aucune donnée à exporter en CSV');
            return;
        }

        const separator = ';';
        const headers = Object.keys(data[0]).join(separator);
        const csvData = data.map(row =>
            Object.values(row)
                .map(value => `"${String(value).replace(/"/g, '""')}"`)
                .join(separator)
        );

        const csvContent = [headers, ...csvData].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', `${filename}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // Export XLSX (Excel)
    async exportXLSX(data: any[], filename: string) {
        if (!data || data.length === 0) {
            console.warn('Aucune donnée à exporter en XLSX');
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Données');

        XLSX.writeFile(workbook, `${filename}.xlsx`);
    }

    // Export PDF
    async exportPDF(data: Array<Record<string, unknown>>, filename: string) {
        if (!data?.length) {
            console.warn('Aucune donnée à exporter en PDF');
            return;
        }

        const doc = new jsPDF();

        // on fige l'ordre des colonnes à partir du premier objet
        const columns = Object.keys(data[0]) as string[];

        // tête du tableau : RowInput[] attend un tableau de cellules
        const head: RowInput[] = [columns as unknown as CellInput[]];

        // corps du tableau, on force chaque valeur en string (ou vide)
        const body: RowInput[] = data.map(row =>
            columns.map(col => {
                const v = (row as Record<string, unknown>)[col];
                return v == null ? '' : String(v);
            }) as CellInput[]
        );

        autoTable(doc, {
            head,
            body,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [52, 73, 94] },
            margin: { top: 10 }
        });

        doc.save(`${filename}.pdf`);
    }
}

