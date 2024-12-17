import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

export default function Tablepat({ email }) {
  const [hospitalData, setHospitalData] = useState([]);
  const [selectedQr, setSelectedQr] = useState(null);

  useEffect(() => {
    const fetchHospitalData = async () => {
      console.log(typeof email)
      try {
        const response = await fetch("http://127.0.0.1:8000/qrhash", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }), // Ensure email is stringified as JSON
        });

        const result = await response.json();
        if (result && result.result) {
          setHospitalData(result.result); // Access the array inside `result`
        } else {
          console.error("Invalid response format:", result);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchHospitalData();
  }, [email]);

  const handleQrClick = (qrCodeData) => {
    setSelectedQr(qrCodeData);
  };

  const handleDownloadQr = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "QRCode.png";
      link.click();
    }
  };

  const sortedHospitalData = hospitalData
    .slice() // Create a shallow copy to avoid mutating state
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA; // Sort descending by date
    });

  const isExpired = (validityDate) => {
    const currentDate = new Date();
    const validity = new Date(validityDate);
    return currentDate > validity;
  };

  return (
    <div>
      <Table className="text-white w-full">
        <TableCaption>Hospital validity and QR codes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Doctor Name</TableHead>
            <TableHead>Validity Date</TableHead>
            <TableHead>QR Code (Address)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedHospitalData.map((hospital) => {
            const expired = isExpired(hospital.date);

            return (
              <TableRow
                key={hospital.transaction_address}
                className={`h-16 ${expired ? "bg-gray-600" : ""}`}
              >
                <TableCell className="font-medium">{hospital.DoctorName}</TableCell>
                <TableCell className="font-medium">{hospital.date}</TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <button
                        className={`text-blue-600 underline ${expired ? "cursor-not-allowed" : ""}`}
                        onClick={() => !expired && handleQrClick(hospital.transaction_address)}
                        disabled={expired}
                      >
                        View QR Code
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>QR Code</DialogTitle>
                        <DialogDescription>
                          Download this QR code which contains the hospital's address.
                        </DialogDescription>
                      </DialogHeader>
                      {selectedQr && (
                        <div className="flex flex-col items-center">
                          <QRCode value={selectedQr} className="mb-4" />
                          <button
                            onClick={handleDownloadQr}
                            className="inline-block bg-blue-500 text-white px-4 py-2 rounded"
                          >
                            Download QR Code
                          </button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
