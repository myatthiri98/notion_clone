import NotionButton from "@/components/NotionButton"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { Colors } from "@/constants/Colors"
import { extendedClient } from "@/myDbModule"
import { NotionFile } from "@prisma/client/react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import React, { useEffect, useRef, useState } from "react"
import {
  Alert,
  ScrollView,
  TextInput,
  useColorScheme,
  StyleSheet,
  Text,
  InputAccessoryView,
  Pressable,
  View,
} from "react-native"

const EXAMPLE_CONTENT = [
  "# Insert subtitle here!",
  "Hello, *world*! I'm excited to share this with you.",
  "Visit my website: codewithbeto.dev",
  "> This is a blockquote, a great way to highlight quotes or important notes.",
  "`inline code` is useful for highlighting code within a sentence.",
  "Here's a code block example:",
  "```\n// Codeblock\nconsole.log('🚀 Ready to launch!');\n```",
  "Mentions:",
  "- @here (notify everyone)",
  "- @beto@expo.dev (mention a specific user)",
  "Use #hashtags to organize content, like this: #mention-report",
].join("\n")
const inputAccessoryViewID = "newNotion"
const defaultIcons = [
  "🚀",
  "👻",
  "🎨",
  "🎤",
  "🥁",
  "🎲",
  "📱",
  "🌟",
  "🔥",
  "💡",
  "🚗",
  "🌈",
  "📚",
  "💻",
  "🎧",
  "🏆",
  "⚽",
  "🍔",
  "🎂",
  "🎵",
  "✈️",
  "🎮",
  "🌍",
  "🍕",
  "📷",
  "📅",
  "🔍",
  "🔧",
  "📝",
  "🛠️",
  "💼",
  "📞",
  "📈",
  "🏠",
  "🎉",
]

const randomIcon = () =>
  defaultIcons[Math.floor(Math.random() * defaultIcons.length)]

export default function NewNotionScreen() {
  const theme = useColorScheme()
  const routeParams = useLocalSearchParams<{
    parentId?: string
    viewingFile?: string
  }>()
  const router = useRouter()
  const viewingFile: NotionFile = routeParams.viewingFile
    ? JSON.parse(routeParams.viewingFile)
    : null

  const childFiles = extendedClient.notionFile.useFindMany({
    where: {
      parentFileId: viewingFile?.id ?? -1,
    },
  })
  const parentFile = extendedClient.notionFile.useFindUnique({
    where: {
      id: viewingFile?.parentFileId ?? -1,
    },
  })
  const titleRef = useRef<TextInput>(null)
  const [title, setTitle] = useState(viewingFile ? viewingFile?.title : "")
  const [text, setText] = useState(viewingFile ? viewingFile?.content : "")
  const [icon, setIcon] = useState(
    viewingFile ? viewingFile?.icon : () => randomIcon()
  )
  const backgroundColor = Colors[theme!].background as any
  const textColor = Colors[theme!].text as any
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current?.focus()
    }
  }, [theme])

  function handleSaveNotionFile() {
    if (!title) return
    const data = {
      title: title,
      description: "",
      coverPhoto: "",
      icon: icon ?? randomIcon(),
      content: text,
      authorId: 1,
      type: "default",
      createdAt: new Date().toISOString(),
      parentFileId: routeParams.parentId
        ? Number(routeParams.parentId)
        : viewingFile
        ? viewingFile.parentFileId
        : null,
    }

    try {
      if (viewingFile) {
        console.log("updating")
        extendedClient.notionFile.update({
          where: { id: viewingFile.id },
          data: data,
        })
      } else {
        console.log("creating")
        extendedClient.notionFile.create({
          data: data,
        })
      }

      setTitle("")
      setText("")
      setIcon(randomIcon())
      router.setParams({ parentId: "", viewingFile: "" })
      if (router.canDismiss()) {
        router.dismissAll()
      }
      router.replace("/(tabs)/")
    } catch (e) {
      Alert.alert("Something went wrong :(")
    }
  }
  return (
    <>
      <ThemedView style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="always">
          <ThemedView style={styles.container}>
            {icon && (
              <Text style={{ fontSize: 60, marginBottom: 6 }}>{icon}</Text>
            )}
            <TextInput
              ref={titleRef}
              placeholder="Untitled"
              value={title}
              onChangeText={setTitle}
              style={{ fontSize: 32, fontWeight: "bold", color: textColor }}
              blurOnSubmit={false}
              inputAccessoryViewID={inputAccessoryViewID}
              multiline
            />
          </ThemedView>
        </ScrollView>
        <InputAccessoryView
          nativeID={inputAccessoryViewID}
          backgroundColor={backgroundColor}
        >
          <View
            style={[styles.accesoryView, { borderColor: textColor + "20" }]}
          >
            <View style={{ flexDirection: "row", gap: 7 }}>
              <NotionButton
                title="AI"
                iconName="sparkles"
                onPress={() => setText(EXAMPLE_CONTENT)}
              />
              <NotionButton
                iconName="images"
                onPress={() => Alert.alert("Coming soon!")}
              />
            </View>
            {/* <ScrollView
            horizontal
            contentContainerStyle={{ gap: 6 }}
            style={{ paddingHorizontal: 7 }}
            showsHorizontalScrollIndicator={false}
          > */}
            {defaultIcons.slice(0, 6).map((icon) => (
              <Pressable key={icon} onPress={() => setIcon(icon)}>
                <ThemedText type="subtitle">{icon}</ThemedText>
              </Pressable>
            ))}
            {/* </ScrollView> */}
          </View>
        </InputAccessoryView>
      </ThemedView>
    </>
  )
}
const styles = StyleSheet.create({
  container: { padding: 10 },
  accesoryView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 7,
    height: 50,
    borderTopWidth: 0.5,
  },
})
