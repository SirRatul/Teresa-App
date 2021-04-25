import React, {useState} from 'react';
import TeresaNavigator from './navigation/TeresaNavigator';
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import * as Notifications from 'expo-notifications';

let setStateFn = () => {
  console.log("State not yet initialized");
};

async function myTask() {
  try {
    // fetch data here...
    const userData = await AsyncStorage.getItem('userData')
    var activeroutine = await AsyncStorage.getItem('activeRoutine')
    if(userData){
      console.log("Login")
      if(activeroutine){
        console.log("activeroutine")
        activeroutine = JSON.parse(activeroutine)
        console.log(activeroutine.activeRoutine)
        Notifications.cancelAllScheduledNotificationsAsync()
        activeroutine.activeRoutine.forEach((entry) => {
          var a = moment(new Date())
          var b = moment(entry.endDate,'YYYY-M-D')
          b.add(6, 'h')
          var diffDays = b.diff(a, 'days');
          if(diffDays > -1){
              entry.times.forEach((time) => {
                console.log(entry.unit+' unit '+entry.itemName+' at '+timeFormat(time, entry.notificationBefore)+' '+entry.meal+' meal')
                times = timeFormat(time, entry.notificationBefore)
                timeString = times.split(':')
                Notifications.scheduleNotificationAsync({
                    content: {
                        title: entry.unit+' unit '+entry.itemName+' at '+timeFormat(time, entry.notificationBefore)+' '+entry.meal+' meal'
                    },
                    trigger: { 
                        hour: parseInt(timeString[0]),
                        minute: parseInt(timeString[1]),
                        repeats: true
                    }
                })
              })
          }
        })
      } else {
        console.log("no activeroutine")
      }
    } else {
      console.log("Logout")
      Notifications.cancelAllScheduledNotificationsAsync()
    }
    const backendData = "Simulated fetch " + Math.random() + new Date()
    console.log("myTask() ", backendData)
    setStateFn(backendData);
    return backendData
      ? BackgroundFetch.Result.NewData
      : BackgroundFetch.Result.NoData;
  } catch (err) {
    return BackgroundFetch.Result.Failed;
  }
}


async function initBackgroundFetch(taskName, taskFn, interval = 60 * 15) {
  try {
    if (!TaskManager.isTaskDefined(taskName)) {
      TaskManager.defineTask(taskName, taskFn);
      console.log('task created')
    }
    const options = {
      minimumInterval: interval // in seconds
    };
  await BackgroundFetch.registerTaskAsync(taskName, options);
  } catch (err) {
    console.log("registerTaskAsync() failed:", err);
  }
}

initBackgroundFetch('myTaskName', myTask, 5);

const App = () => {
  const [state, setState] = useState(null);
  setStateFn = setState;
  return <TeresaNavigator/>
}

export default App