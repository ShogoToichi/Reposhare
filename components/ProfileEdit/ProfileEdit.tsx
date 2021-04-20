import React from "react"
import { StyleSheet, KeyboardAvoidingView,Platform } from "react-native"
import ProfEdit from "./organisms/ProfEdit"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
})

const ProfileEdit = ({ navigation }) => {

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ProfEdit onPress={() => navigation.navigate("Mypage")} />
    </KeyboardAvoidingView>
  )
}
export default ProfileEdit
