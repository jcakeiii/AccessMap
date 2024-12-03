import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import SignIn from './pages/authentication/SignIn'
import SignUp from './pages/authentication/SignUp'
import MapView from './pages/MapView/MapView';
import SubmitView from './pages/SubmitView/SubmitView';
import MyLocationView from './pages/MyLocationView/MyLocationView.jsx';
import ContributeWhatView from './pages/ContributeWhatView/ContributeWhatView.jsx';
import RoutingView from './pages/RoutingView/RoutingView.jsx';
import SubmitBuildingView from './pages/SubmitBuildingView/SubmitBuildingView.jsx';
import UserProfile from './components/UserProfile/UserProfile.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>} />
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/sign-in" element={<SignIn/>}/>
        <Route path="/my-location" element={<MyLocationView/>}/>
        <Route path="/contribute" element={<ContributeWhatView/>}/>
        <Route path="/contribute-form" element={<SubmitView/>}/>
        <Route path="/map-view" element={<MapView/>}/>
        <Route path="/search-routes" element={<RoutingView/>}/>
        <Route path="/submit-building" element={<SubmitBuildingView/>}/>
        <Route path="/my-account" element={<UserProfile/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
