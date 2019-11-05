require("./db/mongoose");

const Task = require("./models/task");

Task.findByIdAndDelete("5db86b69e397991fe0f960d3")
  .then(deletedTask => {
    console.log(deletedTask);
    return Task.countDocuments({ completed: false });
  })
  .then(result => console.log(result))
  .catch(console.error);
