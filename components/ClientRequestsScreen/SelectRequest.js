import React from "react";
import { StyleSheet, View } from "react-native";

function SelectRequest(props) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.scrollArea}>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  scrollArea: {
    alignSelf: "stretch",
    flex: 1,
    marginTop: 16,
    marginRight: 0,
    marginLeft: 0
  },
  scrollArea_contentContainerStyle: {
  },
  solicitud: {
    height: 200,
    alignSelf: "stretch",
    marginRight: 9,
    marginLeft: 9,
    marginTop: 0,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(155,155,155,1)",
    borderRadius: 27
  }
});

export default SelectRequest;
