import React from 'react';
import { Card, Table, Badge } from 'react-bootstrap';

const ClientSpecifications = () => {
  const specifications = {
    structural: {
      title: "Structural Materials",
      items: {
        "Cement": {
          Basic: "43 Grade OPC",
          Standard: "43/53 Grade OPC",
          Luxury: "53 Grade OPC",
          Royal: "53 Grade OPC - Premium brands"
        },
        "Steel": {
          Basic: "Fe 500 TMT Bars",
          Standard: "Fe 500D TMT Bars",
          Luxury: "Fe 550 TMT Bars",
          Royal: "Fe 550D TMT Bars - Premium brands"
        },
        "Bricks": {
          Basic: "Standard Red Clay Bricks",
          Standard: "Premium Clay Bricks",
          Luxury: "AAC Blocks/Premium Quality",
          Royal: "AAC Blocks/Premium Quality"
        },
        "Sand": {
          Basic: "River Sand - M-Sand",
          Standard: "River Sand - M-Sand",
          Luxury: "Premium River Sand",
          Royal: "Premium River Sand"
        }
      }
    },
    finishing: {
      title: "Finishing Materials",
      items: {
        "Flooring": {
          Basic: "Vitrified Tiles (₹40-50/sqft)",
          Standard: "Premium Vitrified (₹60-70/sqft)",
          Luxury: "Imported/Premium (₹80-100/sqft)",
          Royal: "Italian Marble/Premium Imported"
        },
        "Kitchen": {
          Basic: "Ceramic Tiles + Granite Platform",
          Standard: "Premium Tiles + Granite",
          Luxury: "Imported Tiles + Premium Granite",
          Royal: "Premium Materials + Designer Finish"
        },
        "Bathroom": {
          Basic: "Ceramic Tiles up to 7ft",
          Standard: "Designer Ceramic up to 7ft",
          Luxury: "Premium Tiles up to ceiling",
          Royal: "Imported Tiles + Premium Fittings"
        },
        "Painting": {
          Basic: "Oil Bound Distemper",
          Standard: "Premium Emulsion",
          Luxury: "Royal/Luxury Emulsion",
          Royal: "Textured/Designer Finish"
        }
      }
    },
    doors: {
      title: "Doors & Windows",
      items: {
        "Main Door": {
          Basic: "Teak Wood Frame + Flush Door",
          Standard: "Teak Frame + Panel Door",
          Luxury: "Full Teak + Premium Design",
          Royal: "Custom Design + Premium Hardware"
        },
        "Internal Doors": {
          Basic: "Sal Wood + Flush Door",
          Standard: "Premium Flush/Panel Door",
          Luxury: "Teak Frame + Panel Door",
          Royal: "Designer Doors + Premium Hardware"
        },
        "Windows": {
          Basic: "UPVC with Standard Glass",
          Standard: "UPVC with Premium Glass",
          Luxury: "UPVC/Aluminum with Toughened Glass",
          Royal: "Premium UPVC/Aluminum + Sound Proof"
        },
        "Bathroom Doors": {
          Basic: "WPC/FRP Doors",
          Standard: "Premium WPC/FRP Doors",
          Luxury: "Waterproof Engineered Doors",
          Royal: "Premium Waterproof + Hardware"
        }
      }
    },
    electrical: {
      title: "Electrical",
      items: {
        "Wiring": {
          Basic: "Finolex/RR Cable",
          Standard: "Finolex/Havells",
          Luxury: "Havells/Polycab Premium",
          Royal: "Havells/Polycab Premium FR"
        },
        "Switches": {
          Basic: "Anchor Roma",
          Standard: "Legrand Myrius",
          Luxury: "Schneider/Legrand Premium",
          Royal: "Schneider Premium/Smart"
        },
        "MCB/ELCB": {
          Basic: "Havells/Standard",
          Standard: "Legrand/Schneider",
          Luxury: "Schneider Premium",
          Royal: "Schneider Premium + Smart"
        }
      }
    },
    plumbing: {
      title: "Plumbing & Sanitary",
      items: {
        "Pipes": {
          Basic: "UPVC/CPVC Standard",
          Standard: "Ashirvad/Astral",
          Luxury: "Supreme/Prince Premium",
          Royal: "Astral Premium"
        },
        "Sanitary Ware": {
          Basic: "Parryware/Cera",
          Standard: "Hindware/CERA Premium",
          Luxury: "Kohler/Roca",
          Royal: "Kohler/Roca Premium"
        },
        "CP Fittings": {
          Basic: "Parryware/Cera",
          Standard: "Jaquar Continental",
          Luxury: "Grohe/Kohler",
          Royal: "Grohe/Kohler Premium"
        },
        "Kitchen Sink": {
          Basic: "Stainless Steel Single Bowl",
          Standard: "SS Double Bowl",
          Luxury: "Premium SS/Quartz",
          Royal: "Designer Quartz/Premium"
        }
      }
    }
  };

  const QualityBadge = ({ type }) => {
    const colors = {
      Basic: 'secondary',
      Standard: 'info',
      Luxury: 'warning',
      Royal: 'primary'
    };
    return (
      <Badge bg={colors[type]} className="ms-2">
        {type}
      </Badge>
    );
  };

  return (
    <div className="py-4">
      <h3 className="mb-4 text-center">Client Specifications Guide</h3>
      <div className="row g-4">
        {Object.entries(specifications).map(([category, { title, items }]) => (
          <div className="col-12" key={category}>
            <Card className="shadow-sm">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">{title}</h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table responsive bordered className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{width: '20%'}}>Item</th>
                      <th>Specifications by Quality Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(items).map(([item, qualities]) => (
                      <tr key={item}>
                        <td className="fw-bold">{item}</td>
                        <td>
                          {Object.entries(qualities).map(([quality, spec]) => (
                            <div key={quality} className="mb-2">
                              <QualityBadge type={quality} />
                              <span className="ms-2">{spec}</span>
                            </div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientSpecifications;