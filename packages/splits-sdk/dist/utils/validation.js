"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var address_1 = require("@ethersproject/address");
var constants_1 = require("../constants");
var errors_1 = require("../errors");
var getNumDigitsAfterDecimal = function (value) {
    if (Number.isInteger(value))
        return 0;
    var decimalStr = value.toString().split('.')[1];
    return decimalStr.length;
};
exports.validateRecipients = function (recipients) {
    var seenAddresses = new Set([]);
    var totalPercentAllocation = 0;
    if (recipients.length < 2)
        throw new errors_1.InvalidRecipientsError('At least two recipients are required');
    recipients.forEach(function (recipient) {
        if (!address_1.isAddress(recipient.address))
            throw new errors_1.InvalidRecipientsError("Invalid address: " + recipient.address);
        if (seenAddresses.has(recipient.address.toLowerCase()))
            throw new errors_1.InvalidRecipientsError("Address cannot be used for multiple recipients: " + recipient.address);
        if (recipient.percentAllocation <= 0 || recipient.percentAllocation >= 100)
            throw new errors_1.InvalidRecipientsError("Invalid percent allocation: " + recipient.percentAllocation + ". Must be between 0 and 100");
        if (getNumDigitsAfterDecimal(recipient.percentAllocation) >
            constants_1.SPLITS_MAX_PRECISION_DECIMALS)
            throw new errors_1.InvalidRecipientsError("Invalid precision on percent allocation: " + recipient.percentAllocation + ". Maxiumum allowed precision is " + constants_1.SPLITS_MAX_PRECISION_DECIMALS + " decimals");
        seenAddresses.add(recipient.address.toLowerCase());
        totalPercentAllocation += recipient.percentAllocation;
    });
    // Cutoff any decimals beyond the max precision, they may get introduced due
    // to javascript floating point precision
    var factorOfTen = Math.pow(10, constants_1.SPLITS_MAX_PRECISION_DECIMALS);
    totalPercentAllocation =
        Math.round(totalPercentAllocation * factorOfTen) / factorOfTen;
    if (totalPercentAllocation !== 100)
        throw new errors_1.InvalidRecipientsError("Percent allocation must add up to 100. Currently adds up to " + totalPercentAllocation);
};
exports.validateDistributorFeePercent = function (distributorFeePercent) {
    if (distributorFeePercent < 0 || distributorFeePercent > 10)
        throw new errors_1.InvalidDistributorFeePercentError("Invalid distributor fee percent: " + distributorFeePercent + ". Distributor fee percent must be >= 0 and <= 10");
    if (getNumDigitsAfterDecimal(distributorFeePercent) >
        constants_1.SPLITS_MAX_PRECISION_DECIMALS)
        throw new errors_1.InvalidDistributorFeePercentError("Invalid precision on distributor fee: " + distributorFeePercent + ". Maxiumum allowed precision is " + constants_1.SPLITS_MAX_PRECISION_DECIMALS + " decimals");
};
exports.validateAddress = function (address) {
    if (!address_1.isAddress(address))
        throw new errors_1.InvalidArgumentError("Invalid address: " + address);
};
//# sourceMappingURL=validation.js.map