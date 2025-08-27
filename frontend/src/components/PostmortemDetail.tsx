import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type Postmortem = {
  title: string;
  incidentId: string;
  summary: string;
};

interface Props {
  postmortem: Postmortem;
}

export default function PostmortemDetail({ postmortem }: Props) {
  const exportPdf = async () => {
    const doc = new jsPDF();
    doc.text(postmortem.title, 10, 10);
    doc.text(`Incident ID: ${postmortem.incidentId}`, 10, 20);
    doc.text(postmortem.summary, 10, 30);

    const element = document.getElementById('postmortem-content');
    if (element) {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const imgProps = doc.getImageProperties(imgData);
      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(imgData, 'PNG', 10, 40, pdfWidth - 20, pdfHeight);
    }

    doc.save(`${postmortem.incidentId}.pdf`);
  };

  return (
    <div className="space-y-4">
      <div id="postmortem-content" className="p-4 border rounded">
        <h2 className="text-xl font-semibold">{postmortem.title}</h2>
        <p>Incident ID: {postmortem.incidentId}</p>
        <p>{postmortem.summary}</p>
      </div>
      <button
        onClick={exportPdf}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Export to PDF
      </button>
    </div>
  );
}
