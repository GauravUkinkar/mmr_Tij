import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import DynamicTable from "../../comps/Table";
import { Space } from "antd";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import { DataContext } from "../../Context";
import { toast } from "react-toastify";

function Vendors() {
  const [error, setError] = useState({});
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("view");
  const [viewVendors, setViewVendors] = useState([]);
  const { handleVendorsList } = useContext(DataContext);
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const [addVendors, setAddVendors] = useState({
    name: "",
    contact: "",
    email: "",
    gstnum: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddVendors({ ...addVendors, [name]: value });
  };

  // const handleValidation = (values) => {
  //   let errors = {};

  //   if (!values.name.trim()) {
  //     errors.name = "Please enter a valid name.";
  //   }

  //   if (!values.contact.trim()) {
  //     errors.contact = "Please enter a valid contact.";
  //   }

  //   if (!values.email.trim()) {
  //     errors.email = "Please enter a valid email.";
  //   }

  //   return errors;
  // };

  const handleVendorsById = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_PORT_FRONTEND
        }api/vendor/getvendorsById?vendorId=${id}`
      );

      const { name, contact, email, gstnum } = response.data.data;

      setAddVendors({
        name,
        contact,
        email,
        gstnum,
      });

      setAddVendors((prev) => ({
        ...prev,
        id: response.data.data.id,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const validationError = handleValidation(addVendors);
    // setError(validationError);

    let response;

    try {
      if (id) {
        response = await axios.put(
          `${import.meta.env.VITE_PORT_FRONTEND}api/vendor/updateVendor?id=${
            addVendors?.id
          }`,
          addVendors
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_PORT_FRONTEND}api/vendor/add`,
          addVendors
        );
      }

      if (response.status === 201) {
        toast.success(id ? "Vendors Updated Successfu!" : "Vendors Added Successfu!");
        handleVendorsList();
        setAddVendors({
          name: "",
          contact: "",
          email: "",
          gstnum: "",
        });

        handleViewVendors();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleViewVendors = async () => {
    try {
      const respone = await axios.get(
        `${import.meta.env.VITE_PORT_FRONTEND}api/vendor/getAllvendors`
      );

      setViewVendors(respone.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      handleVendorsById();
    }
    handleViewVendors();
  }, [id]);

  const handleDelete = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete Vendor?"
      );
      if (!confirmDelete) return;

      const response = await axios.delete(
        `${
          import.meta.env.VITE_PORT_FRONTEND
        }api/vendor/deletVendor?vendorId=${id}`
      );

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const navigateVendors = (id) => {
    setActiveTab("add");
    navigate(`/add-vendor?id=${id}`);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "2%",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      searchable: true,
      width: "2%",
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      searchable: true,
      width: "2%",
    },
    {
      title: "GST",
      dataIndex: "gstnum",
      key: "gstnum",
      searchable: true,
      width: "2%",
    },

    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <div
            onClick={() => navigateVendors(record.name)}
            className="edit-btn cursor-pointer p-2  hover:bg-amber-100 hover:text-amber-600 transition duration-200"
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
      width: "2%",
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
                  ? "bg-amber-600 !text-white  border-amber-900"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              View Vendors
            </button>
            <button
              onClick={() => setActiveTab("add")}
              className={`px-4 py-2 rounded-t-md cursor-pointer ${
                activeTab === "add"
                  ? "bg-amber-600 !text-white  border-amber-900"
                  : "bg-amber-100 text-amber-800"
              }`}
            >
              Add Vendors
            </button>
          </div>

          {activeTab === "add" && (
            <form
              onSubmit={handleSubmit}
              className="card min-w-[400px] flex flex-col gap-4 items-center"
            >
              <h1 className="text-3xl text-center font-medium mb-4">
                Add Vendors
              </h1>

              <div className="w-full">
                <input
                  type="name"
                  placeholder="Name"
                  name="name"
                  value={addVendors.name}
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
                  value={addVendors.email}
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
                  value={addVendors.contact}
                  onChange={handleChange}
                />
                {error.contact && (
                  <span className="!text-red-500 text-sm">{error.contact}</span>
                )}
              </div>

              <input
                type="text"
                placeholder="GST Number"
                name="gstnum"
                value={addVendors.gstnum}
                onChange={handleChange}
              />

              <button type="submit" className="btn w-full mt-4">
                Submit
              </button>
            </form>
          )}

          {activeTab === "view" && (
            <>
              {viewVendors.length > 0 ? (
                <DynamicTable
                  scoll={{ x: 1200 }}
                  columns={columns}
                  dataSource={viewVendors}
                />
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

export default Vendors;
