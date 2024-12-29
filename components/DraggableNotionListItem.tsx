import { Pressable, StyleSheet, View } from "react-native";
import { NotionFile } from "@prisma/client/react-native";
import { ThemedText } from "./ThemedText";
import { RenderItemParams } from "react-native-draggable-flatlist";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";

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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View>
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
          <Pressable onPress={() => {}}>
            <Ionicons name="ellipsis-horizontal" size={18} color={iconColor} />
          </Pressable>

          <Ionicons name="add" size={22} color={iconColor} />
        </View>
      </Pressable>
      {isOpen ? <View></View> : null}
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
