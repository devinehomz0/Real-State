import { addDoc, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../config/firebase";
import heroBg from "../../assets/d1.jpg";
import { FaWhatsapp } from "react-icons/fa";
export default function EnquiryForm({ propertyInfo }) {
  const initialForm = {
    name: "",
    contact: "",
    description: ``,
    type: "",
  };
  let [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  let [enquiry, setenquiry] = useState([]);
  let fetchEnquiry = async () => {
    const data = await getDocs(collection(db, "enquirys"));

    setenquiry(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };
  useEffect(() => {
    fetchEnquiry();
    console.log(enquiry);
  }, [submitting]);
  let handelChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  let submitForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const requiredFields = ["name", "contact", "description", "type"];
    for (let field of requiredFields) {
      if (!form[field]) {
        alert("Please fill all required fields.");
        setSubmitting(false);
        return;
      }
    }
    await addDoc(collection(db, "enquirys"), {
      ...form,
      createdAt: new Date(),
    });
    setForm(initialForm);
    setSubmitting(false);
  };
  return (
    <div>
      <div
        className="hero-container-tint tint_enquiry_main"
        style={{
          background: `url(${heroBg}) center/cover no-repeat fixed`,
        }}
      >
        <div className="hero-overlay-tint "></div> {/* Blue tint */}
        <div className="hero-content-tint tint_form">
          <div className="left-hero-content">
            <h2>
              Find Your Ideal Property <br /> or Get Expert Advice
            </h2>
            <p>
              Looking to buy a plot, rent an apartment, or sell your property?
              Fill out the enquiry form below and our team will get in touch to
              help you with the best options, personalized guidance, and answers
              to all your real estate questions.
            </p>
          </div>
          <div className="enquiryForm">
            <form action="" onSubmit={submitForm}>
              <input
                type="text"
                value={form.name}
                placeholder="Name"
                onChange={handelChange}
                name="name"
              />
              <input
                type="text"
                value={form.email}
                placeholder="Phone or Email"
                onChange={handelChange}
                name="contact"
              />
              <input
                type="text"
                value={form.description}
                onChange={handelChange}
                placeholder="Message"
                name="description"
              />
              <select
                value={form.type}
                name="type"
                id=""
                onChange={handelChange}
              >
                <option value="buyer">{"I'm a buyer"}</option>
                <option value="tennant">{"I'm a tennant"}</option>
                <option value="agent">{"I'm an agent"}</option>
                <option value="other">{"Other"}</option>
              </select>{" "}
              <br />
              <button type="submit">
                {submitting ? "Submitting..." : "Submit"}
              </button> <br />
              <a className="what_enq">
<FaWhatsapp className="what"></FaWhatsapp> WhatsApp
              </a>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
