import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TextInput, ToolbarAndroid } from 'react-native';

class Greeting extends Component {
  render() {
    return (
      <Text>Hello {this.props.name}!</Text>
    );
  }
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {text: ''};
  }
  onActionSelected(position) {
    if (position === 0) {
      showSettings();
    }
  }
  render() {
    let pic = {
      uri: 'https://upload.wikimedia.org/wikipedia/commons/d/de/Bananavarieties.jpg'
    };
    return (
      <View style={styles.container}>
        <ToolbarAndroid
          logo={require('./app_logo.png')}
          title="AwesomeApp"
          actions={[{title: 'Settings', show: 'always'}]}
          onActionSelected={this.onActionSelected} />
        <Text>这是中文</Text>
        <Image source={pic} style={{width: 193, height: 110}}/>
        <View style={{alignItems:'center'}}>
          <Greeting name='Jaina' />
          <Greeting name='Valeera' />
        </View>
        <TextInput
          style={{height: 40}}
          placeholder="Type here to translate!"
          onChangeText={(text) => this.setState({text})}
        />
        <Text style={{padding: 10, fontSize: 42}}>{this.state.text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'powderblue',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
