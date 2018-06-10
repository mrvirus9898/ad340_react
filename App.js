import React from 'react';
import { FlatList, ActivityIndicator, Text, View, Image,StyleSheet,AppRegistry, Button, Alert  } from 'react-native';
import {
  StackNavigator,
} from 'react-navigation';


class FetchExample extends React.Component {

static navigationOptions = {
    title: 'Seattle Traffic Cameras',
  };

  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }

  componentDidMount(){
    return fetch('https://web6.seattle.gov/Travelers/api/Map/Data?zoomId=13&type=2')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson.Features,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }

  cameraType(camera) {
      if(camera.Type == 'sdot'){
            return  "http://www.seattle.gov/trafficcams/images/"+camera.ImageUrl;
      }else{
            return "http://images.wsdot.wa.gov/nw/"+camera.ImageUrl;
      }
  }

  renderCamera(camera){
            let pic = {
              uri: this.cameraType(camera)
            };
            return (
              <Image source={pic} style={{width: 350, height: 220}}/>
            );
  }



  render(){
    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }else{
        return(


              <View style={{flex: 1}}>
                <FlatList
                  data={this.state.dataSource}
                  keyExtractor={(item, index) => index}
                  renderItem={({item}) => <Text>{this.renderCamera(item.Cameras[0])} {item.Cameras[0].Description}</Text>}
                />
              </View>
            );
    }


  }
}

class HomeScreen extends React.Component {

static navigationOptions = {
    title: 'Welcome',
  };

 _onPressButton() {
    Alert.alert('You Dapped the button!')
    this.navigate('Cams')
  }

  render() {
    const { navigate } = this.props.navigation;
    return (
    <View style={this.styles.container}>
      <View style={this.styles.buttonContainer}>
          <Button
            onPress= { () => navigate("Cams") }
            title="Traffic Cameras"
          />
        </View>
      </View>
    );
  }

  styles = StyleSheet.create({
    container: {
     flex: 1,
     justifyContent: 'center',
    },
    buttonContainer: {
      margin: 20
    },
    alternativeLayoutButtonContainer: {
      margin: 20,
      flexDirection: 'row',
      justifyContent: 'space-between'
    }
  })
}


export default class App extends React.Component {
  render () {
    return <NavigationApp />;
  }
}

const NavigationApp = StackNavigator({
    Home: { screen: HomeScreen },
    Cams: { screen: FetchExample },
});