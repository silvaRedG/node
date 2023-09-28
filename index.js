const express = require('express');
const uuid = require('uuid');

const app = express();
const port = 3011;

app.use(express.json());

const orders = []; // Array para armazenar os pedidos

const checkOrder = (req, res, next) => {
  const { id } = req.params;
  const orderIndex = orders.findIndex((order) => order.id === id);

  if (orderIndex === -1) {
    return res.status(404).json({ error: "Pedido não encontrado" });
  }

  req.userOrder = orders[orderIndex];
  next();
};

app.get("/orders", (req, res) => {
  return res.json(orders);
});

app.post("/order", (req, res) => {
    
try{
  const { name,age, pedido, valor, status } = req.body;
  const order = { id: uuid.v4(), name,age, pedido, valor, status };

  if (age < 18) {
    throw new Error("Usuario menor de idade")
  }
  
  orders.push(order);

  return res.status(201).json(order);

}catch(err){
    res.status(500).json({error: err.message})
}

   
});

app.put("/order/:id", checkOrder, (req, res) => {
  const { name, pedido, valor, status } = req.body;
  const order = req.userOrder;

  order.name = name;
  order.pedido = pedido;
  order.valor = valor;
  order.status = status;

  return res.json(order);
});

app.get("/order/:id", (req, res) => {
  const { id } = req.params;
  const order = orders.find((order) => order.id === id);

  if (!order) {
    return res.status(404).json({ error: "Pedido não encontrado" });
  }

  return res.json(order);
});

app.delete("/order/:id", checkOrder, (req, res) => {
  const { id } = req.params;
  const orderIndex = orders.findIndex((order) => order.id === id);

  if (orderIndex !== -1) {
    orders.splice(orderIndex, 1);
    return res.json({ message: "Pedido deletado com sucesso" });
  } else {
    return res.status(404).json({ error: "Pedido não encontrado" });
  }
});

app.patch("/order/:id", (req, res) => {
  const { id } = req.params;
  const status = "Pronto";

  const order = orders.find((order) => order.id === id);

  if (!order) {
    return res.status(404).json({ error: "Pedido não encontrado" });
  }

  order.status = status;
  return res.json(order);
});

app.listen(port, () => {
  console.log(`Servidor funcionando na porta: ${port}`);
});