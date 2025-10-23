import React, { useState } from 'react';
import { Row, Col, Button, Spinner, Container, Card, Table } from 'react-bootstrap';
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

    setFetchingDetails(true);

    try {
      /*const response = await client.responses.create({
        text: {
          format: {
            "type": "json_schema",
            "name": "bricks",
            "strict": true,
            "schema": {
              "type": "object",
              "properties": {
                "estimated_total_cost_inr": {
                  "type": "string",
                  "description": "Estimated total cost in INR."
                },
                "external_walls_bricks": {
                  "type": "string",
                  "description": "Type or quantity of bricks used for external walls."
                },
                "internal_walls_bricks": {
                  "type": "string",
                  "description": "Type or quantity of bricks used for internal walls."
                }
              },
              "required": [
                "estimated_total_cost_inr",
                "external_walls_bricks",
                "internal_walls_bricks"
              ],
              "additionalProperties": false

            }
          }
        },
        prompt: {
          "id": "pmpt_68fa258429388190915466521773cbfb0031ef9bf4dd0f6d",
          "version": "10",
          "variables": {
            "builtuparea": `${selectedProjDetails.area} sq.ft`,
            "rooms": `${selectedProjDetails.bedrooms}`,
            "floors": `${selectedProjDetails.floors}`,
            "washrooms": `${selectedProjDetails.bathrooms}`,
            "kitchens": '1',
            "city": "Bengaluru"
          }
        },
      });
      */

      const response = await client.responses.parse({
        prompt: {
          "id": "pmpt_68fa258429388190915466521773cbfb0031ef9bf4dd0f6d",
          "version": "10",
          "variables": {
            "builtuparea": `${selectedProjDetails.area} sq.ft`,
            "rooms": `${selectedProjDetails.bedrooms}`,
            "floors": `${selectedProjDetails.floors}`,
            "washrooms": `${selectedProjDetails.bathrooms}`,
            "kitchens": '1',
            "city": "Bengaluru"
          }
        },
        "text": {
          "format": {
            "type": "json_schema",
            "name": "bricks",
            "strict": true,
            "schema": {
              "type": "object",
              "properties": {
                "estimated_total_cost_inr": {
                  "type": "string",
                  "description": "Estimated total cost in INR."
                },
                "external_walls_bricks": {
                  "type": "string",
                  "description": "Type or quantity of bricks used for external walls."
                },
                "internal_walls_bricks": {
                  "type": "string",
                  "description": "Type or quantity of bricks used for internal walls."
                }
              },
              "required": [
                "estimated_total_cost_inr",
                "external_walls_bricks",
                "internal_walls_bricks"
              ],
              "additionalProperties": false
            }
          }
        },
      });
      console.log(response.output_parsed);
      setChatGptResp(response.output_parsed);
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
                <Container className="fs-5 text-success">
                  <Table>
                    <tbody>
                      <tr><td>Outdoor Walls</td><td>{chatgptRes.external_walls_bricks}</td></tr>
                      <tr><td>Inddor Walls</td><td>{chatgptRes.internal_walls_bricks}</td></tr>
                      <tr><td>Bricks Cost</td><td>{chatgptRes.estimated_total_cost_inr}</td></tr>
                    </tbody>
                  </Table>

                </Container>
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