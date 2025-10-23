import React, { useState } from 'react';
import { Row, Col, Button, Spinner, Container, Card } from 'react-bootstrap';
import OpenAI from 'openai';

// Constants for package tiers and quantity presets
const PACKAGE_TIERS = ['Basic', 'Standard', 'Luxury', 'Royal', 'Custom'];
const QUANTITY_PRESETS = ['1200', '2BHK', '3BHK', '4BHK', 'Custom'];

const ProjectSpecifications = ({ selectedProjDetails }) => {
  const [chatgptRes, setChatGptResp] = useState(null);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  // Function to fetch data from ChatGPT
  async function getDataFromChatGPT() {
    const client = new OpenAI({
      apiKey: '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',
      dangerouslyAllowBrowser: true,
    });

    const prompt = `Estimate the total cost to construct a house with the following details:
    - Built-up area: ${selectedProjDetails.area} sq.ft
    - Bathrooms: ${selectedProjDetails.bathrooms}
    - Bedrooms: ${selectedProjDetails.bedrooms}
    - Floors: ${selectedProjDetails.floors}
    - Location: India
    Consider basic construction costs.`;

    console.log('Prompt:', prompt);
    setFetchingDetails(true);

    try {
      const response = await client.responses.create({
        model: 'gpt-5',
        input: prompt,
      });
      setChatGptResp(response.output_text);
    } catch (error) {
      console.error('Error fetching data from ChatGPT:', error);
      setChatGptResp('Failed to fetch data. Please try again.');
    } finally {
      setFetchingDetails(false);
    }
  }

  return (
    <Container className="py-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <h2 className="text-primary fw-bold">Project Specifications</h2>
          <p className="text-muted">
            Fetch an estimated cost for your project based on the provided details.
          </p>
        </Col>
      </Row>

      {/* Fetch Data Button */}
      <Row className="mb-4">
        <Col xs={12} className="text-center">
          <Button
            size="lg"
            variant="primary"
            onClick={getDataFromChatGPT}
            disabled={fetchingDetails}
          >
            {fetchingDetails ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Fetching Estimation...
              </>
            ) : (
              'Fetch Cost Estimation'
            )}
          </Button>
        </Col>
      </Row>

      {/* Loading Spinner */}
      {fetchingDetails && (
        <Row className="mb-4">
          <Col xs={12} className="text-center">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Fetching Details...</span>
            </Spinner>
          </Col>
        </Row>
      )}

      {/* ChatGPT Response */}
      {chatgptRes && (
        <Row className="mb-4">
          <Col xs={12}>
            <Card className="shadow-sm">
              <Card.Body>
                <h5 className="fw-semibold">Estimated Cost</h5>
                <p className="fs-5 text-success">{chatgptRes}</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Project Details */}
      <Row>
        <Col xs={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="fw-semibold">Project Details</h5>
              <pre className="bg-light p-3 rounded">
                {JSON.stringify(selectedProjDetails, null, 2)}
              </pre>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProjectSpecifications;