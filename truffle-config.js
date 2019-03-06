require('dotenv').config();

module.exports = {
   compilers: {
     solc: {
       version: "^0.5.0", // A version or constraint - Ex. "^0.5.0"
       settings: {
         optimizer: {
           enabled: false,
         }
       }
     }
   },
   networks: {
     production: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
 }
}
