import express from 'express';
import Rcon from 'rcon';
import chalk from 'chalk';

const app = express();
const server = new Rcon({
  host: '127.0.0.1',
  port: 25575,
  password: 'awd',
});

server.on('error', (err) => {
  console.error('error :', err.message);
});

app.use(express.urlencoded({ extended: true }));

app.get('/minecraft_api/give_item', (req, res) => {
  const playerName = req.query.playerName;
  const itemName = req.query.itemName;
  const amount = req.query.amount;
  const giveCommand = `give ${playerName} ${itemName} ${amount}`;

  if (server.connected) {
    server.send(giveCommand)
      .then((response) => {
        console.log(chalk.green('server response : ', response));
        res.status(200).send({message:response,status:true});
      })
      .catch((err) => {
        console.error(chalk.red('error :', err.message));
        res.status(500).send({message:err.response,status:false});
      });
  } else {
    console.error('RCON is not connected');
    res.status(500).send('RCON is not connected');
  }
});

server.on('authenticated', () => {
  console.log('RCON Authenticated');
});// Check if Connect

server.on('disconnected', () => {
  console.log(chalk.red('RCON Disconnected'));
});// Check IF Disconnect

app.listen(8079, () => {
  console.log(chalk.magenta('server is ready !'));
});