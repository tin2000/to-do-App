import Auth from "./Components/Auth";
import ListHeader from "./Components/ListHeader";
import ListItem from "./Components/ListItem";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
const App = () => {
  const [cookies, setCookie, removeCookie] = useCookies(null);
  const [tasks, setTasks] = useState(null);

  const userEmail = cookies.Email;
  const authToken = cookies.AuthToken;

  const getData = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_SERVERURL}/todos/${userEmail}`
      );
      const json = await response.json();
      setTasks(json);
    } catch (err) {
      console.error(err);
    }
  };

  //Sort by date
  const sortTasks = tasks?.sort((a, b) => new Date(a.date) - new Date(b.date));

  useEffect(() => {
    if (authToken) {
      getData();
    }
  }, []);

  return (
    <div className="app">
      {!authToken && <Auth />}
      {authToken && (
        <>
          <ListHeader listname={"To-do-list"} getData={getData} />
          <p className="user-email">Chào mừng trở lại {userEmail}</p>
          {sortTasks?.map((task) => (
            <ListItem key={task.id} task={task} getData={getData} />
          ))}
        </>
      )}
    </div>
  );
};

export default App;
