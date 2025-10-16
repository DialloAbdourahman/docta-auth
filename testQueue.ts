import { publishToTopicExchange } from "docta-package";
import { Exchanges, PatientCreatedEvent, RoutingKey } from "docta-package";

const run = async () => {
  await publishToTopicExchange<PatientCreatedEvent>({
    exchange: Exchanges.DOCTA_EXCHANGE,
    routingKey: RoutingKey.PATIENT_CREATED,
    message: {
      id: "68f11c6f7918db134b4e8e07",
      email: "toto@gmail.com",
      fullName: "Toto",
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OGYxMWM2Zjc5MThkYjEzNGI0ZThlMDciLCJpYXQiOjE3NjA2MzE5MTl9.avl0WkaNbQEg0ujrvz_VnH--qW5RDNgWXRYKdMy1zKU",
    },
  });
};

run();
