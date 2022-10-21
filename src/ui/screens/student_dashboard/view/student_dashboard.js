import React, { useState, useEffect } from 'react';
import { Container, Col, Row, Spinner } from 'react-bootstrap';
import { Profile } from '../components/profile';
import { CertificatesList } from '../components/certificates_list.js';
import { useAppContext } from '../../../../context_providers/app_context.js';
import * as dbService from '../../../../services/firebase/databaseService';

export const StudentDashboard = () => {
    const [certificates, setCertificates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const appContext = useAppContext();

    const getCertificates = async () => {
        setIsLoading(true);
        let data = await dbService.getStudentCertificates(appContext.user.address);
        if (data) {
            let keys = Object.keys(data);
            let values = Object.values(data);
            let certificates = [];

            //extract only the unverified certificates
            for (let i = 0; i < values.length; i++) {
                certificates.push({
                    ...values[i],
                    key: keys[i],
                });
            }
            setCertificates(certificates);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getCertificates();
    }, []);

    return (
        <Container style={{ maxWidth: '1500px' }}>
            <Row>
                <Col lg={4} >
                    <h1 className='text-center mt-4' style={{ fontWeight: 'bold' }}>Profile</h1>
                    <Profile certificateCount={certificates?.length} />
                </Col>
                <Col lg={8}>
                    <h1 className='text-center mt-4' style={{ fontWeight: 'bold' }}>Certificates</h1>
                    {
                        isLoading ?
                            <Row className='justify-content-center align-content-center'>
                                <Spinner animation="grow" variant="primary" role="status" />
                            </Row>
                            : certificates.length == 0 ?
                                <Row className='justify-content-center align-content-center'>
                                    <h4>No Certificates found</h4>
                                </Row>
                                : <CertificatesList certificates={certificates} />
                    }
                </Col>
            </Row>
        </Container>
    )
}
