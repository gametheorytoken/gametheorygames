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