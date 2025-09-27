import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { ImSpinner9 } from "react-icons/im";
import { useNavigate } from "react-router-dom";

const AddCampaign = () => {
  const [loading, setLoading] = useState(false);
  const [smtpEmail, setSmtpEmail] = useState("");
  const [allCustomerEmail, setAllCustomerEmail] = useState(null);
  const navigate = useNavigate();

  const { data: smtpEmails = [] } = useQuery({
    queryKey: ["smtp-email"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/smtp-email`
      );
      return data;
    },
  });

  const { data: customers = [] } = useQuery({
    queryKey: ["customers-email"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/customers`
      );
      return data;
    },
  });

  const handleSmtp = (e) => {
    setSmtpEmail(e.target.value);
  };

  const allSingleEmail = customers?.map((customer) => customer?.email);
  const handleSelectAllCustomer = () => {
    setAllCustomerEmail(allSingleEmail);
  };

  console.log(allCustomerEmail);

  // const handleAddCampaign = async (e) => {
  //   e.preventDefault();
  //   const form = e.target;
  //   const fromName = form.fromName.value;
  //   const subject = form.subject.value;
  //   const message = form.message.value;
  //   const campaignInfo = {
  //     fromName,
  //     subject,
  //     message,
  //     smtpEmail,
  //     allCustomerEmail,
  //     status: "inactive",
  //   };
  //   try {
  //     setLoading(true);
  //     const { data } = await axios.post(
  //       `${import.meta.env.VITE_API_URL}/create-campaign`,
  //       campaignInfo
  //     );
  //     if (data.insertedId) {
  //       toast.success("Campaign added successfully");
  //       navigate("/campaign");
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false);
  //   }
  // };

  const handleAddCampaign = async (e) => {
    e.preventDefault();
    const form = e.target;

    const fromName = form.fromName.value;
    const subject = form.subject.value;
    const message = form.message.value;
    const attachmentFile = form.attachment.files[0]; // ফাইল নিলাম

    const formData = new FormData();
    formData.append("fromName", fromName);
    formData.append("subject", subject);
    formData.append("message", message);
    formData.append("smtpEmail", smtpEmail);
    formData.append("allCustomerEmail", JSON.stringify(allCustomerEmail));
    if (attachmentFile) {
      formData.append("attachment", attachmentFile);
    }

    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-campaign`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (data.insertedId) {
        toast.success("Campaign added successfully");
        navigate("/campaign");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <section className="mx-8">
      <div className="min-h-[calc(100vh-66px)] flex justify-center items-center">
        <form
          onSubmit={handleAddCampaign}
          className="flex flex-col justify-center max-w-lg w-full  items-center gap-3"
        >
          <input
            required
            name="fromName"
            type="text"
            placeholder="From Name"
            className="input input-bordered border-gray-400 w-full max-w-xs"
          />
          <input
            required
            name="subject"
            type="text"
            placeholder="Subject"
            className="input input-bordered border-gray-400 w-full max-w-xs"
          />

          <textarea
            required
            name="message"
            rows="2"
            placeholder="Message"
            className="textarea textarea-bordered border-gray-400  text-[16px] w-full max-w-xs"
          ></textarea>
          <input
            type="file"
            name="attachment"
            className="file-input file-input-bordered border-gray-400 w-full max-w-xs"
          />
          <select
            required
            onChange={handleSmtp}
            className="select select-bordered border-gray-400 w-full max-w-xs"
          >
            <option value="">SMTP</option>
            {[...new Set(smtpEmails?.map((smtp) => smtp.email))].map(
              (email, index) => (
                <option key={index} value={email}>
                  {email}
                </option>
              )
            )}
          </select>

          <select
            required
            onChange={handleSelectAllCustomer}
            className="select select-bordered border-gray-400 w-full max-w-xs"
          >
            <option value="">Customer Mail</option>
            <option value="allCustomer">All Customer</option>
          </select>

          <button
            disabled={loading}
            type="submit"
            className="px-2 disabled:cursor-not-allowed max-w-xs h-11 flex justify-center items-center mt-1 w-full font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-[#1f1d1d] rounded-lg hover:bg-neutral-700 focus:ring-opacity-80"
          >
            {loading ? (
              <ImSpinner9
                size={16}
                color="white"
                className="animate-spin m-auto"
              />
            ) : (
              "Add Campaign"
            )}
          </button>
        </form>
      </div>
    </section>
  );
};

export default AddCampaign;
