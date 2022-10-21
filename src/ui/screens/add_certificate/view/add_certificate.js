import React, { useEffect, useState } from 'react'
import { Formik, Field } from "formik";
import { useHistory } from 'react-router-dom';
import { Container, Form, Col, Row, Image } from 'react-bootstrap';
import { LoadingButton } from '../../../components/loading_button/loading_button';
import { useAppContext } from '../../../../context_providers/app_context';
import { useAlertContext } from '../../../../context_providers/alert_context';
import * as dbService from '../../../../services/firebase/databaseService';
import * as storageService from '../../../../services/firebase/storageService';
import * as ipfsService from '../../../../services/ipfs/ipfsService';
import * as ethService from '../../../../services/ethereum/ethService';
import * as yup from 'yup';
import { v4 as guid } from 'uuid';
import certificateLogo from '../../../../assets/certificate.png';

export const AddCertificate = () => {
    const appContext = useAppContext();
    const alertContext = useAlertContext();
    const history = useHistory();
    const [file, setFile] = useState(null);

    const selectFileHandler = e => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    }

    const validationSchema = yup.object({
        name: yup.string().required('Certificate Name is Required'),
        description: yup.string().required('Description is required'),
        studentAddress: appContext.accountType == 'Institute' ? yup.string().required('Student Address is required') : null
    });

    const addCertificate = async (data) => {
        if (!file) {
            alertContext.showError("Please select certificate");
            return;
        }
        if (appContext.accountType == "Student") {
            //upload new profile pic (previous file will be override)
            const imgUrl = await storageService.uploadProfilePic(file, guid());
            await dbService.setCertificate(guid(), {
                name: data.name,
                imgUrl: imgUrl,
                description: data.description,
                status: "Unverified",
                visibility: "Public",
                studentAddress: appContext.user.address,
                instituteAddress: appContext.user.instituteAddress
            });
            alertContext.showSuccess("Certificate Added Successfully. Waiting for approval.");
            history.push('/pending_approvals');
        }
        else {
            appContext.setIsTransactionRunning(true);
            const hash = await ipfsService.uploadFile(file);
            const key = guid();
            const tx = await ethService.addCertificate(appContext.user.contractAddress, data.studentAddress, hash);
            if (tx) {

                await dbService.setCertificate(key, {
                    name: data.name,
                    imgUrl: ipfsService.ipfsGateway + hash,
                    ipfsHash: hash,
                    transactionHash: tx,
                    description: data.description,
                    status: "Verified",
                    visibility: "Public",
                    studentAddress: data.studentAddress,
                    instituteAddress: appContext.user.address
                });
                alertContext.showSuccess("Certificate Added Successfully.");
                appContext.setIsTransactionRunning(false);
                history.push(`/certificate_details/${key}`);
            }
            else {
                alertContext.showError("Certificate Approval Failed.");
                appContext.setIsTransactionRunning(false);
            }
        }
    }

    return (
        <Container>
            <h1 className='my-4 text-center' style={{ fontWeight: 'bold' }}>Add Certificate</h1>
            <Row className="justify-content-center">
                <Col xs='auto'>
                    <Image src=
                        {
                            file ? URL.createObjectURL(file) : certificateLogo
                        }
                        height='300px'
                    />
                </Col>
            </Row>
            <Formik
                initialValues={{
                    title: '',
                    description: '',
                }}
                validationSchema={validationSchema}
                onSubmit={async (data) => {
                    await addCertificate(data);
                }}
            >
                {({ handleSubmit, handleChange, errors, values, touched, isSubmitting }) => (
                    <Form onSubmit={handleSubmit}>
                        {/* Image */}
                        <Form.Group as={Row} controlid="image">
                            <Col xs='auto' className='mx-auto mt-2 mb-5'>
                                <Form.File
                                    onChange={selectFileHandler}
                                    id="custom-file-translate-scss"
                                    data-browse='Select Image'
                                    label={file ? file.name : ''}
                                    lang="en"
                                    custom
                                />
                            </Col>
                        </Form.Group>

                        {/* Student Address */}
                        {
                            appContext.accountType == 'Institute' &&
                            <Form.Group controlId="name">
                                <Form.Label>Student Address</Form.Label>
                                <Field as={Form.Control} type="text" name='studentAddress'
                                    isInvalid={touched.studentAddress && !!errors.studentAddress} />
                                <Form.Control.Feedback type='invalid'>{errors.studentAddress}</Form.Control.Feedback>
                            </Form.Group>
                        }

                        {/* Certificate Name */}
                        <Form.Group controlId="name">
                            <Form.Label>Certificate Name</Form.Label>
                            <Field as={Form.Control} type="text" name='name' isInvalid={touched.name && !!errors.name} />
                            <Form.Control.Feedback type='invalid'>{errors.name}</Form.Control.Feedback>
                        </Form.Group>

                        {/* Description */}
                        <Form.Group controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows="4" value={values.description} onChange={handleChange}
                                name='description' isInvalid={touched.description && !!errors.description} />
                            <Form.Control.Feedback type='invalid'>{errors.description}</Form.Control.Feedback>
                        </Form.Group>

                        <Row className='justify-content-end align-items-end my-4'>
                            {/* {
                                isCreating &&
                                <Col>
                                    <Alert style={{ marginBottom: '0' }} variant='warning'>Please wait while transaction is in progress...</Alert>
                                </Col>
                            } */}
                            <Col md="auto" >
                                <LoadingButton isloading={isSubmitting} type='submit' className='px-5'>
                                    Add Certificate
                                </LoadingButton>
                            </Col>
                        </Row>

                    </Form>
                )}
            </Formik>
        </Container >
    );
}
