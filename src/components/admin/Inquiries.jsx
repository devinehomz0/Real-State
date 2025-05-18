import { useState } from 'react';
import "../styles/Inquiries.css";

function Inquiries() {
  const [inquiries] = useState([
    {
      id: 1,
      name: 'Emma Johnson',
      email: 'emma.johnson@example.com',
      phone: '(555) 123-4567',
      message: "I'm interested in scheduling a viewing for this property. Is it available this weekend?",
      property: 'Modern Lakefront Villa',
      status: 'New',
      date: 'Mar 16, 2025, 08:00 PM'
    },
    {
      id: 2,
      name: 'Michael Chen',
      email: 'michael.chen@example.com',
      phone: '(555) 987-6543',
      message: 'Can you provide more information about the horse facilities? How many stalls are in the barn?',
      property: 'Countryside Ranch House',
      status: 'In Progress',
      date: 'Mar 15, 2025, 03:15 PM'
    },
    {
      id: 3,
      name: 'Sarah Miller',
      email: 'sarah.miller@example.com',
      phone: '(555) 456-7890',
      message: "I'd like to know more about the HOA fees and what amenities are included. Also, is parking available?",
      property: 'Downtown Luxury Apartment',
      status: 'Completed',
      date: 'Mar 14, 2025, 09:45 PM'
    }
  ]);

  return (
    <div className="inquiries">
      <div className="inquiries-header">
        <div>
          <h2>Inquiries</h2>
          <p>Manage customer inquiries</p>
        </div>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search inquiries..." />
        <select>
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="inquiries-grid">
        {inquiries.map(inquiry => (
          <div key={inquiry.id} className="inquiry-card">
            <div className="inquiry-header">
              <h3>{inquiry.name}</h3>
              <span className={`status-badge status-${inquiry.status.toLowerCase().replace(' ', '')}`}>
                {inquiry.status}
              </span>
            </div>
            <div className="inquiry-content">
              <p className="inquiry-contact">
                <span>{inquiry.email}</span>
                <span>{inquiry.phone}</span>
              </p>
              <div className="inquiry-message">
                <h4>Message</h4>
                <p>{inquiry.message}</p>
              </div>
              <div className="inquiry-property">
                <h4>Property</h4>
                <p>{inquiry.property}</p>
              </div>
              <div className="inquiry-footer">
                <span className="inquiry-date">{inquiry.date}</span>
                <button className="btn btn-primary">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Inquiries;