#!/usr/bin/env node

process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";
const config = require('config');
const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const pkg = require('../package.json');
var Wallet = require('trip-wallet');

var wallet = Wallet();
//var address = '0x3228f93390612218a7d55503a3bdd46c4fbd1fd3'
var address = '0xb02d5da39628918daa9545388f1abb60be368e0a';
// var provider = 'http://192.168.1.41:8545';
//var provider = 'https://mainnet.infura.io/9WfBzi6QFGrAWBYZKq57';
var provider = 'https://rinkeby.infura.io';

// TODO: let address & provider config

wallet.setProvider(provider);

program
    .version(pkg.version, '-v, --version')

// get config
program
    .command('config')
    .action(() => {
        console.log(config);
        // var dbConfig = config.get('Customer.dbConfig');
        // console.log(dbConfig);
        //var cfg = config.get('wallet');
        //console.log(cfg.get('wallet.'));
    });

// reate wallet
program
    .command('generate')
    .alias('g')
    .action(function () {
        wallet.generate();

        console.log('privateKey: %s', wallet.privateKey);
        console.log('publicKey: %s', wallet.publicKey);
        console.log('address: %s', wallet.address);
    });

// create a wallet based on a raw private key
program
    .command('import <privateKey>')
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
        // set config

        console.log('set provider success');
    });

program
    .command('switchProvider')
    .action(() => {
        inquirer.prompt([{
            type: 'list',
            name: 'network',
            message: 'please select network',
            choices: [{ 
                name: 'Main',
                value: 'https://mainnet.infura.io/9WfBzi6QFGrAWBYZKq57'
            }, {
                name: 'Rinkeby Test',
                value: 'https://rinkeby.infura.io'
            }, {
                name: 'Test',
                value: 'http://192.168.1.41:8545'
            }, { 
                name: 'Localhost',
                value: 'http://localhost:8545'
            }]
        }]).then(answers => {
            wallet.setProvider(answers.network);
            // set config
            console.log('current network: %s', answers.network);
        });
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

        console.log('waiting...');
        wallet.getTokenBalance(addr, '0x8b40761142b9aa6dc8964e61d0585995425c3d94').then((res) => {
            console.log('address: %s trip balance: %s', addr, res)
        }).catch((err) => {
            console.log(err);
        });

    });

program
    .command('getTokenBalance <tokenAddress>')
    .option('-a, --address <address>', 'wallet address')
    .action(function (tokenAddress, options) {
        let addr = options.address ? options.address : address;

        if (!addr) {
            console.log('please set your wallet address');
            return;
        }

        console.log('waiting...');
        wallet.getTokenBalance(addr, tokenAddress).then((res) => {
            console.log('address: %s token balance: %s', addr, res)
        }).catch((err) => {
            console.log(err);
        });

    });

// get the balance of an address
program
    .command('getBalance')
    .alias('b')
    .option('-a, --address <address>', 'wallet address')
    .action(function (options) {
        let addr = options.address ? options.address : address;

        console.log('waiting...');
        wallet.getBalance(addr).then((res) => {
            console.log('address: %s balance: %s', addr, res)
        }).catch((err) => {
            console.log(err);
        });

    });

// get a transaction of transaction hash
program
    .command('getTransaction <transactionHash>')
    .alias('tx')
    .action(function (transactionHash) {
        console.log('waiting...');
        wallet.getTransaction(transactionHash).then((res) => {
            console.log(res);
        }).catch((err) => {
            console.log(err);
        });
    });

// send a transaction to the network
program
    .command('sendTransaction')
    .alias('send')
    .action(function () {
        console.log('sending...');
        console.log('sorry! this function is not complete');
    });

program.parse(process.argv);

if (!program.args.length) program.help();