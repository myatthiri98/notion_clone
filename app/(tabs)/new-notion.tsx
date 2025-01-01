import NotionButton from "@/components/NotionButton";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Colors } from "@/constants/Colors";
import { extendedClient } from "@/myDbModule";
import { NotionFile } from "@prisma/client/react-native";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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
  Keyboard,
  TouchableOpacity,
} from "react-native";
import {
  MarkdownTextInput,
  parseExpensiMark,
} from "@expensify/react-native-live-markdown";
import { markdownDarkStyle, markdownStyle } from "@/constants/MarkDownStyle";

const EXAMPLE_CONTENT = [
  "# Insert subtitle here!",
  "# Myat Thiri's Development Notes",
  "Hello! I'm a React Native Developer working with Prisma and Expo.",
  "Visit my GitHub: [MyatThiri](https://github.com/myatthiri98)",
  "> Tip: Use `Test-Driven Development (TDD)` to enhance your code quality.",
  "Code snippet example:",
  "```\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n```",
  "Here are some quick links:",
  "- #ReactNative #Expo #Prisma",
].join("\n");
const inputAccessoryViewID = "newNotion";
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
];

const randomIcon = () =>
  defaultIcons[Math.floor(Math.random() * defaultIcons.length)];

export default function NewNotionScreen() {
  const theme = useColorScheme();
  const routeParams = useLocalSearchParams<{
    parentId?: string;
    viewingFile?: string;
  }>();
  const router = useRouter();
  const viewingFile: NotionFile = routeParams.viewingFile
    ? JSON.parse(routeParams.viewingFile)
    : null;

  const childFiles = extendedClient.notionFile.useFindMany({
    where: {
      parentFileId: viewingFile?.id ?? -1,
    },
  });
  const parentFile = extendedClient.notionFile.useFindUnique({
    where: {
      id: viewingFile?.parentFileId ?? -1,
    },
  });
  const titleRef = useRef<TextInput>(null);
  const [title, setTitle] = useState(viewingFile ? viewingFile?.title : "");
  const [text, setText] = useState(viewingFile ? viewingFile?.content : "");
  const [icon, setIcon] = useState(
    viewingFile ? viewingFile?.icon : () => randomIcon()
  );
  const backgroundColor = Colors[theme!].background as any;
  const textColor = Colors[theme!].text as any;
  useEffect(() => {
    if (titleRef.current) {
      titleRef.current?.focus();
    }
  }, [theme]);

  async function handleSaveNotionFile() {
    if (!title) return;
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
    };

    try {
      if (viewingFile) {
        await extendedClient.notionFile.update({
          where: { id: viewingFile.id },
          data: data,
        });
      } else {
        await extendedClient.notionFile.create({
          data: data,
        });
      }

      await extendedClient.$refreshSubscriptions();

      setTitle("");
      setText("");
      setIcon(randomIcon());
      router.setParams({ parentId: "", viewingFile: "" });

      if (router.canDismiss()) {
        router.dismissAll();
      }
      router.replace("/(tabs)/");
    } catch (e) {
      Alert.alert("Something went wrong :(");
    }
  }
  return (
    <>
      <ThemedView style={{ flex: 1 }}>
        <Stack.Screen
          options={{
            headerRight: () =>
              title ? (
                <NotionButton
                  title="Done"
                  onPress={handleSaveNotionFile}
                  containerStyle={{ marginRight: 10 }}
                />
              ) : (
                <NotionButton
                  iconName="close"
                  onPress={() => {
                    router.setParams({ parentId: "", viewingFile: "" });
                    if (router.canDismiss()) {
                      router.dismissAll();
                    }
                    router.replace("/(tabs)/");
                  }}
                  containerStyle={{ marginRight: 10 }}
                />
              ),
          }}
        />
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
            {childFiles.length > 0 ? (
              <View>
                <ThemedText>Inner files: {childFiles.length}</ThemedText>
                {childFiles.map((child) => (
                  <Link
                    key={child.id}
                    href={{
                      pathname: "/new-notion",
                      params: { viewingFile: JSON.stringify(child) },
                    }}
                    push
                    asChild
                  >
                    <TouchableOpacity>
                      <ThemedText style={{ color: "#007AFf" }}>
                        - {child.icon} {child.title}
                      </ThemedText>
                    </TouchableOpacity>
                  </Link>
                ))}
              </View>
            ) : null}
            <MarkdownTextInput
              key={theme}
              value={text}
              defaultValue={text}
              placeholder="Tap here to continue..."
              onChangeText={setText}
              style={{ color: textColor, lineHeight: 28 }}
              markdownStyle={
                theme === "dark" ? markdownDarkStyle : markdownStyle
              }
              inputAccessoryViewID={inputAccessoryViewID}
              multiline
              parser={parseExpensiMark}
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
            <NotionButton
              iconName="arrow-down"
              onPress={() => Keyboard.dismiss()}
            />
          </View>
        </InputAccessoryView>
      </ThemedView>
    </>
  );
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
});
