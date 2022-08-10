import {
  Card,
  CardContent,
  CardForm,
  CardHeader,
  List,
  ListItem,
} from "@/components";
import { trpc } from "@/utils/trpc";
import { GroceryList } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import { useCallback, useState } from "react";
import { useQueryClient } from "react-query";

const { useQuery, useMutation } = trpc;

const Home: NextPage = () => {
  const [itemName, setItemName] = useState("");

  const queryClient = useQueryClient();

  const { data: list } = useQuery(["findAll"]);

  const insertGrocery = useMutation(["insertOne"], {
    onSuccess: (newGrocery) => {
      if (!list) return;
      queryClient.setQueryData("findAll", [...list, newGrocery]);
    },
  });

  const handleCreateGrocery = useCallback(() => {
    if (!itemName) return;

    insertGrocery.mutate({
      title: itemName,
    });

    setItemName("");
  }, [itemName, insertGrocery]);

  const updateGrocery = useMutation(["updateOne"], {
    onSuccess: (updatedGrocery) => {
      if (!list) return;

      const updatedList = list.map((item) => {
        return item.id === updatedGrocery.id ? updatedGrocery : item;
      });

      queryClient.setQueryData("findAll", updatedList);
    },
  });

  const handleUpdateGrocery = useCallback(
    (item: GroceryList) => {
      updateGrocery.mutate({
        ...item,
        checked: !item.checked,
      });

      setItemName("");
    },
    [updateGrocery]
  );

  const deleteAllGroceries = useMutation(["deleteAll"], {
    onSuccess: () => {
      queryClient.setQueryData("findAll", []);
    },
  });

  const handleClearAll = useCallback(() => {
    if (!list?.length) return;

    deleteAllGroceries.mutate({
      ids: list.map((item) => item.id),
    });
  }, [list, deleteAllGroceries]);

  const deleteGrocery = useMutation(["deleteOne"], {
    onSuccess: (_, deletedGrocery) => {
      if (!list) return;

      const updatedList = list.filter((item) => {
        return item.id !== deletedGrocery.id;
      });

      queryClient.setQueryData("findAll", updatedList);
    },
  });

  const handleDeleteGrocery = useCallback(
    (groceryId: number) => {
      deleteGrocery.mutate({ id: groceryId });
    },
    [deleteGrocery]
  );

  return (
    <>
      <Head>
        <title>Grocery List</title>
      </Head>

      <main>
        <Card>
          <CardContent>
            <CardHeader
              title="Grocery List"
              listLength={list?.length || 0}
              clearAllFn={handleClearAll}
            />
            <List>
              {list?.map((item) => (
                <ListItem
                  key={item.id}
                  item={item}
                  onUpdate={handleUpdateGrocery}
                  onDelete={handleDeleteGrocery}
                />
              ))}
            </List>
          </CardContent>

          <CardForm
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            onSubmit={handleCreateGrocery}
          />
        </Card>
      </main>
    </>
  );
};

export default Home;
