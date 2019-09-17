import React from 'react';

class App extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      apiBase: "https://api.ratesapi.io",
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

    fetch(`${this.state.apiBase}/api/latest`)
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
  
  addRate = (currency, rate)=>{
    fetch(`${this.state.apiBase}/api/create)`,{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({currency: currency, rate: rate})
    })
    .then((response)=> {
      if(response.status === 201){
        return(response.json())
      } else {
        throw('Could not create currency. You are not the central bank.')
      }
    })
    .then((currency)=>{
      //whatever you want with the new currency
      this.getRatesRetry()
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
