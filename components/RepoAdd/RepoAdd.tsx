import React from "react"
import { KeyboardAvoidingView, StyleSheet,Platform } from "react-native"
import Repoadd from "./organisms/Repoadd"

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
})

const RepoAdd = ({ navigation }) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Repoadd navigation={() => navigation.navigate("Mypage")} />
    </KeyboardAvoidingView>
  )
}

export default RepoAdd
