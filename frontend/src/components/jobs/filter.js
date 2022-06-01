function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Filter({ jobCounts, setFilter }) {
  return (
    <div className="md:p-6 py-6">
      <div className="sm:hidden">
        <select
          id="tabs"
          name="tabs"
          className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none  sm:text-sm rounded-md"
          defaultValue={jobCounts.find((job) => job.current).type}
          onClick={(e) => {
            setFilter(e.target.value);
          }}
        >
          {jobCounts.map((job) => (
            <option value={job.type} key={job.type}>
              {job.type}
            </option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {jobCounts.map((job) => (
              <button
                key={job.type}
                onClick={() => {
                  setFilter(job.type);
                }}
                className={classNames(
                  job.current
                    ? "border-gray-900 text-gray-700"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200",
                  "whitespace-nowrap flex py-4 px-1 border-b-2 font-medium text-sm"
                )}
                aria-current={job.current ? "page" : undefined}
              >
                {job.type}
                {job.count >= 0 ? (
                  <span
                    className={classNames(
                      job.current
                        ? "bg-gray-100 text-gray-700"
                        : "bg-gray-100 text-gray-900",
                      "ml-3 py-0.5 px-2.5 rounded-full text-xs font-medium"
                    )}
                  >
                    {job.count}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
