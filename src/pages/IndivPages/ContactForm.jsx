import React, { useState } from "react";
import { db } from "../../config/firebase";
import { addDoc, collection } from "firebase/firestore";

const ContactForm = ({ propertyTitle }) => {
  const initial = {
    name: "",
    phone: "",
    email: "",
    message: `Hello, I am interested in [${propertyTitle}]`,
    preference: "",
  };
  const [formData, setFormData] = useState(initial);
  const [submitting, setSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Basic validation
    const requiredFields = ["name", "email", "message"];
    for (let field of requiredFields) {
      if (!formData[field]) {
        alert("Please fill all required fields.");
        setSubmitting(false);
        return;
      }
    }

    try {
      await addDoc(collection(db, "enquirys"), {
        ...formData,
        createdAt: new Date(),
        propertyTitle,
      });
      setFormData(initial);
    } catch (error) {
      console.error("Error submitting enquiry:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-form-section card imageSection">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </div>
        <div className="form-group">
          <input
            type="tel"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={submitting}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={submitting}
          />
        </div>
        <div className="form-group">
          <textarea
            name="message"
            rows="4"
            value={formData.message}
            onChange={handleChange}
            required
            disabled={submitting}
          ></textarea>
        </div>
        <div className="form-group">
          <select
            name="preference"
            value={formData.preference}
            onChange={handleChange}
            disabled={submitting}
          >
            <option value="">Select</option>
            <option value="call">Prefer Call</option>
            <option value="email">Prefer Email</option>
            <option value="whatsapp">Prefer WhatsApp</option>
          </select>
        </div>
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Send Message"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
