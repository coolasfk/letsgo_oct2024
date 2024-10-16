import {
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Text,
  Dimensions,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import React from "react";
import { Switch } from "react-native-paper";
import Color from "../style/Color";
import { UseContextHook } from "../store/context/ContextProvider";
import * as Location from "expo-location";

const UserNameData = ({ userData, setUserData }) => {
  let {
    setActionButtonOpacity,
    userLocation,
    setLocation,
    setUserLocation,
    setCity,
    email,
    setEmail,
    password,
    setPassword,
    setAge,
    age,
    setUserName,
    userName,
  } = UseContextHook();
  const [textInputName, setTextInputName] = useState("");
  const [textInputAge, setTextInputAge] = useState(null);

  const [displayEmail, setDisplayEmail] = useState("none");
  ///------> ADD A FUNC TO NOT ALLOW TO REGISTER THE SAME EMAIL TWICE
  let nameColor = Color.color2;
  let ageColor = "red";
  let emailColor = "green";
  let displayName = "none";
  let displayAge = "none";

  let displayPassword = "none";

  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const onToggleSwitch = async () => {
    await letsgo();
    setIsSwitchOn(!isSwitchOn);
  };

  let letsgo = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      ("function works");
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);

    "lon, lat", location.coords.longitude, location.coords.latitude;
    let longitude = location.coords.longitude;
    let latitude = location.coords.latitude;
    let coordinates = [longitude, latitude];

    let address = await Location.reverseGeocodeAsync(location.coords);

    let newCity = address[0].city;
    setCity(newCity);
    setUserData({ ...userData, city: newCity });

    setUserLocation({
      coordinates: coordinates,
    });
  };
  const handleTextInput = (newText) => {
    setTextInputName(newText);
  };



  useEffect(() => {
    if(textInputName.length > 1)
    {
     
         setUserData({ ...userData, name: textInputName});
         console.log("checking userData name: ", userData.name)   
     
    }
      
  }, [textInputName]);

  const handleAgeInput = (newText) => {
    setTextInputAge(newText);
  };

  useEffect(() => {
    console.log("HELLO HELLO");
    if (textInputAge != null && textInputAge > 18) {
      console.log("wtf text input age: ", textInputAge);
      
      setUserData((prevData) => ({
        ...prevData,
        age: +textInputAge,
      }));
    }
  }, [textInputAge]);
  
  // Additional effect to confirm the update
  useEffect(() => {
    console.log("userData.age updated:", userData.age);
  }, [userData.age]);

  const handlePassword = (newText) => {

    setPassword(newText);
  };

    useEffect(()=> {
      if(password && userData.password !== password)
      {  
           setUserData({...userData, password: password})  
           console.log("checking userData password: ", userData.password)   
    }}, [password])


  const handleEmail = (newText) => {
    setEmail(newText);
    const emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    // ("------userData email", userData);
    if (emailPattern.test(email)) {
      setDisplayEmail("flex");

      //   Alert.alert("Valid Email", "The email address is valid.");
    } else {
      setDisplayEmail("none");
    }
  };

  useEffect(() => {
    if (email != null) {
      setUserData({ ...userData, email1: email})
    }}, [email]);
 
  if (textInputName.length > 1) {
    nameColor = "green";
    displayName = "flex";
  }
  if (textInputAge >= 18) {
    ageColor = "green";
    displayAge = "flex";
  }
  if (password.length >= 3) {
    displayPassword = "flex";
  }

  useEffect(() => {
    if (
      displayAge === "flex" &&
      displayName === "flex" &&
      displayEmail === "flex" &&
      displayPassword === "flex" &&
      isSwitchOn === true
    ) {
      setActionButtonOpacity(1);

      ("ok");
    } else {
      setActionButtonOpacity(0.3);
    }
  }, [displayEmail, displayName, displayAge, displayPassword, isSwitchOn]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={design.centered}>
          <View style={design.inputContainer}>
            <TextInput
              autoCorrect={false}
              maxLength={25}
              onChangeText={handleTextInput}
              style={design.textInput}
              placeholder="type in your name"
            ></TextInput>
            <Ionicons
              name="checkmark-circle-outline"
              size={30}
              color={nameColor}
              display={displayName}
            />
          </View>
          <View
            style={[
              design.inputContainer,
              // {
              //   backgroundColor: Color.myBgColor,
              //   borderColor: Color.fontBodyColor,
              //   borderWidth: 2,
              // },
            ]}
          >
            <Text style={[design.textInput]}>share my location</Text>
            <Switch
              color={Color.fontBodyColor}
              value={isSwitchOn}
              onValueChange={onToggleSwitch}
            />
          </View>
          <View style={design.inputContainer}>
            <TextInput
              keyboardType="numeric"
              maxLength={2}
              onChangeText={handleAgeInput}
              style={design.textInput}
              placeholder="type in your age"
            ></TextInput>

            <Ionicons
              name="checkmark-circle-outline"
              size={30}
              color={ageColor}
              display={displayAge}
            />
          </View>
          <View style={design.inputContainer}>
            <TextInput
              autoCorrect={false}
              autoCapitalize="none"
              keyboardType="email-address"
              maxLength={40}
              onChangeText={handleEmail}
              style={design.textInput}
              placeholder="type in your email"
            ></TextInput>
            <Ionicons
              name="checkmark-circle-outline"
              size={30}
              color={emailColor}
              display={displayEmail}
            />
          </View>
          <View style={design.inputContainer}>
            <TextInput
              autoCorrect={false}
              autoCapitalize="none"
              maxLength={25}
              onChangeText={handlePassword}
              style={design.textInput}
              placeholder="type in your password"
            ></TextInput>
            <Ionicons
              name="checkmark-circle-outline"
              size={30}
              color="green"
              display={displayPassword}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const design = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    // justifyItems: "center",
    alignItems: "center",
    justifyContent: "center",
    // borderWidth: 1,
    margin: 10,
    backgroundColor: Color.color3,

    borderRadius: 45,
    padding: 15,
  },
  textInput: {
    color: Color.color2,
    textAlign: "center",
    fontFamily: "Quicksand_500Medium",
    fontSize: 18,
    // fontSize: 22,
    maxWidth: 300,
    backgroundColor: Color.color3,

    marginRight: 10,

    paddingLeft: 20,
    paddingRight: 20,
  },
  button: {
    marginLeft: 100,
  },
  smallText: {
    color: Color.color2,
    textAlign: "center",
    fontFamily: "Quicksand_500Medium",
    fontSize: 18,
    maxWidth: 300,
  },
  centered: {
    overflow: "visible",
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-around",
  },

  textInput: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 36,
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12,
  },
});

export default UserNameData;
