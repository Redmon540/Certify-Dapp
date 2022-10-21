import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import { AccountTypeImage } from '../components/account_type_image';
import { RegistrationForm } from '../components/registration_form';
import RegistrationContextProvider from '../../../../context_providers/registration_context';

export const UserRegistration = () => {
    return (
        <RegistrationContextProvider>
            <Container >
                <Row className='vh-100 justify-content-center' >
                    <Col className='my-auto mx-2'>
                        <AccountTypeImage />
                    </Col>
                    <Col className='my-auto mx-2' lg='5' md='7'>
                        <RegistrationForm />
                    </Col>
                </Row>
            </Container >
        </RegistrationContextProvider>
    );
}