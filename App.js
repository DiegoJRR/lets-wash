import React, { useState, useEffect } from "react";
import { View } from "react-native";
import auth from "@react-native-firebase/auth";
import functions from "@react-native-firebase/functions";
import {
  ApplicationProvider,
  IconRegistry,
  Spinner,
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { EvaIconsPack } from "@ui-kitten/eva-icons";

import { useDispatch, useSelector, Provider } from "react-redux";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import { PersistGate } from "redux-persist/integration/react";

import messaging from "@react-native-firebase/messaging";
import { GoogleSignin } from "@react-native-community/google-signin";
import { store, persistor } from "./redux-config";
import {
    signIn,
    signOut,
    setServiceTypes,
    setVehicleTypes,
    setUserData,  
    setUserRequests,
    setPendingReview,
    setVehicles,
} from "./redux/actions";
import fillRequests from "./handlers/requests";
import AppStackNavigator from "./navigation/AppStackNavigator";
import { navigationRef } from "./Navigation";
import HandleNotifications from "./components/HandleNotifications/HandleNotifications";
import { themes } from "./themes/index";

GoogleSignin.configure({
  webClientId:
    "966047795631-8mlcmnv0gids7vn6d1eno2jfd9vp4c5f.apps.googleusercontent.com",
});

// // Triggered when app is in backgound and we click, tapped and opened notifiaction
messaging().onNotificationOpenedApp((notificationOpen) => {
  console.log("1", notificationOpen);
  // const { title, body } = notificationOpen.notification;
  // Handle notification data
});

messaging().setBackgroundMessageHandler((message) => {
  console.log("Message handled in the background!", message);
});

const Application = () => {
  const dispatch = useDispatch();
  const [subscribers, setSubscribers] = useState([]);
  const { user, isSignedIn, userTheme } = useSelector((state) => ({
    user: state.user,
    isSignedIn: state.isSignedIn,
    userTheme: state.theme,
  }));

  const [loading, setLoading] = useState(true);

  const onAuthStateChanged = async (user_) => {
    if (user_) {
      // TODO: Validar que las credenciales sean de un usuario (No empleado o admin)
      await functions()
        .httpsCallable("getServices")()
        .then((res) => {
          if (res?.data?.code === 200) {
            dispatch(setServiceTypes(res.data.message));
          }
        })
        .catch((err) => {
          console.log(err);
        });

      await functions()
        .httpsCallable("getVehicleTypes")()
        .then((res) => {
          if (res?.data?.code === 200) {
            dispatch(setVehicleTypes(res.data.message));
          }
        })
        .catch((err) => {
          console.log(err);
        });

      await functions()
        .httpsCallable("getPendingReview")()
        .then((res) => {
          if (res?.data?.code === 200) {
            dispatch(setPendingReview(res.data.message));
          }
        })
        .catch((err) => {
          console.log(err);
        });

      // TODO: No volver a extraer datos del usuario
      let userFound = false;
      await functions()
        .httpsCallable("getUserData")()
        .then(async (res) => {
          if (res?.data?.code === 200 && res.data.message) {
            const url = await storage()
              .refFromURL(res.data.message.profilePicture)
              .getDownloadURL();

            userFound = true;

            dispatch(
              setUserData({
                ...res.data.message,
                profilePictureRef: res.data.message.profilePicture,
                profilePicture: url,
              })
            );
            dispatch(signIn(user_));
          } else {
            // TODO: Revisar si el codigo no es 200 cuando el usuario no existe
            auth()
              .signOut()
              .then(() => {
                dispatch(signOut()); // TODO: validar tambien en otras requests
              })
              .catch(() => {
                // No signed in
              });
          }
        })
        .catch((err) => console.warn(err));

      if (!userFound) return;

      await functions()
        .httpsCallable("getVehicles")({})
        .then((res) => {
          if (res?.data?.message) dispatch(setVehicles(res?.data?.message));
        })
        .catch((err) => {
          console.error(err);
        });

      const requestSubscriber = firestore()
        .collection("requests")
        .where("user", "==", user_.uid)
        .onSnapshot((snapshot) => {
          if (snapshot?.docs) {
            fillRequests(snapshot).then((data) => {
              dispatch(setUserRequests(data));
            });
          }
        }, console.log);

      setSubscribers([requestSubscriber]);
      setLoading(false);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Triggered when app is closed and we click,tapped and opened notification

    setLoading(true);
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return () => {
      subscriber(); // unsubscribe on unmount
      subscribers.forEach((sub) => {
        sub();
      })
    };
  }, []);

  useEffect(() => {
    if (!isSignedIn) {
      subscribers.forEach((sub) => {
        sub();
      })
    }
  }, [isSignedIn]);

  return (
    <>
      {isSignedIn ? <HandleNotifications /> : null}
      <ApplicationProvider
        {...eva}
        theme={{
          ...themes[userTheme].theme,
        }}
      >
        {loading ? (
          <View
            style={{
              flex: 1,
              width: "100%",
              justifyContent: "center",
              alignContent: "center",
              alignItems: "center",
              backgroundColor: themes[userTheme].theme["color-basic-100"], // TODO: Mover ApplicationProvider a otro componente para usar theme
            }}
          >
            <Spinner />
          </View>
        ) : (
          <NavigationContainer ref={navigationRef}>
            <AppStackNavigator isSignedIn={isSignedIn} />
          </NavigationContainer>
        )}
      </ApplicationProvider>
    </>
  );
};

export default () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Application />
      </PersistGate>
    </Provider>
  </>
);
