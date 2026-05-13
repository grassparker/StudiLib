import {Routes, Route} from "react-router-dom";
import Home from "./Home";
import Auth from "./features/Auth";
import Setup from "./features/Setup";
import Dashboard from "./features/Dashboard";
import TaskDump from "./features/TaskDump";
import Profile from "./features/Profile";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/setup" element={<Setup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dump" element={<TaskDump />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}

export default App