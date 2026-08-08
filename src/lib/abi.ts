export const NEGOSIASI_ARENA_ABI = [
  {
    type: 'function',
    name: 'createAuction',
    inputs: [
      { name: 'itemHash', type: 'bytes32' },
      { name: 'budgetCap', type: 'uint256' },
      { name: 'biddingDuration', type: 'uint64' },
    ],
    outputs: [{ name: 'auctionId', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'submitBid',
    inputs: [
      { name: 'auctionId', type: 'uint256' },
      { name: 'price', type: 'uint256' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'settle',
    inputs: [{ name: 'auctionId', type: 'uint256' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'nextAuctionId',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'auctions',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [
      { name: 'buyer', type: 'address' },
      { name: 'itemHash', type: 'bytes32' },
      { name: 'budgetCap', type: 'uint256' },
      { name: 'deadline', type: 'uint64' },
      { name: 'phase', type: 'uint8' },
      { name: 'winningAgent', type: 'address' },
      { name: 'winningBid', type: 'uint256' },
      { name: 'bidCount', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'bidOf',
    inputs: [
      { name: '', type: 'uint256' },
      { name: '', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'agentWins',
    inputs: [{ name: '', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getAuction',
    inputs: [{ name: 'auctionId', type: 'uint256' }],
    outputs: [
      { name: 'buyer', type: 'address' },
      { name: 'budgetCap', type: 'uint256' },
      { name: 'deadline', type: 'uint64' },
      { name: 'phase', type: 'uint8' },
      { name: 'winningAgent', type: 'address' },
      { name: 'winningBid', type: 'uint256' },
      { name: 'bidCount', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'AuctionCreated',
    inputs: [
      { name: 'auctionId', type: 'uint256', indexed: true },
      { name: 'buyer', type: 'address', indexed: true },
      { name: 'itemHash', type: 'bytes32', indexed: false },
      { name: 'budgetCap', type: 'uint256', indexed: false },
      { name: 'deadline', type: 'uint64', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'BidSubmitted',
    inputs: [
      { name: 'auctionId', type: 'uint256', indexed: true },
      { name: 'agent', type: 'address', indexed: true },
      { name: 'price', type: 'uint256', indexed: false },
      { name: 'isNewLowest', type: 'bool', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'AuctionSettled',
    inputs: [
      { name: 'auctionId', type: 'uint256', indexed: true },
      { name: 'winningAgent', type: 'address', indexed: true },
      { name: 'winningBid', type: 'uint256', indexed: false },
      { name: 'savingsReturned', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'AuctionFailed',
    inputs: [
      { name: 'auctionId', type: 'uint256', indexed: true },
      { name: 'refundAmount', type: 'uint256', indexed: false },
    ],
  },
] as const;

export const ERC20_ABI = [
  {
    type: 'function',
    name: 'approve',
    inputs: [
      { name: 'spender', type: 'address' },
      { name: 'value', type: 'uint256' },
    ],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'allowance',
    inputs: [
      { name: 'owner', type: 'address' },
      { name: 'spender', type: 'address' },
    ],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'balanceOf',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
] as const;
