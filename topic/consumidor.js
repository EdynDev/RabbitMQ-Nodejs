const amqp = require("amqplib");
const args = process.argv.slice(2);

(async () => {
  // Establecer una conexión con el servidor RabbitMQ
  const connection = await amqp.connect("amqp://localhost");
  // Crear un canal de comunicación dentro de la conexión
  const channel = await connection.createChannel();

  // Definir el nombre del intercambio y asegurarse de que sea de tipo "topic" y duradero
  const exchangeName = "exchange-topic";
  await channel.assertExchange(exchangeName, "topic", { durable: true });

  // Crear una cola anónima y exclusiva para este consumidor
  const assertQueue = await channel.assertQueue("", { exclusive: true });

  // Obtener las claves de enrutamiento desde los argumentos o usar ["key"] por defecto
  const routingKeys = args.length > 0 ? args : ["key"];

  const listBindings = [];

  // Vincular la cola al intercambio Topic con cada clave de enrutamiento especificada
  for (const routingKey of routingKeys) {
    listBindings.push(
      channel.bindQueue(assertQueue.queue, exchangeName, routingKey)
    );
  }

  // Esperar a que todas las vinculaciones se completen antes de consumir mensajes
  Promise.all(listBindings).then(() => {
    // Consumir mensajes de la cola y mostrarlos en la consola
    channel.consume(
      assertQueue.queue,
      (message) => console.log(message.content.toString()),
      { noAck: false }
    );
  });
})();
