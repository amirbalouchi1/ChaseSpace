import { View, Text, StyleSheet, Image } from "react-native";
import React, { useCallback, useLayoutEffect, useState } from "react";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import {
  collection,
  addDoc,
  orderBy,
  query,
  onSnapshot,
  updateDoc,
  doc,
} from "firebase/firestore";
import Filter from "bad-words";
import { database, storage } from "../../config/firebase";
import { TouchableOpacity } from "react-native-gesture-handler";
import { COLORS, FONT } from "../../constants";
import { useFocusEffect } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import {
  ref,
  getDownloadURL,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";

function LogoTitle({ firstname }) {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Image
        style={{ width: 40, height: 40 }}
        source={require("../../assets/images/account.png")}
      />

      <Text style={styles.headerTitle}>{firstname}</Text>
    </View>
  );
}

const ChatScreen = ({ route, navigation }) => {
  const { participantId, participantName, conversationId } = route.params;
  const [messages, setMessages] = useState([]);
  const [progress, setProgress] = useState(0);
  const { authData } = useAuth();
  const filter = new Filter();

  //Gives header the users name
  useLayoutEffect(() => {
    console.log("Header");
    navigation.setOptions({
      headerTitle: () => <LogoTitle firstname={participantName} />,
      headerRight: () => (
        <View style={{ marginRight: 20 }}>
          <TouchableOpacity onPress={pickImageasync}>
            <Feather name="camera" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, participantName]);
  console.log("1");

  //Connects to firebase database and populates chatroom
  useLayoutEffect(() => {
    const messagesCollectionRef = collection(database, "GroupMessages");
    const conversationDocRef = doc(messagesCollectionRef, conversationId);
    const messagesSubcollectionRef = collection(conversationDocRef, "Messages");
    const q = query(messagesSubcollectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      console.log("snapshot");
      setMessages(
        snapshot.docs.map((doc) => {
          const read = { ...doc.data().read, [authData.id]: true };
          updateDoc(doc.ref, { read });
          return {
            _id: doc.data()._id,
            createdAt: doc.data().createdAt.toDate(),
            text: doc.data().text,
            image: doc.data().image,
            user: doc.data().user,
            read: doc.data().read,
          };
        })
      );
    });
    return () => unsubscribe();
  }, []);

  //Gets rid of tabBar
  useFocusEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: "none",
      },
    });

    return () => {
      navigation.getParent()?.setOptions({
        tabBarStyle: "visible",
        tabBarStyle: {
          paddingBottom: 7,
          paddingTop: 5,
          height: 60,
        },
      });
    };
  });

  //Send Message
  const onSendHandler = useCallback(async (messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    console.log(messages[0]);
    const { _id, createdAt, text, user } = messages[0];
    const read = { [authData.id]: true, [participantId]: false };
    const messagesCollectionRef = collection(database, "GroupMessages");
    const conversationDocRef = doc(messagesCollectionRef, conversationId); // Reference to the conversation document
    const messagesSubcollectionRef = collection(conversationDocRef, "Messages"); // Reference to the subcollection

    // Create a new message document
    const newMessage = {
      _id,
      createdAt,
      text: filter.clean(text),
      image: null,
      user,
      read: read,
    };

    // Add the new message to the subcollection
    await addDoc(messagesSubcollectionRef, newMessage);
  }, []);

  const uploadImage = async (uri, fileType) => {
    let imageURL;

    // blob is necessary for the image upload to work.
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // on load
      xhr.onload = function () {
        resolve(xhr.response);
      };
      // on error
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      // on complete
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    // Targets the storage in firebase. This storage is unrelated to where the messages are stored.
    const storageRef = ref(storage, `images/${authData.id}/${Date.now()}`);
    const result = uploadBytesResumable(storageRef, blob);

    result.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress.toFixed()}% done`);

        // Currently the progress bar doesn't work properly.
        setProgress(progress.toFixed());
      },
      (error) => {
        console.error("Error uploading image:", error);
      },
      async () => {
        try {
          imageURL = await getDownloadURL(storageRef);
          console.log("Image upload complete");
          console.log("Download URL:", imageURL);

          // Now imageURL is accessible within this callback
          const newMessage = {
            _id: Date.now(),
            createdAt: new Date(),
            text: null,
            image: imageURL,
            user: {
              _id: authData.id,
              firstName: authData.firstName,
              avatar:
                "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=",
            },
          };

          // Add the new message to the subcollection
          const messagesCollectionRef = collection(database, "GroupMessages");
          const conversationDocRef = doc(messagesCollectionRef, conversationId);
          const messagesSubcollectionRef = collection(
            conversationDocRef,
            "Messages"
          );
          await addDoc(messagesSubcollectionRef, newMessage);
          blob.close();
        } catch (error) {
          console.error("Error getting download URL:", error);
        }
      }
    );
  };

  //Get Image from Gallery
  const pickImageasync = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    const hasStoragePermissionGranted = status === "granted";

    if (!hasStoragePermissionGranted) return null;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      console.log("Before uploadImage Function call");
      await uploadImage(result.assets[0].uri, "image");
    }
  };

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSendHandler(messages)}
      user={{
        _id: authData.id,
        firstName: authData.firstName,
        avatar:
          "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=",
      }}
      messagesContainerStyle={{ backgroundColor: COLORS.white }}
      renderBubble={(props) => {
        return (
          <Bubble
            {...props}
            textStyle={{
              right: {
                color: COLORS.white,
                fontFamily: FONT.regular,
              },
              left: {
                color: COLORS.primary,
                fontFamily: FONT.regular,
              },
            }}
            wrapperStyle={{
              right: {
                backgroundColor: COLORS.purple,
              },
              left: {
                backgroundColor: COLORS.lightPink,
              },
            }}
          />
        );
      }}
      alwaysShowSend
    />
  );
};

const styles = StyleSheet.create({
  headerTitle: {
    fontFamily: FONT.bold,
    fontWeight: "bold",
    fontSize: 24,
    marginLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  chatContainer: {
    padding: 10,
  },
  messageBubble: {
    maxWidth: "70%",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  userMessage: {
    backgroundColor: COLORS.purple,
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "#E0E0E0",
    alignSelf: "flex-start",
  },
  messageText: {
    fontFamily: FONT.regular,
    color: "#FFF",
  },
  chatInfoContainer: {
    padding: 10,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: "#CCCCCC",
  },

  unreadCount: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: "#CCCCCC",
  },
  input: {
    fontFamily: FONT.regular,
    flex: 1,
    backgroundColor: "#f8f8f8",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: COLORS.purple,
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    fontFamily: FONT.regular,
    color: "#FFF",
    fontWeight: "normal",
  },
});
export default ChatScreen;
