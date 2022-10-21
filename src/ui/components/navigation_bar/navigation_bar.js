import React from "react";
import { Navbar, Nav, Image, NavDropdown, Spinner, Badge, Row, Col } from "react-bootstrap";
import { Link } from 'react-router-dom';
import { v4 as guid } from 'uuid';
import { useAppContext } from "../../../context_providers/app_context";
import profileLogo from '../../../assets/profile.png';

export const NavigationBar = () => {
    const appContext = useAppContext();

    let authenticatedNavLinks = [];
    if (appContext.isAuthenticated && appContext.accountType == 'Student') {
        authenticatedNavLinks = [
            < Nav.Link key={guid()} className='mx-3' as={Link} to='/' href='#home' > Dashboard</Nav.Link >,
            < Nav.Link key={guid()} className='mx-3' as={Link} to='/add_certificate' href='#add_certificate' > Upload Certificate</Nav.Link >,
            < Nav.Link key={guid()} className='mx-3' as={Link} to='/pending_approvals' href='#pending_approvals' > Pending Approvals</Nav.Link >
        ];
    }
    if (appContext.isAuthenticated && appContext.accountType == 'Institute') {
        authenticatedNavLinks = [
            < Nav.Link key={guid()} className='mx-3' as={Link} to='/' href='#home' > Dashboard</Nav.Link >,
            < Nav.Link key={guid()} className='mx-3' as={Link} to='/add_certificate' href='#add_certificate' > Assign Certificates</Nav.Link >,
            < Nav.Link key={guid()} className='mx-3' as={Link} to='/all_certificates' href='#all_certificate' > All Certificates</Nav.Link >,
            < Nav.Link key={guid()} className='mx-3' as={Link} to='/students' href='#students' > All Students</Nav.Link >,
            < Nav.Link key={guid()} className='mx-3' as={Link} to='/pending_approvals' href='#pending_approvals' > Pending Approvals</Nav.Link >
        ];
    }

    const search = < Nav.Link key={guid()} className='mx-3' as={Link} to='/search_certificate' href='#search_certificate' > Search</Nav.Link >;

    const signOutButton =
        <NavDropdown key={guid()} className='mx-3' alignRight
            title={
                <Image height='30px' width='30px' roundedCircle src={appContext.user?.imgUrl ? appContext.user.imgUrl : profileLogo}></Image>
            }
            id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} to='/edit_profile' href='#edit_profile'>Edit Profile</NavDropdown.Item>
            <NavDropdown.Item as={Link} href='#sign_out' onClick={() => appContext.signOut()}>Sign Out</NavDropdown.Item>
        </NavDropdown>;


    if (appContext.isAuthenticated) {
        authenticatedNavLinks.push(search);
        authenticatedNavLinks.push(signOutButton);
    }

    return (
        <div>
            <Navbar expand='lg' bg="primary" variant="dark" fixed>
                {/* Home Icon */}
                <Navbar.Brand style={{ fontWeight: 'bold' }} href="/">
                    {/* <Image width="30"
                        height="30"
                        className="d-inline-block align-top" src={logo} /> */}
                    <Row>
                        <Col>
                            De-Certify
                        </Col>
                        <Col>
                            {
                                appContext.isAuthenticated && appContext.accountType == 'Student' ?
                                    <Badge variant="success">Student</Badge>
                                    : appContext.isAuthenticated && appContext.accountType == 'Institute' ?
                                        <Badge variant="warning">Institute</Badge>
                                        : <div />
                            }
                        </Col>
                    </Row>
                </Navbar.Brand>

                {/* Toggler */}
                <Navbar.Toggle aria-controls='navbar-items' />
                <Navbar.Collapse id='navbar-items'>

                    <Nav className="ml-auto">

                        {
                            !appContext.isAuthenticated &&
                            search
                        }

                        {/* Authenticated Links */}
                        {authenticatedNavLinks}

                        {
                            appContext.isTransactionRunning &&
                            <Row>
                                <Col>
                                    <Spinner style={{ marginTop: '5px' }} animation="grow" variant="light" role="status" />
                                </Col>
                                <Col md='auto'>
                                    <Row className='justify-content-center align-content-center'
                                        style={{ color: 'white', fontWeight: 'bold', marginRight: '20px', marginTop: '10px' }}>
                                        Transaction is in progress...
                                </Row>
                                </Col>
                            </Row>
                        }
                    </Nav>

                </Navbar.Collapse>
            </Navbar>
        </div >
    );
}
