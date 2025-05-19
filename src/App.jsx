import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import Properties from "./components/admin/Properties";
import Inquiries from "./components/admin/Inquiries";
import CreateProperty from "./components/admin/CreateProperty";
import AdminMain from "./components/admin/admin";
import HomePage from "./pages/Home";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<Admin />}>
          <Route index element={<Properties />} />
          <Route path="properties" element={<Properties />} />
          <Route path="inquiries" element={<Inquiries />} />
          <Route path="create-property" element={<CreateProperty />} />
        </Route>
        <Route path="/" element={<AdminMain></AdminMain>}></Route>
        <Route path="/home" element={<HomePage></HomePage>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
