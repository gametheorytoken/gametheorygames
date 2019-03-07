var GTT = artifacts.require('GameTheoryToken.sol');
var GasPrice = artifacts.require('GasPrice.sol');
var NoTx = artifacts.require('NoTx.sol');
var CurrentKing = artifacts.require('CurrentKing.sol');
var Auction = artifacts.require('Auction.sol');

module.exports = function(deployer) {

  deployer.deploy(GasPrice).then(function() {
    return deployer.deploy(NoTx).then(function() {
      return deployer.deploy(CurrentKing).then(function() {
        return deployer.deploy(Auction).then(function() {
          // deploy tokens with game addresses
          return deployer.deploy(GTT, GasPrice.address, NoTx.address, CurrentKing.address, Auction.address).then(function(){
          })
        })
      })
    })
  })
};
