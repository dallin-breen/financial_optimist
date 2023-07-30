import React, {useState, useEffect} from react;
import { Modal, View, Text, TextInput } from "react-native";

export default function AddData() {
    return (
        <Modal>
            <Text>Opened Modal</Text>
        </Modal>
    )
}

const styles = StyleSheet.create({
    container: {
        height: "75%",
        width: "50%",
        borderColor: "black",
        borderBottomWidth: 2,
        borderTopWidth: 2,
        borderRightWidth: 2,
        borderLeftWidth: 2
    }
})