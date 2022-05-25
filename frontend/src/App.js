import "./App.css";
import { Layout } from "./components/layout/layout";

function App({ location }) {
  return (
    <Layout location={location}>
      <div className="App">
        <h1>App Here</h1>
      </div>
    </Layout>
  );
}

export default App;
