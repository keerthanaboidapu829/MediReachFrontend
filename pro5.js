// server.js
import express from "express";
import cors from "cors";
import multer from "multer";

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const MOCK_STORES = [
  { name: "City Hospital", type: "hospital", lat: 17.385, lng: 78.486 },
  { name: "Green Pharmacy", type: "pharmacy", lat: 17.387, lng: 78.489 },
  { name: "Downtown Clinic", type: "clinic", lat: 17.382, lng: 78.484 },
];

const MOCK_INVENTORY = {
  "Green Pharmacy": ["paracetamol", "ibuprofen", "amoxicillin"],
  "City Hospital": ["paracetamol", "iv-fluids"],
  "Downtown Clinic": ["paracetamol"],
};

// GET nearby
app.get("/api/nearby", (req, res) => {
  const { type } = req.query;
  const results = MOCK_STORES.filter((p) => !type || p.type === type);
  res.json(results);
});

// POST check medicine
app.post("/api/checkMedicine", (req, res) => {
  const { name } = req.body;
  const results = Object.entries(MOCK_INVENTORY).filter(([store, meds]) =>
    meds.some((m) => m.toLowerCase().includes(name.toLowerCase()))
  );
  res.json(
    results.length
      ? results.map(([s, meds]) => ({ store: s, meds }))
      : [{ error: `No stores have ${name}` }]
  );
});

// POST symptoms
app.post("/api/symptoms", (req, res) => {
  const { text } = req.body;
  let response = { precautions: "Rest and stay hydrated.", medicine: "Paracetamol" };
  if (text.includes("cough")) response = { precautions: "Warm fluids, rest", medicine: "Cough syrup" };
  if (text.includes("pain")) response = { precautions: "Apply ice pack", medicine: "Ibuprofen" };
  res.json(response);
});

// POST injury image
app.post("/api/injury", upload.single("image"), (req, res) => {
  // Mock injury recognition
  res.json({
    bodyPart: "Arm",
    precautions: "Apply antiseptic and wrap dressing.",
    suggestedHospital: "City Hospital",
  });
});

app.listen(3000, () => console.log("✅ NearbyCare backend running on http://localhost:3000"));
