// Importa la biblioteca "amqplib" para trabajar con RabbitMQ.
const amqp = require("amqplib");

// Define una función asíncrona autoinvocada (IIFE) para ejecutar el código.
(async () => {
  // Establece una conexión con el servidor RabbitMQ que se encuentra en "amqp://localhost".
  const connection = await amqp.connect("amqp://localhost");

  // Crea un canal de comunicación a través de la conexión.
  const channel = await connection.createChannel();

  // Define el nombre de la cola que se utilizará.
  const queueName = "queue01";

  // Declara la cola en el servidor RabbitMQ. La cola será "durable", lo que significa que
  // sobrevivirá a reinicios del servidor.
  await channel.assertQueue(queueName, { durable: true });

  // Configura un consumidor para la cola. Cuando llega un mensaje a la cola,
  // la función definida se ejecutará y mostrará el contenido del mensaje en la consola.
  channel.consume(queueName, (msg) => console.log(msg.content.toString()), {
    noAck: false, // "noAck" significa que se espera una confirmación manual (acknowledgment) después de procesar el mensaje.
  });
})();
