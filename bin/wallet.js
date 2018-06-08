#!/usr/bin/env node

const Config = require('configstore');
const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');
const pkg = require('../package.json');
var Wallet = require('trip-wallet');

var config = new Config(pkg.name, {
    address: '',
    provider: 'https://mainnet.infura.io/9WfBzi6QFGrAWBYZKq57'
});

var wallet = Wallet();
//var address = '0x3228f93390612218a7d55503a3bdd46c4fbd1fd3'
//var address = '0xb02d5da39628918daa9545388f1abb60be368e0a';

wallet.setProvider(config.get('provider'));

program
    .version(pkg.version, '-v, --version')
    .command('install [name]', 'install one or more packages').alias('i')

program
    .command('config [key] [value]')
    .description('configuration')
    .option('-l, --list')
    .action((key, value) => {
        
        if (key && !value) {
            console.log(config.get(key))
        }
        else if(key && value) {
            if (key == 'address' || key == 'provider') {
                config.set(key, value);
                console.log(config.get(key))
            }
            else {
                console.log('this configuration is not supported');
            }
        }
        else {
            console.log('provider: %s', config.get('provider'));
            console.log('address: %s', config.get('address'));
        }
    });

program
    .command('generate')
    .alias('g')
    .description('reate wallet')
    .action(() => {
        wallet.generate();

        console.log('privateKey: %s', wallet.privateKey);
        console.log('publicKey: %s', wallet.publicKey);
        console.log('address: %s', wallet.address);
    });

program
    .command('import <privateKey>')
    .alias('i')
    .description('create a wallet based on a raw private key')
    .action((privateKey) => {
        wallet.import(privateKey);

        console.log('privateKey: %s', wallet.privateKey);
        console.log('publicKey: %s', wallet.publicKey);
        console.log('address: %s', wallet.address);
    });

program
    .command('setProvider <host>')
    .action((host) => {
        wallet.setProvider(host);
        // set config
        config.set('provider', host);
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
            config.set('provider', answers.network);
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
    .action((tokenAddress, options) => {
        let addr = options.address ? options.address : config.get('address');

        if (!addr) {
            return console.log('please set your wallet address');
        }

        console.log('waiting...');
        wallet.getTokenBalance(addr, tokenAddress).then((res) => {
            console.log('address: %s token balance: %s', addr, res)
        }).catch((err) => {
            console.log(err);
        });

    });

program
    .command('getBalance')
    .alias('b')
    .description('get the balance of an address')
    .option('-a, --address <address>', 'wallet address')
    .action((options) => {
        let addr = options.address ? options.address : config.get('address');

        if (!addr) {
            return console.log('please set your wallet address');
        }

        console.log('waiting...');
        wallet.getBalance(addr).then((res) => {
            console.log('address: %s balance: %s', addr, res)
        }).catch((err) => {
            console.log(err);
        });

    });

program
    .command('getTransaction <transactionHash>')
    .alias('tx')
    .description('get a transaction of transaction hash')
    .action((transactionHash) => {
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
    .action(() => {
        console.log('sending...');
        console.log('sorry! this function is not complete');
    });

program.parse(process.argv);

if (!program.args.length) program.help();