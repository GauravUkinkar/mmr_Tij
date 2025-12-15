import React, { useContext, useEffect, useState } from "react";
import Header from "../../comps/Header";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DataContext } from "../../Context";
import { LuCirclePlus } from "react-icons/lu";
import AddClient from "../client/AddClient";
import { RxCrossCircled } from "react-icons/rx";
import Vendors from "../vendors/Vendors";
const AddDetails = () => {
  const { invoiceNumber, cName, vName } = useContext(DataContext);
  const [popup, setPopUp] = useState(false);
  const [vendorPop, setVendorPop] = useState(false);

  const navigate = useNavigate();
  const [status, setStatus] = useState([
    "Pending",
    "Paid",
    "Failed",
    "Cancelled",
  ]);
  const [modeOfPayment, setModeOfPayment] = useState([
    "Cash",
    "UPI",
    "Card",
    "Net Banking",
    "Cheque",
  ]);
  const [service, setPaymentStatus] = useState([
    "BUS Ticket",
    "Cab Booling",
    "Train Ticket",
    "Darshan Fees",
    "Flight Ticket",
    "Hotel Booking",
    "Ok To Board",
    "Package",
    "Rescheduling",
    "Round Trip",
    "Seat Upgrade",
    "Ticket Cancellation",
    "Travel",
    "VISA",
  ]);

  const [clientIdData, setClientIdData] = useState([]);
  const [vendorIdData, setVendorIdData] = useState([]);
  const [gst, setGstAmt] = useState(5);
  const [paramsId] = useSearchParams();

  const [formData, setFormData] = useState({
    status: "Pending",
    invoiceNum: invoiceNumber,
    dateofBooking: "",
    dateOfJourney: "",
    modeOfPayment: "",
    service: "",
    description: "",
    PNR: "",
    systemRef: "",
    vendor: "",
    vendorGST: "",
    depCity: "",
    arrCity: "",
    passengerName: "",
    paymentParty: "",
    paymentPartyGST: "",
    netAmount: 0,
    markup: 0,
    gst: 0,
    totalAmount: 0,
    modeOfPaymentForClient: 0,
    paymentdatebyclient: "",
    paymenamtbyclient: 0,
    amount: 0,
    refundDate: "",
    refundAmount: 0,
    cancelCharge: 0,
    refundMode: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      paymentPartyGST: clientIdData?.gstnum || "",
      // passengerName: clientIdData?.name || "",

      vendorGST: vendorIdData?.gstnum || "",
      // vendor: vendorIdData?.name || "",
    }));
  }, [clientIdData, vendorIdData]);

  const getMasterDataById = async (id) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_PORT_FRONTEND
        }api/master/getmasterDatabyid?masterId=${id}`
      );

      setFormData({
        status: response.data.data.status,
        invoiceNum: response.data.data.invoiceNum,
        dateofBooking: response.data.data.dateofBooking,
        dateOfJourney: response.data.data.dateOfJourney,
        modeOfPayment: response.data.data.modeOfPayment,
        service: response.data.data.service,
        description: response.data.data.description,
        PNR: response.data.data.PNR,
        systemRef: response.data.data.systemRef,
        vendor: response.data.data.vendor,
        vendorGST: response.data.data.vendorGST,
        depCity: response.data.data.depCity,
        arrCity: response.data.data.arrCity,
        passengerName: response.data.data.passengerName,
        paymentParty: response.data.data.paymentParty,
        paymentPartyGST: response.data.data.paymentPartyGST,
        netAmount: response.data.data.netAmount,
        markup: response.data.data.markup,
        gst: response.data.data.gst,
        totalAmount: response.data.data.totalAmount,
        modeOfPaymentForClient: response.data.data.modeOfPaymentForClient,
        paymentdatebyclient: response.data.data.paymentdatebyclient,
        paymenamtbyclient: response.data.data.paymenamtbyclient,
        amount: response.data.data.amount,
        refundDate: response.data.data.refundDate,
        refundAmount: response.data.data.refundAmount,
        cancelCharge: response.data.data.cancelCharge,
        refundMode: response.data.data.refundMode,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const id = paramsId.get("masterId");
  useEffect(() => {
    if (id) {
      getMasterDataById(id);
    }
  }, []);

  const handleFormData = async (e) => {
    e.preventDefault();
    try {
      let response;

      if (id) {
        response = await axios.put(
          `${
            import.meta.env.VITE_PORT_FRONTEND
          }api/master/editMasterData?masterId=${id}`,
          formData
        );
      } else {
        response = await axios.post(
          `${import.meta.env.VITE_PORT_FRONTEND}api/master/add`,
          formData
        );
      }

      alert(id ? "Data updated successfully" : "Data added successfully");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const getClientListById = async (e) => {
    try {
      const id = e.target.value;
      const response = await axios.get(
        `${
          import.meta.env.VITE_PORT_FRONTEND
        }api/client/getClientById?clientId=${id}`
      );

      setFormData(() => ({
        ...formData,
        passengerName: id,
      }));
      setClientIdData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getVendorListById = async (e) => {
    try {
      const id = e.target.value;
      const response = await axios.get(
        `${
          import.meta.env.VITE_PORT_FRONTEND
        }api/vendor/getvendorsById?vendorId=${id}`
      );
      setFormData(() => ({
        ...formData,
        vendor: id,
      }));
      setVendorIdData(response.data.data);
      console.log(response.data.data, "vendor list >>>");
    } catch (error) {
      console.log(error);
    }
  };

  const [refundMode, setRefundMode] = useState([
    "Cash",
    "Card",
    "Bank Transfer",
  ]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  function cusInput(label, type, name, placeholder, value, onChange, required) {
    return (
      <div className="flex flex-col w-full">
        <label
          htmlFor={name}
          className="text-[0.85rem] font-medium ml-2 !text-yellow-600 flex items-center gap-1"
        >
          {label} {required && <span className="!text-red-500">*</span>}
        </label>
        <input
          id={name}
          placeholder={placeholder || ""}
          type={type}
          name={name}
          value={value ?? ""}
          onChange={(e) => {
            const cleanedValue = e.target.value.replace(/^\s+|\s+$/g, ""); // remove leading and trailing spaces
            onChange({
              target: {
                name: e.target.name,
                value: cleanedValue,
              },
            });
          }}
          required={required}
        />
      </div>
    );
  }

  function cusSelect(label, name, value, onChange, options, required) {
    return (
      <div className="flex flex-col w-full">
        <label
          htmlFor={name}
          className="text-[0.85rem] font-medium ml-2 !text-yellow-600"
        >
          {label} {required && <span className="!text-red-500">*</span>}
        </label>
        <select
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(e)}
          className="!py-[8px]"
          required={required}
        >
          <option disabled selected value="">
            {`Select ${label}`}{" "}
          </option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  function divider(title) {
    return (
      <p className="w-full text-[0.85rem] bg-amber-100 !text-yellow-900 font-bold px-2 py-[2px] rounded-md my-2">
        {title}
      </p>
    );
  }

  useEffect(() => {
    console.log(formData);
  }, [formData.dateOfBooking]);

  useEffect(() => {
    setFormData({
      ...formData,
      totalAmount:
        parseInt(formData.netAmount) +
        parseInt(formData.markup) +
        formData.gst,
      gst: (parseInt(gst) / 100) * parseInt(formData.markup),
    });
  }, [formData.netAmount, formData.gst, formData.markup]);

  // add new invoice

  const handlenewInvocieData = async (e) => {
    e.preventDefault();
    try {
      let response;

      response = await axios.post(
        `${import.meta.env.VITE_PORT_FRONTEND}api/master/addInvoice`,
        formData
      );

     alert("Added new Invoice")
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
console.log(formData, "formdata")
  return (
    <>
      <ToastContainer />
      {popup && (
        <div
          class="popup absolute top-0 left-0 h-full w-full "
          style={{ backgroundColor: "rgba(0, 0, 0, 0.295)" }}
        >
          <div
            class="absolute top-10 right-10 text-amber-600 z-10 cursor-pointer text-4xl"
            onClick={() => setPopUp(false)}
          >
            <RxCrossCircled style={{ color: "red !important" }} />
          </div>

          <Vendors />
        </div>
      )}
      {vendorPop && (
        <div
          class="popup absolute top-0 left-0 h-full w-full "
          style={{ backgroundColor: "rgba(0, 0, 0, 0.295)" }}
        >
          <div
            class="absolute top-10 right-10 text-amber-600 z-10 cursor-pointer text-4xl"
            onClick={() => setVendorPop(false)}
          >
            <RxCrossCircled style={{ color: "red !important" }} />
          </div>

          <AddClient />
        </div>
      )}
      {/* <Header /> */}
      <div className=" min-h-[100dvh ]py-8 flex justify-center items-center mt-10">
        <form
          onSubmit={handleFormData}
          className="card w-full max-w-[800px] flex flex-col my-8"
        >
          <div className="mt-[-4px]">{divider("Booking Details")}</div>

          <div className="row">
            <div className="w-1/3">
              {cusInput(
                "Invoice Number",
                "text",
                "invoiceNum",
                "",
                formData.invoiceNum,
                handleChange,
                true
              )}
            </div>
            <div className="w-1/3"></div>
            <div className="w-1/3"></div>
          </div>

          {divider("Journey Details")}

          <div className="row">
            <div className="w-1/3">
              {cusInput(
                "Date of Booking",
                "date",
                "dateofBooking",
                "",
                formData.dateofBooking,
                handleChange,
                true
              )}
            </div>
            <div className="w-1/3">
              {cusInput(
                "Date of Journey",
                "date",
                "dateOfJourney",
                "",
                formData.dateOfJourney,
                handleChange,
                true
              )}
            </div>
            <div className="w-1/3">
              {cusSelect(
                "Service Type",
                "service",
                formData.service,
                handleChange,
                service,
                true
              )}
            </div>
          </div>
          {formData.service === "Train Ticket" ||
          formData.service === "Flight Ticket" ? (
            <div className="row">
              <div className="w-2/3">
                {cusInput(
                  "Name",
                  "text",
                  "description",
                  "",
                  formData.description,
                  handleChange,
                  true
                )}
              </div>
              <div className="w-1/3">
                {cusInput("PNR", "text", "PNR", "", formData.PNR, handleChange)}
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="w-3/3">
                {cusInput(
                  "Name",
                  "text",
                  "description",
                  "",
                  formData.description,
                  handleChange,
                  true
                )}
              </div>
            </div>
          )}
          <div className="row">
            <div className="w-1/3">
              {cusInput(
                "System Reference",
                "text",
                "systemRef",
                "",
                formData.systemRef,
                handleChange,
                true
              )}
            </div>
            <div className="w-1/3">
              <div className="flex flex-col w-full">
                <label
                  htmlFor={name}
                  className="text-[0.85rem] font-medium ml-2 !text-yellow-600 flex items-center gap-2"
                >
                  Vendors Details
                  <span
                    className="cursor-pointer"
                    onClick={() => setPopUp(true)}
                  >
                    <LuCirclePlus />
                  </span>
                </label>
                <select
                  id={name}
                  value={formData.vendor}
                  onChange={getVendorListById}
                  className="!py-[8px]"
                  required
                >
                  <option disabled selected value="">
                    {`Select Vendors Name`}{" "}
                  </option>
                  {vName.map((option, index) => (
                    <option key={index} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-1/3">
              {cusInput(
                "Vendor GST",
                "text",
                "vendorGST",
                formData.vendorGST ? "" : "Gst Not Available",
                formData.vendorGST,
                handleChange
              )}
            </div>
          </div>
          <div className="row">
            <div className="w-1/2">
              {cusInput(
                "Departure City",
                "text",
                "depCity",
                "",
                formData.depCity,
                handleChange,
                true
              )}
            </div>
            <div className="w-1/2">
              {cusInput(
                "Arival City",
                "text",
                "arrCity",
                "",
                formData.arrCity,
                handleChange
              )}
            </div>
          </div>

          {divider("Passenger Details")}

          <div className="row">
            <div className="w-1/3">
              <div className="flex flex-col w-full">
                <label
                  htmlFor={name}
                  className="text-[0.85rem] font-medium ml-2 !text-yellow-600 flex items-center gap-2 "
                >
                  Passenger Name
                  <span
                    onClick={() => setVendorPop(true)}
                    className="cursor-pointer"
                  >
                    <LuCirclePlus />
                  </span>
                </label>
                <select
                  id={name}
                  name={name}
                  value={formData.passengerName}
                  onChange={getClientListById}
                  className="!py-[8px]"
                  required
                >
                  <option disabled selected value="">
                    {`Select Passenger Name`}{" "}
                  </option>
                  {cName.map((option, index) => (
                    <option key={index} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-1/3">
              {cusInput(
                "Payment Party",
                "text",
                "paymentParty",
                "",
                formData.paymentParty,
                handleChange
              )}
            </div>
            <div className="w-1/3">
              {cusInput(
                "Payment Party GST",
                "text",
                "paymentPartyGST",
                formData.paymentPartyGST ? "" : "Gst Not Available",
                formData.paymentPartyGST || "",
                handleChange
              )}
            </div>
          </div>

          <div className="row">
            <div className="w-1/3">
              <div className="flex flex-col w-full">
                <label
                  htmlFor={name}
                  className="text-[0.85rem] font-medium ml-2 !text-yellow-600"
                >
                  Mode of Payments by Client
                </label>
                <select
                  name="modeOfPayment"
                  value={formData.modeOfPayment}
                  onChange={handleChange}
                  className="!py-[8px]"
                >
                  <option disabled selected value="">
                    {` Mode of Payments by client`}{" "}
                  </option>
                  {modeOfPayment.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-1/3">
              {cusInput(
                "Payment date by Client",
                "date",
                "paymentdatebyclient",
                "",
                formData.paymentdatebyclient,
                handleChange
              )}
            </div>
            <div className="w-1/3">
              {cusInput(
                "Payment Amount by Client",
                "text",
                "paymenamtbyclient",
                "",
                formData.paymenamtbyclient,
                handleChange,
                false
              )}
            </div>
          </div>

          {divider("Billing Details")}

          <div className="row">
            <div className="w-1/4">
              {cusInput(
                "Net Amount",
                "text",
                "netAmount",
                "",
                formData.netAmount,
                handleChange,
                true
              )}
            </div>
            <div className="w-1/4">
              {cusInput(
                "Mark Up",
                "text",
                "markup",
                "",
                formData.markup,
                handleChange
              )}
            </div>
            {/* <div className="w-1/4">
              {cusInput(
                "GST (in %)",
                "text",
                "gst",
                "",
                formData.gst,
                handleChange
              )}
            </div> */}
            <div className="w-1/4">
              {cusInput(
                "GST Amount",
                "text",
                "gst",
                formData.gst,
                handleChange
              )}
            </div>
            <div className="w-1/4">
              {cusInput(
                "Total Amount",
                "text",
                "totalAmount",
                "",
                formData.totalAmount,
                handleChange
              )}
            </div>
          </div>

          {divider("client Details")}

          <div className="row">
            <div className="w-1/2">
              <div className="flex flex-col w-full">
                <label
                  htmlFor={name}
                  className="text-[0.85rem] font-medium ml-2 !text-yellow-600"
                >
                  Mode of Payments
                </label>
                <select
                  name="modeOfPayment"
                  value={formData.modeOfPayment}
                  onChange={handleChange}
                  className="!py-[8px]"
                  required
                >
                  <option disabled selected value="">
                    {` Mode of Payments`}{" "}
                  </option>
                  {modeOfPayment.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="w-1/3">
              {cusInput(
                "Amount",
                "text",
                "amount",
                "",
                formData.amount,
                handleChange
              )}
            </div>
            <div className="w-1/2">
              {" "}
              {cusSelect(
                "Status",
                "status",
                formData.status,
                handleChange,
                status,
                true
              )}
            </div>
          </div>

          {formData.status === "Cancelled" && (
            <>
              {divider("Refund Details")}
              <div className="row">
                <div className="w-1/4">
                  {cusInput(
                    "Refund Date",
                    "text",
                    "refundDate",
                    "",
                    formData.refundDate,
                    handleChange,
                    true
                  )}
                </div>
                <div className="w-1/4">
                  {cusInput(
                    "Refund Amount",
                    "text",
                    "refundAmount",
                    "",
                    formData.refundAmount,
                    handleChange
                  )}
                </div>
                <div className="w-1/4">
                  {cusInput(
                    "Cancel Charge",
                    "text",
                    "cancelCharge",
                    "",
                    formData.cancelCharge,
                    handleChange
                  )}
                </div>
                <div className="w-1/4">
                  {cusSelect(
                    "Refund Mode",
                    "refundMode",
                    formData.refundMode,
                    handleChange,
                    refundMode,
                    true
                  )}
                </div>
              </div>
            </>
          )}

          <div class="row flex items-center justify-center mt-4">
            <button type="submit" className="btn mt-4 w-1/4">
              {id ? "Update Existing" : "Add"}
            </button>

            {id && (
              <button
                type="submit"
                className="btn mt-4 w-1/4"
                onClick={handlenewInvocieData}
              >
                {" "}
                Add To Invoice{" "}
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default AddDetails;
