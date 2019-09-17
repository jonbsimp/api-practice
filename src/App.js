import React from 'react';

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      rates: null,
      errors: null,
      isFetching: true
    }
    this.getExchangeRates()
  }
  
  getRatesRetry = () => {
    this.setState({isFetching: true, errors: null})
    this.getExchangeRates()
  }
  getExchangeRates = () =>{
    const apiEndpoint = "https://api.ratesapi.io/api/latest"
    fetch(apiEndpoint)
    .then((response)=> {
      if(response.status === 200){
        return response.json()
      } else {
        throw("Could not get conversion rates. Please try again.")
      }
    })
    
    .then((currencyInfo)=>{
      this.setState({
        rates: currencyInfo.rates, 
        isFetching: false, 
        errors: null
      })
    })
    
    .catch((error)=>{
      this.setState({
        errors: error, 
        isFetching: false
      })
    })
  }
  
  render(){
    return(
      <div>
        <h1>Euro Currency Conversion</h1>
        {this.state.isFetching &&
        <h4>We're fetching your rates. Please hold.</h4>
        }
        
        {this.state.errors &&
        <div>
          <h5>{this.state.errors}</h5>
          <button onClick={this.getRatesRetry}>Try Again</button>
        </div>
        }
        
        {this.state.rates &&
        <ul>
          {Object.keys(this.state.rates).map((currency, index)=>{
            return(
              <li key={index}>{currency}: {this.state.rates[currency]}</li>
            )
          })}
        </ul>
        }
      </div>
      )
  
  
  }
}

export default App;
