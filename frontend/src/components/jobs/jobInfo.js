import {
  EyeIcon,
  BellIcon,
  ClockIcon,
  LinkIcon,
  ScissorsIcon,
  HashtagIcon,
  EyeOffIcon,
  ExclamationIcon,
} from "@heroicons/react/outline";
import React from "react";
import { getJWT } from "../../utils/loginUtil";
import { useNavigate } from "react-router-dom";
import { successToast } from "../../utils/customToasts";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    border: "0px",
    background: "rbga(0, 0, 0, 0)",
  },
};

Modal.setAppElement("#root");

export const JobInfo = ({ job, active, setActive }) => {
  let navigate = useNavigate();

  const [modalIsOpen, setIsOpen] = React.useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const toggleActivity = async () => {
    await fetch(`/api/job/${job._id}/status`, {
      method: "PATCH",
      headers: {
        Authorization: getJWT(),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        active: !active,
      }),
    }).then((res) => {
      if (res.status === 200) {
        setActive(!active);
        successToast(
          "Job status updated",
          `Job ${active ? "paused" : "resumed"} successfully.`
        );
      }
    });
  };

  const deleteJob = async () => {
    await fetch(`/api/job/${job._id}`, {
      method: "DELETE",
      headers: {
        Authorization: getJWT(),
        "Content-Type": "application/json",
      },
    }).then((res) => {
      successToast("Job deleted", "Job deleted successfully.");
      navigate("/jobs");
    });
  };

  return (
    <>
      <h1 className=" text-4xl font-extrabold pb-2">{job.name}</h1>
      <div className="py-3">
        <span
          className={`${
            active ? "bg-green-300 text-green-800" : "text-gray-900 bg-gray-300"
          } py-2 px-3 font-semibold text-sm rounded-full`}
        >
          {active ? "Active" : "Paused"}
        </span>
      </div>
      {job.jobType !== undefined && (
        <div className="flex flex-row  mt-3 text-gray-500">
          <EyeIcon className="h-5 w-5 mr-2 flex-shrink-0" />
          {job.jobType[0].toUpperCase() + job.jobType.slice(1)} comparison
        </div>
      )}
      <div className="flex flex-row  mt-3 text-gray-500">
        <LinkIcon className="h-5 w-5 mr-2 flex-shrink-0" />
        <a
          className="hover:underline font-semibold hover:text-gray-800"
          href={job.url}
        >
          {job.url}
        </a>
      </div>
      <div className="flex flex-row  mt-3 text-gray-500">
        <ClockIcon className="h-5 w-5 mr-2 flex-shrink-0" />
        <p>
          Checking every {job.interval} (last check{" "}
          {new Date(job.updatedAt).toLocaleDateString("en-gb", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
          })}
          )
        </p>
      </div>
      {job.states !== undefined && (
        <div className="flex flex-row  mt-3 text-gray-500">
          <BellIcon className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>
            Detected {Math.max(job.states.length - 1, 0)}{" "}
            {job.states.length === 2 ? "change" : "changes"} so far.
          </p>
        </div>
      )}
      {job.visual_crop && (
        <div className="flex flex-row  mt-3 text-gray-500">
          <ScissorsIcon className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>Crop enabled</p>
        </div>
      )}
      {job.visual_scrollToElement && (
        <div className="flex flex-row  mt-3 text-gray-500">
          <HashtagIcon className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>Scroll to {job.visual_scrollToElement}</p>
        </div>
      )}
      {job.visual_hideElements && job.visual_hideElements.length > 0 && (
        <div className="flex flex-row  mt-3 text-gray-500">
          <EyeOffIcon className="h-5 w-5 mr-2 flex-shrink-0" />
          <p>{job.visual_hideElements}</p>
        </div>
      )}
      <div className=" pt-8 flex flex-row">
        <button
          onClick={() => toggleActivity()}
          className="bg-indigo-500 hover:bg-indigo-700 text-sm font-semibold text-white p-3 rounded-md mr-3"
        >
          {active ? "Pause" : "Resume"} job
        </button>
        <button
          onClick={openModal}
          className="bg-red-600 hover:bg-red-700 text-sm font-semibold text-white p-3 rounded-md"
        >
          Delete job
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        style={customStyles}
      >
        <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <ExclamationIcon
                className="h-6 w-6 text-red-600"
                aria-hidden="true"
              />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Delete job
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this job? All data related to
                  this job, including the captured screenshots, will be deleted.
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={deleteJob}
            >
              Delete
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
