import React, { useState, useEffect } from 'react';
import { Form, Card, FormControl, Spinner, Container, Row, Col } from 'react-bootstrap';
import { LoadingButton } from '../../../components/loading_button/loading_button';
import { useHistory } from 'react-router-dom';
import { useRegistrationContext } from '../../../../context_providers/registration_context';
import { useAppContext } from '../../../../context_providers/app_context';
import { useAlertContext } from '../../../../context_providers/alert_context';
import * as yup from 'yup';
import { Formik, Field } from "formik";
import * as dbService from '../../../../services/firebase/databaseService';
import * as ethService from '../../../../services/ethereum/ethService';

export const RegistrationForm = () => {

    const [isLoading, setIsLoading] = useState(false);
    const [options, setOptions] = useState(null);
    const [defaultInstitute, setDefaultInstitute] = useState('');
    const alertContext = useAlertContext();

    const loadInstitutes = async () => {
        setIsLoading(true);
        let data = await dbService.getAllInstitutes();
        if (data) {
            let keys = Object.keys(data);
            let values = Object.values(data);
            setDefaultInstitute(values[0].address);
            let option = keys.map((k, i) => <option value={values[i].address}>{values[i].name}</option>);
            setOptions(option);
        }
        setIsLoading(false);
    }

    const history = useHistory();
    const appContext = useAppContext();
    const { currentUserAccount, accountType, setAccountType } = appContext;
    const { authenticateAsync, isAuthenticating, isSignUp, setIsSignUp } = useRegistrationContext();

    const validationSchema = yup.object({
        name: isSignUp ? yup.string().required('Name is required.') : null,
        email: yup.string().required('Email is required.').email(),
        password: yup.string().required('Password is Required'),
        instituteAddress: (accountType == 'Student' && isSignUp) ? yup.string().required('Institute is required.') : null
    });

    useEffect(() => {
        if (isSignUp) {
            loadInstitutes();
        }
    }, [isSignUp])

    const registerUser = async (data) => {
        let wasSuccess = await authenticateAsync(isSignUp, data.name, data.email, data.password, data.instituteAddress);
        if (wasSuccess) {
            if (isSignUp)
                alertContext.showSuccess("Account Created Successfully");
            history.push('/');
        } else {
            alertContext.showError("Account Sign up Failed");
        }
    }

    return (
        isLoading ?
            <Card>
                <Container className='text-center'>
                    <Row>
                        <Col>
                            <h3><Spinner animation="grow" variant="primary" role="status" /></h3>
                        </Col>
                    </Row>
                </Container>
            </Card>
            :
            < Card style={{ boxShadow: '0 10px 10px rgba(0, 0, 0, 0.2)' }
            } className='my-5' border='light' >
                <Card.Body>
                    <h1 className='my-3'>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
                    <Formik initialValues={{
                        name: '',
                        email: '',
                        password: '',
                        instituteAddress: defaultInstitute
                    }}
                        validationSchema={validationSchema}
                        onSubmit={async (data) => {
                            await registerUser(data);
                        }}>
                        {({ handleSubmit, handleChange, errors, touched, values }) => (
                            <Form onSubmit={handleSubmit}>
                                {/* Account Type */}
                                {
                                    isSignUp &&
                                    <Form.Control as="select" value={accountType}
                                        onChange={(e) => setAccountType(e.target.value)} className='my-2'>
                                        <option>Student</option>
                                        <option>Institute</option>
                                    </Form.Control>
                                }
                                {/* Institute */}
                                {
                                    (accountType == 'Student' && !isLoading && isSignUp && defaultInstitute) &&
                                    <Form.Group controlId="instituteAddress">
                                        <Form.Label>Institute</Form.Label>
                                        <Form.Control as="select" name='instituteAddress'
                                            isInvalid={touched.instituteAddress && !!errors.instituteAddress} className='my-2'
                                            onChange={handleChange}>
                                            {options}
                                        </Form.Control>
                                        <Form.Control.Feedback type='invalid'>{errors.instituteAddress}</Form.Control.Feedback>
                                    </Form.Group>
                                }
                                {
                                    isSignUp &&
                                    // Name
                                    <Form.Group controlId="name">
                                        <Form.Label>Name</Form.Label>
                                        <Field as={Form.Control} type="text" name='name' isInvalid={touched.name && !!errors.name} />
                                        <Form.Control.Feedback type='invalid'>{errors.name}</Form.Control.Feedback>
                                    </Form.Group>
                                }

                                {/* Email */}
                                <Form.Group controlId="email">
                                    <Form.Label>Email Address</Form.Label>
                                    <Field as={Form.Control} type="text" name='email' isInvalid={touched.email && !!errors.email} />
                                    <Form.Control.Feedback type='invalid'>{errors.email}</Form.Control.Feedback>
                                </Form.Group>

                                {/* Password */}
                                <Form.Group controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Field as={Form.Control} type="password" name='password' isInvalid={touched.password && !!errors.password} />
                                    <Form.Control.Feedback type='invalid'>{errors.password}</Form.Control.Feedback>
                                </Form.Group>

                                {/* Sign in */}
                                <LoadingButton isloading={isAuthenticating} type='submit'>
                                    {isSignUp ? 'Sign Up' : 'Sign In'}
                                </LoadingButton>
                                {
                                    isSignUp &&
                                    <div>
                                        <p>NOTE: This metamask account address will be linked to your account permanently and you cannot change it later!</p>
                                        <p>Selected Account: <b>{currentUserAccount}</b></p>
                                    </div>
                                }

                                {/* Sign in/up toggle */}
                                <div style={{ textDecoration: 'none', marginTop: '10px' }}>
                                    <a style={{ textDecoration: 'none' }}
                                        className='text-align-center mt-5'
                                        onClick={() => setIsSignUp(!isSignUp)}
                                        href="#">{isSignUp ? 'Already have an account? Sign In!' : "Don't have an account? Sign Up Now!"}</a>
                                </div>

                            </Form>
                        )}
                    </Formik>

                </Card.Body>

            </Card >
    )
}
