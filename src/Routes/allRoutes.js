import React from "react";
import { Navigate } from "react-router-dom";

import Country from "../pages/LocationSetUp/Country/Country";
import City from "../pages/LocationSetUp/City/City";
import State from "../pages/LocationSetUp/State/State";
import CompanyLocation from "../pages/LocationSetUp/CompanyLocation";
import Login from "../pages/Authentication/Login";
import CategoryMaster from "../pages/Category/CategoryMaster";
import Blogs from "../pages/Blogs/Blogs";
import PromocodeMaster from "../pages/Subscription/PromocodeMaster";
import ProductDetails from "../pages/Products/ProductsDetails";
import UserProfile from "../pages/Authentication/user-profile";
import Banner from "../pages/CMS/Banner";
import CompanyDetails from "../pages/Setup/CompanyDetails";
import AdminUser from "../pages/Auth/AdminUser";
import ContactUs from "../pages/CMS/ContactUs";
import Review from "../pages/CMS/Review";
import NewProject from "../pages/CMS/NewProject";

import ContactAdminPatients from "../pages/Patients/ContactAdminPatients";
import ForgotPassword from "../pages/Authentication/ForgotPassword";
import CoverPasswCreate from "../pages/PasswordCreate/CoverPassCreate";
import LabReports from "../pages/Patients/LabReports";
import SecondOpinion from "../pages/Patients/SecondOpinion";
import RefferFriend from "../pages/LoyaltyPoints/RefferFriend";
import Transactions from "../pages/LoyaltyPoints/Transactions";
import Camping from "../pages/Camp/Camp";
import PatientAppointment from "../pages/Patient/PatientAppointment"
import LabCollectionInquiry from "../pages/Patient/Labcollactionrequest";
import ReferTransactions from "../pages/LoyaltyPoints/ReferFriendTransaction";
import ContactPharmacy from "../pages/ContactPharmacy/ContactPharmacy";
import AddLoyaltyPoints from "../pages/LoyaltyPoints/AddLoyaltyPoints";
import ServiceOrder from "../pages/Services/ServiceOrder";
import MoreServiceRequest from "../pages/Services/MoreServiceRequest";
import Maintenence from "../pages/Maintenence";


const authProtectedRoutes = [
  // { path: "/dashboard", component: <DashboardCrm /> },
  { path: "/profile", component: <UserProfile /> },
  { path: "/country", component: <Country /> },
  { path: "/city", component: <City /> },
  { path: "/state", component: <State /> },
  { path: "/location", component: <CompanyLocation /> },
  { path: "/admin-user", component: <AdminUser /> },
  { path: "/company-details", component: <CompanyDetails /> },
  { path: "/contact", component: <ContactUs /> },
  { path: "/category", component: <CategoryMaster /> },
  { path: "/review", component: <Review /> },
  { path: "/blogs", component: <Blogs /> },
  { path: "/banner", component: <Banner /> },
  { path: "/promocode-master", component: <PromocodeMaster /> },
  { path: "/newproject", component: <NewProject /> },
  { path: "/product-details", component: <ProductDetails /> },
  { path: "/contact-admin", component: <ContactAdminPatients /> },
  { path: "/second-opinion", component: <SecondOpinion /> },

  { path: "/lab-report", component: <LabReports /> },
  { path: "/refferfriend", component: <RefferFriend /> },
  { path: "/Transactions", component: <Transactions /> },
  { path: "/refer-friend-transactions", component: <ReferTransactions /> },
  { path: "/camping", component: <Camping /> },
  { path: "/contact-pharmacy", component: <ContactPharmacy /> },
  { path: "/loyalty-points", component: <AddLoyaltyPoints /> },
  { path: "/service-orders", component: <ServiceOrder /> },
  { path: "/service-request", component: <MoreServiceRequest /> },

  {
    path: "/",
    exact: true,
    component: <Navigate to="/admin-user" />,
  },
  { path: "*", component: <Navigate to="/admin-user" /> },
  { path: "/PatientAppointment", component: <PatientAppointment /> },
  { path: "/Labcollection", component: <LabCollectionInquiry /> },
];

const publicRoutes = [
  // { path: "/dashboard", component: <DashboardCrm /> },
  // { path: "/", component: <Maintenence/> },
  { path: "/", component: <Login /> },
  { path: "/home/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgotPassword /> },
  { path: "/reset-password", component: <CoverPasswCreate /> },
];

export { authProtectedRoutes, publicRoutes };
