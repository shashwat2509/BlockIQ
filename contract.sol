// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract blockchainQuiz {
    IERC20 public memeToken;
    address public owner;

    mapping(address => uint256) public scores;
    mapping(address => bool) public gameInProgress;

    uint256 public constant ENTRY_FEE = 10 * 10**18;
    uint256 public constant REWARD_PER_CORRECT = 1 * 10**18;  // Reward for each correct answer
    uint256 public constant PENALTY_PER_WRONG = 0.1 * 10**18; // Penalty for each wrong answer

    event GameStarted(address indexed player);
    event GameEnded(address indexed player, uint256 score);

    constructor(address _memeToken) {
        memeToken = IERC20(_memeToken);
        owner = msg.sender;
    }

    function startGame() external {
        require(!gameInProgress[msg.sender], "Game already started");
        require(memeToken.balanceOf(msg.sender) >= ENTRY_FEE, "Insufficient tokens to start");
        require(memeToken.allowance(msg.sender, address(this)) >= ENTRY_FEE, "Approve tokens first");

        // Deduct the entry fee
        memeToken.transferFrom(msg.sender, address(this), ENTRY_FEE);
        scores[msg.sender] = 0;
        gameInProgress[msg.sender] = true;

        emit GameStarted(msg.sender);
    }

    function submitAnswer(bool isCorrect, bool isSkipped) external {
        require(gameInProgress[msg.sender], "Game not started");

        if (isSkipped) {
            // No token adjustment for skipping
            return;
        }

        if (isCorrect) {
            scores[msg.sender] += 1;

            // Reward for each correct answer
            memeToken.transfer(msg.sender, REWARD_PER_CORRECT);
        } else {
            // Penalize for wrong answers
            memeToken.transferFrom(msg.sender, address(this), PENALTY_PER_WRONG);
        }
    }

    function endGame() external {
        require(gameInProgress[msg.sender], "No game in progress");

        emit GameEnded(msg.sender, scores[msg.sender]);
        gameInProgress[msg.sender] = false;
        delete scores[msg.sender];
    }
}
