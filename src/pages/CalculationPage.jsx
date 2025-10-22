import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CostBreakdown from '../components/CostBreakdown';
import { Card, Container } from 'react-bootstrap';

const CalculationPage = () => {
  const [searchParams] = useSearchParams();
  const [calculationData, setCalculationData] = useState(null);

  useEffect(() => {
    const quality = searchParams.get('quality');
    const specs = JSON.parse(decodeURIComponent(searchParams.get('specs') || '{}'));
    const quantities = JSON.parse(decodeURIComponent(searchParams.get('quantities') || '{}'));
    
    setCalculationData({
      quality,
      specifications: specs,
      quantities
    });
  }, [searchParams]);

  if (!calculationData) {
    return <div>Loading...</div>;
  }

  return (
    <Container className="py-4">
      <Card className="shadow">
        <Card.Header className="bg-primary text-white">
          <h4 className="mb-0">Cost Calculation</h4>
        </Card.Header>
        <Card.Body>
          <CostBreakdown 
            specifications={calculationData.specifications}
            quantities={calculationData.quantities}
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CalculationPage;