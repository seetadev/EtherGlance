package testhelpers

import (
	"testing"

	"github.com/filecoin-project/venus/venus-shared/types"
	"github.com/stretchr/testify/require"
)

// RequireNewTipSet instantiates and returns a new tipset of the given blocks
// and requires that the setup validation succeed.
func RequireNewTipSet(t *testing.T, blks ...*types.BlockHeader) *types.TipSet {
	ts, err := types.NewTipSet(blks)
	require.NoError(t, err)
	return ts
}
