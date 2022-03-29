import './App.css';
import Landing from './page/Landing';
import { userContext } from './firebase';
import { useState, useEffect } from 'react';


function App() {

  const [islogin, setIslogin] = useState(localStorage.getItem('accessToken') ? true : false)
  useEffect(() => {

  }, [])

  return (
    <userContext.Provider value={{ islogin, setIslogin }}>

      <div className="App">

        <Landing />

      </div>

    </userContext.Provider>

  );
}

export default App;
