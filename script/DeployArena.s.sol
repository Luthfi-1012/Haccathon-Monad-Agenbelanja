// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console} from "forge-std/Script.sol";
import {NegosiasiArena} from "../contracts/NegosiasiArena.sol";

contract DeployArena is Script {
    function run() external {
        address usdc = vm.envAddress("USDC_ADDRESS");
        require(usdc != address(0), "USDC_ADDRESS not set");

        uint256 deployerKey = vm.envUint("DEPLOYER_PRIVATE_KEY");

        vm.startBroadcast(deployerKey);

        NegosiasiArena arena = new NegosiasiArena(usdc);
        console.log("NegosiasiArena deployed at:", address(arena));
        console.log("USDC address used:", usdc);

        vm.stopBroadcast();
    }
}
