import { StyleSheet , Text, CheckBox, View} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import CityDropdown from "@/components/CityDropdown";
import AttractionsList from "@/components/AttractionsList";
import { useState, useEffect } from "react";
import { getAttractions, getCities, getCity } from "@/app/api";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { checkIfConfigIsValid } from "react-native-reanimated/lib/typescript/reanimated2/animation/springUtils";

export default function SearchPage({navigation}) { 
const [cityName, setCityName] = useState("London")
const [attractions, setAttractions] = useState([])
const [attractionsListIsLoading, setAttractionsListIsLoading] = useState(true);
const [accessibleOnly, setAccessibleOnly] = useState(false)
const [fullCityList, setFullCityList] = useState([])

useEffect(()=>{
        getCity(cityName).then((response)=>{
        getAttractions(response.city.city_longitude, response.city.city_latitude, response.city.city_radius)
        .then((response)=>{
          setAttractionsListIsLoading(false)
          setAttractions(response.data.places)
          setFullCityList(response.data.places)})
    }).catch((err) => {console.log(err)})
},[cityName])

useEffect(()=>{
if(accessibleOnly){
  setAttractions((attractions)=>{
const copyAttractions = [...attractions]
const filteredAttrations = copyAttractions.filter((attraction)=>{ 
  return attraction.accessibilityOptions.wheelchairAccessibleEntrance && attraction.accessibilityOptions.wheelchairAccessibleRestroom 
})
return filteredAttrations
  })
}
else{
    setAttractions(fullCityList)
}
}
, [accessibleOnly])

return (
   
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="home" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">
        Welcome! Please select your city and browse the wonderful attractions on offer.
        </ThemedText>
      </ThemedView>
      <CityDropdown setCityName={setCityName} />
      <View style={styles.accessibilityCheckboxContainer}>
      <CheckBox
          value={accessibleOnly}
          onValueChange={setAccessibleOnly}
          style={styles.checkbox}
        />
         <Text style={styles.label}>Wheelchair-accessible attractions only (has a wheelchair-accessible entrance and toilet)</Text></View>
      {attractionsListIsLoading? <Text>Attractions list is loading ...</Text>: <AttractionsList cityName={cityName} attractions={attractions} navigation={navigation}/>}
    </ParallaxScrollView>
 
  );
}

const styles = StyleSheet.create({
    headerImage: {
      color: "#FF4D4D",
      bottom: -90,
      left: -35,
      position: "absolute",
    },
    titleContainer: {
      flexDirection: "row",
      gap: 8,
    },
    accessibilityCheckboxContainer: {
      flexDirection: 'row',
      marginBottom: 20,
    },
    label: {
      margin: 8,
    },
    checkbox:{
      alignSelf: 'center',
    }
  });
  