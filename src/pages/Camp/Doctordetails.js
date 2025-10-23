import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Row, Col, Table } from 'react-bootstrap';
import placeholder from "../../assets/images/coming-soon-img.png"

function Doctordetails({ doctorId, show, handleClose }) {
    const [doctorDetails, setDoctorDetails] = useState(null);

    useEffect(() => {
        if (doctorId) {
            const fetchDoctorDetails = async () => {
                try {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL_GRACELAB}/api/auth/getDoctorDetails/${doctorId}`);
                    setDoctorDetails(response.data);
                } catch (error) {
                    console.error("Error fetching doctor details:", error);
                }
            };

            fetchDoctorDetails();
        }
    }, [doctorId]);

    if (!doctorDetails) return null;

    const opdTimes = [
        { day: doctorDetails.DaysDoctor1?.Days || 'N/A', start: doctorDetails.OPD1StartTime || 'N/A', end: doctorDetails.OPD1EndTime || 'N/A' },
        { day: doctorDetails.DaysDoctor2?.Days || 'N/A', start: doctorDetails.OPD2StartTime || 'N/A', end: doctorDetails.OPD2EndTime || 'N/A' },
        { day: doctorDetails.DaysDoctor3?.Days || 'N/A', start: doctorDetails.OPD3StartTime || 'N/A', end: doctorDetails.OPD3EndTime || 'N/A' },
    ];

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>{doctorDetails.DoctorName}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col md={4} className="text-center">
                        <img
                            src={`${process.env.REACT_APP_API_URL_GRACELAB}/${doctorDetails.Doctorphoto}`}
                            alt="Doctor"
                            className="img-fluid rounded"
                            onError={(e) => { e.target.src = placeholder; }}
                            style={{ maxWidth: '100%', height: 'auto' }}
                        />
                        {doctorDetails.OPD1StartTime && doctorDetails.OPD1EndTime && (
                            <Table striped bordered hover className="mt-3">
                                <thead>
                                    <tr>
                                        <th>Day</th>
                                        <th>Start Time</th>
                                        <th>End Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {opdTimes.map((time, index) => (
                                        <tr key={index}>
                                            <td>{time.day}</td>
                                            <td>{time.start}</td>
                                            <td>{time.end}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Col>
                    <Col md={8}>
                        <h5 className="mb-3">{doctorDetails.ClinicName}</h5>
                        {doctorDetails.DoctorLicenseNumber && <p><strong>License Number:</strong> {doctorDetails.DoctorLicenseNumber}</p>}
                        {doctorDetails.Speciality?.Speciality && <p><strong>Speciality:</strong> {doctorDetails.Speciality.Speciality}</p>}
                        {doctorDetails.EmailPersonal && <p><strong>Email:</strong> {doctorDetails.EmailPersonal}</p>}
                        {doctorDetails.mobileNumber && <p><strong>Phone:</strong> {doctorDetails.mobileNumber}</p>}
                        {doctorDetails.address && <p><strong>Address:</strong> {doctorDetails.address}</p>}
                        {doctorDetails.DoctorRegistrationDate && <p><strong>Registration Date:</strong> {doctorDetails.DoctorRegistrationDate}</p>}
                        {doctorDetails.website && <p><strong>Website:</strong> <a href={doctorDetails.website} target="_blank" rel="noopener noreferrer">{doctorDetails.website}</a></p>}
                        {doctorDetails.Location && <p><strong>Location:</strong> <a href={doctorDetails.Location} target="_blank" rel="noopener noreferrer">View on Google Maps</a></p>}
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Doctordetails;
