pragma solidity 0.5.5;

contract IERC20 {
    function transfer(address to, uint256 value) public returns (bool) {}
}

contract GasPrice {

  // initialize
  uint256 public REWARD_PER_WIN = 12500000;
  uint256 public CREATOR_REWARD = 125000;
  address public CREATOR_ADDRESS;
  address public GTT_ADDRESS;
  uint256 public ONE_THOUSAND_GWEI = 1000000000000;

  // game state params
  uint256 public currLowest;
  uint256 public lastPayout;
  address public currWinner;

  // Can only be called once
  function setTokenAddress(address _gttAddress) public {
    if (GTT_ADDRESS == address(0)) {
      GTT_ADDRESS = _gttAddress;
    }
  }

  function play() public {
    uint256 currentBlock = block.number;

    // pay out last winner
    if (lastPayout == currentBlock - 2) {
      payOut(currentBlock - 1, currWinner);

      // reinitialize
      lastPayout = currentBlock - 1;
      currLowest = ONE_THOUSAND_GWEI;
    }

    // set current winner
    if (tx.gasprice <= currLowest) {
      currLowest = tx.gasprice;
      currWinner = msg.sender;
    }
  }

  function payOut(uint256 blockToPay, address winner) internal {
    IERC20(GTT_ADDRESS).transfer(winner, REWARD_PER_WIN);
    IERC20(GTT_ADDRESS).transfer(CREATOR_ADDRESS, CREATOR_REWARD);
  }
}