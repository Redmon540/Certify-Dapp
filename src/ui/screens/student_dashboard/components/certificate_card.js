import React from 'react';
import { Card, Button, Row, Col, NavLink } from 'react-bootstrap';
import { FaCheckCircle, FaTimesCircle, FaEyeSlash, FaEye } from "react-icons/fa";
import { Link, useHistory } from 'react-router-dom';

export const CertificateCard = ({ certificate }) => {
    const history = useHistory();
    return (
        <Card style={{ cursor: "pointer", boxShadow: " 0 10px 10px rgba(0, 0, 0, 0.2)" }}
            onClick={() => history.push(`/certificate_details/${certificate.key}`)}>
            <Card.Img height='300px' variant="top"
                src={certificate.imgUrl} />
            <Card.Body>
                <Card.Title>{certificate?.name}</Card.Title>
                <Card.Text>
                    <p style={{
                        color: "#949494",
                        height: "100px",
                        overflow: "hidden",
                        margin: "10px",
                    }}>
                        {certificate?.description}

                    </p>
                </Card.Text>
                <a target='_blank' href={`https://ropsten.etherscan.io/tx/${certificate?.transactionHash}`}>
                    <h5 style={{
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden"
                    }}>
                        {certificate?.transactionHash}
                    </h5>
                </a>
            </Card.Body>
            <Card.Footer>
                <Row>
                    {
                        certificate?.status == 'Verified' ?
                            <Col>
                                <FaCheckCircle style={{ color: 'green' }} /> Verified
                            </Col>
                            :
                            <Col>
                                <FaTimesCircle style={{ color: 'red' }} /> Unverified
                            </Col>
                    }
                    {
                        certificate?.visibility == 'Public' ?
                            <Col>
                                <FaEye style={{ color: 'black' }} /> Public
                            </Col>
                            :
                            <Col>
                                <FaEyeSlash style={{ color: 'grey' }} /> Private
                            </Col>
                    }
                </Row>
            </Card.Footer>
        </Card >
    );
}
