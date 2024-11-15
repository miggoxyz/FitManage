import { useEffect, useState } from "react";
import axios from "axios";
import CustomerSelection from "../components/CustomerSelection";
import JobInfo from "../components/JobInfo";
import FitterAssignment from "../components/FitterAssignment";

export default function CreateJob() {
  const [customers, setCustomers] = useState([]);
  const [fitters, setFitters] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    address: "",
    contact_details: "",
  });
  const [selectedFitter, setSelectedFitter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isCreatingCustomer, setIsCreatingCustomer] = useState(false);

  // Fetch customers and fitters when the component mounts
  const fetchCustomersAndFitters = async () => {
    try {
      const token = localStorage.getItem("token");

      // Fetch customers
      const customersResponse = await axios.get("/api/customers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCustomers(customersResponse.data);

      // Fetch fitters
      const fittersResponse = await axios.get("/api/users?role=fitter", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFitters(fittersResponse.data);
    } catch {
      setError("Failed to fetch data");
    }
  };

  useEffect(() => {
    fetchCustomersAndFitters();
  }, []);

  const handleCreateCustomer = async () => {
    try {
      const token = localStorage.getItem("token");

      // Create a new customer
      const customerResponse = await axios.post("/api/customers", newCustomer, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const createdCustomer = customerResponse.data;
      await fetchCustomersAndFitters();
      setSelectedCustomer(createdCustomer.id);
      setNewCustomer({ name: "", address: "", contact_details: "" });
      setIsCreatingCustomer(false);
      setSuccess("Customer created successfully. Now assign a job.");
      setError(null);
    } catch {
      setError("Failed to create customer");
    }
  };

  const handleCreateJob = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      if (!selectedCustomer) {
        setError("Please select a customer.");
        return;
      }

      // Create a new job
      const jobResponse = await axios.post(
        "/api/jobs",
        {
          customer_id: selectedCustomer,
          fitter_id: selectedFitter || null,
          start_date: startDate,
          end_date: endDate,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess("Job created successfully!");
      setError(null);

      // Clear form after successful assignment
      setSelectedCustomer("");
      setSelectedFitter("");
      setStartDate("");
      setEndDate("");
    } catch {
      setError("Failed to create job");
    }
  };

  return (
    <form onSubmit={handleCreateJob}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Create Job
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            Fill out the form below to create a new job.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            {/* Customer Selection */}
            <CustomerSelection
              customers={customers}
              newCustomer={newCustomer}
              setNewCustomer={setNewCustomer}
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
              isCreatingCustomer={isCreatingCustomer}
              setIsCreatingCustomer={setIsCreatingCustomer}
              handleCreateCustomer={handleCreateCustomer}
            />

            {/* Job Information */}
            <JobInfo
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
            />

            {/* Fitter Assignment */}
            <FitterAssignment
              fitters={fitters}
              selectedFitter={selectedFitter}
              setSelectedFitter={setSelectedFitter}
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={() => window.history.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          Create Job
        </button>
      </div>

      {/* Error and Success Messages */}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {success && <p className="mt-4 text-sm text-green-600">{success}</p>}
    </form>
  );
}
