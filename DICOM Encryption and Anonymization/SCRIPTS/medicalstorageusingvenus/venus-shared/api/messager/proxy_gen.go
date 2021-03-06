// Code generated by github.com/filecoin-project/venus/venus-devtool/api-gen. DO NOT EDIT.
package messager

import (
	"context"
	"time"

	address "github.com/filecoin-project/go-address"
	cid "github.com/ipfs/go-cid"

	shared "github.com/filecoin-project/venus/venus-shared/types"
	types "github.com/filecoin-project/venus/venus-shared/types/messager"
)

type IMessagerStruct struct {
	Internal struct {
		ActiveAddress            func(ctx context.Context, addr address.Address) error                                                                                    `perm:"admin"`
		ClearUnFillMessage       func(ctx context.Context, addr address.Address) (int, error)                                                                             `perm:"admin"`
		DeleteAddress            func(ctx context.Context, addr address.Address) error                                                                                    `perm:"admin"`
		DeleteNode               func(ctx context.Context, name string) error                                                                                             `perm:"admin"`
		ForbiddenAddress         func(ctx context.Context, addr address.Address) error                                                                                    `perm:"admin"`
		ForcePushMessage         func(ctx context.Context, account string, msg *shared.Message, meta *types.SendSpec) (string, error)                                     `perm:"admin"`
		ForcePushMessageWithId   func(ctx context.Context, id string, account string, msg *shared.Message, meta *types.SendSpec) (string, error)                          `perm:"write"`
		GetAddress               func(ctx context.Context, addr address.Address) (*types.Address, error)                                                                  `perm:"admin"`
		GetMessageByFromAndNonce func(ctx context.Context, from address.Address, nonce uint64) (*types.Message, error)                                                    `perm:"read"`
		GetMessageBySignedCid    func(ctx context.Context, cid cid.Cid) (*types.Message, error)                                                                           `perm:"read"`
		GetMessageByUid          func(ctx context.Context, id string) (*types.Message, error)                                                                             `perm:"read"`
		GetMessageByUnsignedCid  func(ctx context.Context, cid cid.Cid) (*types.Message, error)                                                                           `perm:"read"`
		GetNode                  func(ctx context.Context, name string) (*types.Node, error)                                                                              `perm:"admin"`
		GetSharedParams          func(ctx context.Context) (*types.SharedSpec, error)                                                                                     `perm:"admin"`
		HasAddress               func(ctx context.Context, addr address.Address) (bool, error)                                                                            `perm:"read"`
		HasMessageByUid          func(ctx context.Context, id string) (bool, error)                                                                                       `perm:"read"`
		HasNode                  func(ctx context.Context, name string) (bool, error)                                                                                     `perm:"admin"`
		ListAddress              func(ctx context.Context) ([]*types.Address, error)                                                                                      `perm:"admin"`
		ListBlockedMessage       func(ctx context.Context, addr address.Address, d time.Duration) ([]*types.Message, error)                                               `perm:"admin"`
		ListFailedMessage        func(ctx context.Context) ([]*types.Message, error)                                                                                      `perm:"admin"`
		ListMessage              func(ctx context.Context) ([]*types.Message, error)                                                                                      `perm:"admin"`
		ListMessageByAddress     func(ctx context.Context, addr address.Address) ([]*types.Message, error)                                                                `perm:"admin"`
		ListMessageByFromState   func(ctx context.Context, from address.Address, state types.MessageState, isAsc bool, pageIndex, pageSize int) ([]*types.Message, error) `perm:"admin"`
		ListNode                 func(ctx context.Context) ([]*types.Node, error)                                                                                         `perm:"admin"`
		MarkBadMessage           func(ctx context.Context, id string) error                                                                                               `perm:"admin"`
		PushMessage              func(ctx context.Context, msg *shared.Message, meta *types.SendSpec) (string, error)                                                     `perm:"write"`
		PushMessageWithId        func(ctx context.Context, id string, msg *shared.Message, meta *types.SendSpec) (string, error)                                          `perm:"write"`
		RecoverFailedMsg         func(ctx context.Context, addr address.Address) ([]string, error)                                                                        `perm:"admin"`
		RefreshSharedParams      func(ctx context.Context) error                                                                                                          `perm:"admin"`
		ReplaceMessage           func(ctx context.Context, params *types.ReplacMessageParams) (cid.Cid, error)                                                            `perm:"admin"`
		RepublishMessage         func(ctx context.Context, id string) error                                                                                               `perm:"admin"`
		SaveNode                 func(ctx context.Context, node *types.Node) error                                                                                        `perm:"admin"`
		Send                     func(ctx context.Context, params types.QuickSendParams) (string, error)                                                                  `perm:"admin"`
		SetFeeParams             func(ctx context.Context, addr address.Address, gasOverEstimation, gasOverPremium float64, maxFee, maxFeeCap string) error               `perm:"admin"`
		SetLogLevel              func(ctx context.Context, level string) error                                                                                            `perm:"admin"`
		SetSelectMsgNum          func(ctx context.Context, addr address.Address, num uint64) error                                                                        `perm:"admin"`
		SetSharedParams          func(ctx context.Context, params *types.SharedSpec) error                                                                                `perm:"admin"`
		UpdateAllFilledMessage   func(ctx context.Context) (int, error)                                                                                                   `perm:"admin"`
		UpdateFilledMessageByID  func(ctx context.Context, id string) (string, error)                                                                                     `perm:"admin"`
		UpdateMessageStateByID   func(ctx context.Context, id string, state types.MessageState) error                                                                     `perm:"admin"`
		UpdateNonce              func(ctx context.Context, addr address.Address, nonce uint64) error                                                                      `perm:"admin"`
		WaitMessage              func(ctx context.Context, id string, confidence uint64) (*types.Message, error)                                                          `perm:"read"`
		WalletHas                func(ctx context.Context, addr address.Address) (bool, error)                                                                            `perm:"read"`
	}
}

func (s *IMessagerStruct) ActiveAddress(p0 context.Context, p1 address.Address) error {
	return s.Internal.ActiveAddress(p0, p1)
}
func (s *IMessagerStruct) ClearUnFillMessage(p0 context.Context, p1 address.Address) (int, error) {
	return s.Internal.ClearUnFillMessage(p0, p1)
}
func (s *IMessagerStruct) DeleteAddress(p0 context.Context, p1 address.Address) error {
	return s.Internal.DeleteAddress(p0, p1)
}
func (s *IMessagerStruct) DeleteNode(p0 context.Context, p1 string) error {
	return s.Internal.DeleteNode(p0, p1)
}
func (s *IMessagerStruct) ForbiddenAddress(p0 context.Context, p1 address.Address) error {
	return s.Internal.ForbiddenAddress(p0, p1)
}
func (s *IMessagerStruct) ForcePushMessage(p0 context.Context, p1 string, p2 *shared.Message, p3 *types.SendSpec) (string, error) {
	return s.Internal.ForcePushMessage(p0, p1, p2, p3)
}
func (s *IMessagerStruct) ForcePushMessageWithId(p0 context.Context, p1 string, p2 string, p3 *shared.Message, p4 *types.SendSpec) (string, error) {
	return s.Internal.ForcePushMessageWithId(p0, p1, p2, p3, p4)
}
func (s *IMessagerStruct) GetAddress(p0 context.Context, p1 address.Address) (*types.Address, error) {
	return s.Internal.GetAddress(p0, p1)
}
func (s *IMessagerStruct) GetMessageByFromAndNonce(p0 context.Context, p1 address.Address, p2 uint64) (*types.Message, error) {
	return s.Internal.GetMessageByFromAndNonce(p0, p1, p2)
}
func (s *IMessagerStruct) GetMessageBySignedCid(p0 context.Context, p1 cid.Cid) (*types.Message, error) {
	return s.Internal.GetMessageBySignedCid(p0, p1)
}
func (s *IMessagerStruct) GetMessageByUid(p0 context.Context, p1 string) (*types.Message, error) {
	return s.Internal.GetMessageByUid(p0, p1)
}
func (s *IMessagerStruct) GetMessageByUnsignedCid(p0 context.Context, p1 cid.Cid) (*types.Message, error) {
	return s.Internal.GetMessageByUnsignedCid(p0, p1)
}
func (s *IMessagerStruct) GetNode(p0 context.Context, p1 string) (*types.Node, error) {
	return s.Internal.GetNode(p0, p1)
}
func (s *IMessagerStruct) GetSharedParams(p0 context.Context) (*types.SharedSpec, error) {
	return s.Internal.GetSharedParams(p0)
}
func (s *IMessagerStruct) HasAddress(p0 context.Context, p1 address.Address) (bool, error) {
	return s.Internal.HasAddress(p0, p1)
}
func (s *IMessagerStruct) HasMessageByUid(p0 context.Context, p1 string) (bool, error) {
	return s.Internal.HasMessageByUid(p0, p1)
}
func (s *IMessagerStruct) HasNode(p0 context.Context, p1 string) (bool, error) {
	return s.Internal.HasNode(p0, p1)
}
func (s *IMessagerStruct) ListAddress(p0 context.Context) ([]*types.Address, error) {
	return s.Internal.ListAddress(p0)
}
func (s *IMessagerStruct) ListBlockedMessage(p0 context.Context, p1 address.Address, p2 time.Duration) ([]*types.Message, error) {
	return s.Internal.ListBlockedMessage(p0, p1, p2)
}
func (s *IMessagerStruct) ListFailedMessage(p0 context.Context) ([]*types.Message, error) {
	return s.Internal.ListFailedMessage(p0)
}
func (s *IMessagerStruct) ListMessage(p0 context.Context) ([]*types.Message, error) {
	return s.Internal.ListMessage(p0)
}
func (s *IMessagerStruct) ListMessageByAddress(p0 context.Context, p1 address.Address) ([]*types.Message, error) {
	return s.Internal.ListMessageByAddress(p0, p1)
}
func (s *IMessagerStruct) ListMessageByFromState(p0 context.Context, p1 address.Address, p2 types.MessageState, p3 bool, p4, p5 int) ([]*types.Message, error) {
	return s.Internal.ListMessageByFromState(p0, p1, p2, p3, p4, p5)
}
func (s *IMessagerStruct) ListNode(p0 context.Context) ([]*types.Node, error) {
	return s.Internal.ListNode(p0)
}
func (s *IMessagerStruct) MarkBadMessage(p0 context.Context, p1 string) error {
	return s.Internal.MarkBadMessage(p0, p1)
}
func (s *IMessagerStruct) PushMessage(p0 context.Context, p1 *shared.Message, p2 *types.SendSpec) (string, error) {
	return s.Internal.PushMessage(p0, p1, p2)
}
func (s *IMessagerStruct) PushMessageWithId(p0 context.Context, p1 string, p2 *shared.Message, p3 *types.SendSpec) (string, error) {
	return s.Internal.PushMessageWithId(p0, p1, p2, p3)
}
func (s *IMessagerStruct) RecoverFailedMsg(p0 context.Context, p1 address.Address) ([]string, error) {
	return s.Internal.RecoverFailedMsg(p0, p1)
}
func (s *IMessagerStruct) RefreshSharedParams(p0 context.Context) error {
	return s.Internal.RefreshSharedParams(p0)
}
func (s *IMessagerStruct) ReplaceMessage(p0 context.Context, p1 *types.ReplacMessageParams) (cid.Cid, error) {
	return s.Internal.ReplaceMessage(p0, p1)
}
func (s *IMessagerStruct) RepublishMessage(p0 context.Context, p1 string) error {
	return s.Internal.RepublishMessage(p0, p1)
}
func (s *IMessagerStruct) SaveNode(p0 context.Context, p1 *types.Node) error {
	return s.Internal.SaveNode(p0, p1)
}
func (s *IMessagerStruct) Send(p0 context.Context, p1 types.QuickSendParams) (string, error) {
	return s.Internal.Send(p0, p1)
}
func (s *IMessagerStruct) SetFeeParams(p0 context.Context, p1 address.Address, p2, p3 float64, p4, p5 string) error {
	return s.Internal.SetFeeParams(p0, p1, p2, p3, p4, p5)
}
func (s *IMessagerStruct) SetLogLevel(p0 context.Context, p1 string) error {
	return s.Internal.SetLogLevel(p0, p1)
}
func (s *IMessagerStruct) SetSelectMsgNum(p0 context.Context, p1 address.Address, p2 uint64) error {
	return s.Internal.SetSelectMsgNum(p0, p1, p2)
}
func (s *IMessagerStruct) SetSharedParams(p0 context.Context, p1 *types.SharedSpec) error {
	return s.Internal.SetSharedParams(p0, p1)
}
func (s *IMessagerStruct) UpdateAllFilledMessage(p0 context.Context) (int, error) {
	return s.Internal.UpdateAllFilledMessage(p0)
}
func (s *IMessagerStruct) UpdateFilledMessageByID(p0 context.Context, p1 string) (string, error) {
	return s.Internal.UpdateFilledMessageByID(p0, p1)
}
func (s *IMessagerStruct) UpdateMessageStateByID(p0 context.Context, p1 string, p2 types.MessageState) error {
	return s.Internal.UpdateMessageStateByID(p0, p1, p2)
}
func (s *IMessagerStruct) UpdateNonce(p0 context.Context, p1 address.Address, p2 uint64) error {
	return s.Internal.UpdateNonce(p0, p1, p2)
}
func (s *IMessagerStruct) WaitMessage(p0 context.Context, p1 string, p2 uint64) (*types.Message, error) {
	return s.Internal.WaitMessage(p0, p1, p2)
}
func (s *IMessagerStruct) WalletHas(p0 context.Context, p1 address.Address) (bool, error) {
	return s.Internal.WalletHas(p0, p1)
}
