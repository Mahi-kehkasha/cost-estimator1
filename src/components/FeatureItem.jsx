import React from 'react';

const FeatureItem = ({ text }) => (
  <li className="d-flex align-items-start gap-2 mb-2">
    <i className="bi bi-check2-circle text-success"></i>
    <span>{text}</span>
  </li>
);

export default FeatureItem;
