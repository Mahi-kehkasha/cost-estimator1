import React from 'react';
import { Row, Col, Button, Modal, Form } from 'react-bootstrap';
import { houseTypes } from './data/constants/presets';

const VillaForm = ({ villaData, requiredInvalid, setField }) => {
    // Helper function to generate options for a select dropdown
    const generateOptions = (options) => {
        return options.map((option) => (
            <option key={option} value={option}>
                {option}
            </option>
        ));
    };

    // Helper function to check if a field is invalid
    const isInvalid = (field) => requiredInvalid.includes(field) ? 'is-invalid' : '';

    return (
        <Form>
            <Row className="g-3">
                {/* House Type */}
                <Col md={6} sm={12}>
                    <Form.Label className="fw-semibold">Type *</Form.Label>
                    <Form.Select
                        value={villaData.type}
                        onChange={(e) => setField('type', e.target.value)}
                        className={isInvalid('type')}
                    >
                        <option value="">Select House Type</option>
                        {generateOptions(houseTypes)}
                    </Form.Select>
                </Col>

                {/* Built-up Area */}
                <Col md={6} sm={12}>
                    <Form.Label className="fw-semibold">Built-up Area *</Form.Label>
                    <div className="input-group">
                        <Form.Control
                            type="number"
                            placeholder="Enter area"
                            value={villaData.area}
                            onChange={(e) => setField('area', e.target.value)}
                            className={isInvalid('area')}
                        />
                        <Form.Select
                            value={villaData.unit}
                            onChange={(e) => setField('unit', e.target.value)}
                            style={{ maxWidth: 120 }}
                        >
                            <option>sq.ft</option>
                            <option>sq.m</option>
                        </Form.Select>
                    </div>
                </Col>

                {/* Number of Floors */}
                <Col md={4} sm={12}>
                    <Form.Label className="fw-semibold">Floors *</Form.Label>
                    <Form.Select
                        value={villaData.floors}
                        onChange={(e) => setField('floors', e.target.value)}
                        className={isInvalid('floors')}
                    >
                        <option value="">Select Floors</option>
                        {Array.from({ length: 5 }, (_, i) => i + 1).map((v) => (
                            <option key={v} value={v}>
                                {v}
                            </option>
                        ))}
                    </Form.Select>
                </Col>

                {/* Number of Bedrooms */}
                <Col md={4} sm={12}>
                    <Form.Label className="fw-semibold">Bedrooms</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter bedrooms"
                        value={villaData.bedrooms}
                        onChange={(e) => setField('bedrooms', e.target.value)}
                    />
                </Col>

                {/* Number of Bathrooms */}
                <Col md={4} sm={12}>
                    <Form.Label className="fw-semibold">Bathrooms</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Enter bathrooms"
                        value={villaData.bathrooms}
                        onChange={(e) => setField('bathrooms', e.target.value)}
                    />
                </Col>
                
            </Row>
        </Form>
    );
};

export default VillaForm;