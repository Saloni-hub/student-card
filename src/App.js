// App.js
import React, { useEffect, useRef, useState } from "react";
import Modal from "react-modal";
import html2canvas from "html2canvas";
import axios from "axios";
import { useReactToPrint } from "react-to-print";
import "./App.css";

const App = () => {
  const [token, setToken] = useState("");
  const [studentData, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectBatch, setBatch] = useState("");
  const [validy,setValidy] = useState("");
  const [memberId, setMemberId] = useState("");
  const containerRef = useRef(null);
  const imageRef = useRef(null);
  const modalContainerRef = useRef(null);
  const modalImageRef = useRef(null);
  const modalContentRef = useRef(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState(null);

  const { registration_number, firstname, lastname, profile_photo } =
  studentData || {};

  const data = {
    email: "dkjain86@gmail.com",
    password: "dkJain@1234",
  };

  useEffect(() => {
    axios
      .post("https://attendance.ajayvision.com/auth/token/", data)
      .then((response) => {
        setToken(response.data.access);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, []);

  const handlePreview = () => {
    setIsModalOpen(true);
  };
  
  const handleSave = () => {
    html2canvas(modalContentRef.current).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg");
      const link = document.createElement("a");
      link.href = imgData;
      link.download = `${firstname}_student_card.jpg`;
      link.click();
      link.remove();
    });
  };
  

  const handlePrint = useReactToPrint({
    content: () => modalContentRef.current,
  });

  const handleLoad = () => {
    if (token && memberId && selectBatch) {
      axios
        .get(
          `https://attendance.ajayvision.com/api/attendance/student/details/?member_id=${memberId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          setData(response.data.data.items);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      alert('Please Enter Member Id & Batch Name.')
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const batch_name = [
    "RB 01",
    "RB 02",
    "RB 03",
    "RB 04",
    "RB 05",
    "RB 06",
    "RB 07",
    "RB 08",
  ];

  const handleMouseDown = (e) => {
    setStartPosition({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (startPosition) {
      const deltaX = e.clientX - startPosition.x;
      const deltaY = e.clientY - startPosition.y;

      setPosition({
        x: position.x + deltaX,
        y: position.y + deltaY,
      });

      setStartPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setStartPosition(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();

    const newScale = scale - e.deltaY * 0.01;
    const clampedScale = Math.max(0.5, Math.min(newScale, 3));

    setScale(clampedScale);
  };

  return (
    <div className="App mx-10 mt-5">
      <div id="card">
        <div className="flex justify-between items-center border-b-[3px] pb-2 border-b-[#0057A1]">
          <img
            src="https://cdn.visionias.in/new-system-assets/images/home_page/home/vision-logo-light.svg"
            alt="logo"
          />
          <h1 className="font-bold text-[#0057A1]  pt-1 text-lg">
            STUDENT ID CARD
          </h1>
        </div>
        <div className="student-card-container p-5 flex justify-between">
          <div className="flex flex-col justify-center">
            <span className="font-bold text-[#0057A1] text-base">
              {firstname} {lastname}
            </span>
            <span className="font-semibold">Student ID {registration_number}</span>
            <span className="font-semibold">Batch no: {selectBatch}</span>
            <span className="font-semibold">Valid Upto {validy}</span>
          </div>

          <div
            className="student-img-container border border-black  w-[76px] h-[76px] my-4 overflow-hidden"
            ref={containerRef}
            onWheel={handleWheel}
          >
            {profile_photo && (
              <img
                src={profile_photo}
                alt="student-img"
                // className="w-full h-full object-fill student-img"
                ref={imageRef}
                style={{
                  transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                  transformOrigin: "top left",
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
              />
            )}
          </div>
        </div>
        <div className="flex justify-center text-[10px] items-center bg-[#0057A1] h-[20px] text-[#FCFCFC] font-normal">
          <footer>Ajayvision Education Pvt. Ltd.</footer>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="pt-3">
          <span className="text-[#3362CC] text-sm font-semibold ">Valid Upto: {validy}</span>
        </div>
        <div className="flex flex-col">
        <label className="text-[#5A7184] text-sm font-semibold pb-2">Batch NO *</label>
          <select
            className="border border-gray-500 rounded-md p-1 h-10"
            onChange={(e) => {
              setBatch(e.target.value)
              setValidy('May 2024')
            }}
          >
            <option value="">Select Batch</option>
            {batch_name.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </select>
          </div>

        <div className="flex flex-col">
        <label className="text-[#5A7184] text-sm font-semibold pb-2">Student ID*</label>
          <input
            className="border border-gray-500 rounded-md p-1 h-10"
            placeholder="Enter Member ID"
            type="text"
            value={memberId}
            onChange={(e) => setMemberId(e.target.value)}
          />
        </div>
       <div className="flex gap-5 justify-end">
       <button
          className="px-5 h-10 w-[188px] bg-[#3362CC] text-white rounded-md hover:shadow-md"
          onClick={handleLoad}
        >
          Load
        </button>
        <button
          className="px-5 h-10 w-[188px] bg-[#3362CC] text-white disabled:bg-blue-400 rounded-md hover:shadow-md"
          onClick={handlePreview}
          disabled={!registration_number}
        >
          Preview
        </button>
       </div>
      </div>

      {/* Modal for Preview */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Preview Modal"
      >
        <div>
          <div className="flex justify-between">
            <h2>Preview</h2>
            <button onClick={closeModal} className="close-button">
              &#x2715;
            </button>
          </div>
          <div
            id="preview-card"
            ref={modalContentRef}
            className="mt-5 mx-auto max-w-[305px] w-full"
          >
            <div className="flex justify-between items-center border-b-[3px] pb-2 border-b-[#0057A1]">
              <img
                src="https://cdn.visionias.in/new-system-assets/images/home_page/home/vision-logo-light.svg"
                alt="logo"
              />
              <h1 className="font-bold text-[#0057A1] text-lg">
                STUDENT ID CARD
              </h1>
            </div>
            <div className="student-card-container flex justify-between p-5">
              <div className="flex flex-col justify-center">
              <span className="font-bold text-[#0057A1] text-base">
                  {firstname} {lastname}
                </span>
                <span className="font-semibold">Student ID {registration_number}</span>
                <span className="font-semibold">Batch no: {selectBatch}</span>
                <span className="font-semibold">Valid Upto {validy}</span>
              </div>
              <div
                id="image-id"
                className="img-container border border-black w-[76px] h-[76px] overflow-hidden"
                ref={modalContainerRef}
                style={{
                  overflow: "hidden",
                  width: `${containerRef.current?.clientWidth}px`,
                  height: `${containerRef.current?.clientHeight}px`,
                }}
              >
                {profile_photo && (
                  <img
                    src={profile_photo}
                    alt="student-img"
                    // className="w-full h-full object-fill"
                    ref={modalImageRef}
                    style={{
                      transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                      transformOrigin: "top left",
                    }}
                  />
                )}
              </div>
            </div>
            <div className="flex justify-center text-[10px] items-center bg-[#0057A1] h-[20px] text-[#FCFCFC] font-normal">
              <footer>Ajayvision Education Pvt. Ltd.</footer>
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-5 mx-auto max-w-[305px] w-full">
          <button
          className="px-14 h-10  bg-[#3362CC] text-white rounded-md hover:shadow-md"
          onClick={() => handleSave(modalContentRef.current)}
          >
            Save
          </button>
          <button
          className="px-14 h-10  bg-[#3362CC] text-white rounded-md hover:shadow-md"
          onClick={() => handlePrint(modalContentRef.current)}
          >
            Print
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default App;
