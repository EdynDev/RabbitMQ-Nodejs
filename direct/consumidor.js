const amqp = require("amqplib");
const args = process.argv.slice(2);

(async () => {
  // Establecer una conexión con el servidor RabbitMQ
  const connection = await amqp.connect("amqp://localhost");

  // Crear un canal de comunicación dentro de la conexión
  const channel = await connection.createChannel();

  // Definir el nombre del intercambio y asegurarse de que sea de tipo "direct" y duradero
  const exchangeName = "exchange-direct";
  await channel.assertExchange(exchangeName, "direct", { durable: true });

  // Crear una cola anónima y exclusiva para este consumidor
  const assertQueue = await channel.assertQueue("", { exclusive: true });

  // Definir la clave de enrutamiento, usando la proporcionada como argumento o "key" por defecto
  const routingKey = args.length > 0 ? args[0] : "key";

  // Vincular la cola al intercambio con la clave de enrutamiento especificada
  await channel.bindQueue(assertQueue.queue, exchangeName, routingKey);

  // Consumir mensajes de la cola y mostrarlos en la consola
  channel.consume(
    assertQueue.queue,
    (message) => console.log(message.content.toString()),
    { noAck: false } // No confirmar automáticamente la recepción de mensajes (se usará ack manual)
  );
})();
