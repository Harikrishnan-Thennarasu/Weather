import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput
} from 'react-native';
import { toFetchForecastBySearchAndDate } from './services';
import DatePicker from 'react-native-date-picker';
import { useDebouncedEffect } from './useDebouncedEffect';
import moment from 'moment-timezone';
import CheckBox from 'react-native-check-box';


const App = () => {
  const [weatherInfo, setWeatherInfo] = useState(null);
  const [forecastday, setForecastday] = useState([]);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setLoading] = useState(true);
  const [isFilterWithDate, setShouldFilterWithDate] = useState(false);


  useEffect(() => { toGetWeatherInfo() }, [isFilterWithDate, date]);

  useDebouncedEffect(() => toGetWeatherInfo(), [searchText], 1000);

  const toGetWeatherInfo = async () => {
    try {
      setLoading(true);
      let filterDate = null;
      if (isFilterWithDate) {
        filterDate = moment(date).format('YYYY-MM-DD');
      }
      const result = await toFetchForecastBySearchAndDate(searchText, filterDate);
      if (result) {
        setWeatherInfo(result);
        setForecastday(result?.forecast?.forecastday || []);
      } else {
        setWeatherInfo({});
        setForecastday([]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const renderItem = ({ item, index }) => (
    <View style={{ width: '90%', backgroundColor: "#ffff", padding: 25, borderRadius: 15, margin: 10, alignSelf: "center" }}>
      <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
        <View style={{ flex: 4, justifyContent: "center", alignItems: "center" }}>
          <Image
            style={{ width: 60, height: 60 }}
            source={{ uri: `https:${item.day.condition.icon}` }}
          />
        </View>
        <View style={{ flexDirection: "column", flex: 6 }}>
          <Text style={{ fontSize: 14, fontWeight: "bold" }}>{item.date}</Text>
          <Text>{item.day.condition.text}</Text>
          <Text style={{ fontWeight: "bold" }}>{weatherInfo.location.name}, {weatherInfo.location.country}</Text>
        </View>
      </View>
    </View>
  )


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#e8e8e8', flexDirection: "column" }}>
      <View style={{
        marginTop: 10,
        flexDirection: "row",
        width: '100%', height: "10%",
        justifyContent: "space-evenly",
        alignItems: "center",
      }}>

        <TextInput
          placeholder={'Search'}
          style={{
            backgroundColor: "#ffff", width: '70%', height: 50, borderRadius: 15,
            paddingHorizontal: 10
          }}
          onChangeText={setSearchText}
        />

        <View>
          <TouchableOpacity onPress={() => setOpen(true)}>
            <Text style={{ fontWeight: "bold" }}>{moment(date).format('YYYY-MM-DD')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{
        flexDirection: "row",
        width: '100%',
        justifyContent: "space-evenly",
        alignItems: "center",
        marginBottom: 5
      }}>
        <CheckBox
          style={{ flex: 1, paddingHorizontal: 20 }}
          onClick={() => setShouldFilterWithDate(!isFilterWithDate)}
          isChecked={isFilterWithDate}
          leftText={isFilterWithDate?`Deselect checkbox to fetch 14 forecast days`:`Select to fetch selected date forecast`}
        />

      </View>

      <DatePicker
        title={'Date should be between today and next 14 day'}
        modal={true}
        mode={'date'}
        open={open}
        date={date}
        onConfirm={(date) => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false)
        }}
      />
      {isLoading ?
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text style={{ fontWeight: "bold" }}>Loading</Text>
        </View>
        :
        forecastday.length > 0 ?
          <FlatList
            data={forecastday}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
          :
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontWeight: "bold" }}>No data found</Text>
          </View>
      }
    </SafeAreaView>
  );
}

export default App;
