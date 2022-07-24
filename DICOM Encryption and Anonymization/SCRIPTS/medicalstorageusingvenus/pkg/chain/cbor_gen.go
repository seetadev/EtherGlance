// Code generated by github.com/whyrusleeping/cbor-gen. DO NOT EDIT.

package chain

import (
	"fmt"
	"io"
	"sort"

	cid "github.com/ipfs/go-cid"
	cbg "github.com/whyrusleeping/cbor-gen"
	xerrors "golang.org/x/xerrors"
)

var _ = xerrors.Errorf
var _ = cid.Undef
var _ = sort.Sort

var lengthBufTSState = []byte{130}

func (t *TSState) MarshalCBOR(w io.Writer) error {
	if t == nil {
		_, err := w.Write(cbg.CborNull)
		return err
	}
	if _, err := w.Write(lengthBufTSState); err != nil {
		return err
	}

	scratch := make([]byte, 9)

	// t.StateRoot (cid.Cid) (struct)

	if err := cbg.WriteCidBuf(scratch, w, t.StateRoot); err != nil {
		return xerrors.Errorf("failed to write cid field t.StateRoot: %w", err)
	}

	// t.Receipts (cid.Cid) (struct)

	if err := cbg.WriteCidBuf(scratch, w, t.Receipts); err != nil {
		return xerrors.Errorf("failed to write cid field t.Receipts: %w", err)
	}

	return nil
}

func (t *TSState) UnmarshalCBOR(r io.Reader) error {
	*t = TSState{}

	br := cbg.GetPeeker(r)
	scratch := make([]byte, 8)

	maj, extra, err := cbg.CborReadHeaderBuf(br, scratch)
	if err != nil {
		return err
	}
	if maj != cbg.MajArray {
		return fmt.Errorf("cbor input should be of type array")
	}

	if extra != 2 {
		return fmt.Errorf("cbor input had wrong number of fields")
	}

	// t.StateRoot (cid.Cid) (struct)

	{

		c, err := cbg.ReadCid(br)
		if err != nil {
			return xerrors.Errorf("failed to read cid field t.StateRoot: %w", err)
		}

		t.StateRoot = c

	}
	// t.Receipts (cid.Cid) (struct)

	{

		c, err := cbg.ReadCid(br)
		if err != nil {
			return xerrors.Errorf("failed to read cid field t.Receipts: %w", err)
		}

		t.Receipts = c

	}
	return nil
}
