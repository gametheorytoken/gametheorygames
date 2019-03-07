var GTT = artifacts.require('GameTheoryToken.sol');
var GasPrice = artifacts.require('GasPrice.sol');
var NoTx = artifacts.require('NoTx.sol');
var CurrentKing = artifacts.require('CurrentKing.sol');
var Auction = artifacts.require('Auction.sol');

module.exports = function(deployer) {
  // deploy games
  deployer.deploy(GasPrice);
  deployer.deploy(NoTx);
  deployer.deploy(CurrentKing);
  deployer.deploy(Auction);

  // deploy tokens with game addresses
  deployer.deploy(GTT, GasPrice.address, NoTx.address, CurrentKing.address, Auction.address);
};
