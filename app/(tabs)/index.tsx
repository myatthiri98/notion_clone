import { Button, SafeAreaView, StyleSheet } from "react-native"
import { ThemedText } from "@/components/ThemedText"
import { ThemedView } from "@/components/ThemedView"
import { extendedClient } from "@/myDbModule"
import { NotionFile } from "@prisma/client/react-native"

export default function HomeScreen() {
  const user = extendedClient.user.useFindFirst({
    where: {
      id: 1,
    },
  })

  const notion = extendedClient.notionFile.useFindMany({
    where: {
      id: 1,
    },
  })
  console.log(notion)

  const createUser = () => {
    const newUser = { name: "Myat", email: "myat@gmail.com" }
    extendedClient.user.create({
      data: newUser,
    })
    console.log("Success")
  }

  const createNotion = () => {
    const newNotion: NotionFile = {
      id: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      authorId: 1,
      title: "Test Notion",
      content: "example",
      icon: "",
      description: "",
      type: "default",
      coverPhoto: "",
      parentFileId: null,
      order: 0,
    }
    extendedClient.notionFile.create({
      data: newNotion,
    })
    console.log("Success")
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView>
        <ThemedText>Welcome to Notion</ThemedText>
        {/* <Button title="Create User" onPress={createUser} /> */}
        <Button title="Create User" onPress={createNotion} />
      </SafeAreaView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
