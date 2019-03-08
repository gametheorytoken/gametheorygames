App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,
  maxGTT: 25000000000000,
  gttAddress: "0x4E9D69f78f81e87C1e7118E5c6f248eFa296672b",
  gameGasPriceAddress: "0xF3b72A4DEAd2368E7Da7b17dDd354D59ae5901a6",
  gameNoTxAddress: "0x399600B7C7a89D2052aDf531FF01E31b2e29577a",
  gameCurrentKingAddress: "0x1F1098Fc04a2Ea73d4fDAf50a4659b21273045C7",
  gameAuctionAddress: "0xfef1C85bBeF5f1229bc9D5D9D27414AE0137d5DB",
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

    // get block number
    web3.eth.getBlockNumber(function(error, result){
      if(!error){
        App.blockNumber = document.getElementById('ethereumBlockNumber').innerHTML = document.getElementById('ethereumBlockNumber').innerHTML+"<br>"+result;
        App.blockNumber;
      } else
        console.error(error);
      });

    // get gtt balance
    App.contracts.GTT.at(App.gttAddress).then(function(instance) {
      return instance.balanceOf(App.account);
    }).then(function(ans) {
        gttBalanceWei = ans / (10**8)
        $("#gttBalance").html("" + gttBalanceWei);
      })

    // get lowest gas tokens claimed
    App.contracts.GTT.at(App.gttAddress).then(function(instance) {
      return instance.balanceOf(App.gameGasPriceAddress);
    }).then(function(gttInContract) {
        gttClaimed = App.maxGTT - gttInContract
        gttClaimedWei = gttClaimed / (10**8)
        $("#gttBalanceGasPrice").html("Number of GTT Claimed: " + gttClaimedWei.toString().substring(0,5));
    })

    // get no tx tokens claimed
    App.contracts.GTT.at(App.gttAddress).then(function(instance) {
      return instance.balanceOf(App.gameNoTxAddress);
    }).then(function(gttInContract) {
        gttClaimed = App.maxGTT - gttInContract
        gttClaimedWei = gttClaimed / (10**8)
        $("#gttBalanceNoTx").html("Number of GTT Claimed: " + gttClaimedWei.toString().substring(0,5));
    })

    // get current king tokens claimed
    App.contracts.GTT.at(App.gttAddress).then(function(instance) {
      return instance.balanceOf(App.gameCurrentKingAddress);
    }).then(function(gttInContract) {
        gttClaimed = App.maxGTT - gttInContract
        gttClaimedWei = gttClaimed / (10**8)
        $("#gttBalanceCurrentKing").html("Number of GTT Claimed: " + gttClaimedWei.toString().substring(0,5));
    })

    // get auction tokens claimed
    App.contracts.GTT.at(App.gttAddress).then(function(instance) {
      return instance.balanceOf(App.gameAuctionAddress);
    }).then(function(gttInContract) {
        gttClaimed = App.maxGTT - gttInContract
        gttClaimedWei = gttClaimed / (10**8)
        $("#gttBalanceAuction").html("Number of GTT Claimed: " + gttClaimedWei.toString().substring(0,5));
    })

    // get auction blocks left
    App.contracts.Auction.at(App.gameAuctionAddress).then(function(instance) {
      return instance.lastAuctionStart();
    }).then(function(lastAuctionStart) {
        currentBlockInt = parseInt(App.blockNumber.toString().substring(4))
        blocksLeft = 50 - (currentBlockInt - lastAuctionStart)
        blocksLeft = blocksLeft > 0 ? blocksLeft : 0
        $("#auctionBlocksRemaining").html("Blocks Remaining in Auction: " + blocksLeft);
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
        auctionPriceWei = ans / (10**18)
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
      auctionEntryWei = auctionEntry * (10**9)
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
