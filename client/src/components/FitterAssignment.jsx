export default function FitterAssignment({
  fitters,
  selectedFitter,
  setSelectedFitter,
}) {
  return (
    <div className="sm:col-span-4">
      <label
        htmlFor="fitter"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Assign Fitter (Optional)
      </label>
      <select
        id="fitter"
        name="fitter"
        value={selectedFitter}
        onChange={(e) => setSelectedFitter(e.target.value)}
        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      >
        <option value="">Select a fitter (optional)</option>
        {fitters.map((fitter) => (
          <option key={fitter.id} value={fitter.id}>
            {fitter.name}
          </option>
        ))}
      </select>
    </div>
  );
}
