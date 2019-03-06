App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,
  gameGasPriceAddress: "0x83d683bc8662d50e06e1b5c84aa052b3cfbe6480",
  gameNoTxAddress: "0xb6a2f641014c98baed0c60b1b5427526fa556888",
  gameCurrentKingAddress: "0x83fb7fd075bc0700250e59663a5a3d3ed9824aa7",
  gameAuctionAddress: "0xc8ba6a9326064645c45d57c947477e26aea64c08",

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {
      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // Specify default instance if no web3 instance provided
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  // create contracts
  initContract: function() {
    $.getJSON("Election.json", function(election) {
      App.contracts.Election = TruffleContract(election);
      App.contracts.Election.setProvider(App.web3Provider);
      return App.initContractGasPrice();
    });
  },

  initContractGasPrice: function() {
    $.getJSON("GasPrice.json", function(gasPrice) {
      App.contracts.GasPrice = TruffleContract(gasPrice);
      App.contracts.GasPrice.setProvider(App.web3Provider);
      return App.initContractNoTx();
    });
  },

  initContractNoTx: function() {
    $.getJSON("NoTx.json", function(notx) {
      App.contracts.NoTx = TruffleContract(notx);
      App.contracts.NoTx.setProvider(App.web3Provider);
      return App.initContractCurrentKing();
    });
  },

  initContractCurrentKing: function() {
    $.getJSON("CurrentKing.json", function(currentKing) {
      App.contracts.CurrentKing = TruffleContract(currentKing);
      App.contracts.CurrentKing.setProvider(App.web3Provider);
      return App.initContractAuction();
    });
  },

  initContractAuction: function() {
    $.getJSON("Auction.json", function(auction) {
      App.contracts.Auction = TruffleContract(auction);
      App.contracts.Auction.setProvider(App.web3Provider);
      return App.render();
    });
  },



  render: function() {

    // get account address
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
      }
    });

    // get lowest gas
    App.contracts.GasPrice.at(App.gameGasPriceAddress).then(function(instance) {
      return instance.currLowest();
    }).then(function(ans) {
        $("#lowestGas").html("" + ans);
      })

    // get last block without tx
    App.contracts.NoTx.at(App.gameNoTxAddress).then(function(instance) {
      return instance.lastPayout();
    }).then(function(ans) {
        $("#lastBlock").html("" + ans);
      })

    // get current king
    App.contracts.CurrentKing.at(App.gameCurrentKingAddress).then(function(instance) {
      return instance.currentKing();
    }).then(function(ans) {
        $("#currentKing").html("" + ans.substring(0,8) + "...");
      })

    // get current price
    App.contracts.Auction.at(App.gameAuctionAddress).then(function(instance) {
      return instance.currHighest();
    }).then(function(ans) {
        $("#currHighest").html("" + ans);
      })


    // NEED TO KEEP THIS HERE FOR SOME REASON
    var electionInstance;
    var loader = $("#loader");
    var content = $("#content");
    content.show();

    // Load contract data
    App.contracts.Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(function(candidatesCount) {
      var candidatesResults = $("#candidatesResults");
      return candidatesResults;
    }).then(function(hasVoted) {
      // Do not allow a user to vote
      if(hasVoted) {
        $('form').show();
      }
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  // send transactions
  playGasPrice: function() {
    App.contracts.GasPrice.at(App.gameGasPriceAddress).then(function(instance) {
      return instance.play({ from: App.account });
    }).catch(function(err) {
      console.error(err);
    });
  },

  playNoTx: function() {
    App.contracts.NoTx.at(App.gameNoTxAddress).then(function(instance) {
      return instance.play({ from: App.account });
    }).catch(function(err) {
      console.error(err);
    });
  },

  playCurrentKing: function() {
    App.contracts.CurrentKing.at(App.gameCurrentKingAddress).then(function(instance) {
      return instance.play({ from: App.account });
    }).catch(function(err) {
      console.error(err);
    });
  },

  playAuction: function() {
    App.contracts.Auction.at(App.gameAuctionAddress).then(function(instance) {
      return instance.play({ from: App.account });
    }).catch(function(err) {
      console.error(err);
    });
  }

};


$(function() {
  $(window).load(function() {
    App.init();
  });
});
