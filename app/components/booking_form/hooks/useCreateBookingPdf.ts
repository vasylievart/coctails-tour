import { useEffect } from "react";

interface CreateBookingPdfProps {
  pdfBase64: string | null;
}

export const useCreateBookingPdf = ({pdfBase64} : CreateBookingPdfProps) => {
  useEffect(() => {
      if (!pdfBase64) return;
  
      const byteCharacters = atob(pdfBase64);
      const byteNumbers = new Array(byteCharacters.length);
  
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
  
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = url;
      link.download = "booking.pdf";
      link.click();
  
      URL.revokeObjectURL(url);
    }, [pdfBase64]);
}