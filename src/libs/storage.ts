import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

export type IPlant = {
  id: number;
  name: string;
  about: string;
  water_tips: string;
  photo: string;
  environments: string[];
  frequency: {
    times: number;
    repeat_every: string;
  };
  dateTimeNotification: Date;
};

export type IStorage = {
  [id: string]: {
    data: IPlant;
  };
};

export async function savePlant(plant: IPlant): Promise<void> {
  try {
    const data = await AsyncStorage.getItem('@planmanager:plants');
    const oldPlants = data ? (JSON.parse(data) as IStorage) : {};

    const newPlant = {
      [plant.id]: {
        data: plant,
      },
    };

    await AsyncStorage.setItem(
      '@planmanager:plants',
      JSON.stringify({ ...newPlant, ...oldPlants })
    );
  } catch (error) {
    throw new Error(error);
  }
}

export async function loadPlant(): Promise<IPlant[]> {
  try {
    const data = await AsyncStorage.getItem('@planmanager:plants');
    const plants = data ? (JSON.parse(data) as IStorage) : {};

    return Object.keys(plants)
      .map((plant) => {
        return {
          ...plants[plant].data,
          hour: format(new Date(plants[plant].data.dateTimeNotification), 'HH:mm'),
        };
      })
      .sort((a, b) =>
        Math.floor(
          new Date(a.dateTimeNotification).getTime() / 1000 -
            Math.floor(new Date(b.dateTimeNotification).getTime() / 1000)
        )
      );
  } catch (error) {
    throw new Error(error);
  }
}
