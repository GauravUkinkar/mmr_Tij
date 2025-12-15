import axios from "axios";
import { Children, createContext, useEffect, useState } from "react";

export const DataContext = createContext();

const ContextProvider = ({ children }) => {
  const [invoiceNumber, setInvoiceNumber] = useState(
    localStorage.getItem("invoiceNumber")
  );

  const [modeOfPayment, setModeOfPayment] = useState([]);
  const [cName, setCName] = useState([]);
  const [vName, setVName] = useState([]);
  const [getYear, setGetYear] = useState([]);
  const [indata, setinData] = useState([]);
  const [currYear, setCurrYear] = useState();
  const [excelData, setExeclData] = useState();

  useEffect(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    let financYear;

    if (currentMonth >= 4) {
      financYear = `${currentYear}-${(currentYear + 1).toString()}`;
    } else {
      financYear = `${currentYear - 1}-${currentYear.toString()}`;
    }

    setCurrYear(financYear);
  }, []);

  function formatNumber(
    value,
    locale = "en-IN",
    minFraction = 2,
    maxFraction = 2
  ) {
    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: minFraction,
      maximumFractionDigits: maxFraction,
    }).format(Number(value));
  }

  const getAllData = async (value) => {
    try {
      const data = await axios.get(
        `${
          import.meta.env.VITE_PORT_FRONTEND
        }api/master/getAllMasterData?year=${value}`
      );

      const invoiceData = data.data;



      const invoice = invoiceData.latestInovice;
      const [prefix, numberPart] = invoice.split("/");
      const incrementedNumber = String(parseInt(numberPart, 10) + 1).padStart(
        3,
        "0"
      );
      const newInvoice = `${prefix}/${incrementedNumber}`;
      localStorage.setItem("invoiceNumber", newInvoice);

      setInvoiceNumber(newInvoice);

      const fomrattedData = invoiceData?.filterdData
        ?.sort((a, b) => {
          const numA = parseInt(a.invoiceNum?.split("/")?.[1] || "0");
          const numB = parseInt(b.invoiceNum?.split("/")?.[1] || "0");
          return numB - numA; // For ascending order
          // return numB - numA; // For descending order
        })
        .map((item) => ({
          masterId: item?.masterId,
          dateofBooking: item.dateofBooking,
          dateOfJourney: item.dateOfJourney,
          // entryCreatedOn: item.entryCreatedOn.split("T")[0],

          invoiceNum: item.invoiceNum,
          passengerName: item.passengerName,
          paymentParty: item.paymentParty,
          paymentPartyGST: item.paymentPartyGST || "not specified",
          systemRef: item.systemRef,
          vendor: item.vendor,
          service: item.service,
          description: item.description,
          PNR: item.PNR,
          depCity: item.depCity,
          arrCity: item.arrCity,
          modeOfPaymentForClient:
            item.modeOfPaymentForClient || "not specified",

          netAmount: formatNumber(item.netAmount, "en-IN", 2, 2) || 0,
          markup: formatNumber(item.markup, "en-IN", 2, 2) || "not specified",
          gst: formatNumber(item.gst, "en-IN", 2, 2) || "not specified",
          totalAmount: formatNumber(item.totalAmount, "en-IN", 2, 2) || 0,
          paymentdatebyclient: item.paymentdatebyclient || "not specified",
          paymenamtbyclient:
            formatNumber(item.paymenamtbyclient, "en-IN", 2, 2) || 0,
          travelType: item.travelType || "not specified",
          modeOfPayment: item.modeOfPayment || "not specified",

          status: item.status,
          refundDate: item.refundDate || "not specified",
          refundAmount: item.refundAmount || "not specified",
          refundMode: item.refundMode || "not specified",

          //  vendorGST: item.vendorGST || "not specified",

          cancelCharge: item.cancelCharge || "not specified",
          ticket: item.ticket || null,
          boardingPass: item.boardingPass || null,
        }));

      setExeclData(
        invoiceData.filterdData
          ?.sort((a, b) => {
            const numA = parseInt(a.invoiceNum?.split("/")?.[1] || "0");
            const numB = parseInt(b.invoiceNum?.split("/")?.[1] || "0");
            return numB - numA; // For ascending order
            // return numB - numA; // For descending order
          })
          .map((item) => ({
            masterId: item?.masterId,
            dateofBooking: item.dateofBooking,
            dateOfJourney: item.dateOfJourney,
            // entryCreatedOn: item.entryCreatedOn.split("T")[0],

            invoiceNum: item.invoiceNum,
            passengerName: item.passengerName,
            service: item.service,
            vendor: item.vendor,
            systemRef: item.systemRef,
            description: item.description,
            PNR: item.PNR || "not specified",
            depCity: item.depCity,
            arrCity: item.arrCity,
            modeOfPayment: item.modeOfPayment || "not specified",
            netAmount:
              item.netAmount % 1 === 0
                ? parseInt(item.netAmount)
                : item.netAmount || 0,

            markup:
              item.markup % 1 === 0 ? parseInt(item.markup) : item.markup || 0,

            gst: item.gst % 1 === 0 ? parseInt(item.gst) : item.gst || 0,

            totalAmount:
              item.totalAmount % 1 === 0
                ? parseInt(item.totalAmount)
                : item.totalAmount || 0,

            paymenamtbyclient:
              item?.paymenamtbyclient != null
                ? item.paymenamtbyclient % 1 === 0
                  ? parseInt(item.paymenamtbyclient)
                  : item.paymenamtbyclient
                : 0,

            modeOfPaymentForClient:
              item.modeOfPaymentForClient || "not specified",
            paymentParty: item.paymentParty,
            travelType: item.travelType || "not specified",
            paymentdatebyclient: item.paymentdatebyclient || "not specified",

            status: item.status,
            refundDate: item.refundDate || "not specified",
            refundAmount: item.refundAmount % 1 === 0 ? parseInt(item.refundAmount) : item.refundAmount || 0,
            refundMode: item.refundMode || "not specified",

            //  vendorGST: item.vendorGST || "not specified",

            cancelCharge: item.cancelCharge % 1 === 0 ? parseInt(item.cancelCharge) : item.cancelCharge || 0,
            ticket: item.ticket || null,
            boardingPass: item.boardingPass || null,
          }))
      );

      setinData(fomrattedData);

      return invoiceData;
    } catch (error) {
      console.log(error);
    }
  };

  const handleVendorsList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PORT_FRONTEND}api/vendor/getAllvendors`
      );

      setVName(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClientList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PORT_FRONTEND}api/client/getAllClient`
      );

      setCName(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  const handlePaymentList = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PORT_FRONTEND}api/payments/getAllPayments`
      );

      setModeOfPayment(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllYear = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PORT_FRONTEND}api/master/getAllYear`
      );

      setGetYear(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (currYear) {
      getAllData(currYear);
    }
  }, [currYear]);

  useEffect(() => {
    getAllYear();
    handleVendorsList();
    handleClientList();
    handlePaymentList();
  }, []);

  return (
    <DataContext.Provider
      value={{
        getAllData,
        invoiceNumber,
        handleVendorsList,
        handleClientList,
        cName,
        vName,
        handlePaymentList,
        modeOfPayment,
        getYear,
        indata,
        excelData,
        setExeclData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default ContextProvider;
