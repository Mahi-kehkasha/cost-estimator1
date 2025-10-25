import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Spinner, Container, Card, Table } from 'react-bootstrap';
import OpenAI from 'openai';
import base64 from 'base-64';
import { Chat } from 'openai/resources/index';
import ChatGPTResponse from '../ChatGPTResponse/ChatGPTResponse';
import ChatGPTInputSummary from '../ChatGPTInputSummary/ChatGPTInputSummary';

const ProjectSpecifications = ({ selectedProjDetails }) => {
  const [chatgptRes, setChatGptResp] = useState(null);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  useEffect(() => {
    getDataFromChatGPT();
    // getHouseImage();
  }, []);

  const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    console.error('OpenAI API key is missing. Please check your .env file.');
  };

  const client = new OpenAI({
    apiKey: OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  });

  // Function to fetch data from ChatGPT
  async function getDataFromChatGPT() {
    setFetchingDetails(true);
    try {
      const response = await client.responses.parse({
        prompt: {
          "id": "pmpt_68fa258429388190915466521773cbfb0031ef9bf4dd0f6d",
          "version": "27",
          "variables": {
            "builtuparea": `${selectedProjDetails.area} sq.ft`,
            "rooms": `${selectedProjDetails.bedrooms}`,
            "floors": `${selectedProjDetails.floors}`,
            "washrooms": `${selectedProjDetails.bathrooms}`,
            "kitchens": '1',
            "city": "Bengaluru",
            "location_multiplier": "1.0",
            "soil_type": "normal",
            "finishing_quality": "basic",
            "foundation_depth_ft": "5",
            "include_labour": "true",
            "tax_percent": "10",
            "drawing_rooms": "1"
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
                "project_info": {
                  "type": "object",
                  "description": "Basic information and estimation parameters about the construction project.",
                  "properties": {
                    "builtup_area_sqft": {
                      "type": "number",
                      "description": "Total built-up area in square feet."
                    },
                    "floors": {
                      "type": "integer",
                      "description": "Number of floors in the building."
                    },
                    "rooms": {
                      "type": "integer",
                      "description": "Total number of rooms."
                    },
                    "washrooms": {
                      "type": "integer",
                      "description": "Number of washrooms."
                    },
                    "kitchens": {
                      "type": "integer",
                      "description": "Number of kitchens."
                    },
                    "city": {
                      "type": "string",
                      "description": "City where the project is located."
                    },
                    "floor_height_ft": {
                      "type": "number",
                      "description": "Typical height of each floor in feet."
                    },
                    "soil_type": {
                      "type": "string",
                      "description": "Type of soil at the project location."
                    },
                    "location_multiplier": {
                      "type": "number",
                      "description": "Location cost adjustment multiplier."
                    },
                    "finishing_quality": {
                      "type": "string",
                      "description": "Quality of finishing applied.",
                      "enum": [
                        "Basic",
                        "Standard",
                        "Premium"
                      ]
                    },
                    "labour_multiplier": {
                      "type": "number",
                      "description": "Adjustment multiplier for labour costs."
                    },
                    "contingency_percent": {
                      "type": "number",
                      "description": "Contingency percentage applied to total costs."
                    },
                    "notes": {
                      "type": "string",
                      "description": "Additional notes and recommendations for accurate estimation."
                    }
                  },
                  "required": [
                    "builtup_area_sqft",
                    "floors",
                    "rooms",
                    "washrooms",
                    "kitchens",
                    "city",
                    "floor_height_ft",
                    "soil_type",
                    "location_multiplier",
                    "finishing_quality",
                    "labour_multiplier",
                    "contingency_percent",
                    "notes"
                  ],
                  "additionalProperties": false
                },
                "area_breakdown": {
                  "type": "object",
                  "description": "Breakdown of different areas relevant to the building estimation.",
                  "properties": {
                    "floor_area_sqft": {
                      "type": "number",
                      "description": "Total floor area in square feet."
                    },
                    "roof_area_sqft": {
                      "type": "number",
                      "description": "Total roof area in square feet."
                    },
                    "wall_area_sqft": {
                      "type": "number",
                      "description": "Total estimated wall area in square feet."
                    },
                    "notes": {
                      "type": "string",
                      "description": "Explanation and context about the area approximations and methodology."
                    }
                  },
                  "required": [
                    "floor_area_sqft",
                    "roof_area_sqft",
                    "wall_area_sqft",
                    "notes"
                  ],
                  "additionalProperties": false
                },
                "materials_and_labour_breakdown": {
                  "type": "array",
                  "description": "Detailed cost and quantity breakdown of each material and labour item.",
                  "items": {
                    "type": "object",
                    "properties": {
                      "item": {
                        "type": "string",
                        "description": "Name of the material or labour costed."
                      },
                      "unit": {
                        "type": "string",
                        "description": "Measurement unit for quantity (e.g., sqft, kg, bags, set, lumpsum)."
                      },
                      "quantity": {
                        "type": "number",
                        "description": "Total quantity required."
                      },
                      "rate_in_inr": {
                        "type": "number",
                        "description": "Unit rate in INR."
                      },
                      "total_cost_in_inr": {
                        "type": "number",
                        "description": "Total cost for this item in INR."
                      },
                      "notes": {
                        "type": "string",
                        "description": "Details on calculation rules and adjustments for this item."
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
                "thumb_rules_applied": {
                  "type": "object",
                  "description": "Human readable thumb rules or formulae used for material and cost calculations.",
                  "properties": {
                    "steel_rule": {
                      "type": "string",
                      "description": "Rule for calculating steel requirement."
                    },
                    "cement_rule": {
                      "type": "string",
                      "description": "Rule for calculating cement requirement."
                    },
                    "brick_rule": {
                      "type": "string",
                      "description": "Rule for calculating bricks requirement."
                    },
                    "sand_rule": {
                      "type": "string",
                      "description": "Rule for calculating sand requirement."
                    },
                    "aggregate_rule": {
                      "type": "string",
                      "description": "Rule for calculating aggregate requirement."
                    },
                    "wastage_rule": {
                      "type": "string",
                      "description": "Rule for calculating wastage."
                    },
                    "labour_rule": {
                      "type": "string",
                      "description": "Rule for calculating labour charges."
                    },
                    "finishing_rules": {
                      "type": "string",
                      "description": "Rules for finishing items such as flooring, paint, doors & windows, electrical, and plumbing."
                    }
                  },
                  "required": [
                    "steel_rule",
                    "cement_rule",
                    "brick_rule",
                    "sand_rule",
                    "aggregate_rule",
                    "wastage_rule",
                    "labour_rule",
                    "finishing_rules"
                  ],
                  "additionalProperties": false
                },
                "financial_summary": {
                  "type": "object",
                  "description": "Overall financial summary of cost estimation.",
                  "properties": {
                    "total_sub_cost_in_inr": {
                      "type": "number",
                      "description": "Subtotal cost (before contingency) in INR."
                    },
                    "contingency_cost_in_inr": {
                      "type": "number",
                      "description": "Contingency allowance in INR."
                    },
                    "grand_total_cost_in_inr": {
                      "type": "number",
                      "description": "Grand total project cost including contingency in INR."
                    },
                    "cost_per_sqft_in_inr": {
                      "type": "number",
                      "description": "Cost per square foot in INR."
                    }
                  },
                  "required": [
                    "total_sub_cost_in_inr",
                    "contingency_cost_in_inr",
                    "grand_total_cost_in_inr",
                    "cost_per_sqft_in_inr"
                  ],
                  "additionalProperties": false
                }
              },
              "required": [
                "project_info",
                "area_breakdown",
                "materials_and_labour_breakdown",
                "thumb_rules_applied",
                "financial_summary"
              ],
              "additionalProperties": false
            },
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
        "version": "14",
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
        <Col xs={12} className="mb-4">
          {/* Project Details */}
          <Row>
            <Col xs={12}>
              <Card className="shadow-sm">
                <Card.Body>
                  <ChatGPTInputSummary project={selectedProjDetails} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
        <Col xs={12} className="mb-4">
          {/* Header */}
          <Row className="mb-4">
            <Col xs={12}>
              <Card className="shadow-sm">
                <Card.Body>

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

                    {chatgptRes && !fetchingDetails && (
                      <Row className="mb-4">
                        <Col xs={12}>
                          <Card className="shadow-sm">
                            <Card.Body>
                              <Container className="fs-5 text-success">
                                <ChatGPTResponse data={chatgptRes} />
                                <pre>
                                  {JSON.stringify(chatgptRes, null, 2)}
                                </pre>
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
      </Row>
    </Container >
  );
};

export default ProjectSpecifications;