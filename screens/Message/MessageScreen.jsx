import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TextInput,
  Button,
  ActivityIndicator,
} from "react-native";
import {
  collection,
  query,
  where,
  serverTimestamp,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  orderBy,
  limit,
} from "firebase/firestore";
import { database } from "../../config/firebase";
import React, { useLayoutEffect, useState } from "react";
import { COLORS, FONT } from "../../constants";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";

const MessageScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { authData } = useAuth();
  const [displayChatGroups, setDisplayChatGroups] = useState([]);

  const calculateOtherUsername = (chatGroupData) => {
    if (chatGroupData.username1 === authData.firstName) {
      return chatGroupData.username2;
    }
    return chatGroupData.username1;
  };

  const calculateOtherId = (chatGroupData) => {
    const otherUserId = chatGroupData.userId.find((id) => id !== authData.id);
    return otherUserId;
  };

  useLayoutEffect(() => {
    if (isFocused) {
      // Get GroupChats based on user id.
      const q = query(
        collection(database, "GroupChats"),
        where("userId", "array-contains", authData.id)
      );
      const unsubscribe = onSnapshot(q, async (snapshot) => {
        const chatGroupsData = await Promise.all(
          snapshot.docs.map(async (doc) => {
            const chatGroupData = doc.data();

            // Trying to find what the other users name and id is.
            const otherUsername = calculateOtherUsername(chatGroupData); // Calculate the other user's username
            const otherUserId = calculateOtherId(chatGroupData);

            // Target the correct group chat. Will be used to find unread & latest messages
            const messagesCollectionRef = collection(
              database,
              "GroupMessages",
              chatGroupData.conversationId,
              "Messages"
            );
            const unreadMessagesQuery = query(
              messagesCollectionRef,
              where("read." + authData.id, "==", false)
            );

            const unreadSnapshot = await getDocs(unreadMessagesQuery);
            const numberOfUnreadMessages = unreadSnapshot.size;

            const latestMessageQuery = query(
              messagesCollectionRef,
              orderBy("createdAt", "desc"),
              limit(1)
            );

            const latestMessageSnapshot = await getDocs(latestMessageQuery);
            const latestMessage =
              latestMessageSnapshot.docs[0]?.data()?.text || "";

            return {
              ...chatGroupData,
              otherUsername,
              otherUserId,
              unreadMessages: numberOfUnreadMessages,
              latestMessage,
            };
          })
        );

        setDisplayChatGroups(chatGroupsData);
      });
      return () => unsubscribe();
    }
  }, [isFocused]);

  const handleStartChat = async (participant) => {
    // Navigate to ChatScreen and pass participant information
    navigation.navigate("Chat", {
      participantId: participant.otherUserId,
      participantName: participant.otherUsername,
      conversationId: participant.conversationId,
    });
  };

  // Purely used during developement. Used to manually create a document "GroupChats" with two users
  const handleConnectUsers = async () => {
    // Replace 'otherUserId' with the ID of the user you want to connect with.
    const otherUserId = "83"; // Replace with the actual user ID

    // Create a new chat collection or reference an existing one
    const groupChatCollectionRef = collection(database, "GroupChats");
    const chatDocRef = doc(groupChatCollectionRef);

    // Add metadata to the collection, such as user IDs and creation timestamp
    await setDoc(chatDocRef, {
      userId: [otherUserId, authData.id],
      username1: authData.firstName,
      username2: "Test4",
      createdAt: serverTimestamp(),
      conversationId: chatDocRef.id,
    });
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.chatGroupContainer}
        onPress={() => handleStartChat(item)}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("User Profile", {
              otherUserId: item.otherUserId,
              otherUsername: item.otherUsername,
            })
          }
        >
          <Image
            /*source={item.display_picture}*/ style={styles.displayPicture}
          />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.textContainer}>
            <Text style={styles.name}>{item.otherUsername}</Text>
            <Text style={styles.latestMessage}>{item?.latestMessage}</Text>
          </View>
          <View style={styles.infoContainer}>
            {item?.unreadMessages > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadBadgeText}>
                  {item?.unreadMessages}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        type="text"
        style={styles.input}
        placeholder="Search for chats & messages"
      />
      {displayChatGroups.length > 0 ? (
        <FlatList
          data={displayChatGroups}
          renderItem={renderItem}
          keyExtractor={(item) => `${item.conversationId}`} // Ensure a unique key
        />
      ) : (
        <ActivityIndicator color={"#000"} animating={true} size="small" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
  },
  input: {
    fontFamily: FONT.bold,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    marginTop: 20,
    fontSize: 16,
    color: "#000",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
  },
  chatGroupContainer: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
  },
  displayPicture: {
    width: 50,
    height: 50,
    backgroundColor: COLORS.gray,
    borderRadius: 100,
    marginRight: 16,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  textContainer: {
    flex: 1,
  },
  name: {
    fontFamily: FONT.bold,
    fontSize: 18,
    fontWeight: "500",
  },
  latestMessage: {
    fontFamily: FONT.bold,
    fontSize: 13,
    color: COLORS.gray,
  },
  infoContainer: {
    alignItems: "flex-end",
  },
  timestamp: {
    fontFamily: FONT.bold,
    fontSize: 12,
    color: COLORS.gray,
  },
  unreadBadge: {
    fontFamily: FONT.bold,
    backgroundColor: COLORS.lightPurple,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
    marginTop: 4,
  },
  unreadBadgeText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: "600",
  },
});

export default MessageScreen;
