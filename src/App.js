import Router from "./Router";
import "./App.scss";
import NavigationBar from "./containers/NavigationBar";

function App() {
  return (
    <div className="App">
      <NavigationBar />
      <Router />
    </div>
  );
}

export default App;
