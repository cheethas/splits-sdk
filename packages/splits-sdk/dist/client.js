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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var abi_1 = require("@ethersproject/abi");
var address_1 = require("@ethersproject/address");
var constants_1 = require("@ethersproject/constants");
var contracts_1 = require("@ethersproject/contracts");
var SplitMain_json_1 = __importDefault(require("./artifacts/contracts/SplitMain/ethereum/SplitMain.json"));
var SplitMain_json_2 = __importDefault(require("./artifacts/contracts/SplitMain/polygon/SplitMain.json"));
var constants_2 = require("./constants");
var errors_1 = require("./errors");
var subgraph_1 = require("./subgraph");
var utils_1 = require("./utils");
var validation_1 = require("./utils/validation");
var MISSING_SIGNER = '';
var SPLIT_MAIN_ABI_ETHEREUM = SplitMain_json_1.default.abi;
var splitMainInterfaceEthereum = new abi_1.Interface(SPLIT_MAIN_ABI_ETHEREUM);
var SPLIT_MAIN_ABI_POLYGON = SplitMain_json_2.default.abi;
var splitMainInterfacePolygon = new abi_1.Interface(SPLIT_MAIN_ABI_POLYGON);
var SplitsClient = /** @class */ (function () {
    function SplitsClient(_a) {
        var chainId = _a.chainId, provider = _a.provider, signer = _a.signer, _b = _a.includeEnsNames, includeEnsNames = _b === void 0 ? false : _b;
        if (includeEnsNames && !provider)
            throw new errors_1.InvalidConfigError('Must include a provider if includeEnsNames is set to true');
        if (constants_2.ETHEREUM_CHAIN_IDS.includes(chainId))
            this._splitMain = new contracts_1.Contract(constants_2.SPLIT_MAIN_ADDRESS, splitMainInterfaceEthereum, provider);
        else if (constants_2.POLYGON_CHAIN_IDS.includes(chainId))
            this._splitMain = new contracts_1.Contract(constants_2.SPLIT_MAIN_ADDRESS, splitMainInterfacePolygon, provider);
        else
            throw new errors_1.UnsupportedChainIdError(chainId);
        this._chainId = chainId;
        this._signer = signer !== null && signer !== void 0 ? signer : MISSING_SIGNER;
        this._graphqlClient = subgraph_1.getGraphqlClient(chainId);
        this._includeEnsNames = includeEnsNames;
    }
    // Write actions
    SplitsClient.prototype.createSplit = function (_a) {
        var recipients = _a.recipients, distributorFeePercent = _a.distributorFeePercent, _b = _a.controller, controller = _b === void 0 ? constants_1.AddressZero : _b;
        return __awaiter(this, void 0, void 0, function () {
            var _c, accounts, percentAllocations, distributorFee, createSplitTx, event;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        validation_1.validateRecipients(recipients);
                        validation_1.validateDistributorFeePercent(distributorFeePercent);
                        this._requireSigner();
                        _c = utils_1.getRecipientSortedAddressesAndAllocations(recipients), accounts = _c[0], percentAllocations = _c[1];
                        distributorFee = utils_1.getBigNumberValue(distributorFeePercent);
                        return [4 /*yield*/, this._splitMain
                                .connect(this._signer)
                                .createSplit(accounts, percentAllocations, distributorFee, controller)];
                    case 1:
                        createSplitTx = _d.sent();
                        return [4 /*yield*/, utils_1.getTransactionEvent(createSplitTx, this._splitMain.interface.getEvent('CreateSplit').format())];
                    case 2:
                        event = _d.sent();
                        if (event && event.args)
                            return [2 /*return*/, {
                                    splitId: event.args.split,
                                    event: event,
                                }];
                        throw new errors_1.TransactionFailedError();
                }
            });
        });
    };
    SplitsClient.prototype.estimateSplitDeploymentCost = function (_a) {
        var recipients = _a.recipients, distributorFeePercent = _a.distributorFeePercent, _b = _a.controller, controller = _b === void 0 ? constants_1.AddressZero : _b;
        return __awaiter(this, void 0, void 0, function () {
            var _c, accounts, percentAllocations, distributorFee, _d, gasEstimation, feeRate, _e, _f, _g;
            return __generator(this, function (_h) {
                switch (_h.label) {
                    case 0:
                        validation_1.validateRecipients(recipients);
                        validation_1.validateDistributorFeePercent(distributorFeePercent);
                        if (!this._splitMain.provider)
                            throw new errors_1.MissingProviderError('Provider required to get split active balances. Please update your call to the SplitsClient constructor with a valid provider, or set includeActiveBalances to false');
                        _c = utils_1.getRecipientSortedAddressesAndAllocations(recipients), accounts = _c[0], percentAllocations = _c[1];
                        distributorFee = utils_1.getBigNumberValue(distributorFeePercent);
                        _f = (_e = Promise).all;
                        return [4 /*yield*/, this._splitMain.estimateGas.createSplit(accounts, percentAllocations, distributorFee, controller)];
                    case 1:
                        _g = [
                            _h.sent()
                        ];
                        return [4 /*yield*/, this._splitMain.provider.getFeeData()];
                    case 2: return [4 /*yield*/, _f.apply(_e, [_g.concat([
                                _h.sent()
                            ])])];
                    case 3:
                        _d = _h.sent(), gasEstimation = _d[0], feeRate = _d[1];
                        if (gasEstimation && feeRate && feeRate.gasPrice) {
                            return [2 /*return*/, gasEstimation.mul(feeRate.gasPrice)];
                        }
                        throw new errors_1.FailedToEstimateGasError();
                }
            });
        });
    };
    SplitsClient.prototype.updateSplit = function (_a) {
        var splitId = _a.splitId, recipients = _a.recipients, distributorFeePercent = _a.distributorFeePercent;
        return __awaiter(this, void 0, void 0, function () {
            var _b, accounts, percentAllocations, distributorFee, updateSplitTx, event;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        validation_1.validateAddress(splitId);
                        validation_1.validateRecipients(recipients);
                        validation_1.validateDistributorFeePercent(distributorFeePercent);
                        this._requireSigner();
                        return [4 /*yield*/, this._requireController(splitId)];
                    case 1:
                        _c.sent();
                        _b = utils_1.getRecipientSortedAddressesAndAllocations(recipients), accounts = _b[0], percentAllocations = _b[1];
                        distributorFee = utils_1.getBigNumberValue(distributorFeePercent);
                        return [4 /*yield*/, this._splitMain
                                .connect(this._signer)
                                .updateSplit(splitId, accounts, percentAllocations, distributorFee)];
                    case 2:
                        updateSplitTx = _c.sent();
                        return [4 /*yield*/, utils_1.getTransactionEvent(updateSplitTx, this._splitMain.interface.getEvent('UpdateSplit').format())];
                    case 3:
                        event = _c.sent();
                        if (event)
                            return [2 /*return*/, { event: event }];
                        throw new errors_1.TransactionFailedError();
                }
            });
        });
    };
    SplitsClient.prototype.distributeToken = function (_a) {
        var splitId = _a.splitId, token = _a.token, distributorAddress = _a.distributorAddress;
        return __awaiter(this, void 0, void 0, function () {
            var distributorPayoutAddress, _b, _c, recipients, distributorFeePercent, _d, accounts, percentAllocations, distributorFee, distributeTokenTx, eventSignature, event;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        validation_1.validateAddress(splitId);
                        validation_1.validateAddress(token);
                        this._requireSigner();
                        // TODO: how to remove this, needed for typescript check right now
                        if (!this._signer)
                            throw new Error();
                        if (!distributorAddress) return [3 /*break*/, 1];
                        _b = distributorAddress;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this._signer.getAddress()];
                    case 2:
                        _b = _e.sent();
                        _e.label = 3;
                    case 3:
                        distributorPayoutAddress = _b;
                        validation_1.validateAddress(distributorPayoutAddress);
                        return [4 /*yield*/, this.getSplitMetadata({
                                splitId: splitId,
                            })];
                    case 4:
                        _c = _e.sent(), recipients = _c.recipients, distributorFeePercent = _c.distributorFeePercent;
                        _d = utils_1.getRecipientSortedAddressesAndAllocations(recipients), accounts = _d[0], percentAllocations = _d[1];
                        distributorFee = utils_1.getBigNumberValue(distributorFeePercent);
                        return [4 /*yield*/, (token === constants_1.AddressZero
                                ? this._splitMain
                                    .connect(this._signer)
                                    .distributeETH(splitId, accounts, percentAllocations, distributorFee, distributorPayoutAddress)
                                : this._splitMain
                                    .connect(this._signer)
                                    .distributeERC20(splitId, token, accounts, percentAllocations, distributorFee, distributorPayoutAddress))];
                    case 5:
                        distributeTokenTx = _e.sent();
                        eventSignature = token === constants_1.AddressZero
                            ? this._splitMain.interface.getEvent('DistributeETH').format()
                            : this._splitMain.interface.getEvent('DistributeERC20').format();
                        return [4 /*yield*/, utils_1.getTransactionEvent(distributeTokenTx, eventSignature)];
                    case 6:
                        event = _e.sent();
                        if (event)
                            return [2 /*return*/, { event: event }];
                        throw new errors_1.TransactionFailedError();
                }
            });
        });
    };
    SplitsClient.prototype.updateSplitAndDistributeToken = function (_a) {
        var splitId = _a.splitId, token = _a.token, recipients = _a.recipients, distributorFeePercent = _a.distributorFeePercent, distributorAddress = _a.distributorAddress;
        return __awaiter(this, void 0, void 0, function () {
            var _b, accounts, percentAllocations, distributorFee, distributorPayoutAddress, _c, updateAndDistributeTx, eventSignature, event;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        validation_1.validateAddress(splitId);
                        validation_1.validateAddress(token);
                        validation_1.validateRecipients(recipients);
                        validation_1.validateDistributorFeePercent(distributorFeePercent);
                        this._requireSigner();
                        return [4 /*yield*/, this._requireController(splitId)
                            // TODO: how to remove this, needed for typescript check right now
                        ];
                    case 1:
                        _d.sent();
                        // TODO: how to remove this, needed for typescript check right now
                        if (!this._signer)
                            throw new Error();
                        _b = utils_1.getRecipientSortedAddressesAndAllocations(recipients), accounts = _b[0], percentAllocations = _b[1];
                        distributorFee = utils_1.getBigNumberValue(distributorFeePercent);
                        if (!distributorAddress) return [3 /*break*/, 2];
                        _c = distributorAddress;
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this._signer.getAddress()];
                    case 3:
                        _c = _d.sent();
                        _d.label = 4;
                    case 4:
                        distributorPayoutAddress = _c;
                        validation_1.validateAddress(distributorPayoutAddress);
                        return [4 /*yield*/, (token === constants_1.AddressZero
                                ? this._splitMain
                                    .connect(this._signer)
                                    .updateAndDistributeETH(splitId, accounts, percentAllocations, distributorFee, distributorPayoutAddress)
                                : this._splitMain
                                    .connect(this._signer)
                                    .updateAndDistributeERC20(splitId, token, accounts, percentAllocations, distributorFee, distributorPayoutAddress))];
                    case 5:
                        updateAndDistributeTx = _d.sent();
                        eventSignature = token === constants_1.AddressZero
                            ? this._splitMain.interface.getEvent('DistributeETH').format()
                            : this._splitMain.interface.getEvent('DistributeERC20').format();
                        return [4 /*yield*/, utils_1.getTransactionEvent(updateAndDistributeTx, eventSignature)];
                    case 6:
                        event = _d.sent();
                        if (event)
                            return [2 /*return*/, { event: event }];
                        throw new errors_1.TransactionFailedError();
                }
            });
        });
    };
    SplitsClient.prototype.withdrawFunds = function (_a) {
        var address = _a.address, tokens = _a.tokens;
        return __awaiter(this, void 0, void 0, function () {
            var withdrawEth, erc20s, withdrawTx, event;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        validation_1.validateAddress(address);
                        this._requireSigner();
                        withdrawEth = tokens.includes(constants_1.AddressZero) ? 1 : 0;
                        erc20s = tokens.filter(function (token) { return token !== constants_1.AddressZero; });
                        return [4 /*yield*/, this._splitMain
                                .connect(this._signer)
                                .withdraw(address, withdrawEth, erc20s)];
                    case 1:
                        withdrawTx = _b.sent();
                        return [4 /*yield*/, utils_1.getTransactionEvent(withdrawTx, this._splitMain.interface.getEvent('Withdrawal').format())];
                    case 2:
                        event = _b.sent();
                        if (event)
                            return [2 /*return*/, { event: event }];
                        throw new errors_1.TransactionFailedError();
                }
            });
        });
    };
    SplitsClient.prototype.initiateControlTransfer = function (_a) {
        var splitId = _a.splitId, newController = _a.newController;
        return __awaiter(this, void 0, void 0, function () {
            var transferSplitTx, event;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        validation_1.validateAddress(splitId);
                        this._requireSigner();
                        return [4 /*yield*/, this._requireController(splitId)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this._splitMain
                                .connect(this._signer)
                                .transferControl(splitId, newController)];
                    case 2:
                        transferSplitTx = _b.sent();
                        return [4 /*yield*/, utils_1.getTransactionEvent(transferSplitTx, this._splitMain.interface.getEvent('InitiateControlTransfer').format())];
                    case 3:
                        event = _b.sent();
                        if (event)
                            return [2 /*return*/, { event: event }];
                        throw new errors_1.TransactionFailedError();
                }
            });
        });
    };
    SplitsClient.prototype.cancelControlTransfer = function (_a) {
        var splitId = _a.splitId;
        return __awaiter(this, void 0, void 0, function () {
            var cancelTransferSplitTx, event;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        validation_1.validateAddress(splitId);
                        this._requireSigner();
                        return [4 /*yield*/, this._requireController(splitId)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this._splitMain
                                .connect(this._signer)
                                .cancelControlTransfer(splitId)];
                    case 2:
                        cancelTransferSplitTx = _b.sent();
                        return [4 /*yield*/, utils_1.getTransactionEvent(cancelTransferSplitTx, this._splitMain.interface.getEvent('CancelControlTransfer').format())];
                    case 3:
                        event = _b.sent();
                        if (event)
                            return [2 /*return*/, { event: event }];
                        throw new errors_1.TransactionFailedError();
                }
            });
        });
    };
    SplitsClient.prototype.acceptControlTransfer = function (_a) {
        var splitId = _a.splitId;
        return __awaiter(this, void 0, void 0, function () {
            var acceptTransferSplitTx, event;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        validation_1.validateAddress(splitId);
                        this._requireSigner();
                        return [4 /*yield*/, this._requireNewPotentialController(splitId)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this._splitMain
                                .connect(this._signer)
                                .acceptControl(splitId)];
                    case 2:
                        acceptTransferSplitTx = _b.sent();
                        return [4 /*yield*/, utils_1.getTransactionEvent(acceptTransferSplitTx, this._splitMain.interface.getEvent('ControlTransfer').format())];
                    case 3:
                        event = _b.sent();
                        if (event)
                            return [2 /*return*/, { event: event }];
                        throw new errors_1.TransactionFailedError();
                }
            });
        });
    };
    SplitsClient.prototype.makeSplitImmutable = function (_a) {
        var splitId = _a.splitId;
        return __awaiter(this, void 0, void 0, function () {
            var makeSplitImmutableTx, event;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        validation_1.validateAddress(splitId);
                        this._requireSigner();
                        return [4 /*yield*/, this._requireController(splitId)];
                    case 1:
                        _b.sent();
                        return [4 /*yield*/, this._splitMain
                                .connect(this._signer)
                                .makeSplitImmutable(splitId)];
                    case 2:
                        makeSplitImmutableTx = _b.sent();
                        return [4 /*yield*/, utils_1.getTransactionEvent(makeSplitImmutableTx, this._splitMain.interface.getEvent('ControlTransfer').format())];
                    case 3:
                        event = _b.sent();
                        if (event)
                            return [2 /*return*/, { event: event }];
                        throw new errors_1.TransactionFailedError();
                }
            });
        });
    };
    // Read actions
    SplitsClient.prototype.getSplitBalance = function (_a) {
        var splitId = _a.splitId, _b = _a.token, token = _b === void 0 ? constants_1.AddressZero : _b;
        return __awaiter(this, void 0, void 0, function () {
            var balance, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        validation_1.validateAddress(splitId);
                        this._requireSplitMain();
                        if (!(token === constants_1.AddressZero)) return [3 /*break*/, 2];
                        return [4 /*yield*/, this._splitMain.getETHBalance(splitId)];
                    case 1:
                        _c = _d.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, this._splitMain.getERC20Balance(splitId, token)];
                    case 3:
                        _c = _d.sent();
                        _d.label = 4;
                    case 4:
                        balance = _c;
                        return [2 /*return*/, { balance: balance }];
                }
            });
        });
    };
    SplitsClient.prototype.predictImmutableSplitAddress = function (_a) {
        var recipients = _a.recipients, distributorFeePercent = _a.distributorFeePercent;
        return __awaiter(this, void 0, void 0, function () {
            var _b, accounts, percentAllocations, distributorFee, splitId;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        validation_1.validateRecipients(recipients);
                        validation_1.validateDistributorFeePercent(distributorFeePercent);
                        this._requireSplitMain();
                        _b = utils_1.getRecipientSortedAddressesAndAllocations(recipients), accounts = _b[0], percentAllocations = _b[1];
                        distributorFee = utils_1.getBigNumberValue(distributorFeePercent);
                        return [4 /*yield*/, this._splitMain.predictImmutableSplitAddress(accounts, percentAllocations, distributorFee)];
                    case 1:
                        splitId = _c.sent();
                        return [2 /*return*/, { splitId: splitId }];
                }
            });
        });
    };
    SplitsClient.prototype.getController = function (_a) {
        var splitId = _a.splitId;
        return __awaiter(this, void 0, void 0, function () {
            var controller;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        validation_1.validateAddress(splitId);
                        this._requireSplitMain();
                        return [4 /*yield*/, this._splitMain.getController(splitId)];
                    case 1:
                        controller = _b.sent();
                        return [2 /*return*/, { controller: controller }];
                }
            });
        });
    };
    SplitsClient.prototype.getNewPotentialController = function (_a) {
        var splitId = _a.splitId;
        return __awaiter(this, void 0, void 0, function () {
            var newPotentialController;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        validation_1.validateAddress(splitId);
                        this._requireSplitMain();
                        return [4 /*yield*/, this._splitMain.getNewPotentialController(splitId)];
                    case 1:
                        newPotentialController = _b.sent();
                        return [2 /*return*/, { newPotentialController: newPotentialController }];
                }
            });
        });
    };
    SplitsClient.prototype.getHash = function (_a) {
        var splitId = _a.splitId;
        return __awaiter(this, void 0, void 0, function () {
            var hash;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        validation_1.validateAddress(splitId);
                        this._requireSplitMain();
                        return [4 /*yield*/, this._splitMain.getHash(splitId)];
                    case 1:
                        hash = _b.sent();
                        return [2 /*return*/, { hash: hash }];
                }
            });
        });
    };
    // Graphql read actions
    SplitsClient.prototype.getSplitMetadata = function (_a) {
        var splitId = _a.splitId;
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        validation_1.validateAddress(splitId);
                        return [4 /*yield*/, this._makeGqlRequest(subgraph_1.SPLIT_QUERY, {
                                splitId: splitId.toLowerCase(),
                            })];
                    case 1:
                        response = _b.sent();
                        return [4 /*yield*/, this._formatSplit(response.split)];
                    case 2: return [2 /*return*/, _b.sent()];
                }
            });
        });
    };
    SplitsClient.prototype.getRelatedSplits = function (_a) {
        var address = _a.address;
        return __awaiter(this, void 0, void 0, function () {
            var response, _b, receivingFrom, controlling, pendingControl;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        validation_1.validateAddress(address);
                        return [4 /*yield*/, this._makeGqlRequest(subgraph_1.RELATED_SPLITS_QUERY, { accountId: address.toLowerCase() })];
                    case 1:
                        response = _c.sent();
                        return [4 /*yield*/, Promise.all([
                                Promise.all(response.receivingFrom.map(function (recipient) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this._formatSplit(recipient.split)];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                }); }); })),
                                Promise.all(response.controlling.map(function (gqlSplit) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this._formatSplit(gqlSplit)];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                }); }); })),
                                Promise.all(response.pendingControl.map(function (gqlSplit) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this._formatSplit(gqlSplit)];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                }); }); })),
                            ])];
                    case 2:
                        _b = _c.sent(), receivingFrom = _b[0], controlling = _b[1], pendingControl = _b[2];
                        return [2 /*return*/, {
                                receivingFrom: receivingFrom,
                                controlling: controlling,
                                pendingControl: pendingControl,
                            }];
                }
            });
        });
    };
    SplitsClient.prototype.getSplitEarnings = function (_a) {
        var splitId = _a.splitId, _b = _a.includeActiveBalances, includeActiveBalances = _b === void 0 ? true : _b;
        return __awaiter(this, void 0, void 0, function () {
            var response, distributed, internalBalances, internalTokens, erc20Tokens, _c, tokens, activeBalances;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        validation_1.validateAddress(splitId);
                        if (includeActiveBalances && !this._splitMain.provider)
                            throw new errors_1.MissingProviderError('Provider required to get split active balances. Please update your call to the SplitsClient constructor with a valid provider, or set includeActiveBalances to false');
                        return [4 /*yield*/, this._makeGqlRequest(subgraph_1.ACCOUNT_BALANCES_QUERY, {
                                accountId: splitId.toLowerCase(),
                            })];
                    case 1:
                        response = _d.sent();
                        distributed = subgraph_1.formatAccountBalances(response.accountBalances.withdrawals);
                        if (!includeActiveBalances)
                            return [2 /*return*/, {
                                    distributed: distributed,
                                }];
                        internalBalances = subgraph_1.formatAccountBalances(response.accountBalances.internalBalances);
                        internalTokens = Object.keys(internalBalances);
                        if (!this._splitMain.provider) return [3 /*break*/, 3];
                        return [4 /*yield*/, utils_1.fetchERC20TransferredTokens(this._chainId, this._splitMain.provider, splitId)];
                    case 2:
                        _c = _d.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        _c = [];
                        _d.label = 4;
                    case 4:
                        erc20Tokens = _c;
                        tokens = Array.from(new Set(internalTokens.concat(erc20Tokens).concat([constants_1.AddressZero])));
                        return [4 /*yield*/, Promise.all(tokens.map(function (token) { return _this.getSplitBalance({ splitId: splitId, token: token }); }))];
                    case 5:
                        activeBalances = (_d.sent()).reduce(function (acc, balanceDict, index) {
                            var balance = balanceDict.balance;
                            var token = address_1.getAddress(tokens[index]);
                            if (balance > constants_1.One)
                                acc[token] = balance;
                            return acc;
                        }, {});
                        return [2 /*return*/, {
                                activeBalances: activeBalances,
                                distributed: distributed,
                            }];
                }
            });
        });
    };
    SplitsClient.prototype.getUserEarnings = function (_a) {
        var userId = _a.userId;
        return __awaiter(this, void 0, void 0, function () {
            var response, withdrawn, activeBalances;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        validation_1.validateAddress(userId);
                        return [4 /*yield*/, this._makeGqlRequest(subgraph_1.ACCOUNT_BALANCES_QUERY, {
                                accountId: userId.toLowerCase(),
                            })];
                    case 1:
                        response = _b.sent();
                        withdrawn = subgraph_1.formatAccountBalances(response.accountBalances.withdrawals);
                        activeBalances = subgraph_1.formatAccountBalances(response.accountBalances.internalBalances);
                        return [2 /*return*/, { withdrawn: withdrawn, activeBalances: activeBalances }];
                }
            });
        });
    };
    // Helper functions
    SplitsClient.prototype._requireSplitMain = function () {
        if (!this._splitMain.provider)
            throw new errors_1.MissingProviderError('Provider required to perform this action, please update your call to the SplitsClient constructor');
    };
    SplitsClient.prototype._requireSigner = function () {
        this._requireSplitMain();
        if (!this._signer)
            throw new errors_1.MissingSignerError('Signer required to perform this action, please update your call to the SplitsClient constructor');
    };
    SplitsClient.prototype._requireController = function (splitId) {
        return __awaiter(this, void 0, void 0, function () {
            var controller, signerAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getController({ splitId: splitId })
                        // TODO: how to get rid of this, needed for typescript check
                    ];
                    case 1:
                        controller = (_a.sent()).controller;
                        // TODO: how to get rid of this, needed for typescript check
                        if (!this._signer)
                            throw new Error();
                        return [4 /*yield*/, this._signer.getAddress()];
                    case 2:
                        signerAddress = _a.sent();
                        if (controller !== signerAddress)
                            throw new errors_1.InvalidAuthError("Action only available to the split controller. Split id: " + splitId + ", split controller: " + controller + ", signer: " + signerAddress);
                        return [2 /*return*/];
                }
            });
        });
    };
    SplitsClient.prototype._requireNewPotentialController = function (splitId) {
        return __awaiter(this, void 0, void 0, function () {
            var newPotentialController, signerAddress;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getNewPotentialController({
                            splitId: splitId,
                        })
                        // TODO: how to get rid of this, needed for typescript check
                    ];
                    case 1:
                        newPotentialController = (_a.sent()).newPotentialController;
                        // TODO: how to get rid of this, needed for typescript check
                        if (!this._signer)
                            throw new Error();
                        return [4 /*yield*/, this._signer.getAddress()];
                    case 2:
                        signerAddress = _a.sent();
                        if (newPotentialController !== signerAddress)
                            throw new errors_1.InvalidAuthError("Action only available to the split's new potential controller. Split new potential controller: " + newPotentialController + ". Signer: " + signerAddress);
                        return [2 /*return*/];
                }
            });
        });
    };
    SplitsClient.prototype._makeGqlRequest = function (query, variables) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this._graphqlClient) {
                            throw new errors_1.UnsupportedSubgraphChainIdError();
                        }
                        return [4 /*yield*/, this._graphqlClient.request(query, variables)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    SplitsClient.prototype._formatSplit = function (gqlSplit) {
        return __awaiter(this, void 0, void 0, function () {
            var split;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        split = subgraph_1.protectedFormatSplit(gqlSplit);
                        if (!this._includeEnsNames) return [3 /*break*/, 2];
                        return [4 /*yield*/, utils_1.addEnsNames(this._splitMain.provider, split.recipients)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/, split];
                }
            });
        });
    };
    return SplitsClient;
}());
exports.SplitsClient = SplitsClient;
//# sourceMappingURL=client.js.map