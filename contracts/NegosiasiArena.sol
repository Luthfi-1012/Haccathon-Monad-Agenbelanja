// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title NegosiasiArena — On-chain reverse auction arena untuk AgenBelanja (Monad)
/// @notice Budget buyer di-escrow, para agen vendor mengirim bid, pemenang
///         dibayar & sisa hemat dikembalikan ke buyer secara ATOMIK.
///         Korelasi PRD AgenBelanja v0.2:
///         - AGN-8  : bid > budget REVERT on-chain (trustless budget guard)
///         - AGN-2  : bid dari banyak agen diproses paralel oleh Monad
///         - AGN-10 : pemilihan pemenang termurah dilakukan contract
///         - Bab 2  : setiap bid = event immutable (transparansi keputusan)

interface IERC20Minimal {
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function transfer(address to, uint256 value) external returns (bool);
}

contract NegosiasiArena {
    enum Phase {
        NONE,
        OPEN,
        SETTLED,
        FAILED
    }

    struct Auction {
        address buyer;
        bytes32 itemHash;
        uint256 budgetCap;
        uint64 deadline;
        Phase phase;
        address winningAgent;
        uint256 winningBid;
        uint256 bidCount;
    }

    IERC20Minimal public immutable usdc;

    uint256 public nextAuctionId;
    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => mapping(address => uint256)) public bidOf;
    mapping(address => uint256) public agentWins;

    event AuctionCreated(
        uint256 indexed auctionId,
        address indexed buyer,
        bytes32 itemHash,
        uint256 budgetCap,
        uint64 deadline
    );
    event BidSubmitted(
        uint256 indexed auctionId,
        address indexed agent,
        uint256 price,
        bool isNewLowest
    );
    event AuctionSettled(
        uint256 indexed auctionId,
        address indexed winningAgent,
        uint256 winningBid,
        uint256 savingsReturned
    );
    event AuctionFailed(uint256 indexed auctionId, uint256 refundAmount);

    error InvalidAuction();
    error NotOpen();
    error BiddingClosed();
    error BiddingStillOpen();
    error BidExceedsBudget();
    error BidNotLower();
    error AlreadyBid();
    error TransferFailed();

    constructor(address _usdc) {
        require(_usdc != address(0), "usdc=0");
        usdc = IERC20Minimal(_usdc);
    }

    function createAuction(
        bytes32 itemHash,
        uint256 budgetCap,
        uint64 biddingDuration
    ) external returns (uint256 auctionId) {
        if (budgetCap == 0 || biddingDuration < 30 seconds || biddingDuration > 1 hours) {
            revert InvalidAuction();
        }

        auctionId = nextAuctionId++;
        auctions[auctionId] = Auction({
            buyer: msg.sender,
            itemHash: itemHash,
            budgetCap: budgetCap,
            deadline: uint64(block.timestamp) + biddingDuration,
            phase: Phase.OPEN,
            winningAgent: address(0),
            winningBid: type(uint256).max,
            bidCount: 0
        });

        if (!usdc.transferFrom(msg.sender, address(this), budgetCap)) revert TransferFailed();

        emit AuctionCreated(auctionId, msg.sender, itemHash, budgetCap, auctions[auctionId].deadline);
    }

    function submitBid(uint256 auctionId, uint256 price) external {
        Auction storage a = auctions[auctionId];
        if (a.phase != Phase.OPEN) revert NotOpen();
        if (block.timestamp >= a.deadline) revert BiddingClosed();
        if (price == 0 || price > a.budgetCap) revert BidExceedsBudget();
        if (bidOf[auctionId][msg.sender] != 0) revert AlreadyBid();
        if (price >= a.winningBid) revert BidNotLower();

        bidOf[auctionId][msg.sender] = price;
        a.bidCount += 1;
        a.winningBid = price;
        a.winningAgent = msg.sender;

        emit BidSubmitted(auctionId, msg.sender, price, true);
    }

    function settle(uint256 auctionId) external {
        Auction storage a = auctions[auctionId];
        if (a.phase != Phase.OPEN) revert NotOpen();
        if (block.timestamp < a.deadline) revert BiddingStillOpen();

        if (a.bidCount == 0) {
            a.phase = Phase.FAILED;
            if (!usdc.transfer(a.buyer, a.budgetCap)) revert TransferFailed();
            emit AuctionFailed(auctionId, a.budgetCap);
            return;
        }

        a.phase = Phase.SETTLED;
        uint256 savings = a.budgetCap - a.winningBid;
        agentWins[a.winningAgent] += 1;

        if (!usdc.transfer(a.winningAgent, a.winningBid)) revert TransferFailed();
        if (savings > 0) {
            if (!usdc.transfer(a.buyer, savings)) revert TransferFailed();
        }

        emit AuctionSettled(auctionId, a.winningAgent, a.winningBid, savings);
    }

    function getAuction(
        uint256 auctionId
    )
        external
        view
        returns (
            address buyer,
            uint256 budgetCap,
            uint64 deadline,
            Phase phase,
            address winningAgent,
            uint256 winningBid,
            uint256 bidCount
        )
    {
        Auction storage a = auctions[auctionId];
        return (a.buyer, a.budgetCap, a.deadline, a.phase, a.winningAgent, a.winningBid, a.bidCount);
    }
}
