const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({ margin: 40, size: 'A4' });
const outputPath = path.join(__dirname, '../24IT047_SetA_Report.pdf');
doc.pipe(fs.createWriteStream(outputPath));

// Header styling
doc.fillColor('#ff5722').fontSize(20).text('Charotar University of Science and Technology', { align: 'center' });
doc.fillColor('#1e293b').fontSize(14).text('CSPIT - Department of Information Technology / CE', { align: 'center' });
doc.fontSize(12).text('ITUE301: Advanced Web Development Frameworks - Open-Book Practical Exam', { align: 'center' });
doc.fontSize(10).fillColor('#64748b').text('Date: 24/08/2026 | Candidate Roll No: 24IT047 | Batch: C1', { align: 'center' });
doc.moveDown(1);
doc.strokeColor('#ff5722').lineWidth(1.5).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
doc.moveDown(1);

// Title
doc.fillColor('#0f172a').fontSize(16).text('SET A: QuickBite Food Ordering System - Execution Report', { underline: true });
doc.moveDown(0.5);

doc.fontSize(10).fillColor('#334155').text(
  'This practical examination report demonstrates the complete implementation and verification of all five tasks for SET A using React (frontend), Express.js (backend), and MongoDB with Mongoose.'
);
doc.moveDown(1);

// Tasks Overview Table / Summary
doc.fillColor('#ff5722').fontSize(12).text('Task Completion Summary:');
doc.fontSize(9).fillColor('#1e293b');
const tasks = [
  ['Task 1: React Architecture', 'HomePage, RestaurantsPage, OrderPage & RestaurantCard props + status badges'],
  ['Task 2: React Routing & State', 'React Router, ProtectedRoute (/order), AuthContext & Lazy AdminPanel'],
  ['Task 3: Express API & Middleware', '5 REST endpoints at /api/v1/, requestLogger, authGuard & errorHandler'],
  ['Task 4: REST API Consumption', 'useEffect fetch GET /api/v1/restaurants, loading/error states & client search'],
  ['Task 5: Mongoose & Validation', 'Customer, Restaurant, Order schemas with .populate() and 400 validation error handling']
];

tasks.forEach(([title, desc], index) => {
  doc.fillColor('#0f172a').font('Helvetica-Bold').text(`${index + 1}. ${title}: `, { continued: true });
  doc.font('Helvetica').fillColor('#475569').text(desc);
});

doc.moveDown(1);
doc.strokeColor('#e2e8f0').lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
doc.moveDown(1);

// Requirement Screenshot 1: RestaurantsPage Live Data
doc.fillColor('#ff5722').fontSize(12).font('Helvetica-Bold').text('Screenshot 1: RestaurantsPage Rendering Live MongoDB Data (Task 1 & Task 4)');
doc.fontSize(9).font('Helvetica').fillColor('#64748b').text('Live data fetched from GET /api/v1/restaurants with client-side search filter & open/closed status badges.');
doc.moveDown(0.5);

const img1Path = 'C:\\Users\\ASUS\\.gemini\\antigravity-ide\\brain\\31ac82af-c4ae-4eb6-a492-8e537706e88b\\restaurants_list_1787566377729.png';
if (fs.existsSync(img1Path)) {
  doc.image(img1Path, { fit: [515, 230], align: 'center', valig: 'center' });
} else {
  doc.rect(40, doc.y, 515, 120).fill('#f1f5f9').fillColor('#0f172a').text('[RestaurantsPage Live Data Image]', 200, doc.y - 70);
}

doc.addPage();

// Requirement Screenshot 2: POST /api/v1/orders returning 201
doc.fillColor('#ff5722').fontSize(12).font('Helvetica-Bold').text('Screenshot 2: POST /api/v1/orders Returning HTTP 201 Created (Task 3 & Task 5)');
doc.fontSize(9).font('Helvetica').fillColor('#64748b').text('Form order submission placing order to Express REST API with Bearer token authentication and Mongoose validation.');
doc.moveDown(0.5);

const img2Path = 'C:\\Users\\ASUS\\.gemini\\antigravity-ide\\brain\\31ac82af-c4ae-4eb6-a492-8e537706e88b\\order_success_1787566444713.png';
if (fs.existsSync(img2Path)) {
  doc.image(img2Path, { fit: [515, 230], align: 'center', valig: 'center' });
} else {
  doc.rect(40, doc.y, 515, 120).fill('#f1f5f9').fillColor('#0f172a').text('[Order Success Response Image]', 200, doc.y - 70);
}

doc.moveDown(1.5);

// Requirement Screenshot 3: MongoDB Document & Admin Oversight
doc.fillColor('#ff5722').fontSize(12).font('Helvetica-Bold').text('Screenshot 3: Lazy-Loaded AdminPanel & Saved MongoDB Document Record (Task 2 & Task 5)');
doc.fontSize(9).font('Helvetica').fillColor('#64748b').text('Admin panel rendered via React.lazy showing populated customer and restaurant document fields.');
doc.moveDown(0.5);

const img3Path = 'C:\\Users\\ASUS\\.gemini\\antigravity-ide\\brain\\31ac82af-c4ae-4eb6-a492-8e537706e88b\\admin_panel_loaded_1787566471721.png';
if (fs.existsSync(img3Path)) {
  doc.image(img3Path, { fit: [515, 230], align: 'center', valig: 'center' });
} else {
  doc.rect(40, doc.y, 515, 120).fill('#f1f5f9').fillColor('#0f172a').text('[Admin Panel Image]', 200, doc.y - 70);
}

doc.moveDown(1.5);
doc.strokeColor('#ff5722').lineWidth(1).moveTo(40, doc.y).lineTo(555, doc.y).stroke();
doc.moveDown(0.5);
doc.fontSize(9).fillColor('#0f172a').text('Candidate Signature: Darshan Patel (24IT047)', { align: 'right' });

doc.end();
console.log('PDF Report generated successfully at:', outputPath);
