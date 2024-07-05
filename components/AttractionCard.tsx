import { View, Text, Button, StyleSheet, Image } from "react-native";
import { Linking } from "react-native";
import { UserContext } from "../app/UserContext";
import { useContext, useState, useEffect } from "react";
import { deleteBucketListItem, postBucketListItem } from "@/app/api";
import { getPhoto } from "@/app/api";
import { RotateInDownLeft } from "react-native-reanimated";
import { CityContext } from "@/app/CityContext";

export default function AttractionCard({ navigation, attraction }) {
  const { user, setUser } = useContext(UserContext);
  const { cityName, setCityName } = useContext(CityContext);

  const [photo, setPhoto] = useState("");
  const [attractionType, setAttractionType] = useState();
  useEffect(() => {
    if (attraction.photos) {
      getPhoto(attraction.photos[0].name, 1000, 1000).then((response) => {
        setPhoto(response);
        if (attraction.primaryTypeDisplayName) {
          setAttractionType(attraction.primaryTypeDisplayName.text);
        } else {
          const attractionType0 = attraction.types[0];
          const capitalisedAttractionType =
            attractionType0.charAt(0).toUpperCase() + attractionType0.slice(1);
          const spacedAttractionType = capitalisedAttractionType
            .split("_")
            .join(" ");
          setAttractionType(spacedAttractionType);
        }
      });
    } else {
      if (attraction.primaryTypeDisplayName) {
        setAttractionType(attraction.primaryTypeDisplayName.text);
      } else {
        const attractionType0 = attraction.types[0];
        const capitalisedAttractionType =
          attractionType0.charAt(0).toUpperCase() + attractionType0.slice(1);
        const spacedAttractionType = capitalisedAttractionType
          .split("_")
          .join(" ");
        setAttractionType(spacedAttractionType);
      }
    }
  }, [cityName]);

  const seeMoreClick = ({ attraction }) => {
    navigation.navigate("Attraction", { attraction });
  };
  const bucketListClick = ({ attraction }) => {
    postBucketListItem(attraction, user.username, cityName);
  };
  const removeFromBucketListClick = ({ attraction }) => {
    deleteBucketListItem(attraction, user.username, cityName);
  };

  const { routes, index } = navigation.getState();
  const currentRoute = routes[index].name;

  return (
    <View style={styles.container}>
      <View style={styles.attractionTitle}>
        <View>
          {" "}
          <Text style={styles.titleText}>{attraction.displayName.text}</Text>
        </View>
      </View>
      <View style={styles.mainBody}>
        <View style={styles.imageBox}>
          <Image style={styles.image} source={{ uri: photo }} />
        </View>
        <View style={styles.textBody}>
          {attraction.editorialSummary ? (
            <Text style={styles.editorialSummary}>
              {attraction.editorialSummary.text}
            </Text>
          ) : null}
          {attraction.rating ? (
            <Text style={styles.rating}>
              Average rating of {attraction.rating} according to{" "}
              {attraction.userRatingCount} reviewers
            </Text>
          ) : null}
          <Text style={styles.category}>Category: {attractionType}</Text>
          <View style={styles.buttonContainer}>
            <View style={styles.button}>
              <Button
                title="See more details"
                onPress={() => seeMoreClick({ attraction })}
                disabled={false}
              />
            </View>
            <View style={styles.button}>
              {currentRoute === "BucketList" ? (
                <Button
                  title="Delete from Bucket List"
                  onPress={() => removeFromBucketListClick({ attraction })}
                  disabled={false}
                />
              ) : (
                <Button
                  title="Add to Bucket List"
                  onPress={() => bucketListClick({ attraction })}
                  disabled={false}
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
    flex: 1,
    borderWidth: 5,
    padding: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },

  titleText: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10,
  },
  mainBody: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
  },
  textBody: {
    flex: 3,
    flexWrap: "wrap",
    paddingHorizontal: 20,
    minWidth: 200,
    height: "auto"
  },
  buttonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 10,
    justifyContent: "flex-start",
    alignContent: "flex-end",
  },
  editorialSummary: {
    flex: 1,
    marginTop: 10,
    width: "100%",
  },
  imageBox: {
    justifyContent: "center",
    flex: 1,
    height: "auto",
  },
  rating: {
    flex: 1,
    width: "100%",
  },
  category: {
    flex: 1,
    width: "100%",
  },
  button: {
    margin: 3,
    justifyContent: "center",
  },
});
