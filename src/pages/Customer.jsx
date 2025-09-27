import { useQueries, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { ImSpinner9 } from "react-icons/im";
import { RiDeleteBin6Line } from "react-icons/ri";
import Swal from "sweetalert2";

const Customer = () => {
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const {
    data: customers = [],
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["allCustomer"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/customers`
      );
      return data;
    },
    retry: false,
  });
  // Fetch replies for each customer in parallel
  const repliesQueries = useQueries({
    queries: customers?.map((customer) => ({
      queryKey: ["reply", customer.email],
      queryFn: async () => {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/replies/${customer.email}`
        );
        return data; // Return an array of replies
      },
      enabled: !!customers.length,
    })),
  });

  // Extract and format replies from queries
  const replies = repliesQueries.reduce((acc, { data }, index) => {
    const email = customers[index]?.email;

    // If data exists, concatenate the body values into a single string
    const concatenatedReplies =
      data?.map((reply) => reply.body).join("<br />") || "No reply";

    acc[email] = {
      body: concatenatedReplies,
      receivedAt: data?.[0]?.receivedAt || null, // Use the first reply's timestamp
    };

    return acc;
  }, {});

  const handleSelectAllCustomer = (e) => {
    setSelectedOption(e.target.value);
  };

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value;
    const email = form.email.value;
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-customer`,
        {
          allCustomer: selectedOption,
          name,
          email,
        }
      );
      if (data.modifiedCount > 0 || data.insertedId) {
        toast.success("Customer created successfully");
        refetch();
        setLoading(false);
        document.getElementById("modal").close();
        form.reset();
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete all",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const { data } = await axios.delete(
            `${import.meta.env.VITE_API_URL}/customers-delete`
          );
          const { customerDeletion, replyDeletion } = data;
          if (
            customerDeletion.deletedCount === 1 &&
            replyDeletion.deletedCount > 0
          ) {
            refetch();
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          }
        } catch (error) {
          console.log(error);
          toast.error("Failed to Delete");
        }
      }
    });
  };

  if (isLoading)
    return (
      <div className="min-h-[calc(100vh-66px)] flex justify-center items-center">
        <ImSpinner9
          size={22}
          color="[#1f1d1d]"
          className="animate-spin m-auto"
        />
      </div>
    );
  return (
    <section className="mt-12 min-h-[calc(100vh-114px)]">
      <div className="flex items-center mx-8 flex-wrap gap-2  justify-between">
        <h2 className="text-lg flex gap-2 flex-wrap items-center font-medium text-gray-800 ">
          Total
          <span className="px-3 py-1 text-xs text-white  bg-[#1f1d1d] rounded-full ">
            {customers?.length} Customers
          </span>
        </h2>
        <div>
          <button
            onClick={() => document.getElementById("modal").showModal()}
            className="px-4  py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-[#1f1d1d] rounded-lg hover:bg-[#1f1d1d]"
          >
            Create Customer
          </button>
        </div>
      </div>

      <dialog id="modal" className="modal">
        <div className="modal-box max-w-sm">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Customer Info</h3>
          <div className="mt-4">
            <form
              onSubmit={handleCreateCustomer}
              className="flex flex-col gap-3"
            >
              <input
                required
                type="text"
                name="name"
                placeholder="Name"
                className="input input-bordered w-full"
              />
              <input
                required
                type="email"
                name="email"
                placeholder="Email"
                className="input input-bordered w-full"
              />
              <select
                required
                onChange={handleSelectAllCustomer}
                className="select select-bordered  w-full"
              >
                <option value="">Customer Mail</option>
                <option value="allCustomer">All Customer</option>
              </select>
              <button
                disabled={loading}
                type="submit"
                className="px-2 disabled:cursor-not-allowed h-11 flex justify-center items-center mt-6 w-full font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-[#1f1d1d] rounded-lg hover:bg-neutral-900 focus:ring-opacity-80"
              >
                {loading ? (
                  <ImSpinner9
                    size={16}
                    color="white"
                    className="animate-spin m-auto"
                  />
                ) : (
                  "Create"
                )}
              </button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      <div className="flex flex-col mt-6">
        <div className="-my-2 overflow-x-auto ">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden border border-gray-200  md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#1f1d1d] text-[15px]">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 px-4  text-left rtl:text-right text-white"
                    >
                      <div className="flex items-center gap-x-3">
                        <span>Name</span>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 px-4  text-left rtl:text-right text-white"
                    >
                      <div className="flex items-center gap-x-3">
                        <span>Email</span>
                      </div>
                    </th>

                    <th
                      scope="col"
                      className="px-4 py-3.5  text-left rtl:text-right text-white"
                    >
                      <span>Reply Message</span>
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3.5  text-left rtl:text-right text-white"
                    >
                      <span>Received At</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 ">
                  {customers?.map((customer) => (
                    <tr key={customer.email} className="text-[15px]">
                      <td className="px-4 py-4 text-gray-900  whitespace-nowrap">
                        {customer.name}
                      </td>
                      <td className="px-4 py-4 text-gray-900  whitespace-nowrap">
                        {customer.email}
                      </td>
                      <td
                        className="px-4 py-4 text-gray-900 whitespace-nowrap"
                        dangerouslySetInnerHTML={{
                          __html: replies[customer.email]?.body || "No reply",
                        }}
                      ></td>
                      <td className="px-4 py-4 text-gray-900 whitespace-nowrap">
                        {replies[customer.email]?.receivedAt
                          ? new Date(
                              replies[customer.email].receivedAt
                            ).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {customers?.length > 0 && (
        <div className="mx-8 flex justify-end mt-5">
          <button
            onClick={() => handleDelete()}
            className="px-4 flex  items-center gap-1 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring focus:ring-red-300 focus:ring-opacity-80"
          >
            Delete All
            <RiDeleteBin6Line />
          </button>
        </div>
      )}
    </section>
  );
};

export default Customer;
