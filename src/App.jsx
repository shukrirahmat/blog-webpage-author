import { Link, useParams, useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./components/Home.jsx";
import LogIn from "./components/LogIn.jsx";
import SignUp from "./components/SignUp.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import fetchURL from "./fetchURL.jsx";


function App() {
  const { name } = useParams();
  const navigate = useNavigate();

  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState(null);

  const toggleLogIn = (state) => {
    setUserLoggedIn(state);
  };

  const handleLogOut = () => {
    window.localStorage.removeItem("token");
    navigate("/");
    navigate(0);
  };

  useEffect(() => {
    const token = window.localStorage.getItem("token");
    setIsLoading(true);

    if (!token) {
      toggleLogIn(false);
      setIsLoading(false);
    } else {
      fetch(fetchURL + "/user", {
        mode: "cors",
        method: "get",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((response) => {
          if (response.ok) return response.json();
          else throw new Error("Server error");
        })
        .then((data) => {
          if (data.username) {
            setUserName(data.username);
            toggleLogIn(true);
          }else {
            toggleLogIn(false);
            window.localStorage.removeItem("token");
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
          toggleLogIn(false);
          setIsLoading(false);
        });
    }
  }, []);

  return (
    <>
      <nav className="navbar">
        <Link to="/">
          <h1>MY BLOG</h1>
        </Link>
        {userLoggedIn && !isLoading && <p>HELLO, {userName}</p> }
        <p></p>
        {!userLoggedIn && !isLoading && <Link to="/log-in">LOG IN</Link>}
        <p></p>
        {!userLoggedIn && !isLoading && <Link to="/sign-up">SIGN UP</Link>}
        <p></p>
        {userLoggedIn && !isLoading && <button onClick={handleLogOut}>LOG OUT</button>}
      </nav>
      <hr></hr>
      { isLoading === true ? (
        <p>Loading page...</p>
      ) : name === "sign-up" ? (
        <SignUp />
      ) : name === "log-in" ? (
        <LogIn />
      ) : !name ? (
        <Home/>
      ) : (
        <ErrorPage/>
      )}
    </>
  );
}

export default App;
