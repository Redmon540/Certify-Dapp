import React from 'react';
import { Image, Row, Col } from 'react-bootstrap';
import { useAppContext } from '../../../../context_providers/app_context';
import { useRegistrationContext } from '../../../../context_providers/registration_context';
import student from '../../../../assets/student.png';
import institute from '../../../../assets/institute.png';

export const AccountTypeImage = () => {
    const { accountType } = useAppContext();
    const { isSignUp } = useRegistrationContext();
    return (
        !isSignUp ?
            <Row>
                <Col>
                    <Image src={student} height='250px' />
                </Col>
                <Col>
                    <Image src={institute} height='250px' />
                </Col>
            </Row>
            : <Image src={accountType == 'Student' ? student : institute} height='400px' />
    );
}
