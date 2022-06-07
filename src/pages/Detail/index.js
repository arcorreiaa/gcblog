import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  ScrollView,
  Share,
  Modal,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "../../services/api";
import { Feather, Entypo } from "@expo/vector-icons";
import LinkWeb from "../../components/LinkWeb";

export default function Detail() {
  const route = useRoute();
  const navigation = useNavigation();
  const [post, setPost] = useState({});
  const [links, setLinks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [openLink, setOpenLink] = useState({});

  useEffect(() => {
    async function getPost() {
      const response = await api.get(
        `api/posts/${route.params?.id}?populate=cover,category,Opcoes`
      );
      setPost(response.data.data);
      setLinks(response.data?.data?.attributes?.Opcoes);
    }
    getPost();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={handleShare}>
          <Entypo name="share" size={24} color="#FFFF" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, post]);

  async function handleShare() {
    try {
      const result = await Share.share({
        message: `
        Confere esse post: ${post?.attributes?.title}

        ${post?.attributes?.description}

        Vi lá no app GCBLOG!
        `,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("ACTIVIY TYPE");
        } else {
          console.log("COMPARTILHADO COM SUCESSO!");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("MODAL FECHADO");
      }
    } catch (error) {
      console.log("ERROR");
    }
  }

  function handleOpenLink(link) {
    setModalVisible(true);
    setOpenLink(link);
  }

  return (
    <SafeAreaView style={styles.container}>
      <Image
        resizeMode="cover"
        style={styles.cover}
        source={{
          uri: `http:/192.168.1.102:1337${post?.attributes?.cover?.data?.attributes?.url}`,
        }}
      />
      <Text style={styles.title}>{post?.attributes?.title}</Text>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.description}>{post?.attributes?.description}</Text>

        {links.length > 0 && <Text style={styles.subTitle}>Links</Text>}

        {links.map((link) => (
          <TouchableOpacity
            key={link.id}
            style={styles.linkButton}
            onPress={() => handleOpenLink(link)}
          >
            <Feather name="link" color="#1e4687" size={14} />
            <Text style={styles.linkText}>{link.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal animationType="slide" visible={modalVisible} transparent={true}>
        <LinkWeb
          link={openLink?.url}
          title={openLink?.name}
          closeModal={() => setModalVisible(false)}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  cover: {
    width: "100%",
    height: 230,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 14,
    marginTop: 18,
    paddingHorizontal: 12,
  },
  content: {
    paddingHorizontal: 12,
  },
  description: {
    lineHeight: 20,
    textAlign: "left",
  },
  subTitle: {
    fontWeight: "bold",
    marginTop: 14,
    fontSize: 18,
    marginBottom: 6,
  },
  linkButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  linkText: {
    color: "#1e4687",
    fontSize: 16,
    marginLeft: 6,
  },
});
