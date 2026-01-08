import React from 'react';
import { Card, Table } from 'react-bootstrap';
import './TotalPrice.css'; // Optional: Add custom styles

const TotalPrice = ({financial_summary}) => {

    const {
        total_sub_cost_in_inr,
        contingency_cost_in_inr,
        grand_total_cost_in_inr,
        cost_per_sqft_in_inr,
    } = financial_summary;

    return (

        <Card className="mb-3 shadow-sm total-price-card">
            <Card.Body>
                <Card.Title className="text-center text-primary fw-bold">
                    Total Estimated Cost
                </Card.Title>
                {financial_summary && <Table striped bordered hover className="mt-3">
                    <tbody>
                        <tr>
                            <td className="fw-semibold">Subtotal Cost (INR):</td>
                            <td>₹ {total_sub_cost_in_inr.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td className="fw-semibold">Contingency Cost (INR):</td>
                            <td>₹ {contingency_cost_in_inr.toLocaleString()}</td>
                        </tr>
                        <tr>
                            <td className="fw-semibold">Grand Total Cost (INR):</td>
                            <td className="text-success fw-bold">
                                ₹ {grand_total_cost_in_inr.toLocaleString()}
                            </td>
                        </tr>
                        <tr>
                            <td className="fw-semibold">Cost per Sq. Ft. (INR):</td>
                            <td>₹ {cost_per_sqft_in_inr.toFixed(2)}</td>
                        </tr>
                    </tbody>
                </Table> }
                {!financial_summary && <div className="text-center text-muted">No financial summary available.</div>}
            </Card.Body>
        </Card>
    );
};

export default TotalPrice;