import React from 'react';
import { Container, Button, Card } from 'react-bootstrap';
import CostBreakdown from '../components/CostBreakdown/CostBreakdown';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const CostCalculationPage = ({ projectDetails, onBack }) => {
  const handleDownloadPDF = async () => {
    const element = document.getElementById('cost-breakdown');
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Add project details as header
    pdf.setFontSize(12);
    pdf.setTextColor(100);
    const timestamp = new Date().toLocaleString();
    pdf.text(`Generated on: ${timestamp}`, 10, pdfHeight + 10);
    if (projectDetails) {
      pdf.text(`Project Type: ${projectDetails.type}`, 10, pdfHeight + 20);
      pdf.text(`Area: ${projectDetails.area} sq.ft`, 10, pdfHeight + 30);
      pdf.text(`Location: ${projectDetails.location}`, 10, pdfHeight + 40);
    }

    pdf.save('cost-estimation.pdf');
  };

  return (
    <Container className="py-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Cost Estimation Details</h4>
          <div>
            <Button 
              variant="light" 
              className="me-2" 
              onClick={onBack}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back
            </Button>
            <Button 
              variant="light" 
              onClick={handleDownloadPDF}
            >
              <i className="bi bi-download me-2"></i>
              Download PDF
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {projectDetails && (
            <div className="mb-4">
              <h5>Project Details</h5>
              <div className="row g-3">
                <div className="col-md-4">
                  <div className="border rounded p-3">
                    <small className="text-muted">Project Type</small>
                    <div className="fw-bold">{projectDetails.type}</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="border rounded p-3">
                    <small className="text-muted">Total Area</small>
                    <div className="fw-bold">{projectDetails.area} sq.ft</div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="border rounded p-3">
                    <small className="text-muted">Location</small>
                    <div className="fw-bold">{projectDetails.location}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div id="cost-breakdown">
            <CostBreakdown />
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CostCalculationPage;