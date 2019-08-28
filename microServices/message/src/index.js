const { consumer, producer } = require("./kafka");
const topic = "issue-message";

function run() {
  consumer.connect();
  return consumer.subscribe({ topic }).then(() => {
    return consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
        console.log(`- ${prefix} ${message.key}#${message.value}`);

        const payload = JSON.parse(message.value);
        console.log(message);
        return producer.send({
          topic: "message-response",
          messages: [
            {
              value: `Usuário ${payload.message.from} enviou a mensagem '${payload.message.body}'`
            }
          ]
        });
      }
    });
  });
}

run().catch(console.error);
