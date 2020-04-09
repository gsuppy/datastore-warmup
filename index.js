// Imports Express library
const express = require("express");
const app = express();
// Imports the Google Cloud client library
const { Datastore } = require("@google-cloud/datastore");
const datastore = new Datastore();

const mockdataNumber = 30000;

// Write to Datastore
app.get("/warmup", (req, res) => {
  async function warmUp() {
    // The kind for the new entity
    const kind = "Claim";
    // The name/ID for the new entity
    const name = "sampledata" + Math.random() * 1000000;
    // The Cloud Datastore key for the new entity
    const dsKey = datastore.key([kind, name]);

    // Prepares the new entity
    const entity = {
      key: dsKey,
      data: {
        ClaimantJSON: {
          claim: {
            claimntssn: "",
            daysWorked: "",
            earnedMore: "",
            lastDayWorked: "",
            covid: "",
            workedInNy: "",
            liveInNy: "",
            commuteToNy: "",
            dischargedFromMilitary: "",
            workedAsFederalEmployee: "",
            claimant: {
              firstName: "",
              middleInitial: "",
              lastName: "",
              otherName: "",
              dateOfBirth: "",
              dmvLicenseId: "",
              dmvIdNotAvailable: "",
              employersWorkedFor: "",
              mailingAddress: {
                address1: "",
                city: "",
                state: "",
                zip: "",
              },
              phone: "",
              phoneNotAvailable: "",
              gender: "",
              educationLevel: "",
              veteran: "",
              usCitizen: "",
              alienRegistrationNumber: "",
              uiCheckWithheld: "",
              uiCheckStateWithheld: "",
              voterRegistration: "",
              ethnicity: "",
              race: "",
              disabled: "",
            },
            eligibility: {
              lackOfWork: "",
              moreGrossPay: "",
              employeeOfEdu: "",
              claimBetweenAcademicYear: "",
              continueWorkForEdu: "",
              officerOfCorporation: "",
              workForRelative: "",
              decisionForBusiness: "",
              businessSoleProprietorship: "",
              relativeSpouse: "",
              relativeParent: "",
              otherBusinessIncome: "",
              attendingSchool: "",
              startWorkImmediately: "",
              receivePeriodicSeverance: "",
              paymentGreaterMaxBenefit: "",
              paymentLumpSum: "",
              vacationPayAfterEffectiveDate: "",
              employerScheduleVacation: "",
              holidayPayAfterEffectiveDate: "",
              gettingPension: "",
              gettingWorkersCompensation: "",
              gettingNysDisability: "",
              unionMember: "",
              unionNumber: "",
            },
            recentEmployer: {
              federalEmployerIdNumber: "",
              nysEmployerRegistrationNumber: "",
              legalName: "",
              address1: "",
              address2: "",
              city: "",
              state: "",
              zip: "",
              phoneNumber: "",
              firstDayWorked: "",
              reasonForSeparation: "",
              hasReturnToWorkDate: "",
              returnToWorkDate: "",
              jobTitle: "",
              occupationalGroup: "",
            },
            veteranInformation: {
              vietnamLocation: "",
            },
          },
          lastScreenID: "",
        },
        EmployerList: "NYS",
        OCLookUp: {},
        PIN: "111111",
        SSN: "111111111",
        USERID: "NYSNYS",
      },
    };
    // Saves the entity
    await datastore.save(entity);
    console.log(`Saved ${entity.key.name}: ${entity.data.description}`);
  }

  for (let i = 0; i < mockdataNumber; i++) {
    warmUp().catch(console.error);
  }

  setTimeout(() => {
    for (let i = 0; i < mockdataNumber; i++) {
      warmUp().catch(console.error);
    }
  }, 30000);

  res.send("Successfully saved");
});

app.get("/listdata", (req, res) => {
  // Retrieve Datastore entities
  // let entities = [];
  // Read from Datastore
  async function listData() {
    const query = datastore.createQuery("Claim");

    const [data] = await datastore.runQuery(query);
    console.log("Claim:");
    for (let i = 0; i < 100; i++) {
      const entity = data[i];
      const entityKey = entity[datastore.KEY];
      console.log(entityKey, entity);
      // entities.push(entityKey, entity);
    }
    // res.send(entities);
  }

  listData().catch(console.error);

  setTimeout(() => {
    listData().catch(console.error);
  }, 30000);
  res.send("Success");
});

// Delete Datastore entities
app.get("/deletedata", (req, res) => {
  // Retrieve Datastore entities

  async function deleteData() {
    const query = datastore.createQuery("Claim");

    const [data] = await datastore.runQuery(query);
    console.log("Claim:");
    data.forEach((entity) => {
      const entityKey = entity[datastore.KEY];
      datastore.delete(entityKey);
      console.log(`Claim ${entityKey} deleted successfully.`);
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
