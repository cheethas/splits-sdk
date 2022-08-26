"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var constants_1 = require("./constants");
// Manually setting the prototype in the constructor with setPrototypeOf fixes a typescript issue so that the
// unit tests can detect the error class
var UnsupportedChainIdError = /** @class */ (function (_super) {
    __extends(UnsupportedChainIdError, _super);
    function UnsupportedChainIdError(invalidChainId) {
        var _this = _super.call(this, "Unsupported chain: " + invalidChainId + ". Supported chains are: " + constants_1.SPLITS_SUPPORTED_CHAIN_IDS) || this;
        _this.name = 'UnsupportedChainIdError';
        Object.setPrototypeOf(_this, UnsupportedChainIdError.prototype);
        return _this;
    }
    return UnsupportedChainIdError;
}(Error));
exports.UnsupportedChainIdError = UnsupportedChainIdError;
var UnsupportedSubgraphChainIdError = /** @class */ (function (_super) {
    __extends(UnsupportedSubgraphChainIdError, _super);
    function UnsupportedSubgraphChainIdError() {
        var _this = _super.call(this, "Unsupported subgraph chain. Supported subgraph chains are: " + constants_1.SPLITS_SUBGRAPH_CHAIN_IDS) || this;
        _this.name = 'UnsupportedSubgraphChainIdError';
        Object.setPrototypeOf(_this, UnsupportedSubgraphChainIdError.prototype);
        return _this;
    }
    return UnsupportedSubgraphChainIdError;
}(Error));
exports.UnsupportedSubgraphChainIdError = UnsupportedSubgraphChainIdError;
var InvalidRecipientsError = /** @class */ (function (_super) {
    __extends(InvalidRecipientsError, _super);
    function InvalidRecipientsError(m) {
        var _this = _super.call(this, m) || this;
        _this.name = 'InvalidRecipientsError';
        Object.setPrototypeOf(_this, InvalidRecipientsError.prototype);
        return _this;
    }
    return InvalidRecipientsError;
}(Error));
exports.InvalidRecipientsError = InvalidRecipientsError;
var InvalidDistributorFeePercentError = /** @class */ (function (_super) {
    __extends(InvalidDistributorFeePercentError, _super);
    function InvalidDistributorFeePercentError(m) {
        var _this = _super.call(this, m) || this;
        _this.name = 'InvalidDistributorFeePercent';
        Object.setPrototypeOf(_this, InvalidDistributorFeePercentError.prototype);
        return _this;
    }
    return InvalidDistributorFeePercentError;
}(Error));
exports.InvalidDistributorFeePercentError = InvalidDistributorFeePercentError;
var InvalidArgumentError = /** @class */ (function (_super) {
    __extends(InvalidArgumentError, _super);
    function InvalidArgumentError(m) {
        var _this = _super.call(this, m) || this;
        _this.name = 'InvalidArgumentError';
        Object.setPrototypeOf(_this, InvalidArgumentError.prototype);
        return _this;
    }
    return InvalidArgumentError;
}(Error));
exports.InvalidArgumentError = InvalidArgumentError;
var InvalidAuthError = /** @class */ (function (_super) {
    __extends(InvalidAuthError, _super);
    function InvalidAuthError(m) {
        var _this = _super.call(this, m) || this;
        _this.name = 'InvalidAuthError';
        Object.setPrototypeOf(_this, InvalidAuthError.prototype);
        return _this;
    }
    return InvalidAuthError;
}(Error));
exports.InvalidAuthError = InvalidAuthError;
var TransactionFailedError = /** @class */ (function (_super) {
    __extends(TransactionFailedError, _super);
    function TransactionFailedError(m) {
        var _this = _super.call(this, m) || this;
        _this.name = 'TransactionFailedError';
        Object.setPrototypeOf(_this, TransactionFailedError.prototype);
        return _this;
    }
    return TransactionFailedError;
}(Error));
exports.TransactionFailedError = TransactionFailedError;
var MissingProviderError = /** @class */ (function (_super) {
    __extends(MissingProviderError, _super);
    function MissingProviderError(m) {
        var _this = _super.call(this, m) || this;
        _this.name = 'MissingProviderError';
        Object.setPrototypeOf(_this, MissingProviderError.prototype);
        return _this;
    }
    return MissingProviderError;
}(Error));
exports.MissingProviderError = MissingProviderError;
var FailedToEstimateGasError = /** @class */ (function (_super) {
    __extends(FailedToEstimateGasError, _super);
    function FailedToEstimateGasError(m) {
        var _this = _super.call(this, m) || this;
        _this.name = 'FailedToEstimateGasError';
        Object.setPrototypeOf(_this, FailedToEstimateGasError.prototype);
        return _this;
    }
    return FailedToEstimateGasError;
}(Error));
exports.FailedToEstimateGasError = FailedToEstimateGasError;
var MissingSignerError = /** @class */ (function (_super) {
    __extends(MissingSignerError, _super);
    function MissingSignerError(m) {
        var _this = _super.call(this, m) || this;
        _this.name = 'MissingSignerError';
        Object.setPrototypeOf(_this, MissingSignerError.prototype);
        return _this;
    }
    return MissingSignerError;
}(Error));
exports.MissingSignerError = MissingSignerError;
var InvalidConfigError = /** @class */ (function (_super) {
    __extends(InvalidConfigError, _super);
    function InvalidConfigError(m) {
        var _this = _super.call(this, m) || this;
        _this.name = 'InvalidConfigError';
        Object.setPrototypeOf(_this, InvalidConfigError.prototype);
        return _this;
    }
    return InvalidConfigError;
}(Error));
exports.InvalidConfigError = InvalidConfigError;
//# sourceMappingURL=errors.js.map