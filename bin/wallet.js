#!/usr/bin/env node

const program = require('commander');
const chalk = require('chalk');
var Wallet = require('trip-wallet');

var wallet = Wallet();
//var address = '0x3228f93390612218a7d55503a3bdd46c4fbd1fd3'
var address = '0xb02d5da39628918daa9545388f1abb60be368e0a';
// var provider = 'http://192.168.1.41:8545';
var provider = 'https://mainnet.infura.io/9WfBzi6QFGrAWBYZKq57';

// TODO: let address & provider config

wallet.setProvider(provider);

program
    .version('0.1.0', '-v, --version')

program
    .command('generate', 'create wallet')
    .alias('g')
    .action(function () {
        wallet.generate();

        console.log('privateKey: %s', wallet.privateKey);
        console.log('publicKey: %s', wallet.publicKey);
        console.log('address: %s', wallet.address);
    });

program
    .command('import <privateKey>', 'create a wallet based on a raw private key')
    .alias('i')
    .action(function (privateKey) {
        wallet.import(privateKey);

        console.log('privateKey: %s', wallet.privateKey);
        console.log('publicKey: %s', wallet.publicKey);
        console.log('address: %s', wallet.address);
    });

program
    .command('setProvider <host>')
    .action(function (host) {
        wallet.setProvider(host);
        
        console.log('set provider success');
    });

program
    .command('getTrioBalance')
    .option('-a, --address <address>', 'wallet address')
    .action(function (options) {
        let addr = options.address ? options.address : address;

        if (!addr) {
            console.log('please set your wallet address');
            return;
        }

        console.log('loading..');
        wallet.getTokenBalance(addr, '0x8b40761142b9aa6dc8964e61d0585995425c3d94').then(function (res, err) {
            console.log('address: %s trip balance: %s', addr, res)
        });

    });

program
    .command('getTokenBalance <tokenAddress>')
    .option('-a, --address <address>', 'Wallet address')
    .action(function (tokenAddress, options) {
        let addr = options.address ? options.address : address;

        if (!addr) {
            console.log('please set your wallet address');
            return;
        }

        console.log('loading..');
        wallet.getTokenBalance(addr, tokenAddress).then(function (res, err) {
            console.log('address: %s token balance: %s', addr, res)
        });

    });

program
    .command('getBalance', 'get the balance of an address')
    .alias('b')
    .option('-a, --address <address>', 'Wallet address')
    .action(function (options) {
        let addr = options.address ? options.address : address;
        
        console.log('loading..');
        wallet.getBalance(addr).then(function(res, err) {
            console.log('address: %s balance: %s', addr, res)
        });
        
    });

program
    .command('getTransaction <transactionHash>', 'get a transaction of transaction hash')
    .alias('t')
    .action(function (transactionHash) {
        console.log('loading..');
        wallet.getTransaction(transactionHash).then(function (res, err) {
            console.log(res);
        });

    });

program
    .command('sendTransaction', 'send a transaction to the network')
    .alias('s')
    .action(function () {
        console.log('sorry! this function is not complete');
    });

program.parse(process.argv);

if (!program.args.length) program.help();