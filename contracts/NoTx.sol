pragma solidity 0.4.24;

library SafeMath {
    /**
    * @dev Multiplies two unsigned integers, reverts on overflow.
    */
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;
        require(c / a == b);

        return c;
    }

    /**
    * @dev Integer division of two unsigned integers truncating the quotient, reverts on division by zero.
    */
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b > 0);
        uint256 c = a / b;

        return c;
    }

    /**
    * @dev Subtracts two unsigned integers, reverts on overflow (i.e. if subtrahend is greater than minuend).
    */
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a);
        uint256 c = a - b;

        return c;
    }

    /**
    * @dev Adds two unsigned integers, reverts on overflow.
    */
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        require(c >= a);

        return c;
    }

    /**
    * @dev Divides two unsigned integers and returns the remainder (unsigned integer modulo),
    * reverts when dividing by zero.
    */
    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0);
        return a % b;
    }
}

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