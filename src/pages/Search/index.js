import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ViewPropTypes,
  FlatList,
  Keyboard,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import api from "../../services/api";
import PostItem from "../../components/PostItem";

export default function Search() {
  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);
  const [empty, setEmpty] = useState(false);

  async function handleSearchPost() {
    if (input === "") {
      alert("Digite algum nome!");
      return;
    }
    const response = await api.get(
      `api/posts?filters[title][$containsi]=${input}&populate=cover`
    );
    if (response.data?.data.length === 0) {
      setEmpty(true);
      setPosts([]);
      return;
    }
    // buscar os post
    setPosts(response.data?.data);
    // caso não encontre nenhum post e dps que ele encontrar ele some da tela
    setEmpty(false);
    // limpar busca e fechart teclado automatico
    setInput("");
    Keyboard.dismiss();
  }

  return (
    <View style={styles.container}>
      <View style={styles.containterInput}>
        <TextInput
          value={input}
          onChangeText={(text) => setInput(text)}
          style={styles.input}
          placeholder="O que está buscando?"
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchPost}
        >
          <Feather name="search" size={24} color={"#000"} />
        </TouchableOpacity>
      </View>
      {/* verificação caso a caixa de texto ficar vazia */}

      {empty && (
        <View>
          <Text style={styles.emptyText}>
            Ops não encontramos nenhum post...
          </Text>
        </View>
      )}
      <FlatList
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <PostItem data={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 18,
  },
  containterInput: {
    flexDirection: "row",
    width: "100%",
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  // area do input com lupa
  input: {
    width: "85%",
    backgroundColor: "#c4c4c4",
    height: 45,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  // area da lupa
  searchButton: {
    width: "15%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#c4c4c4",
    height: 45,
    borderTopRightRadius: 4,
    borderBottomEndRadius: 4,
    marginLeft: -1,
  },
  emptyText: {
    textAlign: "center",
  },
});
