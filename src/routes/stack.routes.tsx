import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import colors from '../styles/colors';

import { Welcome } from '../pages/Welcome';
import { UserIdentification } from '../pages/UserIdentification';
import { Confirmation } from '../pages/Confirmation';
import { PlantSave } from '../pages/PlantSave';

import { AuthRoutes } from './tab.routes';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { Screen, Navigator } = createStackNavigator();

export const StackRoutes: React.FC = () => {
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    async function getUser() {
      const user = await AsyncStorage.getItem('@plantmanager:user');
      setIsLogged(!!user);
    }
    getUser();
  }, []);

  return (
    <Navigator
      headerMode="none"
      screenOptions={{
        cardStyle: {
          backgroundColor: colors.white,
        },
      }}
    >
      {!isLogged && (
        <>
          <Screen name="Welcome" component={Welcome} />
          <Screen name="UserIdentification" component={UserIdentification} />
        </>
      )}

      <Screen name="PlantSelect" component={AuthRoutes} />
      <Screen name="PlantSave" component={PlantSave} />
      <Screen name="MyPlants" component={AuthRoutes} />

      <Screen name="Confirmation" component={Confirmation} />
    </Navigator>
  );
};
