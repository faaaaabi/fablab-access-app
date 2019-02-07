import React, { Component } from 'react-native';

class devicesContainer extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      devices: []
    }
  }
  
  componentDidMount() {

  }

  render() {

  }
}

const mapStateToProps = state => {
  return {
    authenticated: state.authenticated,
    host: state.host,
    isConnected: state.isConnected,
    apiKey: state.apiKey,
    token: state.token,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    onConnectionChanged: (value) => dispatch({
      type: 'CONNECTION_STATE_CHANGED',
      value
    }),
    onTokenReceived: (value) => dispatch({
      type: 'TOKEN_RECEIVED',
      value
    })
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(devicesContainer)