// Imports Express library
const express = require("express");
const app = express();
// Imports the Google Cloud client library
const { Datastore } = require("@google-cloud/datastore");
const datastore = new Datastore();

const mockdataNumber = 10000;

// Write to Datastore
app.get("/warmup", (req, res) => {
  async function warmUp() {
    // The kind for the new entity
    const kind = "Warmup-sample-data";
    // The name/ID for the new entity
    const name = "sampledata" + Math.random() * 1000;
    // The Cloud Datastore key for the new entity
    const dsKey = datastore.key([kind, name]);

    // Prepares the new entity
    const entity = {
      key: dsKey,
      data: {
        description: Math.random() * 100000,
      },
    };

    // Saves the entity
    await datastore.save(entity);
    console.log(`Saved ${entity.key.name}: ${entity.data.description}`);
  }

  for (let i = 0; i < mockdataNumber; i++) {
    warmUp().catch(console.error);
  }

  res.send("Successfully saved");
});

app.get("/listdata", (req, res) => {
  // Retrieve Datastore entities
  let entities = [];
  // Read from Datastore
  async function listData() {
    const query = datastore.createQuery("Warmup-sample-data");

    const [data] = await datastore.runQuery(query);
    console.log("Warmup-sample-data:");
    data.forEach((entity) => {
      const entityKey = entity[datastore.KEY];
      console.log(entityKey, entity);
      entities.push(entityKey, entity);
    });
    res.send(entities);
  }

  listData().catch(console.error);
});

// Delete Datastore entities
app.get("/deletedata", (req, res) => {
  // Retrieve Datastore entities

  async function deleteData() {
    const query = datastore.createQuery("Warmup-sample-data");

    const [data] = await datastore.runQuery(query);
    console.log("Warmup-sample-data:");
    data.forEach((entity) => {
      const entityKey = entity[datastore.KEY];
      datastore.delete(entityKey);
      console.log(`Warmup-sample-data ${entityKey} deleted successfully.`);
    });
    res.send("Deleted");
  }

  deleteData().catch(console.error);
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
