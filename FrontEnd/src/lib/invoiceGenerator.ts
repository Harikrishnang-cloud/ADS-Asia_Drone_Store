import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface OrderItem {
    name: string;
    price: number;
    quantity: number;
}

interface OrderData {
    id: string;
    createdAt: any;
    total: number;
    subtotal?: number;
    shipping?: number;
    items: OrderItem[];
    shippingAddress: {
        address: string;
        city: string;
        state: string;
        zip: string;
    };
    contact: {
        name: string;
        email: string;
        phone: string;
    };
    paymentMethod: string;
}

export const generateInvoice = (order: OrderData) => {
    try {
        console.log("Generating invoice for order:", order);

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // 1. Header & Brand
        doc.setFillColor(0, 102, 204); // Brand Blue
        doc.rect(0, 0, pageWidth, 40, "F");

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("ASIA DRONE STORE", 15, 25);

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Premium Drone Equipment & Accessories", 15, 32);

        doc.setFontSize(18);
        doc.text("INVOICE", pageWidth - 50, 25);

        // 2. Order Info & Customer Info
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("Billed To:", 15, 55);

        doc.setFont("helvetica", "normal");
        doc.text(order.contact?.name || "Customer Name", 15, 62);
        doc.text(order.shippingAddress?.address || "Street Address", 15, 67);
        doc.text(`${order.shippingAddress?.city || "City"}, ${order.shippingAddress?.state || "State"} - ${order.shippingAddress?.zip || "Zip"}`, 15, 72);
        doc.text(`Phone: ${order.contact?.phone || "N/A"}`, 15, 77);
        doc.text(`Email: ${order.contact?.email || "N/A"}`, 15, 82);

        doc.setFont("helvetica", "bold");
        doc.text("Order Details:", pageWidth - 80, 55);

        doc.setFont("helvetica", "normal");
        doc.text(`Invoice No: #${order.id.slice(-8).toUpperCase()}`, pageWidth - 80, 62);

        // Handle Firestore Timestamp vs Date string
        const orderDate = order.createdAt?.seconds
            ? new Date(order.createdAt.seconds * 1000)
            : new Date(order.createdAt);

        doc.text(`Date: ${orderDate.toLocaleDateString()}`, pageWidth - 80, 67);
        doc.text(`Payment: ${(order.paymentMethod || "N/A").toUpperCase()}`, pageWidth - 80, 72);
        doc.text(`Status: PAID`, pageWidth - 80, 77);

        // 3. Items Table
        const tableData = (order.items || []).map((item, index) => [
            index + 1,
            item.name,
            item.price.toLocaleString('en-IN'),
            item.quantity,
            (item.price * item.quantity).toLocaleString('en-IN')
        ]);

        autoTable(doc, {
            startY: 95,
            head: [["#", "Product Description", "Price (Rs.)", "Qty", "Total (Rs.)"]],
            body: tableData,
            theme: "striped",
            headStyles: { 
                fillColor: [0, 102, 204], 
                textColor: 255, 
                halign: 'center',
                valign: 'middle',
                fontStyle: 'bold'
            },
            styles: { 
                fontSize: 9, 
                cellPadding: 6,
                valign: 'middle',
                overflow: 'linebreak'
            },
            columnStyles: {
                0: { cellWidth: 12, halign: 'center' },
                1: { cellWidth: 'auto', halign: 'center' },
                2: { cellWidth: 35, halign: 'center' },
                3: { cellWidth: 20, halign: 'center' },
                4: { cellWidth: 35, halign: 'center' }
            }
        });

        // 4. Totals
        const finalY = (doc as any).lastAutoTable.finalY + 10;
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        
        const labelX = pageWidth - 80;
        const valueX = pageWidth - 15;

        doc.text("Subtotal:(Including GST)", labelX, finalY);
        doc.text(`${(order.subtotal || order.total).toLocaleString('en-IN')}`, valueX, finalY, { align: "right" });

        doc.text("Shipping:", labelX, finalY + 7);
        doc.text(`${(order.shipping || 0).toLocaleString('en-IN')}`, valueX, finalY + 7, { align: "right" });

        doc.rect(labelX, finalY + 12, 65, 0.5, "F");
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Grand Total (Rs.):", labelX, finalY + 20);
        doc.text(`${order.total.toLocaleString('en-IN')}`, valueX, finalY + 20, { align: "right" });

        // 5. Footer
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.setFont("helvetica", "italic");
        doc.text("Thank you for your business! For any queries, contact info@asiadronestore.com", pageWidth / 2, 285, { align: "center" });

        // Save PDF
        doc.save(`Invoice_ADS_${order.id.slice(-6).toUpperCase()}.pdf`);
    } catch (error) {
        console.error("Critical error generating invoice:", error);
    }
};
