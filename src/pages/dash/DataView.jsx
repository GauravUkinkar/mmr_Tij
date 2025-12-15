import React, { useContext, useEffect, useState } from "react";
import DynamicTable from "../../comps/Table";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Value } from "sass";
import { DataContext } from "../../Context";
import { DatePicker, Table } from "antd";
import moment from "moment";

import { FaRegFilePdf } from "react-icons/fa";
import { Tooltip } from "react-tooltip";
import ExportDataToExcel from "../../comps/ExportData";

const DataView = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState({});
  const [activeRowKey, setActiveRowKey] = useState(null);

  const [filteredData, setFilteredData] = useState([]);

  const parseNumber = (value) => {
    return parseFloat((value || "0").toString().replace(/,/g, ""));
  };

  const [total, setTotalAmt] = useState({
    invoiceAmount: 0,
    clientAmount: 0,
    balanceAmount: 0,
  });

  const { getAllData, getYear, indata, excelData, setExeclData } =
    useContext(DataContext);

  useEffect(() => {
    if (!indata || indata.length === 0) return;

    const passengerName = [
      ...new Set(indata.map((item) => item.passengerName)),
    ]?.map((value) => ({
      text: value?.toString(),
      value: value?.toString(),
    }));

    const vendor = [...new Set(indata.map((item) => item.vendor))]?.map(
      (value) => ({
        text: value?.toString(),
        value: value?.toString(),
      })
    );

    const paymentParty = [
      ...new Set(indata.map((item) => item.paymentParty)),
    ]?.map((value) => ({
      text: value?.toString(),
      value: value?.toString(),
    }));

    setFilter({
      passengerName,
      vendor,
      paymentParty,
    });

    const TotalinvoiceAmount = indata?.reduce(
      (sum, total) => sum + parseNumber(total?.totalAmount),
      0
    );

    const TotalClientAmount =
      indata?.reduce(
        (sum, total) => sum + parseNumber(total?.paymenamtbyclient),
        0
      ) +
      indata?.reduce((sum, total) => sum + parseNumber(total?.refundAmount), 0);
    setTotalAmt((prev) => ({
      ...prev,
      invoiceAmount: `${TotalinvoiceAmount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      })}`,
      clientAmount: `${TotalClientAmount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      })}`,
      balanceAmount: `${(TotalinvoiceAmount - TotalClientAmount).toLocaleString(
        "en-IN",
        { minimumFractionDigits: 2 }
      )}`,
    }));
  }, [indata]);

  useEffect(() => {
    const TotalinvoiceAmount = filteredData?.reduce(
      (sum, total) => sum + parseNumber(total?.totalAmount),
      0
    );

    const TotalClientAmount =
      filteredData?.reduce(
        (sum, total) => sum + parseNumber(total?.paymenamtbyclient),
        0
      ) +
      filteredData?.reduce(
        (sum, total) => sum + parseNumber(total?.refundAmount),
        0
      );

    setTotalAmt((prev) => ({
      ...prev,
      invoiceAmount: `${TotalinvoiceAmount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      })}`,
      clientAmount: `${TotalClientAmount.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
      })}`,
      balanceAmount: `${(TotalinvoiceAmount - TotalClientAmount).toLocaleString(
        "en-IN",
        { minimumFractionDigits: 2 }
      )}`,
    }));
  }, [filteredData]);

  const navigatetoAddData = (id) => {
    navigate(`/add-invoice?masterId=${id}`);
  };

  const deleteData = async (id) => {
    try {
      const confirm = window.confirm(
        "Are you sure you want to delete this data?"
      );
      if (!confirm) return;
      const data = await axios.delete(
        `${
          import.meta.env.VITE_PORT_FRONTEND
        }api/master/deleteMasterData?masterId=${id}`
      );

      if (data.status === 201) {
        alert("data deleted successfully");

        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const { RangePicker } = DatePicker;
  const [bookingDateRange, setBookingDateRange] = useState([]);

  const columns = [
    {
      title: "Booking Date",
      dataIndex: "dateofBooking",
      key: "dateofBooking",
      fixed: "left",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        const parsedRange = selectedKeys.length
          ? JSON.parse(selectedKeys[0])
          : [];

        return (
          <div style={{ padding: 8 }}>
            <RangePicker
              defaultValue={
                parsedRange.length
                  ? [moment(parsedRange[0]), moment(parsedRange[1])]
                  : null
              }
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  const formatted = [
                    dates[0].format("YYYY-MM-DD"),
                    dates[1].format("YYYY-MM-DD"),
                  ];
                  setSelectedKeys([JSON.stringify(formatted)]);
                  setBookingDateRange(formatted);
                } else {
                  clearFilters();
                  setBookingDateRange([]);
                }
              }}
              style={{ marginBottom: 8, display: "block" }}
            />
            <div style={{ textAlign: "right" }}>
              <a onClick={() => confirm()} style={{ marginRight: 8 }}>
                Filter
              </a>
              <a
                onClick={() => {
                  clearFilters();
                  setBookingDateRange([]);
                }}
              >
                Reset
              </a>
            </div>
          </div>
        );
      },
      onFilter: (value, record) => {
        try {
          const [start, end] = JSON.parse(value);
          const recordDate = moment(record.dateofBooking, "YYYY-MM-DD");
          return (
            recordDate.isSameOrAfter(moment(start)) &&
            recordDate.isSameOrBefore(moment(end))
          );
        } catch (err) {
          console.error("Date Filter Error:", err);
          return true;
        }
      },
    },
    {
      title: "Date of Journey",
      dataIndex: "dateOfJourney",
      key: "dateOfJourney",

      width: "auto",
      // fixed: "left",
          filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => {
        const parsedRange = selectedKeys.length
          ? JSON.parse(selectedKeys[0])
          : [];

        return (
          <div style={{ padding: 8 }}>
            <RangePicker
              defaultValue={
                parsedRange.length
                  ? [moment(parsedRange[0]), moment(parsedRange[1])]
                  : null
              }
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  const formatted = [
                    dates[0].format("YYYY-MM-DD"),
                    dates[1].format("YYYY-MM-DD"),
                  ];
                  setSelectedKeys([JSON.stringify(formatted)]);
                  setBookingDateRange(formatted);
                } else {
                  clearFilters();
                  setBookingDateRange([]);
                }
              }}
              style={{ marginBottom: 8, display: "block" }}
            />
            <div style={{ textAlign: "right" }}>
              <a onClick={() => confirm()} style={{ marginRight: 8 }}>
                Filter
              </a>
              <a
                onClick={() => {
                  clearFilters();
                  setBookingDateRange([]);
                  window.location.reload();
                }}
              >
                Reset
              </a>
            </div>
          </div>
        );
      },
      onFilter: (value, record) => {
        try {
          const [start, end] = JSON.parse(value);
          const recordDate = moment(record.dateOfJourney, "YYYY-MM-DD");
          return (
            recordDate.isSameOrAfter(moment(start)) &&
            recordDate.isSameOrBefore(moment(end))
          );
        } catch (err) {
          console.error("Date Filter Error:", err);
          return true;
        }
      },
    },

    {
      title: "Invoice Number",
      dataIndex: "invoiceNum",
      key: "invoiceNum",
      searchable: true,
      width: "auto",
      fixed: "left",
    },

    {
      title: "Client Name",
      dataIndex: "passengerName",
      key: "passengerName",
      filters: filter?.passengerName,
      onFilter: (value, record) => record.passengerName === value,

      // onFilter: (value, record) => record.passengerName.filter((value)=> includes(value)),
      width: "5%",
      fixed: "left",
    },
    {
      title: "Client Payment Name",
      dataIndex: "paymentParty",
      key: "paymentParty",
      filters: filter?.paymentParty,
      onFilter: (value, record) => record.paymentParty.includes(value),
      width: "5%",
      // fixed: "left",
    },
    {
      title: "Travel Type",
      dataIndex: "service",
      key: "service",
      searchable: true,
      width: "auto",
    },

    {
      title: "Portal of Booking",
      dataIndex: "vendor",
      key: "vendor",
      filters: filter?.vendor,
      onFilter: (value, record) => record.vendor.includes(value),
      width: "auto",
    },
    {
      title: "System Reference",
      dataIndex: "systemRef",
      key: "systemRef",
      searchable: true,
      width: "5%",
    },

    {
      title: "Flight / Hotel",
      dataIndex: "description",
      key: "description",
      searchable: true,
      width: "5%",
    },
    {
      title: "PNR",
      dataIndex: "PNR",
      key: "PNR",
      searchable: true,
      width: "auto",
    },
    {
      title: "Departure City",
      dataIndex: "depCity",
      key: "depCity",
      searchable: true,
      width: "auto",
    },
    {
      title: "Arrival City",
      dataIndex: "arrCity",
      key: "arrCity",
      searchable: true,
      width: "auto",
    },

    {
      title: "Mode of Payment",
      dataIndex: "modeOfPayment",
      key: "modeOfPayment",
      searchable: true,
      width: "auto",
    },
    {
      title: "Net Purchase",
      dataIndex: "netAmount",
      key: "netAmount",
      searchable: true,
      width: "auto",
    },
    {
      title: "Markup",
      dataIndex: "markup",
      key: "markup",
      searchable: true,
      width: "auto",
    },

    {
      title: "(+) 5% GST",
      dataIndex: "gst",
      key: "gst",
      searchable: true,
      width: "auto",
    },

    {
      title: "Invoice Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      searchable: true,
      width: "auto",
    },
    {
      title: "Credit Amount",
      dataIndex: "paymenamtbyclient",
      key: "paymenamtbyclient",
      searchable: true,
      width: "auto",
    },
    {
      title: "Client Payment Mode",
      dataIndex: "modeOfPaymentForClient",
      key: "modeOfPaymentForClient",
      searchable: true,
      width: "auto",
    },

    {
      title: "Domestic/International",
      dataIndex: "travelType",
      key: "travelType",
      searchable: true,
      width: "auto",
    },

    {
      title: "Credit Date",
      dataIndex: "paymentdatebyclient",
      key: "paymentdatebyclient",
      searchable: true,
      width: "auto",
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      searchable: true,
      width: "auto",
    },

    {
      title: "Refund Date",
      dataIndex: "refundDate",
      key: "refundDate",
      searchable: true,
      width: "auto",
    },

    {
      title: "Refund Amount",
      dataIndex: "refundAmount",
      key: "refundAmount",
      searchable: true,
      width: "auto",
    },

    {
      title: "Refund Mode",
      dataIndex: "refundMode",
      key: "refundMode",
      searchable: true,
      width: "auto",
    },

    // {
    //   title: "Vendor GST",
    //   dataIndex: "vendorGST",
    //   key: "vendorGST",
    //   searchable: true,
    //   width: "auto",
    // },

    {
      title: "Cancel Charge",
      dataIndex: "cancelCharge",
      key: "cancelCharge",
      searchable: true,
      width: "auto",
    },
    {
      title: "Documents",
      dataIndex: "documents",
      key: "documents",
      width: "auto",
      render: (_, record) => {
        return (
          <div
            style={{
              display: "flex",
              gap: "10px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Tooltip id="my-tooltip" />

            {record.ticket !== null && (
              <a
                href={record.ticket}
                target="_blank"
                data-tooltip-id="my-tooltip"
                data-tooltip-content="Ticket"
                style={{ fontSize: "30px" }}
              >
                <FaRegFilePdf />
              </a>
            )}
            <Tooltip id="my-tooltip-borading" />
            {record.boardingPass !== null && (
              <a
                href={record.boardingPass}
                target="_blank"
                style={{ fontSize: "30px" }}
                data-tooltip-id="my-tooltip-borading"
                data-tooltip-content="Boarding Pass"
              >
                <FaRegFilePdf />
              </a>
            )}
          </div>
        );
      },
    },

    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <span className="flex gap-2">
          <button
            className="bg-blue-500 !text-white px-2 py-1 rounded cursor-pointer"
            onClick={() => navigatetoAddData(record.masterId)}
          >
            Edit
          </button>
          <button
            className="bg-red-500 !text-white px-2 py-1 rounded cursor-pointer"
            onClick={() => deleteData(record.masterId)}
          >
            Delete
          </button>
        </span>
      ),
    },
  ];

  return (
    <div className="parent w-full  h-screen pt-15 ">
      <div
        className="container h-full flex flex-col gap-2"
        style={{ maxWidth: "1900px" }}
      >
        <div class="calculation flex justify-between px-4 w-full p-2 bg-white shadpw-sm">
          <div class="data">
            Invoice Amount (Debit) : <span> ₹ {total.invoiceAmount} </span>
          </div>
          <div class="data">
            Client Amount (Credit) : <span> ₹ {total.clientAmount} </span>
          </div>
          <div class="data flex flex-row-reverse justify-center items-center gap-5">
            <div class="btn" onClick={() => ExportDataToExcel(excelData)}>
              Export Data
            </div>
            <div class="dropdwon">
              <select
                className="!py-[8px]"
                onChange={(e) => getAllData(e.target.value)}
                name="year"
              >
                <option disabled selected value="">
                  {`Select Year`}{" "}
                </option>
                {getYear.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
            <div class="amt">
              Balance Amount : <span> ₹ {total.balanceAmount} </span>
            </div>
          </div>
        </div>

        <DynamicTable
          xscroll={5000}
          columns={columns}
          dataSource={indata && indata}
          rowClassName={(record) =>
            record.masterId === activeRowKey ? "custom-row-active" : ""
          }
          onRow={(record) => ({
            onClick: () => setActiveRowKey(record.masterId),
          })}
          rowKey="id"
          pagination={{
            pageSizeOptions: ["5", "10", "20", "50", "100"],
            showSizeChanger: true,
            defaultPageSize: 10,
          }}
          onChange={(pagination, filters, sorter, extra) => {
            if (extra.action === "filter") {
              const newFilteredData = extra.currentDataSource;

              const excelData = newFilteredData.map((item) => {
                return {
                  ...item,
                  netAmount: item.netAmount
                    ? parseFloat(item.netAmount.toString().replace(/,/g, "")) %
                        1 ===
                      0
                      ? parseInt(item.netAmount.toString().replace(/,/g, ""))
                      : parseFloat(item.netAmount.toString().replace(/,/g, ""))
                    : 0,

                  totalAmount: item.totalAmount
                    ? parseFloat(
                        item.totalAmount.toString().replace(/,/g, "")
                      ) %
                        1 ===
                      0
                      ? parseInt(item.totalAmount.toString().replace(/,/g, ""))
                      : parseFloat(
                          item.totalAmount.toString().replace(/,/g, "")
                        )
                    : 0,

                  markup: item.markup
                    ? parseFloat(item.markup.toString().replace(/,/g, "")) %
                        1 ===
                      0
                      ? parseInt(item.markup.toString().replace(/,/g, ""))
                      : parseFloat(item.markup.toString().replace(/,/g, ""))
                    : 0,

                  gst: item.gst
                    ? parseFloat(item.gst.toString().replace(/,/g, "")) % 1 ===
                      0
                      ? parseInt(item.gst.toString().replace(/,/g, ""))
                      : parseFloat(item.gst.toString().replace(/,/g, ""))
                    : 0,

                  cancelCharge: item.cancelCharge
                    ? parseFloat(
                        item.cancelCharge.toString().replace(/,/g, "")
                      ) %
                        1 ===
                      0
                      ? parseInt(item.cancelCharge.toString().replace(/,/g, ""))
                      : parseFloat(
                          item.cancelCharge.toString().replace(/,/g, "")
                        )
                    : 0,
                };
              });

              setFilteredData(newFilteredData);
              setExeclData(excelData);
            }
          }}
        />
      </div>
    </div>
  );
};

export default DataView;
