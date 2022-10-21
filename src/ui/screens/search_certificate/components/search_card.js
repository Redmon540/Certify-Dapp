import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAlertContext } from '../../../../context_providers/alert_context';
import * as dbService from '../../../../services/firebase/databaseService';
import * as yup from 'yup';
import { Formik, Field } from "formik";
import { Card,Form } from 'react-bootstrap';
import {LoadingButton} from '../../../components/loading_button/loading_button';

export const SearchCard = () => {

    const [isSearching, setIsSearching] = useState(false);
    const alertContext = useAlertContext();
    const history = useHistory();

    const validationSchema = yup.object({
        hash: yup.string().required('Hash is required.')
    });

    const search = async (data) => {
        setIsSearching(true);

        var certificateKey = await dbService.getCertificateByIpfsHash(data.hash);
        console.log(certificateKey)
        if (certificateKey) {
            setIsSearching(false);
            history.push(`certificate_details/${certificateKey}`);
        }
        else {
            alertContext.showWarning("Certificate Not Found!");
        }

        setIsSearching(false);
    }
    return (
        < Card style={{ boxShadow: '0 10px 10px rgba(0, 0, 0, 0.2)' }
        } className='mt-5' border='light' >
            <Card.Header>
                Search Certificate by IPFS Hash
            </Card.Header>
            <Card.Body>
                <Formik initialValues={{
                    hash: '',
                }}
                    validationSchema={validationSchema}
                    onSubmit={async (data) => {
                        await search(data);
                    }}>
                    {({ handleSubmit, handleChange, errors, touched, values }) => (
                        <Form onSubmit={handleSubmit}>
                            {/* IPFS Hash */}
                            <Form.Group controlId="hash">
                                <Form.Label>IPFS Hash</Form.Label>
                                <Field as={Form.Control} type="text" name='hash' isInvalid={touched.hash && !!errors.hash} />
                                <Form.Control.Feedback type='invalid'>{errors.hash}</Form.Control.Feedback>
                            </Form.Group>

                            {/* Search */}
                            <LoadingButton isloading={isSearching} type='submit'>
                                Search
                            </LoadingButton>

                        </Form>
                    )}
                </Formik>

            </Card.Body>

        </Card >
    )
}
