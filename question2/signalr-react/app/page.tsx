"use client";

import React from "react";
import { useEffect } from "react";
import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { Button } from "@/components/ui/button";

export default function Home() {

  const [hubConnection, setHubConnection] = React.useState<HubConnection>();
  const [isConnected, setIsConnected] = React.useState<boolean>(false);

  const [usercount, setUserCount] = React.useState<number>(0);
  const [selectedChoice, setSelectedChoice] = React.useState<number>(-1);

  const [pizzaPrice, setPizzaPrice] = React.useState<number>(0);
  const [money, setMoney] = React.useState<number>(0);
  const [nbPizzas, setNbPizzas] = React.useState<number>(0);

  useEffect(() => {
      connectToHub();
    }, []);

  function connectToHub() {
    let newHubConnection = new HubConnectionBuilder()
    .withUrl('http://localhost:5282/hubs/pizza')
    .build();

    // TODO: Mettre isConnected à true seulement une fois que la connection au Hub est faite
    
newHubConnection.on(
      "UpdateNbUsers",(nbUsers: number) => {
        setUserCount(nbUsers);
      }
    );
      newHubConnection.on('ReceiveChoice',(choice: number, price: number, nb: number, moneyValue: number)=>{
     setSelectedChoice(choice);
     setPizzaPrice(price);
     setNbPizzas(nb);
     setMoney(moneyValue);
      
    });
     newHubConnection.on('UpdateMoney',(choice: number, moneyValue: number)=>{
       setMoney(moneyValue);
    });
     newHubConnection.on('UpdateNbPizzasAndMoney',(choice: number, nb: number, moneyValue: number)=>{
       setNbPizzas(nb);
       setMoney(moneyValue);
      
    });
     newHubConnection.on(
      "UpdatePizzaPrice",
      (choice: number, price: number) => {
        setPizzaPrice(price);
      }
    );
     newHubConnection.on('ReceiveBuyPizza',(choice: number)=>{
       setSelectedChoice(choice);
    });
  
     newHubConnection
      .start()
      .then(() => {
       setIsConnected(true);

      })
      .catch(err => console.log('Error while starting connection: ' + err))

    setHubConnection(newHubConnection);
  }

  function selectChoice(selectedChoice:number) {
    setSelectedChoice(selectedChoice);
    hubConnection!.invoke('SelectChoice',selectedChoice)
  
  }

  function unselectChoice() {
     hubConnection!.invoke('UnselectChoice',selectedChoice)
    setSelectedChoice(-1);
     setPizzaPrice(0);
    setMoney(0);
    setNbPizzas(0);
    
  }

  function addMoney() {
     hubConnection!.invoke('AddMoney',selectedChoice)
  }

  function buyPizza() {
      hubConnection!.invoke('BuyPizza',selectedChoice)
  }

  return (
    <>
      <img src="pizzaHub.png" style={{ height: 160 }} />
      <div className="main">
        {!isConnected && (
          <div>
            Connecting...
          </div>
        )}
        {isConnected && (
          <div className="m-4">
            <h1>Achat de pizza en groupe!</h1>
            <div>
              Nb connected users: {usercount}
            </div>
            <br></br>
            {selectedChoice < 0 && (
              <>
                <h2>Choisissez une pizza</h2>
                <div className="flex gap-4 w-full max-w-4xl mx-auto gap-4">

                  <img onClick={() => selectChoice(0)} src="pizza.png" style={{ height: 195 }} />
                  <img onClick={() => selectChoice(1)} src="pizzaAnanas.png" style={{ height: 195 }} />
                </div>
              </>
            )}
            {selectedChoice >= 0 && (
              <div>
                <h2>Votre pizza</h2>
                {selectedChoice === 0 && (
                  <img src="pizza.png" style={{ height: 195 }} />
                )}
                {selectedChoice === 1 && (
                  <img src="pizzaAnanas.png" style={{ height: 195 }} />
                )}
                <div>
                  <Button onClick={unselectChoice}>Changer de pizza</Button>
                </div>
                <h2>Achetez des pizzas</h2>
                <div className="section">
                  Prix d'une pizza: <b>{pizzaPrice}$</b>
                </div>
                <div className="section">
                  <span className="info">Total d'argent: {money}$</span>
                  <Button onClick={addMoney}>Ajouter 2$</Button>
                </div>
                <div className="section">
                  <span className="info">Nombre de pizzas: {nbPizzas}</span>
                  <Button disabled={money < pizzaPrice} onClick={buyPizza}>Acheter une pizza</Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}