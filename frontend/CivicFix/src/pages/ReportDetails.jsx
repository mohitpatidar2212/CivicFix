import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import api from "../api/apiClient";

export default function ReportDetails(){
  const { id } = useParams();
  const [report,setReport] = useState(null);
  const [status,setStatus] = useState("");
  useEffect(()=>{
    (async ()=>{
      const r = await api.get(`/reports/${id}`);
      setReport(r.data);
      setStatus(r.data.status);
    })();
  },[id]);

  async function saveAdmin(){
    await api.post(`/admin/reports/${id}/update`, {status});
    alert("Updated");
  }

  if(!report) return <div className="p-6">Loading...</div>;
  return (
    <div className="p-6">
      <div className="flex gap-6">
        <div className="w-2/3 card">
          <h3 className="text-xl font-semibold">{report.title}</h3>
          <p className="text-sm text-gray-600">{report.description}</p>
          <div className="mt-3">
            {report.image_base64 && <img src={`data:image/*;base64,${report.image_base64}`} alt="evidence" className="max-h-64 rounded"/>}
          </div>
          <div className="mt-3 text-sm">Location: {report.location?.address || `${report.location?.lat}, ${report.location?.lng}`}</div>
        </div>
        <div className="w-1/3 card">
          <div className="mb-2">Status</div>
          <select className="w-full p-2 border rounded" value={status} onChange={e=>setStatus(e.target.value)}>
            <option>Submitted</option>
            <option>Acknowledged</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
          <button className="mt-3 btn btn-primary w-full" onClick={saveAdmin}>Save & Notify Reporter</button>
        </div>
      </div>
    </div>
  );
}
