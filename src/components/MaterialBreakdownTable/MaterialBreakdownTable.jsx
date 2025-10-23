import React from 'react';

const MaterialBreakdownTable = ({ materialGroups, totalCost }) => {
  return (
    <div className="mt-4">
      <h6 className="mb-3">📊 Material Quantities & Costs</h6>
      <div className="table-responsive">
        <table className="table table-sm table-striped">
          <thead className="table-dark">
            <tr>
              <th>Material</th>
              <th className="text-end">Quantity</th>
              <th className="text-end">Unit</th>
              <th className="text-end">Base Rate (₹)</th>
              <th className="text-end">Adjusted Rate (₹)</th>
              <th className="text-end">Subtotal (₹)</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(materialGroups).map(([groupName, materials]) => {
              if (materials.length === 0) return null;
              return (
                <React.Fragment key={groupName}>
                  <tr className="table-info">
                    <td colSpan={6} className="fw-bold text-center">
                      🏗️ {groupName} Materials
                    </td>
                  </tr>
                  {materials.map((detail) => (
                    <tr key={detail.material}>
                      <td className="fw-semibold">{detail.material}</td>
                      <td className="text-end">{detail.qty.toLocaleString()}</td>
                      <td className="text-end">{detail.unit}</td>
                      <td className="text-end">₹{detail.baseRate.toLocaleString()}</td>
                      <td className="text-end">₹{detail.adjustedRate.toLocaleString()}</td>
                      <td className="text-end fw-bold">₹{detail.subtotal.toLocaleString()}</td>
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
          <tfoot className="table-dark">
            <tr>
              <th colSpan={5} className="text-end">Total Project Cost</th>
              <th className="text-end">₹{totalCost.toLocaleString()}</th>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default MaterialBreakdownTable;
