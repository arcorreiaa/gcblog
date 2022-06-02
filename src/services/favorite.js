import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";

//Buscar categoria favoritada

export async function getFavorite() {
  const data = await AsyncStorage.getItem("@favCategory");

  if (data !== null) {
    //achou uma categoria
    const response = await api.get(
      `api/categories/${data}?fileds=name&populate=posts,posts.cover`
    );

    return response.data?.data?.attributes?.posts?.data;
  } else {
    return [];
  }
}

//Favoritar uma categoria
export async function setFavorite(category) {
  await AsyncStorage.setItem("@favCategory", String(category));

  const response = await getFavorite();

  return response;
}
