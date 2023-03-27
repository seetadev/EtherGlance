import random
from datetime import datetime
from os import urandom

from cryptoconditions import PreimageSha256
from xrpl.clients import JsonRpcClient
from xrpl.models import (XRP, AccountInfo, IssuedCurrency,
                         IssuedCurrencyAmount, Tx)
from xrpl.utils import datetime_to_ripple_time, ripple_time_to_datetime
from xrpl.wallet import Wallet, generate_faucet_wallet

XURLS_= {
"TESTNET_URL": "https://s.altnet.rippletest.net:51234",
"MAINNET_URL": "https://xrplcluster.com",

"TESTNET_TXNS": "https://testnet.xrpl.org/transactions/",
"MAINNET_TXNS": "https://livenet.xrpl.org/transactions/",

"MAINNET_ACCOUNT": "https://livenet.xrpl.org/accounts/",
"TESTNET_ACCOUNT": "https://testnet.xrpl.org/accounts/",
}


def convert_datetime_rippletime(obj: datetime) -> int:
    """converts a datetime object to ripple time"""
    return datetime_to_ripple_time(obj)

def convert_rippletime_datetime(obj: int) -> datetime:
    """converts ripple time to datetime object"""
    return ripple_time_to_datetime(obj)

def get_test_xrp(wallet: Wallet) -> None:
    """fund your account with free 1000 test xrp"""
    testnet_url = "https://s.altnet.rippletest.net:51234"
    client = JsonRpcClient(testnet_url)
    generate_faucet_wallet(client, wallet)

def symbol_to_hex(symbol: str = None) -> str:
    """symbol_to_hex."""
    if len(symbol) > 3:
        bytes_string = bytes(str(symbol).encode('utf-8'))
        return bytes_string.hex().upper().ljust(40, '0')
    return symbol

def hex_to_symbol(hex: str = None) -> str:
    """hex_to_symbol."""
    if len(hex) > 3:
        bytes_string = bytes.fromhex(str(hex)).decode('utf-8')
        return bytes_string.rstrip('\x00')
    return hex

def transfer_fee_maker(fee_percent: int) -> int:
    """convert fee to XRP fee format\n
    pass percentage as integer e.g
    `20` = `20%`"""
    base_fee = 1000000000 # 1000000000 == 0%
    val = base_fee * fee_percent
    val = val / 100
    return int(val + base_fee)

def genCurInstance(name: str, issuer: str) -> IssuedCurrency:
    """generate an `IssuedCurrency` instance to fill in the `allOffers` method `IssuedCurrency` parameter"""
    currency = IssuedCurrency(currency=name, issuer=issuer)
    return currency

def genXRPInstance() -> XRP:
    """generate an `XRP` instance to fill in the `allOffers` method `XRP` parameter"""
    xrp = XRP()
    return xrp

def genCurAmountInstance(name: str, issuer: str, amount: str) -> IssuedCurrencyAmount:
    """generate an `IssuedCurrencyAmount` instance,
    1. to fill the `create_offer` method `pay` and `receive` parameters
    2. to pay asset creation fees"""
    currency = IssuedCurrencyAmount(currency=name, issuer=issuer, value=amount)
    return currency

def r_escrow_seq(client: JsonRpcClient, prev_txn_id: str) -> dict:
    """return escrow seq for finishing or cancelling \n use seq_back_up if seq is null"""
    info_dict = {}
    req = Tx(transaction=prev_txn_id)
    response = client.request(req)
    result = response.result
    if "Sequence" in result:
        info_dict["sequence"] = result["Sequence"]
    if "TicketSequence" in result:
        info_dict["seq_back_up"] = result["TicketSequence"]
    return info_dict

def genWalletObject(client: JsonRpcClient, wallet_addr: str, wallet_seed: str) -> Wallet:
    """creates a wallet object for signing transactions"""
    return Wallet(seed=wallet_seed, sequence=client.request(AccountInfo(account=wallet_addr, ledger_index="validated")).result["account_data"]["Sequence"])

def bytesGenerator() -> bytes:
    """generates a random byte"""
    return urandom(random.randint(32, 64))

def genCondition_Fulfillment() -> dict:
    """Generate a condition and fulfillment for escrows"""
    fufill = PreimageSha256(preimage=urandom(random.randint(32, 64)))
    return {
    "condition": str.upper(fufill.condition_binary.hex()),
    "fulfillment": str.upper(fufill.serialize_binary().hex())}
