import { useState } from "react";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import Tabletsearch from "./Tabletsearch";

function Prescrip({ name }) {
  const [errors, setErrors] = useState({});
  const [tablets, setTablets] = useState([{ tablet: "", count: "", times: [] }]);
  const [patientEmail, setPatientEmail] = useState("");
  const [date, setDate] = useState("");

  const handleAddTablet = () => {
    setTablets([...tablets, { tablet: "", count: "", times: [] }]);
  };

  const handleTabletChange = (index, field, value) => {
    const newTablets = [...tablets];
    newTablets[index][field] = field === "times" ? value : value;
    setTablets(newTablets);
  };

  const handleRemoveTablet = (index) => {
    const newTablets = tablets.filter((_, i) => i !== index);
    setTablets(newTablets);
  };

  const handleTabletSelect = (index, tabletName) => {
    const newTablets = [...tablets];
    newTablets[index].tablet = tabletName;
    setTablets(newTablets);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(name)
    // Validate email and name
    const newErrors = {};
    if (!patientEmail.trim()) {
      newErrors.email = "Email is required.";
    }
    if (!date.trim()) {
      newErrors.date = "Date is required.";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    // Prepare JSON payload
    const payload = {
      name,
      patientEmail,
      date,
      prescription: tablets.filter((t) => t.tablet), 
    };

    console.log(payload);

    try {
      // Send to backend
      const response = await fetch("http://127.0.0.1:8000/submit-prescription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      console.log(result);
      if (!result.ok) {
        alert("Prescription submitted successfully!", result.Tx_address);
      } else {
        alert("Failed to submit prescription.");
      }
    } catch (error) {
      console.error("Error submitting prescription:", error);
    }
  };

  return (
    <Card className="w-full max-w-2xl bg-white p-6 rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle className="text-2xl">Prescription</CardTitle>
        <CardDescription>Enter patient details and prescription.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 text-black">
            <div className="grid gap-2">
              <Label htmlFor="email">Patient Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter patient email"
                value={patientEmail}
                onChange={(e) => setPatientEmail(e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="date">Prescription Date</Label>
              <Input
                id="date"
                name="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className={errors.date ? "border-red-500" : ""}
              />
              {errors.date && (
                <p className="text-red-500 text-sm">{errors.date}</p>
              )}
            </div>

            {tablets.map((tablet, index) => (
              <div key={index} className="grid gap-4 border-t pt-4 relative">
                <div className="absolute top-2 right-2 bg-red-200 rounded-2xl">
                  <X
                    type="button"
                    className="text-red-500 cursor-pointer"
                    onClick={() => handleRemoveTablet(index)}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Label>Tablet Name</Label>
                    <Tabletsearch
                      onSelect={(name) => handleTabletSelect(index, name)}
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Count</Label>
                    <Input
                      type="number"
                      placeholder="Count"
                      min={1}
                      max={100}
                      value={tablet.count}
                      onChange={(e) =>
                        handleTabletChange(index, "count", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div>
                    <Label>Time of Day</Label>
                    <div className="flex gap-44">
                      {[
                        { label: "Morning", value: "morning" },
                        { label: "Afternoon", value: "afternoon" },
                        { label: "Night", value: "night" },
                      ].map((time) => (
                        <label key={time.value} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            value={time.value}
                            checked={tablet.times.includes(time.value)}
                            onChange={(e) => {
                              const newTimes = e.target.checked
                                ? [...tablet.times, time.value]
                                : tablet.times.filter((t) => t !== time.value);
                              handleTabletChange(index, "times", newTimes);
                            }}
                          />
                          {time.label}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Button type="button" onClick={handleAddTablet} className="w-full">
              Add Another Tablet
            </Button>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

export default Prescrip;
