import { addDoc, collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../config/firebase";

export default function EnquiryForm({ propertyInfo }) {
  const initialForm = {
    name: "",
    contact: "",
    description: `Hello, I am interested in ${propertyInfo}`,
    type: "",
  };
  let [form, setForm] = useState(initialForm);
    const [submitting, setSubmitting] = useState(false);
    let [enquiry, setenquiry] = useState([])
    let fetchEnquiry = async() => {
        const data = await getDocs(collection(db, "enquirys")); 

        setenquiry(data.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    }
    useEffect(() => {
        fetchEnquiry();
        console.log(enquiry);

},[submitting])
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
    setSubmitting(false);

  };
  return (
    <div>
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
            name="description"
          />
          <select value={form.type} name="type" id="" onChange={handelChange}>
            <option value="buyer">{"I'm a buyer"}</option>
            <option value="tennant">{"I'm a tennant"}</option>
            <option value="agent">{"I'm an agent"}</option>
            <option value="other">{"Other"}</option>
          </select>{" "}
          <button type="submit">
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
      <h2>Enquirys</h2>
      <div className="enquiry">
        {enquiry.map((data) => (
          <div className="data" key={data.id}>
            <p>Name : {data.name}</p>
            <p>Contact : {data.contact}</p>
            <p>Description : {data.description}</p>
            <p>Type : {data.type}</p>
            <p>
              {data.createdAt?.toDate?.().toLocaleString?.() ||
                String(data.createdAt)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
