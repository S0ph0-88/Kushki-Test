// app.js
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();

// Middleware para leer datos del formulario
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Ruta que recibe el POST desde tu formulario HTML
app.post("/checkout/token", async (req, res) => {
  try {
    const { kushkiToken, cart_id } = req.body;

    console.log("Token recibido:", kushkiToken);
    console.log("Cart ID:", cart_id);

    // Llamada al endpoint de Charge con tu llave privada
    const response = await axios.post(
      "https://api-uat.kushkipagos.com/card/v1/charges",
      {
        amount: {
          subtotalIva: 0,
          iva: 0,
          subtotalIva0: 1000
        },
        currency: "MXN",
        token: kushkiToken,
        metadata: {
          reference: cart_id
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Private-Merchant-Id": "322b1727322b447f84a8845043a2a280" // tu llave privada
        }
      }
    );

    console.log("Respuesta de Kushki:", response.data);
    res.json(response.data);

  } catch (error) {
    console.error("Error en el charge:", error.response?.data || error.message);
    res.status(500).json({ error: "Error procesando el pago" });
  }
});

// Iniciar servidor
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
