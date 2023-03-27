from decimal import Decimal
from typing import Union

from xrpl.account import (does_account_exist, get_account_info,
                          get_account_payment_transactions, get_balance,
                          get_next_valid_seq_number)
from xrpl.clients import JsonRpcClient
from xrpl.core import keypairs
from xrpl.ledger import get_fee
from xrpl.models import (AccountInfo, AccountLines, IssuedCurrencyAmount,
                         Payment)
from xrpl.transaction import (safe_sign_and_autofill_transaction,
                              send_reliable_submission)
from xrpl.utils import drops_to_xrp, ripple_time_to_datetime, xrp_to_drops
from xrpl.wallet import Wallet

from litexrpl.Misc import hex_to_symbol, symbol_to_hex


class xLiteWallet(JsonRpcClient):
    def __init__(self, network_url: str, account_url: str, txn_url: str):
        self.network_url = network_url
        self.account_url = account_url
        self.txn_url = txn_url
        self.client = JsonRpcClient(network_url)

    def toTestnet(self) -> bool:
        self.network_url = "https://s.altnet.rippletest.net:51234"
        self.account_url = "https://testnet.xrpl.org/accounts/"
        self.txn_url = "https://testnet.xrpl.org/transactions/"
        self.client = JsonRpcClient(self.network_url)
        return True

    def toMainnet(self) -> bool:
        self.network_url = "https://xrplcluster.com"
        self.account_url = "https://livenet.xrpl.org/accounts/"
        self.txn_url = "https://livenet.xrpl.org/transactions/"
        self.client = JsonRpcClient(self.network_url)
        return True
    
    def show_account_in_explorer(self, wallet_addr: str) -> str:
        """show account in explorer"""
        return f"{self.account_url}{wallet_addr}"

    def show_transaction_in_explorer(self, txid: str) -> str:
        """show transaction in explorer"""
        return f"{self.txn_url}{txid}"

    def generate_xrp_wallet(self, name: str) -> dict:
        """generate a new xrp wallet"""
        wallet_info = {}
        wallet = Wallet.create()
        seed = wallet.seed
        public, private = keypairs.derive_keypair(seed)
        wallet_info["name"] = name
        wallet_info["classic_address"] = wallet.classic_address
        wallet_info["private_key"] = private
        wallet_info["public_key"] = public
        wallet_info["seed"] = seed
        return wallet_info

    def restore_wallet(self, name: str, seed: str) -> dict:
        """restore a wallet from a seed"""
        public, private = keypairs.derive_keypair(seed)
        wallet_info = {}
        wallet_info["name"] = name
        wallet_info["classic_address"] = keypairs.derive_classic_address(public)
        wallet_info["private_key"] = private
        wallet_info["public_key"] = public
        wallet_info["seed"] = seed
        return wallet_info
    
    def spendable_xrp_balance(self, wallet_addr: str) -> Decimal:
        """return formatted xrp balance"""
        init_balance = int(get_balance(wallet_addr, self.client)) - 10000000
        response = get_account_info(wallet_addr, self.client).result
        owner_count = int(response["account_data"]["OwnerCount"])
        balance = init_balance - (2000000 * owner_count)
        return drops_to_xrp(str(balance))
    
    def xrp_balance(self, wallet_addr: str) -> tuple[Decimal, int]:
        """return raw xrp balance \n 
        [0] = base XRP balance - 10 xrp activation fee\n
        [1] = owner object count, escrows, checks etc\n"""
        init_balance = int(get_balance(wallet_addr, self.client)) - 10000000
        response = get_account_info(wallet_addr, self.client).result
        owner_count = int(response["account_data"]["OwnerCount"])
        return (str(drops_to_xrp(str(init_balance))), owner_count)
    
    def get_network_fee(self) -> Decimal:
        """return current ledger fee"""
        return drops_to_xrp(get_fee(self.client))
    
    def get_account_next_seq_number(self, wallet_addr: str) -> int:
        """return next valid account sequence number"""
        return get_next_valid_seq_number(address=wallet_addr, client=self.client, ledger_index="validated")
    
    def account_exists(self, wallet_addr: str) -> bool:
        """check if an account exists"""
        return does_account_exist(wallet_addr, self.client)

    def xrp_transactions(self, wallet_addr: str) -> dict:
        """return all xrp payment transactions an address has carried out"""
        transactions_dict = {}
        sent = []
        received = []
        response = get_account_payment_transactions(wallet_addr, self.client)
        for transaction in response:
            transact = {}
            if isinstance(transaction["tx"]["Amount"], dict):
                pass
            else:
                transact["sender"] = transaction["tx"]["Account"]
                transact["receiver"] = transaction["tx"]["Destination"]
                transact["amount"] = str(drops_to_xrp(str(transaction["tx"]["Amount"])))
                transact["fee"] = str(drops_to_xrp(str(transaction["tx"]["Fee"])))
                transact["timestamp"] = str(ripple_time_to_datetime(transaction["tx"]["date"]))
                transact["txid"] = transaction["tx"]["hash"]
                transact["link"] = f'{self.txn_url}{transaction["tx"]["hash"]}'
                transact["tx_type"] = transaction["tx"]["TransactionType"]
                if transact["sender"] == wallet_addr:
                    sent.append(transact)
                elif transact["sender"] != wallet_addr:
                    received.append(transact)
        transactions_dict['sent'] = sent
        transactions_dict['received'] = received
        return transactions_dict

    def asset_transactions(self, wallet_addr: str) -> dict:
        """return all asset payment transactions an account has carried out"""
        transactions_dict = {}
        sent = []
        received = []
        response = get_account_payment_transactions(wallet_addr, self.client)
        for transaction in response:
            if isinstance(transaction["tx"]["Amount"], dict):
                transact = {}
                transact["sender"] = transaction["tx"]["Account"]
                transact["receiver"] = transaction["tx"]["Destination"]
                transact["asset"] = hex_to_symbol(transaction["tx"]["Amount"]["currency"])
                transact["issuer"] = transaction["tx"]["Amount"]["issuer"]
                transact["amount"] = transaction["tx"]["Amount"]["value"]
                transact["fee"] =  str(drops_to_xrp(str(transaction["tx"]["Fee"])))
                transact["timestamp"] = str(ripple_time_to_datetime(transaction["tx"]["date"]))
                transact["txid"] = transaction["tx"]["hash"]
                transact["link"] = f'{self.txn_url}{transaction["tx"]["hash"]}'
                transact["tx_type"] = transaction["tx"]["TransactionType"]
                if transact["sender"] == wallet_addr:
                    sent.append(transact)
                elif transact["sender"] != wallet_addr:
                    received.append(transact)
        transactions_dict['sent'] = sent
        transactions_dict['received'] = received
        return transactions_dict

    def send_xrp(self, sender_addr: str, sender_seed: str, receiver_addr: str, amount: Union[float, Decimal, int]) -> str:
        """send xrp"""
        acc_info = AccountInfo(account=sender_addr, ledger_index="validated")
        response = self.client.request(acc_info).result
        sequence = response["account_data"]["Sequence"]
        sender_wallet = Wallet(seed=sender_seed, sequence=sequence)

        txn = Payment(account=sender_addr, amount=xrp_to_drops(amount), destination=receiver_addr)
        signed_txn = safe_sign_and_autofill_transaction(txn, sender_wallet, self.client)

        product = send_reliable_submission(signed_txn, self.client)
        product_result = product.result
        return product_result["meta"]["TransactionResult"]
    
    def send_currency(self, sender_addr: str, sender_seed: str, receiver_addr: str, currency_code: str,
        currency_amount: str, currency_issuer: str) -> str:
        """send asset...
        max amount = 15 decimal places"""
        acc_info = AccountInfo(account=sender_addr, ledger_index="validated")
        response = self.client.request(acc_info).result
        sequence = response["account_data"]["Sequence"]
        sender_wallet = Wallet(seed=sender_seed, sequence=sequence)

        txn_payment = Payment(account=sender_addr, destination=receiver_addr,
        amount=IssuedCurrencyAmount(
            currency=symbol_to_hex(currency_code),
            issuer=currency_issuer,
            value=currency_amount
        ))
        stxn_payment = safe_sign_and_autofill_transaction(
            transaction=txn_payment,
            wallet=sender_wallet,
            client=self.client
        )
        stxn_response = send_reliable_submission(stxn_payment, self.client)
        stxn_result = stxn_response.result
        return stxn_result["meta"]["TransactionResult"]

    def account_assets(self, wallet_addr: str) -> list:
        """returns all assets a wallet address is holding with their respective issuers, limit and balances"""
        assets = []
        acc_info = AccountLines(account=wallet_addr, ledger_index="validated")
        response = self.client.request(acc_info)
        result = response.result
        lines = result["lines"]
        for line in lines:
            asset = {}
            asset["name"] = hex_to_symbol(line["currency"])
            asset["issuer"] = line["account"]
            asset["amount"] = line["balance"]
            asset["limit"] = line["limit"] # the max an account can handle
            if 'no_ripple' in line:
                asset["ripple_status"] = line["no_ripple"] # no ripple = true, means rippling is disabled which is good; else bad
            assets.append(asset)
        return assets
