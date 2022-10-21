import React from 'react'
import { CertificateCard } from './certificate_card';
import { Container, Col, Row } from 'react-bootstrap';

export const CertificatesList = ({ certificates }) => {
    return (
        <Container style={{ maxWidth: '1300px' }}>
            <Row className='justify-content-center align-content-center'>
                {
                    certificates.map(c =>
                        <Col sm='auto' lg='4' md='6' className='m-5'>
                            <CertificateCard key={c.key} certificate={c} />
                        </Col>
                    )
                }
            </Row>
        </Container>
    )
}
