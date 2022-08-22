pragma solidity =0.6.6;

import "./UniswapV2Router02.sol";

interface IStakingReward {
    function stake(uint256 amount, address staker) external;
    function quickswapRouterExit(address staker,  address pair) external;
    function stakingToken() external returns(address);
}

// constructor(address _factory, address _WETH)
contract QuickswapV1Router01 is UniswapV2Router02(0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32, 0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270) {
     function addLiquidityAndStake(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline,
        address rewardPool
    ) external ensure(deadline) returns (uint amountA, uint amountB, uint liquidity) {
        (amountA, amountB) = _addLiquidity(tokenA, tokenB, amountADesired, amountBDesired, amountAMin, amountBMin);
        address pair = UniswapV2Library.pairFor(factory, tokenA, tokenB);
        require(pair == IStakingReward(rewardPool).stakingToken(), "Pair is not staking token");
        TransferHelper.safeTransferFrom(tokenA, msg.sender, pair, amountA);
        TransferHelper.safeTransferFrom(tokenB, msg.sender, pair, amountB);
        liquidity = IUniswapV2Pair(pair).mint(address(this));
        if(IUniswapV2Pair(pair).allowance(address(this), rewardPool) < liquidity) {
            IUniswapV2Pair(pair).approve(rewardPool, uint256(-1));
        }
        IStakingReward(rewardPool).stake(liquidity, to);
    }

    function addLiquidityETHAndStake(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        address rewardPool
    ) external payable ensure(deadline) returns (uint amountToken, uint amountETH, uint liquidity) {
        (amountToken, amountETH) = _addLiquidity(
            token,
            WETH,
            amountTokenDesired,
            msg.value,
            amountTokenMin,
            amountETHMin
        );
        address pair = UniswapV2Library.pairFor(factory, token, WETH);
        require(pair == IStakingReward(rewardPool).stakingToken(), "Pair is not staking token");
        TransferHelper.safeTransferFrom(token, msg.sender, pair, amountToken);
        IWETH(WETH).deposit{value: amountETH}();
        assert(IWETH(WETH).transfer(pair, amountETH));
        liquidity = IUniswapV2Pair(pair).mint(address(this));
        // refund dust eth, if any
        if (msg.value > amountETH) TransferHelper.safeTransferETH(msg.sender, msg.value - amountETH);
        if(IUniswapV2Pair(pair).allowance(address(this), rewardPool) < liquidity) {
            IUniswapV2Pair(pair).approve(rewardPool, uint256(-1));
        }
        IStakingReward(rewardPool).stake(liquidity, to);
    }

    function unstakeAndRemoveLiquidity(
        address tokenA,
        address tokenB,        
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline,
        address rewardPool
    ) public ensure(deadline) returns (uint amountA, uint amountB) {        
        address pair = UniswapV2Library.pairFor(factory, tokenA, tokenB);
        require(pair == IStakingReward(rewardPool).stakingToken(), "Pair is not staking token");
        // IUniswapV2Pair(pair).transferFrom(msg.sender, pair, liquidity); // send liquidity to pair
        IStakingReward(rewardPool).quickswapRouterExit(msg.sender, pair);
        (uint amount0, uint amount1) = IUniswapV2Pair(pair).burn(to);
        (address token0,) = UniswapV2Library.sortTokens(tokenA, tokenB);
        (amountA, amountB) = tokenA == token0 ? (amount0, amount1) : (amount1, amount0);
        require(amountA >= amountAMin, 'UniswapV2Router: INSUFFICIENT_A_AMOUNT');
        require(amountB >= amountBMin, 'UniswapV2Router: INSUFFICIENT_B_AMOUNT');
    }

    function unstakeAndRemoveLiquidityETH(
        address token,        
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        address rewardPool
    ) external ensure(deadline) returns (uint amountToken, uint amountETH) {
        (amountToken, amountETH) = unstakeAndRemoveLiquidity(
            token,
            WETH,            
            amountTokenMin,
            amountETHMin,
            address(this),
            deadline,
            rewardPool
        );
        TransferHelper.safeTransfer(token, to, amountToken);
        IWETH(WETH).withdraw(amountETH);
        TransferHelper.safeTransferETH(to, amountETH);
    }     

    // **** REMOVE LIQUIDITY (supporting fee-on-transfer tokens) ****
    function unstakeAndRemoveLiquidityETHSupportingFeeOnTransferTokens(
        address token,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        address rewardPool
    ) external ensure(deadline) returns (uint amountETH) {
        (, amountETH) = unstakeAndRemoveLiquidity(
            token,
            WETH,            
            amountTokenMin,
            amountETHMin,
            address(this),
            deadline,
            rewardPool
        );
        TransferHelper.safeTransfer(token, to, IERC20(token).balanceOf(address(this)));
        IWETH(WETH).withdraw(amountETH);
        TransferHelper.safeTransferETH(to, amountETH);
    }
    
}