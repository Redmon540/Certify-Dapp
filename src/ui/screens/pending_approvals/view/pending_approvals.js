import React, { useState, useEffect } from 'react'
import { Container, Row, Spinner } from 'react-bootstrap';
import { CertificatesList } from '../../student_dashboard/components/certificates_list.js';
import * as dbService from '../../../../services/firebase/databaseService';
import { useAppContext } from '../../../../context_providers/app_context.js';


export const PendingApprovals = () => {
    const [pendingApprovals, setPendingApprovals] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const appContext = useAppContext();

    const getPendingApprovals = async () => {
        setIsLoading(true);
        let data;
        if (appContext.accountType == 'Student') {
            data = await dbService.getStudentCertificates(appContext.user.address);
        }
        else if (appContext.accountType == 'Institute') {
            data = await dbService.getInstituteCertificates(appContext.user.address);
        }
        if (data) {

            let keys = Object.keys(data);
            let values = Object.values(data);
            let certificates = [];

            //extract only the unverified certificates
            for (let i = 0; i < values.length; i++) {
                if (values[i].status == 'Unverified')
                    certificates.push({
                        ...values[i],
                        key: keys[i],
                    });
            }
            setPendingApprovals(certificates);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        getPendingApprovals();
    }, []);

    return (
        <Container>
            <Row className='justify-content-center my-3'>
                <h2 style={{ fontWeight: "bold", color: "blue" }}>Pending Approvals</h2>
            </Row>
            <Row className='justify-content-center align-content-center'>
                {
                    isLoading ?
                        <Spinner animation="grow" variant="primary" role="status" />
                        : pendingApprovals.length == 0 ?
                            <h4>No pending approvals found</h4>
                            : <CertificatesList certificates={pendingApprovals} />
                }
            </Row>
        </Container>
    )
}
