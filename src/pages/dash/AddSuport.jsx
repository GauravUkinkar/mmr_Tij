import React, { useEffect, useState } from "react";
// import Header from "../../comps/Header";
import axios from "axios";
import { RxCross2 } from "react-icons/rx";
import { CiEdit } from "react-icons/ci";

const AddSuport = () => {
  const [toggleInput, setToggleInput] = useState(false);
  const [supportData, setSupportData] = useState([]);
  const [addData, setAddData] = useState({
    name: "",
    value: [],
  });

  //get all
  const handleData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_PORT_FRONTEND}api/supportingData/getAll`
      );

      setSupportData(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  //get by id
  // const handleDataById = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${import.meta.env.VITE_PORT_FRONTEND}api/supportingData/getById?id=2`
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  //add data
  const handleAddData = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_PORT_FRONTEND}api/supportingData/add`,
        addData
      );
    } catch (error) {
      console.log(error);
    }
  };

  //update
  const handleUpdateData = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_PORT_FRONTEND}api/supportingData/update`
      );
    } catch (error) {
      console.log(error);
    }
  };

  //delete
  const handleDeleteData = async () => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_PORT_FRONTEND}api/supportingData/delete?id=1`
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleData();
  }, []);

  return (
    <>
      {/* <Header /> */}
      <div className="parent h-full">
        <div className="container flex items-center justify-center flex-wrap gap-5  !h-[100vh]">
          {supportData.map((items, index) => (
            <div
              className=" flex flex-col gap-2  p-4 rounded-md bg-white w-fit shadow"
              key={index}
            >
              <h2>{items.name}</h2>

              {items.value.map((data, index) => (
                <div class="item flex items-center gap-2" key={index}>
                  <input
                    type="text"
                    value={data}
                    disabled
                    onChange={(e) =>
                      setAddData({
                        ...addData,
                        name: e.target.value,
                      })
                    }
                  />
                  <RxCross2 />
                  <CiEdit />
                </div>
              ))}
              <div className="add-input flex items-center justify-center gap-2">
                {toggleInput && (
                  <input
                    type="text"
                    className="transition-all duration-300 px-2 py-1 border rounded"
                    placeholder="Enter something"
                  />
                )}
                <button
                  onClick={() => setToggleInput(true)}
                  className={`transition-all duration-300 rounded-md text-white ${
                    toggleInput
                      ? "h-[30px] aspect-square bg-green-700 px-2 py-1"
                      : "h-[40px] px-6 bg-green-700"
                  }`}
                >
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default AddSuport;
