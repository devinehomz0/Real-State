import { useState } from 'react';
import './LeadCapture.css';

const LeadCapture = () => {
  const [formData, setFormData] = useState({
    inquiryType: '',
    userType: '',
    firstName: '',
    lastName: '',
    email: '',
    propertyType: '',
    maxPrice: '',
    minSize: '',
    beds: '',
    baths: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to a server
    alert('Thank you for your inquiry. We will contact you soon!');
  };

  return (
    <section className="lead-capture-section">
      <div className="lead-container">
        <div className="lead-content">
          <h2>Create Custom Capture Forms And Manage Leads With The Integrated RealEstate CRM</h2>
          <p>
            The Inquiry Form widget allows you to design unique forms to capture your leads. 
            It connects with RealEstate CRM and your email inbox to keep your work everything on track.
          </p>
        </div>
        
        <div className="lead-form-container">
          <form className="lead-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Inquiry Type</label>
              <select 
                name="inquiryType" 
                value={formData.inquiryType}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="buy">Looking to Buy</option>
                <option value="sell">Looking to Sell</option>
                <option value="rent">Looking to Rent</option>
                <option value="other">Other Inquiry</option>
              </select>
            </div>
            
            <div className="form-section">
              <h3>Your Information</h3>
              
              <div className="form-group">
                <label>I'm a</label>
                <select 
                  name="userType" 
                  value={formData.userType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select</option>
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="agent">Agent</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  <input 
                    type="text" 
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="form-section">
              <h3>Property Details</h3>
              
              <div className="form-group">
                <label>Property Type</label>
                <select 
                  name="propertyType" 
                  value={formData.propertyType}
                  onChange={handleChange}
                >
                  <option value="">Select type</option>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="condo">Condo</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="land">Land</option>
                </select>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Max price</label>
                  <input 
                    type="number" 
                    name="maxPrice"
                    value={formData.maxPrice}
                    onChange={handleChange}
                    placeholder="$"
                  />
                </div>
                
                <div className="form-group">
                  <label>Minimum size (Sq Ft)</label>
                  <input 
                    type="number" 
                    name="minSize"
                    value={formData.minSize}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Number of beds</label>
                  <input 
                    type="number" 
                    name="beds"
                    value={formData.beds}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label>Number of baths</label>
                  <input 
                    type="number" 
                    name="baths"
                    value={formData.baths}
                    onChange={handleChange}
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            <button type="submit" className="submit-button">Submit</button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LeadCapture;