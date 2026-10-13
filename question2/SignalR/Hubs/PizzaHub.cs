using Microsoft.AspNetCore.SignalR;
using SignalR.Services;

namespace SignalR.Hubs
{
    public class PizzaHub : Hub
    {
        private readonly PizzaManager _pizzaManager;

        public PizzaHub(PizzaManager pizzaManager) {
            _pizzaManager = pizzaManager;
        }

        public override async Task OnConnectedAsync()
        {
        
            await base.OnConnectedAsync();
            _pizzaManager.AddUser();
            await Clients.All.SendAsync("UpdateNbUsers", _pizzaManager.NbConnectedUsers);

        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            await base.OnDisconnectedAsync(exception);
            _pizzaManager.RemoveUser();
            await Clients.All.SendAsync("UpdateNbUsers", _pizzaManager.NbConnectedUsers);
        }

        public async Task SelectChoice(PizzaChoice choice)
        {
            var groupName = _pizzaManager.GetGroupName(choice);
            var prixPizza = _pizzaManager.GetPizzaPrice(choice);
            var NbPizza= _pizzaManager.GetNbPizzas(choice);
            var money = _pizzaManager.GetMoney(choice);

            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("ReceiveChoice", choice, prixPizza, NbPizza, money);
            await Clients.All.SendAsync("UpdatePizzaPrice", choice,prixPizza);

        }

        public async Task UnselectChoice(PizzaChoice choice)
        {
            var groupName = _pizzaManager.GetGroupName(choice);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }

        public async Task AddMoney(PizzaChoice choice)
        {
            _pizzaManager.IncreaseMoney(choice);
            var groupName = _pizzaManager.GetGroupName(choice);
            await Clients.Group(groupName).SendAsync("UpdateMoney", choice, _pizzaManager.GetMoney(choice));

        }

        public async Task BuyPizza(PizzaChoice choice)
        {
             _pizzaManager.BuyPizza(choice);
            var groupName = _pizzaManager.GetGroupName(choice);
            var NbPizza = _pizzaManager.GetNbPizzas(choice);
            var money = _pizzaManager.GetMoney(choice);
            await Clients.Group(groupName).SendAsync("UpdateNbPizzasAndMoney", choice, NbPizza, money);
            await Clients.All.SendAsync("ReceiveBuyPizza", choice);
        }
    }
}
