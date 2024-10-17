export default function JobInfo({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) {
  return (
    <>
      <div className="sm:col-span-3">
        <label
          htmlFor="start-date"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          Start Date
        </label>
        <div className="mt-2">
          <input
            id="start-date"
            name="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            required
          />
        </div>
      </div>

      <div className="sm:col-span-3">
        <label
          htmlFor="end-date"
          className="block text-sm font-medium leading-6 text-gray-900"
        >
          End Date
        </label>
        <div className="mt-2">
          <input
            id="end-date"
            name="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            required
          />
        </div>
      </div>
    </>
  );
}
