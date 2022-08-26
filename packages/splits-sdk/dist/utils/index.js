"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var bignumber_1 = require("@ethersproject/bignumber");
var bytes_1 = require("@ethersproject/bytes");
var contracts_1 = require("@ethersproject/contracts");
var strings_1 = require("@ethersproject/strings");
var constants_1 = require("../constants");
var ierc20_1 = require("./ierc20");
var reverseRecords_1 = require("./reverseRecords");
exports.getRecipientSortedAddressesAndAllocations = function (recipients) {
    var accounts = [];
    var percentAllocations = [];
    recipients
        .sort(function (a, b) {
        if (a.address.toLowerCase() > b.address.toLowerCase())
            return 1;
        return -1;
    })
        .map(function (value) {
        accounts.push(value.address);
        percentAllocations.push(exports.getBigNumberValue(value.percentAllocation));
    });
    return [accounts, percentAllocations];
};
exports.getBigNumberValue = function (value) {
    return bignumber_1.BigNumber.from(Math.round(constants_1.PERCENTAGE_SCALE.toNumber() * value) / 100);
};
exports.fromBigNumberValue = function (value) {
    var numberVal = value instanceof bignumber_1.BigNumber ? value.toNumber() : value;
    return (numberVal * 100) / constants_1.PERCENTAGE_SCALE.toNumber();
};
exports.getTransactionEvent = function (transaction, eventSignature) { return __awaiter(void 0, void 0, void 0, function () {
    var receipt, event_1;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, transaction.wait()];
            case 1:
                receipt = _b.sent();
                if (receipt.status === 1) {
                    event_1 = (_a = receipt.events) === null || _a === void 0 ? void 0 : _a.filter(function (e) { return e.eventSignature === eventSignature; })[0];
                    return [2 /*return*/, event_1];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.fetchERC20TransferredTokens = function (chainId, provider, splitId) { return __awaiter(void 0, void 0, void 0, function () {
    var tokens, transferLogs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                tokens = new Set([]);
                return [4 /*yield*/, provider.getLogs({
                        topics: [
                            ierc20_1.ierc20Interface.getEventTopic('Transfer'),
                            null,
                            bytes_1.hexZeroPad(splitId, 32),
                        ],
                        fromBlock: constants_1.CHAIN_INFO[chainId].startBlock,
                        toBlock: 'latest',
                    })];
            case 1:
                transferLogs = _a.sent();
                transferLogs.map(function (log) {
                    var erc20Address = log.address;
                    tokens.add(erc20Address);
                });
                return [2 /*return*/, Array.from(tokens)];
        }
    });
}); };
exports.addEnsNames = function (provider, recipients) { return __awaiter(void 0, void 0, void 0, function () {
    var reverseRecords, addresses, allNames;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                reverseRecords = new contracts_1.Contract(constants_1.REVERSE_RECORDS_ADDRESS, reverseRecords_1.reverseRecordsInterface, provider);
                addresses = recipients.map(function (recipient) { return recipient.address; });
                return [4 /*yield*/, reverseRecords.getNames(addresses)];
            case 1:
                allNames = _a.sent();
                allNames.map(function (ens, index) {
                    if (ens && strings_1.nameprep(ens)) {
                        recipients[index].ensName = ens;
                    }
                });
                return [2 /*return*/];
        }
    });
}); };
//# sourceMappingURL=index.js.map