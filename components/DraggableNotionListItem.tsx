import { Pressable, StyleSheet, useColorScheme, View } from "react-native";
import { NotionFile } from "@prisma/client/react-native";
import { ThemedText } from "./ThemedText";
import { RenderItemParams } from "react-native-draggable-flatlist";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { extendedClient } from "@/myDbModule";
import { Colors } from "@/constants/Colors";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { Link } from "expo-router";

export function DraggableNotionListItem({
  drag,
  isActive,
  item,
}: RenderItemParams<NotionFile>) {
  return (
    <NotionFileItem
      iconColor="grey"
      notionFile={item}
      drag={drag}
      isActive={isActive}
    />
  );
}

type InnerNotionListItemProps = {
  parentId: number | undefined;
};

function InnerNotionListItem({ parentId }: InnerNotionListItemProps) {
  const theme = useColorScheme() ?? "light";
  const iconColor = theme === "light" ? Colors.light.icon : Colors.dark.icon;
  const childs = extendedClient.notionFile.useFindMany({
    where: { parentFileId: parentId },
  });

  if (childs.length === 0)
    return <ThemedText style={{ color: "grey" }}>No pages inside!</ThemedText>;

  return (
    <View>
      {childs.map((notionFile: NotionFile) => (
        <NotionFileItem
          key={notionFile.id}
          iconColor={iconColor}
          notionFile={notionFile}
        />
      ))}
    </View>
  );
}
interface NotionFileItemProps {
  notionFile: NotionFile;
  iconColor: string;
  drag?: () => void;
  isActive?: boolean;
}

function NotionFileItem({
  notionFile,
  iconColor,
  drag,
  isActive,
}: NotionFileItemProps) {
  const { showActionSheetWithOptions } = useActionSheet();
  const [isOpen, setIsOpen] = useState(false);

  const onPress = (id: number) => {
    const options = ["Delete", "Cancel"];
    const destructiveButtonIndex = 0;
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        destructiveButtonIndex,
        cancelButtonIndex,
      },
      (selectedIndex: number | undefined) => {
        switch (selectedIndex) {
          case destructiveButtonIndex: {
            extendedClient.notionFile.delete({
              where: {
                id: id,
              },
            });
            break;
          }
          case cancelButtonIndex: {
          }
        }
      }
    );
  };

  return (
    <View>
      <Link
        asChild
        push
        href={{
          pathname: "/new-notion",
          params: { viewingFile: JSON.stringify(notionFile) },
        }}
      >
        <Pressable style={styles.heading} disabled={isActive} onPressIn={drag}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable onPress={() => setIsOpen((value) => !value)}>
              <Ionicons
                name={isOpen ? "chevron-down" : "chevron-forward-outline"}
                size={18}
                style={{ marginRight: 12 }}
                color={iconColor}
              />
            </Pressable>
            <ThemedText type="defaultSemiBold" numberOfLines={1}>
              {notionFile.icon} {notionFile.title}
            </ThemedText>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Pressable onPress={() => onPress(notionFile.id)}>
              <Ionicons
                name="ellipsis-horizontal"
                size={18}
                color={iconColor}
              />
            </Pressable>

            <Ionicons name="add" size={22} color={iconColor} />
          </View>
        </Pressable>
      </Link>
      {isOpen ? (
        <View style={styles.content}>
          <InnerNotionListItem parentId={notionFile.id} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  content: {
    marginLeft: 24,
  },
});
