import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Landing from "./pages/Landing";
import CitizenDashboard from "./pages/citizen/CitizenDashboard";
import CollectorDashboard from "./pages/collector/CollectorDashboard";
import PlantDashboard from "./pages/plant/PlantDashboard";
import WastePassport from "./pages/WastePassport";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AuditTrail from "./pages/admin/AuditTrail";
import DemoMode from "./pages/admin/DemoMode";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/citizen" element={<CitizenDashboard />} />
        <Route path="/collector" element={<CollectorDashboard />} />
        <Route path="/plant" element={<PlantDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/audit/:id" element={<AuditTrail />} />
        <Route path="/passport/:id" element={<WastePassport />} />
        <Route path="/demo" element={<DemoMode />} />
      </Routes>
    </Layout>
  );
}