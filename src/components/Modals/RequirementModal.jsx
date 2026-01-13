import React, { useMemo, useState, useEffect } from 'react'
import { Row, Col, Button, Modal, Form } from 'react-bootstrap'
import { initialVillaForm } from '../../data/constants/forms';
import IndependentHouseForm from './Forms/IndependentHouseForm/IndependentHouseForm';

const RequirementModal = (props) => {

  const { showModal, hideModal, handleSetProjectDetails, selectedProject } = props;
  const [houseData, setHouseData] = useState(initialVillaForm)


  const requiredKeysForProject = useMemo(() => ({
    villa: ['type', 'area', 'floors']
  }), [])

  const setField = (name, value) => {
    setHouseData(prev => ({ ...prev, [name]: value }))
  }

  const requiredInvalid = useMemo(() => {
    if (!selectedProject) return []
    const keys = requiredKeysForProject[selectedProject] || []
    const map = {
      villa: houseData,
    }
    const form = map[selectedProject] || {}
    return keys.filter(k => {
      const v = form[k]
      if (Array.isArray(v)) return v.length === 0
      return String(v ?? '').trim() === ''
    })
  }, [selectedProject, houseData, requiredKeysForProject])


  const onNextFromRequirements = () => {
    if (requiredInvalid.length > 0) return
    const selectedProj = {
      projectType: houseData.type,
      area: Number(houseData.area),
      floors: Number(houseData.floors),
      bedrooms: Number(houseData.bedrooms),
      bathrooms: Number(houseData.bathrooms),
    }
    handleSetProjectDetails(selectedProj);
  }

  return (
    <Modal 
      show={showModal} 
      onHide={hideModal} 
      centered 
      dialogClassName="modal-dialog-centered"
      fullscreen="sm-down"
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title className="d-flex align-items-center gap-2">
          <i className="bi bi-clipboard-check text-primary"></i>
          Independent House
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <IndependentHouseForm houseData={houseData} requiredInvalid={requiredInvalid} setField={setField}/>
      </Modal.Body>
      <Modal.Footer className="justify-content-between flex-wrap modal-footer-sticky">
        <div className="d-flex align-items-center gap-2">
          {requiredInvalid.length > 0 && (
            <span className="text-danger small">Please fill required fields</span>
          )}
          <Button variant="primary" size="sm" className="rounded" onClick={onNextFromRequirements}>
            <i className="bi bi-gear-fill me-2"></i>
            Next
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default RequirementModal;