import React from "react";
import { View, Pressable, Animated, Easing, Dimensions } from "react-native";
import { withStyles, Modal } from "@ui-kitten/components";
import Options from "./Options";
import DirectionInput from "./DirectionInput";
import AddCarPopUp from "../AddCarPopUp";
import EditCarPopUp from "../EditCarPopUp";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { LinearGradient } from "expo-linear-gradient";
import { connect } from "react-redux";
import { cleanServices, setVehicles } from "../../redux/actions";
import VehicleSelector from "./VehicleSelector";
import RequestForm from "./RequestForm/RequestForm";
import AddReviewPopUp from "../AddReview/AddReviewPopover";
import { MaterialIcons } from "@expo/vector-icons";

const window = Dimensions.get("window");

const EditVehicleModal = ({
  vehicle,
  close,
  visible,
  userRequests,
  vehicles,
  updateVehicles,
  cleanServices,
}) => {
  return (
    <View
      style={{
        position: "absolute",
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Modal
        visible={visible}
        backdropStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        onBackdropPress={close}
      >
        {visible && (
          <Modal
            visible={visible}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              position: "absolute",
              height: window.height,
              width: "100%",
              padding: 20,
            }}
            onBackdropPress={close}
          >
            <EditCarPopUp
              onClose={close}
              vehicle={vehicle}
              userRequests={userRequests}
              vehicles={vehicles}
              updateVehicles={updateVehicles}
              cleanServices={cleanServices}
            />
          </Modal>
        )}
      </Modal>
    </View>
  );
};

class MapScreen extends React.Component {
  constructor(props) {
    super(props);
    const { selectedAddress } = this.props;
    this.overCarRef = React.createRef();
    this.addressInput = React.createRef();
    this.state = {
      editVehicle: null,
      addingCar: false,
      showingRequest: false,
      slectedIndex: 0,
      formStep: 0,
      finished: false,
      translateAnim: new Animated.Value(0),
      translateButton: new Animated.Value(1),
      mapDisabled: false,
      disableNext: true,
      addingReview: this.props.pendingReview !== null,
      centerLocation: {
        lng: selectedAddress ? selectedAddress.location.lng : -100.291648,
        lat: selectedAddress ? selectedAddress.location.lat : 25.651579,
      },
    };
  }

  expand = () => {
    this.setState({ mapDisabled: true });
    Animated.parallel([
      Animated.timing(this.state.translateAnim, {
        toValue: 100,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(this.state.translateButton, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start(() => {
      this.addressInput?.current?.open();
    });
  };

  reduce = () => {
    this.setState({ mapDisabled: false });
    Animated.parallel([
      Animated.timing(this.state.translateAnim, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(this.state.translateButton, {
        toValue: 1,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();
  };

  showBottom = () => {
    this.setState({ showingRequest: false, finished: false });
    Animated.parallel([
      Animated.timing(this.state.translateAnim, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(this.state.translateButton, {
        toValue: 1,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start();
  };

  hideBottom = () => {
    Animated.parallel([
      Animated.timing(this.state.translateAnim, {
        toValue: 100,
        duration: 250,
        easing: Easing.in(Easing.ease),
        useNativeDriver: false,
      }),
      Animated.timing(this.state.translateButton, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }),
    ]).start(() => {
      this.setState({ showingRequest: true });
    });
  };

  render() {
    const {
      addingCar,
      showingRequest,
      translateAnim,
      translateButton,
      addingReview,
      pendingReview,
    } = this.state;

    const styles = this.props.eva.style;
    const { selectedAddress } = this.props;
    MapboxGL.setAccessToken(
      "pk.eyJ1IjoiZGllZ29qcnIwMCIsImEiOiJja2hmcGFtdDMwdWdxMnhwajVxdzgyaTM2In0.LXpshb8ITj1imht7nf2wmQ"
    );

    return (
      <>
        <LinearGradient
          pointerEvents="none"
          // Background Linear Gradient
          colors={["transparent", "rgba(0,0,0,0.4)"]}
          style={styles.gradient}
        />
        <MapboxGL.MapView
          scrollEnabled={!this.state.mapDisabled}
          zoomEnabled={!this.state.mapDisabled}
          style={styles.map}
          styleURL={"mapbox://styles/diegojrr00/ckhfrdjnk00ii19pkqsz6mm3h"}
          showUserLocation={true}
        >
          <MapboxGL.Camera
            zoomLevel={15}
            animationMode={"flyTo"}
            animationDuration={1500}
            centerCoordinate={[
              selectedAddress ? selectedAddress.location.lng : -100.291648,
              selectedAddress ? selectedAddress.location.lat : 25.651579,
            ]}
          />
          <MapboxGL.MarkerView
            id="postion"
            coordinate={[
              selectedAddress ? selectedAddress.location.lng : -100.291648,
              selectedAddress ? selectedAddress.location.lat : 25.651579,
            ]}
          >
            <View>
              <View style={styles.markerContainer}>
                <MaterialIcons
                  name="location-on"
                  size={styles.marker.size}
                  color={styles.marker.color}
                />
              </View>
            </View>
          </MapboxGL.MarkerView>
        </MapboxGL.MapView>
        <View
          style={{
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <Animated.View
            style={{
              width: "100%",
              height: 50,
              flexDirection: "row",
              marginTop: 20,
              marginBottom: 10,
            }}
          >
            <Animated.View
              style={{
                transform: [
                  {
                    translateX: translateButton.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-55, 0],
                    }),
                  },
                ],
                width: translateButton.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 55],
                }),
              }}
            >
              <Pressable onPress={() => this.props.navigation.openDrawer()}>
                <Options
                  style={{
                    height: 50,
                    marginLeft: 5,
                  }}
                ></Options>
              </Pressable>
            </Animated.View>

            <DirectionInput
              navigation={this.props.navigation}
              ref={this.addressInput}
              onClose={this.reduce}
              onPress={
                showingRequest
                  ? () => this.props.navigation.navigate("AutoComplete")
                  : this.expand
              }
              style={{
                flexGrow: 1,
                marginHorizontal: 5,
              }}
            ></DirectionInput>
          </Animated.View>
          <VehicleSelector
            animation={translateAnim}
            render={!showingRequest}
            onSelect={(data) => this.setState({ editVehicle: data })}
            onAddPress={() => {
              this.setState({ addingCar: true });
            }}
            onRequestPress={() => {
              if (selectedAddress) this.hideBottom();
              else this.expand();
            }}
          />
          <RequestForm onCancel={this.showBottom} render={showingRequest} />
        </View>
        <Modal
          visible={addingCar}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            position: "absolute",
            height: window.height,
            width: "100%",
            padding: 20,
          }}
          onBackdropPress={() => {}}
        >
          <AddCarPopUp onClose={() => this.setState({ addingCar: false })} />
        </Modal>
        <EditVehicleModal
          visible={this.state.editVehicle}
          vehicle={this.state.editVehicle}
          close={() => this.setState({ editVehicle: null })}
          userRequests={this.props.userRequests}
          vehicles={this.props.vehicles}
          updateVehicles={this.props.setVehicles}
          cleanServices={this.props.cleanServices}
        />
        <Modal
          visible={addingReview}
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            position: "absolute",
            height: window.height,
            width: "100%",
            padding: 20,
          }}
          onBackdropPress={() => {}}
        >
          <AddReviewPopUp
            pendingReview={pendingReview}
            onClose={() => this.setState({ addingReview: false })}
          />
        </Modal>
      </>
    );
  }
}

const StyledHome = withStyles(MapScreen, (theme) => ({
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 300,
    bottom: 0,
    elevation: 0,
  },
  markerContainer: {
    alignItems: "center",
    width: 50,
    backgroundColor: "transparent",
    height: 50,
  },
  marker: {
    color: theme["color-danger-600"],
    size: 32,
  },
  map: {
    position: "absolute",
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    elevation: -1,
  },
  carOption: {
    width: 121,
    height: 89,
    margin: 5,
  },
  materialButtonHamburger: {
    height: 102,
    width: 67,
    borderRadius: 10,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      width: 3,
      height: 3,
    },
    elevation: 30,
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
}));

const mapStateToProps = (state) => {
  const { selectedAddress, vehicles, userRequests, pendingReview } = state;
  return { selectedAddress, vehicles, userRequests, pendingReview };
};

export default connect(mapStateToProps, {
  cleanServices,
  setVehicles,
})(StyledHome);
