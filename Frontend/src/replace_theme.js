const fs = require('fs');

const ngoPath = 'd:/Programming/Project/UVMP/Frontend/src/components/NGO_Dashboard.jsx';
let ngoContent = fs.readFileSync(ngoPath, 'utf8');

// Replace NGO Dashboard theme colors
ngoContent = ngoContent
  .replace(/background-color: #FAF6F0;/g, 'background-color: #FBF8F5;')
  .replace(/color: #FF7A00;/gi, 'color: #800000;')
  .replace(/color: '#FF7A00'/gi, "color: '#800000'")
  .replace(/border-color: #FF7A00;/gi, 'border-color: #800000;')
  .replace(/rgba\(255, 122, 0,/g, 'rgba(128, 0, 0,')
  .replace(/rgba\(230, 57, 70,/g, 'rgba(128, 0, 0,')
  .replace(/background: #E63946;/gi, 'background: #800000;')
  .replace(/background: linear-gradient\(135deg, #800000 0%, #FF7A00 100%\);/g, 'background: #800000;')
  .replace(/background: linear-gradient\(135deg, #FF7A00 0%, #E63946 100%\);/g, 'background: #800000;')
  .replace(/background: linear-gradient\(180deg, #FF7A00 0%, #E63946 100%\);/g, 'background: #800000;')
  .replace(/background: linear-gradient\(90deg, #FF7A00 0%, #E63946 100%\);/g, 'background: #800000;')
  .replace(/background: #FFF5EE;/g, 'background: #FCE8E6;')
  .replace(/background: #FFE8D6;/g, 'background: #FCE8E6;')
  .replace(/border-color: #FFD8C2;/g, 'border-color: #F3DDD8;')
  .replace(/border: 1.5px solid #FFD8C2;/g, 'border: 1.5px solid #F3DDD8;')
  .replace(/border: 1px solid #FFD8C2;/g, 'border: 1px solid #F3DDD8;')
  .replace(/background: #FFF7F0;/g, 'background: #FBF8F5;')
  .replace(/color: #E63946;/g, 'color: #800000;')
  .replace(/color: '#E63946'/g, "color: '#800000'")
  .replace(/background: linear-gradient\(135deg, #FFF0E6 0%, #FFE5E5 100%\);/g, 'background: #FCE8E6;')
  .replace(/background: linear-gradient\(135deg, #FFF7F0 0%, #FFF0E6 100%\);/g, 'background: #FBF8F5;')
  .replace(/background: #FF7A00;/gi, 'background: #800000;')
  .replace(/background: '#FF7A00'/gi, "background: '#800000'")
  .replace(/background: '#E63946'/gi, "background: '#800000'")
  .replace(/accentColor: '#FF7A00'/gi, "accentColor: '#800000'")
  .replace(/background: 'linear-gradient\(135deg, #FF7A00 0%, #800000 100%\)'/g, "background: '#800000'")
  .replace(/background: 'linear-gradient\(135deg, #800000 0%, #E63946 100%\)'/g, "background: '#800000'")
  .replace(/stroke="#FF7A00"/g, 'stroke="#800000"')
  .replace(/stroke: #FF7A00;/g, 'stroke: #800000;')
  .replace(/color: '#15803D'/g, "color: '#137333'") // green
  .replace(/background: #DCFCE7;/g, "background: #E6F4EA;") // light green
  .replace(/color: #15803D;/g, "color: #137333;");

fs.writeFileSync(ngoPath, ngoContent);

const authPath = 'd:/Programming/Project/UVMP/Frontend/src/components/DistrictAuthorityDashboard.jsx';
let authContent = fs.readFileSync(authPath, 'utf8');

// Replace Auth Dashboard theme colors
authContent = authContent
  .replace(/background-color: #F8FAFC;/g, 'background-color: #FBF8F5;')
  .replace(/color: #2563EB;/gi, 'color: #800000;')
  .replace(/color: '#2563EB'/gi, "color: '#800000'")
  .replace(/border-color: #2563EB;/gi, 'border-color: #800000;')
  .replace(/rgba\(37, 99, 235,/g, 'rgba(128, 0, 0,')
  .replace(/background: #EF4444;/gi, 'background: #800000;')
  .replace(/color: '#EF4444'/gi, "color: '#800000'")
  .replace(/background: linear-gradient\(135deg, #1E3A8A 0%, #3B82F6 100%\);/g, 'background: #800000;')
  .replace(/background: linear-gradient\(135deg, #2563EB 0%, #1D4ED8 100%\);/g, 'background: #800000;')
  .replace(/background: linear-gradient\(180deg, #2563EB 0%, #1D4ED8 100%\);/g, 'background: #800000;')
  .replace(/background: #F8FAFC;/g, 'background: #FBF8F5;') // Hover items
  .replace(/background: #DBEAFE;/g, 'background: #FCE8E6;') // icon hover
  .replace(/background: #F1F5F9;/g, 'background: #EFEFEF;') // header search bg
  .replace(/border-color: #BFDBFE;/g, 'border-color: #F3DDD8;')
  .replace(/background: linear-gradient\(135deg, #EFF6FF 0%, #DBEAFE 100%\);/g, 'background: #FCE8E6;')
  .replace(/background: #2563EB;/gi, 'background: #800000;')
  .replace(/background: '#2563EB'/gi, "background: '#800000'")
  .replace(/border-left: 4px solid #2563EB;/g, 'border-left: 4px solid #800000;')
  // Remove blue background from the UV logo fallback
  .replace(/background: '#2563EB'/g, "background: '#800000'")
  .replace(/background: #FEE2E2;/g, 'background: #FCE8E6;')
  .replace(/color: #EF4444;/g, 'color: #800000;')
  .replace(/color: '#EF4444'/g, "color: '#800000'");

fs.writeFileSync(authPath, authContent);
console.log('Theme replaced successfully.');
