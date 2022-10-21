import React, { useState, useEffect } from 'react'
import { Container, Row, Spinner } from 'react-bootstrap';
import { CertificatesList } from '../../student_dashboard/components/certificates_list.js';
import * as dbService from '../../../../services/firebase/databaseService';
import { useAppContext } from '../../../../context_providers/app_context.js';


export const AllCertificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const appContext = useAppContext();

    const getAllCertificates = async () => {
        setIsLoading(true);
        let data = await dbService.getInstituteCertificates(appContext.user.address);
        if (data) {
            let keys = Object.keys(data);
            let values = Object.values(data);
            let certificates = [];
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
        getAllCertificates();
    }, []);

    return (
        <Container>
            <Row className='justify-content-center my-3'>
                <h2 style={{ fontWeight: "bold", color: "blue" }}>All Certificates</h2>
            </Row>
            <Row className='justify-content-center align-content-center'>
                {
                    isLoading ?
                        <Spinner animation="grow" variant="primary" role="status" />
                        : certificates.length == 0 ?
                            <h4>No Certificates found</h4>
                            : <CertificatesList certificates={certificates} />
                }
            </Row>
        </Container>
    )
}
