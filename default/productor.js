const amqp = require("amqplib");
const args = process.argv.slice(2);

(async () => {
  // Establecer una conexión con el servidor RabbitMQ
  const connection = await amqp.connect("amqp://localhost");
  // Crear un canal de comunicación dentro de la conexión
  const channel = await connection.createChannel();

  // Definir el nombre de la cola y asegurarse de que sea durable (persistente)
  const queueName = "queue01";
  await channel.assertQueue(queueName, { durable: true });

  // Obtener el mensaje desde los argumentos proporcionados o usar "message by default" por defecto
  const message = args.length > 0 ? args[0] : "message by default";

  // Enviar mensajes a la cola
  for (let i = 0; i <= 9; i++) {
    channel.sendToQueue(queueName, Buffer.from(`${message} - ${i}`));
  }

  // Cerrar la conexión y finalizar el proceso después de 2 segundos
  setTimeout(() => {
    connection.close();
    process.exit(1);
  }, 2000);
})();
