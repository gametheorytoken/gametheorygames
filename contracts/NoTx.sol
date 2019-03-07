pragma solidity 0.5.5;

contract IERC20 {
    function transfer(address to, uint256 value) public returns (bool) {}
}

contract NoTx {

  // initialize
  uint256 public REWARD_PER_WIN = 125000000;
  uint256 public CREATOR_REWARD = 1250000;
  address public CREATOR_ADDRESS = 0x1CB3f4482C1f89c5c9457fA2eB634885462E4372;
  address public GTT_ADDRESS;

  // game state params
  uint256 public lastPayout;
  address public currentWinner;

  mapping (uint256 => bool) public didBlockHaveTx;  // blockNumber, didBlockHaveTx

  constructor() public {
    currWinner = address(this);
  }

  // can only be called once
  function setTokenAddress(address _gttAddress) public {
    if (GTT_ADDRESS == address(0)) {
      GTT_ADDRESS = _gttAddress;
    }
  }

  function play() public {
    uint256 currentBlock = block.number;
    uint256 lastBlock = currentBlock - 1;

    // pay out last winner
    if (!didBlockHaveTx[lastBlock]) {
      payOut(currWinner);
    }

    // do nothing if a block has already been transacted in
    if (didBlockHaveTx[currentBlock]) {
      return;
    } else {
      didBlockHaveTx[currentBlock] = true;
      currWinner = msg.sender;
    }
  }

  function payOut(address winner) internal {
    IERC20(GTT_ADDRESS).transfer(winner, REWARD_PER_WIN);
    IERC20(GTT_ADDRESS).transfer(CREATOR_ADDRESS, CREATOR_REWARD);
  }
}