import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export interface SalesData {
    id: string;
    createdAt: { seconds?: number } | string | number | Date | null;
    total: number;
    paymentMethod: string;
    contact: {
        name: string;
    };
    status: string;
}

export const generateSalesReport = (orders: SalesData[], filterName: string) => {
    try {
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const totalSales = orders.reduce((sum, order) => sum + order.total, 0);

        // 1. Header
        doc.setFillColor(30, 41, 59); // Slate 800
        doc.rect(0, 0, pageWidth, 45, "F");
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(22);
        doc.setFont("helvetica", "bold");
        doc.text("ASIA DRONE STORE", 15, 20);
        
        doc.setFontSize(14);
        doc.text("SALES REPORT", 15, 30);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Period: ${filterName}`, 15, 38);
        doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - 15, 38, { align: "right" });

        // 2. Summary Boxes
        doc.setFillColor(248, 250, 252); // Slate 50
        doc.rect(15, 55, 180, 25, "F");
        doc.setDrawColor(226, 232, 240);
        doc.rect(15, 55, 180, 25, "S");

        doc.setTextColor(100, 116, 139);
        doc.setFontSize(9);
        doc.text("TOTAL ORDERS", 25, 65);
        doc.text("TOTAL REVENUE", 100, 65);

        doc.setTextColor(30, 41, 59);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(orders.length.toString(), 25, 73);
        doc.text(`Rs. ${totalSales.toLocaleString('en-IN')}`, 100, 73);

        // 3. Table
        const tableData = orders.map((order, index) => [
            index + 1,
            order.id.slice(-8).toUpperCase(),
            order.createdAt 
                ? (typeof order.createdAt === 'object' && 'seconds' in order.createdAt && order.createdAt.seconds
                    ? new Date(order.createdAt.seconds * 1000).toLocaleDateString()
                    : new Date(order.createdAt as string | number | Date).toLocaleDateString())
                : "N/A",
            order.contact?.name || "N/A",
            order.paymentMethod.toUpperCase(),
            `Rs. ${order.total.toLocaleString('en-IN')}`
        ]);

        autoTable(doc, {
            startY: 90,
            head: [["#", "Order ID", "Date", "Customer", "Payment", "Amount"]],
            body: tableData,
            theme: "striped",
            headStyles: { 
                fillColor: [30, 41, 59], 
                textColor: 255,
                halign: 'center'
            },
            styles: { fontSize: 8, cellPadding: 4 },
            columnStyles: {
                0: { cellWidth: 10, halign: 'center' },
                1: { cellWidth: 30 },
                2: { cellWidth: 25 },
                3: { cellWidth: 'auto' },
                4: { cellWidth: 30, halign: 'center' },
                5: { cellWidth: 35, halign: 'right' }
            }
        });

        // 4. Footer
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("Page 1 of 1", pageWidth / 2, 285, { align: "center" });

        // Save
        doc.save(`Sales_Report_ADS_${filterName.replace(/ /g, '_')}_${new Date().getTime()}.pdf`);
    } catch (error) {
        console.error("Critical error generating sales report:", error);
    }
};
