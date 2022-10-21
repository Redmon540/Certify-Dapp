import React from 'react';
import { Container, Col, Row, Image, Card } from 'react-bootstrap';
import { AppContext, useAppContext } from '../../../../context_providers/app_context';

export const Profile = ({ certificateCount }) => {
    const { user } = useAppContext();
    let titleStyle = {
        fontWeight: "bold",
        fontSize: "20px"
    };

    let contentStyle = {
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        overflow: "hidden"
    };

    return (
        <Card className='mt-5'>
            <Card.Body>
                <Container>
                    <Row className="justify-content-md-center">
                        <Image src={user?.imgUrl ? user.imgUrl :
                            "https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png"}
                            roundedCircle height='150' width='150' />
                    </Row>
                    {/* Name */}
                    <Row xs='auto' className='mt-3'>
                        <Col style={titleStyle}>
                            Name:
                    </Col>
                        <Col style={contentStyle}>
                            {user.name}
                        </Col>
                    </Row>
                    {/* Email */}
                    <Row xs='auto' className='mt-3'>
                        <Col style={titleStyle}>
                            Email:
                    </Col>
                        <Col style={contentStyle}>
                            {user.email}
                        </Col>
                    </Row>
                    {/* Address */}
                    <Row xs='auto' className='mt-3'>
                        <Col style={titleStyle}>
                            Address:
                    </Col>
                        <Col style={contentStyle}>
                            <a target='_blank' href={`https://ropsten.etherscan.io/address/${user.address}`}>
                                {user.address}
                            </a>
                        </Col>
                    </Row>
                    {
                        user.accountType == 'Student' &&
                        <>
                            {/* Institute Name */}
                            < Row xs='auto' className='mt-3'>
                                <Col style={titleStyle}>
                                    Institute Address:
                                </Col>
                                <Col style={contentStyle}>
                                    <a target='_blank' href={`https://ropsten.etherscan.io/address/${user.instituteAddress}`}>
                                        {user.instituteAddress}
                                    </a>                </Col>
                            </Row>
                            {/* No. of Certificate */}
                            <Row xs='auto' className='mt-3'>
                                <Col style={titleStyle}>
                                    No. of Certificates:
                                </Col>
                                <Col style={contentStyle}>
                                    {certificateCount}
                                </Col>
                            </Row>
                        </>
                    }

                </Container>
            </Card.Body>
        </Card >

    )
}
