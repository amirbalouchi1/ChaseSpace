/*import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { blogPosts } from "../components/dummyData";
import { useNavigation } from "expo-router";
import { COLORS } from "../constants";

export default function BlogScreen() {
    const navigation = useNavigation()

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <FlatList
                style={{ marginTop: 50 }}
                data={blogPosts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (

                    <View style={styles.card}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.author}>{item.author}</Text>
                        <Text style={styles.date}>{item.date}</Text>
                        <Text>{item.content}</Text>
                    </View>



                )}
            />
            <View style={styles.container}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Post Blog')}>
                    <Text style={styles.buttonText}>Post Blog</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        margin: 10,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    author: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 10,
    },
    date: {
        fontSize: 14,
        color: 'gray',
    },
    container: {
        position: 'absolute',
        bottom: 20,
        right: 20,
    },
    button: {

        width: 150,
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: COLORS.purple,
        borderWidth: 1,
    backgroundColor:COLORS.lightPurple

    },
    buttonText: {
        color: COLORS.purple,
        fontSize: 18,
        fontWeight: 'bold',
    },
});*/