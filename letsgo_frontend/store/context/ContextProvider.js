import React from "react";
import { createContext, useContext, useState } from "react";

const Context = createContext(null);
export const UseContextHook = () => useContext(Context);

const ContextProvider = ({ children }) => {
  const [image, setImage] = useState(null);
  const [age, setAge] = useState(null);
  let [actionBtnOpacity, setActionButtonOpacity] = useState(0.3);
  const [userData, setUserData] = useState({
    name: null,
    age: null,
    email1: null,
    password: null,
  });
  let [base64, setBase64] = useState(null);
  let [chosenSports, setChosenSports] = useState([]);
  const [location, setLocation] = useState(null);
  const [userLocation, setUserLocation] = useState({});
  const [newCity, setCity] = useState();
  const [cityText, setCityText] = useState("");
  const [user, setUser] = useState([]);
  const [userName, setUserName] = useState(null);
  const [userAge, setUserAge] = useState(null);
  const [userSports, setUserSports] = useState(null);
  const [userCity, setUserCity] = useState("");
  const [userLocationServer, setUserLocationServer] = useState(null);
  const [userImage, setUserImage] = useState(null);
  const [fetchedUsers, setFetchedUsers] = useState([]);
  const [userFriends, setUserFriends] = useState([]);
  const [peopleIdontWannaSeeAgain, setpeopleIdontWannaSeeAgain] = useState([]);
  const [myFriendsFetched, setMyFriendsFetched] = useState([]);
  const [arrayWithMyFriendsId, setArrayWithMyFriendsId] = useState([]);
  const [email, setEmail] = useState("Update your bio!");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [codeToResetPass, setCodeToResetPass] = useState("");
  const [userId, setUserId] = useState("");
  const [friendId, setFriendId] = useState("");
  const [friendName, setFriendName] = useState("");
  const [friendImage, setFriendImage] = useState("");
  const [friendBio, setFriendBio] = useState("");
  const [friendAge, setFriendAge] = useState("");
  const [friendSports, setFriendSports] = useState("");
  const [friendCity, setFriendCity] = useState("");
  const [messages, setMessages] = useState([]);
  const [path, setPath] = useState("http://192.168.1.189:3000/");
  return (
    <Context.Provider
      value={{
        image,
        setImage,
        actionBtnOpacity,
        setActionButtonOpacity,
        userData,
        setUserData,
        base64,
        setBase64,
        chosenSports,
        setChosenSports,
        location,
        setLocation,
        userLocation,
        setUserLocation,
        newCity,
        setCity,
        cityText,
        setCityText,
        user,
        setUser,
        userName,
        setUserName,
        setUserAge,
        userAge,
        userSports,
        setUserSports,
        userCity,
        setUserCity,
        userLocationServer,
        setUserLocationServer,
        userImage,
        setUserImage,
        fetchedUsers,
        setFetchedUsers,
        userFriends,
        setUserFriends,
        peopleIdontWannaSeeAgain,
        setpeopleIdontWannaSeeAgain,
        myFriendsFetched,
        setMyFriendsFetched,
        arrayWithMyFriendsId,
        setArrayWithMyFriendsId,
        email,
        setEmail,
        password,
        setPassword,
        bio,
        setBio,
        codeToResetPass,
        setCodeToResetPass,
        setUserId,
        userId,
        friendId,
        setFriendId,
        friendName,
        setFriendName,
        friendImage,
        setFriendImage,
        friendBio,
        setFriendBio,
        friendAge,
        setFriendAge,
        friendSports,
        setFriendSports,
        friendCity,
        setFriendCity,
        messages,
        setMessages,
        path,
        setPath,
        age,
        setAge
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;

// const TodoContext = createContext({showModal:()=>{}});
