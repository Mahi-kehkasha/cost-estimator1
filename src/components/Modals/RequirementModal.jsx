import React, { useMemo, useState, useEffect } from 'react'
import { Row, Col, Button, Modal, Form } from 'react-bootstrap'
import { initialVillaForm } from "../../data/constants.jsx";
import VillaForm from "./Forms/VillaForm.jsx";

const RequirementModal = (props) => {

  const { showModal, hideModal, callParent, selectedProject } = props;
  const [villaData, setVillaData] = useState(initialVillaForm)


  const requiredKeysForProject = useMemo(() => ({
    villa: ['type', 'area', 'floors', 'quality', 'region'],
    apartment: ['totalArea', 'units', 'floors', 'quality', 'region'],
    office: ['area', 'floors', 'layout', 'ac', 'elevators', 'region'],
    mall: ['totalArea', 'floors', 'quality', 'region'],
    road: ['lengthKm', 'widthM', 'pavement', 'region'],
    renovation: ['type', 'area', 'floorsAffected', 'rooms', 'ageYears', 'region']
  }), [])

  const setField = (name, value) => {
    if (selectedProject === 'villa') setVillaData(prev => ({ ...prev, [name]: value }))
  }

  const requiredInvalid = useMemo(() => {
    if (!selectedProject) return []
    const keys = requiredKeysForProject[selectedProject] || []
    const map = {
      villa: villaData,
    }
    const form = map[selectedProject] || {}
    return keys.filter(k => {
      const v = form[k]
      if (Array.isArray(v)) return v.length === 0
      return String(v ?? '').trim() === ''
    })
  }, [selectedProject, villaData, requiredKeysForProject])


  const onNextFromRequirements = () => {
    if (requiredInvalid.length > 0) return
    const selectedProj = {
      projectType: 'Villa',
      area: Number(villaData.area),
      floors: Number(villaData.floors),
      region: villaData.region,
      quality: villaData.quality
    }
    callParent(selectedProj);
  }

  return (
    <Modal show={showModal} onHide={hideModal} centered dialogClassName="modal-dialog-centered">
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2">
          <i className="bi bi-clipboard-check text-primary"></i>
          {selectedProject === 'villa' ? 'Independent House' : 'Project Requirements'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {selectedProject === 'villa' && (
          <VillaForm villaData={villaData} requiredInvalid={requiredInvalid} setField={setField}/>
        )}
      </Modal.Body>
      <Modal.Footer className="justify-content-between flex-wrap modal-footer-sticky">
        <div className="d-flex align-items-center gap-2">
          {requiredInvalid.length > 0 && (
            <span className="text-danger small">Please fill required fields</span>
          )}
          <Button variant="primary" size="lg" className="rounded" onClick={onNextFromRequirements}>
            <i className="bi bi-gear-fill me-2"></i>
            Next: Select Specifications
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default RequirementModal;