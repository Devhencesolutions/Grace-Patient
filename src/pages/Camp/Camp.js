import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Row, Tabs, Tab } from "react-bootstrap";
import axios from "axios";

import placeholderimage from "../../assets/images/coming-soon-img.png";
import Doctordetails from "./Doctordetails";

function Camping() {
    const [camp, setCamp] = useState([]);
    const [upcomingcamps, setupcomingcapms] = useState([]);
    const [joinedCamps, setJoinedCamps] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showDoctorModal, setShowDoctorModal] = useState(false);

    useEffect(() => {
        const fetchcompletedcamps = async () => {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/auth/list-by-params/listCompletedCampsByParams`,
                    {
                        skip: 0,
                        per_page: 1000,
                        sorton: "Date",
                        sortdir: "desc",
                        match: "",
                        IsActive: true,
                    }
                );
                 setCamp(response[0].data);
            } catch (error) {
                console.error("Error fetching completed camps:", error);
            }
        };

        const fetchupcomingcamps = async () => {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/auth/list-by-params/listUpcomingCampsByParams`,
                    {
                        skip: 0,
                        per_page: 1000,
                        sorton: "Date",
                        sortdir: "desc",
                        match: "",
                        IsActive: true,
                    }
                );
                setupcomingcapms(response[0].data);
            } catch (error) {
                console.error("Error fetching upcoming camps:", error);
            }
        };

        const Email = localStorage.getItem("Email Id");
        const fetchJoinedCamps = async () => {
            try {
                const response = await axios.post(
                    `${process.env.REACT_APP_API_URL}/api/auth/list-by-params/listCampsByPatientParams`,
                    {
                        skip: 0,
                        per_page: 1000,
                        sorton: "Date",
                        sortdir: "desc",
                        match: "",
                        IsActive: true,
                        Email: Email,
                    }
                );
                setJoinedCamps(response[0].data);
            } catch (error) {
                console.error("Error fetching joined camps:", error);
            }
        };

        fetchcompletedcamps();
        fetchupcomingcamps();
        fetchJoinedCamps();
    }, []);

    const handleDoctorClick = (doctorId) => {
        setSelectedDoctor(doctorId);
        setShowDoctorModal(true);
    };

    const handleCloseDoctorModal = () => {
        setShowDoctorModal(false);
        setSelectedDoctor(null);
    };

    return (
        <div style={{ padding: "20px", backgroundColor: "#f8f9fa" }}>
            <h1 style={{ textAlign: "center", marginBottom: "40px" }}>Camping Events</h1>

            <Tabs defaultActiveKey="completed" id="camping-tabs" className="mb-3">
                {/* Completed Camps Tab */}
                <Tab eventKey="completed" title="Completed Camps">
                    <Row>
                        {Array.isArray(camp) && camp.length > 0 ? (
                            camp.map((camping) => (
                                <Col key={camping._id} lg={4} className="mb-4">
                                    <Card
                                        style={{
                                            width: '100%',
                                            maxHeight: '550px',
                                            minHeight: '550px',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        }}
                                        className="camping-card"
                                    >
                                        <Card.Img
                                            className="card-image-camping"
                                            variant="top"
                                            src={`${process.env.REACT_APP_API_URL_GRACELAB}/${camping.Photo}`}
                                            alt={camping.title}
                                            onError={(e) => {
                                                e.target.src = placeholderimage;
                                            }}
                                            style={{ borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}
                                        />
                                        <Card.Body className="card-body-camping">
                                            <Card.Title className="mb-3">{camping.title}</Card.Title>
                                            <p>
                                                <strong style={{ fontSize: '1rem', fontWeight: '600' }}>Camp Venue:</strong> {camping.CampVenueDetails?.Society || 'N/A'}
                                            </p>
                                            <p>
                                                <strong style={{ fontSize: '1rem', fontWeight: '600' }}>Date:</strong> {camping.Date ? new Date(camping.Date).toLocaleDateString() : 'N/A'}
                                            </p>
                                            <Card.Text style={{ marginBottom: '1rem' }}>
                                                <strong>Description:</strong> {camping.Descreption}
                                            </Card.Text>
                                            <Card.Text>
                                                <small
                                                    style={{
                                                        fontWeight: '600',
                                                        fontSize: '0.875rem',
                                                    }}
                                                >
                                                    No Of Patients: {camping.NoOfPatients}
                                                </small>
                                            </Card.Text>
                                            <Card.Text>
                                                <strong>Doctors</strong>
                                                <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc' }}>
                                                    {camping.DoctorsDetails?.map((doctor) => (
                                                        <li key={doctor._id} onClick={() => handleDoctorClick(doctor._id)}>
                                                            {doctor.DoctorName}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <p>No camping data available</p>
                        )}
                    </Row>
                </Tab>

                {/* Upcoming Camps Tab */}
                <Tab eventKey="upcoming" title="Upcoming Camps">
                    <Row>
                        {Array.isArray(upcomingcamps) && upcomingcamps.length > 0 ? (
                            upcomingcamps.map((camping) => (
                                <Col key={camping._id} lg={4} className="mb-4">
                                    <Card style={{ height: "94%" }}>
                                        <Card.Img
                                            variant="top"
                                            src={`${process.env.REACT_APP_API_URL}/${camping.Photo}`}
                                            alt={camping.title}
                                            onError={(e) => {
                                                e.target.src = placeholderimage;
                                            }}
                                            style={{ objectFit: "cover", height: "250px" }}
                                        />
                                        <Card.Body>
                                            <p><strong>Camp Venue: </strong>{camping.CampVenueDetails?.Society || ""}</p>
                                            <p><strong>Date: </strong>{camping.Date ? new Date(camping.Date).toLocaleDateString() : ""}</p>
                                            <Card.Text>Camp Desc: {camping.Descreption}</Card.Text>
                                            <p><strong>No Of Patients: </strong>{camping.NoOfPatients}</p>
                                            <p>
                                                <strong>Doctors: </strong>
                                                <ul>
                                                    {camping.DoctorsDetails?.map((doctor) => (
                                                        <li key={doctor._id} onClick={() => handleDoctorClick(doctor._id)}>
                                                            {doctor.DoctorName}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </p>
                                        </Card.Body>
                                        <div className="p-3 d-flex justify-content-end">
          <Link
            to="https://gracemedicalservices.in/patient-inquiry"
            target="_blank"
            className="btn btn-primary"
            style={{
              borderRadius: '10px', // Adds rounded corners to the button
              padding:10,
              fontSize: '1rem',     // Sets font size
              
            }}
          >
            Register
          </Link>
        </div>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <p>No upcoming camps available</p>
                        )}
                    </Row>
                </Tab>

                {/* Joined Camps Tab */}
                <Tab eventKey="joined" title="Joined Camps">
                    <Row>
                        {Array.isArray(joinedCamps) && joinedCamps.length > 0 ? (
                            joinedCamps.map((camping) => (
                                <Col key={camping._id} lg={4} className="mb-4">
                                    <Card style={{ height: "94%" }}>
                                        <Card.Img
                                            variant="top"
                                            src={`${process.env.REACT_APP_API_URL}/${camping.Photo}`}
                                            alt={camping.title}
                                            onError={(e) => {
                                                e.target.src = placeholderimage;
                                            }}
                                            style={{ objectFit: "cover", height: "250px" }}
                                        />
                                        <Card.Body>
                                            <p><strong>Camp Venue: </strong>{camping.CampVenueDetails?.Society || ""}</p>
                                            <p><strong>Date: </strong>{camping.Date ? new Date(camping.Date).toLocaleDateString() : ""}</p>
                                            <Card.Text>Camp Desc: {camping.Descreption}</Card.Text>
                                            <p><strong>No Of Patients: </strong>{camping.NoOfPatients}</p>
                                            <p>
                                                <strong>Doctors: </strong>
                                                <ul>
                                                    {camping.DoctorsDetails?.map((doctor) => (
                                                        <li key={doctor._id} onClick={() => handleDoctorClick(doctor._id)}>
                                                            {doctor.DoctorName}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </p>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))
                        ) : (
                            <p>No joined camps available</p>
                        )}
                    </Row>
                </Tab>
            </Tabs>

            {/* Doctor Details Modal */}
            {showDoctorModal && (
                <Doctordetails
                    doctorId={selectedDoctor}
                    show={showDoctorModal}
                    handleClose={handleCloseDoctorModal}
                />
            )}
        </div>
    );
}

export default Camping;
