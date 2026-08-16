import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import SelectPlan from "./pages/auth/SelectPlan";
import PaymentSuccess from "./pages/auth/PaymentSuccess";
import PaymentFailed from "./pages/auth/PaymentFailed";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Auth middleware
import ProtectedRoute from "./components/auth/ProtectedRoute";

// Platform
import PlatformDashboard from "./pages/platform/Dashboard";
import Organizations from "./pages/platform/Organizations";
import OrganizationDetails from "./pages/platform/OrganizationDetails";
import Plans from "./pages/platform/Plans";
import PlatformTransactions from "./pages/platform/Transactions";
import CreatePlatformAdmin from "./pages/platform/CreatePlatformAdmin";

// Organization
import OrganizationDashboard from "./pages/organization/Dashboard";
import OrganizationProfile from "./pages/organization/Profile";
import Members from "./pages/organization/Members";
import Subscription from "./pages/organization/Subscription";
import Billing from "./pages/organization/Billing";
import OrganizationTransactions from "./pages/organization/Transactions";
import CreateOrganization from "./pages/organization/CreateOrganization";


// Member
import MemberDashboard from "./pages/member/Dashboard";
import MemberProfile from "./pages/member/Profile";
import OrganizationInfo from "./pages/member/OrganizationInfo";

import { useEffect } from "react";
import { useDispatch } from "react-redux";

import { getMe } from "./redux/slices/authSlice";

const App = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    const token =
      localStorage.getItem("token");

    if (token) {
      dispatch(getMe());
    }
  }, [dispatch]);
  return (
    <BrowserRouter>
      <Routes>
        {/* ================================= */}
        {/* PUBLIC */}
        {/* ================================= */}

        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
        <Route path="/select-plan" element={<SelectPlan />}/>
        <Route path="/payment/success" element={<PaymentSuccess />}/>
        <Route path="/payment/failed" element={<PaymentFailed />}/>
        <Route path="/forgot-password" element={<ForgotPassword />}/>
        <Route path="/reset-password" element={<ResetPassword />}/>
        <Route path="/admin/create-admin" element={<CreatePlatformAdmin />}/>

        {/* ================================= */}
        {/* PLATFORM ADMIN */}
        {/* ================================= */}

        <Route element={<ProtectedRoute roles={["PLATFORM_ADMIN"]}/>}>
          <Route path="/admin/dashboard" element={<PlatformDashboard />}/>
          <Route path="/admin/organizations" element={<Organizations />}/>
          <Route path="/admin/organizations/:id" element={<OrganizationDetails />}/>
          <Route path="/admin/plans" element={<Plans />}/>
          <Route path="/admin/transactions" element={<PlatformTransactions />}/>
        </Route>

        {/* ================================= */}
        {/* ORGANIZATION ADMIN */}
        {/* ================================= */}

        <Route element={ <ProtectedRoute roles={["ORG_ADMIN"]}/>}>
          <Route path="/organization/dashboard" element={ <OrganizationDashboard />}/>
          <Route path="/organization/profile" element={<OrganizationProfile />}/>
          <Route path="/organization/members" element={<Members />}/>
          <Route path="/organization/subscription" element={ <Subscription />}/>
          <Route path="/organization/billing" element={<Billing />}/>
          <Route path="/organization/transactions" element={<OrganizationTransactions />}/>
          <Route path="/organization/create" element={<CreateOrganization/>}/>
        </Route>

        {/* ================================= */}
        {/* MEMBER */}
        {/* ================================= */}

        <Route element={ <ProtectedRoute roles={["MEMBER"]}/>}>
          <Route path="/member/dashboard" element={<MemberDashboard />}/>
          <Route path="/member/profile" element={<MemberProfile />}/>
          <Route path="/member/organization" element={ <OrganizationInfo />}/>
        </Route>

        {/* ================================= */}
        {/* DEFAULT */}
        {/* ================================= */}
        <Route path="/" element={ <Navigate to="/login" replace/>}/>
        <Route path="*" element={<Navigate to="/login"replace/>}/>

      </Routes>
    </BrowserRouter>
  );
};

export default App;