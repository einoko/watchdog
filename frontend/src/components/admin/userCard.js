import {
  CalendarIcon,
  ExclamationIcon,
  MailIcon,
} from "@heroicons/react/outline";
import React from "react";
import Modal from "react-modal";
import { successToast, warningToast } from "../../utils/customToasts";
import { useNavigate } from "react-router-dom";
import { JsonRequest } from "../../utils/fetchUtil";

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

export const UserCard = ({ user }) => {
  let navigate = useNavigate();

  const [modalIsOpen, setIsOpen] = React.useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleDelete = async () => {
    JsonRequest("DELETE", `/api/admin/user/${user._id}`).then((json) => {
      if (!json.errors) {
        closeModal();
        successToast("User deleted", "User successfully deleted.");
        navigate("/admin/dashboard");
      } else {
        closeModal();
        warningToast("Error", json.errors[0].msg);
      }
    });
  };

  return (
    <div>
      <h1 className="font-extrabold text-3xl pb-3">{user.username}</h1>
      <div className="flex flex-row  mt-3 text-gray-500">
        <CalendarIcon className="h-5 w-5 mr-2 flex-shrink-0" />
        <p>
          {" "}
          Registered:{" "}
          {new Date(user.createdAt).toLocaleDateString("en-gb", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          })}
        </p>
      </div>
      <div className="flex flex-row  mt-3 text-gray-500">
        <MailIcon className="h-5 w-5 mr-2 flex-shrink-0" />
        <p>{user.email}</p>
      </div>
      <button
        onClick={openModal}
        className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 px-3 rounded mt-6"
      >
        Delete user
      </button>
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
                Delete user
              </h3>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this user? All data related to
                  this user will be deleted. This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleDelete}
            >
              Delete
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={closeModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
