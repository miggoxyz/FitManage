export default function CustomerSelection({
  customers,
  newCustomer,
  setNewCustomer,
  selectedCustomer,
  setSelectedCustomer,
  isCreatingCustomer,
  setIsCreatingCustomer,
  handleCreateCustomer,
}) {
  return (
    <div className="sm:col-span-4">
      <label
        htmlFor="customer"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Customer
      </label>
      {isCreatingCustomer ? (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Customer Name"
            value={newCustomer.name}
            onChange={(e) =>
              setNewCustomer({ ...newCustomer, name: e.target.value })
            }
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            required
          />
          <input
            type="text"
            placeholder="Customer Address"
            value={newCustomer.address}
            onChange={(e) =>
              setNewCustomer({
                ...newCustomer,
                address: e.target.value,
              })
            }
            className="block w-full mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            required
          />
          <input
            type="text"
            placeholder="Contact Details"
            value={newCustomer.contact_details}
            onChange={(e) =>
              setNewCustomer({
                ...newCustomer,
                contact_details: e.target.value,
              })
            }
            className="block w-full mt-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            required
          />
          <button
            type="button"
            onClick={handleCreateCustomer}
            className="mt-4 w-full sm:w-auto rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Create Customer
          </button>
        </div>
      ) : (
        <select
          id="customer"
          name="customer"
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          required
        >
          <option value="">Select a customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      )}
      <button
        type="button"
        onClick={() => setIsCreatingCustomer(!isCreatingCustomer)}
        className="mt-4 w-full sm:w-auto rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500"
      >
        {isCreatingCustomer ? "Cancel New Customer" : "Add New Customer"}
      </button>
    </div>
  );
}
