const routes = require("express").Router();
const { CompressionTypes } = require("kafkajs");

routes.post("/send", (req, res) => {
  req.producer.send({
    topic: "issue-message",
    compression: CompressionTypes.GZIP,
    messages: [
      { value: JSON.stringify(req.body) },
      {
        value: JSON.stringify({
          ...req.body,
          message: {
            from: req.body.name,
            body: req.body.message
          }
        })
      }
    ]
  });

  return res.json({ sent: true });
});

module.exports = routes;
