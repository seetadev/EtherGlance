// Code generated by github.com/filecoin-project/venus/venus-devtool/api-gen. DO NOT EDIT.
package client

import (
	"context"

	address "github.com/filecoin-project/go-address"
	datatransfer "github.com/filecoin-project/go-data-transfer"
	"github.com/filecoin-project/go-fil-markets/retrievalmarket"
	"github.com/filecoin-project/go-fil-markets/storagemarket"
	cid "github.com/ipfs/go-cid"
	"github.com/libp2p/go-libp2p-core/peer"

	"github.com/filecoin-project/venus/venus-shared/types"
	"github.com/filecoin-project/venus/venus-shared/types/market"
	"github.com/filecoin-project/venus/venus-shared/types/market/client"
)

type IMarketClientStruct struct {
	Internal struct {
		ClientCalcCommP                           func(ctx context.Context, inpath string) (*client.CommPRet, error)                                         `perm:"write"`
		ClientCancelDataTransfer                  func(ctx context.Context, transferID datatransfer.TransferID, otherPeer peer.ID, isInitiator bool) error   `perm:"write"`
		ClientCancelRetrievalDeal                 func(ctx context.Context, dealid retrievalmarket.DealID) error                                             `perm:"write"`
		ClientDataTransferUpdates                 func(ctx context.Context) (<-chan market.DataTransferChannel, error)                                       `perm:"write"`
		ClientDealPieceCID                        func(ctx context.Context, root cid.Cid) (client.DataCIDSize, error)                                        `perm:"read"`
		ClientDealSize                            func(ctx context.Context, root cid.Cid) (client.DataSize, error)                                           `perm:"read"`
		ClientExport                              func(ctx context.Context, exportRef client.ExportRef, fileRef client.FileRef) error                        `perm:"admin"`
		ClientFindData                            func(ctx context.Context, root cid.Cid, piece *cid.Cid) ([]client.QueryOffer, error)                       `perm:"read"`
		ClientGenCar                              func(ctx context.Context, ref client.FileRef, outpath string) error                                        `perm:"write"`
		ClientGetDealInfo                         func(context.Context, cid.Cid) (*client.DealInfo, error)                                                   `perm:"read"`
		ClientGetDealStatus                       func(ctx context.Context, statusCode uint64) (string, error)                                               `perm:"read"`
		ClientGetDealUpdates                      func(ctx context.Context) (<-chan client.DealInfo, error)                                                  `perm:"write"`
		ClientGetRetrievalUpdates                 func(ctx context.Context) (<-chan client.RetrievalInfo, error)                                             `perm:"write"`
		ClientHasLocal                            func(ctx context.Context, root cid.Cid) (bool, error)                                                      `perm:"write"`
		ClientImport                              func(ctx context.Context, ref client.FileRef) (*client.ImportRes, error)                                   `perm:"admin"`
		ClientListDataTransfers                   func(ctx context.Context) ([]market.DataTransferChannel, error)                                            `perm:"write"`
		ClientListDeals                           func(ctx context.Context) ([]client.DealInfo, error)                                                       `perm:"write"`
		ClientListImports                         func(ctx context.Context) ([]client.Import, error)                                                         `perm:"write"`
		ClientListRetrievals                      func(ctx context.Context) ([]client.RetrievalInfo, error)                                                  `perm:"write"`
		ClientMinerQueryOffer                     func(ctx context.Context, miner address.Address, root cid.Cid, piece *cid.Cid) (client.QueryOffer, error)  `perm:"read"`
		ClientQueryAsk                            func(ctx context.Context, p peer.ID, miner address.Address) (*storagemarket.StorageAsk, error)             `perm:"read"`
		ClientRemoveImport                        func(ctx context.Context, importID client.ImportID) error                                                  `perm:"admin"`
		ClientRestartDataTransfer                 func(ctx context.Context, transferID datatransfer.TransferID, otherPeer peer.ID, isInitiator bool) error   `perm:"write"`
		ClientRetrieve                            func(ctx context.Context, params client.RetrievalOrder) (*client.RestrievalRes, error)                     `perm:"admin"`
		ClientRetrieveTryRestartInsufficientFunds func(ctx context.Context, paymentChannel address.Address) error                                            `perm:"write"`
		ClientRetrieveWait                        func(ctx context.Context, deal retrievalmarket.DealID) error                                               `perm:"admin"`
		ClientStartDeal                           func(ctx context.Context, params *client.StartDealParams) (*cid.Cid, error)                                `perm:"admin"`
		ClientStatelessDeal                       func(ctx context.Context, params *client.StartDealParams) (*cid.Cid, error)                                `perm:"write"`
		DefaultAddress                            func(ctx context.Context) (address.Address, error)                                                         `perm:"read"`
		MarketAddBalance                          func(ctx context.Context, wallet, addr address.Address, amt types.BigInt) (cid.Cid, error)                 `perm:"write"`
		MarketGetReserved                         func(ctx context.Context, addr address.Address) (types.BigInt, error)                                      `perm:"read"`
		MarketReleaseFunds                        func(ctx context.Context, addr address.Address, amt types.BigInt) error                                    `perm:"write"`
		MarketReserveFunds                        func(ctx context.Context, wallet address.Address, addr address.Address, amt types.BigInt) (cid.Cid, error) `perm:"write"`
		MarketWithdraw                            func(ctx context.Context, wallet, addr address.Address, amt types.BigInt) (cid.Cid, error)                 `perm:"write"`
		MessagerGetMessage                        func(ctx context.Context, mid cid.Cid) (*types.Message, error)                                             `perm:"read"`
		MessagerPushMessage                       func(ctx context.Context, msg *types.Message, meta *types.MessageSendSpec) (cid.Cid, error)                `perm:"write"`
		MessagerWaitMessage                       func(ctx context.Context, mid cid.Cid) (*types.MsgLookup, error)                                           `perm:"read"`
	}
}

func (s *IMarketClientStruct) ClientCalcCommP(p0 context.Context, p1 string) (*client.CommPRet, error) {
	return s.Internal.ClientCalcCommP(p0, p1)
}
func (s *IMarketClientStruct) ClientCancelDataTransfer(p0 context.Context, p1 datatransfer.TransferID, p2 peer.ID, p3 bool) error {
	return s.Internal.ClientCancelDataTransfer(p0, p1, p2, p3)
}
func (s *IMarketClientStruct) ClientCancelRetrievalDeal(p0 context.Context, p1 retrievalmarket.DealID) error {
	return s.Internal.ClientCancelRetrievalDeal(p0, p1)
}
func (s *IMarketClientStruct) ClientDataTransferUpdates(p0 context.Context) (<-chan market.DataTransferChannel, error) {
	return s.Internal.ClientDataTransferUpdates(p0)
}
func (s *IMarketClientStruct) ClientDealPieceCID(p0 context.Context, p1 cid.Cid) (client.DataCIDSize, error) {
	return s.Internal.ClientDealPieceCID(p0, p1)
}
func (s *IMarketClientStruct) ClientDealSize(p0 context.Context, p1 cid.Cid) (client.DataSize, error) {
	return s.Internal.ClientDealSize(p0, p1)
}
func (s *IMarketClientStruct) ClientExport(p0 context.Context, p1 client.ExportRef, p2 client.FileRef) error {
	return s.Internal.ClientExport(p0, p1, p2)
}
func (s *IMarketClientStruct) ClientFindData(p0 context.Context, p1 cid.Cid, p2 *cid.Cid) ([]client.QueryOffer, error) {
	return s.Internal.ClientFindData(p0, p1, p2)
}
func (s *IMarketClientStruct) ClientGenCar(p0 context.Context, p1 client.FileRef, p2 string) error {
	return s.Internal.ClientGenCar(p0, p1, p2)
}
func (s *IMarketClientStruct) ClientGetDealInfo(p0 context.Context, p1 cid.Cid) (*client.DealInfo, error) {
	return s.Internal.ClientGetDealInfo(p0, p1)
}
func (s *IMarketClientStruct) ClientGetDealStatus(p0 context.Context, p1 uint64) (string, error) {
	return s.Internal.ClientGetDealStatus(p0, p1)
}
func (s *IMarketClientStruct) ClientGetDealUpdates(p0 context.Context) (<-chan client.DealInfo, error) {
	return s.Internal.ClientGetDealUpdates(p0)
}
func (s *IMarketClientStruct) ClientGetRetrievalUpdates(p0 context.Context) (<-chan client.RetrievalInfo, error) {
	return s.Internal.ClientGetRetrievalUpdates(p0)
}
func (s *IMarketClientStruct) ClientHasLocal(p0 context.Context, p1 cid.Cid) (bool, error) {
	return s.Internal.ClientHasLocal(p0, p1)
}
func (s *IMarketClientStruct) ClientImport(p0 context.Context, p1 client.FileRef) (*client.ImportRes, error) {
	return s.Internal.ClientImport(p0, p1)
}
func (s *IMarketClientStruct) ClientListDataTransfers(p0 context.Context) ([]market.DataTransferChannel, error) {
	return s.Internal.ClientListDataTransfers(p0)
}
func (s *IMarketClientStruct) ClientListDeals(p0 context.Context) ([]client.DealInfo, error) {
	return s.Internal.ClientListDeals(p0)
}
func (s *IMarketClientStruct) ClientListImports(p0 context.Context) ([]client.Import, error) {
	return s.Internal.ClientListImports(p0)
}
func (s *IMarketClientStruct) ClientListRetrievals(p0 context.Context) ([]client.RetrievalInfo, error) {
	return s.Internal.ClientListRetrievals(p0)
}
func (s *IMarketClientStruct) ClientMinerQueryOffer(p0 context.Context, p1 address.Address, p2 cid.Cid, p3 *cid.Cid) (client.QueryOffer, error) {
	return s.Internal.ClientMinerQueryOffer(p0, p1, p2, p3)
}
func (s *IMarketClientStruct) ClientQueryAsk(p0 context.Context, p1 peer.ID, p2 address.Address) (*storagemarket.StorageAsk, error) {
	return s.Internal.ClientQueryAsk(p0, p1, p2)
}
func (s *IMarketClientStruct) ClientRemoveImport(p0 context.Context, p1 client.ImportID) error {
	return s.Internal.ClientRemoveImport(p0, p1)
}
func (s *IMarketClientStruct) ClientRestartDataTransfer(p0 context.Context, p1 datatransfer.TransferID, p2 peer.ID, p3 bool) error {
	return s.Internal.ClientRestartDataTransfer(p0, p1, p2, p3)
}
func (s *IMarketClientStruct) ClientRetrieve(p0 context.Context, p1 client.RetrievalOrder) (*client.RestrievalRes, error) {
	return s.Internal.ClientRetrieve(p0, p1)
}
func (s *IMarketClientStruct) ClientRetrieveTryRestartInsufficientFunds(p0 context.Context, p1 address.Address) error {
	return s.Internal.ClientRetrieveTryRestartInsufficientFunds(p0, p1)
}
func (s *IMarketClientStruct) ClientRetrieveWait(p0 context.Context, p1 retrievalmarket.DealID) error {
	return s.Internal.ClientRetrieveWait(p0, p1)
}
func (s *IMarketClientStruct) ClientStartDeal(p0 context.Context, p1 *client.StartDealParams) (*cid.Cid, error) {
	return s.Internal.ClientStartDeal(p0, p1)
}
func (s *IMarketClientStruct) ClientStatelessDeal(p0 context.Context, p1 *client.StartDealParams) (*cid.Cid, error) {
	return s.Internal.ClientStatelessDeal(p0, p1)
}
func (s *IMarketClientStruct) DefaultAddress(p0 context.Context) (address.Address, error) {
	return s.Internal.DefaultAddress(p0)
}
func (s *IMarketClientStruct) MarketAddBalance(p0 context.Context, p1, p2 address.Address, p3 types.BigInt) (cid.Cid, error) {
	return s.Internal.MarketAddBalance(p0, p1, p2, p3)
}
func (s *IMarketClientStruct) MarketGetReserved(p0 context.Context, p1 address.Address) (types.BigInt, error) {
	return s.Internal.MarketGetReserved(p0, p1)
}
func (s *IMarketClientStruct) MarketReleaseFunds(p0 context.Context, p1 address.Address, p2 types.BigInt) error {
	return s.Internal.MarketReleaseFunds(p0, p1, p2)
}
func (s *IMarketClientStruct) MarketReserveFunds(p0 context.Context, p1 address.Address, p2 address.Address, p3 types.BigInt) (cid.Cid, error) {
	return s.Internal.MarketReserveFunds(p0, p1, p2, p3)
}
func (s *IMarketClientStruct) MarketWithdraw(p0 context.Context, p1, p2 address.Address, p3 types.BigInt) (cid.Cid, error) {
	return s.Internal.MarketWithdraw(p0, p1, p2, p3)
}
func (s *IMarketClientStruct) MessagerGetMessage(p0 context.Context, p1 cid.Cid) (*types.Message, error) {
	return s.Internal.MessagerGetMessage(p0, p1)
}
func (s *IMarketClientStruct) MessagerPushMessage(p0 context.Context, p1 *types.Message, p2 *types.MessageSendSpec) (cid.Cid, error) {
	return s.Internal.MessagerPushMessage(p0, p1, p2)
}
func (s *IMarketClientStruct) MessagerWaitMessage(p0 context.Context, p1 cid.Cid) (*types.MsgLookup, error) {
	return s.Internal.MessagerWaitMessage(p0, p1)
}
