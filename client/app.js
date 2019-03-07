App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,
  gttAddress: "0x73522355C2021da800705305aD45b0AB64fC2352",
  gameGasPriceAddress: "0xE7b4d1Fc14DD3085D4BCE615079821E099A61596",
  gameNoTxAddress: "0x14C6c72d7734b3a689DB376944548b1F8738BeCB",
  gameCurrentKingAddress: "0x908b089Dcf91eC0a6326816CEdc6D313eFc73046",
  gameAuctionAddress: "0xFeD9094647b00A88170D599cB592366c56D48ed6",
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
      $("#lowestGas").html("" + gasPriceWei + " Gwei");
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
        console.log(ans)
        auctionPriceWei = ans / (10**18)
        console.log(auctionPriceWei)
        $("#currHighest").html("" + auctionPriceWei.toString().substring(0,4) + " ETH/GTT");
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
      console.log(auctionEntry)
      auctionEntryWei = auctionEntry * (10**9)
      console.log(auctionEntryWei)
      return instance.play({ from: App.account, gasPrice: auctionEntryWei });
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
