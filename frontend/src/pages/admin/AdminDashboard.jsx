import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import { ResponsiveContainer, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, Legend, Area, AreaChart } from "recharts";
import { alerts, trucks } from "../../data/mock.js";
import { Bell, FlameKindling, TrendingUp, DollarSign } from "lucide-react";
import "leaflet/dist/leaflet.css";

const pickupData = [
  { day: "Mon", pickups: 120, anomalies: 2 },
  { day: "Tue", pickups: 132, anomalies: 3 },
  { day: "Wed", pickups: 140, anomalies: 1 },
  { day: "Thu", pickups: 118, anomalies: 4 },
  { day: "Fri", pickups: 155, anomalies: 5 }
];

const contractorData = [
  { name: "GreenLoop", score: 88 },
  { name: "MetroWaste", score: 62 },
  { name: "EcoTrust", score: 93 }
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-4 gap-4">
        {[{ label: "Waste tracked today", value: "428 t", accent: "text-neon" }, { label: "Verified processed", value: "316 t", accent: "text-cyan" }, { label: "Unresolved anomalies", value: "12", accent: "text-amber" }, { label: "Estimated loss", value: "$38k", accent: "text-amber" }].map((kpi) => (
          <div key={kpi.label} className="glass rounded-xl p-4 border border-white/10">
            <p className="text-xs uppercase text-white/50">{kpi.label}</p>
            <p className={`text-2xl font-semibold ${kpi.accent}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 items-stretch">
        <div className="lg:col-span-2 glass rounded-xl p-3 border border-white/10 h-[360px]">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs text-white/60">Live city map</p>
              <p className="font-semibold">Truck positions & red zones</p>
            </div>
            <span className="text-xs text-amber flex items-center gap-1"><FlameKindling size={14}/>Ghost-truck watch</span>
          </div>
          <MapContainer center={[12.97, 77.59]} zoom={12} className="h-[300px] rounded-xl overflow-hidden">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {trucks.map((t) => (
              <CircleMarker key={t.id} center={[t.lat, t.lng]} pathOptions={{ color: t.status === "alert" ? "#F5B700" : "#5BF3B9" }} radius={12} opacity={0.8}>
                <Tooltip>{t.plate} ? {t.status}</Tooltip>
              </CircleMarker>
            ))}
          </MapContainer>
        </div>
        <div className="glass rounded-xl p-3 border border-white/10">
          <div className="flex items-center gap-2 mb-2 text-amber"><Bell size={16}/>Live alerts</div>
          <div className="space-y-2 max-h-[320px] overflow-auto pr-1">
            {alerts.map((a) => (
              <div key={a.id} className="glass p-3 rounded-lg border border-white/5">
                <p className="text-xs text-white/60 uppercase">{a.severity}</p>
                <p className="font-semibold">{a.title}</p>
                <p className="text-xs text-white/60">{a.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="glass p-3 rounded-xl border border-white/10 h-[260px]">
          <p className="text-sm font-semibold mb-2">Daily pickups vs anomalies</p>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pickupData}>
              <XAxis dataKey="day" stroke="#4DE1FF"/>
              <YAxis stroke="#4DE1FF"/>
              <RTooltip />
              <Legend />
              <Line type="monotone" dataKey="pickups" stroke="#5BF3B9" strokeWidth={2}/>
              <Line type="monotone" dataKey="anomalies" stroke="#F5B700" strokeWidth={2}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="glass p-3 rounded-xl border border-white/10 h-[260px]">
          <p className="text-sm font-semibold mb-2">Contractor trust scores</p>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={contractorData}>
              <XAxis dataKey="name" stroke="#4DE1FF"/>
              <YAxis stroke="#4DE1FF"/>
              <Bar dataKey="score" fill="#5BF3B9" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="glass p-3 rounded-xl border border-white/10 h-[260px]">
          <p className="text-sm font-semibold mb-2">Financial impact of leakage</p>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={pickupData}>
              <XAxis dataKey="day" stroke="#4DE1FF"/>
              <YAxis stroke="#4DE1FF"/>
              <Area dataKey="anomalies" stroke="#F5B700" fill="#F5B70033" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-2 text-amber text-sm mt-2"><DollarSign size={14}/>Translates alerts into $$ loss estimate</div>
        </div>
      </div>
    </div>
  );
}
