from decimal import Decimal
from typing import Union

from xrpl.clients import JsonRpcClient
from xrpl.models import (XRP, AccountCurrencies, AccountDelete, AccountInfo,
                         AccountObjects, AccountOffers, BookOffers,
                         CheckCancel, CheckCash, CheckCreate, EscrowCancel,
                         EscrowCreate, EscrowFinish, GatewayBalances,
                         IssuedCurrency, IssuedCurrencyAmount, NFTokenMint,
                         OfferCancel, OfferCreate, TrustSet)
from xrpl.transaction import (safe_sign_and_autofill_transaction,
                              send_reliable_submission)
from xrpl.utils import drops_to_xrp, ripple_time_to_datetime, xrp_to_drops
from xrpl.wallet import Wallet

from litexrpl.Misc import hex_to_symbol, symbol_to_hex


class xLiteToolSet(JsonRpcClient):
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
    
    def holding_currencies(self, wallet_addr: str) -> list:
        """retrieves a list of currencies that an account can send or receive, based on its trust lines."""
        currency_holdings = []
        req = AccountCurrencies(account=wallet_addr, ledger_index="validated", strict=True)
        response = self.client.request(req)
        result = response.result
        r_currencies = result["receive_currencies"]
        s_currencies = result["send_currencies"]
        if s_currencies == []:
            pass
        if r_currencies == []:
            pass
        else:
            for currency in r_currencies:
                currency_holdings.append(hex_to_symbol(currency))
            for currency in s_currencies:
                currency_holdings.append(hex_to_symbol(currency))
        return currency_holdings
    
    def created_assets_cold_addr(self, wallet_addr: str) -> list:
        """returns all assets an account has created as the cold issuer"""
        created_assets = []
        req = GatewayBalances(account=wallet_addr, ledger_index="validated")
        response = self.client.request(req)
        result = response.result
        if 'obligations' in result:
            obligations = result["obligations"]
            for key, value in obligations.items():
                asset = {}
                asset["name"] = hex_to_symbol(key)
                asset["amount"] = value
                asset["issuer"] = wallet_addr
                created_assets.append(asset)
        return created_assets
    
    def created_assets_hot_addr(self, wallet_addr: str) -> dict:
        """returns all assets an account thas created as the hot issuer"""
        created_assets = []
        asset = {}
        req = GatewayBalances(account=wallet_addr, ledger_index="validated")
        response = self.client.request(req)
        result = response.result
        if 'assets' in result:
            assets = result["assets"]
            for issuer, issuings in assets.items():
                for iss_cur in issuings:
                    asset_info = {}
                    asset_info["cold_issuer"] = issuer
                    asset_info["name"] = hex_to_symbol(iss_cur["currency"])
                    asset_info["amount"] = iss_cur["value"]
                    asset_info["hot_addr"] = wallet_addr
                    created_assets.append(asset_info)
                asset["created_assets"] = created_assets
        return asset

    def add_asset(self, sender_addr: str, sender_seed: str, currency: str, issuer: str, value: str, rippling: bool = False) -> str:
        """enable transacting with an asset"""
        flag = 131072
        if rippling:
            flag = 262144
        acc_info = AccountInfo(account=sender_addr, ledger_index="validated")
        response = self.client.request(acc_info).result
        sequence = response["account_data"]["Sequence"]
        sender_wallet = Wallet(seed=sender_seed, sequence=sequence)

        cur = IssuedCurrencyAmount(currency=symbol_to_hex(currency), issuer=issuer, value=value)
        my_payment = TrustSet(account=sender_addr, limit_amount=cur, flags=flag)
        signed_tx = safe_sign_and_autofill_transaction(my_payment, sender_wallet, self.client)
        prelim_result = send_reliable_submission(signed_tx, self.client)
        result = prelim_result.result
        return result["meta"]["TransactionResult"]
    
    def modify_ripple_status(self, sender_addr: str, sender_seed: str, currency: str, issuer: str, value: str, rippling: bool = False) -> str:
        """modify ripple status of an asset"""
        flag = 131072
        if rippling:
            flag = 262144
        acc_info = AccountInfo(account=sender_addr, ledger_index="validated")
        response = self.client.request(acc_info).result
        sequence = response["account_data"]["Sequence"]
        sender_wallet = Wallet(seed=sender_seed, sequence=sequence)

        cur = IssuedCurrencyAmount(currency=symbol_to_hex(currency), issuer=issuer, value=value)
        my_payment = TrustSet(account=sender_addr, limit_amount=cur, flags=flag)
        signed_tx = safe_sign_and_autofill_transaction(my_payment, sender_wallet, self.client)
        prelim_result = send_reliable_submission(signed_tx, self.client)
        result = prelim_result.result
        return result["meta"]["TransactionResult"]

    def remove_asset(self, sender_addr: str, sender_seed: str, currency: str, issuer: str) -> str:
        """disable transacting with an asset"""
        acc_info = AccountInfo(account=sender_addr, ledger_index="validated")
        response = self.client.request(acc_info).result
        sequence = response["account_data"]["Sequence"]
        sender_wallet = Wallet(seed=sender_seed, sequence=sequence)

        cur = IssuedCurrencyAmount(currency=symbol_to_hex(currency), issuer=issuer, value="0")
        my_payment = TrustSet(account=sender_addr, limit_amount=cur)
        signed_tx = safe_sign_and_autofill_transaction(my_payment, sender_wallet, self.client)
        prelim_result = send_reliable_submission(signed_tx, self.client)
        result = prelim_result.result
        return result["meta"]["TransactionResult"]
    
    def delete_account(self, sender_addr: str, sender_seed: str, receiver_addr: str) -> str:
        """delete an account from the ledger"""
        acc_info = AccountInfo(account=sender_addr, ledger_index="validated")
        response = self.client.request(acc_info).result
        sequence = response["account_data"]["Sequence"]
        sender_wallet = Wallet(seed=sender_seed, sequence=sequence)

        del_txn = AccountDelete(account=sender_addr, destination=receiver_addr)
        stxn = safe_sign_and_autofill_transaction(del_txn, sender_wallet, self.client)
        stxn_response = send_reliable_submission(stxn, self.client)
        stxn_result = stxn_response.result
        return stxn_result["meta"]["TransactionResult"]
    
    def merge_account(self, sender_addr: str, sender_seed: str, receiver_addr: str) -> str:
        """merge accounts on the ledger"""
        acc_info = AccountInfo(account=sender_addr, ledger_index="validated")
        response = self.client.request(acc_info).result
        sequence = response["account_data"]["Sequence"]
        sender_wallet = Wallet(seed=sender_seed, sequence=sequence)

        del_txn = AccountDelete(account=sender_addr, destination=receiver_addr)
        stxn = safe_sign_and_autofill_transaction(del_txn, sender_wallet, self.client)
        stxn_response = send_reliable_submission(stxn, self.client)
        stxn_result = stxn_response.result
        return stxn_result["meta"]["TransactionResult"]

    def create_xrp_check(self, sender_addr: str, sender_seed: str, receiver_addr: str, amount: Union[int, float, Decimal], expiry_date: Union[int, None]) -> str:
        """create xrp check"""
        # create wallet object
        acc_info = AccountInfo(account=sender_addr, ledger_index="validated")
        response = self.client.request(acc_info).result
        sequence = response["account_data"]["Sequence"]
        sender_wallet = Wallet(seed=sender_seed, sequence=sequence)

        check_txn = CheckCreate(account=sender_addr, destination=receiver_addr, send_max=xrp_to_drops(amount), expiration=expiry_date)
        stxn = safe_sign_and_autofill_transaction(check_txn, sender_wallet, self.client)
        stxn_response = send_reliable_submission(stxn, self.client)
        stxn_result = stxn_response.result
        return stxn_result["meta"]["TransactionResult"]

    def account_xrp_checks(self, wallet_addr: str, limit: int = None) -> dict:
        """return a dict of xrp checks an account sent or received"""
        checks_dict = {}
        sent = []
        receive = []
        req = AccountObjects(account=wallet_addr, ledger_index="validated", type="check", limit=limit)
        response = self.client.request(req)
        result = response.result
        account_checks = result["account_objects"]
        for check in account_checks:
            if isinstance(check["SendMax"], dict):
                pass
            else: 
                check_data = {}
                check_data["sender"] = check["Account"]
                check_data["receiver"] = check["Destination"]
                if "Expiration" in check:
                    check_data["expiry_date"] = str(ripple_time_to_datetime(check["Expiration"]))
                check_data["amount"] = str(drops_to_xrp(check["SendMax"]))
                check_data["check_id"] = check["index"]
                if check_data["sender"] == wallet_addr:
                    sent.append(check_data)
                elif check_data["sender"] != wallet_addr:
                    receive.append(check_data)
        checks_dict["sent"] = sent
        checks_dict["receive"] = receive
        return checks_dict

    def cash_xrp_check(self, sender_addr: str, sender_seed: str, check_id: str, amount: Union[int, Decimal, float]) -> str:
        """cash a check, only the receiver defined on creation
        can cash a check"""
        # sender is the check casher
        # create wallet object
        acc_info = AccountInfo(account=sender_addr, ledger_index="validated")
        response = self.client.request(acc_info).result
        sequence = response["account_data"]["Sequence"]
        sender_wallet = Wallet(seed=sender_seed, sequence=sequence)

        check_txn = CheckCash(account=sender_addr, check_id=check_id, amount=xrp_to_drops(amount))
        stxn = safe_sign_and_autofill_transaction(check_txn, sender_wallet, self.client)
        stxn_response = send_reliable_submission(stxn, self.client)
        stxn_result = stxn_response.result
        return stxn_result["meta"]["TransactionResult"]
    
    def cancel_check(self, sender_addr: str, sender_seed: str, check_id: str) -> str:
        """cancel a check"""
        # sender is the check creator or recipient
        # create wallet object
        # If the Check has expired, any address can cancel it
        acc_info = AccountInfo(account=sender_addr, ledger_index="validated")
        response = self.client.request(acc_info).result
        sequence = response["account_data"]["Sequence"]
        sender_wallet = Wallet(seed=sender_seed, sequence=sequence)

        check_txn = CheckCancel(account=sender_addr, check_id=check_id)
        stxn = safe_sign_and_autofill_transaction(check_txn, sender_wallet, self.client)
        
        stxn_response = send_reliable_submission(stxn, self.client)
        stxn_result = stxn_response.result
        return stxn_result["meta"]["TransactionResult"]   

    # xMisc.datetime_to_ripple_time()
    def create_asset_check(self, sender_addr: str, sender_seed: str, receiver_addr: str, currency_code: str, currency_amount: str, currency_issuer: str, expiry_date: Union[int, None]) -> str:
        """create an asset check"""
        # create wallet object 
        acc_info = AccountInfo(account=sender_addr, ledger_index="validated")
        response = self.client.request(acc_info).result
        sequence = response["account_data"]["Sequence"]
        sender_wallet = Wallet(seed=sender_seed, sequence=sequence)

        check_txn = CheckCreate(account=sender_addr, destination=receiver_addr,
        send_max=IssuedCurrencyAmount(
            currency=symbol_to_hex(currency_code), 
            issuer=currency_issuer, 
            value=currency_amount),
        expiration=expiry_date)
        stxn = safe_sign_and_autofill_transaction(check_txn, sender_wallet, self.client)
        
        stxn_response = send_reliable_submission(stxn, self.client)
        stxn_result = stxn_response.result
        return stxn_result["meta"]["TransactionResult"] 
    
    def cash_asset_check(self, sender_addr: str, sender_seed: str, check_id: str, currency_code: str, currency_amount: str, currency_issuer: str) -> str:
        """cash a check, only the receiver defined on creation
        can cash a check"""
        # sender is the check casher
        # create wallet object
        acc_info = AccountInfo(account=sender_addr, ledger_index="validated")
        response = self.client.request(acc_info).result
        sequence = response["account_data"]["Sequence"]
        sender_wallet = Wallet(seed=sender_seed, sequence=sequence)

        check_txn = CheckCash(account=sender_addr, check_id=check_id, amount=IssuedCurrencyAmount(
            currency=currency_code,
            issuer=currency_issuer,
            value=currency_amount))
        stxn = safe_sign_and_autofill_transaction(check_txn, sender_wallet, self.client)
        stxn_response = send_reliable_submission(stxn, self.client)
        stxn_result = stxn_response.result
        return stxn_result["meta"]["TransactionResult"]

    def account_asset_checks(self, wallet_addr: str, limit: int = None) -> dict:
        """return a dict of asset checks an account sent or received"""
        checks_dict = {}
        sent = []
        receive = []
        req = AccountObjects(account=wallet_addr, ledger_index="validated", type="check", limit=limit)
        response = self.client.request(req)
        result = response.result
        account_checks = result["account_objects"]
        for check in account_checks:
            if isinstance(check["SendMax"], dict):
                check_data = {}
                check_data["sender"] = check["Account"]
                check_data["receiver"] = check["Destination"]
                if "Expiration" in check:
                    check_data["expiry_date"] = str(ripple_time_to_datetime(check["Expiration"]))
                check_data["asset"] = hex_to_symbol(check["SendMax"]["currency"])
                check_data["issuer"] = check["SendMax"]["issuer"]
                check_data["amount"] = check["SendMax"]["value"]
                check_data["check_id"] = check["index"]
                if check_data["sender"] == wallet_addr:
                    sent.append(check_data)
                elif check_data["sender"] != wallet_addr:
                    receive.append(check_data)
        checks_dict["sent"] = sent
        checks_dict["receive"] = receive
        return checks_dict   
    
    def create_offer(self, sender_addr: str, sender_seed: str, pay: Union[float, IssuedCurrencyAmount], receive: Union[float, IssuedCurrencyAmount], expiry_date: Union[int, None]) -> str:
        """create an offer"""
        result = None
        req = AccountInfo(account=sender_addr, ledger_index="validated")
        response = self.client.request(req).result
        sequence = response["account_data"]["Sequence"]
        sender_wallet = Wallet(seed=sender_seed, sequence=sequence)

        if isinstance(pay, float) and isinstance(receive, IssuedCurrencyAmount): # check if pay == xrp and receive == asset
            create_txn = OfferCreate(account=sender_addr, taker_pays=xrp_to_drops(pay), taker_gets=receive, expiration=expiry_date)
            stxn = safe_sign_and_autofill_transaction(create_txn, sender_wallet, self.client)
            stxn_response = send_reliable_submission(stxn, self.client)
            stxn_result = stxn_response.result
            result = stxn_result["meta"]["TransactionResult"]

        if isinstance(pay, IssuedCurrencyAmount) and isinstance(receive, float): # check if pay == asset and receive == xrp
            create_txn = OfferCreate(account=sender_addr, taker_pays=pay, taker_gets=xrp_to_drops(receive), expiration=expiry_date)
            stxn = safe_sign_and_autofill_transaction(create_txn, sender_wallet, self.client)
            stxn_response = send_reliable_submission(stxn, self.client)
            stxn_result = stxn_response.result
            result = stxn_result["meta"]["TransactionResult"]

        if isinstance(pay, IssuedCurrencyAmount) and isinstance(receive, IssuedCurrencyAmount): # check if pay and receive are == asset
            create_txn = OfferCreate(account=sender_addr, taker_pays=pay, taker_gets=receive, expiration=expiry_date)
            stxn = safe_sign_and_autofill_transaction(create_txn, sender_wallet, self.client)
            stxn_response = send_reliable_submission(stxn, self.client)
            stxn_result = stxn_response.result
            result = stxn_result["meta"]["TransactionResult"]
        
        return result
    
    def account_offers(self, wallet_addr: str, limit: int = None) -> list:
        """return all offers an account created"""
        offer_list = []
        req = AccountOffers(account=wallet_addr, ledger_index="validated", limit=limit)
        response = self.client.request(req)
        result = response.result
        offers = result["offers"]

        for offer in offers:
            of = {}
            of["sequence"] = offer["seq"]
            # The exchange rate of the offer, as the ratio of the original taker_pays divided by the original taker_gets. rate = pay/get
            of["rate"] = str(drops_to_xrp(offer["quality"])) # rate is subject to error from the blockchain because xrp returned in this call has no decimal
            if isinstance(offer["taker_pays"], dict):
                give_info = {}
                give_info["asset"] = hex_to_symbol(offer["taker_pays"]["currency"])
                give_info["issuer"] = offer["taker_pays"]["issuer"]
                give_info["amount"] = offer["taker_pays"]["value"]
                of["give"] = give_info
            elif isinstance(offer["taker_pays"], str):
                of["give"] = str(drops_to_xrp(offer["taker_pays"]))

            if isinstance(offer["taker_gets"], dict):
                get_info = {}
                get_info["asset"] = hex_to_symbol(offer["taker_gets"]["currency"])
                get_info["issuer"] = offer["taker_gets"]["issuer"]
                get_info["amount"] = offer["taker_gets"]["value"]
                of["get"] = get_info
            elif isinstance(offer["taker_gets"], str):
                of["get"] = str(drops_to_xrp(offer["taker_gets"]))
            offer_list.append(of)
        return offer_list
    
    def cancel_offer(self, sender_addr: str, sender_seed: str, offer_seq: int) -> str:
        """cancel an offer"""
        acc_info = AccountInfo(account=sender_addr, ledger_index="validated")
        response = self.client.request(acc_info).result
        sequence = response["account_data"]["Sequence"]
        sender_wallet = Wallet(seed=sender_seed, sequence=sequence)

        cancel_txn = OfferCancel(account=sender_addr, offer_sequence=offer_seq)
        stxn = safe_sign_and_autofill_transaction(cancel_txn, sender_wallet, self.client)
        stxn_response = send_reliable_submission(stxn, self.client)
        stxn_result = stxn_response.result
        return stxn_result["meta"]["TransactionResult"]

    def all_offers(self, give: Union[XRP, IssuedCurrency], get: Union[XRP, IssuedCurrency], limit: int = None) -> list:
        """returns all offers for 2 pairs"""
        all_offers_list = []
        req = BookOffers(taker_gets=get, taker_pays=give, ledger_index="validated", limit=limit)
        response = self.client.request(req)
        result = response.result

        offers = result["offers"]
        for offer in offers:
            of = {}
            of["creator"] = offer["Account"]
            of["sequence"] = offer["Sequence"] # offer id
            # of["owner_funds"] = offer["owner_funds"] # Amount of the TakerGets currency the side placing the offer has available to be traded.
            if isinstance(offer["TakerPays"], dict):
                give_info = {}
                give_info["asset"] = hex_to_symbol(offer["TakerPays"]["currency"])
                give_info["issuer"] = offer["TakerPays"]["issuer"]
                give_info["amount"] = offer["TakerPays"]["value"]
                of["give"] = give_info
            elif isinstance(offer["TakerPays"], str):
                of["give"] = str(drops_to_xrp(offer["TakerPays"]))
            
            if isinstance(offer["TakerGets"], dict):
                get_info = {}
                get_info["asset"] = hex_to_symbol(offer["TakerGets"]["currency"])
                get_info["issuer"] = offer["TakerGets"]["issuer"]
                get_info["amount"] = offer["TakerGets"]["value"]
                of["get"] = get_info
            elif isinstance(offer["TakerGets"], str):
                of["get"] = str(drops_to_xrp(offer["TakerGets"]))
            all_offers_list.append(of)
        return all_offers_list
    
    def create_escrow(self, sender_addr: str, sender_seed: str, amount: Union[int, float, Decimal], receiver_addr: str, condition: Union[str, None], claim_date: Union[int, None], expiry_date: Union[int, None]) -> str:
        """create an Escrow\n
        You must use one `claim_date` or `expiry_date` unless this will fail"""
        acc_info = AccountInfo(account=sender_addr, ledger_index="validated")
        response = self.client.request(acc_info).result
        sequence = response["account_data"]["Sequence"]
        sender_wallet = Wallet(seed=sender_seed, sequence=sequence)

        create_txn = EscrowCreate(account=sender_addr, amount=xrp_to_drops(amount), destination=receiver_addr, finish_after=claim_date, cancel_after=expiry_date, condition=condition)
        stxn = safe_sign_and_autofill_transaction(create_txn, sender_wallet, self.client)
        stxn_response = send_reliable_submission(stxn, self.client)
        stxn_result = stxn_response.result
        return stxn_result["meta"]["TransactionResult"]

    def schedule_xrp(self, sender_addr: str, sender_seed: str, amount: Union[int, float, Decimal], receiver_addr: str, claim_date: int, expiry_date: Union[int, None]) -> str:
        """schedule an Xrp payment
        \n expiry date must be greater than claim date"""
        acc_info = AccountInfo(account=sender_addr, ledger_index="validated")
        response = self.client.request(acc_info).result
        sequence = response["account_data"]["Sequence"]
        sender_wallet = Wallet(seed=sender_seed, sequence=sequence)

        create_txn = EscrowCreate(account=sender_addr, amount=xrp_to_drops(amount), destination=receiver_addr, finish_after=claim_date, cancel_after=expiry_date)
        stxn = safe_sign_and_autofill_transaction(create_txn, sender_wallet, self.client)
        stxn_response = send_reliable_submission(stxn, self.client)
        stxn_result = stxn_response.result
        return stxn_result["meta"]["TransactionResult"]

    def account_escrows(self, wallet_addr: str, limit: int = None) -> dict:
        """returns all account escrows, used for returning scheduled payments"""
        escrow_dict = {}
        sent = []
        received = []
        req = AccountObjects(account=wallet_addr, ledger_index="validated", type="escrow", limit=limit)
        response = self.client.request(req)
        result = response.result

        escrows = result["account_objects"]
        for escrow in escrows:
            escrow_data = {}
            if isinstance(escrow["Amount"], str):
                escrow_data["escrow_id"] = escrow["index"]
                escrow_data["sender"] = escrow["Account"]
                escrow_data["receiver"] = escrow["Destination"]
                escrow_data["amount"] = str(drops_to_xrp(escrow["Amount"]))
                if "PreviousTxnID" in escrow:
                    escrow_data["prex_txn_id"] = escrow["PreviousTxnID"] # needed to cancel or complete the escrow
                if "FinishAfter" in escrow:
                    escrow_data["redeem_date"] = str(ripple_time_to_datetime(escrow["FinishAfter"]))
                if "CancelAfter" in escrow:
                    escrow_data["expiry_date"] = str(ripple_time_to_datetime(escrow["CancelAfter"]))
                if "Condition" in escrow:
                    escrow_data["condition"] = escrow["Condition"]

                if escrow_data["sender"] == wallet_addr:
                    sent.append(escrow_data)
                else:
                    received.append(escrow_data)
        escrow_dict["sent"] = sent
        escrow_dict["received"] = received
        return escrow_dict

    def cancel_escrow(self, sender_addr: str, sender_seed: str, escrow_creator: str, escrow_seq: str) -> str:
        """cancel an escrow"""
        acc_info = AccountInfo(account=sender_addr, ledger_index="validated")
        response = self.client.request(acc_info).result
        sequence = response["account_data"]["Sequence"]
        sender_wallet = Wallet(seed=sender_seed, sequence=sequence)

        cancel_txn = EscrowCancel(account=sender_addr, owner=escrow_creator, offer_sequence=escrow_seq)
        stxn = safe_sign_and_autofill_transaction(cancel_txn, sender_wallet, self.client)
        stxn_response = send_reliable_submission(stxn, self.client)
        stxn_result = stxn_response.result
        return stxn_result["meta"]["TransactionResult"]

    def finish_escrow(self, sender_addr: str, sender_seed: str, escrow_creator: str, escrow_seq: str, condition: Union[str, None], fulfillment: Union[str, None]) -> str:
        """complete an escrow"""
        acc_info = AccountInfo(account=sender_addr, ledger_index="validated")
        response = self.client.request(acc_info).result
        sequence = response["account_data"]["Sequence"]
        sender_wallet = Wallet(seed=sender_seed, sequence=sequence)

        finish_txn = EscrowFinish(account=sender_addr, owner=escrow_creator, offer_sequence=escrow_seq, condition=condition, fulfillment=fulfillment)
        stxn = safe_sign_and_autofill_transaction(finish_txn, sender_wallet, self.client)
        stxn_response = send_reliable_submission(stxn, self.client)
        stxn_result = stxn_response.result
        return stxn_result["meta"]["TransactionResult"]
    
    def mint_nft(self, sender_seed: str, nft_taxon: Union[int, None]) -> str:
        """mint nft"""
        sender_wallet = Wallet(seed=sender_seed, sequence=0)
        nft_mint = NFTokenMint(account=sender_wallet.classic_address, nftoken_taxon=nft_taxon)
        stxn = safe_sign_and_autofill_transaction(nft_mint, sender_wallet, self.client)
        stxn_response = send_reliable_submission(stxn, self.client)
        stxn_result = stxn_response.result
        return stxn_result["meta"]["TransactionResult"]
