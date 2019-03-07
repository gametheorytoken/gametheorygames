App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,
  gttAddress: "0xcFf8f8e363b89aC96d81e2Ec5f5A80063434ad03",
  gameGasPriceAddress: "0x8301D3b998C7670BE5394f88cF296F7c296265d6",
  gameNoTxAddress: "0x5fB6277B54ACcE2Ca10F43290556a4ef323f890D",
  gameCurrentKingAddress: "0xf8dfDe37b19dF1Cc67BFA7bD121cD132DF0e012d",
  gameAuctionAddress: "0x676A6A6a0Ba18bDB366514a31d674694867Ca1F3",
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
    return App.initContractGTT();
  },

  // create contracts
  initContractGTT: function() {
    $.getJSON("GameTheoryToken.json", function(balance) {
      App.contracts.GTT = TruffleContract(balance);
      App.contracts.GTT.setProvider(App.web3Provider);
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

    // get gtt balance
    App.contracts.GTT.at(App.gttAddress).then(function(instance) {
      return instance.balanceOf(App.account);
    }).then(function(ans) {
        gttBalanceWei = ans / (10**8)
        $("#gttBalance").html("" + gttBalanceWei);
      })

    // get lowest gas
    App.contracts.GasPrice.at(App.gameGasPriceAddress).then(function(instance) {
      return instance.currLowest();
    }).then(function(ans) {
      gasPriceWei = ans / (10**9)
      $("#lowestGas").html("" + gasPriceWei.toString().substring(0,2) + " Gwei");
      })

    // get last block without tx
    App.contracts.NoTx.at(App.gameNoTxAddress).then(function(instance) {
      return instance.lastPayout();
    }).then(function(ans) {
        $("#lastBlock").html("" + ans + " Blocks");
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
        $("#currHighest").html("" + ans + " ETH/GTT");
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
  playGasPrice: function(gasPriceEntry) {
    App.contracts.GasPrice.at(App.gameGasPriceAddress).then(function(instance) {
      gasPriceEntryWei = gasPriceEntry * (10**9)
      console.log(gasPriceEntryWei)
      console.log
      return instance.play({ from: App.account, gasPrice: gasPriceEntryWei });
    }).catch(function(err) {
      console.error(err);
    });
  },

  playNoTx: function(noTxEntry) {
    App.contracts.NoTx.at(App.gameNoTxAddress).then(function(instance) {
      noTxEntryWei = noTxEntry * (10**9)
      return instance.play({ from: App.account, gasPrice: noTxEntryWei });
    }).catch(function(err) {
      console.error(err);
    });
  },

  playCurrentKing: function(currentKingEntry) {
    App.contracts.CurrentKing.at(App.gameCurrentKingAddress).then(function(instance) {
      currentKingEntryWei = currentKingEntry * (10**9)
      return instance.play({ from: App.account, gasPrice: currentKingEntryWei });
    }).catch(function(err) {
      console.error(err);
    });
  },

  playAuction: function(auctionEntry) {
    App.contracts.Auction.at(App.gameAuctionAddress).then(function(instance) {
      auctionEntryWei = auctionEntry * (10**18)
      return instance.play({ from: App.account, value: auctionEntryWei });
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
