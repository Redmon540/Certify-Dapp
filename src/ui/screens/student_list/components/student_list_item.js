import React, { useState, useEffect } from 'react';
import { Button, Spinner, Row } from 'react-bootstrap';
import { FaEye, FaMinus, FaPlus } from 'react-icons/fa';
import { CertficateDetailsList } from '../components/certficate_details_list';
import * as dbService from '../../../../services/firebase/databaseService';

export const StudentListItem = ({ student, id }) => {
    const [showDetails, setShowDetails] = useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [certificates, setCertificates] = useState([]);

    const loadDetails = async () => {
        if (showDetails) {
            setShowDetails(false);
            return;
        }

        setIsLoadingDetails(true);

        const data = await dbService.getStudentCertificates(student.address);
        if (data) {
            const keys = Object.keys(data);
            const values = Object.values(data);
            const docs = values.map((v, i) => {
                return {
                    ...v,
                    key: keys[i]
                }
            });
            setCertificates(docs);
        }

        setShowDetails(true);
        setIsLoadingDetails(false);
    }

    return (
        <React.Fragment>
            < tr >
                {/* Details */}
                < td >
                    <Button size='sm' onClick={() => loadDetails()}>
                        {
                            isLoadingDetails ?
                                <Spinner animation="grow" variant="light" role="status" />
                                : showDetails ? <FaMinus /> : <FaPlus />
                        }
                    </Button>
                </td>

                {/* S.No */}
                <td>
                    {id}
                </td>

                {/* Name */}
                <td>
                    {student.name}
                </td>
                {/* Email */}
                <td>
                    {student.email}
                </td>
                {/* Address */}
                <td>
                    <a target='_blank' href={`https://ropsten.etherscan.io/address/${student.address}`}>{student.address}</a>
                </td>

            </tr>
            {
                showDetails &&
                <tr>
                    <td></td>
                    <td colSpan='4' >
                        <CertficateDetailsList certificates={certificates} />
                    </td>
                </tr>
            }
        </React.Fragment >
    )
}
