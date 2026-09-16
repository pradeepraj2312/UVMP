import { Navigate, Route, Routes } from 'react-router-dom'
import App from '../App.jsx'
import Landing from '../pages/public/Landing.jsx'
import Login from '../pages/auth/Login.jsx'
import Register from '../pages/auth/Register.jsx'
import VolunteerRegister from '../pages/auth/VolunteerRegister.jsx'
import NgoRegister from '../pages/auth/NgoRegister.jsx'
import DistrictAuthorityRegister from '../pages/auth/DistrictAuthorityRegister.jsx'
import IncidentReport from '../pages/public/IncidentReport.jsx'
import AdminDashboard from '../pages/admin/Dashboard.jsx'
import AdminApprovals from '../pages/admin/Approvals.jsx'
import DistrictDashboard from '../pages/district/Dashboard.jsx'
import NgoDashboard from '../pages/ngo/Dashboard.jsx'
import VolunteerDashboard from '../pages/volunteer/Dashboard.jsx'
import AdminDistricts from '../pages/admin/Districts.jsx'
import AdminNgos from '../pages/admin/Ngos.jsx'
import AdminVolunteers from '../pages/admin/Volunteers.jsx'
import AdminReports from '../pages/admin/Reports.jsx'
import DistrictNgos from '../pages/district/Ngos.jsx'
import DistrictVolunteers from '../pages/district/Volunteers.jsx'
import DistrictIncidents from '../pages/district/Incidents.jsx'
import DistrictTasks from '../pages/district/Tasks.jsx'
import NgoVolunteers from '../pages/ngo/Volunteers.jsx'
import NgoTasks from '../pages/ngo/Tasks.jsx'
import NgoTaskDetail from '../pages/ngo/TaskDetail.jsx'
import NgoRecognition from '../pages/ngo/Recognition.jsx'
import MyTasks from '../pages/volunteer/MyTasks.jsx'
import VolunteerTaskDetail from '../pages/volunteer/TaskDetail.jsx'
import VolunteerProfile from '../pages/volunteer/Profile.jsx'
import Certificates from '../pages/volunteer/Certificates.jsx'
import ProtectedRoute from './ProtectedRoute.jsx'

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC ENTRY ROUTES */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register/volunteer" element={<VolunteerRegister />} />
      <Route path="/register/ngo" element={<NgoRegister />} />
      <Route path="/register/district-authority" element={<DistrictAuthorityRegister />} />
      <Route path="/incident-report" element={<IncidentReport />} />

      {/* PROTECTED AUTHENTICATED PORTALS */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<App />} />

        {/* ADMIN ROUTES */}
        <Route element={<ProtectedRoute roles={['ADMIN']} />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/approvals" element={<AdminApprovals />} />
          <Route path="/admin/districts" element={<AdminDistricts />} />
          <Route path="/admin/ngos" element={<AdminNgos />} />
          <Route path="/admin/volunteers" element={<AdminVolunteers />} />
          <Route path="/admin/reports" element={<AdminReports />} />
        </Route>

        {/* DISTRICT AUTHORITY ROUTES */}
        <Route element={<ProtectedRoute roles={['DISTRICT', 'DISTRICT_AUTHORITY']} />}>
          <Route path="/district" element={<DistrictDashboard />} />
          <Route path="/district/ngos" element={<DistrictNgos />} />
          <Route path="/district/volunteers" element={<DistrictVolunteers />} />
          <Route path="/district/incidents" element={<DistrictIncidents />} />
          <Route path="/district/tasks" element={<DistrictTasks />} />
        </Route>

        {/* NGO ROUTES */}
        <Route element={<ProtectedRoute roles={['NGO']} />}>
          <Route path="/ngo" element={<NgoDashboard />} />
          <Route path="/ngo/volunteers" element={<NgoVolunteers />} />
          <Route path="/ngo/tasks" element={<NgoTasks />} />
          <Route path="/ngo/tasks/:taskId" element={<NgoTaskDetail />} />
          <Route path="/ngo/recognition" element={<NgoRecognition />} />
        </Route>

        {/* VOLUNTEER ROUTES */}
        <Route element={<ProtectedRoute roles={['VOLUNTEER']} />}>
          <Route path="/volunteer" element={<VolunteerDashboard />} />
          <Route path="/volunteer/tasks" element={<MyTasks />} />
          <Route path="/volunteer/tasks/:taskId" element={<VolunteerTaskDetail />} />
          <Route path="/volunteer/profile" element={<VolunteerProfile />} />
          <Route path="/volunteer/certificates" element={<Certificates />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
