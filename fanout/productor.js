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

  // Obtener el mensaje desde los argumentos proporcionados o usar "message by default" por defecto
  const message = args.length > 0 ? args[0] : "message by default";

  // Publicar el mensaje en el intercambio Fanout sin especificar una clave de enrutamiento
  channel.publish(exchangeName, "", Buffer.from(message));

  // Cerrar la conexión y finalizar el proceso después de 2 segundos
  setTimeout(() => {
    connection.close();
    process.exit(1);
  }, 2000);
})();
