import React, { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState({
    message: ""
  })

  useEffect(() => {
    fetch("/hello").then((res) => {
      res.json().then((data) => {
        setData({
          message: data.message
        })
      })
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
         <p>
          { data.message }
        </p>
      </header>
    </div>
  );
}

export default App;
