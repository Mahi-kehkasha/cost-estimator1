import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Spinner, Container, Card, Table } from 'react-bootstrap';
import OpenAI from 'openai';
import base64 from 'base-64';
import { Chat } from 'openai/resources/index';
import ChatGPTResponse from '../ChatGPTResponse/ChatGPTResponse';

const ProjectSpecifications = ({ selectedProjDetails }) => {
  const [chatgptRes, setChatGptResp] = useState(null);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  useEffect(() => {
    getDataFromChatGPT();
    getHouseImage();
  }, []);

  const client = new OpenAI({
    apiKey: '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',
    dangerouslyAllowBrowser: true,
  });

  // Function to fetch data from ChatGPT
  async function getDataFromChatGPT() {
    setFetchingDetails(true);
    try {
      const response = await client.responses.parse({
        prompt: {
          "id": "pmpt_68fa258429388190915466521773cbfb0031ef9bf4dd0f6d",
          "version": "13",
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
            "name": "building_material_estimation",
            "strict": true,
            "schema": {
              "type": "object",
              "properties": {
                "materials": {
                  "type": "array",
                  "description": "List of materials with their details and costs.",
                  "items": {
                    "type": "object",
                    "properties": {
                      "item": {
                        "type": "string",
                        "description": "Name of the material, e.g., Bricks, Cement, etc."
                      },
                      "unit": {
                        "type": "string",
                        "description": "Unit of measurement for the material, e.g., bags, kg, set, lumpsum, etc."
                      },
                      "quantity": {
                        "type": "number",
                        "description": "Required quantity of the given material"
                      },
                      "rate_in_inr": {
                        "type": "number",
                        "description": "Rate or price of the material per unit, in INR"
                      },
                      "total_cost_in_inr": {
                        "type": "number",
                        "description": "Total cost for this material, in INR"
                      },
                      "notes": {
                        "type": "string",
                        "description": "Any specific usage notes, may be omitted for some materials",
                        "minLength": 1
                      }
                    },
                    "required": [
                      "item",
                      "unit",
                      "quantity",
                      "rate_in_inr",
                      "total_cost_in_inr",
                      "notes"
                    ],
                    "additionalProperties": false
                  }
                },
                "total_estimated_cost_in_inr": {
                  "type": "number",
                  "description": "Sum of all material costs, in INR"
                },
                "notes": {
                  "type": "string",
                  "description": "General remarks regarding the estimation"
                }
              },
              "required": [
                "materials",
                "total_estimated_cost_in_inr",
                "notes"
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

  async function getHouseImage() {
    setFetchingDetails(true);

    const response = await client.responses.create({
      prompt: {
        "id": "pmpt_68fa5b5b68bc819482398043645f566807955c38d097999d",
        "version": "9",
        "variables": {
          "rooms": "1",
          "floor": "1"
        }
      },
    });

    // Save the image to a file
    const imageData = response.output
      .filter((output) => output.type === "image_generation_call")
      .map((output) => output.result);

    if (imageData.length > 0) {
      const imageBase64 = imageData[0];
      console.log("Image Base64:", imageBase64);
      // const fs = await import("fs");
      // fs.writeFileSync("cat_and_otter.png", Buffer.from(imageBase64, "base64"));
    }
    console.log(response);
    setFetchingDetails(false);

  }

  return (
    <Container className="py-4">
      <Row>
        <Col xs={8} className="mb-4">
          {/* Header */}
          <Row className="mb-4">
            <Col xs={12}>
              <Card className="shadow-sm">
                <Card.Body>
                  <h5 className="fw-semibold">Structural Details</h5>

                  <Container className="shadow-sm">
                    {fetchingDetails && (
                      <Row className="mb-4">
                        <Col xs={12} className="text-center">
                          <Spinner animation="border" role="status">
                            <span className="visually-hidden">Fetching Details...</span>
                          </Spinner>
                        </Col>
                      </Row>
                    )}

                    {chatgptRes && (
                      <Row className="mb-4">
                        <Col xs={12}>
                          <Card className="shadow-sm">
                            <Card.Body>
                              <h5 className="fw-semibold">Bricks</h5>
                              <Container className="fs-5 text-success">
                                <ChatGPTResponse data={chatgptRes} />
                              </Container>
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    )}
                  </Container>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xs={4} className="mb-4">
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
        </Col>
      </Row>
    </Container >
  );
};

export default ProjectSpecifications;