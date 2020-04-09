// Imports Express library
const express = require("express");
const app = express();
// Imports the Google Cloud client library
const { Datastore } = require("@google-cloud/datastore");
const datastore = new Datastore();

const mockdataNumber = 1000;

// Write to Datastore
app.get("/warmup", (req, res) => {
  let entities = [];

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
    entities.push(entity.key.name, entity.data.description);
    console.log(`Saved ${entity.key.name}: ${entity.data.description}`);
  }

  for (let i = 0; i < mockdataNumber; i++) {
    warmUp().catch(console.error);
  }
  setTimeout(() => {
    res.send(entities);
  }, 2000);
});

// Read from Datastore
app.get("/listdata", (req, res) => {
  // Retrieve Datastore entities
  let entities = [];

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
async function deleteData(entityId) {
  const sampleKey = datastore.key([
    "Warmup-sample-data",
    datastore.int(entityId),
  ]);

  await datastore.delete(sampleKey);
  console.log(`Warmup-sample-data ${entityId} deleted successfully.`);
}

// deleteData(entityKey.id).catch(console.error);

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
