import { Pressable, StyleSheet } from "react-native";
import { NotionFile } from "@prisma/client/react-native";
import { ThemedText } from "./ThemedText";
import Animated from "react-native-reanimated";

type ItemProps = {
  item: NotionFile;
  onDrag: () => void;
  isActive: boolean;
};

export default function DraggableNotionListItem({
  item,
  onDrag,
  isActive,
}: ItemProps) {
  return (
    <Animated.View>
      <Pressable
        onPressIn={onDrag}
        style={[
          styles.item,
          {
            backgroundColor: isActive ? "#eee" : "#fff",
            elevation: isActive ? 10 : 0,
          },
        ]}
      >
        <ThemedText type="title">
          {item.id} -{item.title}
        </ThemedText>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  item: {
    padding: 16,
    marginVertical: 4,
    marginHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
});
