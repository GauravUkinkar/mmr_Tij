import React, { useContext, useEffect, useState } from "react";
import Input from "../../comps/Input";
import { DataContext } from "../../Context";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const AddInvoice = () => {
  const {
    invoiceNumber,
    modeOfPayment,
    handlePaymentList,
    cName,
    handleClientList,
    handleVendorsList,
    vName,
  } = useContext(DataContext);
  const [vname, setVName] = useState("");
  const [cname, setCname] = useState("");
  const [loader, setLoader] = useState(false);
  const [clientIdData, setClientIdData] = useState([]);
  const [vendorIdData, setVendorIdData] = useState([]);
  const [popup, setPopUp] = useState(null);
  const [newmode, setNewMode] = useState("");
  const [paramsId] = useSearchParams();

  const navigate = useNavigate();
  const service = [
    "Flight Booking",
    "Hotel Booking",
    "Visa",
    "Cab Booking",
    "Train Booking",
    "Bus Booking",
    "Darshan Booking",
    "Reschedulling",
    "Activities Booking",
    "Travel Insurance",
    "Package Booking",
    "Passport"
  ];

  const status = ["Pending", "Paid", "Failed", "Cancelled"];

  const [formData, setFormData] = useState({
    status: "Pending",
    invoiceNum: invoiceNumber,
    dateofBooking: "",
    dateOfJourney: "",
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
    travelType: "",
    netAmount: "",
    markup: "",
    gst: "",
    totalAmount: 0,
    modeOfPayment: "",
    modeOfPaymentForClient: "",
    paymentdatebyclient: "",
    paymenamtbyclient: 0,
    amount: 0,
    refundDate: "",
    refundAmount: 0,
    cancelCharge: 0,
    refundMode: "",
  });

  const [files, setFiles] = useState({
    ticket: null,
    boardingPass: null,
  });

  const getVendorListById = async (e) => {
    try {
      const id = e.target.value;

      if (id === "Add New Vendor") {
        setPopUp("vendor");
        return;
      }
      const response = await axios.get(
        `${
          import.meta.env.VITE_PORT_FRONTEND
        }api/vendor/getvendorsById?vendorId=${id}`
      );
      setFormData(() => ({
        ...formData,
        vendor: id,
        vendorGST: response.data.data.gstnum || "",
      }));

      setVendorIdData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getClientListById = async (e) => {
    try {
      const id = e.target.value;

      if (id === "Add New Passenger") {
        setPopUp("Passenger");
        return;
      }
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

  // add vendor

  const addVendor = async (e) => {
    try {
      setLoader(true);
      e.preventDefault();

      const response = await axios.post(
        `${import.meta.env.VITE_PORT_FRONTEND}api/vendor/add`,
        {
          name: vname,
          contact: "",
          email: "",
        }
      );

      if (response.status === 201) {
        handleVendorsList();
        setPopUp(false);
        setFormData((prev) => ({
          ...prev,
          vendor: vname,
        }));

        setVName("");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  // add passenger

  const addPassenger = async (e) => {
    try {
      setLoader(true);
      e.preventDefault();

      const response = await axios.post(
        `${import.meta.env.VITE_PORT_FRONTEND}api/client/add`,
        {
          name: cname,
          contact: "",
          email: "",
          address: "",
        }
      );

      if (response.status === 201) {
        handleClientList();
        setPopUp(false);
        setFormData((prev) => ({
          ...prev,
          passengerName: cname,
        }));

        setCname("");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoader(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  const handleBlur = (e) => {
    const cleanedValue = e.target.value.trim();

    if (cleanedValue === "Add New Mode of Payment") {
      setPopUp("Mode of payment");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: cleanedValue,
    }));
  };

  const getMasterDataById = async (id) => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_PORT_FRONTEND
        }api/master/getmasterDatabyid?masterId=${id}`
      );
      console.log(response.data.data);
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
        travelType: response.data.data.travelType,
        netAmount: response.data.data.netAmount,
        markup: response.data.data.markup,
        gst: response.data.data.gst,
        totalAmount: response.data.data.totalAmount,
        modeOfPaymentForClient: response.data.data.modeOfPaymentForClient,
        paymentdatebyclient: response.data.data.paymentdatebyclient,
        paymenamtbyclient: response.data.data.paymenamtbyclient,

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
  // add invoice

  const handleFormData = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);
      const formdata = new FormData();

      formdata.append("parsedData", JSON.stringify(formData));
      formdata.append("ticket", files.ticket);
      formdata.append("boardingPass", files.boardingPass);
      if (id) {
        await axios.put(
          `${
            import.meta.env.VITE_PORT_FRONTEND
          }api/master/editMasterData?masterId=${id}`,
          formdata
        );
      } else {
        await axios.post(
          `${import.meta.env.VITE_PORT_FRONTEND}api/master/add`,
          formdata
        );
      }

      alert(id ? "Data updated successfully" : "Data added successfully");
      navigate("/");
      window.location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const markup = parseFloat(formData.markup) || 0;
    const netAmount = parseFloat(formData.netAmount) || 0;
    const gst = (5 / 100) * markup;

    setFormData({
      ...formData,
      gst: gst,
      totalAmount: Math.round(netAmount + markup + gst),
    });
  }, [formData.netAmount, formData.markup]);

  const selectChange = (e) => {
    const selectedValue = e.target.value;

    // Update formData.status
    setFormData((prev) => ({
      ...prev,
      status: selectedValue,
    }));

    // Optionally show popup
    if (selectedValue === "Cancelled") {
      setPopUp("cancelled");
    } else {
      setPopUp("");
    }
  };

  useEffect(() => {
    if (formData.status === "Cancelled") {
      setPopUp("cancelled");
    }
  }, [formData.status]);

  const handlenewInvocieData = async (e) => {
    e.preventDefault();
    try {
      setLoader(true);

      const InvoiceDatadata = new FormData();

      InvoiceDatadata.append("parsedData", JSON.stringify(formData));
      InvoiceDatadata.append("ticket", files.ticket);
      InvoiceDatadata.append("boardingPass", files.boardingPass);
      await axios.post(
        `${import.meta.env.VITE_PORT_FRONTEND}api/master/addInvoice`,
        InvoiceDatadata
      );

      alert("Added new Invoice");
      navigate("/");
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(true);
    }
  };

  const addModePayment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PORT_FRONTEND}api/payments/add`,
        {
          name: newmode,
        }
      );

      if (response.status === 201) {
        alert("Added new Invoice");
        handlePaymentList();
        setPopUp("");

        if (formData.modeOfPayment !== "") {
          setFormData((prev) => ({
            ...prev,
            modeOfPaymentForClient: newmode,
          }));
        } else {
          setFormData((prev) => ({
            ...prev,
            modeOfPayment: newmode,
          }));
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {popup === "vendor" && (
        <div class="popup w-full h-full fixed top-0 left-0 z-50  flex justify-center items-center">
          <div
            class="overlay bg-black opacity-50 absolute w-full h-full top-0 left-0 "
            onClick={() => setPopUp("")}
          ></div>

          <form
            action=""
            className="relative z-10 bg-white p-4 w-[400px] h=[300px] flex flex-col gap-4"
            onSubmit={addVendor}
          >
            <Input
              label="Vendor Name"
              required={true}
              value={vname}
              onChange={(e) => setVName(e.target.value)}
              onBlur={handleBlur}
            />
            <button class="btn" type="submit">
              {loader ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      )}
      {popup === "Passenger" && (
        <div class="popup w-full h-full fixed top-0 left-0 z-50  flex justify-center items-center">
          <div
            class="overlay bg-black opacity-50 absolute w-full h-full top-0 left-0 "
            onClick={() => setPopUp("")}
          ></div>

          <form
            action=""
            className="relative z-10 bg-white p-4 w-[400px] h=[300px] flex flex-col gap-4"
            onSubmit={addPassenger}
          >
            <Input
              label="Passenger Name"
              required={true}
              value={cname}
              onChange={(e) => setCname(e.target.value)}
            />
            <button class="btn" type="submit">
              {loader ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      )}
      {popup === "Mode of payment" && (
        <div class="popup w-full h-full fixed top-0 left-0 z-50  flex justify-center items-center">
          <div
            class="overlay bg-black opacity-50 absolute w-full h-full top-0 left-0 "
            onClick={() => setPopUp("")}
          ></div>

          <form
            action=""
            className="relative z-10 bg-white p-4 w-[400px] h=[300px] flex flex-col gap-4"
            onSubmit={addModePayment}
          >
            <Input
              label="Mode Of Payment"
              value={newmode}
              onChange={(e) => setNewMode(e.target.value)}
              onBlur={handleBlur}
            />
            <button class="btn" type="submit">
              {loader ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      )}

      <div className=" min-h-[100dvh ]py-8 flex justify-center items-center mt-20">
        <form
          action=""
          className="card w-full max-w-[1200px] flex flex-col my-8"
          onSubmit={handleFormData}
        >
          <p className="divider my-2">Booking Details</p>
          <div class="row">
            <div class="w-1/3">
              <Input
                label="Invoice Number"
                required={true}
                value={formData.invoiceNum}
                name="invoiceNum"
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>
          </div>
          <p class="divider my-2">Journey Details</p>
          <div class="row">
            <div class="w-1/3">
              <Input
                type="date"
                label="Date of Booking"
                required={true}
                value={formData.dateofBooking}
                name="dateofBooking"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div class="w-1/3">
              <Input
                type="date"
                label="Date of Journey"
                required={true}
                value={formData.dateOfJourney}
                name="dateOfJourney"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div class="w-1/3">
              <div className="flex flex-col w-full">
                <label className="text-[0.85rem] font-medium ml-2 !text-yellow-600">
                  Service Type <span className="!text-red-500">*</span>
                </label>
                <select
                  value={formData.service}
                  className="!py-[8px]"
                  name="service"
                  onChange={handleChange}
                >
                  <option disabled selected value="">
                    {`Select Service Type`}{" "}
                  </option>
                  {service.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {formData.service === "Train Booking" ||
          formData.service === "Flight Booking" ||
          formData.service === "Hotel Booking" ? (
            <div className="row">
              <div className="w-2/3">
                <Input
                  label="Travel Description (Train/Hotel)"
                  value={formData.description}
                  name="description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </div>
              <div className="w-1/3">
                <Input
                  label={
                    formData.service === "Hotel Booking" ? "PNR/City" : "PNR"
                  }
                  value={formData.PNR}
                  onBlur={handleBlur}
                  name="PNR"
                  onChange={handleChange}
                />
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="w-3/3">
                <Input
                  label="Travel Description (Train/Hotel)"
                  value={formData.description}
                  name="description"
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          <div class="row">
            <div class="w-1/3">
              <Input
                label="System Reference"
                required={true}
                value={formData.systemRef}
                name="systemRef"
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>
            <div class="w-1/3">
              <label
                htmlFor={name}
                className="text-[0.85rem] font-medium ml-2 !text-yellow-600"
              >
                Vendors Details <span className="!text-red-500">*</span>
              </label>
              <select
                value={formData.vendor}
                onChange={getVendorListById}
                required
                className="!py-[8px]"
              >
                <option disabled selected value="">
                  {`Vendors Details`}{" "}
                </option>
                {vName.map((option, index) => (
                  <option key={index} value={option.name}>
                    {option.name}
                  </option>
                ))}

                <option value="Add New Vendor">Add New Vendor</option>
              </select>
            </div>

            <div class="w-1/3">
              <Input
                label="Vendor GST"
                onBlur={handleBlur}
                value={formData.vendorGST}
                name="vendorGST"
                onChange={handleChange}
                placeholder={!vendorIdData?.gstNumber && "Gst Not Available"}
              />
            </div>
          </div>
          <div class="row">
            <div class="w-1/2">
              <Input
                label="Departure City"
                required={true}
                value={formData.depCity}
                name="depCity"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div class="w-1/2">
              <Input
                label="Arival City"
                required={true}
                value={formData.arrCity}
                name="arrCity"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </div>

          <p class="divider my-2">Passenger Details</p>

          <div class="row">
            <div class="w-1/3">
              <label
                htmlFor={name}
                className="text-[0.85rem] font-medium ml-2 !text-yellow-600"
              >
                Passenger Name <span className="!text-red-500">*</span>
              </label>
              <select
                value={formData.passengerName}
                onChange={getClientListById}
                required
                className="!py-[8px]"
              >
                <option disabled selected value="">
                  {`Passenger Details`}{" "}
                </option>
                {cName.map((option, index) => (
                  <option key={index} value={option.name}>
                    {option.name}
                  </option>
                ))}

                <option value="Add New Passenger">Add New Passenger</option>
              </select>
            </div>
            <div class="w-1/3">
              <label
                htmlFor={name}
                className="text-[0.85rem] font-medium ml-2 !text-yellow-600"
              >
                Payment Party
              </label>
              <select
                value={formData.paymentParty}
                required
                className="!py-[8px]"
                name="paymentParty"
                onChange={handleChange}
              >
                <option disabled selected value="">
                  {`Payment Party`}{" "}
                </option>
                {cName.map((option, index) => (
                  <option key={index} value={option.name}>
                    {option.name}
                  </option>
                ))}
              </select>
            </div>
            <div class="w-1/3">
              <label
                htmlFor={name}
                className="text-[0.85rem] font-medium ml-2 !text-yellow-600"
              >
                Travel Type
              </label>
              <select
                value={formData.travelType}
                required
                className="!py-[8px]"
                name="travelType"
                onChange={handleChange}
              >
                <option disabled selected value="">
                  {`Travel Type`}{" "}
                </option>

                <option value="Domestic">Domestic</option>
                <option value="International">International</option>
              </select>
            </div>
          </div>

          <p class="divider my-2">Billing Details</p>

          <div class="row">
            <div class="w-1/4">
              <Input
                label="Net Amount"
                required={true}
                value={formData.netAmount}
                onBlur={handleBlur}
                name="netAmount"
                onChange={handleChange}
              />
            </div>
            <div class="w-1/4">
              <Input
                label="Mark Up"
                value={formData.markup}
                name="markup"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div class="w-1/4">
              <Input
                label="GST Amount"
                value={formData.gst || 0}
                name="gst"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div class="w-1/4">
              <Input
                label="Total Amount"
                value={formData.totalAmount || 0}
                name="totalAmount"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div class="w-1/4">
              <label className="text-[0.85rem] font-medium ml-2 !text-yellow-600">
                Payments By
              </label>
              <select
                value={formData.modeOfPayment}
                required
                className="!py-[8px]"
                name="modeOfPayment"
                onChange={handleChange}
              >
                <option disabled selected value="">
                  {`Payments By`}{" "}
                </option>
                {modeOfPayment.map((option, index) => (
                  <option key={index} value={option.name}>
                    {option.name}
                  </option>
                ))}

                <option value="Add New Mode of Payment">
                  Add New Mode of Payment
                </option>
              </select>
            </div>
          </div>

          <p class="divider my-2">Client Payment Details</p>
          <div class="row">
            <div class="w-1/4">
              <label className="text-[0.85rem] font-medium ml-2 !text-yellow-600">
                Mode of Payments
              </label>
              <select
                value={formData.modeOfPaymentForClient}
                className="!py-[8px]"
                name="modeOfPaymentForClient"
                onChange={handleChange}
              >
                <option disabled selected value="">
                  {`Mode Of Payments`}{" "}
                </option>
                {modeOfPayment.map((option, index) => (
                  <option key={index} value={option.name}>
                    {option.name}
                  </option>
                ))}
                <option value="Add New Mode of Payment">
                  Add New Mode of Payment
                </option>
              </select>
            </div>

            <div class="w-1/4">
              <Input
                label="Payment date "
                type="date"
                value={formData.paymentdatebyclient}
                name="paymentdatebyclient"
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            <div class="w-1/4">
              <Input
                label=" Amount "
                value={formData.paymenamtbyclient}
                name="paymenamtbyclient"
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>
            <div class="w-1/4">
              <label className="text-[0.85rem] font-medium ml-2 !text-yellow-600">
                Status
              </label>
              <select
                value={formData.status}
                onChange={selectChange}
                required
                className="!py-[8px]"
                name="status"
              >
                {status.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {popup === "cancelled" && (
            <div class="row">
              <div class="w-1/4">
                <Input
                  label="Refund Date"
                  type="date"
                  value={formData.refundDate}
                  name="refundDate"
                  onChange={handleChange}
                />
              </div>
              <div class="w-1/4">
                <Input
                  label="Refund Amount"
                  value={formData.refundAmount}
                  name="refundAmount"
                  onChange={handleChange}
                />
              </div>
              <div class="w-1/4">
                <Input
                  label="Cancel Charge"
                  value={formData.cancelCharge}
                  name="cancelCharge"
                  onChange={handleChange}
                />
              </div>
              <div class="w-1/4">
                <label className="text-[0.85rem] font-medium ml-2 !text-yellow-600">
                  Refund Mode
                </label>
                <select
                  value={formData.refundMode}
                  name="refundMode"
                  onChange={handleChange}
                  required
                  className="!py-[8px]"
                >
                  <option value=""> Refund Mode </option>
                  {modeOfPayment.map((option, index) => (
                    <option key={index} value={option.name}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <p className="divider my-2">Documents</p>

          <div class="row">
            <div class="w-1/2">
              <label
                className="text-[0.85rem] font-medium ml-2 !text-yellow-600"
                for=""
              >
                Add Ticket
              </label>
              <input
                type="file"
                onChange={(e) =>
                  setFiles({ ...files, ticket: e.target.files[0] })
                }
              />
            </div>
            <div class="w-1/2">
              <label
                className="text-[0.85rem] font-medium ml-2 !text-yellow-600"
                for=""
              >
                Boarding Pass
              </label>
              <input
                type="file"
                onChange={(e) =>
                  setFiles({ ...files, boardingPass: e.target.files[0] })
                }
              />
            </div>
          </div>

          <div class="row flex items-center justify-center mt-4">
            <button
              type="submit"
              class="btn mt-4 w-1/4 text-center"
              disabled={loader}
            >
              {loader
                ? "Please Wait ..."
                : id
                ? "Update Invoice"
                : "Add Invoice"}
            </button>

            {id && (
              <button
                onClick={handlenewInvocieData}
                class="btn mt-4 w-1/4 text-center"
              >
                Add To Invoice
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default AddInvoice;
