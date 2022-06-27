import "./App.css";
import Weather from "./Weather";
import "./Weather.css";

export default function App() {
  return (
    <div className="App">
      <div className="container">
        <Weather defaultCity="Cary" />
      </div>
    </div>
  );
}
