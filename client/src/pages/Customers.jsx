import { useEffect, useState } from "react";
import axios from "axios";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("/api/customers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCustomers(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch customers");
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Customers</h2>
      <ul className="space-y-4">
        {customers.map((customer) => (
          <li key={customer.id} className="bg-white shadow-md rounded-lg p-4">
            <h3 className="text-xl font-semibold">{customer.name}</h3>
            <p>Email: {customer.email}</p>
            <p>Phone: {customer.phone}</p>
            <p>Address: {customer.address}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Customers;
