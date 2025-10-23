import React from 'react';
import { Card, Table, Badge } from 'react-bootstrap';

const SpecificationsTable = ({ specifications }) => {
  const QualityBadge = ({ type }) => {
    const colors = {
      Basic: 'secondary',
      Standard: 'info',
      Luxury: 'warning',
      Royal: 'primary'
    };
    return (
      <Badge bg={colors[type]} className="ms-2">
        {type}
      </Badge>
    );
  };

  return (
    <div className="row g-4">
      {Object.entries(specifications).map(([category, { title, items }]) => (
        <div className="col-12" key={category}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">{title}</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive bordered className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '20%' }}>Item</th>
                    <th>Specifications by Quality Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(items).map(([item, qualities]) => (
                    <tr key={item}>
                      <td className="fw-bold">{item}</td>
                      <td>
                        {Object.entries(qualities).map(([quality, spec]) => (
                          <div key={quality} className="mb-2">
                            <QualityBadge type={quality} />
                            <span className="ms-2">{spec}</span>
                          </div>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default SpecificationsTable;
