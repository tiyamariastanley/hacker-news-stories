import { useState } from "react";
import "./App.css";
import Header from "./components/header";
import Stories from "./components/stories";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div>
      <Header
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        onClearSearch={() => setSearchQuery("")}
      />
      <main>
        <Stories searchQuery={searchQuery} />
      </main>
    </div>
  );
}

export default App;
