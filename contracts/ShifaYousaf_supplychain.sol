// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ShifaYousaf_supplychain {

    address public admin;

    constructor() {
        admin = msg.sender;
    }

    enum Role { None, Manufacturer, Distributor, Retailer, Customer }
    enum Status { Manufactured, InTransit, Delivered }

    struct Product {
        uint id;
        string name;
        string description;
        address currentOwner;
        Status status;
    }

    struct History {
        address owner;
        Status status;
        uint timestamp;
    }

    uint public productCount;

    mapping(address => Role) public roles;
    mapping(uint => Product) public products;
    mapping(uint => History[]) public productHistory;

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin");
        _;
    }

    function assignRole(address user, Role role) external onlyAdmin {
        roles[user] = role;
    }

    function registerProduct(string calldata _name, string calldata _desc) external {
        require(roles[msg.sender] == Role.Manufacturer, "Not Manufacturer");

        unchecked { productCount++; }

        products[productCount] = Product(
            productCount,
            _name,
            _desc,
            msg.sender,
            Status.Manufactured
        );

        productHistory[productCount].push(
            History(msg.sender, Status.Manufactured, block.timestamp)
        );
    }

    function transferProduct(uint _id, address _to) external {
        Product storage p = products[_id];
        require(msg.sender == p.currentOwner, "Not owner");

        p.currentOwner = _to;
        p.status = Status.InTransit;

        productHistory[_id].push(
            History(_to, Status.InTransit, block.timestamp)
        );
    }

    function markDelivered(uint _id) external {
        Product storage p = products[_id];
        require(msg.sender == p.currentOwner, "Not owner");

        p.status = Status.Delivered;

        productHistory[_id].push(
            History(msg.sender, Status.Delivered, block.timestamp)
        );
    }

    function getHistory(uint _id) external view returns (History[] memory) {
        return productHistory[_id];
    }
}