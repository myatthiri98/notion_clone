import { useState, useCallback } from "react";
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { NotionFile } from "@prisma/client/react-native";
import { baseClient, extendedClient } from "@/myDbModule";
import { DraggableNotionListItem } from "./DraggableNotionListItem";

interface Props {
  initialData: NotionFile[];
}

export default function DraggableNotionList({ initialData }: Props) {
  const [data, setData] = useState<NotionFile[]>(initialData);

  const renderItem = useCallback(
    ({ item, drag, isActive, getIndex }: RenderItemParams<NotionFile>) => (
      <ScaleDecorator activeScale={1.1}>
        <DraggableNotionListItem {...{ item, drag, isActive, getIndex }} />
      </ScaleDecorator>
    ),
    []
  );

  const handleDragEnd = async ({ data: newData }: { data: NotionFile[] }) => {
    setData(newData);

    // Update all items with their new order
    const updates = newData.map((file, index) =>
      baseClient.notionFile.update({
        where: { id: file.id },
        data: { order: index },
      })
    );

    try {
      await baseClient.$transaction(updates);
      await extendedClient.$refreshSubscriptions();
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  return (
    <DraggableFlatList
      data={data}
      onDragEnd={handleDragEnd}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
    />
  );
}
