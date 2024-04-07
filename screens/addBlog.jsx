import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants';

const AddBlogScreen = ({ onSubmit }) => {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = () => {

        const newBlogPost = {
            title,
            author,
            content,
        };




        setTitle('');
        setAuthor('');
        setContent('');
        alert('Blog has been published')
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Title:</Text>
            <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="Enter title..."
            />

            <Text style={styles.label}>Author:</Text>
            <TextInput
                style={styles.input}
                value={author}
                onChangeText={setAuthor}
                placeholder="Enter author..."
            />

            <Text style={styles.label}>Content:</Text>
            <TextInput
                style={[styles.input, styles.multilineInput]}
                multiline
                value={content}
                onChangeText={setContent}
                placeholder="Enter content..."
            />

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    input: {
        fontSize: 16,
        borderColor: 'lightgray',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    multilineInput: {
        height: 100,
    },
    submitButton: {
        borderColor:COLORS.purple,
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        borderWidth:1,
        width:'80%',
        alignSelf:'center',
        backgroundColor:COLORS.lightPurple
         
    },
    submitButtonText: {
        color: COLORS.purple ,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AddBlogScreen;
