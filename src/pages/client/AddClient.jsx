import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import DynamicTable from "../../comps/Table";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { Space } from "antd";
import { DataContext } from "../../Context";
import { toast } from "react-toastify";

function AddClient() {
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("add");
  const { handleClientList } = useContext(DataContext);
  const [viewClient, setViewClient] = useState([]);

  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [addClient, setAddClient] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
    gstnum: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddClient({ ...addClient, [name]: value });
  };

  // const handleValidation = (values) => {
  //   let errors = {};

  //   if (!values.name) {
  //     errors.name = "Please enter a valid name.";
  //   }

  //   if (!values.contact.trim()) {
  //     errors.contact = "Please enter a valid contact.";
  //   }

  //   if (!values.email.trim()) {
  //     errors.email = "Please enter a valid email.";
  //   }

  //   if (!values.address.trim()) {
  //     errors.address = "Please enter a valid address.";
  //   }

  //   return errors;
  // };

  const handleClientById = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_PORT_FRONTEND
        }/api/client/getClientById?clientId=${id}`
      );

      const { name, contact, email, address, gstnum } = response.data.data;

      setAddClient({
        name,
        contact,
        email,
        gstnum,
        address,
      });

      setAddClient((prev) => ({
        ...prev,
        id: response.data.data.id,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const validationError = handleValidation(addClient);
    // setError(validationError);

    let response;

    try {
      if (id) {
        response = await axios.put(
          `${import.meta.env.VITE_PORT_FRONTEND}api/client/updateClient?id=${
            addClient?.id
          }`,
          addClient
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_PORT_FRONTEND}api/client/add`,
          addClient
        );
      }

      if (response.status === 201) {
        toast.success(id ? "Client Updated Successfu!" : "Client Added Successfu!");

        handleClientList();

        setAddClient({
          name: "",
          contact: "",
          email: "",
          address: "",
          gstnum: "",
        });

        handleViewClient();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewClient = async () => {
    try {
      const respone = await axios.get(
        `${import.meta.env.VITE_PORT_FRONTEND}api/client/getAllClient`
      );

      setViewClient(respone.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleClientById();
    handleViewClient();
  }, []);

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete Client?"
      );
      if (!confirmDelete) return;

      const response = await axios.delete(
        `${
          import.meta.env.VITE_PORT_FRONTEND
        }api/client/deletCleint?clientId=${id}`
      );

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const navigateClients = (id) => {
    setActiveTab("add");
    navigate(`/add-client?id=${id}`);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "10%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      searchable: true,
      width: "10%",
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      searchable: true,
      width: "10%",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      searchable: true,
      width: "10%",
    },
    {
      title: "GST",
      dataIndex: "gstnum",
      key: "gstnum",
      searchable: true,
      width: "10%",
    },

    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <div
            className="edit-btn cursor-pointer p-2  hover:bg-amber-100 hover:text-amber-600 transition duration-200"
            onClick={() => navigateClients(record.name)}
          >
            <CiEdit />
          </div>
          <div
            className="delete-btn cursor-pointer p-2  hover:bg-amber-100 hover:text-amber-600 transition duration-200"
            onClick={() => handleDelete(record.id)}
          >
            <MdDeleteForever />
          </div>
        </Space>
      ),
      width: "5%",
    },
  ];

  return (
    <>
      <div className="parent h-screen mt-20">
        <div className="container flex justify-center items-center gap-4 flex-col">
          <div className="w-full  border-yellow-800 border-b-1 items-center justify-end flex gap-5">
            <button
              onClick={() => setActiveTab("view")}
              className={`px-4 py-2 rounded-t-md cursor-pointer ${
                activeTab === "view"
                  ? "bg-amber-600 !text-white border-2 border-amber-900"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              View Data
            </button>
            <button
              onClick={() => setActiveTab("add")}
              className={`px-4 py-2 rounded-t-md cursor-pointer ${
                activeTab === "add"
                  ? "bg-amber-600 !text-white border-2 border-amber-900"
                  : "bg-amber-100 text-amber-800 "
              }`}
            >
              Add Data
            </button>
          </div>
          {activeTab === "add" && (
            <form
              onSubmit={handleSubmit}
              className="card min-w-[400px] flex flex-col gap-4 items-center"
            >
              <h1 className="text-3xl text-center font-medium mb-4">
                Add Client
              </h1>

              <div className="w-full">
                <input
                  type="name"
                  placeholder="Name"
                  name="name"
                  value={addClient.name}
                  onChange={handleChange}
                />
                {error.name && (
                  <span className="!text-red-500 text-xs">{error.name}</span>
                )}
              </div>

              <div className="w-full">
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={addClient.email}
                  onChange={handleChange}
                />
                {error.email && (
                  <span className="!text-red-500 text-sm">{error.email}</span>
                )}
              </div>

              <div className="w-full">
                <input
                  type="number"
                  placeholder="Contact"
                  name="contact"
                  value={addClient.contact}
                  onChange={handleChange}
                />
                {error.contact && (
                  <span className="!text-red-500 text-sm">{error.contact}</span>
                )}
              </div>

              <div className="w-full">
                <input
                  type="text"
                  placeholder="Address"
                  name="address"
                  value={addClient.address}
                  onChange={handleChange}
                />
                {error.address && (
                  <span className="!text-red-500 text-sm">{error.address}</span>
                )}
              </div>

              <input
                type="text"
                placeholder="GST Number"
                name="gstnum"
                value={addClient.gstnum}
                onChange={handleChange}
              />

              <button type="submit" className="btn w-full mt-4">
                Submit
              </button>
            </form>
          )}

          {activeTab === "view" && (
            <>
              {viewClient.length > 0 ? (
                <DynamicTable columns={columns} dataSource={viewClient} />
              ) : (
                <p className="text-gray-500">No client data found.</p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default AddClient;
