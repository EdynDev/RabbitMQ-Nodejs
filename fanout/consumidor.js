const amqp = require("amqplib");
const args = process.argv.slice(2);

(async () => {
  // Establecer una conexión con el servidor RabbitMQ
  const connection = await amqp.connect("amqp://localhost");
  // Crear un canal de comunicación dentro de la conexión
  const channel = await connection.createChannel();

  // Definir el nombre del intercambio y asegurarse de que sea de tipo "fanout" y duradero
  const exchangeName = "exchange-fanout";
  await channel.assertExchange(exchangeName, "fanout", { durable: true });

  // Crear una cola anónima y exclusiva para este consumidor
  const assertQueue = await channel.assertQueue("", { exclusive: true });

  // Vincular la cola al intercambio Fanout sin especificar una clave de enrutamiento
  await channel.bindQueue(assertQueue.queue, exchangeName, "");

  // Consumir mensajes de la cola y mostrarlos en la consola
  channel.consume(
    assertQueue.queue,
    (message) => console.log(message.content.toString()),
    {
      noAck: false,
    }
  );
})();
