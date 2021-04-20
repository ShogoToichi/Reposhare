import React, { useState, useEffect } from "react"
import { View, Button ,Platform} from "react-native"
import Title from "../atoms/Title"
import InputForm from "../molecules/InputForm"
import EditBtn from "../atoms/EditBtn"
import { connect } from "react-redux"
import { encodeEmail } from "../../../redux/Lib"
import db from "../../../firebase/firebase"
import firebase from "firebase"
import * as ImagePicker from "expo-image-picker"
import { useNavigation } from "@react-navigation/native"

function ProEdit(props) {
  const [Name, setName] = useState("")
  const [Intro, setIntro] = useState("")
  const [uri, setUri] = useState(null)
  const Email = encodeEmail(props.email)

  // firebase StrageのUrlを入れる変数
  let fireUrl: string

  const doChangeName = (value) => {
    setName(value)
  }

  const doChangeIntro = (value) => {
    setIntro(value)
  }

  // カメラアクセスの要求とエラー処理
  useEffect(() => {
    ;(async () => {
      if (Platform.OS !== "web") {
        const {
          status
        } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!")
        }
      }
    })()
  }, [])

  // 以前登録したデータの取得

  useEffect(() => {
    db.collection("users")
      .doc(Email)
      .get()
      .then((doc) => {
        setName(doc.data().name)
        setIntro(doc.data().intro)
        setUri(doc.data().userImgUrl)
      })
  }, [])

  // 画像データの取得
  const doChangeImg = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      // 要求するメディアタイプの選択
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      // メディアの切り抜き
      allowsEditing: true,
      // 切り抜きのアスペクト比(androidに適用/iosはデフォルトで正方形)
      aspect: [4, 4],
      quality: 1
    })

    console.log(result)

    if (!result.cancelled) {
      setUri(result.uri)
    }
  }
  // 画像データの変換とfireStrageへの登録
  const doEdit = async () => {
    // ファイルメタデータの作製(jpeg)
    const metadata = {
      contentType: "image/jpeg"
    }
    // 文字列としてurlを生成
    const postIndex = Date.now().toString()
    const storage = firebase.storage()
    // 外部のリソース(fireStrage)にリソース(uri)を簡単に記述するためのAPI,responseで基本的に受け取る
    const response = await fetch(uri)
    // blobでバイナリーデータを生成
    const blob = await response.blob()
    // strageにuploadするための参照
    const uploadRef = storage.ref("UserImages").child(`${postIndex}`)

    // storageに画像を保存
    await uploadRef.put(blob, metadata).catch(() => {
      alert("画像の保存に失敗しました")
    })

    // storageのダウンロードURLをfireUrlに入れる
    await uploadRef
      .getDownloadURL()
      .then((DownloadURL) => {
        fireUrl = DownloadURL
      })
      .catch(() => {
        alert("失敗しました")
      })

    await db.collection("users").doc(Email).set({
      name: Name,
      intro: Intro,
      userImgUrl: fireUrl
    })

    // EditBtnを押すとマイページに飛ぶようにしたい
    // useNavigationを取得し、クラスにnavigationを渡す
    const navigation = useNavigation()
    {
      ;() => navigation.navigate("Mypage")
    }
  }

  return (
    <View>
      <Title />
      <InputForm
        src={{ uri: uri }}
        nameInputValue={Name}
        introInputValue={Intro}
        onChangeName={doChangeName}
        onChangeIntro={doChangeIntro}
        onChangeImg={doChangeImg}
      />
      <EditBtn onPress={doEdit} />
    </View>
  )
}

ProEdit = connect((state) => state)(ProEdit)
export default ProEdit
