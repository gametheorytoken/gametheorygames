![knight](https://github.com/gametheorycoin/gametheorygames/blob/master/client/static/knight.png)

<h1 align="center">
  Game Theory Games
</h1>

![gameboard](https://github.com/gametheorycoin/gametheorygames/blob/master/client/static/gameboard.png)

## How It Works
Game Theory Tokens (GTT) are rare ERC20 tokens that reward you for outsmarting your oponents in various scenarios. Play the games above to prove yourself and win Game Theory Tokens.

**The tokens are only created and distributed through these four games. There is no owner and no way to create tokens, other than winning these games. There is no premine and there will only ever be a finite number available.**

The games will distribute tokens for approximately one year, at which point all of the tokens will be minted and no more will ever be created. The token code is publicly avaialble and the previous sentence can be verified by anyone.


There will only ever be 1 million GTT created. The rewards for each game have been calculated in such a way that they should each distribute 1/4 of the tokens over the course of the year, provided they are played continuously. The game distribution may diverge over time as players tend to favor one game over the others (this assumes 2M mined blocks a year).


_Note: The winning tokens for each game are distributed upon the transaction following the winning transaction. The creator will recieve 1% of tokens awarded to players for ongoing development support._

## The Games
**Lowest Gas Price per Block - 0.125 GTT/reward**: The user who pays the _lowest_ gasPrice in a block for a transaction to this contract wins the tokens. You are not only playing against other players, but with miners who may or may not include your transaction at such a low cost. If multiple transactions with the same gasPrice are included in a single block, the winner will be the user's transaction that is chosen _last_ by miners.


**Last Block Without a Tx - 1.25 GTT/reward**:  The reward for this game goes to the last player to have a transaction processed on this contract _with no other successful transactions sent to this contract in the following block_. These battles can go on for blocks at a time before a winner is chosen.
<br /><br />
**Current King - 0.1 GTT/reward**: The owner of the last successful transaction to this contract will recieve a reward for each block that is processed that nobody else has a successful transaction to.
<br /><br />
**Auction - 6.25 GTT/reward**: Players participate in a bidding fee auction auction that lasts 50 blocks. Auctions are only started by sending in a first bid. Should you wait to the last minute and your transaction may not be mined. Go to early and you will reveal your bid.

## Inspiration

This website and these contracts were inspired by <a href="https://twitter.com/soundmoneycoin/">SoundMoneyCoin</a> and the intellectual spirit of the Ethereum Community.
