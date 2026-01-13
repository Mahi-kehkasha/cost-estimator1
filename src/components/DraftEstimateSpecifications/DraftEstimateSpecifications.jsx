import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Button, Spinner, Container, Card } from 'react-bootstrap';
import ChatGPTResponse from '../ChatGPTResponse/ChatGPTResponse';
import ChatGPTInputSummary from '../ChatGPTInputSummary/ChatGPTInputSummary';

const DraftEstimateSpecifications = ({ selectedProjDetails, goToReviewDraft }) => {
  const [chatgptRes, setChatGptResp] = useState(null);
  const [fetchingDetails, setFetchingDetails] = useState(true);
  const [error, setError] = useState(null);
  const hasFetched = useRef(false);

  // Backend API base URL – for local dev this will default to localhost,
  // for production set VITE_API_BASE_URL in your environment (e.g. Vercel).
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

  const aiPrompt = {
      "id": "pmpt_68fa258429388190915466521773cbfb0031ef9bf4dd0f6d",
      "version": "28",
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
  }
  const promptData = {
    prompt: aiPrompt,
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
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      getDataFromBackend();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Function to fetch data from backend (which in turn calls ChatGPT and caches)
  async function getDataFromBackend() {
    setError(null);
    setFetchingDetails(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputJson: promptData }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Backend error (${response.status}): ${text}`);
      }

      const data = await response.json();
      const output = data.outputJson || data;

      if (
        !output ||
        typeof output !== 'object' ||
        !Array.isArray(output.materials_and_labour_breakdown)
      ) {
        throw new Error('Unexpected response format from backend');
      }

      setChatGptResp(output);
    } catch (err) {
      console.error('Error fetching data from backend ChatGPT API:', err);
      setError(err.message || 'Failed to fetch data. Please try again.');
      setChatGptResp(null);
    } finally {
      setFetchingDetails(false);
    }
  }

  return (
    <Container className="py-3 py-md-4">
      <Row className="g-3">
        <Col xs={12} className="mb-3 mb-md-4">
          {/* Project Details */}
          <Card className="shadow-sm">
            <Card.Body className="p-3 p-md-4">
              <ChatGPTInputSummary project={selectedProjDetails} />
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} className="mb-3 mb-md-4">
          {/* Header */}
          <Card className="shadow-sm">
            <Card.Body className="p-3 p-md-4">
              {fetchingDetails && (
                <Row className="mb-4">
                  <Col xs={12} className="text-center">
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Fetching Details...</span>
                    </Spinner>
                  </Col>
                </Row>
              )}

              {error && !fetchingDetails && (
                <div className="text-danger small mb-3">
                  Failed to fetch estimate: {error}
                </div>
              )}

              {chatgptRes && !fetchingDetails && !error && (
                <div className="fs-6 fs-md-5 text-success">
                  <ChatGPTResponse data={chatgptRes} />
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row className="mt-3">
        <Col xs={12} className="d-flex justify-content-end">
          <Button
            variant="primary"
            onClick={() => goToReviewDraft(chatgptRes)}
            className="w-100 w-md-auto"
            disabled={fetchingDetails || !!error || !chatgptRes}
          >
            Next
          </Button>
        </Col>
      </Row>
    </Container >
  );
};

export default DraftEstimateSpecifications;