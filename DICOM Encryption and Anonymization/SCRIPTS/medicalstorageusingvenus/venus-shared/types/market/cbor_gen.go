// Code generated by github.com/whyrusleeping/cbor-gen. DO NOT EDIT.

package market

import (
	"fmt"
	"io"
	"math"
	"sort"

	address "github.com/filecoin-project/go-address"
	datatransfer "github.com/filecoin-project/go-data-transfer"
	filestore "github.com/filecoin-project/go-fil-markets/filestore"
	retrievalmarket "github.com/filecoin-project/go-fil-markets/retrievalmarket"
	storagemarket "github.com/filecoin-project/go-fil-markets/storagemarket"
	abi "github.com/filecoin-project/go-state-types/abi"
	paych "github.com/filecoin-project/go-state-types/builtin/v8/paych"
	cid "github.com/ipfs/go-cid"
	peer "github.com/libp2p/go-libp2p-core/peer"
	cbg "github.com/whyrusleeping/cbor-gen"
	xerrors "golang.org/x/xerrors"
)

var _ = xerrors.Errorf
var _ = cid.Undef
var _ = math.E
var _ = sort.Sort

var lengthBufFundedAddressState = []byte{131}

func (t *FundedAddressState) MarshalCBOR(w io.Writer) error {
	if t == nil {
		_, err := w.Write(cbg.CborNull)
		return err
	}

	cw := cbg.NewCborWriter(w)

	if _, err := cw.Write(lengthBufFundedAddressState); err != nil {
		return err
	}

	// t.Addr (address.Address) (struct)
	if err := t.Addr.MarshalCBOR(cw); err != nil {
		return err
	}

	// t.AmtReserved (big.Int) (struct)
	if err := t.AmtReserved.MarshalCBOR(cw); err != nil {
		return err
	}

	// t.MsgCid (cid.Cid) (struct)

	if t.MsgCid == nil {
		if _, err := cw.Write(cbg.CborNull); err != nil {
			return err
		}
	} else {
		if err := cbg.WriteCid(cw, *t.MsgCid); err != nil {
			return xerrors.Errorf("failed to write cid field t.MsgCid: %w", err)
		}
	}

	return nil
}

func (t *FundedAddressState) UnmarshalCBOR(r io.Reader) (err error) {
	*t = FundedAddressState{}

	cr := cbg.NewCborReader(r)

	maj, extra, err := cr.ReadHeader()
	if err != nil {
		return err
	}
	defer func() {
		if err == io.EOF {
			err = io.ErrUnexpectedEOF
		}
	}()

	if maj != cbg.MajArray {
		return fmt.Errorf("cbor input should be of type array")
	}

	if extra != 3 {
		return fmt.Errorf("cbor input had wrong number of fields")
	}

	// t.Addr (address.Address) (struct)

	{

		if err := t.Addr.UnmarshalCBOR(cr); err != nil {
			return xerrors.Errorf("unmarshaling t.Addr: %w", err)
		}

	}
	// t.AmtReserved (big.Int) (struct)

	{

		if err := t.AmtReserved.UnmarshalCBOR(cr); err != nil {
			return xerrors.Errorf("unmarshaling t.AmtReserved: %w", err)
		}

	}
	// t.MsgCid (cid.Cid) (struct)

	{

		b, err := cr.ReadByte()
		if err != nil {
			return err
		}
		if b != cbg.CborNull[0] {
			if err := cr.UnreadByte(); err != nil {
				return err
			}

			c, err := cbg.ReadCid(cr)
			if err != nil {
				return xerrors.Errorf("failed to read cid field t.MsgCid: %w", err)
			}

			t.MsgCid = &c
		}

	}
	return nil
}

var lengthBufMsgInfo = []byte{132}

func (t *MsgInfo) MarshalCBOR(w io.Writer) error {
	if t == nil {
		_, err := w.Write(cbg.CborNull)
		return err
	}

	cw := cbg.NewCborWriter(w)

	if _, err := cw.Write(lengthBufMsgInfo); err != nil {
		return err
	}

	// t.ChannelID (string) (string)
	if len(t.ChannelID) > cbg.MaxLength {
		return xerrors.Errorf("Value in field t.ChannelID was too long")
	}

	if err := cw.WriteMajorTypeHeader(cbg.MajTextString, uint64(len(t.ChannelID))); err != nil {
		return err
	}
	if _, err := io.WriteString(w, string(t.ChannelID)); err != nil {
		return err
	}

	// t.MsgCid (cid.Cid) (struct)

	if err := cbg.WriteCid(cw, t.MsgCid); err != nil {
		return xerrors.Errorf("failed to write cid field t.MsgCid: %w", err)
	}

	// t.Received (bool) (bool)
	if err := cbg.WriteBool(w, t.Received); err != nil {
		return err
	}

	// t.Err (string) (string)
	if len(t.Err) > cbg.MaxLength {
		return xerrors.Errorf("Value in field t.Err was too long")
	}

	if err := cw.WriteMajorTypeHeader(cbg.MajTextString, uint64(len(t.Err))); err != nil {
		return err
	}
	if _, err := io.WriteString(w, string(t.Err)); err != nil {
		return err
	}
	return nil
}

func (t *MsgInfo) UnmarshalCBOR(r io.Reader) (err error) {
	*t = MsgInfo{}

	cr := cbg.NewCborReader(r)

	maj, extra, err := cr.ReadHeader()
	if err != nil {
		return err
	}
	defer func() {
		if err == io.EOF {
			err = io.ErrUnexpectedEOF
		}
	}()

	if maj != cbg.MajArray {
		return fmt.Errorf("cbor input should be of type array")
	}

	if extra != 4 {
		return fmt.Errorf("cbor input had wrong number of fields")
	}

	// t.ChannelID (string) (string)

	{
		sval, err := cbg.ReadString(cr)
		if err != nil {
			return err
		}

		t.ChannelID = string(sval)
	}
	// t.MsgCid (cid.Cid) (struct)

	{

		c, err := cbg.ReadCid(cr)
		if err != nil {
			return xerrors.Errorf("failed to read cid field t.MsgCid: %w", err)
		}

		t.MsgCid = c

	}
	// t.Received (bool) (bool)

	maj, extra, err = cr.ReadHeader()
	if err != nil {
		return err
	}
	if maj != cbg.MajOther {
		return fmt.Errorf("booleans must be major type 7")
	}
	switch extra {
	case 20:
		t.Received = false
	case 21:
		t.Received = true
	default:
		return fmt.Errorf("booleans are either major type 7, value 20 or 21 (got %d)", extra)
	}
	// t.Err (string) (string)

	{
		sval, err := cbg.ReadString(cr)
		if err != nil {
			return err
		}

		t.Err = string(sval)
	}
	return nil
}

var lengthBufChannelInfo = []byte{140}

func (t *ChannelInfo) MarshalCBOR(w io.Writer) error {
	if t == nil {
		_, err := w.Write(cbg.CborNull)
		return err
	}

	cw := cbg.NewCborWriter(w)

	if _, err := cw.Write(lengthBufChannelInfo); err != nil {
		return err
	}

	// t.ChannelID (string) (string)
	if len(t.ChannelID) > cbg.MaxLength {
		return xerrors.Errorf("Value in field t.ChannelID was too long")
	}

	if err := cw.WriteMajorTypeHeader(cbg.MajTextString, uint64(len(t.ChannelID))); err != nil {
		return err
	}
	if _, err := io.WriteString(w, string(t.ChannelID)); err != nil {
		return err
	}

	// t.Channel (address.Address) (struct)
	if err := t.Channel.MarshalCBOR(cw); err != nil {
		return err
	}

	// t.Control (address.Address) (struct)
	if err := t.Control.MarshalCBOR(cw); err != nil {
		return err
	}

	// t.Target (address.Address) (struct)
	if err := t.Target.MarshalCBOR(cw); err != nil {
		return err
	}

	// t.Direction (uint64) (uint64)

	if err := cw.WriteMajorTypeHeader(cbg.MajUnsignedInt, uint64(t.Direction)); err != nil {
		return err
	}

	// t.Vouchers ([]*market.VoucherInfo) (slice)
	if len(t.Vouchers) > cbg.MaxLength {
		return xerrors.Errorf("Slice value in field t.Vouchers was too long")
	}

	if err := cw.WriteMajorTypeHeader(cbg.MajArray, uint64(len(t.Vouchers))); err != nil {
		return err
	}
	for _, v := range t.Vouchers {
		if err := v.MarshalCBOR(cw); err != nil {
			return err
		}
	}

	// t.NextLane (uint64) (uint64)

	if err := cw.WriteMajorTypeHeader(cbg.MajUnsignedInt, uint64(t.NextLane)); err != nil {
		return err
	}

	// t.Amount (big.Int) (struct)
	if err := t.Amount.MarshalCBOR(cw); err != nil {
		return err
	}

	// t.PendingAmount (big.Int) (struct)
	if err := t.PendingAmount.MarshalCBOR(cw); err != nil {
		return err
	}

	// t.CreateMsg (cid.Cid) (struct)

	if t.CreateMsg == nil {
		if _, err := cw.Write(cbg.CborNull); err != nil {
			return err
		}
	} else {
		if err := cbg.WriteCid(cw, *t.CreateMsg); err != nil {
			return xerrors.Errorf("failed to write cid field t.CreateMsg: %w", err)
		}
	}

	// t.AddFundsMsg (cid.Cid) (struct)

	if t.AddFundsMsg == nil {
		if _, err := cw.Write(cbg.CborNull); err != nil {
			return err
		}
	} else {
		if err := cbg.WriteCid(cw, *t.AddFundsMsg); err != nil {
			return xerrors.Errorf("failed to write cid field t.AddFundsMsg: %w", err)
		}
	}

	// t.Settling (bool) (bool)
	if err := cbg.WriteBool(w, t.Settling); err != nil {
		return err
	}
	return nil
}

func (t *ChannelInfo) UnmarshalCBOR(r io.Reader) (err error) {
	*t = ChannelInfo{}

	cr := cbg.NewCborReader(r)

	maj, extra, err := cr.ReadHeader()
	if err != nil {
		return err
	}
	defer func() {
		if err == io.EOF {
			err = io.ErrUnexpectedEOF
		}
	}()

	if maj != cbg.MajArray {
		return fmt.Errorf("cbor input should be of type array")
	}

	if extra != 12 {
		return fmt.Errorf("cbor input had wrong number of fields")
	}

	// t.ChannelID (string) (string)

	{
		sval, err := cbg.ReadString(cr)
		if err != nil {
			return err
		}

		t.ChannelID = string(sval)
	}
	// t.Channel (address.Address) (struct)

	{

		b, err := cr.ReadByte()
		if err != nil {
			return err
		}
		if b != cbg.CborNull[0] {
			if err := cr.UnreadByte(); err != nil {
				return err
			}
			t.Channel = new(address.Address)
			if err := t.Channel.UnmarshalCBOR(cr); err != nil {
				return xerrors.Errorf("unmarshaling t.Channel pointer: %w", err)
			}
		}

	}
	// t.Control (address.Address) (struct)

	{

		if err := t.Control.UnmarshalCBOR(cr); err != nil {
			return xerrors.Errorf("unmarshaling t.Control: %w", err)
		}

	}
	// t.Target (address.Address) (struct)

	{

		if err := t.Target.UnmarshalCBOR(cr); err != nil {
			return xerrors.Errorf("unmarshaling t.Target: %w", err)
		}

	}
	// t.Direction (uint64) (uint64)

	{

		maj, extra, err = cr.ReadHeader()
		if err != nil {
			return err
		}
		if maj != cbg.MajUnsignedInt {
			return fmt.Errorf("wrong type for uint64 field")
		}
		t.Direction = uint64(extra)

	}
	// t.Vouchers ([]*market.VoucherInfo) (slice)

	maj, extra, err = cr.ReadHeader()
	if err != nil {
		return err
	}

	if extra > cbg.MaxLength {
		return fmt.Errorf("t.Vouchers: array too large (%d)", extra)
	}

	if maj != cbg.MajArray {
		return fmt.Errorf("expected cbor array")
	}

	if extra > 0 {
		t.Vouchers = make([]*VoucherInfo, extra)
	}

	for i := 0; i < int(extra); i++ {

		var v VoucherInfo
		if err := v.UnmarshalCBOR(cr); err != nil {
			return err
		}

		t.Vouchers[i] = &v
	}

	// t.NextLane (uint64) (uint64)

	{

		maj, extra, err = cr.ReadHeader()
		if err != nil {
			return err
		}
		if maj != cbg.MajUnsignedInt {
			return fmt.Errorf("wrong type for uint64 field")
		}
		t.NextLane = uint64(extra)

	}
	// t.Amount (big.Int) (struct)

	{

		if err := t.Amount.UnmarshalCBOR(cr); err != nil {
			return xerrors.Errorf("unmarshaling t.Amount: %w", err)
		}

	}
	// t.PendingAmount (big.Int) (struct)

	{

		if err := t.PendingAmount.UnmarshalCBOR(cr); err != nil {
			return xerrors.Errorf("unmarshaling t.PendingAmount: %w", err)
		}

	}
	// t.CreateMsg (cid.Cid) (struct)

	{

		b, err := cr.ReadByte()
		if err != nil {
			return err
		}
		if b != cbg.CborNull[0] {
			if err := cr.UnreadByte(); err != nil {
				return err
			}

			c, err := cbg.ReadCid(cr)
			if err != nil {
				return xerrors.Errorf("failed to read cid field t.CreateMsg: %w", err)
			}

			t.CreateMsg = &c
		}

	}
	// t.AddFundsMsg (cid.Cid) (struct)

	{

		b, err := cr.ReadByte()
		if err != nil {
			return err
		}
		if b != cbg.CborNull[0] {
			if err := cr.UnreadByte(); err != nil {
				return err
			}

			c, err := cbg.ReadCid(cr)
			if err != nil {
				return xerrors.Errorf("failed to read cid field t.AddFundsMsg: %w", err)
			}

			t.AddFundsMsg = &c
		}

	}
	// t.Settling (bool) (bool)

	maj, extra, err = cr.ReadHeader()
	if err != nil {
		return err
	}
	if maj != cbg.MajOther {
		return fmt.Errorf("booleans must be major type 7")
	}
	switch extra {
	case 20:
		t.Settling = false
	case 21:
		t.Settling = true
	default:
		return fmt.Errorf("booleans are either major type 7, value 20 or 21 (got %d)", extra)
	}
	return nil
}

var lengthBufVoucherInfo = []byte{131}

func (t *VoucherInfo) MarshalCBOR(w io.Writer) error {
	if t == nil {
		_, err := w.Write(cbg.CborNull)
		return err
	}

	cw := cbg.NewCborWriter(w)

	if _, err := cw.Write(lengthBufVoucherInfo); err != nil {
		return err
	}

	// t.Voucher (paych.SignedVoucher) (struct)
	if err := t.Voucher.MarshalCBOR(cw); err != nil {
		return err
	}

	// t.Proof ([]uint8) (slice)
	if len(t.Proof) > cbg.ByteArrayMaxLen {
		return xerrors.Errorf("Byte array in field t.Proof was too long")
	}

	if err := cw.WriteMajorTypeHeader(cbg.MajByteString, uint64(len(t.Proof))); err != nil {
		return err
	}

	if _, err := cw.Write(t.Proof[:]); err != nil {
		return err
	}

	// t.Submitted (bool) (bool)
	if err := cbg.WriteBool(w, t.Submitted); err != nil {
		return err
	}
	return nil
}

func (t *VoucherInfo) UnmarshalCBOR(r io.Reader) (err error) {
	*t = VoucherInfo{}

	cr := cbg.NewCborReader(r)

	maj, extra, err := cr.ReadHeader()
	if err != nil {
		return err
	}
	defer func() {
		if err == io.EOF {
			err = io.ErrUnexpectedEOF
		}
	}()

	if maj != cbg.MajArray {
		return fmt.Errorf("cbor input should be of type array")
	}

	if extra != 3 {
		return fmt.Errorf("cbor input had wrong number of fields")
	}

	// t.Voucher (paych.SignedVoucher) (struct)

	{

		b, err := cr.ReadByte()
		if err != nil {
			return err
		}
		if b != cbg.CborNull[0] {
			if err := cr.UnreadByte(); err != nil {
				return err
			}
			t.Voucher = new(paych.SignedVoucher)
			if err := t.Voucher.UnmarshalCBOR(cr); err != nil {
				return xerrors.Errorf("unmarshaling t.Voucher pointer: %w", err)
			}
		}

	}
	// t.Proof ([]uint8) (slice)

	maj, extra, err = cr.ReadHeader()
	if err != nil {
		return err
	}

	if extra > cbg.ByteArrayMaxLen {
		return fmt.Errorf("t.Proof: byte array too large (%d)", extra)
	}
	if maj != cbg.MajByteString {
		return fmt.Errorf("expected byte array")
	}

	if extra > 0 {
		t.Proof = make([]uint8, extra)
	}

	if _, err := io.ReadFull(cr, t.Proof[:]); err != nil {
		return err
	}
	// t.Submitted (bool) (bool)

	maj, extra, err = cr.ReadHeader()
	if err != nil {
		return err
	}
	if maj != cbg.MajOther {
		return fmt.Errorf("booleans must be major type 7")
	}
	switch extra {
	case 20:
		t.Submitted = false
	case 21:
		t.Submitted = true
	default:
		return fmt.Errorf("booleans are either major type 7, value 20 or 21 (got %d)", extra)
	}
	return nil
}

var lengthBufMinerDeal = []byte{151}

func (t *MinerDeal) MarshalCBOR(w io.Writer) error {
	if t == nil {
		_, err := w.Write(cbg.CborNull)
		return err
	}

	cw := cbg.NewCborWriter(w)

	if _, err := cw.Write(lengthBufMinerDeal); err != nil {
		return err
	}

	// t.ClientDealProposal (market.ClientDealProposal) (struct)
	if err := t.ClientDealProposal.MarshalCBOR(cw); err != nil {
		return err
	}

	// t.ProposalCid (cid.Cid) (struct)

	if err := cbg.WriteCid(cw, t.ProposalCid); err != nil {
		return xerrors.Errorf("failed to write cid field t.ProposalCid: %w", err)
	}

	// t.AddFundsCid (cid.Cid) (struct)

	if t.AddFundsCid == nil {
		if _, err := cw.Write(cbg.CborNull); err != nil {
			return err
		}
	} else {
		if err := cbg.WriteCid(cw, *t.AddFundsCid); err != nil {
			return xerrors.Errorf("failed to write cid field t.AddFundsCid: %w", err)
		}
	}

	// t.PublishCid (cid.Cid) (struct)

	if t.PublishCid == nil {
		if _, err := cw.Write(cbg.CborNull); err != nil {
			return err
		}
	} else {
		if err := cbg.WriteCid(cw, *t.PublishCid); err != nil {
			return xerrors.Errorf("failed to write cid field t.PublishCid: %w", err)
		}
	}

	// t.Miner (peer.ID) (string)
	if len(t.Miner) > cbg.MaxLength {
		return xerrors.Errorf("Value in field t.Miner was too long")
	}

	if err := cw.WriteMajorTypeHeader(cbg.MajTextString, uint64(len(t.Miner))); err != nil {
		return err
	}
	if _, err := io.WriteString(w, string(t.Miner)); err != nil {
		return err
	}

	// t.Client (peer.ID) (string)
	if len(t.Client) > cbg.MaxLength {
		return xerrors.Errorf("Value in field t.Client was too long")
	}

	if err := cw.WriteMajorTypeHeader(cbg.MajTextString, uint64(len(t.Client))); err != nil {
		return err
	}
	if _, err := io.WriteString(w, string(t.Client)); err != nil {
		return err
	}

	// t.State (uint64) (uint64)

	if err := cw.WriteMajorTypeHeader(cbg.MajUnsignedInt, uint64(t.State)); err != nil {
		return err
	}

	// t.PiecePath (filestore.Path) (string)
	if len(t.PiecePath) > cbg.MaxLength {
		return xerrors.Errorf("Value in field t.PiecePath was too long")
	}

	if err := cw.WriteMajorTypeHeader(cbg.MajTextString, uint64(len(t.PiecePath))); err != nil {
		return err
	}
	if _, err := io.WriteString(w, string(t.PiecePath)); err != nil {
		return err
	}

	// t.PayloadSize (uint64) (uint64)

	if err := cw.WriteMajorTypeHeader(cbg.MajUnsignedInt, uint64(t.PayloadSize)); err != nil {
		return err
	}

	// t.MetadataPath (filestore.Path) (string)
	if len(t.MetadataPath) > cbg.MaxLength {
		return xerrors.Errorf("Value in field t.MetadataPath was too long")
	}

	if err := cw.WriteMajorTypeHeader(cbg.MajTextString, uint64(len(t.MetadataPath))); err != nil {
		return err
	}
	if _, err := io.WriteString(w, string(t.MetadataPath)); err != nil {
		return err
	}

	// t.SlashEpoch (abi.ChainEpoch) (int64)
	if t.SlashEpoch >= 0 {
		if err := cw.WriteMajorTypeHeader(cbg.MajUnsignedInt, uint64(t.SlashEpoch)); err != nil {
			return err
		}
	} else {
		if err := cw.WriteMajorTypeHeader(cbg.MajNegativeInt, uint64(-t.SlashEpoch-1)); err != nil {
			return err
		}
	}

	// t.FastRetrieval (bool) (bool)
	if err := cbg.WriteBool(w, t.FastRetrieval); err != nil {
		return err
	}

	// t.Message (string) (string)
	if len(t.Message) > cbg.MaxLength {
		return xerrors.Errorf("Value in field t.Message was too long")
	}

	if err := cw.WriteMajorTypeHeader(cbg.MajTextString, uint64(len(t.Message))); err != nil {
		return err
	}
	if _, err := io.WriteString(w, string(t.Message)); err != nil {
		return err
	}

	// t.FundsReserved (big.Int) (struct)
	if err := t.FundsReserved.MarshalCBOR(cw); err != nil {
		return err
	}

	// t.Ref (storagemarket.DataRef) (struct)
	if err := t.Ref.MarshalCBOR(cw); err != nil {
		return err
	}

	// t.AvailableForRetrieval (bool) (bool)
	if err := cbg.WriteBool(w, t.AvailableForRetrieval); err != nil {
		return err
	}

	// t.DealID (abi.DealID) (uint64)

	if err := cw.WriteMajorTypeHeader(cbg.MajUnsignedInt, uint64(t.DealID)); err != nil {
		return err
	}

	// t.CreationTime (typegen.CborTime) (struct)
	if err := t.CreationTime.MarshalCBOR(cw); err != nil {
		return err
	}

	// t.TransferChannelID (datatransfer.ChannelID) (struct)
	if err := t.TransferChannelID.MarshalCBOR(cw); err != nil {
		return err
	}

	// t.SectorNumber (abi.SectorNumber) (uint64)

	if err := cw.WriteMajorTypeHeader(cbg.MajUnsignedInt, uint64(t.SectorNumber)); err != nil {
		return err
	}

	// t.Offset (abi.PaddedPieceSize) (uint64)

	if err := cw.WriteMajorTypeHeader(cbg.MajUnsignedInt, uint64(t.Offset)); err != nil {
		return err
	}

	// t.PieceStatus (market.PieceStatus) (string)
	if len(t.PieceStatus) > cbg.MaxLength {
		return xerrors.Errorf("Value in field t.PieceStatus was too long")
	}

	if err := cw.WriteMajorTypeHeader(cbg.MajTextString, uint64(len(t.PieceStatus))); err != nil {
		return err
	}
	if _, err := io.WriteString(w, string(t.PieceStatus)); err != nil {
		return err
	}

	// t.InboundCAR (string) (string)
	if len(t.InboundCAR) > cbg.MaxLength {
		return xerrors.Errorf("Value in field t.InboundCAR was too long")
	}

	if err := cw.WriteMajorTypeHeader(cbg.MajTextString, uint64(len(t.InboundCAR))); err != nil {
		return err
	}
	if _, err := io.WriteString(w, string(t.InboundCAR)); err != nil {
		return err
	}
	return nil
}

func (t *MinerDeal) UnmarshalCBOR(r io.Reader) (err error) {
	*t = MinerDeal{}

	cr := cbg.NewCborReader(r)

	maj, extra, err := cr.ReadHeader()
	if err != nil {
		return err
	}
	defer func() {
		if err == io.EOF {
			err = io.ErrUnexpectedEOF
		}
	}()

	if maj != cbg.MajArray {
		return fmt.Errorf("cbor input should be of type array")
	}

	if extra != 23 {
		return fmt.Errorf("cbor input had wrong number of fields")
	}

	// t.ClientDealProposal (market.ClientDealProposal) (struct)

	{

		if err := t.ClientDealProposal.UnmarshalCBOR(cr); err != nil {
			return xerrors.Errorf("unmarshaling t.ClientDealProposal: %w", err)
		}

	}
	// t.ProposalCid (cid.Cid) (struct)

	{

		c, err := cbg.ReadCid(cr)
		if err != nil {
			return xerrors.Errorf("failed to read cid field t.ProposalCid: %w", err)
		}

		t.ProposalCid = c

	}
	// t.AddFundsCid (cid.Cid) (struct)

	{

		b, err := cr.ReadByte()
		if err != nil {
			return err
		}
		if b != cbg.CborNull[0] {
			if err := cr.UnreadByte(); err != nil {
				return err
			}

			c, err := cbg.ReadCid(cr)
			if err != nil {
				return xerrors.Errorf("failed to read cid field t.AddFundsCid: %w", err)
			}

			t.AddFundsCid = &c
		}

	}
	// t.PublishCid (cid.Cid) (struct)

	{

		b, err := cr.ReadByte()
		if err != nil {
			return err
		}
		if b != cbg.CborNull[0] {
			if err := cr.UnreadByte(); err != nil {
				return err
			}

			c, err := cbg.ReadCid(cr)
			if err != nil {
				return xerrors.Errorf("failed to read cid field t.PublishCid: %w", err)
			}

			t.PublishCid = &c
		}

	}
	// t.Miner (peer.ID) (string)

	{
		sval, err := cbg.ReadString(cr)
		if err != nil {
			return err
		}

		t.Miner = peer.ID(sval)
	}
	// t.Client (peer.ID) (string)

	{
		sval, err := cbg.ReadString(cr)
		if err != nil {
			return err
		}

		t.Client = peer.ID(sval)
	}
	// t.State (uint64) (uint64)

	{

		maj, extra, err = cr.ReadHeader()
		if err != nil {
			return err
		}
		if maj != cbg.MajUnsignedInt {
			return fmt.Errorf("wrong type for uint64 field")
		}
		t.State = uint64(extra)

	}
	// t.PiecePath (filestore.Path) (string)

	{
		sval, err := cbg.ReadString(cr)
		if err != nil {
			return err
		}

		t.PiecePath = filestore.Path(sval)
	}
	// t.PayloadSize (uint64) (uint64)

	{

		maj, extra, err = cr.ReadHeader()
		if err != nil {
			return err
		}
		if maj != cbg.MajUnsignedInt {
			return fmt.Errorf("wrong type for uint64 field")
		}
		t.PayloadSize = uint64(extra)

	}
	// t.MetadataPath (filestore.Path) (string)

	{
		sval, err := cbg.ReadString(cr)
		if err != nil {
			return err
		}

		t.MetadataPath = filestore.Path(sval)
	}
	// t.SlashEpoch (abi.ChainEpoch) (int64)
	{
		maj, extra, err := cr.ReadHeader()
		var extraI int64
		if err != nil {
			return err
		}
		switch maj {
		case cbg.MajUnsignedInt:
			extraI = int64(extra)
			if extraI < 0 {
				return fmt.Errorf("int64 positive overflow")
			}
		case cbg.MajNegativeInt:
			extraI = int64(extra)
			if extraI < 0 {
				return fmt.Errorf("int64 negative oveflow")
			}
			extraI = -1 - extraI
		default:
			return fmt.Errorf("wrong type for int64 field: %d", maj)
		}

		t.SlashEpoch = abi.ChainEpoch(extraI)
	}
	// t.FastRetrieval (bool) (bool)

	maj, extra, err = cr.ReadHeader()
	if err != nil {
		return err
	}
	if maj != cbg.MajOther {
		return fmt.Errorf("booleans must be major type 7")
	}
	switch extra {
	case 20:
		t.FastRetrieval = false
	case 21:
		t.FastRetrieval = true
	default:
		return fmt.Errorf("booleans are either major type 7, value 20 or 21 (got %d)", extra)
	}
	// t.Message (string) (string)

	{
		sval, err := cbg.ReadString(cr)
		if err != nil {
			return err
		}

		t.Message = string(sval)
	}
	// t.FundsReserved (big.Int) (struct)

	{

		if err := t.FundsReserved.UnmarshalCBOR(cr); err != nil {
			return xerrors.Errorf("unmarshaling t.FundsReserved: %w", err)
		}

	}
	// t.Ref (storagemarket.DataRef) (struct)

	{

		b, err := cr.ReadByte()
		if err != nil {
			return err
		}
		if b != cbg.CborNull[0] {
			if err := cr.UnreadByte(); err != nil {
				return err
			}
			t.Ref = new(storagemarket.DataRef)
			if err := t.Ref.UnmarshalCBOR(cr); err != nil {
				return xerrors.Errorf("unmarshaling t.Ref pointer: %w", err)
			}
		}

	}
	// t.AvailableForRetrieval (bool) (bool)

	maj, extra, err = cr.ReadHeader()
	if err != nil {
		return err
	}
	if maj != cbg.MajOther {
		return fmt.Errorf("booleans must be major type 7")
	}
	switch extra {
	case 20:
		t.AvailableForRetrieval = false
	case 21:
		t.AvailableForRetrieval = true
	default:
		return fmt.Errorf("booleans are either major type 7, value 20 or 21 (got %d)", extra)
	}
	// t.DealID (abi.DealID) (uint64)

	{

		maj, extra, err = cr.ReadHeader()
		if err != nil {
			return err
		}
		if maj != cbg.MajUnsignedInt {
			return fmt.Errorf("wrong type for uint64 field")
		}
		t.DealID = abi.DealID(extra)

	}
	// t.CreationTime (typegen.CborTime) (struct)

	{

		if err := t.CreationTime.UnmarshalCBOR(cr); err != nil {
			return xerrors.Errorf("unmarshaling t.CreationTime: %w", err)
		}

	}
	// t.TransferChannelID (datatransfer.ChannelID) (struct)

	{

		b, err := cr.ReadByte()
		if err != nil {
			return err
		}
		if b != cbg.CborNull[0] {
			if err := cr.UnreadByte(); err != nil {
				return err
			}
			t.TransferChannelID = new(datatransfer.ChannelID)
			if err := t.TransferChannelID.UnmarshalCBOR(cr); err != nil {
				return xerrors.Errorf("unmarshaling t.TransferChannelID pointer: %w", err)
			}
		}

	}
	// t.SectorNumber (abi.SectorNumber) (uint64)

	{

		maj, extra, err = cr.ReadHeader()
		if err != nil {
			return err
		}
		if maj != cbg.MajUnsignedInt {
			return fmt.Errorf("wrong type for uint64 field")
		}
		t.SectorNumber = abi.SectorNumber(extra)

	}
	// t.Offset (abi.PaddedPieceSize) (uint64)

	{

		maj, extra, err = cr.ReadHeader()
		if err != nil {
			return err
		}
		if maj != cbg.MajUnsignedInt {
			return fmt.Errorf("wrong type for uint64 field")
		}
		t.Offset = abi.PaddedPieceSize(extra)

	}
	// t.PieceStatus (market.PieceStatus) (string)

	{
		sval, err := cbg.ReadString(cr)
		if err != nil {
			return err
		}

		t.PieceStatus = PieceStatus(sval)
	}
	// t.InboundCAR (string) (string)

	{
		sval, err := cbg.ReadString(cr)
		if err != nil {
			return err
		}

		t.InboundCAR = string(sval)
	}
	return nil
}

var lengthBufRetrievalAsk = []byte{133}

func (t *RetrievalAsk) MarshalCBOR(w io.Writer) error {
	if t == nil {
		_, err := w.Write(cbg.CborNull)
		return err
	}

	cw := cbg.NewCborWriter(w)

	if _, err := cw.Write(lengthBufRetrievalAsk); err != nil {
		return err
	}

	// t.Miner (address.Address) (struct)
	if err := t.Miner.MarshalCBOR(cw); err != nil {
		return err
	}

	// t.PricePerByte (big.Int) (struct)
	if err := t.PricePerByte.MarshalCBOR(cw); err != nil {
		return err
	}

	// t.UnsealPrice (big.Int) (struct)
	if err := t.UnsealPrice.MarshalCBOR(cw); err != nil {
		return err
	}

	// t.PaymentInterval (uint64) (uint64)

	if err := cw.WriteMajorTypeHeader(cbg.MajUnsignedInt, uint64(t.PaymentInterval)); err != nil {
		return err
	}

	// t.PaymentIntervalIncrease (uint64) (uint64)

	if err := cw.WriteMajorTypeHeader(cbg.MajUnsignedInt, uint64(t.PaymentIntervalIncrease)); err != nil {
		return err
	}

	return nil
}

func (t *RetrievalAsk) UnmarshalCBOR(r io.Reader) (err error) {
	*t = RetrievalAsk{}

	cr := cbg.NewCborReader(r)

	maj, extra, err := cr.ReadHeader()
	if err != nil {
		return err
	}
	defer func() {
		if err == io.EOF {
			err = io.ErrUnexpectedEOF
		}
	}()

	if maj != cbg.MajArray {
		return fmt.Errorf("cbor input should be of type array")
	}

	if extra != 5 {
		return fmt.Errorf("cbor input had wrong number of fields")
	}

	// t.Miner (address.Address) (struct)

	{

		if err := t.Miner.UnmarshalCBOR(cr); err != nil {
			return xerrors.Errorf("unmarshaling t.Miner: %w", err)
		}

	}
	// t.PricePerByte (big.Int) (struct)

	{

		if err := t.PricePerByte.UnmarshalCBOR(cr); err != nil {
			return xerrors.Errorf("unmarshaling t.PricePerByte: %w", err)
		}

	}
	// t.UnsealPrice (big.Int) (struct)

	{

		if err := t.UnsealPrice.UnmarshalCBOR(cr); err != nil {
			return xerrors.Errorf("unmarshaling t.UnsealPrice: %w", err)
		}

	}
	// t.PaymentInterval (uint64) (uint64)

	{

		maj, extra, err = cr.ReadHeader()
		if err != nil {
			return err
		}
		if maj != cbg.MajUnsignedInt {
			return fmt.Errorf("wrong type for uint64 field")
		}
		t.PaymentInterval = uint64(extra)

	}
	// t.PaymentIntervalIncrease (uint64) (uint64)

	{

		maj, extra, err = cr.ReadHeader()
		if err != nil {
			return err
		}
		if maj != cbg.MajUnsignedInt {
			return fmt.Errorf("wrong type for uint64 field")
		}
		t.PaymentIntervalIncrease = uint64(extra)

	}
	return nil
}

var lengthBufProviderDealState = []byte{139}

func (t *ProviderDealState) MarshalCBOR(w io.Writer) error {
	if t == nil {
		_, err := w.Write(cbg.CborNull)
		return err
	}

	cw := cbg.NewCborWriter(w)

	if _, err := cw.Write(lengthBufProviderDealState); err != nil {
		return err
	}

	// t.DealProposal (retrievalmarket.DealProposal) (struct)
	if err := t.DealProposal.MarshalCBOR(cw); err != nil {
		return err
	}

	// t.StoreID (uint64) (uint64)

	if err := cw.WriteMajorTypeHeader(cbg.MajUnsignedInt, uint64(t.StoreID)); err != nil {
		return err
	}

	// t.SelStorageProposalCid (cid.Cid) (struct)

	if err := cbg.WriteCid(cw, t.SelStorageProposalCid); err != nil {
		return xerrors.Errorf("failed to write cid field t.SelStorageProposalCid: %w", err)
	}

	// t.ChannelID (datatransfer.ChannelID) (struct)
	if err := t.ChannelID.MarshalCBOR(cw); err != nil {
		return err
	}

	// t.Status (retrievalmarket.DealStatus) (uint64)

	if err := cw.WriteMajorTypeHeader(cbg.MajUnsignedInt, uint64(t.Status)); err != nil {
		return err
	}

	// t.Receiver (peer.ID) (string)
	if len(t.Receiver) > cbg.MaxLength {
		return xerrors.Errorf("Value in field t.Receiver was too long")
	}

	if err := cw.WriteMajorTypeHeader(cbg.MajTextString, uint64(len(t.Receiver))); err != nil {
		return err
	}
	if _, err := io.WriteString(w, string(t.Receiver)); err != nil {
		return err
	}

	// t.TotalSent (uint64) (uint64)

	if err := cw.WriteMajorTypeHeader(cbg.MajUnsignedInt, uint64(t.TotalSent)); err != nil {
		return err
	}

	// t.FundsReceived (big.Int) (struct)
	if err := t.FundsReceived.MarshalCBOR(cw); err != nil {
		return err
	}

	// t.Message (string) (string)
	if len(t.Message) > cbg.MaxLength {
		return xerrors.Errorf("Value in field t.Message was too long")
	}

	if err := cw.WriteMajorTypeHeader(cbg.MajTextString, uint64(len(t.Message))); err != nil {
		return err
	}
	if _, err := io.WriteString(w, string(t.Message)); err != nil {
		return err
	}

	// t.CurrentInterval (uint64) (uint64)

	if err := cw.WriteMajorTypeHeader(cbg.MajUnsignedInt, uint64(t.CurrentInterval)); err != nil {
		return err
	}

	// t.LegacyProtocol (bool) (bool)
	if err := cbg.WriteBool(w, t.LegacyProtocol); err != nil {
		return err
	}
	return nil
}

func (t *ProviderDealState) UnmarshalCBOR(r io.Reader) (err error) {
	*t = ProviderDealState{}

	cr := cbg.NewCborReader(r)

	maj, extra, err := cr.ReadHeader()
	if err != nil {
		return err
	}
	defer func() {
		if err == io.EOF {
			err = io.ErrUnexpectedEOF
		}
	}()

	if maj != cbg.MajArray {
		return fmt.Errorf("cbor input should be of type array")
	}

	if extra != 11 {
		return fmt.Errorf("cbor input had wrong number of fields")
	}

	// t.DealProposal (retrievalmarket.DealProposal) (struct)

	{

		if err := t.DealProposal.UnmarshalCBOR(cr); err != nil {
			return xerrors.Errorf("unmarshaling t.DealProposal: %w", err)
		}

	}
	// t.StoreID (uint64) (uint64)

	{

		maj, extra, err = cr.ReadHeader()
		if err != nil {
			return err
		}
		if maj != cbg.MajUnsignedInt {
			return fmt.Errorf("wrong type for uint64 field")
		}
		t.StoreID = uint64(extra)

	}
	// t.SelStorageProposalCid (cid.Cid) (struct)

	{

		c, err := cbg.ReadCid(cr)
		if err != nil {
			return xerrors.Errorf("failed to read cid field t.SelStorageProposalCid: %w", err)
		}

		t.SelStorageProposalCid = c

	}
	// t.ChannelID (datatransfer.ChannelID) (struct)

	{

		b, err := cr.ReadByte()
		if err != nil {
			return err
		}
		if b != cbg.CborNull[0] {
			if err := cr.UnreadByte(); err != nil {
				return err
			}
			t.ChannelID = new(datatransfer.ChannelID)
			if err := t.ChannelID.UnmarshalCBOR(cr); err != nil {
				return xerrors.Errorf("unmarshaling t.ChannelID pointer: %w", err)
			}
		}

	}
	// t.Status (retrievalmarket.DealStatus) (uint64)

	{

		maj, extra, err = cr.ReadHeader()
		if err != nil {
			return err
		}
		if maj != cbg.MajUnsignedInt {
			return fmt.Errorf("wrong type for uint64 field")
		}
		t.Status = retrievalmarket.DealStatus(extra)

	}
	// t.Receiver (peer.ID) (string)

	{
		sval, err := cbg.ReadString(cr)
		if err != nil {
			return err
		}

		t.Receiver = peer.ID(sval)
	}
	// t.TotalSent (uint64) (uint64)

	{

		maj, extra, err = cr.ReadHeader()
		if err != nil {
			return err
		}
		if maj != cbg.MajUnsignedInt {
			return fmt.Errorf("wrong type for uint64 field")
		}
		t.TotalSent = uint64(extra)

	}
	// t.FundsReceived (big.Int) (struct)

	{

		if err := t.FundsReceived.UnmarshalCBOR(cr); err != nil {
			return xerrors.Errorf("unmarshaling t.FundsReceived: %w", err)
		}

	}
	// t.Message (string) (string)

	{
		sval, err := cbg.ReadString(cr)
		if err != nil {
			return err
		}

		t.Message = string(sval)
	}
	// t.CurrentInterval (uint64) (uint64)

	{

		maj, extra, err = cr.ReadHeader()
		if err != nil {
			return err
		}
		if maj != cbg.MajUnsignedInt {
			return fmt.Errorf("wrong type for uint64 field")
		}
		t.CurrentInterval = uint64(extra)

	}
	// t.LegacyProtocol (bool) (bool)

	maj, extra, err = cr.ReadHeader()
	if err != nil {
		return err
	}
	if maj != cbg.MajOther {
		return fmt.Errorf("booleans must be major type 7")
	}
	switch extra {
	case 20:
		t.LegacyProtocol = false
	case 21:
		t.LegacyProtocol = true
	default:
		return fmt.Errorf("booleans are either major type 7, value 20 or 21 (got %d)", extra)
	}
	return nil
}
