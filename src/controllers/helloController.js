exports.sayHello = (req, res) => {
  res.status(200).json({ message: "Hello from the microservice!" });
};