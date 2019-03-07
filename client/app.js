App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,
  gameGasPriceAddress: "0xc372B7985580ec9c7EB797e49e00C39755D05901",
  gameNoTxAddress: "0xfbb33A896f834E1470eB86840001bd1241ffbCe1",
  gameCurrentKingAddress: "0x26A33402F20992417070d8f319BBa32aF28BDF13",
  gameAuctionAddress: "0x02F22652e594ab44db7527b2F3cD5523253429eE",

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
    return App.initContractGasPrice();
  },

  // create contracts
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
      var gasPriceEntry = $('#gasPriceEntry');
      return instance.play({ from: App.account, gasPrice: gasPriceEntry });
    }).catch(function(err) {
      console.error(err);
    });
  },

  playNoTx: function() {
    App.contracts.NoTx.at(App.gameNoTxAddress).then(function(instance) {
      var noTxEntry = $('#noTxEntry');
      return instance.play({ from: App.account, gasPrice: noTxEntry });
    }).catch(function(err) {
      console.error(err);
    });
  },

  playCurrentKing: function() {
    App.contracts.CurrentKing.at(App.gameCurrentKingAddress).then(function(instance) {
      var currentKingEntry = $('#currentKingEntry');
      return instance.play({ from: App.account, gasPrice: currentKingEntry });
    }).catch(function(err) {
      console.error(err);
    });
  },

  playAuction: function() {
    App.contracts.Auction.at(App.gameAuctionAddress).then(function(instance) {
      var auctionEntry = $('#auctionEntry');
      return instance.play({ from: App.account, value: auctionEntry });
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
