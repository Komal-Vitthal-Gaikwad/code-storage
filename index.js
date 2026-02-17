require("dotenv").config();

const express = require("express");
const cors = require("cors");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const OpenAI = require("openai");

const { students } = require("./data");
const { admins } = require("./admindata");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/generated", express.static("generated"));


// 🔥 Groq Setup
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

/* =========================
   STUDENT LOGIN
========================= */
app.post("/login", (req, res) => {
  let { student_id, password } = req.body;

  student_id = student_id?.trim();
  password = password?.trim();

  const student = students.find(
    (s) => s.student_id === student_id && s.password === password
  );

  if (student) {
    return res.json({
      success: true,
      student_id: student.student_id,
      name: student.name,
      phone: student.phone,
      email: student.email,
      className: student.className,
      division: student.division,
      roll_no: student.roll_no,
      temp_address: student.temp_address,
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid student credentials",
  });
});

/* =========================
   GET ALL STUDENTS
========================= */
app.get("/students", (req, res) => {
  const safeStudents = students.map(({ password, ...rest }) => rest);
  res.json(safeStudents);
});

/* =========================
   ADMIN LOGIN
========================= */
app.post("/admin-login", (req, res) => {
  let { admin_id, password } = req.body;

  admin_id = admin_id?.trim();
  password = password?.trim();

  const admin = admins.find(
    (a) => a.admin_id === admin_id && a.password === password
  );

  if (admin) {
    return res.json({
      success: true,
      admin_id: admin.admin_id,
      name: admin.name,
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid admin credentials",
  });
});

/* =========================
   GET SINGLE ADMIN PROFILE
========================= */
app.get("/admin/:id", (req, res) => {
  const admin = admins.find((a) => a.admin_id === req.params.id);

  if (!admin) {
    return res.status(404).json({
      success: false,
      message: "Admin not found",
    });
  }

  const { password, ...safeAdmin } = admin;
  res.json(safeAdmin);
});


/* =========================
   AI DOCUMENT GENERATION
========================= */
/* =========================
   AI DOCUMENT GENERATION
========================= */
app.post("/generate-document", async (req, res) => {
  try {
    const { type, name, studentId, classname, rollNo } = req.body;


    const academicYear = "2025-2026";
    const todayDate = new Date().toLocaleDateString("en-GB");

    const doc = new PDFDocument({ margin: 50 });
    const tempPath = `temp_${studentId}.pdf`;
    const stream = fs.createWriteStream(tempPath);

    doc.pipe(stream);

    /* =========================
       PAGE BORDER
    ========================= */
    doc
      .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .lineWidth(2)
      .stroke();

    /* =========================
       HEADER
    ========================= */

    doc.image("college_logo.jpg", 250, 35, { width: 90 });

    doc.moveDown(5);

    doc
      .font("Helvetica-Bold")
      .fontSize(16)
      .text("SMT. KASHIBAI NAVALE COLLEGE OF ENGINEERING", {
        align: "center",
      });

    doc.moveDown(0.5);

    doc
      .font("Helvetica")
      .fontSize(11)
      .text(
        "(Affiliated to Savitribai Phule Pune University & Approved by AICTE)",
        { align: "center" }
      );

    doc.text(
      "[Accredited by NBA w.e.f. 1/1/2013]",
      { align: "center" }
    );

    doc.text(
      "S.No.44/1, Off Sinhgad Road Vadgaon(Bk), Pune-411041.",
      { align: "center" }
    );

    doc.moveDown(2);

    /* =========================
       BONAFIDE FORMAT
    ========================= */
    if (type === "Bonafide") {

  // Title
  doc
    .font("Helvetica-Bold")
    .fontSize(16)
    .text("BONAFIDE CERTIFICATE", {
      align: "center",
      underline: true,
    });

  doc.moveDown(2);

  // Date (Right side)
  doc
    .font("Helvetica")
    .fontSize(12)
    .text(`Date: ${todayDate}`, { align: "right" });

  doc.moveDown(2);

  // Main paragraph (Properly structured)
  doc
  .font("Helvetica")
  .fontSize(12)
  .text("This is to certify that ", { indent: 40, continued: true });

doc.font("Helvetica-Bold")
   .text(name, { continued: true });

doc.font("Helvetica")
   .text(", bearing Student ID ", { continued: true });

doc.font("Helvetica-Bold")
   .text(studentId, { continued: true });

doc.font("Helvetica")
   .text(", is a bonafide student of the Bachelor of Engineering (", { continued: true });

doc.font("Helvetica-Bold")
   .text(classname || "Computer Engineering", { continued: true }); // fallback safety

doc.font("Helvetica")
   .text("), Roll No ", { continued: true });

doc.font("Helvetica-Bold")
   .text(rollNo, { continued: true });

doc.font("Helvetica")
   .text(" during the academic year ", { continued: true });

doc.font("Helvetica-Bold")
   .text(academicYear, { continued: true });
  
doc.font("Helvetica-Bold")
   .text(".", { continued: false });


  // Second sentence separately (VERY IMPORTANT)
  doc.moveDown(0.5);

  doc
    .font("Helvetica")
    .text(
      "The student is regular in attendance and of good moral character.",
      {
        align: "justify",
        indent: 40,
      }
    );

  doc.moveDown(4);

  // Signature
  doc
    .font("Helvetica")
    .text("Registrar", { align: "right" });

  doc.text("SMT. KASHIBAI NAVALE COLLEGE OF ENGINEERING", {
    align: "right",
  });



      doc.image("stamp.jpeg", 420, doc.y + 10, { width: 100 });

      doc.moveDown(19); //19

      // FOOTER
      doc.fontSize(10).font("Helvetica-Oblique")
        .text(
          "*This is a computer generated certificate and does not require physical signature or stamp.",
          { align: "center" }
        );
    }

    /* =========================
       LEAVING CERTIFICATE FORMAT
    ========================= */
    if (type === "Leaving Certificate") {

      doc
        .font("Helvetica-Bold")
        .fontSize(15)
        .text("LEAVING CERTIFICATE", {
          align: "center",
          underline: true,
        });

      doc.moveDown(2);

      // FORM STYLE LINES

      doc.font("Helvetica").fontSize(12);

      doc.text(`Name: ${name}`, 80);
      doc.moveDown(1);

      doc.text(`PRN / Roll No: ${studentId}`);
      doc.moveDown(1);

      doc.text(`Department: ${department || "Computer Engineering"}`);
      doc.moveDown(1);

      doc.text(`Academic Year: ${academicYear}`);
      doc.moveDown(1);

      doc.text(`Date of Birth: __________________________`);
      doc.moveDown(1);

      doc.text(`Reason for Leaving: __________________________`);
      doc.moveDown(1);

      doc.text(`Date of Issue: ${todayDate}`);
      doc.moveDown(4);

      /* STAMP BOTTOM LEFT */
      doc.image("stamp.jpeg", 80, doc.page.height - 200, {
        width: 120,
      });

      /* SIGNATURE RIGHT */
      doc
        .font("Helvetica")
        .text("______________________________", 350, doc.page.height - 170);

      doc
        .font("Helvetica")
        .text("(Signature of Registrar)", 380, doc.page.height - 150);

      doc
        .font("Helvetica-Bold")
        .text(
          "REGISTRAR\nSMT. KASHIBAI NAVALE COLLEGE OF ENGINEERING\nPUNE-411041",
          350,
          doc.page.height - 120
        );
    }

    doc.end();

    /* =========================
       CONVERT TO BASE64
    ========================= */

    stream.on("finish", () => {
      const fileData = fs.readFileSync(tempPath, {
        encoding: "base64",
      });

      fs.unlinkSync(tempPath);

      res.json({
        success: true,
        pdf: `data:application/pdf;base64,${fileData}`,
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "PDF generation failed",
    });
  }
});



app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
