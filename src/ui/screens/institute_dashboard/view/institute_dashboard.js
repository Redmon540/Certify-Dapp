import React, { useState, useEffect } from 'react';
import { Container, Col, Row, Card, Spinner } from 'react-bootstrap';
import { Profile } from '../../student_dashboard/components/profile';
import * as dbService from '../../../../services/firebase/databaseService';
import { useAppContext } from '../../../../context_providers/app_context';

export const InstituteDashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [studentCount, setStudentCount] = useState(0);
    const [certificatesCount, setCertificatesCount] = useState(0);
    const { user } = useAppContext();

    const loadData = async () => {
        setIsLoading(true);

        var std = await dbService.getAllStudentsCount(user.address);
        var cert = await dbService.getInstituteCertificatesCount(user.address);

        setStudentCount(std);
        setCertificatesCount(cert);

        setIsLoading(false);
    }

    useEffect(() => {
        loadData();
    }, []);

    const cardStyle =
    {
        marginTop: '10px',
        marginBottom: '10px',
        color: 'white',
        textAlign: 'center'
    }
    return (
        <Container style={{ maxWidth: '1500px' }}>
            <Row>
                <Col lg={4}>
                    <h1 className='text-center mt-4' style={{ fontWeight: 'bold' }}>Profile</h1>
                    <Profile />
                </Col>
                <Col lg={8}>
                    <h1 className='text-center mt-4' style={{ fontWeight: 'bold' }}>Summary</h1>
                    {
                        isLoading ?
                            <Row className='justify-content-center align-content-center mt-5'>
                                <Spinner animation="grow" variant="primary" role="status" />
                            </Row>
                            : <Row className='justify-content-center align-content-center mt-5'>
                                <Col md={4}>
                                    <Card
                                        style={cardStyle}
                                        bg='warning'
                                        className="mb-2">
                                        <Card.Body>
                                            <Card.Title> No. of Students </Card.Title>
                                            <Card.Text>
                                                <h1>{studentCount}</h1>
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={4}>
                                    <Card
                                        bg='info'
                                        style={cardStyle}
                                        className="mb-2">
                                        <Card.Body>
                                            <Card.Title> No. of Certificates </Card.Title>
                                            <Card.Text>
                                                <h1>{certificatesCount}</h1>
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                    }

                </Col>
            </Row>
        </Container>
    )
}
