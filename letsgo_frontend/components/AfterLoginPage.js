import { View, Text, Image, StyleSheet, Button, Pressable } from "react-native";
import Color from "../style/Color";
import { useState, useEffect, useRef } from "react";
import { UseContextHook } from "../store/context/ContextProvider";
import MyFriends from "./MyFriends";
import axios from "axios";
import Style from "../style/Style";
// import AsyncStorage from "@react-native-async-storage/async-storage";

import SearchFriends from "./SearchFriends";

const AfterLoginPage = ({ navigation }) => {
  let {
    image,
    user,
    setUser,
    userImage,
    setUserImage,
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
    location,
    setLocation,
    userLocation,
    setUserLocation,
    newCity,
    setCity,
    setCityText,
    cityText,
    fetchedUsers,
    setFetchedUsers,
    userFriends,

    setUserFriends,
    peopleIdontWannaSeeAgain,
    setpeopleIdontWannaSeeAgain,
    arrayWithMyFriendsId,
    setArrayWithMyFriendsId,
    myFriendsFetched,
    setMyFriendsFetched,
    email,
    setEmail,
    password,
    setPassword,
    setUserId,
    userId,
    path
  } = UseContextHook();

  const [isNewFriendsOn, setIsNewFriendsOn] = useState(null);

  /// -------> FETCHING CURRENT USER FROM THE SERVER

  const stayLoggedIn = async () => {
    console.log("path check",  `${path}:email1/`)

    let result;
    console.log("email", "password", email, password);
    try {
      result = await axios.post(
        //"https://lestgo--coolasfk.repl.co/users/:email1/",
        `${path}users/:email1/`,
        { email1: email, password: password }
      );
    } catch (e) {
      "error", e;
    } finally {
      console.log("result: ", result);
      setUser(result.data);
      ("setting states");
      setUserName(result.data.name);
      setUserCity(result.data.city);
      setUserAge(result.data.age);
      setUserSports(result.data.sports);
      setUserImage(result.data.image);
     setUserImage(result.data.image);
      setUserLocationServer(result.data.location);
      setUserId(result.data._id);
      setUserFriends(result.data.friends);
    }
  };

  useEffect(() => {
    stayLoggedIn();
  }, []);

 

  ////-----------> FETCHING ALL THE USERS FROM THE SERVER

  //https://lestgo.coolasfk.repl.co/users_nearby?lon=18.070568214261815&lat=53.18286155194309&distance=300000

  let fetchUsers = async () => {
   

    try {
      const response = await axios.post(
        //"https://lestgo--coolasfk.repl.co/users_nearby", 
        { distance: 1000, sports: userSports, location: userLocationServer }
        `${path}users_nearby`,
  
      );
      let returnedUsers = [];

      for (let user of response.data) {
        let tempUser = {
          id: user._id,
          name: user.name,
          location: user.location,
          age: user.age,
          sports: user.sports,
          image: user.image,
          friends: user.friends,
          city: user.city,
          peopleIdontWannaSeeAgain: user.peopleIdontWannaSeeAgain,
        };

        returnedUsers.push(tempUser);
      }
      setFetchedUsers(returnedUsers);
    } catch (e) {
      "error fetching", e;
    }
  };

  const searchFriends = () => {
    setIsNewFriendsOn(true);
    fetchUsers();
  };

  let fetchMyFriends = () => {
    setIsNewFriendsOn(false);
  };

  const goToEditYourProfile = () => {
    navigation.navigate("EditYourProfile");
  };

  useEffect(() => {
    axios
      //.post("https://lestgo--coolasfk.repl.co/myfriends")
      .post(`${path}myfriends`)
      .then((response) => {
        let returnedUsers = [];

        for (let user of response.data) {
          const tempUser = {
            id: user._id,
            name: user.name,
            location: user.location,
            age: user.age,
            sports: user.sports,
            image: user.image,
            city: user.city,
            bioFriend: user.bio,
          };
          returnedUsers.push(tempUser);
        }

        setMyFriendsFetched(returnedUsers);
      });
  }, []);

  return (
    <View style={styles.mainContainer}>
      <Text
        onPress={goToEditYourProfile}
        style={[
          Style.headline,
          { marginTop: 60, fontSize: 10, marginBottom: 10 },
        ]}
      >
        click here to edit
      </Text>

      <Image
        source={{ uri: `data:image/png;base64,${userImage}` }}
        onPress={goToEditYourProfile}
        style={{
          width: 80,
          height: 80,
          borderRadius: 50,
        }}
      />
      <Text style={[Style.headline, { marginTop: 20, fontSize: 18 }]}>
        Hey, {userName}! Let's go!
      </Text>

      <View style={styles.newFriendsContainer}>
        <View
          style={[
            styles.friendsBtn,
            isNewFriendsOn
              ? { borderColor: Color.color10, backgroundColor: Color.color10 }
              : { borderColor: Color.color10 },
          ]}
        >
          <Text
            onPress={searchFriends}
            style={[
              Style.smallText,
              isNewFriendsOn
                ? { marginBottom: 0, color: Color.myBgColor }
                : { marginBottom: 0, color: Color.color10 },
            ]}
          >
            Search Friends
          </Text>
        </View>

        <View
          style={[
            styles.friendsBtn,
            isNewFriendsOn
              ? {
                  borderColor: Color.fontBodyColor,
                }
              : {
                  borderColor: Color.fontBodyColor,
                  backgroundColor: Color.fontBodyColor,
                },
          ]}
        >
          <Text
            onPress={fetchMyFriends}
            style={[
              Style.smallText,
              isNewFriendsOn
                ? { marginBottom: 0, fontSize: 18, color: Color.fontBodyColor }
                : { marginBottom: 0, fontSize: 18, color: Color.myBgColor },
            ]}
          >
            Your Friends
          </Text>
        </View>
        <View></View>
      </View>
      {isNewFriendsOn ? (
        <SearchFriends fetchedUsers={fetchedUsers} />
      ) : (
        <MyFriends
          myFriendsFetched={myFriendsFetched}
          navigation={navigation}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Color.myBgColor,
    alignItems: "center",
    width: "100%",

    justifyItems: "center",
    height: "100%",
  },
  welcomeText: {
    fontFamily: "Quicksand_500Medium",
    fontSize: 16,
    color: Color.fontBodyColor,
  },
  yourProfile: {
    borderWidth: "1px",
    width: "100%",

    marginTop: 20,
    alignContent: "center",
  },
  newFriendsContainer: {
    flexDirection: "row",
  },

  pressed: {
    opacity: 0.7,
    transform: "translateY(2px)",
  },
  notCompleted: {
    opacity: 0.3,
  },

  friendsBtn: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 5,
    marginRight: 5,

    paddingTop: "2.5%",
    paddingBottom: "2.5%",
    paddingLeft: "5%",
    paddingRight: "5%",
    borderWidth: 3,
    borderRadius: "60%",
    borderColor: "#9E8142",
    marginBottom: "2%",

    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});
export default AfterLoginPage;
