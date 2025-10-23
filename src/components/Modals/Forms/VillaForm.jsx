import React from 'react';
import { Row, Col, Button, Modal, Form } from 'react-bootstrap'
import {constructionPackages} from '../../../data/constants/packages';
import {villaTypes, regions} from '../../../data/constants/presets';

const VillaForm = ({villaData, requiredInvalid, setField}) => {
    return (
        <Form>
            <Row className="g-3">
                <Col md={6}>
                    <Form.Label className="fw-semibold">Type *</Form.Label>
                    <Form.Select value={villaData.type} onChange={e => setField('type', e.target.value)} className={requiredInvalid.includes('type') ? 'is-invalid' : ''}>
                        <option value="">Select House Type</option>
                        {villaTypes.map(t => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={6}>
                    <Form.Label className="fw-semibold">Built-up Area *</Form.Label>
                    <div className="input-group">
                        <Form.Control type="number" placeholder="Enter area" value={villaData.area} onChange={e => setField('area', e.target.value)} className={requiredInvalid.includes('area') ? 'is-invalid' : ''} />
                        <Form.Select value={villaData.unit} onChange={e => setField('unit', e.target.value)} style={{ maxWidth: 120 }}>
                            <option>sq.ft</option>
                            <option>sq.m</option>
                        </Form.Select>
                    </div>
                </Col>
                <Col md={6}>
                    <Form.Label className="fw-semibold">Number of Floors *</Form.Label>
                    <Form.Select value={villaData.floors} onChange={e => setField('floors', e.target.value)} className={requiredInvalid.includes('floors') ? 'is-invalid' : ''}>
                        <option value="">Select Floors</option>
                        {Array.from({ length: 5 }, (_, i) => i + 1).map(v => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={6}>
                    <Form.Label className="fw-semibold">Number of Bedrooms</Form.Label>
                    <Form.Control type="number" placeholder="Enter bedrooms" value={villaData.bedrooms} onChange={e => setField('bedrooms', e.target.value)} />
                </Col>
                <Col md={6}>
                    <Form.Label className="fw-semibold">Number of Bathrooms</Form.Label>
                    <Form.Control type="number" placeholder="Enter bathrooms" value={villaData.bathrooms} onChange={e => setField('bathrooms', e.target.value)} />
                </Col>
                <Col md={6}>
                    <Form.Label className="fw-semibold">Construction Quality *</Form.Label>
                    <Form.Select value={villaData.quality} onChange={e => setField('quality', e.target.value)} className={requiredInvalid.includes('quality') ? 'is-invalid' : ''}>
                        <option value="">Select Construction Package</option>
                        {constructionPackages.map(([val, label]) => (
                            <option key={val} value={val}>{label}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={6}>
                    <Form.Label className="fw-semibold">Region *</Form.Label>
                    <Form.Select value={villaData.region} onChange={e => setField('region', e.target.value)} className={requiredInvalid.includes('region') ? 'is-invalid' : ''}>
                        <option value="">Select Region</option>
                        {regions.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>
        </Form>
    );
};

export default VillaForm;