import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Image, Card, Spinner, Badge } from 'react-bootstrap';
import { FaExclamationCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import * as dbService from '../../../../services/firebase/databaseService';
import * as ipfsService from '../../../../services/ipfs/ipfsService';
import * as ethService from '../../../../services/ethereum/ethService';
import { useAppContext } from '../../../../context_providers/app_context';
import { useAlertContext } from '../../../../context_providers/alert_context';
import { LoadingButton } from '../../../components/loading_button/loading_button';

export const CertificateDetails = props => {
    const [certificate, setCertificate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isChangingVisibility, setIsChangingVisibility] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const appContext = useAppContext();
    const alertContext = useAlertContext();
    const key = props.match.params.key;

    const loadCertificateData = async () => {
        setIsLoading(true);
        const data = await dbService.getCertificate(key);
        setCertificate(data);
        setIsLoading(false);
    }

    useEffect(() => {
        loadCertificateData();
    }, [])

    let titleStyle = {
        fontWeight: "bold",
        fontSize: "20px"
    };

    const changeVisibility = async () => {
        if (appContext.accountType == 'Student') {
            setIsChangingVisibility(true);

            var visibility = certificate.visibility == 'Public' ? 'Private' : 'Public';
            //update visibility on firebase
            await dbService.setCertificateVisibility(props.match.params.key, visibility);

            //update the state
            setCertificate((value) => {
                return {
                    ...value,
                    visibility: visibility
                }
            });

            setIsChangingVisibility(false);
        }
    }

    const verifyCertificate = async () => {
        if (appContext.accountType == 'Student')
            return;

        setIsVerifying(true);
        appContext.setIsTransactionRunning(true);

        const img = await ipfsService.downloadFile(certificate.imgUrl);
        const hash = await ipfsService.uploadFile(img);
        const tx = await ethService.addCertificate(appContext.user.contractAddress, certificate.studentAddress, hash);
        if (tx) {

            await dbService.setCertificate(key, {
                ...certificate,
                imgUrl: ipfsService.ipfsGateway + hash,
                ipfsHash: hash,
                transactionHash: tx,
                status: "Verified",
            });
            alertContext.showSuccess("Certificate Approved Successfully.");
            //update the local state
            setCertificate((value) => {
                return {
                    ...certificate,
                    imgUrl: ipfsService.ipfsGateway + hash,
                    ipfsHash: hash,
                    transactionHash: tx,
                    status: "Verified",
                }
            });
        } else {
            alertContext.showError("Certificate Approval Failed.");
        }

        appContext.setIsTransactionRunning(false);
        setIsVerifying(false);
    }


    let contentStyle = {
        // textOverflow: "ellipsis",
        // whiteSpace: "nowrap",
        // overflow: "hidden"
    };

    return (
        <Container>
            {
                isLoading ?
                    <Row className='justify-content-center align-content-center'>
                        <Spinner animation="grow" variant="primary" role="status" />
                    </Row>
                    : <>
                        <Row className='justify-content-center m-4'>
                            {
                                <Image src={certificate.imgUrl} height="600px"></Image>
                            }
                        </Row>
                        <Row className='justify-content-center'>
                            <h2 style={{ fontWeight: "bold", color: "blue" }}>Certificate Details</h2>
                        </Row>

                        <Card style={{ boxShadow: " 0 10px 10px rgba(0, 0, 0, 0.2)", margin: "20px" }}>
                            {/* Approval Button */}
                            {
                                (certificate.status == 'Unverified' && appContext.accountType == 'Institute') &&
                                <Card.Header>
                                    <Row>
                                        <Col md={{ span: 3, offset: 9 }}>
                                            <LoadingButton variant='success' isloading={isVerifying} onClick={verifyCertificate}>
                                                Approve Certificate
                                    </LoadingButton>
                                        </Col>
                                    </Row>
                                </Card.Header>
                            }
                            <Card.Body>
                                <Container>
                                    <Row>
                                        {/* Visibility */}
                                        <Col lg className="mb-3">
                                            {
                                                isChangingVisibility ?
                                                    <Spinner animation="grow" variant="primary" role="status" />
                                                    : <div style={{ cursor: 'pointer' }} onClick={changeVisibility}>
                                                        Visibility: {certificate.visibility == 'Public' ? <FaEye /> : <FaEyeSlash />}
                                                    </div>
                                            }
                                        </Col>
                                        {/* Status */}
                                        <Col lg='auto' className='ml-auto mb-3'>
                                            <FaExclamationCircle className='mb-1' /> Status: <h4 style={{ display: "inline" }}>
                                                {
                                                    certificate?.status == 'Verified' ?
                                                        <Badge variant="success">Verified</Badge>
                                                        : <Badge variant="warning">Unverified</Badge>
                                                }
                                            </h4>
                                        </Col>
                                    </Row>
                                    {/* Certificate Name */}
                                    <Row xs='auto' className='mt-3'>
                                        <Col md={4} style={titleStyle}>
                                            Certificate Name:
                                        </Col>
                                        <Col style={contentStyle}>
                                            {certificate?.name}
                                        </Col>
                                    </Row>
                                    {/* Description */}
                                    <Row xs='auto' className='mt-3'>
                                        <Col md={4} style={titleStyle}>
                                            Description:
                                        </Col>
                                        <Col style={contentStyle}>
                                            {certificate?.description}
                                        </Col>
                                    </Row>

                                    {/* Transaction Hash */}
                                    <Row xs='auto' className='mt-3'>
                                        <Col md={4} style={titleStyle}>
                                            Transaction Hash:
                                         </Col>
                                        <Col style={contentStyle}>
                                            <a target='_blank' href={`https://ropsten.etherscan.io/tx/${certificate?.transactionHash}`}>{certificate?.transactionHash}</a>
                                        </Col>
                                    </Row>

                                    {/* IPFS Hash*/}
                                    <Row xs='auto' className='mt-3'>
                                        <Col md={4} style={titleStyle}>
                                            IPFS Hash:
                                        </Col>
                                        <Col style={contentStyle}>
                                            <a target='_blank' href={certificate.imgUrl}>{certificate?.ipfsHash}</a>
                                        </Col>
                                    </Row>
                                </Container>
                            </Card.Body>
                        </Card>
                    </>
            }

        </Container >
    )
}
