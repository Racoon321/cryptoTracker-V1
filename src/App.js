import "./App.css";
import Header from "./Components/Header/Header";
import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage";
import CoinPage from "./Pages/CoinPage";
import AlertComponent from "./Components/AlertComponent";

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Coins/:coinId" element={<CoinPage />} />
      </Routes>
      <AlertComponent />
    </div>
  );
}

export default App;
