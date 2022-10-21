import React, { useState } from 'react'
import { Form, Col, Row, Container, Image } from 'react-bootstrap';
import { Formik, Field } from "formik";
import * as yup from 'yup';
import { useAppContext } from '../../../../context_providers/app_context';
import { useAlertContext } from '../../../../context_providers/alert_context';
import * as dbService from '../../../../services/firebase/databaseService';
import * as storageService from '../../../../services/firebase/storageService';
import { LoadingButton } from '../../../components/loading_button/loading_button';

export const EditProfile = () => {
    const { user, setUser, accountType } = useAppContext();
    const alertContext = useAlertContext();

    const [file, setFile] = useState(null);

    const selectFileHandler = e => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    }

    const validationSchema = yup.object({
        name: yup.string().required()
    });

    return (
        <Container>
            <Container>
                <Row className="justify-content-center">
                    <Col xs='auto' className='mt-5'>
                        <Image src=
                            {
                                file ? URL.createObjectURL(file) :
                                    user.imgUrl ?
                                        user.imgUrl
                                        : "https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png"
                            }
                            roundedCircle
                            height='200px'
                            width='200px' />
                    </Col>
                </Row>

            </Container>
            <Formik
                initialValues={user}
                validationSchema={validationSchema}
                onSubmit={async (data, { setSubmitting }) => {
                    setSubmitting(true);
                    let imgUrl = null;
                    if (file) {
                        //upload new profile pic (previous file will be override)
                        imgUrl = await storageService.uploadProfilePic(file, user.address);
                    }
                    let userInfo;
                    //addUser can also update user because it just overrides the data
                    await dbService.setUser(user.address,
                        {
                            ...user,
                            name: data.name,
                            imgUrl: imgUrl ? imgUrl : user.imgUrl ? user.imgUrl : ''
                        });
                    userInfo = await dbService.getUserByEmail(user.email);
                    setUser(userInfo);
                    alertContext.showSuccess("Changes Saved Successfully.");
                    setSubmitting(false);
                }}

            >
                {
                    ({ handleSubmit, errors, touched, isSubmitting }) => (

                        <Form onSubmit={handleSubmit}>
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

                            {/* Name */}
                            <Form.Group as={Row} controlId="name">
                                <Form.Label column sm="2">Name</Form.Label>
                                <Col sm="10">
                                    <Field as={Form.Control} type="text" name='name' isInvalid={touched.name && !!errors.name} />
                                    <Form.Control.Feedback type='invalid'>{errors.name}</Form.Control.Feedback>
                                </Col>
                            </Form.Group>

                            {/* Email */}
                            <Form.Group as={Row} controlId="email">
                                <Form.Label column sm="2">Email</Form.Label>
                                <Col sm="10">
                                    <Form.Control type="text" disabled placeholder={user.email} />
                                </Col>
                            </Form.Group>

                            {/* Account Address */}
                            <Form.Group as={Row} controlId="account">
                                <Form.Label column sm="2">Account Address</Form.Label>
                                <Col sm="10">
                                    <Form.Control type="text" disabled placeholder={user.address} />
                                </Col>
                            </Form.Group>

                            {/* Save */}
                            <Row className='justify-content-end align-items-end my-4'>
                                <Col md='auto'>
                                    <LoadingButton type='submit'
                                        className='px-5'
                                        isloading={isSubmitting}>Save</LoadingButton>
                                </Col>
                            </Row>


                        </Form>)
                }
            </Formik>
        </Container >
    );
}
