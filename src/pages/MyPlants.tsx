import React, { useEffect, useState } from 'react';
import { StyleSheet, Image, View, Text, Alert } from 'react-native';
import { Header } from '../components/Header';

import colors from '../styles/colors';

import waterdrop from '../assets/waterdrop.png';
import { FlatList } from 'react-native-gesture-handler';

import { IPlant, loadPlant, removePlant } from '../libs/storage';

import { formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import fonts from '../styles/fonts';

import { PlantCardSecondary } from '../components/PlantCardSecondary';
import { Load } from '../components/Load';
import { Button } from '../components/Button';
import { useNavigation } from '@react-navigation/core';

export function MyPlants() {
  const { navigate, goBack } = useNavigation();

  const [myPlants, setMyPlants] = useState<IPlant[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWaterd, setNextWaterd] = useState<string>();
  const [noPlant, setNoPlant] = useState(false);

  useEffect(() => {
    async function loadStorageData() {
      const plantsStoraged = await loadPlant();
      setMyPlants(plantsStoraged);

      if (plantsStoraged.length === 0) {
        setLoading(false);
        setNoPlant(true);
        return;
      }

      const nextTime = formatDistance(
        new Date(plantsStoraged[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        { locale: ptBR }
      );

      setNextWaterd(`Não esqueça de regar a ${plantsStoraged[0].name} à ${nextTime}.`);
      setLoading(false);
    }
    loadStorageData();
  }, []);

  function handleRemove(plant: IPlant) {
    Alert.alert(`Remover`, `Deseja remover a ${plant.name}?`, [
      {
        text: 'Não 🙏',
        style: 'cancel',
      },
      {
        text: 'Sim 😣',
        onPress: async () => {
          try {
            await removePlant(plant.id);
            setMyPlants((oldvalue) => oldvalue.filter((item) => item.id !== plant.id));
          } catch {
            Alert.alert('Não foi possível remover! 😥');
          }
        },
      },
    ]);
  }

  function goToPlantSelect() {
    goBack();
  }

  if (loading) {
    return <Load />;
  }

  if (noPlant) {
    return (
      <View style={styles.container}>
        <Header />
        <View>
          <Text style={styles.noPlantText}>Você não possui nenhuma plantinha. 😪</Text>
          <Button title="Cadastrar plantinha" onPress={goToPlantSelect} />
        </View>
        <View />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.spotlight}>
        <Image source={waterdrop} style={styles.spotlightImage} />
        <Text style={styles.spotlightText}>{nextWaterd}</Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantsTitle}>Próximas regadas</Text>

        <FlatList
          data={myPlants}
          keyExtractor={(item: IPlant) => String(item.id)}
          renderItem={({ item }) => (
            <PlantCardSecondary handleRemove={() => handleRemove(item)} data={item} />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background,
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spotlightImage: {
    height: 60,
    width: 60,
  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
  },
  plants: {
    flex: 1,
    width: '100%',
  },
  plantsTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 15,
  },
  noPlantText: {
    fontSize: 16,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginBottom: 20,
  },
});
