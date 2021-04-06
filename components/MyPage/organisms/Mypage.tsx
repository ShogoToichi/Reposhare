import React, { useEffect, useState } from "react"
import { View, Text } from "react-native"
import Title from "../atoms/Title"
import MyProf from "../molecules/MyProf"
import EditBtn from "../atoms/EditBtn"
import db from "../../../firebase/firebase"
import { connect } from "react-redux"
import { encodeEmail } from "../../../redux/Lib"

let userImage = "no data"
let name = "no data"
let intro = "no data"

function Mypage(props) {
  const [update, setUpdate] = useState(false)
  const Email = encodeEmail(props.email)
  const getFireData = async () => {
    // Emailでfirebaseを参照
    await db
      .collection("users")
      .doc(Email)
      .get()
      .then(async (doc) => {
        const profileData = doc.data()
        name = profileData.name
        intro = profileData.intro
        // favoriteSubject = profileData.profile.favoriteSubject
        // userImage = await getProfileImageUrl(profileData.imageName)
      })
    setUpdate(update ? false : true)
  }
  useEffect(() => {
    getFireData()
  }, [])

  return (
    <View>
      <Title />
      <Text>{name}</Text>
      <MyProf
        // src={userImage}
        name={name}
        // favoSub={favoriteSubject}
        intro={intro}
      />
      <EditBtn onPress={props.onPress} />
    </View>
  )
}

Mypage = connect((state) => state)(Mypage)
export default Mypage
