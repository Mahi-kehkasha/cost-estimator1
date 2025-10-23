import React from 'react';
import { Table, Card } from 'react-bootstrap';

// Helper function to convert number to words
const numberToWords = (num) => {
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten'];
  const teens = ['Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const convertLessThanThousand = (n) => {
    if (n === 0) return '';
    
    if (n < 11) return units[n];
    if (n < 20) return teens[n - 11];
    if (n < 100) {
      const unit = n % 10;
      const ten = Math.floor(n / 10);
      return tens[ten] + (unit ? ' ' + units[unit] : '');
    }
    const hundred = Math.floor(n / 100);
    return units[hundred] + ' Hundred' + (n % 100 ? ' and ' + convertLessThanThousand(n % 100) : '');
  };

  if (num === 0) return 'Zero';
  
  const lakhs = Math.floor(num / 100000);
  const thousands = Math.floor((num % 100000) / 1000);
  const remainder = num % 1000;
  
  let result = '';
  if (lakhs) result += convertLessThanThousand(lakhs) + ' Lakh ';
  if (thousands) result += convertLessThanThousand(thousands) + ' Thousand ';
  if (remainder) result += convertLessThanThousand(remainder);
  
  return result.trim() + ' Rupees Only';
};

// Material rates and details
const materialRates = {
  // Structure
  Cement: { rate: 370, unit: 'bags' },
  Steel: { rate: 79, unit: 'kg' },
  Sand: { rate: 55, unit: 'cft' },
  Bricks: { rate: 39, unit: 'pcs' },
  
  // Finishing
  InteriorPainting: { rate: 55, unit: 'sqft' },
  ExteriorPainting: { rate: 55, unit: 'sqft' },
  LivingDiningFlooring: { rate: 70, unit: 'sqft' },
  RoomsKitchenFlooring: { rate: 50, unit: 'sqft' },
  
  // Electrical
  Electrical: { rate: 250, unit: 'sqft' },
  Windows: { rate: 350, unit: 'sqft' },
  
  // Plumbing
  OverheadTank: { rate: 8000, unit: 'nos' },
  UndergroundSump: { rate: 100000, unit: 'nos' },
  MainSinkFaucet: { rate: 2000, unit: 'nos' },
  KitchenSink: { rate: 4000, unit: 'nos' },
  SanitarywareCPFittings: { rate: 5000, unit: 'nos' },
  
  // Doors
  MainDoor: { rate: 25000, unit: 'nos' },
  InternalDoors: { rate: 8000, unit: 'nos' },
  BathroomDoors: { rate: 4500, unit: 'nos' },
  
  // Others
  StaircaseRailing: { rate: 195, unit: 'sqft' }
};

const projectData = {
  structure: [
    { item: 'Cement', qty: 292 },
    { item: 'Steel', qty: 1641 },
    { item: 'Sand', qty: 840 },
    { item: 'Bricks', qty: 1662 }
  ],
  finishing: [
    { item: 'InteriorPainting', qty: 1178 },
    { item: 'ExteriorPainting', qty: 393 },
    { item: 'LivingDiningFlooring', qty: 1234 },
    { item: 'RoomsKitchenFlooring', qty: 2160 }
  ],
  electrical: [
    { item: 'Electrical', qty: 259 },
    { item: 'Windows', qty: 123 }
  ],
  plumbing: [
    { item: 'OverheadTank', qty: 1 },
    { item: 'UndergroundSump', qty: 0 },
    { item: 'MainSinkFaucet', qty: 5 },
    { item: 'KitchenSink', qty: 3 },
    { item: 'SanitarywareCPFittings', qty: 4 }
  ],
  doors: [
    { item: 'MainDoor', qty: 1 },
    { item: 'InternalDoors', qty: 3 },
    { item: 'BathroomDoors', qty: 5 }
  ],
  others: [
    { item: 'StaircaseRailing', qty: 55 }
  ],
  miscellaneous: [
    { item: 'MasonLabor', qty: 120, rate: 800 },
    { item: 'HelperLabor', qty: 180, rate: 500 },
    { item: 'PlumberLabor', qty: 25, rate: 900 },
    { item: 'ElectricianLabor', qty: 20, rate: 1000 },
    { item: 'PainterLabor', qty: 30, rate: 800 },
    { item: 'CarpenterLabor', qty: 15, rate: 1000 },
    { item: 'SupervisorCharges', qty: 45, rate: 1200 }
  ]
};

const CostBreakdown = () => {
  const calculateSubtotal = (items) => {
    return items.reduce((total, { item, qty }) => {
      return total + (materialRates[item].rate * qty);
    }, 0);
  };

  const calculateMiscTotal = () => {
    return projectData.miscellaneous.reduce((total, { qty, rate }) => total + (qty * rate), 0);
  };

  const baseProjectCost = Object.entries(projectData).reduce((total, [category, items]) => {
    if (category !== 'miscellaneous') {
      return total + calculateSubtotal(items);
    }
    return total;
  }, 0);

  const miscLabourCost = calculateMiscTotal();
  const grandTotal = baseProjectCost + miscLabourCost;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">1 BHK Villa Cost Breakdown (1200 sqft)</h5>
      </Card.Header>
      <Card.Body>
        <Table striped bordered responsive>
          <thead className="table-light">
            <tr>
              <th>Category</th>
              <th>Item</th>
              <th className="text-end">Quantity</th>
              <th className="text-end">Unit</th>
              <th className="text-end">Rate (₹)</th>
              <th className="text-end">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(projectData).map(([category, items]) => (
              <React.Fragment key={category}>
                <tr className="table-secondary">
                  <td colSpan="5" className="fw-bold text-capitalize">{category}</td>
                  <td className="text-end fw-bold">
                    {formatCurrency(
                      category === 'miscellaneous' 
                        ? items.reduce((total, { qty, rate }) => total + (qty * rate), 0)
                        : calculateSubtotal(items)
                    )}
                  </td>
                </tr>
                {items.map((item) => (
                  <tr key={item.item}>
                    <td></td>
                    <td>{item.item.replace(/([A-Z])/g, ' $1').trim()}</td>
                    <td className="text-end">{item.qty}</td>
                    <td className="text-end">
                      {category === 'miscellaneous' ? 'days' : materialRates[item.item].unit}
                    </td>
                    <td className="text-end">
                      {formatCurrency(category === 'miscellaneous' ? item.rate : materialRates[item.item].rate)}
                    </td>
                    <td className="text-end">
                      {formatCurrency(item.qty * (category === 'miscellaneous' ? item.rate : materialRates[item.item].rate))}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
          <tfoot className="table-dark">
            <tr>
              <td colSpan="5" className="fw-bold">Grand Total</td>
              <td className="text-end fw-bold">{formatCurrency(grandTotal)}</td>
            </tr>
            <tr>
              <td colSpan="6" className="text-center">
                <small className="text-muted">
                  {numberToWords(grandTotal)}
                </small>
              </td>
            </tr>
          </tfoot>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default CostBreakdown;