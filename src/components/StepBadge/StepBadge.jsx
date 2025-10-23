import React from 'react';
import { Badge } from 'react-bootstrap';

const StepBadge = ({ number, label, active }) => {
  return (
    <div className={`d-flex align-items-center gap-2 p-3 rounded ${active ? 'bg-primary text-white' : 'bg-light'}`}>
      <Badge bg={active ? 'light' : 'secondary'} text={active ? 'dark' : undefined} className="rounded-circle d-inline-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>
        {number}
      </Badge>
      <div className="fw-semibold small text-uppercase">{label}</div>
    </div>
  );
};

export default StepBadge;
