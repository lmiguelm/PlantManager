import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

import { useFonts, Jost_400Regular, Jost_600SemiBold } from '@expo-google-fonts/jost';
import AppLoading from 'expo-app-loading';

import { Routes } from './src/routes';

import { IPlant } from './src/libs/storage';

export default function App() {
  const [fontsLoaded] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold,
  });

  useEffect(() => {
    // DISPARAR ENVENTO QUANDO ALGUMA NOTIFICAÇÃO FOR FEITA
    // const subscription = Notifications.addNotificationReceivedListener(async (notification) => {
    //   const data = notification.request.content.data as IPlant;
    // });
    // return () => subscription.remove();
    // RECUPERAR TODAS AS NOTIFICAÇÕES AGENDADAS
    // async function notifications() {
    //   const data = await Notifications.getAllScheduledNotificationsAsync();
    // const data = await Notifications.cancelAllScheduledNotificationsAsync(); // CANCELA TODAS AS NOTIFICAÇÕES AGENDADAS
    //   console.log(data);
    // }
    // notifications();
  }, []);

  if (fontsLoaded) {
    return <Routes />;
  } else {
    return <AppLoading />;
  }
}
