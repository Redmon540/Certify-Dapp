import React from 'react';
import { Table, Badge } from 'react-bootstrap';
import { FaChevronCircleRight, FaExclamationCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { v4 as guid } from 'uuid';

export const CertficateDetailsList = ({ certificates }) => {
    return (
        <Table responsive style={{ margin: 0 }}>
            <thead>
                <tr style={{ background: '#0384fc', color: 'white' }}>
                    <th></th>
                    <th>Certificate Name</th>
                    <th>Description </th>
                    <th>Status </th>
                </tr>
            </thead>
            <tbody>
                {
                    certificates?.map(c =>
                        <tr key={c.key} style={{ background: '#b8dcff' }}>
                            <td>
                                <FaChevronCircleRight />
                            </td>
                            <td >
                                {/* Name */}
                                <Link to={`/certificate_details/${c.key}`}>{c.name}</Link>
                            </td>
                            <td >
                                {/* Description */}
                                {c.description}
                            </td>
                            <td>
                                {/* Status */}
                                {
                                    c.status == 'Verified' ?
                                        <Badge variant="success">Verified</Badge>
                                        : <Badge variant="warning">Unverified</Badge>
                                }
                            </td>
                        </tr>
                    )
                }
            </tbody>

        </Table>
    )
}
