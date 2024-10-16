import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  useWindowDimensions,
} from "react-native";

import ActionButton from "./ActionButton";
import style from "../style/Style";
import BackArrow from "../components/BackArrow";
import Color from "../style/Color";
import UserNameData from "./UserNameData";
import ChooseSport from "../components/ChooseSport";
import AcceptConditions from "../components/AcceptConditions";
import ImageUpload from "./ImageUpload";
import { useState } from "react";
import { UseContextHook } from "../store/context/ContextProvider";
const windowWidth = Dimensions.get("window").width;
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
//import axios from "axios";
import axios, { isCancel, AxiosError } from "axios";

const RegisterSignUp = ({ navigation }) => {
  const { height, width, scale, fontScale } = useWindowDimensions();

  let {
    image,
    actionBtnOpacity,
    setActionButtonOpacity,
    userData,
    base64,
    setBase64,
    chosenSports,
    setImage,
    setUserData,
    setChosenSports,
    location,
    setLocation,
    userLocation,
    setUserLocation,
    newCity,
    textInputName,
    setCity,
    cityText,
    setCityText,
    path,
    setPath,
  } = UseContextHook();

  //console.log("checking if any data are there registerSignUp ", userData );

  let [steps, setSteps] = useState(0);
  let [progressText, setProgressText] = useState("1/4");
  let [headline, setHeadline] = useState(
    "Craft your profile to match with your new sporty buddies."
  );

  let [actionText, setActionText] = useState("next");
  // let [actionBtnOpacity, setActionButtonOpacity] = useState(0.3);

  const moveToNextScreen = () => {
    if (
      steps === 0
      // && image !== null
    ) {
      setSteps(width * 2);
      setActionButtonOpacity(0.3);
      setProgressText("2/4");
      setHeadline(
        "Pick two activities to find companions who share your preferences."
      );
    } else if (steps === width * 2) {
      ("is mu console working4");
      setSteps(width * 4);
      setActionButtonOpacity(0.3);
      // ("data should be sent", "userData", userData);
      setProgressText("3/4");
      setHeadline("Now the formalities. What's your name?");
      //  submitData()
    } else if (steps === width * 4 && userData.age && userData.name && userData.password && userData.email1) {
      setSteps(width * 6);
      setProgressText("4/4");
      setHeadline("Just check those boxes and we're back in action!");
      setActionText("submit");
    } else if (steps === width * 6) {
      userData.image = base64;
      userData.sports = chosenSports;
      userData.location = userLocation;
      userData.city = newCity;

      // console.log("user data", userData);
      sendDataToServer();

      // fetch("https://lestgo--coolasfk.repl.co/users", {
      //   method: "POST",
      //   headers: { "content-type": "application/json" },
      //   body: JSON.stringify(userData),
      // })
      //   .catch((error) => {
      //     console.error("error:", error);
      //   })
      //   .then((d) => d.json())
      //   .then((res) => {
      //     navigation.navigate("AfterLoginPage");
      //   });

      // saveEmailAndPass();
    }
    else
    {
     console.log("age: ", userData.age, "name: ", userData.name, "pass ", userData.password, "email: ", userData.email1);
      setActionText("Let's just wait a second.");
    }
  };


  const sendDataToServer = async () => {
    // userData.image = base64;
    // userData.sports = chosenSports;
    // userData.location = userLocation;
    // userData.city = newCity;
    console.log("check before the SEND:::: ", userData);
    let data;
    try {
      data = await axios.post(
        `${path}users`,
        {
          image: userData.image,
          sports: userData.sports,
          location: userLocation,
          city: userData.city,
          name: userData.name,
          age: userData.age,
          email1: userData.email1,
          password: userData.password,
        },
        { withCredentials: true }
      );
      console.log("additional check: ", data);
      if (data.status === 200) {
        console.log("user added success");
        navigation.navigate("AfterLoginPage");
      } else {
        console.log("user already exists");
      }
    } catch (error) {
      //console.log("error Status", error.response.status);
      console.log("error Status", error.response?.status, AxiosError);

      if (error.response?.status === 403) {
        console.log("Full error: ", error);
        alert("Hey mate, looks like you have already registered!");
      } else {
        console.log("Full error: ", error);
        console.log(data);
        alert("Ooops something went wrong, check your connection & try again.");
      }
    }
  };

  const goBack = () => {
    if (steps === 0) {
      navigation.navigate("WelcomeScreen");
    } else if (steps === width * 2) {
      setProgressText("1/4");
      setHeadline("Craft your profile to match with your new sporty buddies.");
      setSteps(0);
    } else if (steps === width * 4) {
      setSteps(width * 2);
      setHeadline(
        "Pick two activities to find companions who share your preferences."
      );
      setProgressText("2/4");
    } else if (steps === width * 6) {
      setSteps(width * 4);
      setProgressText("3/4");
      setActionText("next");
      setHeadline("Now the formalities. What's your name?");
    }
  };

  // const saveEmailAndPass = async () => {
  //   try {
  //     // const email = JSON.stringify(userData.email1)
  //     await AsyncStorage.setItem("email", userData.email1);
  //     // const password = JSON.stringify(userData.password)
  //     await AsyncStorage.setItem("password", userData.password);
  //   } catch (e) {
  //     (e);
  //   }
  // };

  // const storeData = async (value) => {
  //   try {
  //     await AsyncStorage.setItem("@storage_Key", value);
  //   } catch (e) {
  //     // saving error
  //   }
  // };

  return (
    <KeyboardAwareScrollView
      style={{ backgroundColor: "#4c69a5" }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={styles.container}
      scrollEnabled={false}
    >
      <View style={style.screenLayout1}>
        <View style={design.backArrowPosition}>
          <BackArrow onPress={goBack} />
        </View>

        <View style={design.container}>
          <Text style={[style.headline, { marginTop: 2 }]}>{headline}</Text>

          {/* <View style={[design.scrollContainer, { marginRight: steps }]}> */}
          <View style={[design.scrollContainer, { marginRight: steps }]}>
            <View style={design.horizontalScroll}>
              <ImageUpload width={windowWidth} />
              <View width={windowWidth} height={windowWidth + 60}>
                <ChooseSport />
              </View>
              <View
                width={windowWidth}
                height={windowWidth + 120}
                // backgroundColor="blue"
              >
                <UserNameData userData={userData} setUserData={setUserData} />
              </View>
              <View width={windowWidth} height={windowWidth + 20}>
                <AcceptConditions />
              </View>
            </View>
          </View>
          <ActionButton
            opacity={actionBtnOpacity}
            cta={actionText}
            onPress={moveToNextScreen}
          ></ActionButton>
          <Text
            style={[
              style.headline,
              {
                marginTop: 20,
                fontSize: 18,
                fontFamily: "Quicksand_600SemiBold",
              },
            ]}
          >
            {progressText}
          </Text>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};
const color = () => {
  let color = Color.fontBodyColor;
  return color;
};
const design = StyleSheet.create({
  smallText: {
    color: Color.color2,
    textAlign: "center",
    fontFamily: "Quicksand_500Medium",
    fontSize: 18,
    maxWidth: 300,
    marginBottom: 100,
  },
  backArrowPosition: {
    width: "100%",
    alignContent: "left",
    marginLeft: "10%",
  },
  centered: {
    flexDirection: "column",
    width: "100%",
    alignItems: "center",

    justifyContent: "center",
  },
  circle: {
    width: 17,
    height: 17,
    borderRadius: 100 / 2,
    backgroundColor: { color },
    borderWidth: 3,
    borderColor: Color.fontBodyColor,
    marginLeft: "1%",
    marginRight: "1%",
    marginTop: "10%",
    marginBottom: "10%",
  },
  container: {
    width: "100%",

    alignItems: "center",
    justifyItems: "center",
  },
  scrollContainer: {
    // backgroundColor: "red",
    height: windowWidth + 20,
    marginBottom: 80,

    // marginRight: 100,
    // overflow: "hidden",
    // justifyItems: "left",
    // alignItems: "left",

    // transform: [{ translateX: windowWidth }],
  },
  horizontalScroll: {
    // justifyItems: "left",
    // alignItems: "left",
    width: windowWidth,
    flexDirection: "row",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
export default RegisterSignUp;
