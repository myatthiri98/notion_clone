import { Button, SafeAreaView, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { extendedClient } from "@/myDbModule";
import DraggableNotionList from "@/components/DraggableNotionList";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useState, useEffect } from "react";

export default function HomeScreen() {
  const [refreshKey, setRefreshKey] = useState(0);

  const notion = extendedClient.notionFile.useFindMany({
    where: {
      authorId: 1,
    },
    orderBy: {
      order: "asc",
    },
    include: {
      subFiles: true,
    },
  });

  // More frequent refresh during data changes
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const refresh = async () => {
      await extendedClient.$refreshSubscriptions();
      setRefreshKey((prev) => prev + 1);
      timeoutId = setTimeout(refresh, 500);
    };

    refresh();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  console.log("Notion data:", notion);

  const createUser = () => {
    const newUser = { name: "Myat", email: "myat@gmail.com" };
    extendedClient.user.create({
      data: newUser,
    });
    console.log("Success");
  };

  const createNotion = () => {
    const newNotion = {
      title: "Test Notion",
      content: "example",
      icon: "🚀",
      description: "",
      type: "default",
      coverPhoto: "",
      authorId: 1,
    };
    extendedClient.notionFile.create({
      data: newNotion,
    });
    console.log("Success");
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.container}>
          <ThemedText>Welcome to Notion</ThemedText>
          {notion && notion.length > 0 ? (
            <DraggableNotionList key={refreshKey} initialData={notion} />
          ) : (
            <ThemedText>No items found</ThemedText>
          )}
        </SafeAreaView>
      </ThemedView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
