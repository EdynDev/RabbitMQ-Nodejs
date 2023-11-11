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

  // Obtener el mensaje desde los argumentos proporcionados o usar "message by default" por defecto
  const message = args.length > 0 ? args[0] : "message by default";
  // Obtener la clave de enrutamiento desde los argumentos o usar "key" por defecto
  const routingKey = args.length > 1 ? args[1] : "key";

  // Publicar el mensaje en el intercambio Topic con la clave de enrutamiento especificada
  channel.publish(exchangeName, routingKey, Buffer.from(message));
  console.log(" [X] Send %s:%s", routingKey, message);

  // Cerrar la conexión y finalizar el proceso después de 2 segundos
  setTimeout(() => {
    connection.close();
    process.exit(1);
  }, 2000);
})();
