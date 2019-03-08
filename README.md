<h1 align="center">
  Game Theory Games
</h1>

![gameboard](https://github.com/gametheorytoken/gametheorygames/blob/master/client/static/gameboard.png)

## How It Works
Game Theory Games are a truly decentralized way to earn Game Theory Token, an ERC20 token with no owner.  All the games are immutable smart contracts that run on the Ethereum network and cannot be changed or upgraded.

Game Theory Tokens (GTT) are rare ERC20 tokens that reward you for outsmarting your opponents in various scenarios. They have a fixed supply of 1 million tokens, and there will never be any more or any less. Each game is holding approximately 1/4 of the tokens that will be distributed over time. Play the games above to prove yourself and win Game Theory Tokens.

**The tokens are only created and distributed through these four games. There is no owner and no way to create tokens, other than winning these games. There is no premine and there will only ever be a finite number available.**

The games will distribute tokens for approximately one year, at which point all of the tokens will be minted and no more will ever be created. The token code is publicly available and the previous sentence can be verified by anyone.


There will only ever be 1 million GTT created. The rewards for each game have been calculated in such a way that they should each distribute 1/4 of the tokens over the course of the year, provided they are played continuously. The game distribution may diverge over time as players tend to favor one game over the others (this assumes 2M mined blocks a year).


_Note: The winning tokens for each game are distributed upon the transaction following the winning transaction. The creator will receive 1% of tokens awarded to players for ongoing development support._

## The Games

_Note: No ETH should ever be sent to any of these games. All the games are played based on gas price of current balance in your account. If you are sending ETH to the contract, you are not playing correctly and the transaction you send will not be successful._


**Lowest Gas Price per Block - 0.125 GTT/reward**: The user who pays the _lowest_ gasPrice in a block for a transaction to this contract wins the tokens. You are not only playing against other players, but with miners who may or may not include your transaction at such a low cost. If multiple transactions with the same gasPrice are included in a single block, the winner will be the user's transaction that is chosen _last_ by miners.


**Consecutive Blocks - 1.25 GTT/reward**:  The reward for this game goes to the last player to have a transaction processed on this contract _with no other successful transactions sent to this contract in the following block_. These battles can go on for blocks at a time before a winner is chosen.
<br /><br />
**Current King - 0.1 GTT/reward**: The owner of the last successful transaction to this contract will receive a reward for each block that is processed. These rewards end when a new player submits a successful transaction to the contract.
<br /><br />
**Auction - 6.25 GTT/reward**: Players participate in a bidding fee auction auction that lasts 50 blocks. Auctions are only started by sending in the first transaction after the expiration of the last auction. Your bid is the current amount of ETH you are holding in your calling wallet. Should you wait to the last minute and your transaction may not be mined. Go tot early and you will reveal your bid. _Note: You bid with all of the ETH you are holding. This does NOT send the ETH to the contract. Instead, the contract queries your wallet balance. You do not ever need to move your funds._

## Inspiration

This website and these contracts were inspired by <a href="https://twitter.com/soundmoneycoin/">SoundMoneyCoin</a> and the intellectual spirit of the Ethereum Community.

## Suggestions

All suggestions are welcome. Submit any items of concern to gametheorycoin@protonmail.com.