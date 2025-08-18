require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const { runPuppeteerLogic } = require("./Internshala");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.post("/submit", upload.single("resume"), async (req, res) => {
  const { email, password } = req.body;
  const resumePath = path.resolve(__dirname, req.file.path);

  try {
    const buffer = fs.readFileSync(resumePath);
    const pdfData = await pdfParse(buffer);
    const resumeSummary = pdfData.text.slice(0, 1500);

    const result = await runPuppeteerLogic({
      email,
      password,
      resumeSummary,
      apiKey: process.env.API_KEY,
    });

    res.send(`<pre>${result}</pre>`);
  } catch (err) {
    console.error("❌ Server Error:", err);
    res.status(500).send("Something went wrong. Check the server logs.");
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});
