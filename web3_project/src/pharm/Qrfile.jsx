import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import jsQR from "jsqr";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
  } from "../components/ui/breadcrumb";
  import { Separator } from "../components/ui/separator";
  import {
    SidebarInset,
    SidebarTrigger,
  } from "../components/ui/sidebar";

export default function Qrfile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [tablets, setTablets] = useState([{ tablet: "", count: "", times: [] }]);
  const [transactionAddress, setTransactionAddress] = useState("");
  const [error, setError] = useState("");

  // Function to handle QR Code upload and scan
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith("image/png")) {
      setError("Please upload a valid PNG file.");
      return;
    }

    try {
      const fileData = await file.arrayBuffer();
      const imageBitmap = await createImageBitmap(file);
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      canvas.width = imageBitmap.width;
      canvas.height = imageBitmap.height;
      context.drawImage(imageBitmap, 0, 0, imageBitmap.width, imageBitmap.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const qrCodeData = jsQR(imageData.data, imageData.width, imageData.height);
    //   console.log(typeof qrCodeData?.data);

      if (qrCodeData?.data) {
          setTransactionAddress(qrCodeData?.data);
          fetchPrescriptionData(qrCodeData?.data);
        } else {
          setError("QR code does not contain a valid transaction address.");
        }
    } catch (e) {
      setError("An error occurred while processing the QR code.");
      console.error(e);
    }
  };

  // Function to fetch prescription data using transaction_address
  const fetchPrescriptionData = async (address) => {
    try {
      console.log(address);
      const response = await fetch("http://localhost:8000/getData", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch prescription data.");
      }
  
      const data = await response.json();
      console.log(data);
  
      // Check if data format is valid and update state
      if (data[1] && Array.isArray(data[1])) {
        const formattedTablets = data[1].map((tablet) => ({
          name: tablet[0], // Tablet name
          count: tablet[1], // Tablet count
          times: tablet[2], // Tablet time(s)
        }));
  
        setName(data.name);
        setEmail(data.patientEmail);
        setDate(data.date);
        setTablets(formattedTablets);
        setError(""); // Clear errors on success
      } else {
        throw new Error("Invalid prescription data format.");
      }
    } catch (e) {
      setError("Failed to fetch data. Please check the server.");
      console.error(e);
    }
  };
  
  const handleCountChange = (index, newCount) => {
    const updatedTablets = [...tablets];
    updatedTablets[index].count = Number(newCount);
    setTablets(updatedTablets);
  };
  

  // Function to handle form submission
    const handleSubmit = async () => {
        console.log("Tablets Before Mapping:", tablets);
    
        // Map tablets to the expected format
        const payload = {
        name,
        patientEmail : email,
        date,
        prescription: tablets.map((t) => ({
            tablet: t.name, // Ensure this matches the backend's "tablet" field
            count: t.count,
            times: t.times,
        })),
        };
    
        console.log("Payload Sent to Backend:", payload);
    
        try {
        const response = await fetch("http://localhost:8000/submit-prescription", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
    
        const result = await response.json();
    
        if (result.ok) throw new Error("Failed to submit data.");
        console.log(result);
        alert("Prescription data submitted successfully!");
        } catch (e) {
        setError("Failed to submit data. Please try again.");
        console.error(e);
        }
    };
    
  return (
    <SidebarInset className="bg-black w-full h-full min-h-full">
            <header className="w-full flex h-16 items-center gap-2">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="bg-white -ml-1 rounded-xl" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList className="text-gray-700">
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink className="text-xl text-white">
                        QR SCANNER
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
            </div>
            </header>
    <div className=" flex items-center justify-center">
      <div className="w-[90%] max-w-5xl p-6">
        {/* QR Upload Section */}
        <div className="flex flex-col items-center mb-10 mt-10">
          <h2 className="text-2xl font-bold mb-4">Upload QR Code</h2>
          <input
            type="file"
            accept="image/png"
            onChange={handleFileUpload}
            className="bg-white border rounded p-2 w-80"
          />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {/* Prescription Form */}
        <div className="flex flex-col mt-6">
          <div className="mb-4">
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label>Patient Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <label>Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-white w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Tablet Table */}
        <Table className="bg-white w-full border-2 border-black mt-4">
          <TableHeader>
            <TableRow>
              <TableHead className="border-2 border-black">Tablet Name</TableHead>
              <TableHead className="border-2 border-black">Count</TableHead>
              <TableHead className="border-2 border-black">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tablets.map((tablet, index) => (
                <TableRow key={index}>
                <TableCell className="border-2 border-black">{tablet.name}</TableCell>
                <TableCell className="border-2 border-black">
                    <input
                    type="number"
                    value={tablet.count}
                    min={0}
                    onChange={(e) => handleCountChange(index, e.target.value)}
                    className="bg-white border rounded p-2 w-20"
                    />
                </TableCell>
                <TableCell className="border-2 border-black">
                    {tablet.times.join(", ")}
                </TableCell>
                </TableRow>
            ))}
            </TableBody>

        </Table>

        {/* Submit Button */}
        <div className="mt-6 flex justify-center">
          <Button onClick={handleSubmit}>Submit Prescription</Button>
        </div>
      </div>
    </div>
    </SidebarInset>
  );
}