import React, { useState, useEffect } from "react"
import { View, Pressable,Platform } from "react-native"
import Title from "../atoms/Title"
import InputForm from "../molecules/InputForm"
import AddBtn from "../atoms/AddBtn"
import { connect } from "react-redux"
import firebase from "firebase"
import db from "../../../firebase/firebase"
import * as ImagePicker from "expo-image-picker"

function Repoadd(props) {
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [category, setCategory] = useState("")
  const [due, setDue] = useState("")
  const [detail, setDetail] = useState("")
  const [url, setUrl] = useState(null)
  const email = props.email

  const doChangeTitle = (value) => {
    setTitle(value)
  }

  const doChangePrice = (value) => {
    setPrice(value)
  }

  const doChangeCategory = (value) => {
    setCategory(value)
  }

  const doChangeDue = (value) => {
    setDue(value)
  }

  const doChangeDetail = (value) => {
    setDetail(value)
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
      setUrl(result.uri)
    }

    
  }

  const doAdd = async () => {
    // ファイルメタデータの作製(jpeg)
    const metadata = {
      contentType: "image/jpeg"
    }
    // 文字列としてurlを生成
    const postIndex = Date.now().toString()
    const storage = firebase.storage()
    const response = await fetch(url)
    const blob = await response.blob()
    const uploadRef = storage.ref("RepoImages").child(`${postIndex}`)

    // storageに画像を保存
    await uploadRef.put(blob, metadata).catch(() => {
      alert("画像の保存に失敗しました")
    })

    // storageのダウンロードURLをsetUrlに更新
    await uploadRef
      .getDownloadURL()
      .then((DownloadURL) => {
        setUrl(DownloadURL)
      })
      .catch(() => {
        alert("失敗しました")
      })

    await db.collection("reports").doc().set({
      createrId: email,
      title: title,
      price: price,
      category: category,
      due: due,
      detail: detail,
      repoImgUrl: url,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
  }

  return (
    <View>
      <Title />
      <InputForm
        src={{ uri: url }}
        onChangeTitle={doChangeTitle}
        onChangeImg={doChangeImg}
        onChangePrice={doChangePrice}
        onChangeCategory={doChangeCategory}
        onChangeDue={doChangeDue}
        onChangeDetail={doChangeDetail}
      />
      {/* AddBtnを押すとマイページに飛ぶようにしたい */}
      <Pressable onPress={props.onPress} />
      <AddBtn onPress={doAdd} />
    </View>
  )
}

Repoadd = connect((state) => state)(Repoadd)
export default Repoadd
