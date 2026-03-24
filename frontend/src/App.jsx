import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing.jsx";
import CitizenDashboard from "./pages/citizen/CitizenDashboard.jsx";
import CollectorDashboard from "./pages/collector/CollectorDashboard.jsx";
import PlantDashboard from "./pages/plant/PlantDashboard.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import WastePassport from "./pages/WastePassport.jsx";
import AuditTrail from "./pages/admin/AuditTrail.jsx";
import Layout from "./layouts/Layout.jsx";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/citizen" element={<CitizenDashboard />} />
        <Route path="/collector" element={<CollectorDashboard />} />
        <Route path="/plant" element={<PlantDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/passport/:id" element={<WastePassport />} />
        <Route path="/admin/audit/:id" element={<AuditTrail />} />
      </Routes>
    </Layout>
  );
}

export default App;
