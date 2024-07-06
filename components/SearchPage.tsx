import { StyleSheet, Text, CheckBox, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import CityDropdown from "@/components/CityDropdown";
import AttractionsList from "@/components/AttractionsList";
import { useContext, useState, useEffect } from "react";
import {
  getAttractions,
  getAttractionsWithType,
  getCities,
  getCity,
} from "@/app/api";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AppContext } from "@/app/AppContext";
import { checkIfConfigIsValid } from "react-native-reanimated/lib/typescript/reanimated2/animation/springUtils";
import AttractionSearchByName from "./AttractionSearchByName";
import AttractionFilter from "./AttractionFilter";
import { getSearchPlaces } from "@/app/api";

export default function SearchPage({ navigation }) {
  const { cityName, setCityName } = useContext(AppContext);
  const [gobbledigook, setGobbledigook] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [attractions, setAttractions] = useState([]);
  const [attractionsListIsLoading, setAttractionsListIsLoading] =
    useState(true);
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [isSearchTerm, setIsSearchTerm] = useState(false);
  const [text, setText] = useState("");
  const [city, setCity] = useState({
    city_name: "London",
    city_latitude: 51.5072,
    city_longitude: -0.1275,
    city_radius: 12000,
    city_rectangle: {
      low: {
        latitude: "51.286760",
        longitude: "-0.510375",
      },
      high: {
        latitude: "51.691874",
        longitude: "0.334015",
      },
    },
  });
  const [type, setType] = useState("All");

  useEffect(() => {
    if (!isSearchTerm) {
      setAttractionsListIsLoading(true);
      setText("");
      getCity(cityName)
        .then((response) => {
          setCity(response.city);
          if (type === "All") {
            getAttractions(
              response.city.city_longitude,
              response.city.city_latitude,
              response.city.city_radius
            )
              .then((response) => {
                setAttractionsListIsLoading(false);
                setAttractions(response.data.places);
              })
              .catch((err) => {
                console.log(err);
              });
          } else {
            getAttractionsWithType(
              response.city.city_longitude,
              response.city.city_latitude,
              response.city.city_radius,
              [type]
            )
              .then((response) => {
                setAttractionsListIsLoading(false);
                setAttractions(response.data.places);
              })
              .catch((err) => {
                console.log(err);
              });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setAttractionsListIsLoading(true);
      setGobbledigook(false);
      getCity(cityName)
        .then(({ city }) => {
          return getSearchPlaces(city.city_rectangle, searchTerm);
        })
        .then(({ data }) => {
          setAttractionsListIsLoading(false);
          if (data.places) {
            setAttractions(data.places);
          } else {
            setGobbledigook(true);
          }
        });
    }
  }, [cityName, type, isSearchTerm]);

  useEffect(() => {
    if (isSearchTerm) {
      setType("All");
    }
  }, [isSearchTerm]);

  useEffect(() => {
    setText("");
  }, [type]);

  // useEffect(()=>{
  // setText("")
  // }, [cityName])

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={
        <Ionicons size={310} name="home" style={styles.headerImage} />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <ThemedText type="subtitle">
          Select your city from the dropdown menu and get ready to start
          planning your next adventure.
        </ThemedText>
      </ThemedView>
      <CityDropdown navigation={navigation} />
      <AttractionSearchByName
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        gobbledigook={gobbledigook}
        setGobbledigook={setGobbledigook}
        setAttractions={setAttractions}
        setIsSearchTerm={setIsSearchTerm}
        text={text}
        setText={setText}
      />

      <AttractionFilter type={type} setType={setType} />
      <View style={styles.accessibilityCheckboxContainer}>
        <CheckBox
          value={accessibleOnly}
          onValueChange={setAccessibleOnly}
          style={styles.checkbox}
        />

        <Text style={styles.label}>
          Wheelchair-accessible attractions only (has a wheelchair-accessible
          entrance and toilet)
        </Text>
      </View>
      {attractionsListIsLoading ? (
        <Text>Attractions list is loading ...</Text>
      ) : (
        <AttractionsList
          cityName={cityName}
          attractions={attractions}
          navigation={navigation}
          accessibleOnly={accessibleOnly}
        />
      )}
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
    flexDirection: "column",
    gap: 8,
  },
  accessibilityCheckboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  label: {
    margin: 8,
  },
  checkbox: {
    alignSelf: "center",
  },
});
