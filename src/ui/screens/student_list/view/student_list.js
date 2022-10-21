import React, { useState, useEffect } from 'react';
import { Container, Table, Row, Spinner } from 'react-bootstrap';
import { StudentListItem } from '../components/student_list_item';
import * as dbService from '../../../../services/firebase/databaseService';
import { useAppContext } from '../../../../context_providers/app_context';

export const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const appContext = useAppContext();

    const loadStudents = async () => {
        setIsLoading(true);

        var data = await dbService.getAllStudents(appContext.user.address);
        if (data) {
            const values = Object.values(data);
            setStudents(values);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        loadStudents();
    }, [])

    return (
        <Container>
            <Row className='justify-content-center my-3'>
                <h2 style={{ fontWeight: "bold", color: "blue" }}>Students</h2>
            </Row>
            {
                isLoading ?
                    <Row className='justify-content-center align-content-center'>
                        <Spinner animation="grow" variant="primary" role="status" />
                    </Row>
                    : students.length == 0 ?
                        <h4>No Students found</h4>
                        : <Table responsive hover striped bordered style={{ boxShadow: '0 10px 10px rgba(0, 0, 0, 0.2)' }}>
                            {
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>S.No.</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Address</th>
                                    </tr>
                                </thead>
                            }
                            <tbody>
                                {
                                    students?.map((s, i) => <StudentListItem key={s.address} id={i + 1} student={s} />)
                                }
                            </tbody>
                        </Table>
            }
        </Container>
    )
}
