import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { SearchCard } from '../components/search_card';

export const SearchCertificate = () => {
    return (
        <Container >
            <Row className='justify-content-center' >
                <Col md={8}>
                    <SearchCard />
                </Col>
            </Row>
        </Container >
    )
}
