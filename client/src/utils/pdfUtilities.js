import {jsPDF} from "jspdf";

/**
 * Converts an array of images into a single PDF document.
 *
 * @param {string[]} images - An array containing image URLs or base64 encoded image data.
 * @returns {jsPDF} Returns a jsPDF object representing the generated PDF.
 * @throws {Error} If there is an issue generating the PDF file.
 */

export const ImagesToPdf = (images) => {
  const handleGeneratePDF = () => {
    try {
      const width = 4; // Width of the page (see unit below)
      const height = 2; // Height of the page
      const margin = 0.1; // Margin from border page to the image
      var pdf = new jsPDF({
        orientation: "landscape",
        unit: "in",
        format: [width, height],
      });

      Object.values(images).forEach((image, index) => {
        if (index !== 0) {
          // Add a new page for each image, except the first
          // that is already created
          pdf.addPage();
        }
        // Add an image in the created page with format
        pdf.addImage(
          image,
          "PNG",
          margin, // This is a coordinate x
          margin, // This is a coordinate y
          width - 2 * margin, // This will reduce the image width size to fit in
          height - 2 * margin // This will reduce the image height size to fit in
        );
      });
    } catch (e) {
      console.log("An issue occurs generating the pdf file ", e);
    }
    return pdf;
  };
  return handleGeneratePDF();
};
