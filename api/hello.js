// hello.js

module.exports = (req, res) => {
    // Perform any backend logic here (if needed)
  
    // Respond with a JSON object
    res.status(200).json({ message: "Hello from the serverless function!" });
  };
  