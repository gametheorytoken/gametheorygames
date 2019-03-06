pragma solidity 0.5.5;

contract IERC20 {
    function transfer(address to, uint256 value) public returns (bool) {}
}

contract NoTx {

  // initialize
  uint256 public REWARD_PER_WIN = 125000000;
  uint256 public CREATOR_REWARD = 1250000;
  address public CREATOR_ADDRESS;
  address public GTT_ADDRESS;

  // game state params
  uint256 public lastPayout;
  address public currentWinner;

  mapping (uint256 => bool) public didBlockHaveTx;  // blockNumber, didBlockHaveTx

  // Can only be called once
  function setTokenAddress(address _gttAddress) public {
    if (GTT_ADDRESS == address(0)) {
      GTT_ADDRESS = _gttAddress;
    }
  }

  function play() public {
    uint256 currentBlock = block.number;

    // pay out last winner
    if (lastPayout != currentBlock - 1) {
      payOut(currentBlock - 1, currentWinner);
      didBlockHaveTx[currentBlock] = false;
    }

    // do nothing if a block has already been transacted
    if (didBlockHaveTx[currentBlock] == true) {
      return;
    } else {
      didBlockHaveTx[currentBlock] = true;
      currentWinner = msg.sender;
    }
  }

  function payOut(uint256 blockToPay, address winner) internal {
    lastPayout = blockToPay;

    IERC20(GTT_ADDRESS).transfer(winner, REWARD_PER_WIN);
    IERC20(GTT_ADDRESS).transfer(CREATOR_ADDRESS, CREATOR_REWARD);
  }
}