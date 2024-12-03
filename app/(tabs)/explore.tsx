import axios from 'axios';
import { useEffect, useState } from 'react';
import { StyleSheet, Image, Text, ActivityIndicator, FlatList, Button, View, TextInput } from 'react-native';

interface ICharacter {
  _id: number,
  name: string,
  imageUrl: string
}

export default function TabTwoScreen() {
  const [character, setCharacter] = useState<ICharacter[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [page, setPage] = useState<string>("1")

  const fetchCharacters = async (pageNumber: string) => {
    try {
      const response = await axios.get(`https://api.disneyapi.dev/character?page=${pageNumber}`);
      setCharacter(response.data.data);
    } catch (error) {
      console.log("Deu tudo errado :/, ", error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCharacters(page);
  }, [])

  const renderCharacter = ({item} : {item: ICharacter}) => (
    <View style={styles.card}>
      <Image source={{uri: item.imageUrl}} style={styles.image} />
      <Text style={styles.name}>{item.name}</Text>
    </View>
  )
  
  if (loading) {
    return(
      <View style={styles.loader}>
        <TextInput value={page} onChangeText={(text) => setPage(text)} placeholder='Digite o numero da pagina' />
        <ActivityIndicator size='large' color='#20f6cfff'/>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.inputContainer}>
        <TextInput style={styles.input} value={page} onChangeText={(text) => setPage(text)} placeholder='Digite o numero da pagina' />
        <Button title='Buscar' onPress={() => fetchCharacters(page)}></Button>
      </View>
      <FlatList data={character} keyExtractor={(item) => item._id.toString()} renderItem={renderCharacter} contentContainerStyle={styles.list}></FlatList>
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
  name: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: 'bold'
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
