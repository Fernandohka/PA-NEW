import { StyleSheet, View, Image, FlatList, TextInput, Button, ActivityIndicator, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from "axios";

interface ICharacter {
  id: number;
  name: string;
  image: string;
  status: string;
}

export default function HomeScreen() {
  const [character, setCharacter] = useState<ICharacter[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [page, setPage] = useState<string>("1")

  const fetchCharacters = async (pageNumber: string) => {
    try {
      const response = await axios.get(
        `https://rickandmortyapi.com/api/character/?page=${pageNumber}`
      );
      setCharacter(response.data.results)
    } catch (error) {
      console.log("Erro ao buscar personagem, ", error)
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCharacters(page);
  }, [])

  const renderCharacter = ({item} : {item: ICharacter}) => (
    <View style={styles.card}>
      <Image source={{uri: item.image}} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}> {item.name} </Text>
        <Text style={styles.status}> {item.status} </Text>
      </View>
    </View>
  )
  
  if (loading) {
    return(
      <View style={styles.loader}>
        <ActivityIndicator size='large' color='#20f6cfff'/>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.inputContainer}>
        <Text>1/42 - </Text>
        <TextInput style={styles.input} value={page} onChangeText={(text) => setPage(text)} placeholder='Digite o numero da pagina' />
        <Button title='Buscar' onPress={() => fetchCharacters(page)}></Button>
      </View>
      <FlatList data={character} keyExtractor={(item) => item.id.toString()} renderItem={renderCharacter} contentContainerStyle={styles.list}></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2, // sombra para android
    // sombra para IOS
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    textShadowOffset: {width: 0, height: 2},
    shadowRadius: 8
  },
  image: {
    width: 100,
    height: 100
  },
  info: {
    flex: 1,
    padding: 12,
    justifyContent: 'center'
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  status: {
    fontSize: 14,
    color: '#666666'
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  list: {
    padding: 16
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'f0f0f0'
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#cccccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginRight: 8
  }
});
