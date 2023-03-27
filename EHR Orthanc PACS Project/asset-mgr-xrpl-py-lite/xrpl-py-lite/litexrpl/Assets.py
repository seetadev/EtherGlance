from xrpl.clients import JsonRpcClient
from xrpl.models import (AccountSet, AccountSetFlag, IssuedCurrencyAmount,
                         NFTokenMint, Payment, TrustSet)
from xrpl.transaction import (safe_sign_and_autofill_transaction,
                              send_reliable_submission)
from xrpl.wallet import Wallet

from Misc import symbol_to_hex

"""create tokens, nfts"""

class xAsset(JsonRpcClient):
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
    
    def create_token(self, issuer_seed: str, manager_seed: str, token_name: str, total_supply: str) -> dict:
        """create an xrp token"""
        manager_wallet = Wallet(seed=manager_seed, sequence=0)
        issuer_wallet = Wallet(seed=issuer_seed, sequence=0)

        # AccountSet Transaction to enable recommended settings for the cold wallet
        cold_setting_tx = AccountSet(account=issuer_wallet.classic_address, set_flag=AccountSetFlag.ASF_DEFAULT_RIPPLE)
        cst_prepared = safe_sign_and_autofill_transaction( transaction=cold_setting_tx, wallet=issuer_wallet, client=self.client)
        send_reliable_submission(cst_prepared, self.client)

        # AccountSet Transaction to enable recommended settings for the hot wallet
        hot_settings_tx = AccountSet(account=manager_wallet.classic_address, set_flag=AccountSetFlag.ASF_REQUIRE_AUTH)
        hst_prepared = safe_sign_and_autofill_transaction(transaction=hot_settings_tx, wallet=manager_wallet, client=self.client)
        send_reliable_submission(hst_prepared, self.client)

        # Create a trustline from hot to cold address with the total supply
        trust_set_tx = TrustSet(account=manager_wallet.classic_address, limit_amount=IssuedCurrencyAmount(
            currency=symbol_to_hex(token_name),
            issuer=issuer_wallet.classic_address,
            value=total_supply), flags=131072)
        ts_prepared = safe_sign_and_autofill_transaction(transaction = trust_set_tx, wallet=manager_wallet, client=self.client)
        send_reliable_submission(ts_prepared, self.client)

        # Send Token
        send_token_tx = Payment( account=issuer_wallet.classic_address, destination=manager_wallet.classic_address, amount=IssuedCurrencyAmount(
            currency=symbol_to_hex(token_name),
            issuer=issuer_wallet.classic_address,
            value=total_supply))
        pay_prepared = safe_sign_and_autofill_transaction(transaction=send_token_tx, wallet=issuer_wallet, client=self.client)
        final_response = send_reliable_submission(pay_prepared, self.client)

        final_result = final_response.result
        return {
        "result": final_result["meta"]["TransactionResult"], 
        "txid": final_result["hash"],
        "link": f"{self.txn_url}{final_result['hash']}"}


    def create_token_w_fees():
        pass

    def create_custom_token():
        pass

    def create_nft(self, issuer_seed: str, taxon: int) -> dict:
        sender_wallet = Wallet(seed=issuer_seed, sequence=0)
        mint_txn = NFTokenMint(account=sender_wallet.classic_address, nftoken_taxon=taxon)
        stxn = safe_sign_and_autofill_transaction(mint_txn, sender_wallet, self.client)
        stxn_response = send_reliable_submission(stxn, self.client)
        stxn_result = stxn_response.result
        return {
        "result": stxn_result["meta"]["TransactionResult"], 
        "txid": stxn_result["hash"],
        "link": f"{self.txn_url}{stxn_result['hash']}"}

# f = xAsset("https://s.altnet.rippletest.net:51234", "", "")
# print(f.create_token("sEdThjCR5Vy2MNqN6hWkFr4NhK9Bnkn", "sEdTuywsDSBxUfWi5VozXnVdkUYTT1L", "XRP", "1229"))
